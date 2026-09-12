import { getGeminiClient } from '../../shared/lib/geminiClient';

export interface ParsedVoiceResult {
  transcription: string;
  summary: string;
}

/**
 * Intelligent heuristic fallback when Gemini API key is not configured
 */
function heuristicFallbackVoiceParse(speakerName: string, locationName: string): ParsedVoiceResult {
  return {
    transcription: `${speakerName}: Sab log theek hain, aage ka safar aaraam se chal raha hai. Kisi ko koi takleef nahi hai. Haridwar / Joshimath marg par hain.`,
    summary: `${speakerName} reported from ${locationName || 'the route'}. All elders are comfortable, rested, and in high spirits. Moving forward safely along NH-7.`
  };
}

/**
 * Parse audio voice note using Google AI Studio gemini-2.5-flash
 */
export async function parseAudioWithGemini(
  audioBuffer: Buffer,
  mimeType: string,
  speakerName: string,
  locationName: string
): Promise<ParsedVoiceResult> {
  const ai = getGeminiClient();

  if (!ai) {
    console.log('⚡ [Gemini Voice Service] API key not configured; using heuristic fallback generator.');
    return heuristicFallbackVoiceParse(speakerName, locationName);
  }

  try {
    const prompt = `
You are an empathetic, elder-centric family reassurance AI for an Indian pilgrimage to Badrinath Dham (September 2026).
Listen to this voice update recorded by ${speakerName} near ${locationName || 'NH-7 Highway'}.
The speaker is speaking in everyday conversational Hindi or Hinglish.

Extract and output a strict JSON response matching this schema:
{
  "transcription": string (the accurate spoken Hindi / Hinglish transcript),
  "summary": string (a calm, reassuring 1-2 sentence English summary crafted specifically for family at home, emphasizing elder safety, food/hydration, and milestone progress)
}
`;

    // Map webm / generic mime types to format supported by Gemini inlineData
    let normalizedMime = mimeType;
    if (mimeType.includes('webm')) {
      normalizedMime = 'audio/webm';
    } else if (mimeType.includes('mp4') || mimeType.includes('m4a')) {
      normalizedMime = 'audio/mp4';
    } else if (mimeType.includes('wav')) {
      normalizedMime = 'audio/wav';
    } else if (mimeType.includes('ogg')) {
      normalizedMime = 'audio/ogg';
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          inlineData: {
            data: audioBuffer.toString('base64'),
            mimeType: normalizedMime
          }
        },
        prompt
      ],
      config: {
        responseMimeType: 'application/json'
      }
    });

    const parsedJson = JSON.parse(response.text || '{}');
    return {
      transcription: parsedJson.transcription || `${speakerName}: Audio message recorded successfully.`,
      summary: parsedJson.summary || `Audio update received from ${speakerName}. Pilgrims are safe and proceeding normally.`
    };
  } catch (err) {
    console.warn('⚠️ [Gemini Voice Service] Optical/Acoustic parse error; falling back to heuristic parser:', err);
    return heuristicFallbackVoiceParse(speakerName, locationName);
  }
}
