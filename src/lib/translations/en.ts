import type { TranslationKeys } from "./ar";

export const en: TranslationKeys = {
    // ── Direction ──
    dir: "ltr" as const,
    fontClass: "font-english",

    // ── Navbar ──
    nav: {
        brand: "Elsalam Factory",
        home: "Home",
        about: "About Us",
        products: "Products",
        qualityAndProduction: "Quality & Production",
        quality: "Quality Standards",
        production: "Production Lines",
        partnersAndExport: "Partners & Export",
        b2b: "B2B Partnerships",
        export: "Global Export",
        media: "Media Center",
        contact: "Contact Us",
        getQuote: "Get Quote",
        menuOils: "Vegetable Oils",
        menuOilsDesc: "Soybean, sunflower\n& refined oils",
        menuGhee: "Vegetable Ghee",
        menuGheeDesc: "Premium ghee with\nperfect texture & rich flavor",
        menuShortening: "Industrial Shortening",
        menuShorteningDesc: "For bakeries, pastries\n& food industries",
        menuViewAll: "View All",
        menuViewAllHint: "Explore all products and available packaging",
    },

    // ── Hero ──
    heroSlides: [
        {
            id: "quality",
            tabName: "Quality & Production",
            badge: "Over 25 years of experience in oil pressing",
            titleLine1: "Leading in",
            titleLine2: "Vegetable Oils",
            subtitle: "Elsalam Factory is committed to the highest quality standards in producing oils, margarine & shortening for the Egyptian and international markets using the latest European technologies.",
            ctaPrimary: "Explore Products",
            ctaPrimaryLink: "/products",
            ctaSecondary: "Export Partnerships",
            ctaSecondaryLink: "/export",
            image: "/images/hero-bg.png"
        },
        {
            id: "export",
            tabName: "Global Export",
            badge: "Exporting to 15+ countries worldwide",
            titleLine1: "Your Trusted Partner in",
            titleLine2: "Global Trade",
            subtitle: "Export-ready products meeting the highest international standards, backed by integrated logistics to serve global markets with flexibility and efficiency.",
            ctaPrimary: "Export Guide",
            ctaPrimaryLink: "/export",
            ctaSecondary: "Contact Us",
            ctaSecondaryLink: "/contact",
            image: "https://images.unsplash.com/photo-1586528116311-ad8ed7c1590f?q=80&w=2070&auto=format&fit=crop"
        },
        {
            id: "b2b",
            tabName: "B2B Partnerships",
            badge: "Production capacity up to 500 tons/day",
            titleLine1: "Industrial Solutions at",
            titleLine2: "Factory Prices",
            subtitle: "We supply oils, margarine, and shortening in bulk quantities with custom packaging for factories, bakeries, and major restaurant chains.",
            ctaPrimary: "Request Bulk Quote",
            ctaPrimaryLink: "/b2b/quote",
            ctaSecondary: "Partnership Benefits",
            ctaSecondaryLink: "/b2b",
            image: "https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?q=80&w=1974&auto=format&fit=crop"
        }
    ],
    scrollDown: "Discover More",

    // ── Stats ──
    stats: {
        experience: "Years of Experience",
        production: "Tons Daily Production",
        exports: "Export Countries",
        clients: "Industrial Clients",
        lines: "Production Lines",
        certifications: "Quality Certifications",
    },

    // ── Why Choose Us ──
    whyChooseUs: {
        badge: "Why Us?",
        title: "Why Choose",
        titleHighlight: "Elsalam Factory",
        subtitle: "We build reliable strategic partnerships based on quality and absolute commitment",
        reasons: [
            { title: "Massive Production Capacity", description: "With a production capacity of up to 500 tons per day, we guarantee fulfilling all major orders for the industrial and commercial sectors without delay." },
            { title: "Global Quality Standards", description: "Certified with the highest international quality and food safety standards, ensuring our products are exported to over 15 countries." },
            { title: "Advanced Refining Technology", description: "We use the latest refining technology to achieve the highest levels of purity and transparency while preserving nutritional value." },
            { title: "100% Natural", description: "Our products are completely free from preservatives and harmful chemical additives, offering you healthy and safe oils." },
        ],
    },

    // ── Segments ──
    segments: {
        title: "How Can We Serve You?",
        subtitle: "Customized solutions for every sector",
        items: [
            { title: "Food Manufacturers", desc: "Wholesale solutions with custom specs for your production lines", cta: "Request Quote" },
            { title: "Hotels & Restaurants", desc: "HoReCa products with suitable packaging & global specs", cta: "Contact Us" },
            { title: "Global Export", desc: "Export-ready products fully compliant with international standards", cta: "Export Inquiry" },
            { title: "Retail & Distribution", desc: "Competitive prices with direct delivery to points of sale", cta: "Shop Now" },
        ],
    },

    // ── Featured Products ──
    featuredProducts: {
        badge: "Top Products",
        title: "Our Leading Products",
        subtitle: "Meeting local market and export needs",
        viewAll: "View All Products",
        productDetails: "Product Details",
        availableForExport: "Available for Export",
        availablePackaging: "Available Packaging",
        products: [
            { title: "Refined Soybean Oil", subtitle: "Refined Soybean Oil", description: "Pure, high-quality soybean oil for industrial and food applications.", features: ["Cholesterol-free", "Suitable for deep frying", "Internationally certified"] },
            { title: "Sunflower Oil", subtitle: "Sunflower Oil", description: "Light, healthy oil rich in Omega-6, ideal for frying and daily cooking.", features: ["Rich in Vitamin E", "Golden transparent color", "Ideal for salads"] },
            { title: "Premium Vegetable Ghee", subtitle: "Premium Vegetable Ghee", description: "Vegetable ghee with perfect texture that withstands high temperatures.", features: ["Rich distinctive flavor", "High stability when cooking", "Creamy consistent texture"] },
            { title: "Bakery Shortening", subtitle: "Bakery Shortening", description: "Specialized shortening for pastries and baked goods with unmatched flakiness.", features: ["Ideal for pies & croissants", "High thermal stability", "Exceptional flakiness"] },
        ],
    },

    // ── Packaging ──
    packaging: {
        badge: "Packaging Options",
        title: "Packaging for Every Need",
        subtitle: "We provide flexible and diverse packaging options suitable for all sectors, from retail to bulk maritime shipping for major industries.",
        types: [
            { title: "PET Plastic Bottles", sizes: "1, 2, 5 liters", description: "Ideal for retail applications, consumer markets, and household use." },
            { title: "Tin Cans", sizes: "16L, 18L", description: "The optimal choice for restaurants and hotels (HoReCa) with heavy consumption." },
            { title: "Steel Drums", sizes: "200L", description: "Economical packaging for food factories, confectioneries, and large bakeries." },
            { title: "Flexitank", sizes: "22,000L", description: "The strategic solution for exporting large quantities via maritime shipping at the lowest logistics cost." },
        ],
    },

    // ── Certifications ──
    certifications: {
        badge: "Quality & Compliance",
        title: "Quality Certifications & International Accreditations",
        subtitle: "We are proud to hold the highest international certifications ensuring the quality and safety of our products",
        certs: [
            { desc: "Total Quality Management" },
            { desc: "International Food Safety" },
            { desc: "Hazard Analysis & Critical Control" },
            { desc: "Certified Halal" },
            { desc: "Good Manufacturing Practices" },
            { desc: "FDA Approved" },
        ],
    },

    // ── Timeline ──
    timeline: {
        badge: "Production Process",
        title: "Production Journey",
        subtitle: "From nature to your table, a journey documented with the highest global quality standards",
        steps: [
            { title: "Seed Reception & Preparation", description: "Receiving agricultural seeds (soybean, sunflower) and passing them through magnetic cleaning and sieving equipment." },
            { title: "Pressing & Extraction", description: "Crushing and heating seeds to increase oil yield, then mechanically pressing and extracting crude oil." },
            { title: "Refining & Purification", description: "Degumming, bleaching, and deodorizing to achieve pure, highly transparent oil." },
            { title: "Filling & Packaging", description: "Automated filling under full sanitary conditions to preserve the natural properties of the product." },
        ],
    },

    // ── Testimonials ──
    testimonials: {
        title: "What Our Clients Say",
        subtitle: "Trust spanning over 25 years with thousands of clients in Egypt and worldwide",
        items: [
            { name: "Eng. Khaled Abdel Rahman", role: "Purchasing Manager — Star Biscuit Factory", content: "We've been working with Elsalam Factory for over 8 years. The shortening quality is consistent in every shipment, and the after-sales service is excellent." },
            { name: "Ms. Sara Al-Masry", role: "Owner of Al-Asala Restaurant Chain", content: "Elsalam's sunflower oil is our first choice. It doesn't alter food flavor and handles repeated frying excellently." },
            { name: "Mr. Ahmed Hassan", role: "Import Manager — Global Foods Trading, UAE", content: "Elsalam is our trusted supplier for vegetable oils. Their ISO and Halal certifications, combined with competitive pricing, make them the best choice in Egypt." },
            { name: "Mr. Mohamed Youssef", role: "Authorized Distributor — Greater Cairo", content: "Working with Elsalam Factory is easy and professional. Prices are competitive and delivery is always on time. Highly recommended." },
        ],
    },

    // ── FAQ ──
    faq: {
        title: "Frequently Asked Questions",
        subtitle: "Answers to the most common questions from our clients",
        items: [
            { question: "What types of oils does Elsalam Factory produce?", answer: "Elsalam Factory produces a wide range including: refined soybean oil, sunflower oil, refined palm oil, premium vegetable ghee, industrial margarine, bakery shortening, and deep frying shortening. We also offer custom oil blends per client specifications." },
            { question: "Are your products quality certified?", answer: "Yes, all our products hold ISO 9001, ISO 22000, HACCP, and Halal certifications. We adhere to the highest quality and food safety standards at every production stage." },
            { question: "What is the minimum order quantity?", answer: "For local market: the minimum varies by product type and packaging. For export: the minimum is 20 tons (1x20' FCL). Contact us for more details based on your needs." },
            { question: "Do you export outside Egypt?", answer: "Yes, we export to over 15 countries worldwide including the Middle East, Africa, Europe, and Asia. We provide all documentation required for customs clearance." },
            { question: "What packaging options are available?", answer: "We offer diverse packaging: consumer bottles (1L, 2L, 5L), industrial packaging (18L, 200L drums), and flexitanks for bulk shipping. We can also provide private label packaging with your brand." },
            { question: "How long does order fulfillment and delivery take?", answer: "For local orders: 3-7 business days. For export orders: 14-21 business days depending on destination. We always commit to agreed delivery schedules." },
        ],
    },

    // ── CTA Partnership ──
    cta: {
        title: "Looking for a Reliable Industrial Partner?",
        subtitle: "Whether you're a food manufacturer, restaurant chain, or global distributor — Elsalam Factory provides customized solutions with the highest quality standards and competitive prices.",
        ctaPrimary: "Request a Quote",
        ctaSecondary: "Contact Sales Team",
    },

    // ── Client Logos ──
    clients: {
        badge: "Success Partners",
        titleBefore: "Trusted by over",
        titleCount: "200+",
        titleAfter: "industrial partners",
        names: ["Al-Safa Food Group", "Nile Distribution Co.", "Cairo Hotel Chain", "Orient Food Industries", "Red Sea Agencies", "Gulf Export Group", "Delta Industrial Co.", "King Foods Int'l"],
    },

    // ── Footer ──
    footer: {
        ctaTitle: "Need a custom price quote?",
        ctaSubtitle: "Our team is ready to help you choose the right product and packaging",
        ctaButton: "Contact Now",
        description: "Leading in vegetable oil pressing and production of oils, margarine & shortening since 2000. Trusted by over 200 industrial partners worldwide.",
        quickLinksTitle: "Quick Links",
        quickLinks: ["Home", "About Us", "Quality Standards", "Production Lines", "Media Center", "Contact Us"],
        productsTitle: "Our Products",
        productLinks: ["Refined Vegetable Oils", "Premium Vegetable Ghee", "Bakery Shortening", "Industrial B2B Packaging", "Global Export"],
        newsletterTitle: "Newsletter",
        newsletterSubtitle: "Subscribe for the latest offers and news",
        newsletterPlaceholder: "Your email",
        subscribe: "Subscribe",
        addressTitle: "Address",
        address: "Industrial Zone, Menoufia, Egypt",
        phone: "+20 1xx xxx xxxx",
        email: "info@elsalamoils.com",
        copyright: "Elsalam Vegetable Oil Pressing & Extraction Factory. All rights reserved.",
        privacy: "Privacy Policy",
        terms: "Terms & Conditions",
    },

    // ── Contact Page ──
    contact: {
        pageTitle: "Contact Us",
        pageSubtitle: "We're happy to respond to your inquiries within 24 business hours",
        formTitle: "Send Your Message",
        name: "Full Name",
        namePlaceholder: "Name",
        emailLabel: "Email Address",
        emailPlaceholder: "email@example.com",
        phone: "Phone Number",
        phonePlaceholder: "+20 1xx xxx xxxx",
        message: "Message",
        messagePlaceholder: "Write your message here...",
        send: "Send Message",
        sending: "Sending...",
        successMessage: "Your message has been sent successfully! We'll respond within 24 business hours.",
        errorMessage: "An error occurred while sending. Please try again.",
        errNameRequired: "Name is required",
        errEmailRequired: "Email is required",
        errEmailInvalid: "Please enter a valid email address",
        errMessageRequired: "Message is required",
        errMessageShort: "Message must be at least 10 characters",
        contactInfoTitle: "Contact Information",
        quickContact: "For Quick Inquiries",
        whatsappLocal: "WhatsApp — Local Sales",
        whatsappExport: "WhatsApp — Export",
        workingHours: "Saturday – Thursday: 8:00 AM – 5:00 PM",
    },

    // ── Export Page ──
    export: {
        heroTitle: "Export-Ready Vegetable Oils from Egypt",
        heroSubtitle: "Premium quality vegetable oils, margarine & shortening — ISO & Halal certified, shipped to 15+ countries worldwide.",
        heroCta: "Submit Export Inquiry",
        marketsTitle: "Target Markets",
        marketsSubtitle: "We export to 15+ countries across 4 continents",
        markets: [
            { region: "Middle East", countries: "UAE, Saudi Arabia, Kuwait, Qatar, Oman, Bahrain, Jordan" },
            { region: "Africa", countries: "Sudan, Libya, Kenya, Tanzania, Ghana, Nigeria" },
            { region: "Europe", countries: "Germany, Netherlands, Italy, UK" },
            { region: "Asia", countries: "India, Pakistan, Malaysia, Indonesia" },
        ],
        complianceTitle: "Compliance & Logistics",
        complianceSubtitle: "All documentation ready for seamless customs clearance",
        complianceData: [
            { label: "HS Code (Soybean Oil)", value: "1507.90.90" },
            { label: "Country of Origin", value: "Egypt" },
            { label: "Shelf Life", value: "18 months" },
            { label: "Storage", value: "Cool, dry, away from sunlight" },
            { label: "Min Export Order", value: "20 tons (1x20' FCL)" },
            { label: "Incoterms", value: "FOB Alexandria, CIF, DDP" },
        ],
    },

    // ── Product Detail ──
    productDetail: {
        notFoundTitle: "Product Not Found",
        notFoundSubtitle: "Sorry, we couldn't find this product.",
        backToProducts: "Back to Products",
        aboutProduct: "About This Product",
        features: "Features",
        technicalSpecs: "Technical Specifications",
        packagingAvailable: "Available Packaging",
        qualityCerts: "Quality Certifications",
        interested: "Interested in This Product?",
        interestedSub: "Contact us for a custom price quote",
        requestQuote: "Request Quote",
        exportInquiry: "Export Inquiry",
        specLabels: { acidity: "Acidity (FFA)", color: "Color", smokePoint: "Smoke Point", shelfLife: "Shelf Life", storage: "Storage" },
        breadcrumbHome: "Home",
        breadcrumbProducts: "Products",
    },

    // ── About Page ──
    about: {
        heroTitle: "About Elsalam Factory",
        heroSubtitle: "Over 25 years of leadership in the vegetable oils, margarine & shortening industry",
        storyTitle: "Our Story",
        storyP1: "Elsalam Factory for Extracting and Refining Vegetable Oils was established in 2000 in the Industrial Zone, Egypt. We started with a single production line and a clear vision: to provide world-class vegetable oils at competitive prices. Today, we proudly operate 8 production lines with a daily capacity of 500 MT, exporting to over 15 countries.",
        storyP2: "We are committed to sustainability and continuous innovation, consistently investing in our production lines and quality laboratories to ensure our products meet the highest local and international standards.",
        storyTimeline: [
            { year: "2000", title: "Foundation & Launch", description: "Began our journey with a single vegetable oil production line, focusing on meeting local market needs with the highest quality standards." },
            { year: "2008", title: "Refinery Expansion", description: "Inaugurated a state-of-the-art refining line to ensure absolute purity and high transparency of our oils under European standards." },
            { year: "2015", title: "Entering Export Markets", description: "Achieved international quality certifications and production capacity that enabled successful exports to Africa and the Middle East." },
            { year: "2020", title: "Ghee & Shortening Launch", description: "Diversified the product portfolio to include premium vegetable ghee and specialized bakery shortening to supply the industrial sector." },
            { year: "2025", title: "Leadership & Sustainability", description: "Reached 500 MT daily capacity with continuous exports to 15+ countries, implementing green and sustainable production policies." }
        ],
        ceoTitle: "Chairman's Message",
        ceoQuote: "We believe quality is an obligation, not an option. Our vision is to be the premier partner for every factory, restaurant, and distributor seeking world-class vegetable oils made in Egypt.",
        ceoName: "Mohamed Ismail Idris — Chairman of the Board",
        ceoBio: {
            title: "About the Chairman",
            name: "Mohamed Ismail Idris",
            role: "Chairman of the Board, Elsalam Factory for Vegetable Oils and Refining",
            educationTitle: "Early Life & Education",
            educationDesc: "Mr. Mohamed Ismail Idris graduated from Alexandria University in 1990 and began his professional career in sales, where he demonstrated a clear passion for marketing, brand building, and expanding market share from the very beginning.",
            careerTitle: "Professional Career",
            careerStations: [
                {
                    title: "Coca-Cola Company – Alexandria (1990–1992)",
                    role: "Sales Supervisor",
                    achievements: ["Expanded market share", "Increased sales", "Implemented innovative marketing techniques"]
                },
                {
                    title: "Aujan Industries – Saudi Arabia (1993–1995)",
                    role: "Catering Supervisor",
                    desc: "Founded the company's Catering Department, successfully introducing products (Rani, Vimto, Cadbury chocolate) to hotels, restaurants, hospitals, the military sector, and Saudi Arabian Airlines.",
                    achievements: []
                },
                {
                    title: "Baeshen Company – Saudi Arabia (1995–1997)",
                    role: "Northern Region Manager",
                    desc: "Led the marketing efforts for Rabea Tea brand, contributing to the launch and extensive expansion of the product in the Saudi market.",
                    achievements: []
                },
                {
                    title: "Nestle Egypt (1998)",
                    role: "Sales Manager - Alexandria",
                    desc: "Supervised the distribution of dry products (Nescafe, Nido, Cerelac, Nestle chocolate) and enhanced the brand's local presence.",
                    achievements: []
                },
                {
                    title: "Savola Sime Darby (1999–2001)",
                    role: "Industrial Sector Sales Manager",
                    desc: "Focused on distributing palm oil to the food industry and introduced innovative industrial solutions by recycling oil derivatives.",
                    achievements: []
                }
            ],
            entrepreneurshipTitle: "Transition to Entrepreneurship (2002 – Present)",
            entrepreneurshipDesc: "In 2002, Mr. Mohamed Idris took a bold step by founding Elsalam Company as a specialized entity in trading and refining vegetable oils and supplying raw materials to major factories and restaurants.",
            expansionTitle: "Strategic Expansion",
            expansionDesc: "The company expanded into distributing palm oil, shortening, and margarine, serving over 135 factories in Egypt. In 2020, a modern factory was inaugurated in Damanhour, equipped with the latest production lines.",
            innovationTitle: "Innovation & Quality",
            innovationPoints: [
                "Introducing shortening in cheese production",
                "Developing industrial solutions for the food industry",
                "Investing palm oil derivatives in soap manufacturing",
                "Implementing strictly monitored quality control across all production stages"
            ],
            visionTitle: "Vision & Leadership",
            visionDesc: "His vision is to lead the vegetable oils and natural fats industry in Egypt and the Middle East, relying on building long-term strategic partnerships, supporting small industries, and committing to social responsibility.",
            leadershipTitle: "Leadership Traits",
            leadershipPoints: [
                "Over 30 years of experience in the food sector",
                "Strong background in industrial sales",
                "Ability to build strategic partnerships",
                "Innovative approach to product development",
                "Genuine support for small and medium-sized industries"
            ]
        },
        galleryTitle: "Factory Tour",
        gallerySubtitle: "A look at our production lines and quality facilities",
        galleryItems: ["Automated Oil Production Line", "Quality Control Labs", "Storage Tanks", "Bottle Filling Line", "Shipping Warehouses", "Raw Material Reception Area", "Central Control Room", "Ghee Production Line"],
    },

    // ── Quality Page ──
    quality: {
        heroTitle: "Quality Standards",
        heroSubtitle: "We adhere to the highest global quality and food safety standards at every stage of production",
        qcTitle: "Quality Control Checkpoints",
        qcSubtitle: "8 strict inspection points in every production cycle",
        qcChecks: [
            "Raw material inspection upon receipt",
            "Acidity and moisture analysis",
            "Color and transparency testing",
            "Smoke point and melting point analysis",
            "Heavy metals and contaminants testing",
            "Oxidative stability testing",
            "Packaging and labeling inspection",
            "Accelerated shelf life analysis",
        ],
        downloadTitle: "Download Quality Certificates & Technical Specifications",
        downloadISO9001: "Download ISO 9001 Certificate",
        downloadISO22000: "Download ISO 22000 Certificate",
        downloadHalal: "Download Halal Certificate",
    },

    // ── Products Page ──
    products: {
        heroTitle: "Our Products",
        heroSubtitle: "A complete range of vegetable oils, margarine & shortening with the highest quality standards",
        filterAll: "All",
        filterOils: "Vegetable Oils",
        filterMargarine: "Vegetable Ghee",
        filterShortening: "Shortening",
        emptyState: "No products found in this category",
        items: [
            { id: "oil-soy", title: "Refined Soybean Oil", description: "Pure, high-quality soybean oil suitable for deep frying and industrial food manufacturing.", category: "oils" },
            { id: "oil-sun", title: "Sunflower Oil", description: "Light and healthy oil rich in Vitamin E and Omega-6.", category: "oils" },
            { id: "oil-palm", title: "Refined Palm Oil", description: "RBD palm oil for versatile food industry applications.", category: "oils" },
            { id: "oil-blend", title: "Custom Oil Blends", description: "Oil blends designed to industrial client specifications.", category: "oils" },
            { id: "marg-1", title: "Premium Vegetable Ghee", description: "Vegetable ghee with perfect texture for home cooking and restaurants.", category: "margarine" },
            { id: "marg-2", title: "Industrial Margarine", description: "Margarine for bakeries and confectioneries with precise melting point.", category: "margarine" },
            { id: "short-1", title: "Bakery Shortening", description: "Specialized shortening for pastries and baked goods ensuring flaky texture.", category: "shortening" },
            { id: "short-2", title: "Deep Frying Shortening", description: "Shortening resistant to high temperatures with extended shelf life.", category: "shortening" },
        ],
    },

    // ── Production Page ──
    production: {
        heroTitle: "Production Process",
        heroSubtitle: "From raw seeds to the final product — 8 production stages with the highest quality and food safety standards",
        steps: [
            { title: "Seed Reception & Preparation", description: "Agricultural seeds (soybean, sunflower, palm) are received and passed through magnetic cleaning and sieving equipment to remove impurities and foreign objects." },
            { title: "Crushing & Conditioning", description: "Seeds are crushed and heated in special ovens to increase oil yield and improve extraction efficiency." },
            { title: "Mechanical Pressing & Extraction", description: "Seeds are pressed mechanically using modern hydraulic presses, then remaining oil is extracted using organic solvents." },
            { title: "Degumming & Neutralization", description: "Removal of phospholipids and free fatty acids from crude oil to improve stability and purity." },
            { title: "Bleaching", description: "Oil is passed through activated bleaching earth to remove unwanted pigments and colorants." },
            { title: "Deodorization", description: "Oil is treated with steam under vacuum and high temperature to remove volatile compounds and odors." },
            { title: "Filling & Packaging", description: "Automated filling in various containers (1L, 5L, 18L, 200L drums, flexitank) under full sanitary conditions." },
            { title: "Quality Control & Storage", description: "Samples from each production batch are tested in the central laboratory before shipping, with storage in climate-controlled warehouses." },
        ],
    },

    // ── Media Page ──
    media: {
        heroTitle: "Media Center",
        heroSubtitle: "Discover Elsalam Factory from the inside, and learn about the latest news and interviews.",
        filterAll: "All",
        filterNews: "News",
        filterInterviews: "Interviews",
        filterFactory: "Factory Tours",
        filterExhibitions: "Exhibitions",
        emptyState: "No articles available in this section currently.",
        readMore: "Read More",
        featuredLabel: "Featured",
        loadMore: "Load More",
        categories: {
            news: "News",
            interviews: "Interviews",
            factory_tours: "Factory Tours",
            exhibitions: "Exhibitions",
        },
        // Detail page
        breadcrumbHome: "Home",
        breadcrumbMedia: "Media Center",
        relatedArticles: "Related Articles",
        shareArticle: "Share Article",
        publishedOn: "Published on",
        minRead: "min read",
        backToMedia: "Back to Media Center",
    },

    // ── B2B Page ──
    b2b: {
        heroTitle: "Industrial Partnerships Hub",
        heroSubtitle: "Elsalam Factory — Your strategic partner in supplying vegetable oils, margarine & shortening in industrial quantities at factory-direct prices.",
        ctaQuote: "Request a Quote",
        ctaCatalog: "Download PDF Catalog",
        whyTitle: "Why Elsalam Factory?",
        whySubtitle: "6 reasons that make us the first choice for factories and distributors",
        advantages: [
            { title: "High Production Capacity", desc: "500 tons daily across 8 production lines equipped with the latest European technology." },
            { title: "Advanced Quality Labs", desc: "Strict quality control at every production stage with lab reports for each shipment." },
            { title: "Custom Packaging", desc: "From small retail bottles to flexitank for export — tailored to your needs." },
            { title: "Competitive Pricing", desc: "Direct factory prices with flexible payment terms for industrial clients." },
            { title: "Integrated Logistics", desc: "Local and international shipping with shipment tracking and on-time delivery guarantee." },
            { title: "Strategic Partner", desc: "Dedicated sales team and solutions designed for your business needs." },
        ],
    },

    // ── Quote Form ──
    quote: {
        title: "Bulk Quote Request",
        subtitle: "Fill in the details below and our sales team will contact you within 24 hours",
        companyName: "Company Name",
        companyPlaceholder: "e.g. Al-Safa Company",
        contactName: "Contact Person",
        contactPlaceholder: "Full Name",
        email: "Email Address",
        phone: "Phone Number (WhatsApp)",
        country: "Country",
        countryPlaceholder: "Egypt",
        productsLabel: "Requested Products",
        products: ["Refined Soybean Oil", "Sunflower Oil", "Palm Oil", "Vegetable Ghee", "Shortening", "Custom Oil Blends", "Private Label"],
        volume: "Expected Monthly Volume (tons)",
        volumePlaceholder: "Minimum: 5 tons",
        packagingLabel: "Preferred Packaging Type",
        packaging: ["Drums (200L)", "Tins (18L)", "Bottles (5L)", "Bottles (1L)", "Flexitank", "Custom Packaging"],
        notes: "Additional Notes",
        notesPlaceholder: "Any additional details about your requirements...",
        submit: "Submit Quote Request",
        moq: "Minimum Order Quantity (MOQ): 5 tons — Response within 24 business hours",
        successTitle: "Your request has been received!",
        successMessage: "Our sales team will contact you within 24 hours with a custom quote for your needs.",
    },

    // ── Not Found ──
    notFound: {
        title: "Page Not Found",
        subtitle: "Sorry, the page you're looking for is not available. It may have been moved or deleted.",
        backHome: "Back to Home",
        browseProducts: "Browse Products",
    },

    // ── Back to Top ──
    backToTop: "Back to top",

    // ── Privacy Page ──
    privacyPage: {
        heroTitle: "Privacy Policy",
        heroSubtitle: "At Elsalam Oils, we are committed to protecting your privacy and ensuring the security of your data.",
        lastUpdated: "Last Updated: April 2026",
        intro: "This Privacy Policy explains how we collect, use, and protect your information when you use our website or interact with us. We take your privacy seriously and adhere to the highest data security standards.",
        sections: [
            {
                title: "1. Information Collection",
                content: "We collect information you voluntarily provide when filling out contact forms, requesting quotes, or communicating via email. This may include your name, company name, contact details, and business requirements."
            },
            {
                title: "2. Use of Data",
                content: "We use the collected information to improve customer service, respond to inquiries, process quote requests, and send updates about our products if you have subscribed to our newsletter."
            },
            {
                title: "3. Data Protection",
                content: "We implement advanced security measures to maintain the safety of your personal information. Your data is contained behind secured networks accessible only by authorized personnel bound by confidentiality."
            },
            {
                title: "4. Third-Party Disclosure",
                content: "We do not sell, trade, or transfer your personally identifiable information to outside parties. We may share generic aggregated demographic information with trusted partners, but never sensitive data."
            },
            {
                title: "5. Your Consent",
                content: "By using our site, you consent to our privacy policy. We reserve the right to update this policy at any time, and any changes will be posted on this page."
            }
        ],
        contactTitle: "Privacy Concerns?",
        contactDesc: "If you have any questions regarding our privacy policy, please feel free to contact us.",
    },

    // ── WhatsApp ──
    whatsapp: {
        tooltip: "Chat with us on WhatsApp",
    },
};
