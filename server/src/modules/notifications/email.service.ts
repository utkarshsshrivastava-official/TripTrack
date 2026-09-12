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

class EmailService {
  private transporter: any = null;
  private isConfigured = false;

  constructor() {
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_APP_PASSWORD;

    if (user && pass && user !== 'your-family-email@gmail.com' && pass !== 'your-16-char-app-password') {
      try {
        this.transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: { user, pass }
        });
        this.isConfigured = true;
        console.log(`📧 [Nodemailer] Configured with Gmail SMTP account: ${user}`);
      } catch (err) {
        console.warn('⚠️ [Nodemailer] Initialization failed, will use console simulation:', err);
      }
    } else {
      console.log('ℹ️ [Nodemailer] SMTP_USER or SMTP_APP_PASSWORD unset. Running in Safe Simulation Mode (payloads logged to console).');
    }
  }

  private getRecipients(): string[] {
    const raw = process.env.FAMILY_NOTIFICATION_EMAILS || process.env.SMTP_USER || '';
    return raw.split(',').map(e => e.trim()).filter(Boolean);
  }

  /**
   * Send general HTML email with fallback
   */
  async sendEmail(subject: string, htmlBody: string, specificRecipients?: string[]): Promise<{ success: boolean; simulated?: boolean; messageId?: string }> {
    const recipients = specificRecipients && specificRecipients.length > 0 ? specificRecipients : this.getRecipients();

    if (!this.isConfigured || !this.transporter || recipients.length === 0) {
      console.log('\n================== 📧 SIMULATED FAMILY EMAIL ==================');
      console.log(`To: ${recipients.join(', ') || '(No recipients configured)'}`);
      console.log(`Subject: ${subject}`);
      console.log('--- HTML Preview ---');
      console.log(htmlBody.slice(0, 300) + '...\n===============================================================\n');
      return { success: true, simulated: true };
    }

    try {
      const info = await this.transporter.sendMail({
        from: `"TripTrack Pilgrimage 🏔️" <${process.env.SMTP_USER}>`,
        to: recipients,
        subject,
        html: htmlBody
      });
      console.log(`✅ [Email Service] Dispatched to ${recipients.join(', ')} (Msg ID: ${info.messageId})`);
      return { success: true, messageId: info.messageId };
    } catch (err: any) {
      console.error('❌ [Email Service] Dispatch error:', err);
      return { success: false, simulated: false };
    }
  }

  /**
   * Template 1: Milestone Checkpoint Crossed Reassurance
   */
  async notifyMilestoneCrossed(data: MilestoneNotification) {
    const subject = `🏔️ [Badrinath 2026] Reached Safely: ${data.landmarkName} (${data.time})`;
    const html = `
      <div style="font-family: Arial, sans-serif; background-color: #1c1917; color: #f5f5f4; padding: 24px; border-radius: 16px; max-width: 600px; margin: 0 auto; border: 1px solid #d97706;">
        <div style="text-align: center; border-bottom: 1px solid #44403c; padding-bottom: 16px;">
          <h1 style="color: #f59e0b; margin: 0; font-size: 24px;">TripTrack Badrinath Dham 2026</h1>
          <p style="color: #a8a29e; font-size: 14px; margin: 4px 0 0 0;">In-Family Milestone Reassurance Update</p>
        </div>
        
        <div style="padding: 20px 0;">
          <div style="background-color: #292524; border-left: 4px solid #10b981; padding: 14px; border-radius: 8px; margin-bottom: 16px;">
            <h2 style="color: #10b981; margin: 0; font-size: 18px;">✅ Landmark Crossed Safely: ${data.landmarkName}</h2>
            <p style="color: #e7e5e4; margin: 6px 0 0 0; font-size: 14px;"><strong>Time:</strong> ${data.time} | <strong>Updated By:</strong> ${data.duoOrPilgrim}</p>
            ${data.altitudeMeters ? `<p style="color: #fbbf24; margin: 4px 0 0 0; font-size: 13px;">Elevation: ~${data.altitudeMeters} meters</p>` : ''}
          </div>

          ${data.notes ? `<p style="color: #d6d3d1; font-size: 14px; background-color: #1c1917; padding: 12px; border: 1px solid #44403c; border-radius: 8px;"><em>"${data.notes}"</em></p>` : ''}

          <div style="margin-top: 16px; padding: 12px; background-color: #292524; border-radius: 8px;">
            <p style="color: #93c5fd; margin: 0; font-size: 13px;"><strong>Next Destination:</strong> ${data.nextMilestone || 'En route next ghat milestone'}</p>
            <p style="color: #a8a29e; margin: 4px 0 0 0; font-size: 12px;">Elder comfort checks, warm water hydration, and BP medication schedules are actively maintained.</p>
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
   * Template 2: Mountain Dead-Zone Entry Notice (Prevents Home Family Panic)
   */
  async notifyDeadZoneEntry(data: DeadZoneNotification) {
    const subject = `📡 [Topography Notice] Entering Mountain Dead-Zone: ${data.segmentTitle}`;
    const html = `
      <div style="font-family: Arial, sans-serif; background-color: #1c1917; color: #f5f5f4; padding: 24px; border-radius: 16px; max-width: 600px; margin: 0 auto; border: 1px solid #3b82f6;">
        <div style="text-align: center; border-bottom: 1px solid #44403c; padding-bottom: 16px;">
          <h1 style="color: #60a5fa; margin: 0; font-size: 22px;">Alaknanda Gorge Cellular Shadow</h1>
          <p style="color: #a8a29e; font-size: 13px; margin: 4px 0 0 0;">Pre-Alert for Extended Family at Home</p>
        </div>
        
        <div style="padding: 20px 0;">
          <div style="background-color: #1e293b; border-left: 4px solid #3b82f6; padding: 14px; border-radius: 8px; margin-bottom: 16px;">
            <h3 style="color: #93c5fd; margin: 0; font-size: 16px;">📵 Cellular Disconnection Expected: ${data.segmentTitle}</h3>
            <p style="color: #cbd5e1; margin: 6px 0 0 0; font-size: 14px;">The vehicle is currently travelling through deep Himalayan gorge sections on NH-7 where cellular towers are geographically shielded.</p>
          </div>

          <div style="background-color: #292524; padding: 14px; border-radius: 8px; font-size: 14px; line-height: 1.6;">
            <p style="color: #fbbf24; margin: 0 0 8px 0;"><strong>Please Do Not Worry:</strong></p>
            <ul style="margin: 0; padding-left: 20px; color: #d6d3d1;">
              <li>Expected Radio Silence Duration: ~${data.expectedSilenceHours} hours</li>
              <li>Expected Reconnection Landmark: ${data.expectedReconnectionPoint}</li>
              <li>All offline passes, medical relief contacts, and navigation routes are stored directly on the pilgrims' phones.</li>
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
   * Template 3: Emergency SOS & Critical Alert
   */
  async notifyEmergencySos(data: SosNotification) {
    const subject = `🚨 [URGENT SOS ALERT] Emergency Beacon Triggered by ${data.triggeredBy}`;
    const mapsLink = `https://www.google.com/maps?q=${data.latitude},${data.longitude}`;
    const html = `
      <div style="font-family: Arial, sans-serif; background-color: #450a0a; color: #fef2f2; padding: 24px; border-radius: 16px; max-width: 600px; margin: 0 auto; border: 2px solid #ef4444;">
        <div style="text-align: center; border-bottom: 1px solid #7f1d1d; padding-bottom: 16px;">
          <h1 style="color: #f87171; margin: 0; font-size: 24px;">🚨 PILGRIM SOS DISPATCH</h1>
          <p style="color: #fca5a5; font-size: 14px; margin: 4px 0 0 0;">Immediate Family Attention Requested</p>
        </div>
        
        <div style="padding: 20px 0;">
          <p style="font-size: 16px; margin-top: 0;">An emergency beacon was initiated by <strong>${data.triggeredBy}</strong> (${data.duoName}) at <strong>${data.timestamp}</strong>.</p>

          <div style="background-color: #1c1917; padding: 16px; border-radius: 8px; margin: 16px 0;">
            <p style="color: #fbbf24; margin: 0 0 8px 0; font-size: 15px;"><strong>📍 Last Known GPS Coordinates:</strong></p>
            <p style="font-family: monospace; font-size: 15px; margin: 0; color: #67e8f9;">${data.latitude.toFixed(5)}, ${data.longitude.toFixed(5)}</p>
            <p style="margin: 10px 0 0 0;">
              <a href="${mapsLink}" style="display: inline-block; background-color: #ef4444; color: white; padding: 8px 16px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 13px;">
                Open in Google Maps
              </a>
            </p>
            ${data.batteryLevel ? `<p style="color: #a8a29e; font-size: 12px; margin: 10px 0 0 0;">Phone Battery: ${data.batteryLevel}%</p>` : ''}
          </div>

          ${data.seniorMedicalDossier ? `
            <div style="background-color: #292524; padding: 12px; border-radius: 8px; font-size: 13px;">
              <strong style="color: #fca5a5;">Medical Dossier:</strong> ${data.seniorMedicalDossier}
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
}

export const emailService = new EmailService();
