import { useState, useEffect, useCallback } from 'react';
import { TripSegment, SegmentStatus, LogisticsInfo } from '../../../shared/types';
import {
  getSegmentsFromDexie,
  toggleCheckpointInDexie,
  updateSegmentStatusInDexie,
  updateLogisticsInDexie
} from '../services/itineraryStorage';

export function useItinerary() {
  const [segments, setSegments] = useState<TripSegment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeSegmentId, setActiveSegmentId] = useState<string>('seg-1');

  const loadSegments = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getSegmentsFromDexie();
      setSegments(data);
      
      // Auto-detect currently active or first non-completed segment
      const current = data.find(s => s.status === 'IN_TRANSIT') || data.find(s => s.status === 'UPCOMING') || data[0];
      if (current) {
        setActiveSegmentId(current.id);
      }
    } catch (err) {
      console.error('Failed to load segments', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSegments();
  }, [loadSegments]);

  const toggleCheckpoint = async (segmentId: string, checkpointId: string) => {
    // Optimistic UI update
    setSegments(prev => prev.map(seg => {
      if (seg.id !== segmentId) return seg;
      return {
        ...seg,
        checkpoints: seg.checkpoints.map(cp => {
          if (cp.id !== checkpointId) return cp;
          return { ...cp, done: !cp.done };
        })
      };
    }));

    // Dexie update & sync
    await toggleCheckpointInDexie(segmentId, checkpointId);
  };

  const setSegmentStatus = async (segmentId: string, status: SegmentStatus) => {
    setSegments(prev => prev.map(seg => {
      if (seg.id !== segmentId) return seg;
      return { ...seg, status };
    }));
    await updateSegmentStatusInDexie(segmentId, status);
  };

  const updateLogistics = async (segmentId: string, logisticsUpdate: Partial<LogisticsInfo>) => {
    setSegments(prev => prev.map(seg => {
      if (seg.id !== segmentId) return seg;
      return {
        ...seg,
        logistics: { ...seg.logistics, ...logisticsUpdate }
      };
    }));
    await updateLogisticsInDexie(segmentId, logisticsUpdate);
  };

  const activeSegment = segments.find(s => s.id === activeSegmentId) || segments[0];

  return {
    segments,
    loading,
    activeSegmentId,
    setActiveSegmentId,
    activeSegment,
    toggleCheckpoint,
    setSegmentStatus,
    updateLogistics,
    reload: loadSegments
  };
}
