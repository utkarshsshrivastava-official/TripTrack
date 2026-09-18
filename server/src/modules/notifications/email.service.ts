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
  dayTitle: string;
  scheduledFor: string;
  subject: string;
  highlights: string[];
  transitInfo: string;
  elderCareTip: string;
  logisticsSummary: string;
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
  private isConfigured = false;

  constructor() {
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_APP_PASSWORD;

    if (user && pass && user !== 'your-family-email@gmail.com' && pass !== 'your-16-char-app-password') {
      try {
        this.transporter = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 465,
          secure: true, // Port 465 SSL is reliable on cloud containers
          auth: { user, pass },
          connectionTimeout: 6000,
          greetingTimeout: 6000,
          socketTimeout: 7000
        });
        this.isConfigured = true;
        console.log(`📧 [Nodemailer] Configured with Gmail SMTP (Port 465 SSL) for: ${user}`);
      } catch (err) {
        console.warn('⚠️ [Nodemailer] Initialization failed, will use console simulation:', err);
      }
    } else {
      console.log('ℹ️ [Nodemailer] SMTP_USER or SMTP_APP_PASSWORD unset. Running in Safe Simulation Mode (payloads logged to console).');
    }
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
   * Send general HTML email with fallback
   */
  async sendEmail(subject: string, htmlBody: string, specificRecipients?: string[]): Promise<{ success: boolean; simulated?: boolean; messageId?: string; warning?: string }> {
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
      const sendPromise = this.transporter.sendMail({
        from: `"TripTrack Pilgrimage 🏔️" <${process.env.SMTP_USER}>`,
        to: recipients,
        subject,
        html: htmlBody
      });

      // Strict 7-second timeout race so cloud servers never hang indefinitely
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('SMTP timed out after 7s (outbound port blocked or delayed).')), 7000)
      );

      const info: any = await Promise.race([sendPromise, timeoutPromise]);
      console.log(`✅ [Email Service] Dispatched to ${recipients.join(', ')} (Msg ID: ${info.messageId})`);
      return { success: true, messageId: info.messageId };
    } catch (err: any) {
      console.error('❌ [Email Service] Dispatch error:', err.message || err);
      // Fall back to safe console simulation so caller never crashes or hangs
      return { 
        success: true, 
        simulated: true, 
        warning: `Direct SMTP delayed (${err.message || 'timeout'}). Notification logged to cloud console.` 
      };
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

  /**
   * Template 4: Automated Scheduled Morning Briefing
   */
  async notifyScheduledBriefing(data: ScheduledBriefing) {
    const subject = `🌅 [Yatra Morning Briefing] ${data.dayTitle} — ${data.subject}`;
    const highlightsHtml = data.highlights.map(h => `<li style="margin-bottom: 6px; color: #e7e5e4;">${h}</li>`).join('');

    const html = `
      <div style="font-family: Arial, sans-serif; background-color: #1c1917; color: #f5f5f4; padding: 24px; border-radius: 16px; max-width: 600px; margin: 0 auto; border: 1px solid #f59e0b;">
        <div style="text-align: center; border-bottom: 1px solid #44403c; padding-bottom: 16px;">
          <h1 style="color: #f59e0b; margin: 0; font-size: 24px;">🏔️ TripTrack Morning Yatra Briefing</h1>
          <p style="color: #fbbf24; font-size: 14px; margin: 4px 0 0 0; font-weight: bold;">${data.dayTitle}</p>
        </div>
        
        <div style="padding: 20px 0;">
          <div style="background-color: #292524; border-left: 4px solid #f59e0b; padding: 14px; border-radius: 8px; margin-bottom: 16px;">
            <h2 style="color: #fef08a; margin: 0; font-size: 17px;">📌 Today's Core Objective: ${data.subject}</h2>
            <p style="color: #d6d3d1; margin: 6px 0 0 0; font-size: 13px;">${data.transitInfo}</p>
          </div>

          <div style="background-color: #1c1917; border: 1px solid #44403c; padding: 14px; border-radius: 8px; margin-bottom: 16px;">
            <h3 style="color: #38bdf8; margin: 0 0 10px 0; font-size: 15px;">⭐ Key Milestones & Timing:</h3>
            <ul style="margin: 0; padding-left: 20px; font-size: 13px; line-height: 1.6;">
              ${highlightsHtml}
            </ul>
          </div>

          <div style="background-color: #052e16; border: 1px solid #166534; padding: 14px; border-radius: 8px; margin-bottom: 16px;">
            <h3 style="color: #4ade80; margin: 0 0 6px 0; font-size: 14px;">🩺 Elder Dignity & Health Protocol:</h3>
            <p style="color: #dcfce7; margin: 0; font-size: 13px; line-height: 1.5;">${data.elderCareTip}</p>
          </div>

          <div style="background-color: #292524; padding: 12px; border-radius: 8px; font-size: 12px; color: #a8a29e;">
            <strong style="color: #f5f5f4;">Logistics Reference:</strong> ${data.logisticsSummary}
          </div>
        </div>

        <div style="border-top: 1px solid #44403c; padding-top: 14px; text-align: center; color: #78716c; font-size: 11px;">
          Automated Pilgrimage Morning Dispatch • TripTrack by Ut-tech • Badrinath Dham 2026
        </div>
      </div>
    `;
    return this.sendEmail(subject, html);
  }

  /**
   * Template 5: Location-Based Geofence Waypoint Arrival Notice
   */
  async notifyGeofenceArrival(data: WaypointArrival) {
    const subject = `📍 [Live Arrival] Touched ${data.name} (${data.arrivedAt}) — All Pilgrims Safe`;
    const mapsLink = `https://www.google.com/maps?q=${data.latitude},${data.longitude}`;

    const html = `
      <div style="font-family: Arial, sans-serif; background-color: #1c1917; color: #f5f5f4; padding: 24px; border-radius: 16px; max-width: 600px; margin: 0 auto; border: 1px solid #10b981;">
        <div style="text-align: center; border-bottom: 1px solid #44403c; padding-bottom: 16px;">
          <h1 style="color: #10b981; margin: 0; font-size: 22px;">📍 Waypoint Reached Safely!</h1>
          <p style="color: #6ee7b7; font-size: 14px; margin: 4px 0 0 0; font-weight: bold;">${data.name}</p>
        </div>
        
        <div style="padding: 20px 0;">
          <div style="background-color: #064e3b; border-left: 4px solid #10b981; padding: 14px; border-radius: 8px; margin-bottom: 16px;">
            <p style="color: #ecfdf5; margin: 0; font-size: 15px; font-weight: bold;">
              All 4 travellers (Rajnish Ji, Sanjay Ji, Utkarsh & Shreyas) have arrived at ${data.name}.
            </p>
            <div style="display: flex; gap: 12px; margin-top: 8px; font-size: 12px; color: #a7f3d0; font-family: monospace;">
              <span>🕒 Time: ${data.arrivedAt}</span>
              <span>•</span>
              <span>⛰️ Altitude: ~${data.altitudeMeters}m</span>
              <span>•</span>
              <span>🛰️ Source: ${data.detectedVia === 'GPS_GEOFENCE' ? 'GPS Geofence' : 'Milestone Check'}</span>
            </div>
          </div>

          <p style="color: #d6d3d1; font-size: 13px; line-height: 1.6; background-color: #292524; padding: 12px; border-radius: 8px;">
            ${data.description}
          </p>

          <div style="margin-top: 16px; display: flex; align-items: center; justify-content: space-between; background-color: #1c1917; border: 1px solid #44403c; padding: 12px; border-radius: 8px;">
            <div style="font-size: 12px; color: #94a3b8;">
              <strong style="color: #f5f5f4;">Next Target:</strong> ${data.nextStop}
            </div>
            <a href="${mapsLink}" style="background-color: #047857; color: white; padding: 6px 12px; border-radius: 6px; text-decoration: none; font-size: 11px; font-weight: bold;">
              Live Pin
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
   * Template 6: Daily Evening Yatra Digest ("Sandhya Bulletin")
   */
  async notifyDailyEveningDigest(data: DailyDigestData) {
    const subject = `🌄 [Sandhya Bulletin] Pilgrimage Daily Summary — ${data.dateStr}`;
    const milestonesList = data.milestonesCovered.length > 0 
      ? data.milestonesCovered.map(m => `<li style="margin-bottom: 4px; color: #cbd5e1;">✅ ${m}</li>`).join('')
      : '<li style="color: #94a3b8;">Resting / Acclimatization day</li>';

    const html = `
      <div style="font-family: Arial, sans-serif; background-color: #1c1917; color: #f5f5f4; padding: 24px; border-radius: 16px; max-width: 600px; margin: 0 auto; border: 1px solid #8b5cf6;">
        <div style="text-align: center; border-bottom: 1px solid #44403c; padding-bottom: 16px;">
          <h1 style="color: #a78bfa; margin: 0; font-size: 22px;">🌄 Sandhya Bulletin — Daily Yatra Digest</h1>
          <p style="color: #ddd6fe; font-size: 13px; margin: 4px 0 0 0;">${data.dateStr} • Extended Family Peace of Mind</p>
        </div>
        
        <div style="padding: 20px 0;">
          <div style="background-color: #2e1065; border-left: 4px solid #8b5cf6; padding: 14px; border-radius: 8px; margin-bottom: 16px;">
            <h3 style="color: #f5f3ff; margin: 0 0 8px 0; font-size: 15px;">🏁 Milestones Reached Today:</h3>
            <ul style="margin: 0; padding-left: 16px; font-size: 13px; line-height: 1.5;">
              ${milestonesList}
            </ul>
          </div>

          <div style="background-color: #1e293b; border: 1px solid #334155; padding: 14px; border-radius: 8px; margin-bottom: 16px;">
            <h3 style="color: #38bdf8; margin: 0 0 6px 0; font-size: 14px;">🩺 Elder Health & Comfort Check:</h3>
            <p style="color: #f1f5f9; margin: 0; font-size: 13px; line-height: 1.5;">${data.eldersHealthSummary}</p>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 16px;">
            <div style="background-color: #292524; padding: 12px; border-radius: 8px;">
              <span style="color: #a8a29e; font-size: 11px; display: block;">📸 Moments Uploaded</span>
              <strong style="color: #fbbf24; font-size: 16px;">${data.photosCount} Photos</strong>
            </div>
            <div style="background-color: #292524; padding: 12px; border-radius: 8px;">
              <span style="color: #a8a29e; font-size: 11px; display: block;">💰 Today's Shared Outlay</span>
              <strong style="color: #34d399; font-size: 16px;">₹${data.gullakSpentTodayINR.toLocaleString('en-IN')}</strong>
            </div>
          </div>

          <div style="background-color: #292524; padding: 14px; border-radius: 8px; font-size: 13px;">
            <strong style="color: #f59e0b; display: block; margin-bottom: 4px;">🌅 Tomorrow's Scheduled Route:</strong>
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
