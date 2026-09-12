import { Request, Response } from 'express';
import { DocumentModel } from '../../models/document.model';
import { isMongoConnected } from '../../shared/lib/mongodb';
import { parseTravelDocumentWithGemini } from './vault.service';

// In-memory document storage fallback when MongoDB is running in offline mode
let memoryDocuments: any[] = [];

export async function uploadDocumentHandler(req: Request, res: Response): Promise<void> {
  try {
    const file = req.file;
    const title = req.body.title || file?.originalname || 'Uploaded Document';
    const passengerId = req.body.passengerId || 'traveller-utkarsh';
    const category = req.body.category || 'YATRA_PASS';

    let parsedData = {};

    // Run multimodal AI parser if file buffer exists
    if (file && file.buffer) {
      parsedData = await parseTravelDocumentWithGemini(
        file.buffer,
        file.mimetype,
        title
      );
    }

    const docPayload = {
      id: `doc-${Date.now()}`,
      title,
      category,
      fileUrl: `/uploads/${file?.originalname || 'ticket.pdf'}`,
      fileType: file?.mimetype || 'application/pdf',
      passengerId,
      parsedData,
      createdAt: new Date()
    };

    if (isMongoConnected()) {
      const saved = await DocumentModel.create(docPayload);
      res.json({
        success: true,
        mode: 'mongodb',
        document: saved
      });
      return;
    }

    // Memory fallback
    memoryDocuments.unshift(docPayload);
    res.json({
      success: true,
      mode: 'memory',
      document: docPayload
    });
  } catch (err: any) {
    console.error('Failed to upload and parse document', err);
    res.status(500).json({
      success: false,
      error: err.message || 'Document upload error'
    });
  }
}

export async function getDocumentsHandler(req: Request, res: Response): Promise<void> {
  try {
    const { passengerId } = req.query;

    if (isMongoConnected()) {
      const query = passengerId ? { passengerId } : {};
      const docs = await DocumentModel.find(query).sort({ createdAt: -1 });
      res.json({
        success: true,
        mode: 'mongodb',
        documents: docs
      });
      return;
    }

    let docs = [...memoryDocuments];
    if (passengerId) {
      docs = docs.filter(d => d.passengerId === passengerId);
    }

    res.json({
      success: true,
      mode: 'memory',
      documents: docs
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: err.message || 'Failed to fetch documents'
    });
  }
}

export async function getDocumentByIdHandler(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;

    if (isMongoConnected()) {
      const doc = await DocumentModel.findById(id);
      if (!doc) {
        res.status(404).json({ success: false, message: 'Document not found' });
        return;
      }
      res.json({ success: true, document: doc });
      return;
    }

    const doc = memoryDocuments.find(d => d.id === id);
    if (!doc) {
      res.status(404).json({ success: false, message: 'Document not found' });
      return;
    }

    res.json({ success: true, document: doc });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: err.message || 'Failed to get document'
    });
  }
}
