import { create } from 'zustand';

type SectionData = Record<string, any>;

interface CmsState {
  originalData: Record<string, SectionData>;
  draftData: Record<string, SectionData>;
  
  initialize: (data: Record<string, SectionData>) => void;
  updateSection: (sectionId: string, data: SectionData) => void;
  resetAll: () => void;
  resetSection: (sectionId: string) => void;
  
  getDirtyCount: () => number;
  isDirty: (sectionId?: string) => boolean;
}

export const useCmsStore = create<CmsState>((set, get) => ({
  originalData: {},
  draftData: {},

  // Sets initial data from server
  initialize: (data) => set({ 
      originalData: JSON.parse(JSON.stringify(data)), 
      draftData: JSON.parse(JSON.stringify(data)) 
  }),

  // Modifies only the draft state for a specific section
  updateSection: (sectionId, data) => set((state) => ({
    draftData: {
      ...state.draftData,
      [sectionId]: { ...(state.draftData[sectionId] || {}), ...data }
    }
  })),

  // Discards all unsaved changes
  resetAll: () => set((state) => ({ 
      draftData: JSON.parse(JSON.stringify(state.originalData)) 
  })),
  
  // Discards unsaved changes for a single section
  resetSection: (sectionId) => set((state) => ({
    draftData: {
      ...state.draftData,
      [sectionId]: JSON.parse(JSON.stringify(state.originalData[sectionId] || {}))
    }
  })),

  // Checks if a specific section or the entire CMS is dirty
  isDirty: (sectionId) => {
    const { originalData, draftData } = get();
    if (sectionId) {
      return JSON.stringify(originalData[sectionId]) !== JSON.stringify(draftData[sectionId]);
    }
    return JSON.stringify(originalData) !== JSON.stringify(draftData);
  },

  // Returns the number of dirty sections
  getDirtyCount: () => {
    const { originalData, draftData } = get();
    return Object.keys(draftData).filter(key => 
      JSON.stringify(originalData[key]) !== JSON.stringify(draftData[key])
    ).length;
  }
}));
