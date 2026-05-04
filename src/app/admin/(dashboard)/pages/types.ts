export interface FieldConfig {
    key: string;
    labelAr: string;
    labelEn: string;
    type: "text" | "textarea" | "url" | "list" | "select" | "color" | "range" | "toggle";
    options?: { label: string; value: string }[];
    min?: number;
    max?: number;
    step?: number;
    bilingual: boolean;
    required?: boolean;
    placeholder?: string;
    placeholderEn?: string;
    listFields?: FieldConfig[];
}

export interface SectionConfig {
    id: string;
    title: string;
    emoji: string;
    description?: string;
    fields: FieldConfig[];
}
