import type { SectionConfig } from './types';

const configLoaders: Record<string, () => Promise<SectionConfig[]>> = {
    home: async () => (await import('./configs/home')).homeConfig,
    about: async () => (await import('./configs/about')).aboutConfig,
    quality: async () => (await import('./configs/quality')).qualityConfig,
    production: async () => (await import('./configs/production')).productionConfig,
    export: async () => (await import('./configs/export')).exportConfig,
    b2b: async () => (await import('./configs/b2b')).b2bConfig,
    contact: async () => (await import('./configs/contact')).contactConfig,
};

const configCache = new Map<string, SectionConfig[]>();

export const getPageSectionsConfig = async (slug: string): Promise<SectionConfig[]> => {
    if (configCache.has(slug)) {
        return configCache.get(slug)!;
    }

    const loader = configLoaders[slug];
    if (!loader) {
        console.warn(`[Config Loader] No configuration found for slug: "${slug}"`);
        return [];
    }

    try {
        const config = await loader();
        configCache.set(slug, config);
        return config;
    } catch (error) {
        console.error(`[Config Loader] Failed to load config for "${slug}":`, error);
        return [];
    }
};

export const clearConfigCache = (slug?: string) => {
    if (slug) {
        configCache.delete(slug);
    } else {
        configCache.clear();
    }
};
