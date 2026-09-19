import nodemailer from 'nodemailer';

export interface MilestoneNotification {
  landmarkName: string;
  time: string;
  duoOrPilgrim: string;
  notes?: string;
  nextMilestone?: string;
  altitudeMeters?: number;
}

export interface DeadZoneNotification {
  segmentTitle: string;
  enteredAt: string;
  expectedSilenceHours: number;
  expectedReconnectionPoint: string;
}

export interface SosNotification {
  triggeredBy: string;
  duoName: string;
  timestamp: string;
  latitude: number;
  longitude: number;
  batteryLevel?: number;
  seniorMedicalDossier?: string;
}

export interface ScheduledBriefing {
  id: string;
  phase: 'PRE_DEPARTURE' | 'DURING_TRIP';
  timeSlot: 'MORNING' | 'AFTERNOON' | 'EVENING' | 'NIGHT';
  dayTitle: string;
  dayTitleHindi?: string;
  scheduledFor: string;
  subject: string;
  subjectHindi?: string;
  highlights: string[];
  highlightsHindi?: string[];
  transitInfo: string;
  transitInfoHindi?: string;
  elderCareTip: string;
  elderCareTipHindi?: string;
  logisticsSummary: string;
  logisticsSummaryHindi?: string;
  checklistItems?: string[];
  checklistItemsHindi?: string[];
  sightseeingTips?: string[];
  sightseeingTipsHindi?: string[];
}

export interface WaypointArrival {
  id: string;
  name: string;
  arrivedAt: string;
  altitudeMeters: number;
  description: string;
  latitude: number;
  longitude: number;
  detectedVia: 'GPS_GEOFENCE' | 'MANUAL_CHECKPOINT';
  nextStop: string;
}

export interface DailyDigestData {
  dateStr: string;
  milestonesCovered: string[];
  eldersHealthSummary: string;
  photosCount: number;
  recentPhotoUrls?: string[];
  gullakSpentTodayINR: number;
  tomorrowPreview: string;
}

class EmailService {
  private transporter: any = null;
  private fallbackTransporter: any = null;
  private isConfigured = false;

