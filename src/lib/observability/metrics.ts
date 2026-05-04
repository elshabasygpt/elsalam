// In-memory metrics store. In a multi-node/edge setup, you would push these to Datadog/StatsD via UDP,
// but for a single-server Next.js app or Prometheus scraping, an in-memory registry works well.

export class MetricsRegistry {
    private counters: Record<string, number> = {};
    private histograms: Record<string, number[]> = {};

    // 1. Counters (e.g., request count, error count)
    increment(metricName: string, tags: Record<string, string> = {}, value: number = 1) {
        const key = this.buildKey(metricName, tags);
        if (!this.counters[key]) this.counters[key] = 0;
        this.counters[key] += value;
    }

    // 2. Histograms (e.g., request duration, db query duration)
    observe(metricName: string, value: number, tags: Record<string, string> = {}) {
        const key = this.buildKey(metricName, tags);
        if (!this.histograms[key]) this.histograms[key] = [];
        this.histograms[key].push(value);

        // Keep only last 100 observations to prevent memory leaks
        if (this.histograms[key].length > 100) {
            this.histograms[key].shift();
        }
    }

    // Export metrics in Prometheus Format
    exportPrometheusFormat(): string {
        let output = "";
        
        // Counters
        for (const [key, value] of Object.entries(this.counters)) {
            output += `# TYPE ${this.stripTags(key)} counter\n`;
            output += `${key} ${value}\n`;
        }

        // Histograms (Simplified to Average/Count for basic Prometheus compatibility)
        for (const [key, values] of Object.entries(this.histograms)) {
            const count = values.length;
            const sum = values.reduce((a, b) => a + b, 0);
            const avg = count > 0 ? sum / count : 0;
            const stripped = this.stripTags(key);
            
            output += `# TYPE ${stripped} summary\n`;
            output += `${stripped}_count${this.extractTags(key)} ${count}\n`;
            output += `${stripped}_sum${this.extractTags(key)} ${sum}\n`;
            output += `${stripped}_avg${this.extractTags(key)} ${avg}\n`;
        }

        return output;
    }

    private buildKey(name: string, tags: Record<string, string>): string {
        if (Object.keys(tags).length === 0) return name;
        const tagString = Object.entries(tags)
            .map(([k, v]) => `${k}="${v}"`)
            .join(",");
        return `${name}{${tagString}}`;
    }

    private stripTags(key: string): string {
        return key.split("{")[0];
    }

    private extractTags(key: string): string {
        const parts = key.split("{");
        return parts.length > 1 ? `{${parts[1]}` : "";
    }
}

export const metrics = new MetricsRegistry();
