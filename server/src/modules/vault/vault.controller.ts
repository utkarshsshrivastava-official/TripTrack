import { Request, Response } from 'express';
import { DocumentModel } from '../../models/document.model';
import { isMongoConnected } from '../../shared/lib/mongodb';
import { parseTravelDocumentWithGemini } from './vault.service';
import { TRAVELLERS_CONFIG } from '../../shared/config/travellers.config';
import { uploadDocumentBuffer } from '../../shared/lib/cloudinary.service';
import { getIO, FAMILY_ROOM } from '../chat/socket.service';

// In-memory document storage fallback when MongoDB is running in offline mode
let memoryDocuments: any[] = [];

export async function uploadDocumentHandler(req: Request, res: Response): Promise<void> {
  try {
    const file = req.file;
    const title = req.body.title || file?.originalname || 'Uploaded Document';
    const passengerId = req.body.passengerId || TRAVELLERS_CONFIG[0].id;
    const category = req.body.category || 'YATRA_PASS';
    const docId = req.body.id || `doc-${Date.now()}`;

    let parsedData: any = {};
    let fileUrl = `/uploads/${file?.originalname || 'ticket.pdf'}`;

    // 1. Upload to Cloudinary if file buffer exists
    if (file && file.buffer) {
      try {
        const uploadRes = await uploadDocumentBuffer(
          file.buffer,
          file.mimetype || 'application/pdf',
          'vault',
          `${docId}-${Date.now()}`
        );
        fileUrl = uploadRes.url;
      } catch (cloudErr) {
        console.warn('⚠️ [Vault Upload] Cloudinary upload deferred/failed, using fallback:', cloudErr);
      }

      // 2. Run multimodal AI parser for travel extraction
      try {
        parsedData = await parseTravelDocumentWithGemini(
          file.buffer,
          file.mimetype,
          title
        );
      } catch (geminiErr) {
        console.warn('⚠️ [Vault Upload] Gemini optical parsing skipped:', geminiErr);
      }
    }

    // Merge any client-provided parsedData
    if (req.body.parsedData) {
      try {
        const clientParsed = typeof req.body.parsedData === 'string' 
          ? JSON.parse(req.body.parsedData) 
          : req.body.parsedData;
        parsedData = { ...clientParsed, ...parsedData };
      } catch (e) {
        // ignore parse error
      }
    }

    const docPayload = {
      id: docId,
      title,
      category,
      fileUrl,
      fileType: file?.mimetype || 'application/pdf',
      passengerId,
      parsedData,
      createdAt: new Date()
    };

    if (isMongoConnected()) {
      const saved = await DocumentModel.findOneAndUpdate(
        { id: docPayload.id },
        docPayload,
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );

      // Broadcast to all family devices via Socket.io
      const io = getIO();
      if (io) {
        io.to(FAMILY_ROOM).emit('receive_document', docPayload);
        console.log(`📂 [Socket.io Vault] Broadcasted receive_document: "${title}" to family room`);
      }

      res.json({
        success: true,
        mode: 'mongodb',
        document: saved
      });
      return;
    }

    // Memory fallback
    memoryDocuments.unshift(docPayload);

    // Broadcast to all family devices via Socket.io
    const io = getIO();
    if (io) {
      io.to(FAMILY_ROOM).emit('receive_document', docPayload);
    }

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

export async function deleteDocumentHandler(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;

    if (isMongoConnected()) {
      await DocumentModel.deleteOne({
        $or: [{ id }, { _id: id }]
      });
    }

    memoryDocuments = memoryDocuments.filter(d => d.id !== id && d._id?.toString() !== id);

    // Broadcast deletion to all family devices via Socket.io
    const io = getIO();
    if (io) {
      io.to(FAMILY_ROOM).emit('document_removed', { id });
      console.log(`🗑️ [Socket.io Vault] Broadcasted document_removed: ${id} to family room`);
    }

    res.json({
      success: true,
      message: 'Document deleted from vault'
    });
  } catch (err: any) {
    console.error('Failed to delete document', err);
    res.status(500).json({
      success: false,
      error: err.message || 'Failed to delete document'
    });
  }
}

