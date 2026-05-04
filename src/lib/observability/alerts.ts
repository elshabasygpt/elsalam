import { logger } from "@/lib/logger";

interface AlertPayload {
    level: "WARN" | "CRITICAL";
    title: string;
    message: string;
    metadata?: Record<string, any>;
}

export class AlertSystem {
    private readonly SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL;
    private readonly ALERT_EMAIL_TO = process.env.ALERT_EMAIL_TO;
    
    private alertQueue: AlertPayload[] = [];
    private isProcessing = false;
    
    // Deduplication Map: signature -> timestamp
    private recentAlerts = new Map<string, number>();
    private readonly COOLDOWN_MS = 60000; // 1 minute cooldown for exact same alert

    async trigger(payload: AlertPayload) {
        const signature = `${payload.level}:${payload.title}`;
        const lastSent = this.recentAlerts.get(signature) || 0;

        // Deduplication / Cooldown Strategy
        if (Date.now() - lastSent < this.COOLDOWN_MS) {
            return; // Suppress duplicate alert
        }
        this.recentAlerts.set(signature, Date.now());

        this.alertQueue.push(payload);
        
        if (payload.level === "CRITICAL") {
            logger.error({ message: `[ALERT] ${payload.title}: ${payload.message}`, ...payload.metadata });
        }

        if (!this.isProcessing) {
            this.processQueue();
        }
    }

    private async processQueue() {
        this.isProcessing = true;
        
        while (this.alertQueue.length > 0) {
            const batch = this.alertQueue.splice(0, 10);
            
            await Promise.all([
                this.sendToSlack(batch),
                this.sendEmail(batch)
            ]);
            
            await new Promise(res => setTimeout(res, 1000));
        }

        // Clean up memory from old alerts
        const now = Date.now();
        for (const [sig, time] of Array.from(this.recentAlerts.entries())) {
            if (now - time > this.COOLDOWN_MS) this.recentAlerts.delete(sig);
        }

        this.isProcessing = false;
    }

    private async sendToSlack(batch: AlertPayload[]) {
        if (!this.SLACK_WEBHOOK_URL) return;

        try {
            const blocks = batch.map(alert => ({
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: `*${alert.level === 'CRITICAL' ? '🚨' : '⚠️'} ${alert.title}*\n${alert.message}\n\`\`\`${JSON.stringify(alert.metadata || {})}\`\`\``
                }
            }));

            await fetch(this.SLACK_WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ blocks })
            });
        } catch (error) {
            console.error("Failed to send Slack alert", error);
        }
    }

    private async sendEmail(batch: AlertPayload[]) {
        if (!this.ALERT_EMAIL_TO) return;
        // Placeholder
    }
}

export const alerts = new AlertSystem();
