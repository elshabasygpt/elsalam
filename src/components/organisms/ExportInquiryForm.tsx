"use client";

import React, { useState } from "react";
import { Container } from "@/components/atoms/Container";
import { Button } from "@/components/atoms/Button";
import { FormField } from "@/components/molecules/FormField";
import { SectionHeader } from "@/components/molecules/SectionHeader";
import { Typography } from "@/components/atoms/Typography";
import { Globe } from "lucide-react";

const INCOTERMS = ["FOB Alexandria", "CIF", "DDP", "EXW"];

export const ExportInquiryForm = () => {
    const [submitted, setSubmitted] = useState(false);

    if (submitted) {
        return (
            <section className="py-24 bg-surface-soft">
                <Container className="max-w-2xl text-center">
                    <div className="bg-white p-12 rounded-lg shadow-card border border-accent-green/30">
                        <span className="w-16 h-16 rounded-full bg-primary-green/10 flex items-center justify-center mx-auto mb-6"><Globe className="w-8 h-8 text-primary-green" /></span>
                        <Typography variant="h3" className="text-primary-dark mb-4">Export Inquiry Received!</Typography>
                        <Typography variant="body" className="text-text-dark/70">
                            Our export team will respond within 48 hours with a pro-forma invoice, shipping estimate, and certificate package.
                        </Typography>
                    </div>
                </Container>
            </section>
        );
    }

    return (
        <section className="py-24 bg-surface-soft" id="export-inquiry">
            <Container className="max-w-3xl">
                <SectionHeader
                    title="Export Inquiry"
                    subtitle="Complete the form below and our export team will prepare a custom quotation within 48 hours."
                />

                <form
                    dir="ltr"
                    className="bg-white p-8 lg:p-10 rounded-lg shadow-card border border-surface-light space-y-6 font-english text-left"
                    onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                        <FormField label="Company Name" placeholder="Your company" required />
                        <FormField label="Contact Person" placeholder="Full name" required />
                        <FormField label="Email" type="email" placeholder="email@company.com" required />
                        <FormField label="Phone (WhatsApp)" type="tel" placeholder="+1 xxx xxx xxxx" required />
                        <FormField label="Country" placeholder="e.g. Germany" required />
                        <FormField label="Destination Port" placeholder="e.g. Hamburg" />
                    </div>

                    <FormField label="Products & Volume (Tons)" placeholder="e.g. Soybean Oil - 40 tons, Margarine - 20 tons" required />

                    <div>
                        <label className="block text-sm font-medium text-text-dark mb-3">Preferred Incoterm</label>
                        <div className="flex flex-wrap gap-3">
                            {INCOTERMS.map((term, i) => (
                                <label key={i} className="flex items-center gap-2 px-4 py-2 bg-surface-soft rounded-sm border border-surface-light hover:border-primary-green/30 cursor-pointer transition-colors">
                                    <input type="radio" name="incoterm" className="accent-primary-green" />
                                    <span className="text-sm font-medium">{term}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text-dark mb-3">Required Certifications</label>
                        <div className="flex flex-wrap gap-3">
                            {["ISO 9001", "ISO 22000", "Halal", "HACCP", "Kosher", "FDA"].map((c, i) => (
                                <label key={i} className="flex items-center gap-2 px-4 py-2 bg-surface-soft rounded-sm border border-surface-light hover:border-primary-green/30 cursor-pointer transition-colors">
                                    <input type="checkbox" className="accent-primary-green w-4 h-4" />
                                    <span className="text-sm">{c}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text-dark mb-2">Additional Requirements</label>
                        <textarea
                            rows={4}
                            className="w-full px-4 py-3 rounded-sm border border-surface-light bg-white text-base text-text-dark placeholder:text-text-dark/40 focus:outline-none focus:border-accent-green focus:ring-1 focus:ring-accent-green transition-shadow resize-none"
                            placeholder="Special packaging, labeling requirements, etc."
                        />
                    </div>

                    <Button type="submit" size="lg" className="w-full">
                        Submit Export Inquiry
                    </Button>

                    <p className="text-center text-sm text-text-dark/50">
                        Min. export order: 20 tons (1x20' FCL) — Response within 48 business hours
                    </p>
                </form>
            </Container>
        </section>
    );
};