  constructor() {
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_APP_PASSWORD;

    if (user && pass && user !== 'your-family-email@gmail.com' && pass !== 'your-16-char-app-password') {
      try {
        // Primary: Port 465 SSL with strict IPv4 (avoids cloud container ENETUNREACH IPv6)
        this.transporter = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 465,
          secure: true,
          auth: { user, pass },
          family: 4,
          connectionTimeout: 4000,
          greetingTimeout: 4000,
          socketTimeout: 4000
        } as any);

        // Fallback: Port 587 STARTTLS with strict IPv4
        this.fallbackTransporter = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 587,
          secure: false,
          auth: { user, pass },
          family: 4,
          connectionTimeout: 4000,
          greetingTimeout: 4000,
          socketTimeout: 4000
        } as any);

        this.isConfigured = true;
        console.log(`📧 [Nodemailer] Configured with Gmail SMTP (IPv4 forced, Dual Port 465/587) for: ${user}`);
      } catch (err) {
        console.warn('⚠️ [Nodemailer] Initialization failed, will use console simulation:', err);
      }
    } else {
      console.log('ℹ️ [Nodemailer] SMTP_USER or SMTP_APP_PASSWORD unset. Running in Safe Simulation Mode (payloads logged to console).');
    }

    if (process.env.BREVO_API_KEY) {
      console.log('⚡ [Brevo API] Configured with Brevo HTTPS REST API (Port 443) — Immune to cloud SMTP port blocking!');
    }
  }

  getProviderInfo() {
    if (process.env.BREVO_API_KEY) {
      return {
        type: 'BREVO_HTTPS',
        name: 'Brevo HTTPS (Port 443)',
        status: 'Active (100% cloud deliverability)'
      };
    }
    if (this.isConfigured) {
      return {
        type: 'GMAIL_SMTP',
        name: 'Gmail SMTP',
        status: 'Active (Port 465/587 - Local/Dedicated)'
      };
    }
    return {
      type: 'SIMULATION',
      name: 'Safe Console Simulation',
      status: 'Payloads logged to server console'
    };
  }

  getRecipients(): string[] {
    const raw = process.env.FAMILY_NOTIFICATION_EMAILS || '';
    const user = process.env.SMTP_USER || '';
    const set = new Set<string>();
    if (user && user.includes('@') && !user.includes('your-family-email')) set.add(user.trim());
    raw.split(',').forEach(e => {
      const trimmed = e.trim();
      if (trimmed && trimmed.includes('@')) set.add(trimmed);
    });
    return Array.from(set);
  }

  /**
   * Send via Brevo HTTPS REST API (Port 443)
   * Completely immune to Render's outbound SMTP port blocking.
   */
  async sendViaBrevo(
    subject: string, 
    htmlBody: string, 
    recipients: string[]
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const apiKey = process.env.BREVO_API_KEY?.replace(/['"\r\n\s]/g, '');
    if (!apiKey) return { success: false, error: 'BREVO_API_KEY not configured' };

    console.log(`📡 [Brevo HTTPS API] Attempting dispatch with key: ${apiKey.slice(0, 10)}... (length: ${apiKey.length})`);

    const senderEmail = process.env.SMTP_USER?.trim() || 'utkarshsofficial13@gmail.com';
    const senderName = 'TripTrack by Ut-tech';

    try {
      const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'api-key': apiKey,
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          sender: { name: senderName, email: senderEmail },
          to: recipients.map(email => ({ email: email.trim() })),
          subject,
          htmlContent: htmlBody
        })
      });

      const result: any = await response.json();

      if (response.ok && (result.messageId || result.messageIds)) {
        const id = result.messageId || (result.messageIds && result.messageIds[0]);
        console.log(`✅ [Brevo HTTPS API] Dispatched to ${recipients.join(', ')} (Msg ID: ${id})`);
        return { success: true, messageId: id };
      } else {
        const errMsg = result.message || result.error || JSON.stringify(result);
        console.warn(`⚠️ [Brevo HTTPS API] Error response (${response.status}): ${errMsg}`);
        return { success: false, error: errMsg };
      }
    } catch (err: any) {
      console.warn(`⚠️ [Brevo HTTPS API] Network error:`, err.message);
      return { success: false, error: err.message };
    }
  }

  /**
   * Send general HTML email with fallback
   */
  async sendEmail(subject: string, htmlBody: string, specificRecipients?: string[]): Promise<{ success: boolean; simulated?: boolean; messageId?: string; warning?: string }> {
    const recipients = specificRecipients && specificRecipients.length > 0 ? specificRecipients : this.getRecipients();

    if (recipients.length === 0) {
      console.warn('⚠️ [Email Service] No recipients configured.');
      return { success: false, warning: 'No family recipients configured.' };
    }

    // 1. Prioritize Brevo HTTPS API (Port 443) if configured
    if (process.env.BREVO_API_KEY) {
      const brevoRes = await this.sendViaBrevo(subject, htmlBody, recipients);
      if (brevoRes.success) {
        return { success: true, messageId: brevoRes.messageId };
      }
      console.warn('⚠️ [Email Service] Brevo HTTPS failed, falling back to secondary transport:', brevoRes.error);
    }

    // 2. Fall back to direct SMTP (works on localhost / non-blocked networks)
    if (this.isConfigured && this.transporter) {
      try {
        const sendPromise = this.transporter.sendMail({
          from: `"TripTrack by Ut-tech" <${process.env.SMTP_USER}>`,
          to: recipients,
          subject,
          html: htmlBody
        });

        // 6.0s timeout probe to allow TLS handshake on slower connections
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Direct SMTP probe timed out (outbound port blocked).')), 6000)
        );

        const info: any = await Promise.race([sendPromise, timeoutPromise]);
        console.log(`✅ [SMTP Service] Dispatched to ${recipients.join(', ')} (Msg ID: ${info.messageId})`);
        return { success: true, messageId: info.messageId };
      } catch (smtpErr: any) {
        console.warn('⚠️ [SMTP Service] Direct SMTP delayed/blocked:', smtpErr.message);
      }
    }

    // 3. Fall back to Safe Simulation Preview
    console.log('\n================== 📧 SIMULATED FAMILY EMAIL ==================');
    console.log(`To: ${recipients.join(', ')}`);
    console.log(`Subject: ${subject}`);
    console.log('--- HTML Preview ---');
    console.log(htmlBody.slice(0, 300) + '...\n===============================================================\n');
    return { 
      success: true, 
      simulated: true, 
      warning: process.env.BREVO_API_KEY 
        ? 'Brevo API call failed. Notification logged to cloud console.' 
        : 'Outbound SMTP ports blocked on Render free tier. Add BREVO_API_KEY in Render environment variables for 100% production delivery.'
    };
  }

  /**
   * Template 1: Milestone Checkpoint Crossed Reassurance (Bilingual English + Hindi)
   */
  async notifyMilestoneCrossed(data: MilestoneNotification) {
    const subject = `🏔️ [Badrinath 2026 / बद्रीनाथ यात्रा] Reached Safely / सकुशल पहुंचे: ${data.landmarkName} (${data.time})`;
    const html = `
      <div style="font-family: Arial, sans-serif; background-color: #1c1917; color: #f5f5f4; padding: 24px; border-radius: 16px; max-width: 600px; margin: 0 auto; border: 1px solid #d97706;">
        <div style="text-align: center; border-bottom: 1px solid #44403c; padding-bottom: 16px;">
          <h1 style="color: #f59e0b; margin: 0; font-size: 22px;">TripTrack Badrinath Dham 2026</h1>
          <p style="color: #fbbf24; font-size: 15px; margin: 4px 0 0 0; font-weight: bold;">श्री बद्रीनाथ धाम यात्रा • सकुशल पड़ाव सूचना</p>
          <p style="color: #a8a29e; font-size: 12px; margin: 4px 0 0 0;">In-Family Milestone Reassurance / परिजनों हेतु लाइव सूचना</p>
        </div>
        
        <div style="padding: 20px 0;">
          <div style="background-color: #292524; border-left: 4px solid #10b981; padding: 14px; border-radius: 8px; margin-bottom: 16px;">
            <h2 style="color: #10b981; margin: 0; font-size: 17px;">✅ Landmark Crossed Safely / पड़ाव सकुशल पार किया:</h2>
            <div style="color: #ffffff; font-size: 18px; font-weight: bold; margin-top: 4px;">${data.landmarkName}</div>
            <p style="color: #e7e5e4; margin: 8px 0 0 0; font-size: 13px;">
              <strong>🕒 Time / समय:</strong> ${data.time} | <strong>👤 Updated By / द्वारा:</strong> ${data.duoOrPilgrim}
            </p>
            ${data.altitudeMeters ? `<p style="color: #fbbf24; margin: 4px 0 0 0; font-size: 12px; font-family: monospace;">⛰️ Altitude / समुद्र तल से ऊंचाई: ~${data.altitudeMeters} meters (मीटर)</p>` : ''}
          </div>

          ${data.notes ? `<p style="color: #d6d3d1; font-size: 13px; background-color: #1c1917; padding: 12px; border: 1px solid #44403c; border-radius: 8px; line-height: 1.5;"><em>"${data.notes}"</em></p>` : ''}

          <div style="margin-top: 16px; padding: 14px; background-color: #064e3b; border: 1px solid #059669; border-radius: 8px;">
            <p style="color: #6ee7b7; margin: 0; font-size: 14px; font-weight: bold;">🩺 Elder Care & Health Update / वरिष्ठजनों का स्वास्थ्य:</p>
            <p style="color: #ecfdf5; margin: 4px 0 0 0; font-size: 13px; line-height: 1.5;">
              Elder comfort checks, warm water hydration, and BP medication schedules are actively maintained.<br/>
              <span style="color: #a7f3d0; font-size: 13px;">आदरणीय पिताजी (रजनीश जी) एवं चाचाजी (संजय जी) के स्वास्थ्य, गर्म पानी तथा समय पर दवाइयों का पूर्ण ध्यान रखा जा रहा है। सभी पूर्णतः स्वस्थ हैं।</span>
            </p>
          </div>

          <div style="margin-top: 14px; padding: 12px; background-color: #292524; border-radius: 8px;">
            <p style="color: #93c5fd; margin: 0; font-size: 13px;"><strong>📍 Next Target / अगला पड़ाव:</strong> ${data.nextMilestone || 'En route next ghat milestone / अगले पड़ाव की ओर अग्रसर'}</p>
          </div>
        </div>

        <div style="border-top: 1px solid #44403c; padding-top: 14px; text-align: center; color: #78716c; font-size: 11px;">
          Private family notification sent by TripTrack by Ut-tech • Badrinath Dham Sacred Yatra
        </div>
      </div>
    `;
    return this.sendEmail(subject, html);
  }

  /**
   * Template 2: Mountain Dead-Zone Entry Notice (Bilingual English + Hindi)
   */
  async notifyDeadZoneEntry(data: DeadZoneNotification) {
    const subject = `📡 [Topography Notice / नेटवर्क विहीन क्षेत्र] Entering Mountain Dead-Zone: ${data.segmentTitle}`;
    const html = `
      <div style="font-family: Arial, sans-serif; background-color: #1c1917; color: #f5f5f4; padding: 24px; border-radius: 16px; max-width: 600px; margin: 0 auto; border: 1px solid #3b82f6;">
        <div style="text-align: center; border-bottom: 1px solid #44403c; padding-bottom: 16px;">
          <h1 style="color: #60a5fa; margin: 0; font-size: 22px;">Alaknanda Gorge Cellular Shadow</h1>
          <p style="color: #93c5fd; font-size: 15px; margin: 4px 0 0 0; font-weight: bold;">अलकनंदा घाटी मोबाइल नेटवर्क छाया क्षेत्र</p>
          <p style="color: #a8a29e; font-size: 12px; margin: 4px 0 0 0;">Pre-Alert for Family at Home / घर पर परिजनों हेतु पूर्व सूचना</p>
        </div>
        
        <div style="padding: 20px 0;">
          <div style="background-color: #1e293b; border-left: 4px solid #3b82f6; padding: 14px; border-radius: 8px; margin-bottom: 16px;">
            <h3 style="color: #93c5fd; margin: 0; font-size: 15px;">📵 Cellular Disconnection Expected / मोबाइल नेटवर्क अस्थायी रूप से बंद रहेगा:</h3>
            <p style="color: #ffffff; font-weight: bold; margin: 6px 0 0 0; font-size: 16px;">${data.segmentTitle}</p>
            <p style="color: #cbd5e1; margin: 6px 0 0 0; font-size: 13px; line-height: 1.5;">
              The vehicle is currently travelling through deep Himalayan gorge sections on NH-7 where cellular towers are geographically shielded.<br/>
              <span style="color: #93c5fd; font-size: 13px;">गाड़ी इस समय हिमालय की गहरी घाटी (NH-7) से गुजर रही है जहाँ पहाड़ों के कारण मोबाइल नेटवर्क अस्थायी रूप से उपलब्ध नहीं रहेगा।</span>
            </p>
          </div>

          <div style="background-color: #292524; padding: 14px; border-radius: 8px; font-size: 13px; line-height: 1.6;">
            <p style="color: #fbbf24; margin: 0 0 8px 0; font-weight: bold; font-size: 14px;">
              Please Do Not Worry / कृपया बिल्कुल भी चिंता न करें:
            </p>
            <ul style="margin: 0; padding-left: 20px; color: #d6d3d1;">
              <li style="margin-bottom: 6px;">
                <strong>Expected Radio Silence / अनुमानित नेटवर्क बंद समय:</strong> ~${data.expectedSilenceHours} hours (घंटे)
              </li>
              <li style="margin-bottom: 6px;">
                <strong>Reconnection Landmark / नेटवर्क पुनः मिलने का स्थान:</strong> ${data.expectedReconnectionPoint}
              </li>
              <li>
                All offline passes, medical emergency contacts, and maps are saved directly in the pilgrims' phones.<br/>
                <span style="color: #a8a29e; font-size: 12px;">सभी जरूरी यात्रा पास, टिकट, रूट मैप तथा आपातकालीन संपर्क तीर्थयात्रियों के फोन में ऑफलाइन सुरक्षित हैं।</span>
              </li>
            </ul>
          </div>
        </div>

        <div style="border-top: 1px solid #44403c; padding-top: 14px; text-align: center; color: #78716c; font-size: 11px;">
          TripTrack Cellular Shadow Guard Heuristic • Automatic Pilgrimage Telemetry
        </div>
      </div>
    `;
    return this.sendEmail(subject, html);
  }

  /**
   * Template 3: Emergency SOS & Critical Alert (Bilingual English + Hindi)
   */
  async notifyEmergencySos(data: SosNotification) {
    const subject = `🚨 [URGENT SOS ALERT / आपातकालीन संदेश] Emergency Beacon Triggered by ${data.triggeredBy}`;
    const mapsLink = `https://www.google.com/maps?q=${data.latitude},${data.longitude}`;
    const html = `
      <div style="font-family: Arial, sans-serif; background-color: #450a0a; color: #fef2f2; padding: 24px; border-radius: 16px; max-width: 600px; margin: 0 auto; border: 2px solid #ef4444;">
        <div style="text-align: center; border-bottom: 1px solid #7f1d1d; padding-bottom: 16px;">
          <h1 style="color: #f87171; margin: 0; font-size: 24px;">🚨 PILGRIM SOS DISPATCH</h1>
          <p style="color: #fca5a5; font-size: 16px; margin: 4px 0 0 0; font-weight: bold;">आपातकालीन सहायता सूचना • परिजनों का तत्काल ध्यान अपेक्षित</p>
        </div>
        
        <div style="padding: 20px 0;">
          <p style="font-size: 15px; margin-top: 0; line-height: 1.5;">
            An emergency beacon was initiated by <strong>${data.triggeredBy}</strong> (${data.duoName}) at <strong>${data.timestamp}</strong>.<br/>
            <span style="color: #fecaca; font-size: 14px;">तीर्थयात्री <strong>${data.triggeredBy}</strong> द्वारा आपातकालीन सहायता संकेत भेजा गया है।</span>
          </p>

          <div style="background-color: #1c1917; padding: 16px; border-radius: 8px; margin: 16px 0;">
            <p style="color: #fbbf24; margin: 0 0 8px 0; font-size: 14px; font-weight: bold;">
              📍 Last Known GPS Coordinates / अंतिम ज्ञात स्थान:
            </p>
            <p style="font-family: monospace; font-size: 15px; margin: 0; color: #67e8f9;">${data.latitude.toFixed(5)}, ${data.longitude.toFixed(5)}</p>
            <p style="margin: 10px 0 0 0;">
              <a href="${mapsLink}" style="display: inline-block; background-color: #ef4444; color: white; padding: 8px 16px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 13px;">
                Open in Google Maps / मैप में देखें
              </a>
            </p>
            ${data.batteryLevel ? `<p style="color: #a8a29e; font-size: 12px; margin: 10px 0 0 0;">Phone Battery / फोन बैटरी: ${data.batteryLevel}%</p>` : ''}
          </div>

          ${data.seniorMedicalDossier ? `
            <div style="background-color: #292524; padding: 12px; border-radius: 8px; font-size: 13px;">
              <strong style="color: #fca5a5;">Medical Dossier / चिकित्सा विवरण:</strong> ${data.seniorMedicalDossier}
            </div>
          ` : ''}
        </div>

        <div style="border-top: 1px solid #7f1d1d; padding-top: 14px; text-align: center; color: #fca5a5; font-size: 12px;">
          National Yatra Helpline: 1364 | Police Emergency: 112 | Ambulance: 108
        </div>
      </div>
    `;
    return this.sendEmail(subject, html);
  }

  /**
   * Template 4: Automated Scheduled Briefing (Pre-Departure & During-Trip) — Bilingual English + Hindi
   */
  async notifyScheduledBriefing(data: ScheduledBriefing) {
    const isPreDeparture = data.phase === 'PRE_DEPARTURE';
    
    // Determine icon, label & Hindi translation based on time slot
    let slotIcon = '🌅';
    let slotName = 'Morning';
    let slotNameHindi = 'प्रातःकालीन';
    let slotColor = '#f59e0b'; // amber
    if (data.timeSlot === 'AFTERNOON') {
      slotIcon = '☀️';
      slotName = 'Afternoon';
      slotNameHindi = 'दोपहर';
      slotColor = '#f97316'; // orange
    } else if (data.timeSlot === 'EVENING') {
      slotIcon = '🌇';
      slotName = 'Evening';
      slotNameHindi = 'सायंकालीन';
      slotColor = '#ec4899'; // pink
    } else if (data.timeSlot === 'NIGHT') {
      slotIcon = '🌙';
      slotName = 'Night';
      slotNameHindi = 'रात्रिकालीन';
      slotColor = '#8b5cf6'; // violet
    }

    const phaseTitle = isPreDeparture 
      ? '🎒 Pre-Departure / यात्रा पूर्व तैयारी' 
      : '🏔️ Pilgrimage Morning / दैनिक यात्रा बुलेटिन';

    const subject = `${slotIcon} [${isPreDeparture ? 'TripTrack Prep / पूर्व तैयारी' : 'Yatra Briefing / यात्रा बुलेटिन'}] ${data.dayTitle} — ${data.subject}`;

    const checklistHtml = (data.checklistItems && data.checklistItems.length > 0)
      ? `
        <div style="background-color: #0f172a; border: 1px solid #0284c7; padding: 14px; border-radius: 8px; margin-bottom: 16px;">
          <h3 style="color: #38bdf8; margin: 0 0 10px 0; font-size: 15px;">
            📋 Essential Checklist & Must-Haves / आवश्यक सामान एवं चेकलिस्ट:
          </h3>
          <ul style="margin: 0; padding-left: 18px; font-size: 13px; line-height: 1.6; color: #bae6fd;">
            ${data.checklistItems.map((item, idx) => {
              const itemHi = data.checklistItemsHindi && data.checklistItemsHindi[idx];
              return `
                <li style="margin-bottom: 8px;">
                  <strong style="color: #38bdf8;">✓</strong> <span style="font-weight: 600;">${item}</span>
                  ${itemHi ? `<div style="color: #7dd3fc; font-size: 12.5px; margin-left: 6px; margin-top: 2px;">• ${itemHi}</div>` : ''}
                </li>
              `;
            }).join('')}
          </ul>
        </div>
      `
      : '';

    const sightseeingHtml = (data.sightseeingTips && data.sightseeingTips.length > 0)
      ? `
        <div style="background-color: #2e1065; border: 1px solid #7c3aed; padding: 14px; border-radius: 8px; margin-bottom: 16px;">
          <h3 style="color: #c084fc; margin: 0 0 10px 0; font-size: 15px;">
            🕉️ Sightseeing, Temple & Scenic Guide / तीर्थ दर्शन एवं दर्शनीय स्थल:
          </h3>
          <ul style="margin: 0; padding-left: 18px; font-size: 13px; line-height: 1.6; color: #e9d5ff;">
            ${data.sightseeingTips.map((tip, idx) => {
              const tipHi = data.sightseeingTipsHindi && data.sightseeingTipsHindi[idx];
              return `
                <li style="margin-bottom: 8px;">
                  <strong style="color: #c084fc;">•</strong> <span style="font-weight: 600;">${tip}</span>
                  ${tipHi ? `<div style="color: #d8b4fe; font-size: 12.5px; margin-left: 6px; margin-top: 2px;">• ${tipHi}</div>` : ''}
                </li>
              `;
            }).join('')}
          </ul>
        </div>
      `
      : '';

    const highlightsHtml = data.highlights.map((h, idx) => {
      const hHi = data.highlightsHindi && data.highlightsHindi[idx];
      return `
        <li style="margin-bottom: 6px; color: #e7e5e4;">
          <span>${h}</span>
          ${hHi ? `<div style="color: #94a3b8; font-size: 12px; margin-top: 2px;">• ${hHi}</div>` : ''}
        </li>
      `;
    }).join('');

    const html = `
      <div style="font-family: Arial, sans-serif; background-color: #1c1917; color: #f5f5f4; padding: 24px; border-radius: 16px; max-width: 600px; margin: 0 auto; border: 1px solid ${slotColor};">
        <div style="text-align: center; border-bottom: 1px solid #44403c; padding-bottom: 16px;">
          <div style="display: inline-block; background-color: #292524; border: 1px solid #57534e; border-radius: 20px; padding: 4px 12px; font-size: 12px; color: ${slotColor}; font-weight: bold; margin-bottom: 8px;">
            ${phaseTitle} • ${slotIcon} ${slotName} Slot (${slotNameHindi})
          </div>
          <h1 style="color: #f5f5f4; margin: 0; font-size: 22px;">TripTrack Pilgrimage Guide</h1>
          <p style="color: #fbbf24; font-size: 16px; margin: 4px 0 0 0; font-weight: bold;">श्री बद्रीनाथ धाम यात्रा मार्गदर्शिका</p>
          <p style="color: #e2e8f0; font-size: 13px; margin: 6px 0 0 0; font-weight: 600;">
            ${data.dayTitle} ${data.dayTitleHindi ? `• ${data.dayTitleHindi}` : ''}
          </p>
        </div>
        
        <div style="padding: 20px 0;">
          <div style="background-color: #292524; border-left: 4px solid ${slotColor}; padding: 14px; border-radius: 8px; margin-bottom: 16px;">
            <h2 style="color: #fef08a; margin: 0; font-size: 16px;">📌 Core Focus / मुख्य उद्देश्य: ${data.subject}</h2>
            ${data.subjectHindi ? `<div style="color: #fde047; font-size: 15px; font-weight: bold; margin-top: 4px;">• ${data.subjectHindi}</div>` : ''}
            <p style="color: #d6d3d1; margin: 8px 0 0 0; font-size: 13px; line-height: 1.5;">${data.transitInfo}</p>
            ${data.transitInfoHindi ? `<p style="color: #cbd5e1; margin: 4px 0 0 0; font-size: 13px; line-height: 1.5;">${data.transitInfoHindi}</p>` : ''}
          </div>

          ${checklistHtml}

          ${sightseeingHtml}

          <div style="background-color: #1c1917; border: 1px solid #44403c; padding: 14px; border-radius: 8px; margin-bottom: 16px;">
            <h3 style="color: #38bdf8; margin: 0 0 10px 0; font-size: 15px;">⭐ Key Milestones & Timing / मुख्य पड़ाव एवं समय सारणी:</h3>
            <ul style="margin: 0; padding-left: 18px; font-size: 13px; line-height: 1.6;">
              ${highlightsHtml}
            </ul>
          </div>

          <div style="background-color: #052e16; border: 1px solid #166534; padding: 14px; border-radius: 8px; margin-bottom: 16px;">
            <h3 style="color: #4ade80; margin: 0 0 6px 0; font-size: 14px;">🩺 Elder Dignity & Health Protocol / वरिष्ठजनों हेतु स्वास्थ्य सुरक्षा एवं दिशानिर्देश:</h3>
            <p style="color: #dcfce7; margin: 0; font-size: 13px; line-height: 1.5;">${data.elderCareTip}</p>
            ${data.elderCareTipHindi ? `<p style="color: #bbf7d0; margin: 6px 0 0 0; font-size: 13px; line-height: 1.5; font-weight: 500;">${data.elderCareTipHindi}</p>` : ''}
          </div>

          <div style="background-color: #292524; padding: 12px; border-radius: 8px; font-size: 12px; color: #a8a29e;">
            <strong style="color: #f5f5f4;">Logistics Reference / लॉजिस्टिक्स संदर्भ:</strong> ${data.logisticsSummary}
            ${data.logisticsSummaryHindi ? `<br/><span style="color: #cbd5e1;">${data.logisticsSummaryHindi}</span>` : ''}
          </div>
        </div>

        <div style="border-top: 1px solid #44403c; padding-top: 14px; text-align: center; color: #78716c; font-size: 11px;">
          Automated Pilgrimage Dispatch • TripTrack by Ut-tech • Badrinath Dham 2026
        </div>
      </div>
    `;
    return this.sendEmail(subject, html);
  }

  /**
   * Template 5: Location-Based Geofence Waypoint Arrival Notice (Bilingual English + Hindi)
   */
  async notifyGeofenceArrival(data: WaypointArrival) {
    const subject = `📍 [Live Arrival / पड़ाव आगमन] Touched ${data.name} (${data.arrivedAt}) — All Pilgrims Safe (सभी सकुशल)`;
    const mapsLink = `https://www.google.com/maps?q=${data.latitude},${data.longitude}`;

    const html = `
      <div style="font-family: Arial, sans-serif; background-color: #1c1917; color: #f5f5f4; padding: 24px; border-radius: 16px; max-width: 600px; margin: 0 auto; border: 1px solid #10b981;">
        <div style="text-align: center; border-bottom: 1px solid #44403c; padding-bottom: 16px;">
          <h1 style="color: #10b981; margin: 0; font-size: 22px;">📍 Waypoint Reached Safely!</h1>
          <p style="color: #6ee7b7; font-size: 16px; margin: 4px 0 0 0; font-weight: bold;">पड़ाव पर सकुशल आगमन • ${data.name}</p>
        </div>
        
        <div style="padding: 20px 0;">
          <div style="background-color: #064e3b; border-left: 4px solid #10b981; padding: 14px; border-radius: 8px; margin-bottom: 16px;">
            <p style="color: #ecfdf5; margin: 0; font-size: 15px; font-weight: bold; line-height: 1.4;">
              All 4 travellers (Rajnish Ji, Sanjay Ji, Utkarsh & Shreyas) have arrived at ${data.name}.<br/>
              <span style="color: #a7f3d0; font-size: 14px;">सभी चारों तीर्थयात्री (आदरणीय रजनीश जी, संजय जी, उत्कर्ष एवं श्रेयस) सकुशल पहुँच चुके हैं।</span>
            </p>
            <div style="display: flex; gap: 12px; margin-top: 8px; font-size: 12px; color: #a7f3d0; font-family: monospace;">
              <span>🕒 Time / समय: ${data.arrivedAt}</span>
              <span>•</span>
              <span>⛰️ Altitude / ऊंचाई: ~${data.altitudeMeters}m</span>
              <span>•</span>
              <span>🛰️ Source: ${data.detectedVia === 'GPS_GEOFENCE' ? 'GPS Geofence' : 'Milestone Check'}</span>
            </div>
          </div>

          <p style="color: #d6d3d1; font-size: 13px; line-height: 1.6; background-color: #292524; padding: 12px; border-radius: 8px;">
            ${data.description}
          </p>

          <div style="margin-top: 16px; display: flex; align-items: center; justify-content: space-between; background-color: #1c1917; border: 1px solid #44403c; padding: 12px; border-radius: 8px;">
            <div style="font-size: 12px; color: #94a3b8;">
              <strong style="color: #f5f5f4;">Next Target / अगला पड़ाव:</strong> ${data.nextStop}
            </div>
            <a href="${mapsLink}" style="background-color: #047857; color: white; padding: 6px 12px; border-radius: 6px; text-decoration: none; font-size: 11px; font-weight: bold;">
              Live Pin / मैप
            </a>
          </div>
        </div>

        <div style="border-top: 1px solid #44403c; padding-top: 14px; text-align: center; color: #78716c; font-size: 11px;">
          Autonomous GPS Geofence Trigger • TripTrack Private Family Fleet Monitor
        </div>
      </div>
    `;
    return this.sendEmail(subject, html);
  }

  /**
   * Template 6: Daily Evening Yatra Digest ("Sandhya Bulletin") — Bilingual English + Hindi
   */
  async notifyDailyEveningDigest(data: DailyDigestData) {
    const subject = `🌄 [Sandhya Bulletin / संध्या बुलेटिन] Daily Yatra Summary — ${data.dateStr}`;
    const milestonesList = data.milestonesCovered.length > 0 
      ? data.milestonesCovered.map(m => `<li style="margin-bottom: 4px; color: #cbd5e1;">✅ ${m}</li>`).join('')
      : '<li style="color: #94a3b8;">Resting / Acclimatization day • विश्राम एवं अनुकूलन दिवस</li>';

    const html = `
      <div style="font-family: Arial, sans-serif; background-color: #1c1917; color: #f5f5f4; padding: 24px; border-radius: 16px; max-width: 600px; margin: 0 auto; border: 1px solid #8b5cf6;">
        <div style="text-align: center; border-bottom: 1px solid #44403c; padding-bottom: 16px;">
          <h1 style="color: #a78bfa; margin: 0; font-size: 22px;">🌄 Sandhya Bulletin — Daily Yatra Digest</h1>
          <p style="color: #ddd6fe; font-size: 15px; margin: 4px 0 0 0; font-weight: bold;">दैनिक संध्या बुलेटिन • परिजनों की मानसिक शांति हेतु सारांश</p>
          <p style="color: #a8a29e; font-size: 12px; margin: 4px 0 0 0;">${data.dateStr}</p>
        </div>
        
        <div style="padding: 20px 0;">
          <div style="background-color: #2e1065; border-left: 4px solid #8b5cf6; padding: 14px; border-radius: 8px; margin-bottom: 16px;">
            <h3 style="color: #f5f3ff; margin: 0 0 8px 0; font-size: 15px;">🏁 Milestones Reached Today / आज पूर्ण हुए पड़ाव:</h3>
            <ul style="margin: 0; padding-left: 16px; font-size: 13px; line-height: 1.5;">
              ${milestonesList}
            </ul>
          </div>

          <div style="background-color: #1e293b; border: 1px solid #334155; padding: 14px; border-radius: 8px; margin-bottom: 16px;">
            <h3 style="color: #38bdf8; margin: 0 0 6px 0; font-size: 14px;">🩺 Elder Health & Comfort / वरिष्ठजनों का स्वास्थ्य:</h3>
            <p style="color: #f1f5f9; margin: 0; font-size: 13px; line-height: 1.5;">${data.eldersHealthSummary}</p>
            <p style="color: #bae6fd; margin: 6px 0 0 0; font-size: 13px; line-height: 1.5;">
              रजनीश जी एवं संजय जी दोनों का ऑक्सीजन स्तर (SpO2 > 92%) व स्वास्थ्य एकदम सामान्य एवं उत्तम है। दवाइयां समय पर ली गई हैं।
            </p>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 16px;">
            <div style="background-color: #292524; padding: 12px; border-radius: 8px;">
              <span style="color: #a8a29e; font-size: 11px; display: block;">📸 Moments Uploaded / फोटो</span>
              <strong style="color: #fbbf24; font-size: 16px;">${data.photosCount} Photos</strong>
            </div>
            <div style="background-color: #292524; padding: 12px; border-radius: 8px;">
              <span style="color: #a8a29e; font-size: 11px; display: block;">💰 Today's Shared Outlay / खर्च</span>
              <strong style="color: #34d399; font-size: 16px;">₹${data.gullakSpentTodayINR.toLocaleString('en-IN')}</strong>
            </div>
          </div>

          <div style="background-color: #292524; padding: 14px; border-radius: 8px; font-size: 13px;">
            <strong style="color: #f59e0b; display: block; margin-bottom: 4px;">🌅 Tomorrow's Scheduled Route / कल का कार्यक्रम:</strong>
            <span style="color: #e7e5e4;">${data.tomorrowPreview}</span>
          </div>
        </div>

        <div style="border-top: 1px solid #44403c; padding-top: 14px; text-align: center; color: #78716c; font-size: 11px;">
          Sent automatically from Badrinath Yatra 2026 • TripTrack by Ut-tech
        </div>
      </div>
    `;
    return this.sendEmail(subject, html);
  }
}

export const emailService = new EmailService();
