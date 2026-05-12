--
-- PostgreSQL database dump
--

\restrict GHHEivtmzKeAEbchd0PZh0NvEUUmxmmgD5FtpEjkLnxknCVjXnpDlh7YbuM7zlQ

-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Cart; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Cart" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Cart" OWNER TO postgres;

--
-- Name: CartItem; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."CartItem" (
    id text NOT NULL,
    "cartId" text NOT NULL,
    "productId" integer NOT NULL,
    quantity integer NOT NULL,
    "weightVariant" text DEFAULT ''::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."CartItem" OWNER TO postgres;

--
-- Name: Category; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Category" (
    id integer NOT NULL,
    name_ar text NOT NULL,
    name_en text NOT NULL,
    slug text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "imageUrl" text,
    "sortOrder" integer DEFAULT 0 NOT NULL
);


ALTER TABLE public."Category" OWNER TO postgres;

--
-- Name: Category_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Category_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Category_id_seq" OWNER TO postgres;

--
-- Name: Category_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Category_id_seq" OWNED BY public."Category".id;


--
-- Name: Client; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Client" (
    id integer NOT NULL,
    name text NOT NULL,
    company text,
    industry text,
    notes text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    lat double precision,
    lng double precision,
    "locationUrl" text,
    "mainPhone" text,
    "repId" text,
    "secondaryPhone" text,
    "storeImage" text,
    "storeType" text,
    "creditLimit" double precision DEFAULT 0 NOT NULL,
    "outstandingBalance" double precision DEFAULT 0 NOT NULL,
    status text DEFAULT 'LEAD'::text NOT NULL
);


ALTER TABLE public."Client" OWNER TO postgres;

--
-- Name: ClientContact; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ClientContact" (
    id integer NOT NULL,
    "clientId" integer NOT NULL,
    "personName" text,
    department text NOT NULL,
    email text NOT NULL,
    phone text
);


ALTER TABLE public."ClientContact" OWNER TO postgres;

--
-- Name: ClientContact_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."ClientContact_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."ClientContact_id_seq" OWNER TO postgres;

--
-- Name: ClientContact_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."ClientContact_id_seq" OWNED BY public."ClientContact".id;


--
-- Name: ClientOrder; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ClientOrder" (
    id integer NOT NULL,
    "clientId" integer NOT NULL,
    "repId" text NOT NULL,
    status text DEFAULT 'NEW'::text NOT NULL,
    "totalAmount" double precision DEFAULT 0 NOT NULL,
    notes text,
    "rejectionReason" text,
    "expectedDate" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."ClientOrder" OWNER TO postgres;

--
-- Name: ClientOrder_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."ClientOrder_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."ClientOrder_id_seq" OWNER TO postgres;

--
-- Name: ClientOrder_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."ClientOrder_id_seq" OWNED BY public."ClientOrder".id;


--
-- Name: Client_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Client_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Client_id_seq" OWNER TO postgres;

--
-- Name: Client_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Client_id_seq" OWNED BY public."Client".id;


--
-- Name: Message; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Message" (
    id integer NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    phone text,
    company text,
    subject text NOT NULL,
    body text NOT NULL,
    type text DEFAULT 'inquiry'::text NOT NULL,
    status text DEFAULT 'new'::text NOT NULL,
    priority text DEFAULT 'normal'::text NOT NULL,
    reply text,
    "repliedAt" timestamp(3) without time zone,
    "repliedBy" text,
    notes text,
    "isStarred" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Message" OWNER TO postgres;

--
-- Name: Message_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Message_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Message_id_seq" OWNER TO postgres;

--
-- Name: Message_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Message_id_seq" OWNED BY public."Message".id;


--
-- Name: News; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."News" (
    id integer NOT NULL,
    slug text NOT NULL,
    title_ar text NOT NULL,
    title_en text NOT NULL,
    excerpt_ar text,
    excerpt_en text,
    content_ar text,
    content_en text,
    category text DEFAULT 'news'::text NOT NULL,
    tags text,
    featured_image text,
    image_alt text,
    meta_title text,
    meta_description text,
    is_featured boolean DEFAULT false NOT NULL,
    is_published boolean DEFAULT false NOT NULL,
    published_at timestamp(3) without time zone,
    scheduled_at timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."News" OWNER TO postgres;

--
-- Name: News_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."News_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."News_id_seq" OWNER TO postgres;

--
-- Name: News_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."News_id_seq" OWNED BY public."News".id;


--
-- Name: OrderItem; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."OrderItem" (
    id integer NOT NULL,
    "orderId" integer NOT NULL,
    "productId" integer NOT NULL,
    quantity integer NOT NULL,
    "unitPrice" double precision DEFAULT 0 NOT NULL,
    subtotal double precision DEFAULT 0 NOT NULL
);


ALTER TABLE public."OrderItem" OWNER TO postgres;

--
-- Name: OrderItem_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."OrderItem_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."OrderItem_id_seq" OWNER TO postgres;

--
-- Name: OrderItem_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."OrderItem_id_seq" OWNED BY public."OrderItem".id;


--
-- Name: OutboxEvent; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."OutboxEvent" (
    id text NOT NULL,
    type text NOT NULL,
    payload text NOT NULL,
    status text DEFAULT 'PENDING'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."OutboxEvent" OWNER TO postgres;

--
-- Name: PageContent; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."PageContent" (
    id text NOT NULL,
    "pageSlug" text NOT NULL,
    content text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    version integer DEFAULT 1 NOT NULL
);


ALTER TABLE public."PageContent" OWNER TO postgres;

--
-- Name: PageContentHistory; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."PageContentHistory" (
    id text NOT NULL,
    "pageSlug" text NOT NULL,
    content text NOT NULL,
    "savedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    label text DEFAULT ''::text NOT NULL
);


ALTER TABLE public."PageContentHistory" OWNER TO postgres;

--
-- Name: Product; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Product" (
    id integer NOT NULL,
    slug text NOT NULL,
    name_ar text NOT NULL,
    name_en text NOT NULL,
    short_description_ar text,
    short_description_en text,
    description_ar text,
    description_en text,
    long_description_ar text,
    long_description_en text,
    featured_image text,
    price double precision,
    price_unit_ar text,
    price_unit_en text,
    is_exportable boolean DEFAULT false NOT NULL,
    is_featured boolean DEFAULT false NOT NULL,
    icon text,
    gradient_from text,
    gradient_to text,
    "categoryId" integer,
    "activePromotionId" integer,
    pdf_datasheet text,
    meta_title text,
    meta_description text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    stock integer DEFAULT 100 NOT NULL
);


ALTER TABLE public."Product" OWNER TO postgres;

--
-- Name: ProductCertification; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ProductCertification" (
    id integer NOT NULL,
    "productId" integer NOT NULL,
    name text NOT NULL
);


ALTER TABLE public."ProductCertification" OWNER TO postgres;

--
-- Name: ProductCertification_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."ProductCertification_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."ProductCertification_id_seq" OWNER TO postgres;

--
-- Name: ProductCertification_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."ProductCertification_id_seq" OWNED BY public."ProductCertification".id;


--
-- Name: ProductFeature; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ProductFeature" (
    id integer NOT NULL,
    "productId" integer NOT NULL,
    feature_ar text NOT NULL,
    feature_en text NOT NULL
);


ALTER TABLE public."ProductFeature" OWNER TO postgres;

--
-- Name: ProductFeature_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."ProductFeature_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."ProductFeature_id_seq" OWNER TO postgres;

--
-- Name: ProductFeature_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."ProductFeature_id_seq" OWNED BY public."ProductFeature".id;


--
-- Name: ProductImage; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ProductImage" (
    id integer NOT NULL,
    "productId" integer NOT NULL,
    url text NOT NULL,
    alt_text text
);


ALTER TABLE public."ProductImage" OWNER TO postgres;

--
-- Name: ProductImage_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."ProductImage_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."ProductImage_id_seq" OWNER TO postgres;

--
-- Name: ProductImage_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."ProductImage_id_seq" OWNED BY public."ProductImage".id;


--
-- Name: ProductPackaging; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ProductPackaging" (
    id integer NOT NULL,
    "productId" integer NOT NULL,
    size_ar text NOT NULL,
    size_en text NOT NULL,
    price double precision
);


ALTER TABLE public."ProductPackaging" OWNER TO postgres;

--
-- Name: ProductPackaging_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."ProductPackaging_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."ProductPackaging_id_seq" OWNER TO postgres;

--
-- Name: ProductPackaging_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."ProductPackaging_id_seq" OWNED BY public."ProductPackaging".id;


--
-- Name: ProductSpec; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ProductSpec" (
    id integer NOT NULL,
    "productId" integer NOT NULL,
    label_ar text NOT NULL,
    label_en text NOT NULL,
    value_ar text NOT NULL,
    value_en text NOT NULL
);


ALTER TABLE public."ProductSpec" OWNER TO postgres;

--
-- Name: ProductSpec_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."ProductSpec_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."ProductSpec_id_seq" OWNER TO postgres;

--
-- Name: ProductSpec_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."ProductSpec_id_seq" OWNED BY public."ProductSpec".id;


--
-- Name: Product_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Product_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Product_id_seq" OWNER TO postgres;

--
-- Name: Product_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Product_id_seq" OWNED BY public."Product".id;


--
-- Name: PromoCode; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."PromoCode" (
    id integer NOT NULL,
    code text NOT NULL,
    type text NOT NULL,
    value double precision NOT NULL,
    "minOrderValue" double precision,
    "maxUses" integer,
    "usedCount" integer DEFAULT 0 NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "expiresAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."PromoCode" OWNER TO postgres;

--
-- Name: PromoCode_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."PromoCode_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."PromoCode_id_seq" OWNER TO postgres;

--
-- Name: PromoCode_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."PromoCode_id_seq" OWNED BY public."PromoCode".id;


--
-- Name: Promotion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Promotion" (
    id integer NOT NULL,
    "productId" integer,
    title_ar text NOT NULL,
    title_en text NOT NULL,
    description_ar text,
    description_en text,
    discount_type text NOT NULL,
    discount_value double precision NOT NULL,
    original_price double precision,
    promo_price double precision,
    badge_ar text,
    badge_en text,
    featured_image text,
    starts_at timestamp(3) without time zone,
    ends_at timestamp(3) without time zone NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL
);


ALTER TABLE public."Promotion" OWNER TO postgres;

--
-- Name: Promotion_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Promotion_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Promotion_id_seq" OWNER TO postgres;

--
-- Name: Promotion_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Promotion_id_seq" OWNED BY public."Promotion".id;


--
-- Name: Quotation; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Quotation" (
    id text NOT NULL,
    "userId" text NOT NULL,
    status text DEFAULT 'PENDING'::text NOT NULL,
    "discountAmount" double precision DEFAULT 0 NOT NULL,
    "totalAmount" double precision DEFAULT 0 NOT NULL,
    "adminNotes" text,
    "clientNotes" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Quotation" OWNER TO postgres;

--
-- Name: QuotationItem; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."QuotationItem" (
    id text NOT NULL,
    "quotationId" text NOT NULL,
    "productId" integer NOT NULL,
    quantity integer NOT NULL,
    price double precision NOT NULL,
    "weightVariant" text DEFAULT ''::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."QuotationItem" OWNER TO postgres;

--
-- Name: ShippingZone; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ShippingZone" (
    id integer NOT NULL,
    name_ar text NOT NULL,
    name_en text NOT NULL,
    fee double precision DEFAULT 0 NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."ShippingZone" OWNER TO postgres;

--
-- Name: ShippingZone_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."ShippingZone_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."ShippingZone_id_seq" OWNER TO postgres;

--
-- Name: ShippingZone_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."ShippingZone_id_seq" OWNED BY public."ShippingZone".id;


--
-- Name: SiteSettings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."SiteSettings" (
    id text NOT NULL,
    "siteNameAr" text DEFAULT 'مصنع السلام للزيوت النباتية'::text NOT NULL,
    "siteNameEn" text DEFAULT 'Elsalam Vegetable Oils Factory'::text NOT NULL,
    "siteDescriptionAr" text,
    "siteDescriptionEn" text,
    "contactEmail" text,
    "contactPhone" text,
    "addressAr" text,
    "addressEn" text,
    "facebookUrl" text,
    "twitterUrl" text,
    "instagramUrl" text,
    "linkedinUrl" text,
    "smtpHost" text,
    "smtpPort" integer DEFAULT 587,
    "smtpUser" text,
    "smtpPass" text,
    "smtpFrom" text,
    "smtpFromName" text,
    "smtpSecure" text DEFAULT 'tls'::text,
    "logoUrl" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "googleAnalyticsId" text,
    "imapHost" text,
    "imapPass" text,
    "imapPort" integer DEFAULT 993,
    "imapSecure" text DEFAULT 'tls'::text,
    "imapUser" text,
    "invoiceNotesAr" text,
    "invoiceNotesEn" text,
    "invoiceShowLogo" boolean DEFAULT true NOT NULL,
    "invoiceLogoUrl" text,
    "invoiceColor" text DEFAULT '#15803d'::text,
    "invoiceCompanyDetails" text,
    "invoiceLogoSize" integer DEFAULT 64,
    "invoiceSubtitle" text DEFAULT 'Industrial High-Quality Oils & Fats'::text,
    "invoiceWebsiteUrl" text DEFAULT 'www.elsalamoils.com'::text,
    "geminiApiKey" text,
    "stabilityApiKey" text,
    "huggingFaceApiKey" text,
    "imageAiProvider" text DEFAULT 'pollinations'::text,
    "textAiProvider" text DEFAULT 'gemini'::text
);


ALTER TABLE public."SiteSettings" OWNER TO postgres;

--
-- Name: TechnicalSpec; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."TechnicalSpec" (
    id integer NOT NULL,
    "productId" integer NOT NULL,
    property_ar text NOT NULL,
    property_en text NOT NULL,
    value_ar text NOT NULL,
    value_en text NOT NULL,
    unit_ar text,
    unit_en text
);


ALTER TABLE public."TechnicalSpec" OWNER TO postgres;

--
-- Name: TechnicalSpec_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."TechnicalSpec_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."TechnicalSpec_id_seq" OWNER TO postgres;

--
-- Name: TechnicalSpec_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."TechnicalSpec_id_seq" OWNED BY public."TechnicalSpec".id;


--
-- Name: User; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."User" (
    id text NOT NULL,
    name text,
    email text,
    "emailVerified" timestamp(3) without time zone,
    image text,
    password text,
    role text DEFAULT 'USER'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."User" OWNER TO postgres;

--
-- Name: WebOrder; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."WebOrder" (
    id integer NOT NULL,
    "customerName" text NOT NULL,
    "customerEmail" text,
    "customerPhone" text NOT NULL,
    governorate text NOT NULL,
    "shippingAddress" text NOT NULL,
    "totalAmount" double precision DEFAULT 0 NOT NULL,
    status text DEFAULT 'PENDING'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "paymentMethod" text DEFAULT 'COD'::text NOT NULL,
    "shippingFee" double precision DEFAULT 0 NOT NULL,
    "userId" text,
    "discountAmount" double precision DEFAULT 0 NOT NULL,
    "promoCode" text,
    notes text,
    city text,
    "isQuotation" boolean DEFAULT false NOT NULL
);


ALTER TABLE public."WebOrder" OWNER TO postgres;

--
-- Name: WebOrderItem; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."WebOrderItem" (
    id integer NOT NULL,
    "orderId" integer NOT NULL,
    "productId" integer NOT NULL,
    quantity integer NOT NULL,
    "unitPrice" double precision DEFAULT 0 NOT NULL,
    subtotal double precision DEFAULT 0 NOT NULL
);


ALTER TABLE public."WebOrderItem" OWNER TO postgres;

--
-- Name: WebOrderItem_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."WebOrderItem_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."WebOrderItem_id_seq" OWNER TO postgres;

--
-- Name: WebOrderItem_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."WebOrderItem_id_seq" OWNED BY public."WebOrderItem".id;


--
-- Name: WebOrder_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."WebOrder_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."WebOrder_id_seq" OWNER TO postgres;

--
-- Name: WebOrder_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."WebOrder_id_seq" OWNED BY public."WebOrder".id;


--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- Name: Category id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Category" ALTER COLUMN id SET DEFAULT nextval('public."Category_id_seq"'::regclass);


--
-- Name: Client id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Client" ALTER COLUMN id SET DEFAULT nextval('public."Client_id_seq"'::regclass);


--
-- Name: ClientContact id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ClientContact" ALTER COLUMN id SET DEFAULT nextval('public."ClientContact_id_seq"'::regclass);


--
-- Name: ClientOrder id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ClientOrder" ALTER COLUMN id SET DEFAULT nextval('public."ClientOrder_id_seq"'::regclass);


--
-- Name: Message id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Message" ALTER COLUMN id SET DEFAULT nextval('public."Message_id_seq"'::regclass);


--
-- Name: News id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."News" ALTER COLUMN id SET DEFAULT nextval('public."News_id_seq"'::regclass);


--
-- Name: OrderItem id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OrderItem" ALTER COLUMN id SET DEFAULT nextval('public."OrderItem_id_seq"'::regclass);


--
-- Name: Product id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Product" ALTER COLUMN id SET DEFAULT nextval('public."Product_id_seq"'::regclass);


--
-- Name: ProductCertification id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ProductCertification" ALTER COLUMN id SET DEFAULT nextval('public."ProductCertification_id_seq"'::regclass);


--
-- Name: ProductFeature id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ProductFeature" ALTER COLUMN id SET DEFAULT nextval('public."ProductFeature_id_seq"'::regclass);


--
-- Name: ProductImage id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ProductImage" ALTER COLUMN id SET DEFAULT nextval('public."ProductImage_id_seq"'::regclass);


--
-- Name: ProductPackaging id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ProductPackaging" ALTER COLUMN id SET DEFAULT nextval('public."ProductPackaging_id_seq"'::regclass);


--
-- Name: ProductSpec id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ProductSpec" ALTER COLUMN id SET DEFAULT nextval('public."ProductSpec_id_seq"'::regclass);


--
-- Name: PromoCode id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PromoCode" ALTER COLUMN id SET DEFAULT nextval('public."PromoCode_id_seq"'::regclass);


--
-- Name: Promotion id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Promotion" ALTER COLUMN id SET DEFAULT nextval('public."Promotion_id_seq"'::regclass);


--
-- Name: ShippingZone id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ShippingZone" ALTER COLUMN id SET DEFAULT nextval('public."ShippingZone_id_seq"'::regclass);


--
-- Name: TechnicalSpec id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TechnicalSpec" ALTER COLUMN id SET DEFAULT nextval('public."TechnicalSpec_id_seq"'::regclass);


--
-- Name: WebOrder id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."WebOrder" ALTER COLUMN id SET DEFAULT nextval('public."WebOrder_id_seq"'::regclass);


--
-- Name: WebOrderItem id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."WebOrderItem" ALTER COLUMN id SET DEFAULT nextval('public."WebOrderItem_id_seq"'::regclass);


--
-- Data for Name: Cart; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Cart" (id, "userId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: CartItem; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."CartItem" (id, "cartId", "productId", quantity, "weightVariant", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Category; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Category" (id, name_ar, name_en, slug, "createdAt", "updatedAt", "imageUrl", "sortOrder") FROM stdin;
5	زيت أولين	Palm olein oil	palm-olein-oil	2026-04-20 01:24:04.594	2026-04-20 02:01:36.564	/uploads/upload_1776648243745_0nuqyg.jfif	1
6	زيت صويا	Soybean oil 	soybean-oil-	2026-04-20 01:26:12.015	2026-04-20 02:01:36.564	/uploads/upload_1776648369226_tppnix.jfif	2
7	زيت خليط	Blended oil	blended-oil	2026-04-20 01:28:59.038	2026-04-20 02:01:36.564	/uploads/upload_1776648537799_epl8v7.jfif	3
8	سمنة	Ghee	ghee	2026-04-20 01:31:15.097	2026-04-20 02:01:36.564	/uploads/upload_1776648674142_42e1po.jfif	4
9	شورتنج	Shortening	shortening	2026-04-20 01:35:47.207	2026-04-20 02:01:36.564	/uploads/upload_1776648945856_fvidso.jfif	5
10	المارجرين	Margarine	margarine	2026-04-20 01:38:53.005	2026-04-20 02:01:36.564	/uploads/upload_1776649131885_dhtxzt.jfif	6
\.


--
-- Data for Name: Client; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Client" (id, name, company, industry, notes, "createdAt", "updatedAt", lat, lng, "locationUrl", "mainPhone", "repId", "secondaryPhone", "storeImage", "storeType", "creditLimit", "outstandingBalance", status) FROM stdin;
3	محل الصقور 		\N		2026-04-18 17:28:29.387	2026-05-03 04:13:52.062	\N	\N	https://www.google.com/maps?q=31.034061,30.467496	0150175002	\N		/uploads/crm/1776534488851-images_(2).jfif	سوبرماركت	0	0	LEAD
\.


--
-- Data for Name: ClientContact; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ClientContact" (id, "clientId", "personName", department, email, phone) FROM stdin;
\.


--
-- Data for Name: ClientOrder; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ClientOrder" (id, "clientId", "repId", status, "totalAmount", notes, "rejectionReason", "expectedDate", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Message; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Message" (id, name, email, phone, company, subject, body, type, status, priority, reply, "repliedAt", "repliedBy", notes, "isStarred", "createdAt", "updatedAt") FROM stdin;
4	أحمد محمد	ahmed@example.com	+201234567890	شركة الفجر	استفسار عن زيت الطبخ بالجملة	السلام عليكم، أرغب في الاستفسار عن أسعار زيت الطبخ بالجملة وإمكانية التوريد لمحلات السوبر ماركت. نحتاج كميات كبيرة شهرياً.	inquiry	replied	normal	اهلا وسهلا	2026-03-13 22:48:15.728	Admin User	\N	f	2026-03-13 22:45:24.999	2026-03-13 22:48:17.685
5	سارة علي	sara@company.com	\N	\N	شكوى بخصوص عبوة تالفة	مرحباً، اشتريت عبوة زيت بتاريخ 1 مارس ولكن وجدت أن العبوة مثقوبة من الأسفل. أرجو الاهتمام بمراقبة الجودة.	complaint	replied	high	ddd	2026-03-13 22:51:50.051	Admin User	\N	f	2026-03-13 22:45:25.066	2026-03-13 22:51:51.88
6	محمود حسن	mahmoud@factory.eg	\N	مصنع النور للتوزيع	طلب شراكة للتوزيع في الصعيد	نود مناقشة فرص الشراكة في توزيع منتجاتكم في محافظات الصعيد. لدينا شبكة توزيع واسعة تغطي 5 محافظات.	partnership	read	normal	\N	\N	\N	\N	f	2026-03-13 22:45:25.132	2026-03-13 23:03:24.386
7	Ahmed Customer	ahmed@test.com	+201010101010	Food Traders LLC	B2B Quote Request	We need 40 tons of Soybean oil.	quote	replied	normal	Hello Ahmed, our quote is $40,000.	2026-04-18 12:49:08.188	\N	\N	f	2026-04-18 12:49:06.201	2026-04-18 12:49:08.189
8	 احمد 	outcontrol54@gmail.com	01013713596	شركة بسميبمن	B2B Quote Request	Requirements: سمن نباتي\nVolume: 5\nPackaging: براميل (200 لتر)\nCountry: مصر\nNotes: ببسييب	quote	replied	normal	تمام	2026-05-03 08:06:44.194	Admin User	\N	f	2026-05-03 08:04:10.18	2026-05-03 08:06:45.871
9	Test User	test@example.com	+201234567890	\N	New Inquiry	This is an end-to-end test message from the contact form.	inquiry	read	normal	\N	\N	\N	\N	f	2026-05-04 04:27:58.417	2026-05-04 07:02:03.358
\.


--
-- Data for Name: News; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."News" (id, slug, title_ar, title_en, excerpt_ar, excerpt_en, content_ar, content_en, category, tags, featured_image, image_alt, meta_title, meta_description, is_featured, is_published, published_at, scheduled_at, "createdAt", "updatedAt") FROM stdin;
2	cairo-food-exhibition-2026	مصنع السلام يشارك في معرض القاهرة الدولي للصناعات الغذائية	Elsalam Factory Participates in Cairo International Food Exhibition	شارك مصنع السلام في معرض القاهرة الدولي للصناعات الغذائية لعام 2026	Elsalam participated in the Cairo International Food Exhibition 2026	# المشاركة في معرض القاهرة الدولي\n\nشارك مصنع السلام في **معرض القاهرة الدولي** للصناعات الغذائية.\n\n> نفخر بمشاركتنا في هذا الحدث الدولي الكبير	# Cairo Food Exhibition\n\nElsalam Factory participated in **Cairo International Food Exhibition**.	exhibitions	معارض, تصدير	\N	\N	\N	\N	f	t	2026-03-13 20:47:08.76	\N	2026-03-13 20:47:08.761	2026-03-13 20:47:08.761
1	new-production-line-2026	مصنع السلام يفتتح خط إنتاج جديد بأحدث التقنيات العالمية	Elsalam Factory Opens New Production Line with Latest Global Technologies	أعلن مصنع السلام للزيوت النباتية عن افتتاح خط إنتاج جديد بأحدث التقنيات العالمية لتلبية احتياجات السوق المتزايدة	Elsalam Factory for Vegetable Oils announced the opening of a new production line with the latest global technologies	# افتتاح خط إنتاج جديد\n\nأعلن مصنع السلام للزيوت النباتية عن افتتاح **خط إنتاج جديد** بأحدث التقنيات العالمية.\n\n## أبرز مميزات خط الإنتاج الجديد\n\n- طاقة إنتاجية تصل إلى 500 طن يومياً\n- تقنيات تكرير متقدمة تضمن أعلى معايير الجودة\n- نظام تعبئة آلي بالكامل\n- مراقبة جودة رقمية على مدار الساعة	# New Production Line Opening\n\nElsalam Factory announced the opening of a **new production line** with latest global technologies.\n\n## Key Features\n\n- Production capacity up to 500 tons daily\n- Advanced refining technology ensuring highest quality standards\n- Fully automated packaging system\n- 24/7 digital quality monitoring	news	إنتاج, تكنولوجيا, توسع	\N	\N	مصنع السلام يفتتح خط إنتاج جديد | أخبار المصنع	أعلن مصنع السلام للزيوت النباتية عن افتتاح خط إنتاج جديد بطاقة 500 طن يومياً بأحدث التقنيات العالمية	t	t	2026-04-17 15:39:45.108	\N	2026-03-13 20:47:08.592	2026-04-17 15:39:45.249
3	quality-certification-iso	مصنع السلام يحصل على شهادة الأيزو لأول مرة	Elsalam Factory Receives ISO Certification for First Time	حصل مصنع السلام على شهادة ISO 22000 لسلامة الغذاء	\N	\N	\N	news	جودة, أيزو, شهادات	\N	\N	\N	\N	f	t	2026-04-17 15:39:45.108	\N	2026-03-13 20:47:08.871	2026-04-17 15:39:45.249
4	iso-22000-certification	حصول مصنع السلام على شهادة أيزو 22000 في سلامة الغذاء	Elsalam Factory achieves ISO 22000 certification in food safety	إنجاز جديد يضاف لسجل مصنع السلام بالحصول على أرفع الشهادات الدولية في إدارة سلامة الغذاء، مما يؤكد التزامنا المطلق بالجودة.	A new achievement added to Elsalam Factory’s record by obtaining the highest international certifications in food safety management.	<p>في إطار سعينا المستمر نحو التميز وتقديم منتجات ترقى لأعلى المعايير العالمية، نفخر بالإعلان عن حصول مصنع السلام للزيوت النباتية على شهادة <strong>الأيزو 22000</strong> لإدارة سلامة الغذاء.</p><p>هذه الشهادة ليست مجرد ورقة، بل هي تكليل لجهود فريق العمل في تطبيق أقصى معايير الرقابة الصارمة في كل مراحل الإنتاج بدءاً من اختيار البذور وحتى تعبئة المنتج النهائي.</p>	<p>As part of our continuous pursuit of excellence, we are proud to announce that Elsalam Vegetable Oils Factory has obtained the <strong>ISO 22000</strong> certification for food safety management.</p><p>This certification is a culmination of our team’s efforts in applying the strictest control standards at every stage of production.</p>	quality	\N	https://images.unsplash.com/photo-1518349619113-03114f06ac3a?q=80&w=1200&auto=format&fit=crop	\N	\N	\N	t	t	2026-05-01 10:00:00	\N	2026-05-04 04:03:49.926	2026-05-04 04:03:49.926
5	global-expansion-europe-africa	توسع عالمي: مصنع السلام يفتتح أسواقاً جديدة في أوروبا وإفريقيا	Global Expansion: Elsalam opens new markets in Europe and Africa	استكمالاً لرؤية 2030، نجحنا في توقيع عقود تصديرية ضخمة للوصول بمنتجاتنا إلى 5 دول أوروبية وإفريقية جديدة.	In line with our 2030 vision, we have successfully signed massive export contracts to reach 5 new European and African countries.	<p>استكمالاً لرؤيتنا الاستراتيجية في التوسع العالمي، يسرنا الإعلان عن نجاح مصنع السلام في اختراق أسواق جديدة في كل من قارتي أوروبا وإفريقيا.</p><p>يعكس هذا التوسع ثقة المستهلكين والمستوردين في جودة الزيوت المصرية ومطابقتها للمواصفات الدولية المعتمدة.</p>	<p>In continuation of our strategic vision for global expansion, we are pleased to announce Elsalam’s success in penetrating new markets in Europe and Africa.</p><p>This expansion reflects the confidence of importers in the quality of Egyptian oils.</p>	export	\N	https://images.unsplash.com/photo-1586528116311-ad8ed7c80a30?q=80&w=1200&auto=format&fit=crop	\N	\N	\N	f	t	2026-04-28 09:30:00	\N	2026-05-04 04:03:50.048	2026-05-04 04:03:50.048
6	green-industry-initiative	مبادرة "صناعة خضراء": كيف يساهم مصنع السلام في تقليل الانبعاثات الكربونية؟	"Green Industry" initiative: How Elsalam reduces carbon emissions	تعرف على التحديثات التقنية الجديدة في خطوط الإنتاج والتي خفضت استهلاك الطاقة بنسبة 30٪ كجزء من مسؤوليتنا البيئية.	Learn about the new technical updates in production lines that reduced energy consumption by 30% as part of our environmental responsibility.	<p>إيماناً منا بدور الصناعة في الحفاظ على كوكب الأرض، أطلق مصنع السلام مبادرة <strong>صناعة خضراء</strong>.</p><p>حيث قمنا بتحديث منظومة الغلايات ومحطات توليد البخار بأحدث التقنيات الموفرة للطاقة، ما أثمر عن خفض الانبعاثات الكربونية بشكل ملحوظ.</p>	<p>Believing in the role of industry in protecting the planet, Elsalam has launched the <strong>Green Industry</strong> initiative.</p><p>We have updated our boiler systems with the latest energy-saving technologies, significantly reducing our carbon footprint.</p>	sustainability	\N	https://images.unsplash.com/photo-1473448912268-2022ce9509d8?q=80&w=1200&auto=format&fit=crop	\N	\N	\N	t	t	2026-04-25 11:00:00	\N	2026-05-04 04:03:50.051	2026-05-04 04:03:50.051
7	new-production-line	افتتاح خط إنتاج جديد لتعبئة زيوت الطعام بطاقة مضاعفة	Opening a new cooking oil bottling line with double capacity	لضمان تلبية الطلب المتزايد محلياً وعالمياً، دشن مصنع السلام خط إنتاج آلي بالكامل يعمل وفق أحدث التكنولوجيا الألمانية.	To meet growing local and global demand, Elsalam inaugurated a fully automated production line using the latest German technology.	<p>في حفل كبير حضره رواد الصناعة، تم الإعلان رسمياً عن بدء تشغيل خط التعبئة الآلي الجديد والذي يعمل بطاقة إنتاجية مضاعفة.</p><p>هذا الخط يضمن تدخلاً بشرياً منعدماً (Zero Human Contact) مما يحقق أقصى درجات النظافة والتعقيم لكل عبوة.</p>	<p>In a grand ceremony attended by industry leaders, we officially announced the start of our new automated bottling line with double the production capacity.</p><p>This line ensures zero human contact, achieving maximum hygiene and sterilization.</p>	production	\N	https://images.unsplash.com/photo-1596524430615-b46475ddff6e?q=80&w=1200&auto=format&fit=crop	\N	\N	\N	f	t	2026-04-20 14:15:00	\N	2026-05-04 04:03:50.052	2026-05-04 04:03:50.052
8	gulfood-dubai-2026	مشاركة بارزة لمصنع السلام في معرض جلفود دبي 2026	Prominent participation of Elsalam Factory in Gulfood Dubai 2026	تألق جناحنا في معرض جلفود دبي عبر عرض مجموعة متنوعة من الزيوت والسمن، ولقاءات مثمرة مع مستثمرين من جميع أنحاء العالم.	Our pavilion shined at Gulfood Dubai by displaying a variety of oils and ghee, with fruitful meetings with investors worldwide.	<p>اختتم مصنع السلام مشاركته الناجحة في معرض <strong>جلفود دبي 2026</strong>، المعرض الأضخم في قطاع الأغذية والمشروبات.</p><p>وقد استقبل جناحنا مئات الزوار يومياً، وعُقدت صفقات مبدئية مع مستوردين من دول الخليج وشرق آسيا.</p>	<p>Elsalam Factory concluded its successful participation in <strong>Gulfood Dubai 2026</strong>, the largest F&B exhibition.</p><p>Our pavilion welcomed hundreds of visitors daily, securing initial deals with importers from the Gulf and East Asia.</p>	events	\N	https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200&auto=format&fit=crop	\N	\N	\N	t	t	2026-04-15 12:00:00	\N	2026-05-04 04:03:50.055	2026-05-04 04:03:50.055
9	launch-trans-fat-free-ghee	إطلاق منتج "سمن السلام" الجديد بتقنية خالية من الدهون المتحولة	Launch of the new "Elsalam Ghee" with trans-fat-free technology	استجابة لمتطلبات الصحة الحديثة، نفخر بتقديم الجيل الجديد من السمن النباتي الصحي والخالي تماماً من الدهون المتحولة.	In response to modern health demands, we are proud to introduce the new generation of healthy, trans-fat-free vegetable ghee.	<p>حرصاً على صحة عملائنا، قام قسم البحث والتطوير (R&D) لدينا بابتكار تركيبة فريدة لمنتج <strong>سمن السلام</strong> ليكون خالي تماماً من الدهون المتحولة (Trans-fat Free).</p><p>المنتج الجديد يوفر نفس الطعم الرائع والقوام الممتاز للطبخ والحلويات ولكن بفوائد صحية أكبر.</p>	<p>Caring for our customers’ health, our R&D department has innovated a unique formula for <strong>Elsalam Ghee</strong> to be completely Trans-fat Free.</p><p>The new product offers the same great taste and texture for cooking and baking but with greater health benefits.</p>	news	\N	https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=1200&auto=format&fit=crop	\N	\N	\N	f	t	2026-04-10 08:45:00	\N	2026-05-04 04:03:50.057	2026-05-04 04:03:50.057
10	strategic-partnership-b2b	شراكة استراتيجية مع كبرى مصانع الأغذية لتوريد شورتنج المخابز	Strategic partnership with major food factories to supply bakery shortening	تتويجاً لجهود قطاع المبيعات البينية (B2B)، تم توقيع عقد شراكة طويلة الأمد مع مجموعة من كبرى مصانع الحلويات والمخبوزات.	Crowning the efforts of our B2B sector, a long-term partnership contract was signed with a group of major confectionery and bakery factories.	<p>أعلن قطاع المبيعات في مصنع السلام عن توقيع عقود توريد ضخمة لمنتجات <strong>الشورتنج المتخصص</strong> المستخدم في صناعة المخبوزات والحلويات.</p><p>تأتي هذه الخطوة لتؤكد أن السلام هو الشريك المفضل للكيانات الصناعية الكبرى التي تبحث عن الجودة المستدامة والاعتمادية.</p>	<p>The sales sector at Elsalam announced the signing of massive supply contracts for <strong>Specialized Shortening</strong> used in the bakery and confectionery industry.</p><p>This step confirms that Elsalam is the preferred partner for large industrial entities seeking sustainable quality and reliability.</p>	news	\N	https://images.unsplash.com/photo-1556761175-5973dc0f32b7?q=80&w=1200&auto=format&fit=crop	\N	\N	\N	t	t	2026-04-05 15:30:00	\N	2026-05-04 04:03:50.06	2026-05-04 04:03:50.06
13	industrial-excellence-award	فوز مصنع السلام بجائزة التميز الصناعي للعام الثاني على التوالي	Elsalam Factory wins the Industrial Excellence Award for the second consecutive year	تكريم جديد يضاف لمسيرتنا من غرفة الصناعات الغذائية تقديراً لجهودنا في تطوير قطاع الزيوت النباتية في مصر.	A new honor added to our journey by the Chamber of Food Industries in recognition of our efforts to develop the vegetable oils sector in Egypt.	<p>في حفل بهيج، تسلمت إدارة مصنع السلام <strong>جائزة التميز الصناعي</strong> لعام 2025/2026.</p><p>يعد هذا الفوز للعام الثاني على التوالي دليلاً قاطعاً على التزامنا برؤية مستدامة، وجودة لا تتزعزع، ومساهمة فعالة في الاقتصاد الوطني.</p>	<p>In a joyful ceremony, Elsalam’s administration received the <strong>Industrial Excellence Award</strong> for the year 2025/2026.</p><p>Winning this for the second consecutive year is conclusive evidence of our sustainable vision, unwavering quality, and effective contribution to the national economy.</p>	news	\N	/uploads/modern_oil_factory.png	\N	\N	\N	t	t	2026-03-01 20:00:00	\N	2026-05-04 04:03:50.065	2026-05-04 14:43:05.806
11	elsalam-for-good-ramadan	حملة "السلام للخير" لدعم المجتمع المحلي في شهر رمضان	"Elsalam for Good" campaign to support the local community during Ramadan	توزيع الآلاف من كراتين المواد الغذائية التي تتضمن منتجاتنا على الأسر الأكثر احتياجاً كجزء من دورنا المجتمعي.	Distributing thousands of food boxes featuring our products to families in need as part of our corporate social responsibility.	<p>استمراراً لنهج العطاء، أطلقت إدارة المصنع حملة <strong>السلام للخير</strong> بمناسبة شهر رمضان المبارك.</p><p>حيث شارك موظفونا في تعبئة وتوزيع آلاف الكراتين التموينية، مؤكدين أن نجاحنا الحقيقي يكمن في إحداث تأثير إيجابي في مجتمعنا المحيط.</p>	<p>Continuing our tradition of giving, the factory administration launched the <strong>Elsalam for Good</strong> campaign on the occasion of the holy month of Ramadan.</p><p>Our employees participated in packing and distributing thousands of food boxes, proving our commitment to positive social impact.</p>	events	\N	/uploads/global_logistics_export.png	\N	\N	\N	f	t	2026-03-25 13:20:00	\N	2026-05-04 04:03:50.062	2026-05-04 14:43:06.027
12	technology-in-labs	التكنولوجيا في خدمة الجودة: أحدث أجهزة الفحص في معامل السلام	Technology at the service of quality: Latest inspection devices in Elsalam labs	استثمارات بملايين الجنيهات لتجهيز معامل المصنع بأحدث أجهزة الكروماتوجرافيا لضمان نقاء الزيوت وخلوها من الشوائب.	Multi-million investments to equip the factory’s labs with the latest chromatography devices to ensure oil purity.	<p>لضمان بقائنا في صدارة المنافسة، قمنا مؤخراً بتحديث شامل لمعامل الجودة المركزية داخل المصنع.</p><p>تم تزويد المعامل بأجهزة كروماتوجرافيا الغاز والسائل المتطورة جداً، والتي تستطيع تحليل مكونات الزيت بدقة متناهية والتأكد من مطابقتها القياسية.</p>	<p>To ensure we remain at the forefront of competition, we recently undertook a comprehensive upgrade of our central quality labs.</p><p>The labs were equipped with highly advanced gas and liquid chromatography devices, analyzing oil components with extreme precision.</p>	quality	\N	/uploads/premium_oil_raw_materials.png	\N	\N	\N	f	t	2026-03-15 09:00:00	\N	2026-05-04 04:03:50.063	2026-05-04 14:43:05.923
\.


--
-- Data for Name: OrderItem; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."OrderItem" (id, "orderId", "productId", quantity, "unitPrice", subtotal) FROM stdin;
\.


--
-- Data for Name: OutboxEvent; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."OutboxEvent" (id, type, payload, status, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: PageContent; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."PageContent" (id, "pageSlug", content, "createdAt", "updatedAt", version) FROM stdin;
cmo61zehm0000rta8xxihot4c	about	{\n  "hero": {\n    "title_ar": "عن مصنع السلام",\n    "title_en": "About Elsalam Factory",\n    "subtitle_ar": "أكثر من 25 عاماً من الريادة في صناعة الزيوت النباتية والسمن والشورتنج",\n    "subtitle_en": "Over 25 years of leadership in the vegetable oils, margarine & shortening industry",\n    "badge_ar": "من نحن",\n    "badge_en": "About Us",\n    "backgroundImage": "/uploads/upload_1776643103718_x1k9vw.jfif"\n  },\n  "story": {\n    "title_ar": "قصتنا",\n    "title_en": "Our Story",\n    "paragraph1_ar": "تأسس مصنع السلام لعصر واستخلاص الزيوت النباتية عام 2000 في المنطقة الصناعية بمصر. بدأنا بخط إنتاج واحد ورؤية واضحة: تقديم زيوت نباتية بجودة عالمية وأسعار منافسة. واليوم، نفخر بامتلاك 8 خطوط إنتاج بطاقة 500 طن يومياً، ونصدّر إلى أكثر من 15 دولة.",\n    "paragraph1_en": "Elsalam Factory for Extracting and Refining Vegetable Oils was established in 2000 in the Industrial Zone, Egypt. We started with a single production line and a clear vision: to provide world-class vegetable oils at competitive prices. Today, we proudly operate 8 production lines with a daily capacity of 500 MT, exporting to over 15 countries.",\n    "paragraph2_ar": "نحن ملتزمون بالاستدامة والابتكار المستمر، مع استثمارات مستمرة في تطوير خطوط الإنتاج ومعامل الجودة لضمان مطابقة منتجاتنا لأعلى المواصفات القياسية المحلية والدولية.",\n    "paragraph2_en": "We are committed to sustainability and continuous innovation, consistently investing in our production lines and quality laboratories to ensure our products meet the highest local and international standards."\n  },\n  "timeline": {\n    "items": [\n      {\n        "year": "2000",\n        "title_ar": "التأسيس والانطلاق",\n        "title_en": "Foundation & Launch",\n        "description_ar": "بدأنا رحلتنا بخط إنتاج واحد للزيوت النباتية مع التركيز على تلبية احتياجات السوق المحلي بأعلى معايير الجودة.",\n        "description_en": "Began our journey with a single vegetable oil production line, focusing on meeting local market needs with the highest quality standards."\n      },\n      {\n        "year": "2008",\n        "title_ar": "توسعة خطوط التكرير",\n        "title_en": "Refinery Expansion",\n        "description_ar": "افتتاح خط التكرير المتطور لضمان النقاء التام والشفافية العالية لزيوتنا بمعايير أوروبية.",\n        "description_en": "Inaugurated a state-of-the-art refining line to ensure absolute purity and high transparency of our oils under European standards."\n      },\n      {\n        "year": "2015",\n        "title_ar": "دخول أسواق التصدير",\n        "title_en": "Entering Export Markets",\n        "description_ar": "حصولنا على شهادات الجودة العالمية وبلوغ طاقة إنتاجية سمحت لنا ببدء التصدير الناجح لدول أفريقيا والشرق الأوسط.",\n        "description_en": "Achieved international quality certifications and production capacity that enabled successful exports to Africa and the Middle East."\n      },\n      {\n        "year": "2020",\n        "title_ar": "إطلاق السمن والشورتنج",\n        "title_en": "Ghee & Shortening Launch",\n        "description_ar": "تنويع محفظة المنتجات لتشمل السمن النباتي الممتاز وشورتنج المخابز المتخصص لتلبية القطاع الصناعي.",\n        "description_en": "Diversified the product portfolio to include premium vegetable ghee and specialized bakery shortening to supply the industrial sector."\n      },\n      {\n        "year": "2025",\n        "title_ar": "الريادة والاستدامة",\n        "title_en": "Leadership & Sustainability",\n        "description_ar": "الوصول لطاقة 500 طن يومياً مع تصدير مستمر لـ 15 دولة وتطبيق سياسات إنتاج خضراء ومستدامة.",\n        "description_en": "Reached 500 MT daily capacity with continuous exports to 15+ countries, implementing green and sustainable production policies."\n      }\n    ]\n  },\n  "ceo": {\n    "name_ar": "محمد إسماعيل إدريس",\n    "name_en": "Mohamed Ismail Idris",\n    "role_ar": "رئيس مجلس إدارة مصنع السلام لعصر واستخلاص الزيوت النباتية",\n    "role_en": "Chairman of the Board, Elsalam Factory for Vegetable Oils and Refining",\n    "quote_ar": "نؤمن أن الجودة ليست خياراً بل هي التزام. رؤيتنا أن نكون الشريك الأول لكل مصنع ومطعم وموزع يبحث عن زيوت نباتية بمعايير عالمية مصنوعة في مصر.",\n    "quote_en": "We believe quality is an obligation, not an option. Our vision is to be the premier partner for every factory, restaurant, and distributor seeking world-class vegetable oils made in Egypt.",\n    "educationDesc_ar": "تخرج السيد محمد إسماعيل إدريس من جامعة الإسكندرية عام 1990، وبدأ مسيرته المهنية في مجال المبيعات، حيث أظهر منذ بداياته شغفًا واضحًا بمجال التسويق وبناء العلامات التجارية وتعزيز الحصة السوقية للشركات.",\n    "educationDesc_en": "Mr. Mohamed Ismail Idris graduated from Alexandria University in 1990 and began his professional career in sales, where he demonstrated a clear passion for marketing, brand building, and expanding market share from the very beginning.",\n    "careerStations": [\n      {\n        "title_ar": "شركة كوكاكولا – الإسكندرية (1990–1992)",\n        "title_en": "Coca-Cola Company – Alexandria (1990–1992)",\n        "role_ar": "مشرف مبيعات",\n        "role_en": "Sales Supervisor",\n        "desc_ar": "توسيع الحصة السوقية، زيادة المبيعات، تطبيق تقنيات تسويق مبتكرة",\n        "desc_en": "Expanded market share, increased sales, implemented innovative marketing techniques",\n        "image": "/uploads/upload_1776634969823_pkokrf.jpg"\n      },\n      {\n        "title_ar": "شركة العوجان – المملكة العربية السعودية (1993–1995)",\n        "title_en": "Aujan Industries – Saudi Arabia (1993–1995)",\n        "role_ar": "مشرف التموين",\n        "role_en": "Catering Supervisor",\n        "desc_ar": "أسّس قسم التموين بالشركة، وساهم في إدخال منتجات (راني، فيمتو، شوكولاتة كادبوري) إلى قطاعات الفنادق والمطاعم والمستشفيات والقطاع العسكري، والخطوط الجوية السعودية.",\n        "desc_en": "Founded the company's Catering Department, successfully introducing products (Rani, Vimto, Cadbury chocolate) to hotels, restaurants, hospitals, the military sector, and Saudi Arabian Airlines.",\n        "image": "/uploads/upload_1776634996004_uviykm.webp"\n      },\n      {\n        "title_ar": "شركة باعشن – السعودية (1995–1997)",\n        "title_en": "Baeshen Company – Saudi Arabia (1995–1997)",\n        "role_ar": "مدير المنطقة الشمالية",\n        "role_en": "Northern Region Manager",\n        "desc_ar": "قاد جهود تسويق علامة شاي ربيع، وأسهم في إطلاق وتوسيع انتشار المنتج في السوق السعودي.",\n        "desc_en": "Led the marketing efforts for Rabea Tea brand, contributing to the launch and extensive expansion of the product in the Saudi market.",\n        "image": "/uploads/upload_1776635060394_u8uwk5.jfif"\n      },\n      {\n        "title_ar": "شركة نستله مصر (1998)",\n        "title_en": "Nestle Egypt (1998)",\n        "role_ar": "مدير المبيعات - الإسكندرية",\n        "role_en": "Sales Manager - Alexandria",\n        "desc_ar": "أشرف على توزيع المنتجات الجافة (نسكافيه، نيدو، سيريلاك، شوكولاتة نستله) وعزز انتشار العلامة محليًا.",\n        "desc_en": "Supervised the distribution of dry products (Nescafe, Nido, Cerelac, Nestle chocolate) and enhanced the brand's local presence.",\n        "image": "/uploads/upload_1776635088623_5j5aj6.png"\n      },\n      {\n        "title_ar": "شركة صافولا سايم داربي (1999–2001)",\n        "title_en": "Savola Sime Darby (1999–2001)",\n        "role_ar": "مدير مبيعات القطاع الصناعي",\n        "role_en": "Industrial Sector Sales Manager",\n        "desc_ar": "ركز على توزيع زيت النخيل للصناعات الغذائية وقدم حلولًا صناعية مبتكرة من خلال إعادة تدوير مشتقات الزيت.",\n        "desc_en": "Focused on distributing palm oil to the food industry and introduced innovative industrial solutions by recycling oil derivatives.",\n        "image": "/uploads/upload_1776635112855_q157ia.webp"\n      }\n    ],\n    "entrepreneurshipDesc_ar": "في عام 2002، اتخذ السيد محمد إدريس خطوة جريئة بتأسيس شركة السلام كشركة متخصصة في تجارة وتكرير الزيوت النباتية وتوريد المواد الخام للمصانع الكبرى والمطاعم.",\n    "entrepreneurshipDesc_en": "In 2002, Mr. Mohamed Idris took a bold step by founding Elsalam Company as a specialized entity in trading and refining vegetable oils and supplying raw materials to major factories and restaurants.",\n    "expansionDesc_ar": "توسعت الشركة في توزيع زيت النخيل والشورتنج والمارجرين، وخدمة أكثر من 135 مصنعًا في مصر. وفي عام 2020، تم افتتاح مصنع حديث بدمنهور مزود بأحدث خطوط الإنتاج.",\n    "expansionDesc_en": "The company expanded into distributing palm oil, shortening, and margarine, serving over 135 factories in Egypt. In 2020, a modern factory was inaugurated in Damanhour, equipped with the latest production lines.",\n    "innovationPoints": [\n      {\n        "text_ar": "إدخال الشورتنج في إنتاج الأجبان",\n        "text_en": "Introducing shortening in cheese production"\n      },\n      {\n        "text_ar": "تطوير حلول صناعية لصناعة الأغذية",\n        "text_en": "Developing industrial solutions for the food industry"\n      },\n      {\n        "text_ar": "استثمار مخلفات زيت النخيل في صناعة الصابون",\n        "text_en": "Investing palm oil derivatives in soap manufacturing"\n      },\n      {\n        "text_ar": "تطبيق نظام رقابة جودة صارم في كل مراحل الإنتاج",\n        "text_en": "Implementing strictly monitored quality control across all production stages"\n      }\n    ],\n    "visionDesc_ar": "يهدف إلى الريادة في صناعة الزيوت والدهون الطبيعية في مصر والشرق الأوسط، معتمداً على بناء شراكات استراتيجية طويلة الأمد، دعم الصناعات الصغيرة، والالتزام بالمسؤولية المجتمعية.",\n    "visionDesc_en": "His vision is to lead the vegetable oils and natural fats industry in Egypt and the Middle East, relying on building long-term strategic partnerships, supporting small industries, and committing to social responsibility.",\n    "leadershipPoints": [\n      {\n        "text_ar": "خبرة تتجاوز 30 عامًا في قطاع الأغذية",\n        "text_en": "Over 30 years of experience in the food sector"\n      },\n      {\n        "text_ar": "خلفية قوية في المبيعات الصناعية",\n        "text_en": "Strong background in industrial sales"\n      },\n      {\n        "text_ar": "قدرة على بناء شراكات استراتيجية",\n        "text_en": "Ability to build strategic partnerships"\n      },\n      {\n        "text_ar": "توجه ابتكاري في تطوير المنتجات",\n        "text_en": "Innovative approach to product development"\n      },\n      {\n        "text_ar": "دعم حقيقي للصناعات الصغيرة والمتوسطة",\n        "text_en": "Genuine support for small and medium-sized industries"\n      }\n    ],\n    "image": "/uploads/upload_1777799973239_8vhq9o.png"\n  },\n  "gallery": {\n    "title_ar": "جولة في المصنع",\n    "title_en": "Factory Tour",\n    "subtitle_ar": "نظرة على خطوط الإنتاج ومرافق الجودة",\n    "subtitle_en": "A look at our production lines and quality facilities",\n    "items": [\n      {\n        "title_ar": "خط إنتاج الزيوت الآلي",\n        "title_en": "Automated Oil Production Line",\n        "url": "/uploads/upload_1776643156622_joaqhw.jfif"\n      },\n      {\n        "title_ar": "معامل رقابة الجودة",\n        "title_en": "Quality Control Labs",\n        "url": "/uploads/upload_1776643556377_mlqu6e.jfif"\n      },\n      {\n        "title_ar": "خزانات التخزين",\n        "title_en": "Storage Tanks",\n        "url": "/uploads/upload_1776643692457_kvhcm0.jfif"\n      },\n      {\n        "title_ar": "خط تعبئة العبوات",\n        "title_en": "Bottle Filling Line",\n        "url": "/uploads/upload_1776643846245_gg2zai.jfif"\n      },\n      {\n        "title_ar": "مستودعات الشحن",\n        "title_en": "Shipping Warehouses",\n        "url": "/uploads/upload_1776643951492_u4bpcp.jfif"\n      },\n      {\n        "title_ar": "منطقة استقبال المواد الخام",\n        "title_en": "Raw Material Reception Area",\n        "url": "/uploads/upload_1776644148629_oi3c0v.jfif"\n      },\n      {\n        "title_ar": "غرفة التحكم المركزية",\n        "title_en": "Central Control Room",\n        "url": "/uploads/upload_1776644200524_obw0ri.jfif"\n      },\n      {\n        "title_ar": "خط إنتاج السمن",\n        "title_en": "Ghee Production Line",\n        "url": "/uploads/upload_1776644483092_5m2czr.jfif"\n      }\n    ]\n  },\n  "team": {\n    "badge_ar": "شركاء النجاح",\n    "badge_en": "Partners in Success",\n    "title_ar": "فريق الإدارة العليا",\n    "title_en": "Executive Leadership",\n    "subtitle_ar": "نخبة من الكفاءات المتميزة التي تقود رؤيتنا نحو العالمية، وتضمن أعلى معايير الجودة والتميز في كافة قطاعات الشركة.",\n    "subtitle_en": "Our distinguished leadership driving our global vision and ensuring the highest standards of quality.",\n    "members": [\n      {\n        "name_ar": "ذكى السيد ذكي",\n        "name_en": "Zaki El-Sayed Zaki",\n        "role_ar": "مشرف المبيعات ",\n        "role_en": "Sales Supervisor",\n        "image": "/uploads/upload_1776621029870_2h0jss.jfif"\n      },\n      {\n        "name_ar": "وليد بيومي",\n        "name_en": "Walid Bayoumi ",\n        "role_ar": "مدير المبيعات ",\n        "role_en": "Sales Manager",\n        "image": "/uploads/upload_1776621270095_axlqdh.jfif"\n      },\n      {\n        "name_ar": "منة الله زكريا ",\n        "name_en": "Menat Allah Zakaria",\n        "role_ar": "مديرة الحسابات",\n        "role_en": "Accounts Manager",\n        "image": "/uploads/upload_1776629197489_t4qeu8.jfif"\n      },\n      {\n        "name_ar": "محمد عاطف",\n        "name_en": "Mohamed Atef",\n        "role_ar": "مدير الإنتاج",\n        "role_en": "Production Manager",\n        "image": "/uploads/upload_1776629419135_hu8pen.jfif"\n      },\n      {\n        "name_ar": "محمد الريفي",\n        "name_en": "Mohamed Elrifi",\n        "role_ar": "مدير الجودة",\n        "role_en": "Quality Manager",\n        "image": "/uploads/upload_1776630914066_sad8o6.jfif"\n      }\n    ]\n  }\n}	2026-04-19 17:41:54.575	2026-05-03 09:19:35.04	1
cmo3hgh5a0000rtls7rtsudmo	home	{\n  "heroSlides": {\n    "slides": [\n      {\n        "tabName_ar": "الجودة والإنتاج",\n        "tabName_en": "Quality & Production",\n        "badge_ar": "أكثر من 25 عاماً من الخبرة في عصر الزيوت",\n        "badge_en": "Over 25 years of experience in oil pressing",\n        "titleLine1_ar": "الريادة في عصر",\n        "titleLine1_en": "Leading in",\n        "titleLine2_ar": "الزيوت النباتية",\n        "titleLine2_en": "Vegetable Oils",\n        "subtitle_ar": "مصنع السلام يلتزم بتقديم أعلى معايير الجودة في إنتاج الزيوت، السمن والشورتنج للسوق المصري والعالمي بأحدث التقنيات الأوروبية.",\n        "subtitle_en": "Elsalam Factory is committed to the highest quality standards in producing oils, margarine & shortening for the Egyptian and international markets using the latest European technologies.",\n        "ctaPrimary_ar": "اكتشف منتجاتنا",\n        "ctaPrimary_en": "Explore Products",\n        "ctaPrimaryLink": "/products",\n        "ctaSecondary_ar": "شراكات التصدير",\n        "ctaSecondary_en": "Export Partnerships",\n        "ctaSecondaryLink": "/export",\n        "image": "/uploads/upload_1776465099444_4hgvjl.jfif"\n      },\n      {\n        "tabName_ar": "التصدير العالمي",\n        "tabName_en": "Global Export",\n        "badge_ar": "نصدر لأكثر من 15 دولة حول العالم",\n        "badge_en": "Exporting to 15+ countries worldwide",\n        "titleLine1_ar": "شريكك الموثوق في",\n        "titleLine1_en": "Your Trusted Partner in",\n        "titleLine2_ar": "التجارة الدولية",\n        "titleLine2_en": "Global Trade",\n        "subtitle_ar": "منتجات جاهزة للتصدير بأعلى المواصفات القياسية، مع لوجستيات متكاملة لتلبية متطلبات الأسواق العالمية بمرونة وكفاءة.",\n        "subtitle_en": "Export-ready products meeting the highest international standards, backed by integrated logistics to serve global markets with flexibility and efficiency.",\n        "ctaPrimary_ar": "دليل التصدير",\n        "ctaPrimary_en": "Export Guide",\n        "ctaPrimaryLink": "/export",\n        "ctaSecondary_ar": "تواصل معنا",\n        "ctaSecondary_en": "Contact Us",\n        "ctaSecondaryLink": "/contact",\n        "image": "/uploads/upload_1776467998203_e7lcwm.jfif"\n      },\n      {\n        "tabName_ar": "شراكات الجملة B2B",\n        "tabName_en": "B2B Partnerships",\n        "badge_ar": "طاقة إنتاجية تصل إلى 500 طن يومياً",\n        "badge_en": "Production capacity up to 500 tons/day",\n        "titleLine1_ar": "حلول صناعية",\n        "titleLine1_en": "Industrial Solutions at",\n        "titleLine2_ar": "بأسعار المصنع",\n        "titleLine2_en": "Factory Prices",\n        "subtitle_ar": "نوفر الزيوت، السمن، والشورتنج بكميات ضخمة وتعبئات مخصصة للمصانع، المخابز، وسلاسل المطاعم الكبرى.",\n        "subtitle_en": "We supply oils, margarine, and shortening in bulk quantities with custom packaging for factories, bakeries, and major restaurant chains.",\n        "ctaPrimary_ar": "طلب عرض سعر بالجملة",\n        "ctaPrimary_en": "Request Bulk Quote",\n        "ctaPrimaryLink": "/b2b/quote",\n        "ctaSecondary_ar": "مزايا الشراكة",\n        "ctaSecondary_en": "Partnership Benefits",\n        "ctaSecondaryLink": "/b2b",\n        "image": "/uploads/upload_1776468282395_galmqr.jfif"\n      }\n    ]\n  },\n  "stats": {\n    "items": [\n      {\n        "value": "25+",\n        "label_ar": "سنوات الخبرة",\n        "label_en": "Years of Experience"\n      },\n      {\n        "value": "500",\n        "label_ar": "طن إنتاج يومياً",\n        "label_en": "Tons Daily Production"\n      },\n      {\n        "value": "15+",\n        "label_ar": "دولة تصدير",\n        "label_en": "Export Countries"\n      },\n      {\n        "value": "200+",\n        "label_ar": "عميل صناعي",\n        "label_en": "Industrial Clients"\n      },\n      {\n        "value": "8",\n        "label_ar": "خطوط إنتاج",\n        "label_en": "Production Lines"\n      },\n      {\n        "value": "6",\n        "label_ar": "شهادات جودة",\n        "label_en": "Quality Certifications"\n      }\n    ]\n  },\n  "whyChooseUs": {\n    "badge_ar": "لماذا نحن؟",\n    "badge_en": "Why Us?",\n    "title_ar": "لماذا تختار",\n    "title_en": "Why Choose",\n    "titleHighlight_ar": "مصنع السلام",\n    "titleHighlight_en": "Elsalam Factory",\n    "subtitle_ar": "نبني شراكات استراتيجية موثوقة تعتمد على الجودة والالتزام المطلق",\n    "subtitle_en": "We build reliable strategic partnerships based on quality and absolute commitment",\n    "reasons": [\n      {\n        "title_ar": "طاقة إنتاجية ضخمة",\n        "title_en": "Massive Production Capacity",\n        "description_ar": "بقدرة إنتاجية تصل إلى 500 طن يومياً، نضمن تلبية كافة الطلبيات الكبرى للقطاع الصناعي والتجاري دون تأخير.",\n        "description_en": "With a production capacity of up to 500 tons per day, we guarantee fulfilling all major orders for the industrial and commercial sectors without delay."\n      },\n      {\n        "title_ar": "معايير جودة عالمية",\n        "title_en": "Global Quality Standards",\n        "description_ar": "حاصلون على أعلى شهادات الجودة وسلامة الغذاء الدولية، مما يضمن تصدير منتجاتنا لأكثر من 15 دولة.",\n        "description_en": "Certified with the highest international quality and food safety standards, ensuring our products are exported to over 15 countries."\n      },\n      {\n        "title_ar": "تقنيات تكرير متطورة",\n        "title_en": "Advanced Refining Technology",\n        "description_ar": "نستخدم أحدث تكنولوجيا التكرير لتحقيق أعلى درجات النقاء والشفافية، مع الحفاظ على القيمة الغذائية.",\n        "description_en": "We use the latest refining technology to achieve the highest levels of purity and transparency while preserving nutritional value."\n      },\n      {\n        "title_ar": "طبيعي 100%",\n        "title_en": "100% Natural",\n        "description_ar": "منتجاتنا خالية تماماً من المواد الحافظة والإضافات الكيميائية الضارة، لنقدم لك زيوتاً صحية وآمنة تماماً.",\n        "description_en": "Our products are completely free from preservatives and harmful chemical additives, offering you healthy and safe oils."\n      }\n    ]\n  },\n  "segments": {\n    "title_ar": "كيف يمكننا خدمتك؟",\n    "title_en": "How Can We Serve You?",\n    "subtitle_ar": "نقدم حلولاً مخصصة لكل قطاع",\n    "subtitle_en": "Customized solutions for every sector",\n    "items": [\n      {\n        "title_ar": "مصانع الأغذية",\n        "title_en": "Food Manufacturers",\n        "desc_ar": "حلول بالجملة مع مواصفات مخصصة لخطوط إنتاجك",\n        "desc_en": "Wholesale solutions with custom specs for your production lines",\n        "cta_ar": "طلب عرض سعر",\n        "cta_en": "Request Quote",\n        "image": "/uploads/upload_1776475289226_xm1xs1.jfif"\n      },\n      {\n        "title_ar": "فنادق ومطاعم",\n        "title_en": "Hotels & Restaurants",\n        "desc_ar": "منتجات HoReCa بتعبئات مناسبة ومواصفات عالمية",\n        "desc_en": "HoReCa products with suitable packaging & global specs",\n        "cta_ar": "تواصل معنا",\n        "cta_en": "Contact Us",\n        "image": "/uploads/upload_1776475687003_yhtbtt.jfif"\n      },\n      {\n        "title_ar": "التصدير العالمي",\n        "title_en": "Global Export",\n        "desc_ar": "منتجات جاهزة للتصدير بمطابقة كاملة للمعايير الدولية",\n        "desc_en": "Export-ready products fully compliant with international standards",\n        "cta_ar": "استفسار تصدير",\n        "cta_en": "Export Inquiry",\n        "image": "/uploads/upload_1776476028139_k7nnht.jfif"\n      },\n      {\n        "title_ar": "التجزئة والتوزيع",\n        "title_en": "Retail & Distribution",\n        "desc_ar": "أسعار تنافسية وتوصيل مباشر لنقاط البيع",\n        "desc_en": "Competitive prices with direct delivery to points of sale",\n        "cta_ar": "تسوق الآن",\n        "cta_en": "Shop Now",\n        "image": "/uploads/upload_1776477111361_80f9nd.jfif"\n      }\n    ]\n  },\n  "featuredProducts": {\n    "badge_ar": "أفضل المنتجات",\n    "badge_en": "Top Products",\n    "title_ar": "منتجاتنا الرائدة",\n    "title_en": "Our Leading Products",\n    "subtitle_ar": "تلبية لاحتياجات السوق المحلي والتصدير",\n    "subtitle_en": "Meeting local market and export needs",\n    "viewAll_ar": "عرض كل المنتجات",\n    "viewAll_en": "View All Products",\n    "products": [\n      {\n        "title_ar": "زيت صويا مكرر",\n        "title_en": "Refined Soybean Oil",\n        "subtitle": "Refined Soybean Oil",\n        "description_ar": "زيت صويا نقي وعالي الجودة مناسب للطهي والقلي المتكرر.",\n        "description_en": "Pure and high-quality soybean oil suitable for cooking and repeated frying.",\n        "slug": "http://localhost:3000/products?category=soybean-oil-",\n        "image": "/uploads/upload_1776470693226_ch171n.jfif"\n      },\n      {\n        "title_ar": "سمن نباتي ممتاز",\n        "title_en": "Premium Vegetable Ghee",\n        "subtitle": "Vegetable Ghee",\n        "description_ar": "سمن نباتي بقوام كريمي ونكهة غنية تضفي طعماً مميزاً.",\n        "description_en": "Vegetable ghee with a creamy texture and rich flavor that adds a distinct taste.",\n        "slug": "vegetable-ghee",\n        "image": "/uploads/upload_1776470997067_72x4rn.jfif"\n      },\n      {\n        "title_ar": "زيت عباد الشمس",\n        "title_en": "Sunflower Oil",\n        "subtitle": "Sunflower Oil",\n        "description_ar": "زيت خفيف وصحي مثالي للاستخدام اليومي والسلطات.",\n        "description_en": "Light and healthy oil ideal for daily use and salads.",\n        "slug": "sunflower-oil",\n        "image": "/uploads/upload_1776471333243_erxh32.jfif"\n      },\n      {\n        "title_ar": "شورتنج المخابز",\n        "title_en": "Bakery Shortening",\n        "subtitle": "Bakery Shortening",\n        "description_ar": "شورتنج متخصص للحلويات والمخبوزات يعطي هشاشة فائقة.",\n        "description_en": "Specialized shortening for sweets and baked goods providing superior crispness.",\n        "slug": "bakery-shortening",\n        "image": "/uploads/upload_1776471821886_33wzg9.jfif"\n      }\n    ]\n  },\n  "ourProcess": {\n    "badge_ar": "آلية الإنتاج والجودة",\n    "badge_en": "Our Process",\n    "title_ar": "من البذرة إلى المائدة.. رحلة الجودة",\n    "title_en": "From Seed to Shelf",\n    "subtitle_ar": "نميز أنفسنا بتشغيل أحد أكثر المنشآت تطوراً وأتمتة في المنطقة، لنضمن أن كل قطرة مطابقة للمعايير العالمية.",\n    "subtitle_en": "We operate one of the most technologically advanced automated facilities in the region, ensuring every drop meets global benchmarks.",\n    "steps": [\n      {\n        "image": "/uploads/upload_1776472340208_t9dmw2.jfif",\n        "title_en": "Careful Seed Selection",\n        "title_ar": "اختيار أفضل البذور",\n        "description_en": "We source only the highest quality, non-GMO seeds from trusted global partners to ensure the foundation of our oils is flawless.",\n        "description_ar": "نعتمد على أجود أنواع البذور غير المعدلة وراثياً من موردين عالميين موثوقين، لنضمن أن أساس زيوتنا مثالي."\n      },\n      {\n        "image": "/uploads/upload_1776472924543_3v286e.jfif",\n        "title_en": "Advanced Double Refining",\n        "title_ar": "تكرير متميز ومزدوج",\n        "description_en": "Utilizing state-of-the-art European machinery, our oil undergoes multiple stages of refining, neutralizing, and deodorizing for ultimate purity.",\n        "description_ar": "باستخدام أحدث الآلات الأوروبية، يمر زيتها بمراحل دقيقة من التكرير والتعادل وإزالة الرائحة لضمان النقاء المطلق."\n      },\n      {\n        "image": "/uploads/upload_1776473188317_uw6tsp.jfif",\n        "title_en": "Rigorous Labs & QC",\n        "title_ar": "فحوصات الجودة الصارمة",\n        "description_en": "Every batch is meticulously analyzed in our on-site laboratories against strict international ISO & HACCP standards.",\n        "description_ar": "تُحلل كل دفعة إنتاجية بدقة متناهية في مختبراتنا المجهزة، وفقاً لأعلى معايير الأيزو ونظام الهاسب (HACCP)."\n      },\n      {\n        "image": "/uploads/upload_1776473676483_gg90tq.jfif",\n        "title_en": "Hygienic Packaging in Compliance with Quality Standards",\n        "title_ar": "تعبئة صحية وفق معايير الجودة",\n        "description_en": "Hygienic Packaging According to the Highest Standards",\n        "description_ar": "تعبئة صحية وفق أعلى المعايير"\n      }\n    ]\n  },\n  "globalFootprint": {\n    "title_ar": "البصمة العالمية",\n    "title_en": "Global Footprint",\n    "subtitle_ar": "نصدر لأكثر من 15 دولة حول العالم",\n    "subtitle_en": "We export to over 15 countries worldwide"\n  },\n  "sustainability": {\n    "title_ar": "الاستدامة والمسؤولية البيئية",\n    "title_en": "Sustainability & Environmental Responsibility",\n    "subtitle_ar": "نلتزم بأعلى معايير الاستدامة في عمليات الإنتاج",\n    "subtitle_en": "We are committed to the highest sustainability standards in our production processes",\n    "image": "/uploads/upload_1776477923691_sm53cx.jfif"\n  },\n  "virtualTour": {\n    "title_ar": "الجولة الافتراضية",\n    "title_en": "Virtual Tour",\n    "subtitle_ar": "تعرف على مصنعنا من الداخل",\n    "subtitle_en": "Explore our factory from the inside",\n    "isVisible": false\n  },\n  "packaging": {\n    "badge_ar": "خيارات التعبئة",\n    "badge_en": "Packaging Options",\n    "title_ar": "عبوات تلبي كافة احتياجاتك",\n    "title_en": "Packaging for Every Need",\n    "subtitle_ar": "نوفر خيارات تعبئة مرنة ومتنوعة تناسب جميع القطاعات من التجزئة وحتى الشحن البحري للصناعات الكبرى.",\n    "subtitle_en": "We provide flexible and diverse packaging options suitable for all sectors, from retail to bulk maritime shipping for major industries.",\n    "types": [\n      {\n        "title_ar": "عبوات بلاستيكية (PET)",\n        "title_en": "PET Plastic Bottles",\n        "sizes_ar": "1، 2، 5 لتر",\n        "sizes_en": "1, 2, 5 liters",\n        "description_ar": "مثالية لتطبيقات التجزئة والأسواق الاستهلاكية والاستخدام المنزلي.",\n        "description_en": "Ideal for retail applications, consumer markets, and household use.",\n        "image": "/uploads/upload_1776481345801_9ja2xu.jfif"\n      },\n      {\n        "title_ar": "تنكات صفيح",\n        "title_en": "Tin Cans",\n        "sizes_ar": "16 لتـر، 18 لتـر",\n        "sizes_en": "16L, 18L",\n        "description_ar": "الخيار الأمثل للمطاعم والفنادق (HoReCa) المعتمدة على الاستهلاك الكثيف.",\n        "description_en": "The optimal choice for restaurants and hotels (HoReCa) with heavy consumption.",\n        "image": "/uploads/upload_1776481632761_jc667m.jfif"\n      },\n      {\n        "title_ar": "براميـل حديدية",\n        "title_en": "Steel Drums",\n        "sizes_ar": "200 لتـر",\n        "sizes_en": "200L",\n        "description_ar": "تعبئة اقتصادية للمصانع الغذائية ومصانع الحلويات والمخابز الكبرى.",\n        "description_en": "Economical packaging for food factories, confectioneries, and large bakeries.",\n        "image": "/uploads/upload_1776481868312_fno49e.jfif"\n      },\n      {\n        "title_ar": "فليكسي تانك",\n        "title_en": "Flexitank",\n        "sizes_ar": "22,000 لتـر",\n        "sizes_en": "22,000L",\n        "description_ar": "الحل الاستراتيجي لتصدير كميات ضخمة للشحن البحري بأقل تكلفة لوجستية.",\n        "description_en": "The strategic solution for exporting large quantities via maritime shipping at the lowest logistics cost.",\n        "image": "/uploads/upload_1776482319857_icf4mt.jfif"\n      }\n    ]\n  },\n  "certifications": {\n    "badge_ar": "الجودة والامتثال",\n    "badge_en": "Quality & Compliance",\n    "title_ar": "شهادات الجودة والاعتمادات الدولية",\n    "title_en": "Quality Certifications & International Accreditations",\n    "subtitle_ar": "نفخر بحصولنا على أعلى الشهادات العالمية التي تضمن جودة وسلامة منتجاتنا",\n    "subtitle_en": "We are proud to hold the highest international certifications ensuring the quality and safety of our products",\n    "certs": [\n      {\n        "name_ar": "ISO 9001",\n        "name_en": "ISO 9001",\n        "desc_ar": "إدارة الجودة الشاملة",\n        "desc_en": "Total Quality Management"\n      },\n      {\n        "name_ar": "ISO 22000",\n        "name_en": "ISO 22000",\n        "desc_ar": "سلامة الغذاء الدولية",\n        "desc_en": "International Food Safety"\n      },\n      {\n        "name_ar": "HACCP",\n        "name_en": "HACCP",\n        "desc_ar": "تحليل المخاطر ونقاط التحكم",\n        "desc_en": "Hazard Analysis & Critical Control"\n      },\n      {\n        "name_ar": "Halal",\n        "name_en": "Halal",\n        "desc_ar": "شهادة الحلال المعتمدة",\n        "desc_en": "Certified Halal"\n      },\n      {\n        "name_ar": "GMP",\n        "name_en": "GMP",\n        "desc_ar": "ممارسات التصنيع الجيدة",\n        "desc_en": "Good Manufacturing Practices"\n      },\n      {\n        "name_ar": "FDA",\n        "name_en": "FDA",\n        "desc_ar": "معتمد من إدارة الغذاء والدواء",\n        "desc_en": "FDA Approved"\n      }\n    ]\n  },\n  "testimonials": {\n    "title_ar": "ماذا يقول عملاؤنا",\n    "title_en": "What Our Clients Say",\n    "subtitle_ar": "ثقة تمتد لأكثر من 25 عاماً مع آلاف العملاء في مصر والعالم",\n    "subtitle_en": "Trust spanning over 25 years with thousands of clients in Egypt and worldwide",\n    "items": [\n      {\n        "name_ar": "م. خالد عبد الرحمن",\n        "name_en": "Eng. Khaled Abdel Rahman",\n        "role_ar": "مدير مشتريات — مصنع بسكويت النجمة",\n        "role_en": "Purchasing Manager — Star Biscuit Factory",\n        "content_ar": "نتعامل مع مصنع السلام منذ أكثر من 8 سنوات. جودة الشورتنج ثابتة في كل شحنة، وخدمة ما بعد البيع ممتازة.",\n        "content_en": "We've been working with Elsalam Factory for over 8 years. The shortening quality is consistent in every shipment, and the after-sales service is excellent."\n      },\n      {\n        "name_ar": "أ. سارة المصري",\n        "name_en": "Ms. Sara Al-Masry",\n        "role_ar": "مالكة سلسلة مطاعم الأصالة",\n        "role_en": "Owner of Al-Asala Restaurant Chain",\n        "content_ar": "زيت عباد الشمس من السلام هو اختيارنا الأول. لا يغير نكهة الطعام ويتحمل القلي المتكرر بشكل ممتاز.",\n        "content_en": "Elsalam's sunflower oil is our first choice. It doesn't alter food flavor and handles repeated frying excellently."\n      },\n      {\n        "name_ar": "Mr. Ahmed Hassan",\n        "name_en": "Mr. Ahmed Hassan",\n        "role_ar": "مدير الاستيراد — شركة Global Foods Trading, الإمارات",\n        "role_en": "Import Manager — Global Foods Trading, UAE",\n        "content_ar": "مصنع السلام هو موردنا الموثوق للزيوت النباتية. شهادات ISO والحلال مع أسعار تنافسية تجعلهم الخيار الأفضل في مصر.",\n        "content_en": "Elsalam is our trusted supplier for vegetable oils. Their ISO and Halal certifications, combined with competitive pricing, make them the best choice in Egypt."\n      },\n      {\n        "name_ar": "أ. محمد يوسف",\n        "name_en": "Mr. Mohamed Youssef",\n        "role_ar": "موزع معتمد — القاهرة الكبرى",\n        "role_en": "Authorized Distributor — Greater Cairo",\n        "content_ar": "التعامل مع مصنع السلام سهل واحترافي. الأسعار تنافسية والتسليم دائماً في الموعد. أنصح بالتعامل معهم.",\n        "content_en": "Working with Elsalam Factory is easy and professional. Prices are competitive and delivery is always on time. Highly recommended."\n      }\n    ]\n  },\n  "timeline": {\n    "badge_ar": "مراحل الإنتاج",\n    "badge_en": "Production Process",\n    "title_ar": "مسار الإنتاج",\n    "title_en": "Production Journey",\n    "subtitle_ar": "من الطبيعة إلى مائدتك، رحلة موثقة بأعلى معايير الجودة العالمية",\n    "subtitle_en": "From nature to your table, a journey documented with the highest global quality standards",\n    "steps": [\n      {\n        "title_ar": "استلام وتجهيز البذور",\n        "title_en": "Seed Reception & Preparation",\n        "description_ar": "استلام البذور الزراعية (صويا، عباد شمس) وتمريرها على أجهزة التنظيف المغناطيسية والغربلة.",\n        "description_en": "Receiving agricultural seeds (soybean, sunflower) and passing them through magnetic cleaning and sieving equipment."\n      },\n      {\n        "title_ar": "العصر والاستخلاص",\n        "title_en": "Pressing & Extraction",\n        "description_ar": "تكسير وتسخين البذور لزيادة المردود الزيتي، ثم عصرها آلياً واستخلاص الزيت الخام.",\n        "description_en": "Crushing and heating seeds to increase oil yield, then mechanically pressing and extracting crude oil."\n      },\n      {\n        "title_ar": "التكرير والتنقية",\n        "title_en": "Refining & Purification",\n        "description_ar": "إزالة الصمغ، التبييض، ونزع الرائحة للوصول للزيت النقي عالي الشفافية.",\n        "description_en": "Degumming, bleaching, and deodorizing to achieve pure, highly transparent oil."\n      },\n      {\n        "title_ar": "التعبئة والتغليف",\n        "title_en": "Filling & Packaging",\n        "description_ar": "تعبئة آلية تحت ظروف صحية تامة لضمان الحفاظ على الخواص الطبيعية للمنتج.",\n        "description_en": "Automated filling under full sanitary conditions to preserve the natural properties of the product."\n      }\n    ]\n  },\n  "faq": {\n    "title_ar": "الأسئلة الشائعة",\n    "title_en": "Frequently Asked Questions",\n    "subtitle_ar": "إجابات على أكثر الأسئلة شيوعاً من عملائنا",\n    "subtitle_en": "Answers to the most common questions from our clients",\n    "items": [\n      {\n        "question_ar": "ما هي أنواع الزيوت التي ينتجها مصنع السلام؟",\n        "question_en": "What types of oils does Elsalam Factory produce?",\n        "answer_ar": "ينتج مصنع السلام تشكيلة واسعة تشمل: زيت صويا مكرر، زيت عباد الشمس، زيت نخيل مكرر، سمن نباتي ممتاز، سمن نباتي صناعي، شورتنج المخابز، وشورتنج القلي العميق. كما نقدم خلطات زيوت مخصصة حسب مواصفات العميل.",\n        "answer_en": "Elsalam Factory produces a wide range including: refined soybean oil, sunflower oil, refined palm oil, premium vegetable ghee, industrial margarine, bakery shortening, and deep frying shortening. We also offer custom oil blends per client specifications."\n      },\n      {\n        "question_ar": "هل منتجاتكم حاصلة على شهادات جودة؟",\n        "question_en": "Are your products quality certified?",\n        "answer_ar": "نعم، جميع منتجاتنا حاصلة على شهادات ISO 9001 و ISO 22000 و HACCP وشهادة الحلال. نلتزم بأعلى معايير الجودة والسلامة الغذائية في كل مراحل الإنتاج.",\n        "answer_en": "Yes, all our products hold ISO 9001, ISO 22000, HACCP, and Halal certifications. We adhere to the highest quality and food safety standards at every production stage."\n      },\n      {\n        "question_ar": "ما هي الحد الأدنى لكمية الطلب؟",\n        "question_en": "What is the minimum order quantity?",\n        "answer_ar": "للسوق المحلي: يختلف الحد الأدنى حسب نوع المنتج والتعبئة. للتصدير: الحد الأدنى هو 20 طن (حاوية 20 قدم). يمكنك التواصل معنا للحصول على تفاصيل أكثر حسب احتياجك.",\n        "answer_en": "For local market: the minimum varies by product type and packaging. For export: the minimum is 20 tons (1x20' FCL). Contact us for more details based on your needs."\n      },\n      {\n        "question_ar": "هل تصدرون لخارج مصر؟",\n        "question_en": "Do you export outside Egypt?",\n        "answer_ar": "نعم، نصدّر لأكثر من 15 دولة حول العالم تشمل الشرق الأوسط، أفريقيا، أوروبا، وآسيا. نوفر جميع الوثائق اللازمة للتخليص الجمركي.",\n        "answer_en": "Yes, we export to over 15 countries worldwide including the Middle East, Africa, Europe, and Asia. We provide all documentation required for customs clearance."\n      },\n      {\n        "question_ar": "ما هي خيارات التعبئة المتاحة؟",\n        "question_en": "What packaging options are available?",\n        "answer_ar": "نقدم تعبئات متنوعة: عبوات استهلاكية (1 لتر، 2 لتر، 5 لتر)، عبوات صناعية (18 لتر، براميل 200 لتر)، وفليكسي تانك للشحن بالجملة. يمكننا أيضاً توفير تعبئة مخصصة بعلامتك التجارية.",\n        "answer_en": "We offer diverse packaging: consumer bottles (1L, 2L, 5L), industrial packaging (18L, 200L drums), and flexitanks for bulk shipping. We can also provide private label packaging with your brand."\n      },\n      {\n        "question_ar": "كم يستغرق تنفيذ الطلب والتسليم؟",\n        "question_en": "How long does order fulfillment and delivery take?",\n        "answer_ar": "للطلبات المحلية: من 3 إلى 7 أيام عمل. لطلبات التصدير: من 14 إلى 21 يوم عمل حسب الوجهة. نلتزم دائماً بمواعيد التسليم المتفق عليها.",\n        "answer_en": "For local orders: 3-7 business days. For export orders: 14-21 business days depending on destination. We always commit to agreed delivery schedules."\n      }\n    ]\n  },\n  "ctaPartnership": {\n    "title_ar": "هل تبحث عن شريك صناعي موثوق؟",\n    "title_en": "Looking for a Reliable Industrial Partner?",\n    "subtitle_ar": "سواء كنت مصنعاً للأغذية، سلسلة مطاعم، أو موزعاً عالمياً — مصنع السلام يوفر لك حلولاً مخصصة بأعلى معايير الجودة وأسعار تنافسية.",\n    "subtitle_en": "Whether you're a food manufacturer, restaurant chain, or global distributor — Elsalam Factory provides customized solutions with the highest quality standards and competitive prices.",\n    "ctaPrimary_ar": "طلب عرض سعر",\n    "ctaPrimary_en": "Request a Quote",\n    "ctaSecondary_ar": "تواصل مع فريق المبيعات",\n    "ctaSecondary_en": "Contact Sales Team"\n  },\n  "clientLogos": {\n    "badge_ar": "شركاء النجاح",\n    "badge_en": "Success Partners",\n    "titleBefore_ar": "يثق بنا أكثر من",\n    "titleBefore_en": "Trusted by over",\n    "titleCount": "200+",\n    "titleAfter_ar": "شريك صناعي",\n    "titleAfter_en": "industrial partners",\n    "names": [\n      {\n        "name_ar": "شركة الجوهرة",\n        "name_en": "Delta Industrial Co.",\n        "logo": "/uploads/upload_1776484795352_pokpsp.jpg"\n      },\n      {\n        "name_ar": "شركة فرج الله ",\n        "name_en": "",\n        "logo": "/uploads/upload_1776485103132_2d8mjh.webp"\n      },\n      {\n        "name_ar": "امكو فودز (Amco Foods) – بسكويت ",\n        "name_en": "",\n        "logo": "/uploads/upload_1776485156629_hqjcxr.png"\n      },\n      {\n        "name_ar": "ريفر فودز – كيك وبسكويت",\n        "name_en": "",\n        "logo": "/uploads/upload_1776485203590_worl7u.png"\n      },\n      {\n        "name_ar": "أوشن فودز – لمبادا",\n        "name_en": "",\n        "logo": "/uploads/upload_1776485255889_01oirv.webp"\n      },\n      {\n        "name_ar": "الصقر – جبنة وزبدة",\n        "name_en": "",\n        "logo": "/uploads/upload_1776485317963_jjbu5i.png"\n      },\n      {\n        "name_ar": "المتحدة للبويات",\n        "name_en": "",\n        "logo": "/uploads/upload_1776485390285_99h5hx.jfif"\n      },\n      {\n        "name_ar": "بروتال",\n        "name_en": "",\n        "logo": "/uploads/upload_1776485440047_kcy1jp.png"\n      },\n      {\n        "name_ar": "بسكويت سلوى",\n        "name_en": "",\n        "logo": "/uploads/upload_1776485674465_jgqpkd.jfif"\n      },\n      {\n        "name_ar": "بسكويت دهب",\n        "name_en": "",\n        "logo": "/uploads/upload_1776485845529_jnynrg.jfif"\n      },\n      {\n        "name_ar": "ملكو – جبنة",\n        "name_en": "",\n        "logo": "/uploads/upload_1776485891891_1uq6ch.jpg"\n      },\n      {\n        "name_ar": "يوني فودز – بطاطس",\n        "name_en": "",\n        "logo": "/uploads/upload_1776485948714_zfp50s.png"\n      },\n      {\n        "name_ar": "كيرو فودز – شيبسي",\n        "name_en": "",\n        "logo": "/uploads/upload_1776485979118_f3c5xo.png"\n      },\n      {\n        "name_ar": "بير فودز – بسكويت",\n        "name_en": "",\n        "logo": "/uploads/upload_1776486032484_iidbgs.png"\n      },\n      {\n        "name_ar": "فودا فودز – بسكويت",\n        "name_en": "",\n        "logo": "/uploads/upload_1776486118759_q5n133.jfif"\n      },\n      {\n        "name_ar": "إيجيبت مان – شيبسي",\n        "name_en": "",\n        "logo": "/uploads/upload_1776486169484_dz3jv4.png"\n      },\n      {\n        "name_ar": "رايت فودز – شيبسي",\n        "name_en": "",\n        "logo": "/uploads/upload_1776486195275_agnma7.jfif"\n      },\n      {\n        "name_ar": "فوكس – شيبسي",\n        "name_en": "",\n        "logo": "/uploads/upload_1776486216074_2rj1j3.jfif"\n      },\n      {\n        "name_ar": "جبنة المصريين",\n        "name_en": "",\n        "logo": "/uploads/upload_1776486278709_dzbrdf.png"\n      },\n      {\n        "name_ar": "كورونا ",\n        "name_en": "",\n        "logo": "/uploads/upload_1776486320461_ipcp1t.jfif"\n      },\n      {\n        "name_ar": "كلوكوز نودلز (إندومي) ",\n        "name_en": "",\n        "logo": "/uploads/upload_1776486351969_vtogob.png"\n      },\n      {\n        "name_ar": "ماسي فودز",\n        "name_en": "",\n        "logo": "/uploads/upload_1776486386750_ovc4b2.png"\n      },\n      {\n        "name_ar": "مصنع الطارق – جبنة",\n        "name_en": "",\n        "logo": "/uploads/upload_1776486629948_63xzeq.jfif"\n      },\n      {\n        "name_ar": "جاد",\n        "name_en": "",\n        "logo": "/uploads/upload_1776486660531_2jnymh.webp"\n      },\n      {\n        "name_ar": "أبو ربيع",\n        "name_en": "",\n        "logo": "/uploads/upload_1776486705898_0t2kqp.webp"\n      },\n      {\n        "name_ar": "الفلاح",\n        "name_en": "",\n        "logo": "/uploads/upload_1776486738907_e7pxoo.jfif"\n      },\n      {\n        "name_ar": "المدهش ",\n        "name_en": "",\n        "logo": "/uploads/upload_1776486760854_bkavyk.png"\n      },\n      {\n        "name_ar": "زفير للأسماك",\n        "name_en": "",\n        "logo": "/uploads/upload_1776486838088_o24p63.jfif"\n      },\n      {\n        "name_ar": "عروس البحر",\n        "name_en": "",\n        "logo": "/uploads/upload_1776486859854_37op37.png"\n      },\n      {\n        "name_ar": "كبدة العربي",\n        "name_en": "",\n        "logo": "/uploads/upload_1776486925916_z5lytx.jfif"\n      },\n      {\n        "name_ar": "رغيف شاورما",\n        "name_en": "",\n        "logo": "/uploads/upload_1776486945944_kexjrp.png"\n      },\n      {\n        "name_ar": "بلبع للمشويات",\n        "name_en": "",\n        "logo": "/uploads/upload_1776487023971_2hgwob.jfif"\n      },\n      {\n        "name_ar": "هرم الحمام",\n        "name_en": "",\n        "logo": "/uploads/upload_1776487042491_9j5cxy.jfif"\n      },\n      {\n        "name_ar": "قرية عبدالوهاب للمشويات",\n        "name_en": "",\n        "logo": "/uploads/upload_1776487066475_72fbz5.jfif"\n      },\n      {\n        "name_ar": "أبو عوض",\n        "name_en": "",\n        "logo": "/uploads/upload_1776487088718_9ofoyk.jfif"\n      },\n      {\n        "name_ar": "ويف",\n        "name_en": "",\n        "logo": "/uploads/upload_1776487176927_o9zo3v.jfif"\n      }\n    ]\n  },\n  "footer": {\n    "description_ar": "الريادة في عصر الزيوت النباتية وإنتاج الزيوت، السمن والشورتنج منذ عام 2000. موثوق من أكثر من 200 شريك صناعي حول العالم.",\n    "description_en": "Leading in vegetable oil pressing and production of oils, margarine & shortening since 2000. Trusted by over 200 industrial partners worldwide.",\n    "address_ar": "الأبعادية عند مجمع الكليات، البحيرة، دمنهور، مصر",\n    "address_en": "“Al-Abadiya near the Colleges Complex, Beheira, Damanhur, Egypt.”",\n    "phone": "+201050051851",\n    "email": "info@elsalamoil.com",\n    "copyright_en": "Copyright ITechonlogy ",\n    "copyright_ar": "Copyright ITechonlogy ",\n    "logo": "/uploads/upload_1777237219581_etnn18.png",\n    "brandName": "مصنع السلام لعصر وإستخلاص الزيوت النباتية ",\n    "brandEn": "El-Salam Factory for Pressing and Extracting Vegetable Oils"\n  }\n}	2026-04-17 22:31:46.893	2026-04-26 21:03:06.284	1
cmopfa1gy000krtosmw64vvv8	production	{\n  "hero": {\n    "title_ar": "مراحل الإنتاج",\n    "title_en": "Production Stages",\n    "subtitle_ar": "نتبع أحدث التقنيات العالمية في تصنيع الزيوت النباتية والسمن والشورتنينج عبر 8 خطوط إنتاج متطورة",\n    "subtitle_en": "We follow the latest global technologies in manufacturing vegetable oils, margarine & shortening across 8 advanced production lines",\n    "backgroundImage": "/uploads/upload_1777791699375_pdj53m.jfif"\n  },\n  "steps": {\n    "title_ar": "خطوات عملية الإنتاج",\n    "title_en": "Production Process Steps",\n    "subtitle_ar": "من استلام المواد الخام حتى التعبئة والتغليف",\n    "subtitle_en": "From raw material receipt to packaging and labeling",\n    "items": [\n      {\n        "title_ar": "استلام وفحص المواد الخام",\n        "title_en": "Raw Material Receipt & Inspection",\n        "description_ar": "نستقبل أجود أنواع الزيوت الخام من مصادر معتمدة عالمياً ونجري فحوصات شاملة للتأكد من جودتها ومطابقتها للمواصفات",\n        "description_en": "We receive the finest crude oils from globally certified sources and conduct comprehensive inspections to ensure quality and specification compliance",\n        "icon": "PackageCheck",\n        "image": "/uploads/upload_1777791867288_pyu8ag.jfif"\n      },\n      {\n        "title_ar": "التكرير والتنقية",\n        "title_en": "Refining & Purification",\n        "description_ar": "تمر الزيوت الخام بعمليات تكرير متعددة تشمل إزالة الصمغ، والتبييض، وإزالة الروائح للحصول على زيت نقي عالي الجودة",\n        "description_en": "Crude oils undergo multiple refining processes including degumming, bleaching, and deodorizing to produce high-quality pure oil",\n        "icon": "Filter",\n        "image": "/uploads/upload_1777792085916_gdu075.jfif"\n      },\n      {\n        "title_ar": "الهدرجة والتحويل",\n        "title_en": "Hydrogenation & Processing",\n        "description_ar": "يتم تحويل الزيوت السائلة إلى سمن وشورتنينج من خلال عمليات هدرجة محكمة تحت إشراف فني متخصص",\n        "description_en": "Liquid oils are converted into margarine and shortening through precise hydrogenation processes under specialized technical supervision",\n        "icon": "FlaskConical",\n        "image": "/uploads/upload_1777792345594_zdyi0v.jfif"\n      },\n      {\n        "title_ar": "مراقبة الجودة المخبرية",\n        "title_en": "Laboratory Quality Control",\n        "description_ar": "يتم إجراء تحاليل مخبرية دقيقة في كل مرحلة لضمان مطابقة المنتج للمواصفات القياسية المحلية والدولية",\n        "description_en": "Precise laboratory analyses are conducted at every stage to ensure product compliance with local and international standards",\n        "icon": "Microscope",\n        "image": "/uploads/upload_1777792360172_180jue.jfif"\n      },\n      {\n        "title_ar": "التعبئة والتغليف",\n        "title_en": "Filling & Packaging",\n        "description_ar": "تعبئة آلية بالكامل في عبوات متنوعة الأحجام مع طباعة بيانات المنتج وتاريخ الإنتاج والصلاحية بأعلى معايير النظافة",\n        "description_en": "Fully automated filling in various container sizes with product data, production date, and expiry date printing under the highest hygiene standards",\n        "icon": "Package",\n        "image": "/uploads/upload_1777792560651_wd3kh3.jfif"\n      },\n      {\n        "title_ar": "التخزين والتوزيع",\n        "title_en": "Storage & Distribution",\n        "description_ar": "مستودعات مجهزة بأنظمة تحكم في درجة الحرارة وأسطول نقل متكامل لضمان وصول المنتجات بأفضل حالة",\n        "description_en": "Temperature-controlled warehouses and a comprehensive transport fleet to ensure products arrive in optimal condition",\n        "icon": "Truck",\n        "image": "/uploads/upload_1777792715598_ym5wrt.jfif"\n      }\n    ]\n  },\n  "capacity": {\n    "title_ar": "الطاقة الإنتاجية",\n    "title_en": "Production Capacity",\n    "subtitle_ar": "أرقام تعكس حجم وقدرات مصنع السلام",\n    "subtitle_en": "Numbers reflecting the scale and capabilities of Elsalam Factory",\n    "items": [\n      {\n        "label_ar": "خطوط إنتاج",\n        "label_en": "Production Lines",\n        "value": "8"\n      },\n      {\n        "label_ar": "طن يومياً",\n        "label_en": "Tons Daily",\n        "value": "500"\n      },\n      {\n        "label_ar": "دولة تصدير",\n        "label_en": "Export Countries",\n        "value": "15+"\n      },\n      {\n        "label_ar": "منتج متنوع",\n        "label_en": "Diverse Products",\n        "value": "50+"\n      }\n    ]\n  },\n  "gallery": {\n    "title_ar": "جولة في خطوط الإنتاج",\n    "title_en": "Production Lines Tour",\n    "items": [\n      {\n        "title_ar": "خط إنتاج الزيوت",\n        "title_en": "Oil Production Line",\n        "url": ""\n      },\n      {\n        "title_ar": "خط التكرير",\n        "title_en": "Refining Line",\n        "url": ""\n      },\n      {\n        "title_ar": "خط التعبئة",\n        "title_en": "Filling Line",\n        "url": ""\n      },\n      {\n        "title_ar": "مستودعات التخزين",\n        "title_en": "Storage Warehouses",\n        "url": ""\n      }\n    ]\n  }\n}	2026-05-03 07:01:43.282	2026-05-03 07:18:38.377	1
cmoph0wi3000urtosx3l29xw5	b2b	{\n  "hero": {\n    "title_ar": "بوابة الشراكات الصناعية",\n    "title_en": "Industrial Partnerships Hub",\n    "subtitle_ar": "مصنع السلام — شريكك الاستراتيجي في توريد الزيوت النباتية والسمن والشورتنج بكميات صناعية وأسعار مباشرة من المصنع.",\n    "subtitle_en": "Elsalam Factory — Your strategic partner in supplying vegetable oils, margarine & shortening in industrial quantities at factory-direct prices.",\n    "ctaQuote_ar": "طلب عرض سعر",\n    "ctaQuote_en": "Request a Quote",\n    "ctaCatalog_ar": "تحميل الكتالوج PDF",\n    "ctaCatalog_en": "Download PDF Catalog",\n    "backgroundImage": "/uploads/upload_1777794631585_9j7hfe.png"\n  },\n  "benefits": {\n    "title_ar": "لماذا مصنع السلام؟",\n    "title_en": "Why Elsalam Factory?",\n    "subtitle_ar": "6 أسباب تجعلنا الخيار الأول للمصانع والموزعين",\n    "subtitle_en": "6 reasons that make us the first choice for factories and distributors",\n    "items": [\n      {\n        "title_ar": "طاقة إنتاجية عالية",\n        "title_en": "High Production Capacity",\n        "description_ar": "500 طن يومياً عبر 8 خطوط إنتاج مجهزة بأحدث التقنيات الأوروبية.",\n        "description_en": "500 tons daily across 8 production lines equipped with the latest European technology."\n      },\n      {\n        "title_ar": "مختبرات جودة متقدمة",\n        "title_en": "Advanced Quality Labs",\n        "description_ar": "رقابة صارمة على كل مرحلة من مراحل الإنتاج مع تقارير مخبرية لكل شحنة.",\n        "description_en": "Strict quality control at every production stage with lab reports for each shipment."\n      },\n      {\n        "title_ar": "تعبئة مخصصة",\n        "title_en": "Custom Packaging",\n        "description_ar": "من العبوات الصغيرة للتجزئة إلى الفليكسي تانك للتصدير — حسب احتياجاتك.",\n        "description_en": "From small retail bottles to flexitank for export — tailored to your needs."\n      },\n      {\n        "title_ar": "أسعار تنافسية",\n        "title_en": "Competitive Pricing",\n        "description_ar": "أسعار مباشرة من المصنع مع شروط دفع مرنة للعملاء الصناعيين.",\n        "description_en": "Direct factory prices with flexible payment terms for industrial clients."\n      },\n      {\n        "title_ar": "لوجستيات متكاملة",\n        "title_en": "Integrated Logistics",\n        "description_ar": "شحن محلي ودولي مع تتبع الشحنات وضمان التوصيل في الموعد.",\n        "description_en": "Local and international shipping with shipment tracking and on-time delivery guarantee."\n      },\n      {\n        "title_ar": "شريك استراتيجي",\n        "title_en": "Strategic Partner",\n        "description_ar": "فريق مبيعات مخصص وحلول مصممة حسب احتياجات عملك.",\n        "description_en": "Dedicated sales team and solutions designed for your business needs."\n      }\n    ]\n  },\n  "quoteForm": {\n    "title_ar": "طلب عرض سعر بالجملة",\n    "title_en": "Bulk Quote Request",\n    "subtitle_ar": "املأ البيانات التالية وسيتواصل معك فريق المبيعات خلال 24 ساعة",\n    "subtitle_en": "Fill in the details below and our sales team will contact you within 24 hours",\n    "moq_ar": "الحد الأدنى للطلب (MOQ): 5 أطنان — سيتم الرد خلال 24 ساعة عمل",\n    "moq_en": "Minimum Order Quantity (MOQ): 5 tons — Response within 24 business hours",\n    "products": [\n      {\n        "name_ar": "زيت صويا مكرر",\n        "name_en": "Refined Soybean Oil"\n      },\n      {\n        "name_ar": "زيت عباد الشمس",\n        "name_en": "Sunflower Oil"\n      },\n      {\n        "name_ar": "زيت نخيل",\n        "name_en": "Palm Oil"\n      },\n      {\n        "name_ar": "سمن نباتي",\n        "name_en": "Vegetable Ghee"\n      },\n      {\n        "name_ar": "شورتنج",\n        "name_en": "Shortening"\n      },\n      {\n        "name_ar": "زيت خلطات مخصصة",\n        "name_en": "Custom Oil Blends"\n      },\n      {\n        "name_ar": "Private Label",\n        "name_en": "Private Label"\n      }\n    ],\n    "packaging": [\n      {\n        "name_ar": "براميل (200 لتر)",\n        "name_en": "Drums (200L)"\n      },\n      {\n        "name_ar": "تنكات (18 لتر)",\n        "name_en": "Tins (18L)"\n      },\n      {\n        "name_ar": "عبوات (5 لتر)",\n        "name_en": "Bottles (5L)"\n      },\n      {\n        "name_ar": "عبوات (1 لتر)",\n        "name_en": "Bottles (1L)"\n      },\n      {\n        "name_ar": "Flexitank",\n        "name_en": "Flexitank"\n      },\n      {\n        "name_ar": "تعبئة مخصصة",\n        "name_en": "Custom Packaging"\n      }\n    ]\n  },\n  "ctaSection": {\n    "title_ar": "هل أنت مستعد لبدء شراكة؟",\n    "title_en": "Ready to Start a Partnership?",\n    "subtitle_ar": "تواصل مع فريق المبيعات الصناعية للحصول على عرض سعر مخصص",\n    "subtitle_en": "Contact our industrial sales team for a custom quote",\n    "buttonText_ar": "تواصل معنا الآن",\n    "buttonText_en": "Contact Us Now",\n    "buttonLink": "/contact"\n  }\n}	2026-05-03 07:50:36.05	2026-05-03 07:50:36.05	1
cmopb2icr0000rtosvu55qy7r	quality	{\n  "hero": {\n    "title_ar": "معايير الجودة",\n    "title_en": "Quality Standards",\n    "subtitle_ar": "نلتزم بأعلى معايير الجودة والسلامة الغذائية العالمية في كل مرحلة من مراحل الإنتاج",\n    "subtitle_en": "We adhere to the highest global quality and food safety standards at every stage of production",\n    "image": "/uploads/upload_1777786711159_cq1rea.jfif"\n  },\n  "qcChecks": {\n    "title_ar": "نقاط رقابة الجودة",\n    "title_en": "Quality Control Checkpoints",\n    "subtitle_ar": "8 نقاط فحص صارمة في كل دورة إنتاج",\n    "subtitle_en": "8 strict inspection points in every production cycle",\n    "items": [\n      {\n        "text_ar": "فحص المواد الخام عند الاستلام",\n        "text_en": "Raw material inspection upon receipt",\n        "image": "/uploads/upload_1777784627223_3l7vxz.jfif"\n      },\n      {\n        "text_ar": "تحليل نسبة الحموضة والرطوبة",\n        "text_en": "Acidity and moisture analysis",\n        "image": "/uploads/upload_1777784779820_g94s0s.jfif"\n      },\n      {\n        "text_ar": "اختبار اللون والشفافية",\n        "text_en": "Color and transparency testing",\n        "image": "/uploads/upload_1777785037555_ha975f.jfif"\n      },\n      {\n        "text_ar": "تحليل نقطة الدخان ونقطة الذوبان",\n        "text_en": "Smoke point and melting point analysis",\n        "image": "/uploads/upload_1777785139397_rc5kbp.jfif"\n      },\n      {\n        "text_ar": "فحص المعادن الثقيلة والملوثات",\n        "text_en": "Heavy metals and contaminants testing",\n        "image": "/uploads/upload_1777785309219_nr5jtd.jfif"\n      },\n      {\n        "text_ar": "اختبار الثبات الأكسيدي",\n        "text_en": "Oxidative stability testing",\n        "image": "/uploads/upload_1777785582741_26fzcd.jfif"\n      },\n      {\n        "text_ar": "فحص التعبئة والتغليف",\n        "text_en": "Packaging and labeling inspection",\n        "image": "/uploads/upload_1777785873750_m96wrq.jfif"\n      },\n      {\n        "text_ar": "تحليل العمر الافتراضي المتسارع",\n        "text_en": "Accelerated shelf life analysis",\n        "image": "/uploads/upload_1777785999364_jko31z.jfif"\n      }\n    ]\n  },\n  "lab": {\n    "title_ar": "معامل فحص الجودة",\n    "title_en": "Quality Control Laboratories",\n    "description_ar": "مختبرات مجهزة بأحدث أجهزة التحليل والفحص لضمان مطابقة منتجاتنا لأعلى المعايير الدولية",\n    "description_en": "Laboratories equipped with the latest analysis and testing equipment to ensure our products meet the highest international standards",\n    "images": [\n      {\n        "title_ar": "فريق الجودة",\n        "title_en": "Quality Team",\n        "url": "/uploads/upload_1777786877298_6npbxa.jfif"\n      },\n      {\n        "title_ar": "فحص الجودة",\n        "title_en": "Quality Check",\n        "url": "/uploads/upload_1777786959393_rhvk3d.jfif"\n      },\n      {\n        "title_ar": "اختبار المعمل",\n        "title_en": "Lab Test",\n        "url": "/uploads/upload_1777787032721_kb3fcy.jfif"\n      }\n    ]\n  },\n  "downloads": {\n    "title_ar": "تحميل شهادات الجودة والمواصفات الفنية",\n    "title_en": "Download Quality Certificates & Technical Specifications",\n    "items": [\n      {\n        "label_ar": "تحميل شهادة ISO 9001",\n        "label_en": "Download ISO 9001 Certificate",\n        "url": ""\n      },\n      {\n        "label_ar": "تحميل شهادة ISO 22000",\n        "label_en": "Download ISO 22000 Certificate",\n        "url": ""\n      },\n      {\n        "label_ar": "تحميل شهادة Halal",\n        "label_en": "Download Halal Certificate",\n        "url": ""\n      }\n    ]\n  }\n}	2026-05-03 05:03:53.41	2026-05-03 05:43:59.331	1
cmoqoh5o20000rtns530hrxsw	contact	{\n  "hero": {\n    "title_ar": "تواصل معنا",\n    "title_en": "Contact Us",\n    "subtitle_ar": "نسعد بالرد على استفساراتكم خلال 24 ساعة عمل",\n    "subtitle_en": "We're happy to respond to your inquiries within 24 business hours",\n    "backgroundImage": "/uploads/upload_1777867615355_1tuqpy.png"\n  },\n  "contactInfo": {\n    "address_ar": "البحيرة - دمنهور - الأبعادية - عند مجمع الكليات ",\n    "address_en": "Beheira – Damanhur – Al-Abadiya – near the Colleges Complex",\n    "phone": "+201050051851",\n    "email": "info@elsalamoils.com",\n    "workingHours_ar": "السبت – الخميس: 8:00 ص – 5:00 م",\n    "workingHours_en": "Saturday – Thursday: 8:00 AM – 5:00 PM",\n    "branches": [\n      {\n        "name_ar": "الفرع الرئيسي المصنع ",\n        "name_en": "The main factory branch",\n        "address_ar": "البحيرة - دمنهور - الأبعادية - عند مجمع الكليات ",\n        "address_en": "Beheira – Damanhur – Al-Abadiya – near the Colleges Complex",\n        "mapLink": "https://maps.app.goo.gl/fsWtecuR3ARnj5aV9"\n      },\n      {\n        "name_ar": "",\n        "name_en": "",\n        "address_ar": "",\n        "address_en": "",\n        "mapLink": ""\n      }\n    ]\n  },\n  "formSettings": {\n    "title_ar": "أرسل رسالتك",\n    "title_en": "Send Your Message",\n    "submitButton_ar": "إرسال الرسالة",\n    "submitButton_en": "Send Message",\n    "successMessage_ar": "تم إرسال رسالتك بنجاح! سنرد عليك خلال 24 ساعة عمل.",\n    "successMessage_en": "Your message has been sent successfully! We'll respond within 24 business hours.",\n    "errorMessage_ar": "حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى.",\n    "errorMessage_en": "An error occurred while sending. Please try again."\n  },\n  "social": {\n    "whatsappLocal": "https://wa.me/201234567890",\n    "whatsappLocalLabel_ar": "واتساب — مبيعات محلية",\n    "whatsappLocalLabel_en": "WhatsApp — Local Sales",\n    "whatsappExport": "https://wa.me/201234567890",\n    "whatsappExportLabel_ar": "واتساب — التصدير",\n    "whatsappExportLabel_en": "WhatsApp — Export",\n    "facebook": "https://www.facebook.com/profile.php?id=61573886707769 ",\n    "instagram": "",\n    "linkedin": ""\n  },\n  "map": {\n    "mapEmbedUrl": "https://maps.app.goo.gl/fsWtecuR3ARnj5aV9",\n    "lat": "",\n    "lng": ""\n  },\n  "branches": {\n    "title_ar": "فروعنا ومكاتبنا",\n    "title_en": "Our Branches & Offices",\n    "items": [\n      {\n        "name_ar": "المصنع الرئيسي",\n        "name_en": "Main Factory",\n        "address_ar": "البحيرة - دمنهور - الأبعادية - عند مجمع الكليات ",\n        "address_en": "Beheira – Damanhur – Al-Abadiya – near the Colleges Complex",\n        "phone": "+201050051851"\n      },\n      {\n        "name_ar": "فرع كفر الدوار ",\n        "name_en": "Kafr El-Dawar branch",\n        "address_ar": "البحيرة - كفر الدوار - منشأة الأوقاف - أرض العمدة - 1 شارع والي",\n        "address_en": "Beheira – Kafr El-Dawar – Mansha’at Al-Awqaf – Ard El-Omda – 1 Wali Street ",\n        "phone": "+201222455205",\n        "mapLink": "https://maps.app.goo.gl/MKoK2BWMNLXMDeWq8"\n      }\n    ]\n  }\n}	2026-05-04 04:06:58.034	2026-05-04 05:15:26.899	1
\.


--
-- Data for Name: PageContentHistory; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."PageContentHistory" (id, "pageSlug", content, "savedAt", label) FROM stdin;
cmog95qyo0001rtt0ewm9cugq	home	{\n  "heroSlides": {\n    "slides": [\n      {\n        "tabName_ar": "الجودة والإنتاج",\n        "tabName_en": "Quality & Production",\n        "badge_ar": "أكثر من 25 عاماً من الخبرة في عصر الزيوت",\n        "badge_en": "Over 25 years of experience in oil pressing",\n        "titleLine1_ar": "الريادة في عصر",\n        "titleLine1_en": "Leading in",\n        "titleLine2_ar": "الزيوت النباتية",\n        "titleLine2_en": "Vegetable Oils",\n        "subtitle_ar": "مصنع السلام يلتزم بتقديم أعلى معايير الجودة في إنتاج الزيوت، السمن والشورتنج للسوق المصري والعالمي بأحدث التقنيات الأوروبية.",\n        "subtitle_en": "Elsalam Factory is committed to the highest quality standards in producing oils, margarine & shortening for the Egyptian and international markets using the latest European technologies.",\n        "ctaPrimary_ar": "اكتشف منتجاتنا",\n        "ctaPrimary_en": "Explore Products",\n        "ctaPrimaryLink": "/products",\n        "ctaSecondary_ar": "شراكات التصدير",\n        "ctaSecondary_en": "Export Partnerships",\n        "ctaSecondaryLink": "/export",\n        "image": "/uploads/upload_1776465099444_4hgvjl.jfif"\n      },\n      {\n        "tabName_ar": "التصدير العالمي",\n        "tabName_en": "Global Export",\n        "badge_ar": "نصدر لأكثر من 15 دولة حول العالم",\n        "badge_en": "Exporting to 15+ countries worldwide",\n        "titleLine1_ar": "شريكك الموثوق في",\n        "titleLine1_en": "Your Trusted Partner in",\n        "titleLine2_ar": "التجارة الدولية",\n        "titleLine2_en": "Global Trade",\n        "subtitle_ar": "منتجات جاهزة للتصدير بأعلى المواصفات القياسية، مع لوجستيات متكاملة لتلبية متطلبات الأسواق العالمية بمرونة وكفاءة.",\n        "subtitle_en": "Export-ready products meeting the highest international standards, backed by integrated logistics to serve global markets with flexibility and efficiency.",\n        "ctaPrimary_ar": "دليل التصدير",\n        "ctaPrimary_en": "Export Guide",\n        "ctaPrimaryLink": "/export",\n        "ctaSecondary_ar": "تواصل معنا",\n        "ctaSecondary_en": "Contact Us",\n        "ctaSecondaryLink": "/contact",\n        "image": "/uploads/upload_1776467998203_e7lcwm.jfif"\n      },\n      {\n        "tabName_ar": "شراكات الجملة B2B",\n        "tabName_en": "B2B Partnerships",\n        "badge_ar": "طاقة إنتاجية تصل إلى 500 طن يومياً",\n        "badge_en": "Production capacity up to 500 tons/day",\n        "titleLine1_ar": "حلول صناعية",\n        "titleLine1_en": "Industrial Solutions at",\n        "titleLine2_ar": "بأسعار المصنع",\n        "titleLine2_en": "Factory Prices",\n        "subtitle_ar": "نوفر الزيوت، السمن، والشورتنج بكميات ضخمة وتعبئات مخصصة للمصانع، المخابز، وسلاسل المطاعم الكبرى.",\n        "subtitle_en": "We supply oils, margarine, and shortening in bulk quantities with custom packaging for factories, bakeries, and major restaurant chains.",\n        "ctaPrimary_ar": "طلب عرض سعر بالجملة",\n        "ctaPrimary_en": "Request Bulk Quote",\n        "ctaPrimaryLink": "/b2b/quote",\n        "ctaSecondary_ar": "مزايا الشراكة",\n        "ctaSecondary_en": "Partnership Benefits",\n        "ctaSecondaryLink": "/b2b",\n        "image": "/uploads/upload_1776468282395_galmqr.jfif"\n      }\n    ]\n  },\n  "stats": {\n    "items": [\n      {\n        "value": "25+",\n        "label_ar": "سنوات الخبرة",\n        "label_en": "Years of Experience"\n      },\n      {\n        "value": "500",\n        "label_ar": "طن إنتاج يومياً",\n        "label_en": "Tons Daily Production"\n      },\n      {\n        "value": "15+",\n        "label_ar": "دولة تصدير",\n        "label_en": "Export Countries"\n      },\n      {\n        "value": "200+",\n        "label_ar": "عميل صناعي",\n        "label_en": "Industrial Clients"\n      },\n      {\n        "value": "8",\n        "label_ar": "خطوط إنتاج",\n        "label_en": "Production Lines"\n      },\n      {\n        "value": "6",\n        "label_ar": "شهادات جودة",\n        "label_en": "Quality Certifications"\n      }\n    ]\n  },\n  "whyChooseUs": {\n    "badge_ar": "لماذا نحن؟",\n    "badge_en": "Why Us?",\n    "title_ar": "لماذا تختار",\n    "title_en": "Why Choose",\n    "titleHighlight_ar": "مصنع السلام",\n    "titleHighlight_en": "Elsalam Factory",\n    "subtitle_ar": "نبني شراكات استراتيجية موثوقة تعتمد على الجودة والالتزام المطلق",\n    "subtitle_en": "We build reliable strategic partnerships based on quality and absolute commitment",\n    "reasons": [\n      {\n        "title_ar": "طاقة إنتاجية ضخمة",\n        "title_en": "Massive Production Capacity",\n        "description_ar": "بقدرة إنتاجية تصل إلى 500 طن يومياً، نضمن تلبية كافة الطلبيات الكبرى للقطاع الصناعي والتجاري دون تأخير.",\n        "description_en": "With a production capacity of up to 500 tons per day, we guarantee fulfilling all major orders for the industrial and commercial sectors without delay."\n      },\n      {\n        "title_ar": "معايير جودة عالمية",\n        "title_en": "Global Quality Standards",\n        "description_ar": "حاصلون على أعلى شهادات الجودة وسلامة الغذاء الدولية، مما يضمن تصدير منتجاتنا لأكثر من 15 دولة.",\n        "description_en": "Certified with the highest international quality and food safety standards, ensuring our products are exported to over 15 countries."\n      },\n      {\n        "title_ar": "تقنيات تكرير متطورة",\n        "title_en": "Advanced Refining Technology",\n        "description_ar": "نستخدم أحدث تكنولوجيا التكرير لتحقيق أعلى درجات النقاء والشفافية، مع الحفاظ على القيمة الغذائية.",\n        "description_en": "We use the latest refining technology to achieve the highest levels of purity and transparency while preserving nutritional value."\n      },\n      {\n        "title_ar": "طبيعي 100%",\n        "title_en": "100% Natural",\n        "description_ar": "منتجاتنا خالية تماماً من المواد الحافظة والإضافات الكيميائية الضارة، لنقدم لك زيوتاً صحية وآمنة تماماً.",\n        "description_en": "Our products are completely free from preservatives and harmful chemical additives, offering you healthy and safe oils."\n      }\n    ]\n  },\n  "segments": {\n    "title_ar": "كيف يمكننا خدمتك؟",\n    "title_en": "How Can We Serve You?",\n    "subtitle_ar": "نقدم حلولاً مخصصة لكل قطاع",\n    "subtitle_en": "Customized solutions for every sector",\n    "items": [\n      {\n        "title_ar": "مصانع الأغذية",\n        "title_en": "Food Manufacturers",\n        "desc_ar": "حلول بالجملة مع مواصفات مخصصة لخطوط إنتاجك",\n        "desc_en": "Wholesale solutions with custom specs for your production lines",\n        "cta_ar": "طلب عرض سعر",\n        "cta_en": "Request Quote",\n        "image": "/uploads/upload_1776475289226_xm1xs1.jfif"\n      },\n      {\n        "title_ar": "فنادق ومطاعم",\n        "title_en": "Hotels & Restaurants",\n        "desc_ar": "منتجات HoReCa بتعبئات مناسبة ومواصفات عالمية",\n        "desc_en": "HoReCa products with suitable packaging & global specs",\n        "cta_ar": "تواصل معنا",\n        "cta_en": "Contact Us",\n        "image": "/uploads/upload_1776475687003_yhtbtt.jfif"\n      },\n      {\n        "title_ar": "التصدير العالمي",\n        "title_en": "Global Export",\n        "desc_ar": "منتجات جاهزة للتصدير بمطابقة كاملة للمعايير الدولية",\n        "desc_en": "Export-ready products fully compliant with international standards",\n        "cta_ar": "استفسار تصدير",\n        "cta_en": "Export Inquiry",\n        "image": "/uploads/upload_1776476028139_k7nnht.jfif"\n      },\n      {\n        "title_ar": "التجزئة والتوزيع",\n        "title_en": "Retail & Distribution",\n        "desc_ar": "أسعار تنافسية وتوصيل مباشر لنقاط البيع",\n        "desc_en": "Competitive prices with direct delivery to points of sale",\n        "cta_ar": "تسوق الآن",\n        "cta_en": "Shop Now",\n        "image": "/uploads/upload_1776477111361_80f9nd.jfif"\n      }\n    ]\n  },\n  "featuredProducts": {\n    "badge_ar": "أفضل المنتجات",\n    "badge_en": "Top Products",\n    "title_ar": "منتجاتنا الرائدة",\n    "title_en": "Our Leading Products",\n    "subtitle_ar": "تلبية لاحتياجات السوق المحلي والتصدير",\n    "subtitle_en": "Meeting local market and export needs",\n    "viewAll_ar": "عرض كل المنتجات",\n    "viewAll_en": "View All Products",\n    "products": [\n      {\n        "title_ar": "زيت صويا مكرر",\n        "title_en": "Refined Soybean Oil",\n        "subtitle": "Refined Soybean Oil",\n        "description_ar": "زيت صويا نقي وعالي الجودة مناسب للطهي والقلي المتكرر.",\n        "description_en": "Pure and high-quality soybean oil suitable for cooking and repeated frying.",\n        "slug": "http://localhost:3000/products?category=soybean-oil-",\n        "image": "/uploads/upload_1776470693226_ch171n.jfif"\n      },\n      {\n        "title_ar": "سمن نباتي ممتاز",\n        "title_en": "Premium Vegetable Ghee",\n        "subtitle": "Vegetable Ghee",\n        "description_ar": "سمن نباتي بقوام كريمي ونكهة غنية تضفي طعماً مميزاً.",\n        "description_en": "Vegetable ghee with a creamy texture and rich flavor that adds a distinct taste.",\n        "slug": "vegetable-ghee",\n        "image": "/uploads/upload_1776470997067_72x4rn.jfif"\n      },\n      {\n        "title_ar": "زيت عباد الشمس",\n        "title_en": "Sunflower Oil",\n        "subtitle": "Sunflower Oil",\n        "description_ar": "زيت خفيف وصحي مثالي للاستخدام اليومي والسلطات.",\n        "description_en": "Light and healthy oil ideal for daily use and salads.",\n        "slug": "sunflower-oil",\n        "image": "/uploads/upload_1776471333243_erxh32.jfif"\n      },\n      {\n        "title_ar": "شورتنج المخابز",\n        "title_en": "Bakery Shortening",\n        "subtitle": "Bakery Shortening",\n        "description_ar": "شورتنج متخصص للحلويات والمخبوزات يعطي هشاشة فائقة.",\n        "description_en": "Specialized shortening for sweets and baked goods providing superior crispness.",\n        "slug": "bakery-shortening",\n        "image": "/uploads/upload_1776471821886_33wzg9.jfif"\n      }\n    ]\n  },\n  "ourProcess": {\n    "badge_ar": "آلية الإنتاج والجودة",\n    "badge_en": "Our Process",\n    "title_ar": "من البذرة إلى المائدة.. رحلة الجودة",\n    "title_en": "From Seed to Shelf",\n    "subtitle_ar": "نميز أنفسنا بتشغيل أحد أكثر المنشآت تطوراً وأتمتة في المنطقة، لنضمن أن كل قطرة مطابقة للمعايير العالمية.",\n    "subtitle_en": "We operate one of the most technologically advanced automated facilities in the region, ensuring every drop meets global benchmarks.",\n    "steps": [\n      {\n        "image": "/uploads/upload_1776472340208_t9dmw2.jfif",\n        "title_en": "Careful Seed Selection",\n        "title_ar": "اختيار أفضل البذور",\n        "description_en": "We source only the highest quality, non-GMO seeds from trusted global partners to ensure the foundation of our oils is flawless.",\n        "description_ar": "نعتمد على أجود أنواع البذور غير المعدلة وراثياً من موردين عالميين موثوقين، لنضمن أن أساس زيوتنا مثالي."\n      },\n      {\n        "image": "/uploads/upload_1776472924543_3v286e.jfif",\n        "title_en": "Advanced Double Refining",\n        "title_ar": "تكرير متميز ومزدوج",\n        "description_en": "Utilizing state-of-the-art European machinery, our oil undergoes multiple stages of refining, neutralizing, and deodorizing for ultimate purity.",\n        "description_ar": "باستخدام أحدث الآلات الأوروبية، يمر زيتها بمراحل دقيقة من التكرير والتعادل وإزالة الرائحة لضمان النقاء المطلق."\n      },\n      {\n        "image": "/uploads/upload_1776473188317_uw6tsp.jfif",\n        "title_en": "Rigorous Labs & QC",\n        "title_ar": "فحوصات الجودة الصارمة",\n        "description_en": "Every batch is meticulously analyzed in our on-site laboratories against strict international ISO & HACCP standards.",\n        "description_ar": "تُحلل كل دفعة إنتاجية بدقة متناهية في مختبراتنا المجهزة، وفقاً لأعلى معايير الأيزو ونظام الهاسب (HACCP)."\n      },\n      {\n        "image": "/uploads/upload_1776473676483_gg90tq.jfif",\n        "title_en": "Hygienic Packaging in Compliance with Quality Standards",\n        "title_ar": "تعبئة صحية وفق معايير الجودة",\n        "description_en": "Hygienic Packaging According to the Highest Standards",\n        "description_ar": "تعبئة صحية وفق أعلى المعايير"\n      }\n    ]\n  },\n  "globalFootprint": {\n    "title_ar": "البصمة العالمية",\n    "title_en": "Global Footprint",\n    "subtitle_ar": "نصدر لأكثر من 15 دولة حول العالم",\n    "subtitle_en": "We export to over 15 countries worldwide"\n  },\n  "sustainability": {\n    "title_ar": "الاستدامة والمسؤولية البيئية",\n    "title_en": "Sustainability & Environmental Responsibility",\n    "subtitle_ar": "نلتزم بأعلى معايير الاستدامة في عمليات الإنتاج",\n    "subtitle_en": "We are committed to the highest sustainability standards in our production processes",\n    "image": "/uploads/upload_1776477923691_sm53cx.jfif"\n  },\n  "virtualTour": {\n    "title_ar": "الجولة الافتراضية",\n    "title_en": "Virtual Tour",\n    "subtitle_ar": "تعرف على مصنعنا من الداخل",\n    "subtitle_en": "Explore our factory from the inside",\n    "isVisible": false\n  },\n  "packaging": {\n    "badge_ar": "خيارات التعبئة",\n    "badge_en": "Packaging Options",\n    "title_ar": "عبوات تلبي كافة احتياجاتك",\n    "title_en": "Packaging for Every Need",\n    "subtitle_ar": "نوفر خيارات تعبئة مرنة ومتنوعة تناسب جميع القطاعات من التجزئة وحتى الشحن البحري للصناعات الكبرى.",\n    "subtitle_en": "We provide flexible and diverse packaging options suitable for all sectors, from retail to bulk maritime shipping for major industries.",\n    "types": [\n      {\n        "title_ar": "عبوات بلاستيكية (PET)",\n        "title_en": "PET Plastic Bottles",\n        "sizes_ar": "1، 2، 5 لتر",\n        "sizes_en": "1, 2, 5 liters",\n        "description_ar": "مثالية لتطبيقات التجزئة والأسواق الاستهلاكية والاستخدام المنزلي.",\n        "description_en": "Ideal for retail applications, consumer markets, and household use.",\n        "image": "/uploads/upload_1776481345801_9ja2xu.jfif"\n      },\n      {\n        "title_ar": "تنكات صفيح",\n        "title_en": "Tin Cans",\n        "sizes_ar": "16 لتـر، 18 لتـر",\n        "sizes_en": "16L, 18L",\n        "description_ar": "الخيار الأمثل للمطاعم والفنادق (HoReCa) المعتمدة على الاستهلاك الكثيف.",\n        "description_en": "The optimal choice for restaurants and hotels (HoReCa) with heavy consumption.",\n        "image": "/uploads/upload_1776481632761_jc667m.jfif"\n      },\n      {\n        "title_ar": "براميـل حديدية",\n        "title_en": "Steel Drums",\n        "sizes_ar": "200 لتـر",\n        "sizes_en": "200L",\n        "description_ar": "تعبئة اقتصادية للمصانع الغذائية ومصانع الحلويات والمخابز الكبرى.",\n        "description_en": "Economical packaging for food factories, confectioneries, and large bakeries.",\n        "image": "/uploads/upload_1776481868312_fno49e.jfif"\n      },\n      {\n        "title_ar": "فليكسي تانك",\n        "title_en": "Flexitank",\n        "sizes_ar": "22,000 لتـر",\n        "sizes_en": "22,000L",\n        "description_ar": "الحل الاستراتيجي لتصدير كميات ضخمة للشحن البحري بأقل تكلفة لوجستية.",\n        "description_en": "The strategic solution for exporting large quantities via maritime shipping at the lowest logistics cost.",\n        "image": "/uploads/upload_1776482319857_icf4mt.jfif"\n      }\n    ]\n  },\n  "certifications": {\n    "badge_ar": "الجودة والامتثال",\n    "badge_en": "Quality & Compliance",\n    "title_ar": "شهادات الجودة والاعتمادات الدولية",\n    "title_en": "Quality Certifications & International Accreditations",\n    "subtitle_ar": "نفخر بحصولنا على أعلى الشهادات العالمية التي تضمن جودة وسلامة منتجاتنا",\n    "subtitle_en": "We are proud to hold the highest international certifications ensuring the quality and safety of our products",\n    "certs": [\n      {\n        "name_ar": "ISO 9001",\n        "name_en": "ISO 9001",\n        "desc_ar": "إدارة الجودة الشاملة",\n        "desc_en": "Total Quality Management"\n      },\n      {\n        "name_ar": "ISO 22000",\n        "name_en": "ISO 22000",\n        "desc_ar": "سلامة الغذاء الدولية",\n        "desc_en": "International Food Safety"\n      },\n      {\n        "name_ar": "HACCP",\n        "name_en": "HACCP",\n        "desc_ar": "تحليل المخاطر ونقاط التحكم",\n        "desc_en": "Hazard Analysis & Critical Control"\n      },\n      {\n        "name_ar": "Halal",\n        "name_en": "Halal",\n        "desc_ar": "شهادة الحلال المعتمدة",\n        "desc_en": "Certified Halal"\n      },\n      {\n        "name_ar": "GMP",\n        "name_en": "GMP",\n        "desc_ar": "ممارسات التصنيع الجيدة",\n        "desc_en": "Good Manufacturing Practices"\n      },\n      {\n        "name_ar": "FDA",\n        "name_en": "FDA",\n        "desc_ar": "معتمد من إدارة الغذاء والدواء",\n        "desc_en": "FDA Approved"\n      }\n    ]\n  },\n  "testimonials": {\n    "title_ar": "ماذا يقول عملاؤنا",\n    "title_en": "What Our Clients Say",\n    "subtitle_ar": "ثقة تمتد لأكثر من 25 عاماً مع آلاف العملاء في مصر والعالم",\n    "subtitle_en": "Trust spanning over 25 years with thousands of clients in Egypt and worldwide",\n    "items": [\n      {\n        "name_ar": "م. خالد عبد الرحمن",\n        "name_en": "Eng. Khaled Abdel Rahman",\n        "role_ar": "مدير مشتريات — مصنع بسكويت النجمة",\n        "role_en": "Purchasing Manager — Star Biscuit Factory",\n        "content_ar": "نتعامل مع مصنع السلام منذ أكثر من 8 سنوات. جودة الشورتنج ثابتة في كل شحنة، وخدمة ما بعد البيع ممتازة.",\n        "content_en": "We've been working with Elsalam Factory for over 8 years. The shortening quality is consistent in every shipment, and the after-sales service is excellent."\n      },\n      {\n        "name_ar": "أ. سارة المصري",\n        "name_en": "Ms. Sara Al-Masry",\n        "role_ar": "مالكة سلسلة مطاعم الأصالة",\n        "role_en": "Owner of Al-Asala Restaurant Chain",\n        "content_ar": "زيت عباد الشمس من السلام هو اختيارنا الأول. لا يغير نكهة الطعام ويتحمل القلي المتكرر بشكل ممتاز.",\n        "content_en": "Elsalam's sunflower oil is our first choice. It doesn't alter food flavor and handles repeated frying excellently."\n      },\n      {\n        "name_ar": "Mr. Ahmed Hassan",\n        "name_en": "Mr. Ahmed Hassan",\n        "role_ar": "مدير الاستيراد — شركة Global Foods Trading, الإمارات",\n        "role_en": "Import Manager — Global Foods Trading, UAE",\n        "content_ar": "مصنع السلام هو موردنا الموثوق للزيوت النباتية. شهادات ISO والحلال مع أسعار تنافسية تجعلهم الخيار الأفضل في مصر.",\n        "content_en": "Elsalam is our trusted supplier for vegetable oils. Their ISO and Halal certifications, combined with competitive pricing, make them the best choice in Egypt."\n      },\n      {\n        "name_ar": "أ. محمد يوسف",\n        "name_en": "Mr. Mohamed Youssef",\n        "role_ar": "موزع معتمد — القاهرة الكبرى",\n        "role_en": "Authorized Distributor — Greater Cairo",\n        "content_ar": "التعامل مع مصنع السلام سهل واحترافي. الأسعار تنافسية والتسليم دائماً في الموعد. أنصح بالتعامل معهم.",\n        "content_en": "Working with Elsalam Factory is easy and professional. Prices are competitive and delivery is always on time. Highly recommended."\n      }\n    ]\n  },\n  "timeline": {\n    "badge_ar": "مراحل الإنتاج",\n    "badge_en": "Production Process",\n    "title_ar": "مسار الإنتاج",\n    "title_en": "Production Journey",\n    "subtitle_ar": "من الطبيعة إلى مائدتك، رحلة موثقة بأعلى معايير الجودة العالمية",\n    "subtitle_en": "From nature to your table, a journey documented with the highest global quality standards",\n    "steps": [\n      {\n        "title_ar": "استلام وتجهيز البذور",\n        "title_en": "Seed Reception & Preparation",\n        "description_ar": "استلام البذور الزراعية (صويا، عباد شمس) وتمريرها على أجهزة التنظيف المغناطيسية والغربلة.",\n        "description_en": "Receiving agricultural seeds (soybean, sunflower) and passing them through magnetic cleaning and sieving equipment."\n      },\n      {\n        "title_ar": "العصر والاستخلاص",\n        "title_en": "Pressing & Extraction",\n        "description_ar": "تكسير وتسخين البذور لزيادة المردود الزيتي، ثم عصرها آلياً واستخلاص الزيت الخام.",\n        "description_en": "Crushing and heating seeds to increase oil yield, then mechanically pressing and extracting crude oil."\n      },\n      {\n        "title_ar": "التكرير والتنقية",\n        "title_en": "Refining & Purification",\n        "description_ar": "إزالة الصمغ، التبييض، ونزع الرائحة للوصول للزيت النقي عالي الشفافية.",\n        "description_en": "Degumming, bleaching, and deodorizing to achieve pure, highly transparent oil."\n      },\n      {\n        "title_ar": "التعبئة والتغليف",\n        "title_en": "Filling & Packaging",\n        "description_ar": "تعبئة آلية تحت ظروف صحية تامة لضمان الحفاظ على الخواص الطبيعية للمنتج.",\n        "description_en": "Automated filling under full sanitary conditions to preserve the natural properties of the product."\n      }\n    ]\n  },\n  "faq": {\n    "title_ar": "الأسئلة الشائعة",\n    "title_en": "Frequently Asked Questions",\n    "subtitle_ar": "إجابات على أكثر الأسئلة شيوعاً من عملائنا",\n    "subtitle_en": "Answers to the most common questions from our clients",\n    "items": [\n      {\n        "question_ar": "ما هي أنواع الزيوت التي ينتجها مصنع السلام؟",\n        "question_en": "What types of oils does Elsalam Factory produce?",\n        "answer_ar": "ينتج مصنع السلام تشكيلة واسعة تشمل: زيت صويا مكرر، زيت عباد الشمس، زيت نخيل مكرر، سمن نباتي ممتاز، سمن نباتي صناعي، شورتنج المخابز، وشورتنج القلي العميق. كما نقدم خلطات زيوت مخصصة حسب مواصفات العميل.",\n        "answer_en": "Elsalam Factory produces a wide range including: refined soybean oil, sunflower oil, refined palm oil, premium vegetable ghee, industrial margarine, bakery shortening, and deep frying shortening. We also offer custom oil blends per client specifications."\n      },\n      {\n        "question_ar": "هل منتجاتكم حاصلة على شهادات جودة؟",\n        "question_en": "Are your products quality certified?",\n        "answer_ar": "نعم، جميع منتجاتنا حاصلة على شهادات ISO 9001 و ISO 22000 و HACCP وشهادة الحلال. نلتزم بأعلى معايير الجودة والسلامة الغذائية في كل مراحل الإنتاج.",\n        "answer_en": "Yes, all our products hold ISO 9001, ISO 22000, HACCP, and Halal certifications. We adhere to the highest quality and food safety standards at every production stage."\n      },\n      {\n        "question_ar": "ما هي الحد الأدنى لكمية الطلب؟",\n        "question_en": "What is the minimum order quantity?",\n        "answer_ar": "للسوق المحلي: يختلف الحد الأدنى حسب نوع المنتج والتعبئة. للتصدير: الحد الأدنى هو 20 طن (حاوية 20 قدم). يمكنك التواصل معنا للحصول على تفاصيل أكثر حسب احتياجك.",\n        "answer_en": "For local market: the minimum varies by product type and packaging. For export: the minimum is 20 tons (1x20' FCL). Contact us for more details based on your needs."\n      },\n      {\n        "question_ar": "هل تصدرون لخارج مصر؟",\n        "question_en": "Do you export outside Egypt?",\n        "answer_ar": "نعم، نصدّر لأكثر من 15 دولة حول العالم تشمل الشرق الأوسط، أفريقيا، أوروبا، وآسيا. نوفر جميع الوثائق اللازمة للتخليص الجمركي.",\n        "answer_en": "Yes, we export to over 15 countries worldwide including the Middle East, Africa, Europe, and Asia. We provide all documentation required for customs clearance."\n      },\n      {\n        "question_ar": "ما هي خيارات التعبئة المتاحة؟",\n        "question_en": "What packaging options are available?",\n        "answer_ar": "نقدم تعبئات متنوعة: عبوات استهلاكية (1 لتر، 2 لتر، 5 لتر)، عبوات صناعية (18 لتر، براميل 200 لتر)، وفليكسي تانك للشحن بالجملة. يمكننا أيضاً توفير تعبئة مخصصة بعلامتك التجارية.",\n        "answer_en": "We offer diverse packaging: consumer bottles (1L, 2L, 5L), industrial packaging (18L, 200L drums), and flexitanks for bulk shipping. We can also provide private label packaging with your brand."\n      },\n      {\n        "question_ar": "كم يستغرق تنفيذ الطلب والتسليم؟",\n        "question_en": "How long does order fulfillment and delivery take?",\n        "answer_ar": "للطلبات المحلية: من 3 إلى 7 أيام عمل. لطلبات التصدير: من 14 إلى 21 يوم عمل حسب الوجهة. نلتزم دائماً بمواعيد التسليم المتفق عليها.",\n        "answer_en": "For local orders: 3-7 business days. For export orders: 14-21 business days depending on destination. We always commit to agreed delivery schedules."\n      }\n    ]\n  },\n  "ctaPartnership": {\n    "title_ar": "هل تبحث عن شريك صناعي موثوق؟",\n    "title_en": "Looking for a Reliable Industrial Partner?",\n    "subtitle_ar": "سواء كنت مصنعاً للأغذية، سلسلة مطاعم، أو موزعاً عالمياً — مصنع السلام يوفر لك حلولاً مخصصة بأعلى معايير الجودة وأسعار تنافسية.",\n    "subtitle_en": "Whether you're a food manufacturer, restaurant chain, or global distributor — Elsalam Factory provides customized solutions with the highest quality standards and competitive prices.",\n    "ctaPrimary_ar": "طلب عرض سعر",\n    "ctaPrimary_en": "Request a Quote",\n    "ctaSecondary_ar": "تواصل مع فريق المبيعات",\n    "ctaSecondary_en": "Contact Sales Team"\n  },\n  "clientLogos": {\n    "badge_ar": "شركاء النجاح",\n    "badge_en": "Success Partners",\n    "titleBefore_ar": "يثق بنا أكثر من",\n    "titleBefore_en": "Trusted by over",\n    "titleCount": "200+",\n    "titleAfter_ar": "شريك صناعي",\n    "titleAfter_en": "industrial partners",\n    "names": [\n      {\n        "name_ar": "شركة الجوهرة",\n        "name_en": "Delta Industrial Co.",\n        "logo": "/uploads/upload_1776484795352_pokpsp.jpg"\n      },\n      {\n        "name_ar": "شركة فرج الله ",\n        "name_en": "",\n        "logo": "/uploads/upload_1776485103132_2d8mjh.webp"\n      },\n      {\n        "name_ar": "امكو فودز (Amco Foods) – بسكويت ",\n        "name_en": "",\n        "logo": "/uploads/upload_1776485156629_hqjcxr.png"\n      },\n      {\n        "name_ar": "ريفر فودز – كيك وبسكويت",\n        "name_en": "",\n        "logo": "/uploads/upload_1776485203590_worl7u.png"\n      },\n      {\n        "name_ar": "أوشن فودز – لمبادا",\n        "name_en": "",\n        "logo": "/uploads/upload_1776485255889_01oirv.webp"\n      },\n      {\n        "name_ar": "الصقر – جبنة وزبدة",\n        "name_en": "",\n        "logo": "/uploads/upload_1776485317963_jjbu5i.png"\n      },\n      {\n        "name_ar": "المتحدة للبويات",\n        "name_en": "",\n        "logo": "/uploads/upload_1776485390285_99h5hx.jfif"\n      },\n      {\n        "name_ar": "بروتال",\n        "name_en": "",\n        "logo": "/uploads/upload_1776485440047_kcy1jp.png"\n      },\n      {\n        "name_ar": "بسكويت سلوى",\n        "name_en": "",\n        "logo": "/uploads/upload_1776485674465_jgqpkd.jfif"\n      },\n      {\n        "name_ar": "بسكويت دهب",\n        "name_en": "",\n        "logo": "/uploads/upload_1776485845529_jnynrg.jfif"\n      },\n      {\n        "name_ar": "ملكو – جبنة",\n        "name_en": "",\n        "logo": "/uploads/upload_1776485891891_1uq6ch.jpg"\n      },\n      {\n        "name_ar": "يوني فودز – بطاطس",\n        "name_en": "",\n        "logo": "/uploads/upload_1776485948714_zfp50s.png"\n      },\n      {\n        "name_ar": "كيرو فودز – شيبسي",\n        "name_en": "",\n        "logo": "/uploads/upload_1776485979118_f3c5xo.png"\n      },\n      {\n        "name_ar": "بير فودز – بسكويت",\n        "name_en": "",\n        "logo": "/uploads/upload_1776486032484_iidbgs.png"\n      },\n      {\n        "name_ar": "فودا فودز – بسكويت",\n        "name_en": "",\n        "logo": "/uploads/upload_1776486118759_q5n133.jfif"\n      },\n      {\n        "name_ar": "إيجيبت مان – شيبسي",\n        "name_en": "",\n        "logo": "/uploads/upload_1776486169484_dz3jv4.png"\n      },\n      {\n        "name_ar": "رايت فودز – شيبسي",\n        "name_en": "",\n        "logo": "/uploads/upload_1776486195275_agnma7.jfif"\n      },\n      {\n        "name_ar": "فوكس – شيبسي",\n        "name_en": "",\n        "logo": "/uploads/upload_1776486216074_2rj1j3.jfif"\n      },\n      {\n        "name_ar": "جبنة المصريين",\n        "name_en": "",\n        "logo": "/uploads/upload_1776486278709_dzbrdf.png"\n      },\n      {\n        "name_ar": "كورونا ",\n        "name_en": "",\n        "logo": "/uploads/upload_1776486320461_ipcp1t.jfif"\n      },\n      {\n        "name_ar": "كلوكوز نودلز (إندومي) ",\n        "name_en": "",\n        "logo": "/uploads/upload_1776486351969_vtogob.png"\n      },\n      {\n        "name_ar": "ماسي فودز",\n        "name_en": "",\n        "logo": "/uploads/upload_1776486386750_ovc4b2.png"\n      },\n      {\n        "name_ar": "مصنع الطارق – جبنة",\n        "name_en": "",\n        "logo": "/uploads/upload_1776486629948_63xzeq.jfif"\n      },\n      {\n        "name_ar": "جاد",\n        "name_en": "",\n        "logo": "/uploads/upload_1776486660531_2jnymh.webp"\n      },\n      {\n        "name_ar": "أبو ربيع",\n        "name_en": "",\n        "logo": "/uploads/upload_1776486705898_0t2kqp.webp"\n      },\n      {\n        "name_ar": "الفلاح",\n        "name_en": "",\n        "logo": "/uploads/upload_1776486738907_e7pxoo.jfif"\n      },\n      {\n        "name_ar": "المدهش ",\n        "name_en": "",\n        "logo": "/uploads/upload_1776486760854_bkavyk.png"\n      },\n      {\n        "name_ar": "زفير للأسماك",\n        "name_en": "",\n        "logo": "/uploads/upload_1776486838088_o24p63.jfif"\n      },\n      {\n        "name_ar": "عروس البحر",\n        "name_en": "",\n        "logo": "/uploads/upload_1776486859854_37op37.png"\n      },\n      {\n        "name_ar": "كبدة العربي",\n        "name_en": "",\n        "logo": "/uploads/upload_1776486925916_z5lytx.jfif"\n      },\n      {\n        "name_ar": "رغيف شاورما",\n        "name_en": "",\n        "logo": "/uploads/upload_1776486945944_kexjrp.png"\n      },\n      {\n        "name_ar": "بلبع للمشويات",\n        "name_en": "",\n        "logo": "/uploads/upload_1776487023971_2hgwob.jfif"\n      },\n      {\n        "name_ar": "هرم الحمام",\n        "name_en": "",\n        "logo": "/uploads/upload_1776487042491_9j5cxy.jfif"\n      },\n      {\n        "name_ar": "قرية عبدالوهاب للمشويات",\n        "name_en": "",\n        "logo": "/uploads/upload_1776487066475_72fbz5.jfif"\n      },\n      {\n        "name_ar": "أبو عوض",\n        "name_en": "",\n        "logo": "/uploads/upload_1776487088718_9ofoyk.jfif"\n      },\n      {\n        "name_ar": "ويف",\n        "name_en": "",\n        "logo": "/uploads/upload_1776487176927_o9zo3v.jfif"\n      }\n    ]\n  },\n  "footer": {\n    "description_ar": "الريادة في عصر الزيوت النباتية وإنتاج الزيوت، السمن والشورتنج منذ عام 2000. موثوق من أكثر من 200 شريك صناعي حول العالم.",\n    "description_en": "Leading in vegetable oil pressing and production of oils, margarine & shortening since 2000. Trusted by over 200 industrial partners worldwide.",\n    "address_ar": "الأبعادية عند مجمع الكليات، البحيرة، دمنهور، مصر",\n    "address_en": "“Al-Abadiya near the Colleges Complex, Beheira, Damanhur, Egypt.”",\n    "phone": "+201050051851",\n    "email": "info@elsalamoil.com",\n    "copyright_en": "Copyright ITechonlogy ",\n    "copyright_ar": "Copyright ITechonlogy ",\n    "logo": "/uploads/upload_1777237219581_etnn18.png"\n  }\n}	2026-04-26 21:00:29.76	٢٧‏/٤‏/٢٠٢٦ ١٢:٠٠:٢٩ ص
cmog96loq0003rtt0jr2r1e9c	home	{\n  "heroSlides": {\n    "slides": [\n      {\n        "tabName_ar": "الجودة والإنتاج",\n        "tabName_en": "Quality & Production",\n        "badge_ar": "أكثر من 25 عاماً من الخبرة في عصر الزيوت",\n        "badge_en": "Over 25 years of experience in oil pressing",\n        "titleLine1_ar": "الريادة في عصر",\n        "titleLine1_en": "Leading in",\n        "titleLine2_ar": "الزيوت النباتية",\n        "titleLine2_en": "Vegetable Oils",\n        "subtitle_ar": "مصنع السلام يلتزم بتقديم أعلى معايير الجودة في إنتاج الزيوت، السمن والشورتنج للسوق المصري والعالمي بأحدث التقنيات الأوروبية.",\n        "subtitle_en": "Elsalam Factory is committed to the highest quality standards in producing oils, margarine & shortening for the Egyptian and international markets using the latest European technologies.",\n        "ctaPrimary_ar": "اكتشف منتجاتنا",\n        "ctaPrimary_en": "Explore Products",\n        "ctaPrimaryLink": "/products",\n        "ctaSecondary_ar": "شراكات التصدير",\n        "ctaSecondary_en": "Export Partnerships",\n        "ctaSecondaryLink": "/export",\n        "image": "/uploads/upload_1776465099444_4hgvjl.jfif"\n      },\n      {\n        "tabName_ar": "التصدير العالمي",\n        "tabName_en": "Global Export",\n        "badge_ar": "نصدر لأكثر من 15 دولة حول العالم",\n        "badge_en": "Exporting to 15+ countries worldwide",\n        "titleLine1_ar": "شريكك الموثوق في",\n        "titleLine1_en": "Your Trusted Partner in",\n        "titleLine2_ar": "التجارة الدولية",\n        "titleLine2_en": "Global Trade",\n        "subtitle_ar": "منتجات جاهزة للتصدير بأعلى المواصفات القياسية، مع لوجستيات متكاملة لتلبية متطلبات الأسواق العالمية بمرونة وكفاءة.",\n        "subtitle_en": "Export-ready products meeting the highest international standards, backed by integrated logistics to serve global markets with flexibility and efficiency.",\n        "ctaPrimary_ar": "دليل التصدير",\n        "ctaPrimary_en": "Export Guide",\n        "ctaPrimaryLink": "/export",\n        "ctaSecondary_ar": "تواصل معنا",\n        "ctaSecondary_en": "Contact Us",\n        "ctaSecondaryLink": "/contact",\n        "image": "/uploads/upload_1776467998203_e7lcwm.jfif"\n      },\n      {\n        "tabName_ar": "شراكات الجملة B2B",\n        "tabName_en": "B2B Partnerships",\n        "badge_ar": "طاقة إنتاجية تصل إلى 500 طن يومياً",\n        "badge_en": "Production capacity up to 500 tons/day",\n        "titleLine1_ar": "حلول صناعية",\n        "titleLine1_en": "Industrial Solutions at",\n        "titleLine2_ar": "بأسعار المصنع",\n        "titleLine2_en": "Factory Prices",\n        "subtitle_ar": "نوفر الزيوت، السمن، والشورتنج بكميات ضخمة وتعبئات مخصصة للمصانع، المخابز، وسلاسل المطاعم الكبرى.",\n        "subtitle_en": "We supply oils, margarine, and shortening in bulk quantities with custom packaging for factories, bakeries, and major restaurant chains.",\n        "ctaPrimary_ar": "طلب عرض سعر بالجملة",\n        "ctaPrimary_en": "Request Bulk Quote",\n        "ctaPrimaryLink": "/b2b/quote",\n        "ctaSecondary_ar": "مزايا الشراكة",\n        "ctaSecondary_en": "Partnership Benefits",\n        "ctaSecondaryLink": "/b2b",\n        "image": "/uploads/upload_1776468282395_galmqr.jfif"\n      }\n    ]\n  },\n  "stats": {\n    "items": [\n      {\n        "value": "25+",\n        "label_ar": "سنوات الخبرة",\n        "label_en": "Years of Experience"\n      },\n      {\n        "value": "500",\n        "label_ar": "طن إنتاج يومياً",\n        "label_en": "Tons Daily Production"\n      },\n      {\n        "value": "15+",\n        "label_ar": "دولة تصدير",\n        "label_en": "Export Countries"\n      },\n      {\n        "value": "200+",\n        "label_ar": "عميل صناعي",\n        "label_en": "Industrial Clients"\n      },\n      {\n        "value": "8",\n        "label_ar": "خطوط إنتاج",\n        "label_en": "Production Lines"\n      },\n      {\n        "value": "6",\n        "label_ar": "شهادات جودة",\n        "label_en": "Quality Certifications"\n      }\n    ]\n  },\n  "whyChooseUs": {\n    "badge_ar": "لماذا نحن؟",\n    "badge_en": "Why Us?",\n    "title_ar": "لماذا تختار",\n    "title_en": "Why Choose",\n    "titleHighlight_ar": "مصنع السلام",\n    "titleHighlight_en": "Elsalam Factory",\n    "subtitle_ar": "نبني شراكات استراتيجية موثوقة تعتمد على الجودة والالتزام المطلق",\n    "subtitle_en": "We build reliable strategic partnerships based on quality and absolute commitment",\n    "reasons": [\n      {\n        "title_ar": "طاقة إنتاجية ضخمة",\n        "title_en": "Massive Production Capacity",\n        "description_ar": "بقدرة إنتاجية تصل إلى 500 طن يومياً، نضمن تلبية كافة الطلبيات الكبرى للقطاع الصناعي والتجاري دون تأخير.",\n        "description_en": "With a production capacity of up to 500 tons per day, we guarantee fulfilling all major orders for the industrial and commercial sectors without delay."\n      },\n      {\n        "title_ar": "معايير جودة عالمية",\n        "title_en": "Global Quality Standards",\n        "description_ar": "حاصلون على أعلى شهادات الجودة وسلامة الغذاء الدولية، مما يضمن تصدير منتجاتنا لأكثر من 15 دولة.",\n        "description_en": "Certified with the highest international quality and food safety standards, ensuring our products are exported to over 15 countries."\n      },\n      {\n        "title_ar": "تقنيات تكرير متطورة",\n        "title_en": "Advanced Refining Technology",\n        "description_ar": "نستخدم أحدث تكنولوجيا التكرير لتحقيق أعلى درجات النقاء والشفافية، مع الحفاظ على القيمة الغذائية.",\n        "description_en": "We use the latest refining technology to achieve the highest levels of purity and transparency while preserving nutritional value."\n      },\n      {\n        "title_ar": "طبيعي 100%",\n        "title_en": "100% Natural",\n        "description_ar": "منتجاتنا خالية تماماً من المواد الحافظة والإضافات الكيميائية الضارة، لنقدم لك زيوتاً صحية وآمنة تماماً.",\n        "description_en": "Our products are completely free from preservatives and harmful chemical additives, offering you healthy and safe oils."\n      }\n    ]\n  },\n  "segments": {\n    "title_ar": "كيف يمكننا خدمتك؟",\n    "title_en": "How Can We Serve You?",\n    "subtitle_ar": "نقدم حلولاً مخصصة لكل قطاع",\n    "subtitle_en": "Customized solutions for every sector",\n    "items": [\n      {\n        "title_ar": "مصانع الأغذية",\n        "title_en": "Food Manufacturers",\n        "desc_ar": "حلول بالجملة مع مواصفات مخصصة لخطوط إنتاجك",\n        "desc_en": "Wholesale solutions with custom specs for your production lines",\n        "cta_ar": "طلب عرض سعر",\n        "cta_en": "Request Quote",\n        "image": "/uploads/upload_1776475289226_xm1xs1.jfif"\n      },\n      {\n        "title_ar": "فنادق ومطاعم",\n        "title_en": "Hotels & Restaurants",\n        "desc_ar": "منتجات HoReCa بتعبئات مناسبة ومواصفات عالمية",\n        "desc_en": "HoReCa products with suitable packaging & global specs",\n        "cta_ar": "تواصل معنا",\n        "cta_en": "Contact Us",\n        "image": "/uploads/upload_1776475687003_yhtbtt.jfif"\n      },\n      {\n        "title_ar": "التصدير العالمي",\n        "title_en": "Global Export",\n        "desc_ar": "منتجات جاهزة للتصدير بمطابقة كاملة للمعايير الدولية",\n        "desc_en": "Export-ready products fully compliant with international standards",\n        "cta_ar": "استفسار تصدير",\n        "cta_en": "Export Inquiry",\n        "image": "/uploads/upload_1776476028139_k7nnht.jfif"\n      },\n      {\n        "title_ar": "التجزئة والتوزيع",\n        "title_en": "Retail & Distribution",\n        "desc_ar": "أسعار تنافسية وتوصيل مباشر لنقاط البيع",\n        "desc_en": "Competitive prices with direct delivery to points of sale",\n        "cta_ar": "تسوق الآن",\n        "cta_en": "Shop Now",\n        "image": "/uploads/upload_1776477111361_80f9nd.jfif"\n      }\n    ]\n  },\n  "featuredProducts": {\n    "badge_ar": "أفضل المنتجات",\n    "badge_en": "Top Products",\n    "title_ar": "منتجاتنا الرائدة",\n    "title_en": "Our Leading Products",\n    "subtitle_ar": "تلبية لاحتياجات السوق المحلي والتصدير",\n    "subtitle_en": "Meeting local market and export needs",\n    "viewAll_ar": "عرض كل المنتجات",\n    "viewAll_en": "View All Products",\n    "products": [\n      {\n        "title_ar": "زيت صويا مكرر",\n        "title_en": "Refined Soybean Oil",\n        "subtitle": "Refined Soybean Oil",\n        "description_ar": "زيت صويا نقي وعالي الجودة مناسب للطهي والقلي المتكرر.",\n        "description_en": "Pure and high-quality soybean oil suitable for cooking and repeated frying.",\n        "slug": "http://localhost:3000/products?category=soybean-oil-",\n        "image": "/uploads/upload_1776470693226_ch171n.jfif"\n      },\n      {\n        "title_ar": "سمن نباتي ممتاز",\n        "title_en": "Premium Vegetable Ghee",\n        "subtitle": "Vegetable Ghee",\n        "description_ar": "سمن نباتي بقوام كريمي ونكهة غنية تضفي طعماً مميزاً.",\n        "description_en": "Vegetable ghee with a creamy texture and rich flavor that adds a distinct taste.",\n        "slug": "vegetable-ghee",\n        "image": "/uploads/upload_1776470997067_72x4rn.jfif"\n      },\n      {\n        "title_ar": "زيت عباد الشمس",\n        "title_en": "Sunflower Oil",\n        "subtitle": "Sunflower Oil",\n        "description_ar": "زيت خفيف وصحي مثالي للاستخدام اليومي والسلطات.",\n        "description_en": "Light and healthy oil ideal for daily use and salads.",\n        "slug": "sunflower-oil",\n        "image": "/uploads/upload_1776471333243_erxh32.jfif"\n      },\n      {\n        "title_ar": "شورتنج المخابز",\n        "title_en": "Bakery Shortening",\n        "subtitle": "Bakery Shortening",\n        "description_ar": "شورتنج متخصص للحلويات والمخبوزات يعطي هشاشة فائقة.",\n        "description_en": "Specialized shortening for sweets and baked goods providing superior crispness.",\n        "slug": "bakery-shortening",\n        "image": "/uploads/upload_1776471821886_33wzg9.jfif"\n      }\n    ]\n  },\n  "ourProcess": {\n    "badge_ar": "آلية الإنتاج والجودة",\n    "badge_en": "Our Process",\n    "title_ar": "من البذرة إلى المائدة.. رحلة الجودة",\n    "title_en": "From Seed to Shelf",\n    "subtitle_ar": "نميز أنفسنا بتشغيل أحد أكثر المنشآت تطوراً وأتمتة في المنطقة، لنضمن أن كل قطرة مطابقة للمعايير العالمية.",\n    "subtitle_en": "We operate one of the most technologically advanced automated facilities in the region, ensuring every drop meets global benchmarks.",\n    "steps": [\n      {\n        "image": "/uploads/upload_1776472340208_t9dmw2.jfif",\n        "title_en": "Careful Seed Selection",\n        "title_ar": "اختيار أفضل البذور",\n        "description_en": "We source only the highest quality, non-GMO seeds from trusted global partners to ensure the foundation of our oils is flawless.",\n        "description_ar": "نعتمد على أجود أنواع البذور غير المعدلة وراثياً من موردين عالميين موثوقين، لنضمن أن أساس زيوتنا مثالي."\n      },\n      {\n        "image": "/uploads/upload_1776472924543_3v286e.jfif",\n        "title_en": "Advanced Double Refining",\n        "title_ar": "تكرير متميز ومزدوج",\n        "description_en": "Utilizing state-of-the-art European machinery, our oil undergoes multiple stages of refining, neutralizing, and deodorizing for ultimate purity.",\n        "description_ar": "باستخدام أحدث الآلات الأوروبية، يمر زيتها بمراحل دقيقة من التكرير والتعادل وإزالة الرائحة لضمان النقاء المطلق."\n      },\n      {\n        "image": "/uploads/upload_1776473188317_uw6tsp.jfif",\n        "title_en": "Rigorous Labs & QC",\n        "title_ar": "فحوصات الجودة الصارمة",\n        "description_en": "Every batch is meticulously analyzed in our on-site laboratories against strict international ISO & HACCP standards.",\n        "description_ar": "تُحلل كل دفعة إنتاجية بدقة متناهية في مختبراتنا المجهزة، وفقاً لأعلى معايير الأيزو ونظام الهاسب (HACCP)."\n      },\n      {\n        "image": "/uploads/upload_1776473676483_gg90tq.jfif",\n        "title_en": "Hygienic Packaging in Compliance with Quality Standards",\n        "title_ar": "تعبئة صحية وفق معايير الجودة",\n        "description_en": "Hygienic Packaging According to the Highest Standards",\n        "description_ar": "تعبئة صحية وفق أعلى المعايير"\n      }\n    ]\n  },\n  "globalFootprint": {\n    "title_ar": "البصمة العالمية",\n    "title_en": "Global Footprint",\n    "subtitle_ar": "نصدر لأكثر من 15 دولة حول العالم",\n    "subtitle_en": "We export to over 15 countries worldwide"\n  },\n  "sustainability": {\n    "title_ar": "الاستدامة والمسؤولية البيئية",\n    "title_en": "Sustainability & Environmental Responsibility",\n    "subtitle_ar": "نلتزم بأعلى معايير الاستدامة في عمليات الإنتاج",\n    "subtitle_en": "We are committed to the highest sustainability standards in our production processes",\n    "image": "/uploads/upload_1776477923691_sm53cx.jfif"\n  },\n  "virtualTour": {\n    "title_ar": "الجولة الافتراضية",\n    "title_en": "Virtual Tour",\n    "subtitle_ar": "تعرف على مصنعنا من الداخل",\n    "subtitle_en": "Explore our factory from the inside",\n    "isVisible": false\n  },\n  "packaging": {\n    "badge_ar": "خيارات التعبئة",\n    "badge_en": "Packaging Options",\n    "title_ar": "عبوات تلبي كافة احتياجاتك",\n    "title_en": "Packaging for Every Need",\n    "subtitle_ar": "نوفر خيارات تعبئة مرنة ومتنوعة تناسب جميع القطاعات من التجزئة وحتى الشحن البحري للصناعات الكبرى.",\n    "subtitle_en": "We provide flexible and diverse packaging options suitable for all sectors, from retail to bulk maritime shipping for major industries.",\n    "types": [\n      {\n        "title_ar": "عبوات بلاستيكية (PET)",\n        "title_en": "PET Plastic Bottles",\n        "sizes_ar": "1، 2، 5 لتر",\n        "sizes_en": "1, 2, 5 liters",\n        "description_ar": "مثالية لتطبيقات التجزئة والأسواق الاستهلاكية والاستخدام المنزلي.",\n        "description_en": "Ideal for retail applications, consumer markets, and household use.",\n        "image": "/uploads/upload_1776481345801_9ja2xu.jfif"\n      },\n      {\n        "title_ar": "تنكات صفيح",\n        "title_en": "Tin Cans",\n        "sizes_ar": "16 لتـر، 18 لتـر",\n        "sizes_en": "16L, 18L",\n        "description_ar": "الخيار الأمثل للمطاعم والفنادق (HoReCa) المعتمدة على الاستهلاك الكثيف.",\n        "description_en": "The optimal choice for restaurants and hotels (HoReCa) with heavy consumption.",\n        "image": "/uploads/upload_1776481632761_jc667m.jfif"\n      },\n      {\n        "title_ar": "براميـل حديدية",\n        "title_en": "Steel Drums",\n        "sizes_ar": "200 لتـر",\n        "sizes_en": "200L",\n        "description_ar": "تعبئة اقتصادية للمصانع الغذائية ومصانع الحلويات والمخابز الكبرى.",\n        "description_en": "Economical packaging for food factories, confectioneries, and large bakeries.",\n        "image": "/uploads/upload_1776481868312_fno49e.jfif"\n      },\n      {\n        "title_ar": "فليكسي تانك",\n        "title_en": "Flexitank",\n        "sizes_ar": "22,000 لتـر",\n        "sizes_en": "22,000L",\n        "description_ar": "الحل الاستراتيجي لتصدير كميات ضخمة للشحن البحري بأقل تكلفة لوجستية.",\n        "description_en": "The strategic solution for exporting large quantities via maritime shipping at the lowest logistics cost.",\n        "image": "/uploads/upload_1776482319857_icf4mt.jfif"\n      }\n    ]\n  },\n  "certifications": {\n    "badge_ar": "الجودة والامتثال",\n    "badge_en": "Quality & Compliance",\n    "title_ar": "شهادات الجودة والاعتمادات الدولية",\n    "title_en": "Quality Certifications & International Accreditations",\n    "subtitle_ar": "نفخر بحصولنا على أعلى الشهادات العالمية التي تضمن جودة وسلامة منتجاتنا",\n    "subtitle_en": "We are proud to hold the highest international certifications ensuring the quality and safety of our products",\n    "certs": [\n      {\n        "name_ar": "ISO 9001",\n        "name_en": "ISO 9001",\n        "desc_ar": "إدارة الجودة الشاملة",\n        "desc_en": "Total Quality Management"\n      },\n      {\n        "name_ar": "ISO 22000",\n        "name_en": "ISO 22000",\n        "desc_ar": "سلامة الغذاء الدولية",\n        "desc_en": "International Food Safety"\n      },\n      {\n        "name_ar": "HACCP",\n        "name_en": "HACCP",\n        "desc_ar": "تحليل المخاطر ونقاط التحكم",\n        "desc_en": "Hazard Analysis & Critical Control"\n      },\n      {\n        "name_ar": "Halal",\n        "name_en": "Halal",\n        "desc_ar": "شهادة الحلال المعتمدة",\n        "desc_en": "Certified Halal"\n      },\n      {\n        "name_ar": "GMP",\n        "name_en": "GMP",\n        "desc_ar": "ممارسات التصنيع الجيدة",\n        "desc_en": "Good Manufacturing Practices"\n      },\n      {\n        "name_ar": "FDA",\n        "name_en": "FDA",\n        "desc_ar": "معتمد من إدارة الغذاء والدواء",\n        "desc_en": "FDA Approved"\n      }\n    ]\n  },\n  "testimonials": {\n    "title_ar": "ماذا يقول عملاؤنا",\n    "title_en": "What Our Clients Say",\n    "subtitle_ar": "ثقة تمتد لأكثر من 25 عاماً مع آلاف العملاء في مصر والعالم",\n    "subtitle_en": "Trust spanning over 25 years with thousands of clients in Egypt and worldwide",\n    "items": [\n      {\n        "name_ar": "م. خالد عبد الرحمن",\n        "name_en": "Eng. Khaled Abdel Rahman",\n        "role_ar": "مدير مشتريات — مصنع بسكويت النجمة",\n        "role_en": "Purchasing Manager — Star Biscuit Factory",\n        "content_ar": "نتعامل مع مصنع السلام منذ أكثر من 8 سنوات. جودة الشورتنج ثابتة في كل شحنة، وخدمة ما بعد البيع ممتازة.",\n        "content_en": "We've been working with Elsalam Factory for over 8 years. The shortening quality is consistent in every shipment, and the after-sales service is excellent."\n      },\n      {\n        "name_ar": "أ. سارة المصري",\n        "name_en": "Ms. Sara Al-Masry",\n        "role_ar": "مالكة سلسلة مطاعم الأصالة",\n        "role_en": "Owner of Al-Asala Restaurant Chain",\n        "content_ar": "زيت عباد الشمس من السلام هو اختيارنا الأول. لا يغير نكهة الطعام ويتحمل القلي المتكرر بشكل ممتاز.",\n        "content_en": "Elsalam's sunflower oil is our first choice. It doesn't alter food flavor and handles repeated frying excellently."\n      },\n      {\n        "name_ar": "Mr. Ahmed Hassan",\n        "name_en": "Mr. Ahmed Hassan",\n        "role_ar": "مدير الاستيراد — شركة Global Foods Trading, الإمارات",\n        "role_en": "Import Manager — Global Foods Trading, UAE",\n        "content_ar": "مصنع السلام هو موردنا الموثوق للزيوت النباتية. شهادات ISO والحلال مع أسعار تنافسية تجعلهم الخيار الأفضل في مصر.",\n        "content_en": "Elsalam is our trusted supplier for vegetable oils. Their ISO and Halal certifications, combined with competitive pricing, make them the best choice in Egypt."\n      },\n      {\n        "name_ar": "أ. محمد يوسف",\n        "name_en": "Mr. Mohamed Youssef",\n        "role_ar": "موزع معتمد — القاهرة الكبرى",\n        "role_en": "Authorized Distributor — Greater Cairo",\n        "content_ar": "التعامل مع مصنع السلام سهل واحترافي. الأسعار تنافسية والتسليم دائماً في الموعد. أنصح بالتعامل معهم.",\n        "content_en": "Working with Elsalam Factory is easy and professional. Prices are competitive and delivery is always on time. Highly recommended."\n      }\n    ]\n  },\n  "timeline": {\n    "badge_ar": "مراحل الإنتاج",\n    "badge_en": "Production Process",\n    "title_ar": "مسار الإنتاج",\n    "title_en": "Production Journey",\n    "subtitle_ar": "من الطبيعة إلى مائدتك، رحلة موثقة بأعلى معايير الجودة العالمية",\n    "subtitle_en": "From nature to your table, a journey documented with the highest global quality standards",\n    "steps": [\n      {\n        "title_ar": "استلام وتجهيز البذور",\n        "title_en": "Seed Reception & Preparation",\n        "description_ar": "استلام البذور الزراعية (صويا، عباد شمس) وتمريرها على أجهزة التنظيف المغناطيسية والغربلة.",\n        "description_en": "Receiving agricultural seeds (soybean, sunflower) and passing them through magnetic cleaning and sieving equipment."\n      },\n      {\n        "title_ar": "العصر والاستخلاص",\n        "title_en": "Pressing & Extraction",\n        "description_ar": "تكسير وتسخين البذور لزيادة المردود الزيتي، ثم عصرها آلياً واستخلاص الزيت الخام.",\n        "description_en": "Crushing and heating seeds to increase oil yield, then mechanically pressing and extracting crude oil."\n      },\n      {\n        "title_ar": "التكرير والتنقية",\n        "title_en": "Refining & Purification",\n        "description_ar": "إزالة الصمغ، التبييض، ونزع الرائحة للوصول للزيت النقي عالي الشفافية.",\n        "description_en": "Degumming, bleaching, and deodorizing to achieve pure, highly transparent oil."\n      },\n      {\n        "title_ar": "التعبئة والتغليف",\n        "title_en": "Filling & Packaging",\n        "description_ar": "تعبئة آلية تحت ظروف صحية تامة لضمان الحفاظ على الخواص الطبيعية للمنتج.",\n        "description_en": "Automated filling under full sanitary conditions to preserve the natural properties of the product."\n      }\n    ]\n  },\n  "faq": {\n    "title_ar": "الأسئلة الشائعة",\n    "title_en": "Frequently Asked Questions",\n    "subtitle_ar": "إجابات على أكثر الأسئلة شيوعاً من عملائنا",\n    "subtitle_en": "Answers to the most common questions from our clients",\n    "items": [\n      {\n        "question_ar": "ما هي أنواع الزيوت التي ينتجها مصنع السلام؟",\n        "question_en": "What types of oils does Elsalam Factory produce?",\n        "answer_ar": "ينتج مصنع السلام تشكيلة واسعة تشمل: زيت صويا مكرر، زيت عباد الشمس، زيت نخيل مكرر، سمن نباتي ممتاز، سمن نباتي صناعي، شورتنج المخابز، وشورتنج القلي العميق. كما نقدم خلطات زيوت مخصصة حسب مواصفات العميل.",\n        "answer_en": "Elsalam Factory produces a wide range including: refined soybean oil, sunflower oil, refined palm oil, premium vegetable ghee, industrial margarine, bakery shortening, and deep frying shortening. We also offer custom oil blends per client specifications."\n      },\n      {\n        "question_ar": "هل منتجاتكم حاصلة على شهادات جودة؟",\n        "question_en": "Are your products quality certified?",\n        "answer_ar": "نعم، جميع منتجاتنا حاصلة على شهادات ISO 9001 و ISO 22000 و HACCP وشهادة الحلال. نلتزم بأعلى معايير الجودة والسلامة الغذائية في كل مراحل الإنتاج.",\n        "answer_en": "Yes, all our products hold ISO 9001, ISO 22000, HACCP, and Halal certifications. We adhere to the highest quality and food safety standards at every production stage."\n      },\n      {\n        "question_ar": "ما هي الحد الأدنى لكمية الطلب؟",\n        "question_en": "What is the minimum order quantity?",\n        "answer_ar": "للسوق المحلي: يختلف الحد الأدنى حسب نوع المنتج والتعبئة. للتصدير: الحد الأدنى هو 20 طن (حاوية 20 قدم). يمكنك التواصل معنا للحصول على تفاصيل أكثر حسب احتياجك.",\n        "answer_en": "For local market: the minimum varies by product type and packaging. For export: the minimum is 20 tons (1x20' FCL). Contact us for more details based on your needs."\n      },\n      {\n        "question_ar": "هل تصدرون لخارج مصر؟",\n        "question_en": "Do you export outside Egypt?",\n        "answer_ar": "نعم، نصدّر لأكثر من 15 دولة حول العالم تشمل الشرق الأوسط، أفريقيا، أوروبا، وآسيا. نوفر جميع الوثائق اللازمة للتخليص الجمركي.",\n        "answer_en": "Yes, we export to over 15 countries worldwide including the Middle East, Africa, Europe, and Asia. We provide all documentation required for customs clearance."\n      },\n      {\n        "question_ar": "ما هي خيارات التعبئة المتاحة؟",\n        "question_en": "What packaging options are available?",\n        "answer_ar": "نقدم تعبئات متنوعة: عبوات استهلاكية (1 لتر، 2 لتر، 5 لتر)، عبوات صناعية (18 لتر، براميل 200 لتر)، وفليكسي تانك للشحن بالجملة. يمكننا أيضاً توفير تعبئة مخصصة بعلامتك التجارية.",\n        "answer_en": "We offer diverse packaging: consumer bottles (1L, 2L, 5L), industrial packaging (18L, 200L drums), and flexitanks for bulk shipping. We can also provide private label packaging with your brand."\n      },\n      {\n        "question_ar": "كم يستغرق تنفيذ الطلب والتسليم؟",\n        "question_en": "How long does order fulfillment and delivery take?",\n        "answer_ar": "للطلبات المحلية: من 3 إلى 7 أيام عمل. لطلبات التصدير: من 14 إلى 21 يوم عمل حسب الوجهة. نلتزم دائماً بمواعيد التسليم المتفق عليها.",\n        "answer_en": "For local orders: 3-7 business days. For export orders: 14-21 business days depending on destination. We always commit to agreed delivery schedules."\n      }\n    ]\n  },\n  "ctaPartnership": {\n    "title_ar": "هل تبحث عن شريك صناعي موثوق؟",\n    "title_en": "Looking for a Reliable Industrial Partner?",\n    "subtitle_ar": "سواء كنت مصنعاً للأغذية، سلسلة مطاعم، أو موزعاً عالمياً — مصنع السلام يوفر لك حلولاً مخصصة بأعلى معايير الجودة وأسعار تنافسية.",\n    "subtitle_en": "Whether you're a food manufacturer, restaurant chain, or global distributor — Elsalam Factory provides customized solutions with the highest quality standards and competitive prices.",\n    "ctaPrimary_ar": "طلب عرض سعر",\n    "ctaPrimary_en": "Request a Quote",\n    "ctaSecondary_ar": "تواصل مع فريق المبيعات",\n    "ctaSecondary_en": "Contact Sales Team"\n  },\n  "clientLogos": {\n    "badge_ar": "شركاء النجاح",\n    "badge_en": "Success Partners",\n    "titleBefore_ar": "يثق بنا أكثر من",\n    "titleBefore_en": "Trusted by over",\n    "titleCount": "200+",\n    "titleAfter_ar": "شريك صناعي",\n    "titleAfter_en": "industrial partners",\n    "names": [\n      {\n        "name_ar": "شركة الجوهرة",\n        "name_en": "Delta Industrial Co.",\n        "logo": "/uploads/upload_1776484795352_pokpsp.jpg"\n      },\n      {\n        "name_ar": "شركة فرج الله ",\n        "name_en": "",\n        "logo": "/uploads/upload_1776485103132_2d8mjh.webp"\n      },\n      {\n        "name_ar": "امكو فودز (Amco Foods) – بسكويت ",\n        "name_en": "",\n        "logo": "/uploads/upload_1776485156629_hqjcxr.png"\n      },\n      {\n        "name_ar": "ريفر فودز – كيك وبسكويت",\n        "name_en": "",\n        "logo": "/uploads/upload_1776485203590_worl7u.png"\n      },\n      {\n        "name_ar": "أوشن فودز – لمبادا",\n        "name_en": "",\n        "logo": "/uploads/upload_1776485255889_01oirv.webp"\n      },\n      {\n        "name_ar": "الصقر – جبنة وزبدة",\n        "name_en": "",\n        "logo": "/uploads/upload_1776485317963_jjbu5i.png"\n      },\n      {\n        "name_ar": "المتحدة للبويات",\n        "name_en": "",\n        "logo": "/uploads/upload_1776485390285_99h5hx.jfif"\n      },\n      {\n        "name_ar": "بروتال",\n        "name_en": "",\n        "logo": "/uploads/upload_1776485440047_kcy1jp.png"\n      },\n      {\n        "name_ar": "بسكويت سلوى",\n        "name_en": "",\n        "logo": "/uploads/upload_1776485674465_jgqpkd.jfif"\n      },\n      {\n        "name_ar": "بسكويت دهب",\n        "name_en": "",\n        "logo": "/uploads/upload_1776485845529_jnynrg.jfif"\n      },\n      {\n        "name_ar": "ملكو – جبنة",\n        "name_en": "",\n        "logo": "/uploads/upload_1776485891891_1uq6ch.jpg"\n      },\n      {\n        "name_ar": "يوني فودز – بطاطس",\n        "name_en": "",\n        "logo": "/uploads/upload_1776485948714_zfp50s.png"\n      },\n      {\n        "name_ar": "كيرو فودز – شيبسي",\n        "name_en": "",\n        "logo": "/uploads/upload_1776485979118_f3c5xo.png"\n      },\n      {\n        "name_ar": "بير فودز – بسكويت",\n        "name_en": "",\n        "logo": "/uploads/upload_1776486032484_iidbgs.png"\n      },\n      {\n        "name_ar": "فودا فودز – بسكويت",\n        "name_en": "",\n        "logo": "/uploads/upload_1776486118759_q5n133.jfif"\n      },\n      {\n        "name_ar": "إيجيبت مان – شيبسي",\n        "name_en": "",\n        "logo": "/uploads/upload_1776486169484_dz3jv4.png"\n      },\n      {\n        "name_ar": "رايت فودز – شيبسي",\n        "name_en": "",\n        "logo": "/uploads/upload_1776486195275_agnma7.jfif"\n      },\n      {\n        "name_ar": "فوكس – شيبسي",\n        "name_en": "",\n        "logo": "/uploads/upload_1776486216074_2rj1j3.jfif"\n      },\n      {\n        "name_ar": "جبنة المصريين",\n        "name_en": "",\n        "logo": "/uploads/upload_1776486278709_dzbrdf.png"\n      },\n      {\n        "name_ar": "كورونا ",\n        "name_en": "",\n        "logo": "/uploads/upload_1776486320461_ipcp1t.jfif"\n      },\n      {\n        "name_ar": "كلوكوز نودلز (إندومي) ",\n        "name_en": "",\n        "logo": "/uploads/upload_1776486351969_vtogob.png"\n      },\n      {\n        "name_ar": "ماسي فودز",\n        "name_en": "",\n        "logo": "/uploads/upload_1776486386750_ovc4b2.png"\n      },\n      {\n        "name_ar": "مصنع الطارق – جبنة",\n        "name_en": "",\n        "logo": "/uploads/upload_1776486629948_63xzeq.jfif"\n      },\n      {\n        "name_ar": "جاد",\n        "name_en": "",\n        "logo": "/uploads/upload_1776486660531_2jnymh.webp"\n      },\n      {\n        "name_ar": "أبو ربيع",\n        "name_en": "",\n        "logo": "/uploads/upload_1776486705898_0t2kqp.webp"\n      },\n      {\n        "name_ar": "الفلاح",\n        "name_en": "",\n        "logo": "/uploads/upload_1776486738907_e7pxoo.jfif"\n      },\n      {\n        "name_ar": "المدهش ",\n        "name_en": "",\n        "logo": "/uploads/upload_1776486760854_bkavyk.png"\n      },\n      {\n        "name_ar": "زفير للأسماك",\n        "name_en": "",\n        "logo": "/uploads/upload_1776486838088_o24p63.jfif"\n      },\n      {\n        "name_ar": "عروس البحر",\n        "name_en": "",\n        "logo": "/uploads/upload_1776486859854_37op37.png"\n      },\n      {\n        "name_ar": "كبدة العربي",\n        "name_en": "",\n        "logo": "/uploads/upload_1776486925916_z5lytx.jfif"\n      },\n      {\n        "name_ar": "رغيف شاورما",\n        "name_en": "",\n        "logo": "/uploads/upload_1776486945944_kexjrp.png"\n      },\n      {\n        "name_ar": "بلبع للمشويات",\n        "name_en": "",\n        "logo": "/uploads/upload_1776487023971_2hgwob.jfif"\n      },\n      {\n        "name_ar": "هرم الحمام",\n        "name_en": "",\n        "logo": "/uploads/upload_1776487042491_9j5cxy.jfif"\n      },\n      {\n        "name_ar": "قرية عبدالوهاب للمشويات",\n        "name_en": "",\n        "logo": "/uploads/upload_1776487066475_72fbz5.jfif"\n      },\n      {\n        "name_ar": "أبو عوض",\n        "name_en": "",\n        "logo": "/uploads/upload_1776487088718_9ofoyk.jfif"\n      },\n      {\n        "name_ar": "ويف",\n        "name_en": "",\n        "logo": "/uploads/upload_1776487176927_o9zo3v.jfif"\n      }\n    ]\n  },\n  "footer": {\n    "description_ar": "الريادة في عصر الزيوت النباتية وإنتاج الزيوت، السمن والشورتنج منذ عام 2000. موثوق من أكثر من 200 شريك صناعي حول العالم.",\n    "description_en": "Leading in vegetable oil pressing and production of oils, margarine & shortening since 2000. Trusted by over 200 industrial partners worldwide.",\n    "address_ar": "الأبعادية عند مجمع الكليات، البحيرة، دمنهور، مصر",\n    "address_en": "“Al-Abadiya near the Colleges Complex, Beheira, Damanhur, Egypt.”",\n    "phone": "+201050051851",\n    "email": "info@elsalamoil.com",\n    "copyright_en": "Copyright ITechonlogy ",\n    "copyright_ar": "Copyright ITechonlogy ",\n    "logo": "/uploads/upload_1777237219581_etnn18.png",\n    "brandName": "مصنع السلام لعصر وإستخلاص الزيوت النباتية "\n  }\n}	2026-04-26 21:01:09.578	٢٧‏/٤‏/٢٠٢٦ ١٢:٠١:٠٩ ص
cmog9941g0005rtt0c6qoqw05	home	{\n  "heroSlides": {\n    "slides": [\n      {\n        "tabName_ar": "الجودة والإنتاج",\n        "tabName_en": "Quality & Production",\n        "badge_ar": "أكثر من 25 عاماً من الخبرة في عصر الزيوت",\n        "badge_en": "Over 25 years of experience in oil pressing",\n        "titleLine1_ar": "الريادة في عصر",\n        "titleLine1_en": "Leading in",\n        "titleLine2_ar": "الزيوت النباتية",\n        "titleLine2_en": "Vegetable Oils",\n        "subtitle_ar": "مصنع السلام يلتزم بتقديم أعلى معايير الجودة في إنتاج الزيوت، السمن والشورتنج للسوق المصري والعالمي بأحدث التقنيات الأوروبية.",\n        "subtitle_en": "Elsalam Factory is committed to the highest quality standards in producing oils, margarine & shortening for the Egyptian and international markets using the latest European technologies.",\n        "ctaPrimary_ar": "اكتشف منتجاتنا",\n        "ctaPrimary_en": "Explore Products",\n        "ctaPrimaryLink": "/products",\n        "ctaSecondary_ar": "شراكات التصدير",\n        "ctaSecondary_en": "Export Partnerships",\n        "ctaSecondaryLink": "/export",\n        "image": "/uploads/upload_1776465099444_4hgvjl.jfif"\n      },\n      {\n        "tabName_ar": "التصدير العالمي",\n        "tabName_en": "Global Export",\n        "badge_ar": "نصدر لأكثر من 15 دولة حول العالم",\n        "badge_en": "Exporting to 15+ countries worldwide",\n        "titleLine1_ar": "شريكك الموثوق في",\n        "titleLine1_en": "Your Trusted Partner in",\n        "titleLine2_ar": "التجارة الدولية",\n        "titleLine2_en": "Global Trade",\n        "subtitle_ar": "منتجات جاهزة للتصدير بأعلى المواصفات القياسية، مع لوجستيات متكاملة لتلبية متطلبات الأسواق العالمية بمرونة وكفاءة.",\n        "subtitle_en": "Export-ready products meeting the highest international standards, backed by integrated logistics to serve global markets with flexibility and efficiency.",\n        "ctaPrimary_ar": "دليل التصدير",\n        "ctaPrimary_en": "Export Guide",\n        "ctaPrimaryLink": "/export",\n        "ctaSecondary_ar": "تواصل معنا",\n        "ctaSecondary_en": "Contact Us",\n        "ctaSecondaryLink": "/contact",\n        "image": "/uploads/upload_1776467998203_e7lcwm.jfif"\n      },\n      {\n        "tabName_ar": "شراكات الجملة B2B",\n        "tabName_en": "B2B Partnerships",\n        "badge_ar": "طاقة إنتاجية تصل إلى 500 طن يومياً",\n        "badge_en": "Production capacity up to 500 tons/day",\n        "titleLine1_ar": "حلول صناعية",\n        "titleLine1_en": "Industrial Solutions at",\n        "titleLine2_ar": "بأسعار المصنع",\n        "titleLine2_en": "Factory Prices",\n        "subtitle_ar": "نوفر الزيوت، السمن، والشورتنج بكميات ضخمة وتعبئات مخصصة للمصانع، المخابز، وسلاسل المطاعم الكبرى.",\n        "subtitle_en": "We supply oils, margarine, and shortening in bulk quantities with custom packaging for factories, bakeries, and major restaurant chains.",\n        "ctaPrimary_ar": "طلب عرض سعر بالجملة",\n        "ctaPrimary_en": "Request Bulk Quote",\n        "ctaPrimaryLink": "/b2b/quote",\n        "ctaSecondary_ar": "مزايا الشراكة",\n        "ctaSecondary_en": "Partnership Benefits",\n        "ctaSecondaryLink": "/b2b",\n        "image": "/uploads/upload_1776468282395_galmqr.jfif"\n      }\n    ]\n  },\n  "stats": {\n    "items": [\n      {\n        "value": "25+",\n        "label_ar": "سنوات الخبرة",\n        "label_en": "Years of Experience"\n      },\n      {\n        "value": "500",\n        "label_ar": "طن إنتاج يومياً",\n        "label_en": "Tons Daily Production"\n      },\n      {\n        "value": "15+",\n        "label_ar": "دولة تصدير",\n        "label_en": "Export Countries"\n      },\n      {\n        "value": "200+",\n        "label_ar": "عميل صناعي",\n        "label_en": "Industrial Clients"\n      },\n      {\n        "value": "8",\n        "label_ar": "خطوط إنتاج",\n        "label_en": "Production Lines"\n      },\n      {\n        "value": "6",\n        "label_ar": "شهادات جودة",\n        "label_en": "Quality Certifications"\n      }\n    ]\n  },\n  "whyChooseUs": {\n    "badge_ar": "لماذا نحن؟",\n    "badge_en": "Why Us?",\n    "title_ar": "لماذا تختار",\n    "title_en": "Why Choose",\n    "titleHighlight_ar": "مصنع السلام",\n    "titleHighlight_en": "Elsalam Factory",\n    "subtitle_ar": "نبني شراكات استراتيجية موثوقة تعتمد على الجودة والالتزام المطلق",\n    "subtitle_en": "We build reliable strategic partnerships based on quality and absolute commitment",\n    "reasons": [\n      {\n        "title_ar": "طاقة إنتاجية ضخمة",\n        "title_en": "Massive Production Capacity",\n        "description_ar": "بقدرة إنتاجية تصل إلى 500 طن يومياً، نضمن تلبية كافة الطلبيات الكبرى للقطاع الصناعي والتجاري دون تأخير.",\n        "description_en": "With a production capacity of up to 500 tons per day, we guarantee fulfilling all major orders for the industrial and commercial sectors without delay."\n      },\n      {\n        "title_ar": "معايير جودة عالمية",\n        "title_en": "Global Quality Standards",\n        "description_ar": "حاصلون على أعلى شهادات الجودة وسلامة الغذاء الدولية، مما يضمن تصدير منتجاتنا لأكثر من 15 دولة.",\n        "description_en": "Certified with the highest international quality and food safety standards, ensuring our products are exported to over 15 countries."\n      },\n      {\n        "title_ar": "تقنيات تكرير متطورة",\n        "title_en": "Advanced Refining Technology",\n        "description_ar": "نستخدم أحدث تكنولوجيا التكرير لتحقيق أعلى درجات النقاء والشفافية، مع الحفاظ على القيمة الغذائية.",\n        "description_en": "We use the latest refining technology to achieve the highest levels of purity and transparency while preserving nutritional value."\n      },\n      {\n        "title_ar": "طبيعي 100%",\n        "title_en": "100% Natural",\n        "description_ar": "منتجاتنا خالية تماماً من المواد الحافظة والإضافات الكيميائية الضارة، لنقدم لك زيوتاً صحية وآمنة تماماً.",\n        "description_en": "Our products are completely free from preservatives and harmful chemical additives, offering you healthy and safe oils."\n      }\n    ]\n  },\n  "segments": {\n    "title_ar": "كيف يمكننا خدمتك؟",\n    "title_en": "How Can We Serve You?",\n    "subtitle_ar": "نقدم حلولاً مخصصة لكل قطاع",\n    "subtitle_en": "Customized solutions for every sector",\n    "items": [\n      {\n        "title_ar": "مصانع الأغذية",\n        "title_en": "Food Manufacturers",\n        "desc_ar": "حلول بالجملة مع مواصفات مخصصة لخطوط إنتاجك",\n        "desc_en": "Wholesale solutions with custom specs for your production lines",\n        "cta_ar": "طلب عرض سعر",\n        "cta_en": "Request Quote",\n        "image": "/uploads/upload_1776475289226_xm1xs1.jfif"\n      },\n      {\n        "title_ar": "فنادق ومطاعم",\n        "title_en": "Hotels & Restaurants",\n        "desc_ar": "منتجات HoReCa بتعبئات مناسبة ومواصفات عالمية",\n        "desc_en": "HoReCa products with suitable packaging & global specs",\n        "cta_ar": "تواصل معنا",\n        "cta_en": "Contact Us",\n        "image": "/uploads/upload_1776475687003_yhtbtt.jfif"\n      },\n      {\n        "title_ar": "التصدير العالمي",\n        "title_en": "Global Export",\n        "desc_ar": "منتجات جاهزة للتصدير بمطابقة كاملة للمعايير الدولية",\n        "desc_en": "Export-ready products fully compliant with international standards",\n        "cta_ar": "استفسار تصدير",\n        "cta_en": "Export Inquiry",\n        "image": "/uploads/upload_1776476028139_k7nnht.jfif"\n      },\n      {\n        "title_ar": "التجزئة والتوزيع",\n        "title_en": "Retail & Distribution",\n        "desc_ar": "أسعار تنافسية وتوصيل مباشر لنقاط البيع",\n        "desc_en": "Competitive prices with direct delivery to points of sale",\n        "cta_ar": "تسوق الآن",\n        "cta_en": "Shop Now",\n        "image": "/uploads/upload_1776477111361_80f9nd.jfif"\n      }\n    ]\n  },\n  "featuredProducts": {\n    "badge_ar": "أفضل المنتجات",\n    "badge_en": "Top Products",\n    "title_ar": "منتجاتنا الرائدة",\n    "title_en": "Our Leading Products",\n    "subtitle_ar": "تلبية لاحتياجات السوق المحلي والتصدير",\n    "subtitle_en": "Meeting local market and export needs",\n    "viewAll_ar": "عرض كل المنتجات",\n    "viewAll_en": "View All Products",\n    "products": [\n      {\n        "title_ar": "زيت صويا مكرر",\n        "title_en": "Refined Soybean Oil",\n        "subtitle": "Refined Soybean Oil",\n        "description_ar": "زيت صويا نقي وعالي الجودة مناسب للطهي والقلي المتكرر.",\n        "description_en": "Pure and high-quality soybean oil suitable for cooking and repeated frying.",\n        "slug": "http://localhost:3000/products?category=soybean-oil-",\n        "image": "/uploads/upload_1776470693226_ch171n.jfif"\n      },\n      {\n        "title_ar": "سمن نباتي ممتاز",\n        "title_en": "Premium Vegetable Ghee",\n        "subtitle": "Vegetable Ghee",\n        "description_ar": "سمن نباتي بقوام كريمي ونكهة غنية تضفي طعماً مميزاً.",\n        "description_en": "Vegetable ghee with a creamy texture and rich flavor that adds a distinct taste.",\n        "slug": "vegetable-ghee",\n        "image": "/uploads/upload_1776470997067_72x4rn.jfif"\n      },\n      {\n        "title_ar": "زيت عباد الشمس",\n        "title_en": "Sunflower Oil",\n        "subtitle": "Sunflower Oil",\n        "description_ar": "زيت خفيف وصحي مثالي للاستخدام اليومي والسلطات.",\n        "description_en": "Light and healthy oil ideal for daily use and salads.",\n        "slug": "sunflower-oil",\n        "image": "/uploads/upload_1776471333243_erxh32.jfif"\n      },\n      {\n        "title_ar": "شورتنج المخابز",\n        "title_en": "Bakery Shortening",\n        "subtitle": "Bakery Shortening",\n        "description_ar": "شورتنج متخصص للحلويات والمخبوزات يعطي هشاشة فائقة.",\n        "description_en": "Specialized shortening for sweets and baked goods providing superior crispness.",\n        "slug": "bakery-shortening",\n        "image": "/uploads/upload_1776471821886_33wzg9.jfif"\n      }\n    ]\n  },\n  "ourProcess": {\n    "badge_ar": "آلية الإنتاج والجودة",\n    "badge_en": "Our Process",\n    "title_ar": "من البذرة إلى المائدة.. رحلة الجودة",\n    "title_en": "From Seed to Shelf",\n    "subtitle_ar": "نميز أنفسنا بتشغيل أحد أكثر المنشآت تطوراً وأتمتة في المنطقة، لنضمن أن كل قطرة مطابقة للمعايير العالمية.",\n    "subtitle_en": "We operate one of the most technologically advanced automated facilities in the region, ensuring every drop meets global benchmarks.",\n    "steps": [\n      {\n        "image": "/uploads/upload_1776472340208_t9dmw2.jfif",\n        "title_en": "Careful Seed Selection",\n        "title_ar": "اختيار أفضل البذور",\n        "description_en": "We source only the highest quality, non-GMO seeds from trusted global partners to ensure the foundation of our oils is flawless.",\n        "description_ar": "نعتمد على أجود أنواع البذور غير المعدلة وراثياً من موردين عالميين موثوقين، لنضمن أن أساس زيوتنا مثالي."\n      },\n      {\n        "image": "/uploads/upload_1776472924543_3v286e.jfif",\n        "title_en": "Advanced Double Refining",\n        "title_ar": "تكرير متميز ومزدوج",\n        "description_en": "Utilizing state-of-the-art European machinery, our oil undergoes multiple stages of refining, neutralizing, and deodorizing for ultimate purity.",\n        "description_ar": "باستخدام أحدث الآلات الأوروبية، يمر زيتها بمراحل دقيقة من التكرير والتعادل وإزالة الرائحة لضمان النقاء المطلق."\n      },\n      {\n        "image": "/uploads/upload_1776473188317_uw6tsp.jfif",\n        "title_en": "Rigorous Labs & QC",\n        "title_ar": "فحوصات الجودة الصارمة",\n        "description_en": "Every batch is meticulously analyzed in our on-site laboratories against strict international ISO & HACCP standards.",\n        "description_ar": "تُحلل كل دفعة إنتاجية بدقة متناهية في مختبراتنا المجهزة، وفقاً لأعلى معايير الأيزو ونظام الهاسب (HACCP)."\n      },\n      {\n        "image": "/uploads/upload_1776473676483_gg90tq.jfif",\n        "title_en": "Hygienic Packaging in Compliance with Quality Standards",\n        "title_ar": "تعبئة صحية وفق معايير الجودة",\n        "description_en": "Hygienic Packaging According to the Highest Standards",\n        "description_ar": "تعبئة صحية وفق أعلى المعايير"\n      }\n    ]\n  },\n  "globalFootprint": {\n    "title_ar": "البصمة العالمية",\n    "title_en": "Global Footprint",\n    "subtitle_ar": "نصدر لأكثر من 15 دولة حول العالم",\n    "subtitle_en": "We export to over 15 countries worldwide"\n  },\n  "sustainability": {\n    "title_ar": "الاستدامة والمسؤولية البيئية",\n    "title_en": "Sustainability & Environmental Responsibility",\n    "subtitle_ar": "نلتزم بأعلى معايير الاستدامة في عمليات الإنتاج",\n    "subtitle_en": "We are committed to the highest sustainability standards in our production processes",\n    "image": "/uploads/upload_1776477923691_sm53cx.jfif"\n  },\n  "virtualTour": {\n    "title_ar": "الجولة الافتراضية",\n    "title_en": "Virtual Tour",\n    "subtitle_ar": "تعرف على مصنعنا من الداخل",\n    "subtitle_en": "Explore our factory from the inside",\n    "isVisible": false\n  },\n  "packaging": {\n    "badge_ar": "خيارات التعبئة",\n    "badge_en": "Packaging Options",\n    "title_ar": "عبوات تلبي كافة احتياجاتك",\n    "title_en": "Packaging for Every Need",\n    "subtitle_ar": "نوفر خيارات تعبئة مرنة ومتنوعة تناسب جميع القطاعات من التجزئة وحتى الشحن البحري للصناعات الكبرى.",\n    "subtitle_en": "We provide flexible and diverse packaging options suitable for all sectors, from retail to bulk maritime shipping for major industries.",\n    "types": [\n      {\n        "title_ar": "عبوات بلاستيكية (PET)",\n        "title_en": "PET Plastic Bottles",\n        "sizes_ar": "1، 2، 5 لتر",\n        "sizes_en": "1, 2, 5 liters",\n        "description_ar": "مثالية لتطبيقات التجزئة والأسواق الاستهلاكية والاستخدام المنزلي.",\n        "description_en": "Ideal for retail applications, consumer markets, and household use.",\n        "image": "/uploads/upload_1776481345801_9ja2xu.jfif"\n      },\n      {\n        "title_ar": "تنكات صفيح",\n        "title_en": "Tin Cans",\n        "sizes_ar": "16 لتـر، 18 لتـر",\n        "sizes_en": "16L, 18L",\n        "description_ar": "الخيار الأمثل للمطاعم والفنادق (HoReCa) المعتمدة على الاستهلاك الكثيف.",\n        "description_en": "The optimal choice for restaurants and hotels (HoReCa) with heavy consumption.",\n        "image": "/uploads/upload_1776481632761_jc667m.jfif"\n      },\n      {\n        "title_ar": "براميـل حديدية",\n        "title_en": "Steel Drums",\n        "sizes_ar": "200 لتـر",\n        "sizes_en": "200L",\n        "description_ar": "تعبئة اقتصادية للمصانع الغذائية ومصانع الحلويات والمخابز الكبرى.",\n        "description_en": "Economical packaging for food factories, confectioneries, and large bakeries.",\n        "image": "/uploads/upload_1776481868312_fno49e.jfif"\n      },\n      {\n        "title_ar": "فليكسي تانك",\n        "title_en": "Flexitank",\n        "sizes_ar": "22,000 لتـر",\n        "sizes_en": "22,000L",\n        "description_ar": "الحل الاستراتيجي لتصدير كميات ضخمة للشحن البحري بأقل تكلفة لوجستية.",\n        "description_en": "The strategic solution for exporting large quantities via maritime shipping at the lowest logistics cost.",\n        "image": "/uploads/upload_1776482319857_icf4mt.jfif"\n      }\n    ]\n  },\n  "certifications": {\n    "badge_ar": "الجودة والامتثال",\n    "badge_en": "Quality & Compliance",\n    "title_ar": "شهادات الجودة والاعتمادات الدولية",\n    "title_en": "Quality Certifications & International Accreditations",\n    "subtitle_ar": "نفخر بحصولنا على أعلى الشهادات العالمية التي تضمن جودة وسلامة منتجاتنا",\n    "subtitle_en": "We are proud to hold the highest international certifications ensuring the quality and safety of our products",\n    "certs": [\n      {\n        "name_ar": "ISO 9001",\n        "name_en": "ISO 9001",\n        "desc_ar": "إدارة الجودة الشاملة",\n        "desc_en": "Total Quality Management"\n      },\n      {\n        "name_ar": "ISO 22000",\n        "name_en": "ISO 22000",\n        "desc_ar": "سلامة الغذاء الدولية",\n        "desc_en": "International Food Safety"\n      },\n      {\n        "name_ar": "HACCP",\n        "name_en": "HACCP",\n        "desc_ar": "تحليل المخاطر ونقاط التحكم",\n        "desc_en": "Hazard Analysis & Critical Control"\n      },\n      {\n        "name_ar": "Halal",\n        "name_en": "Halal",\n        "desc_ar": "شهادة الحلال المعتمدة",\n        "desc_en": "Certified Halal"\n      },\n      {\n        "name_ar": "GMP",\n        "name_en": "GMP",\n        "desc_ar": "ممارسات التصنيع الجيدة",\n        "desc_en": "Good Manufacturing Practices"\n      },\n      {\n        "name_ar": "FDA",\n        "name_en": "FDA",\n        "desc_ar": "معتمد من إدارة الغذاء والدواء",\n        "desc_en": "FDA Approved"\n      }\n    ]\n  },\n  "testimonials": {\n    "title_ar": "ماذا يقول عملاؤنا",\n    "title_en": "What Our Clients Say",\n    "subtitle_ar": "ثقة تمتد لأكثر من 25 عاماً مع آلاف العملاء في مصر والعالم",\n    "subtitle_en": "Trust spanning over 25 years with thousands of clients in Egypt and worldwide",\n    "items": [\n      {\n        "name_ar": "م. خالد عبد الرحمن",\n        "name_en": "Eng. Khaled Abdel Rahman",\n        "role_ar": "مدير مشتريات — مصنع بسكويت النجمة",\n        "role_en": "Purchasing Manager — Star Biscuit Factory",\n        "content_ar": "نتعامل مع مصنع السلام منذ أكثر من 8 سنوات. جودة الشورتنج ثابتة في كل شحنة، وخدمة ما بعد البيع ممتازة.",\n        "content_en": "We've been working with Elsalam Factory for over 8 years. The shortening quality is consistent in every shipment, and the after-sales service is excellent."\n      },\n      {\n        "name_ar": "أ. سارة المصري",\n        "name_en": "Ms. Sara Al-Masry",\n        "role_ar": "مالكة سلسلة مطاعم الأصالة",\n        "role_en": "Owner of Al-Asala Restaurant Chain",\n        "content_ar": "زيت عباد الشمس من السلام هو اختيارنا الأول. لا يغير نكهة الطعام ويتحمل القلي المتكرر بشكل ممتاز.",\n        "content_en": "Elsalam's sunflower oil is our first choice. It doesn't alter food flavor and handles repeated frying excellently."\n      },\n      {\n        "name_ar": "Mr. Ahmed Hassan",\n        "name_en": "Mr. Ahmed Hassan",\n        "role_ar": "مدير الاستيراد — شركة Global Foods Trading, الإمارات",\n        "role_en": "Import Manager — Global Foods Trading, UAE",\n        "content_ar": "مصنع السلام هو موردنا الموثوق للزيوت النباتية. شهادات ISO والحلال مع أسعار تنافسية تجعلهم الخيار الأفضل في مصر.",\n        "content_en": "Elsalam is our trusted supplier for vegetable oils. Their ISO and Halal certifications, combined with competitive pricing, make them the best choice in Egypt."\n      },\n      {\n        "name_ar": "أ. محمد يوسف",\n        "name_en": "Mr. Mohamed Youssef",\n        "role_ar": "موزع معتمد — القاهرة الكبرى",\n        "role_en": "Authorized Distributor — Greater Cairo",\n        "content_ar": "التعامل مع مصنع السلام سهل واحترافي. الأسعار تنافسية والتسليم دائماً في الموعد. أنصح بالتعامل معهم.",\n        "content_en": "Working with Elsalam Factory is easy and professional. Prices are competitive and delivery is always on time. Highly recommended."\n      }\n    ]\n  },\n  "timeline": {\n    "badge_ar": "مراحل الإنتاج",\n    "badge_en": "Production Process",\n    "title_ar": "مسار الإنتاج",\n    "title_en": "Production Journey",\n    "subtitle_ar": "من الطبيعة إلى مائدتك، رحلة موثقة بأعلى معايير الجودة العالمية",\n    "subtitle_en": "From nature to your table, a journey documented with the highest global quality standards",\n    "steps": [\n      {\n        "title_ar": "استلام وتجهيز البذور",\n        "title_en": "Seed Reception & Preparation",\n        "description_ar": "استلام البذور الزراعية (صويا، عباد شمس) وتمريرها على أجهزة التنظيف المغناطيسية والغربلة.",\n        "description_en": "Receiving agricultural seeds (soybean, sunflower) and passing them through magnetic cleaning and sieving equipment."\n      },\n      {\n        "title_ar": "العصر والاستخلاص",\n        "title_en": "Pressing & Extraction",\n        "description_ar": "تكسير وتسخين البذور لزيادة المردود الزيتي، ثم عصرها آلياً واستخلاص الزيت الخام.",\n        "description_en": "Crushing and heating seeds to increase oil yield, then mechanically pressing and extracting crude oil."\n      },\n      {\n        "title_ar": "التكرير والتنقية",\n        "title_en": "Refining & Purification",\n        "description_ar": "إزالة الصمغ، التبييض، ونزع الرائحة للوصول للزيت النقي عالي الشفافية.",\n        "description_en": "Degumming, bleaching, and deodorizing to achieve pure, highly transparent oil."\n      },\n      {\n        "title_ar": "التعبئة والتغليف",\n        "title_en": "Filling & Packaging",\n        "description_ar": "تعبئة آلية تحت ظروف صحية تامة لضمان الحفاظ على الخواص الطبيعية للمنتج.",\n        "description_en": "Automated filling under full sanitary conditions to preserve the natural properties of the product."\n      }\n    ]\n  },\n  "faq": {\n    "title_ar": "الأسئلة الشائعة",\n    "title_en": "Frequently Asked Questions",\n    "subtitle_ar": "إجابات على أكثر الأسئلة شيوعاً من عملائنا",\n    "subtitle_en": "Answers to the most common questions from our clients",\n    "items": [\n      {\n        "question_ar": "ما هي أنواع الزيوت التي ينتجها مصنع السلام؟",\n        "question_en": "What types of oils does Elsalam Factory produce?",\n        "answer_ar": "ينتج مصنع السلام تشكيلة واسعة تشمل: زيت صويا مكرر، زيت عباد الشمس، زيت نخيل مكرر، سمن نباتي ممتاز، سمن نباتي صناعي، شورتنج المخابز، وشورتنج القلي العميق. كما نقدم خلطات زيوت مخصصة حسب مواصفات العميل.",\n        "answer_en": "Elsalam Factory produces a wide range including: refined soybean oil, sunflower oil, refined palm oil, premium vegetable ghee, industrial margarine, bakery shortening, and deep frying shortening. We also offer custom oil blends per client specifications."\n      },\n      {\n        "question_ar": "هل منتجاتكم حاصلة على شهادات جودة؟",\n        "question_en": "Are your products quality certified?",\n        "answer_ar": "نعم، جميع منتجاتنا حاصلة على شهادات ISO 9001 و ISO 22000 و HACCP وشهادة الحلال. نلتزم بأعلى معايير الجودة والسلامة الغذائية في كل مراحل الإنتاج.",\n        "answer_en": "Yes, all our products hold ISO 9001, ISO 22000, HACCP, and Halal certifications. We adhere to the highest quality and food safety standards at every production stage."\n      },\n      {\n        "question_ar": "ما هي الحد الأدنى لكمية الطلب؟",\n        "question_en": "What is the minimum order quantity?",\n        "answer_ar": "للسوق المحلي: يختلف الحد الأدنى حسب نوع المنتج والتعبئة. للتصدير: الحد الأدنى هو 20 طن (حاوية 20 قدم). يمكنك التواصل معنا للحصول على تفاصيل أكثر حسب احتياجك.",\n        "answer_en": "For local market: the minimum varies by product type and packaging. For export: the minimum is 20 tons (1x20' FCL). Contact us for more details based on your needs."\n      },\n      {\n        "question_ar": "هل تصدرون لخارج مصر؟",\n        "question_en": "Do you export outside Egypt?",\n        "answer_ar": "نعم، نصدّر لأكثر من 15 دولة حول العالم تشمل الشرق الأوسط، أفريقيا، أوروبا، وآسيا. نوفر جميع الوثائق اللازمة للتخليص الجمركي.",\n        "answer_en": "Yes, we export to over 15 countries worldwide including the Middle East, Africa, Europe, and Asia. We provide all documentation required for customs clearance."\n      },\n      {\n        "question_ar": "ما هي خيارات التعبئة المتاحة؟",\n        "question_en": "What packaging options are available?",\n        "answer_ar": "نقدم تعبئات متنوعة: عبوات استهلاكية (1 لتر، 2 لتر، 5 لتر)، عبوات صناعية (18 لتر، براميل 200 لتر)، وفليكسي تانك للشحن بالجملة. يمكننا أيضاً توفير تعبئة مخصصة بعلامتك التجارية.",\n        "answer_en": "We offer diverse packaging: consumer bottles (1L, 2L, 5L), industrial packaging (18L, 200L drums), and flexitanks for bulk shipping. We can also provide private label packaging with your brand."\n      },\n      {\n        "question_ar": "كم يستغرق تنفيذ الطلب والتسليم؟",\n        "question_en": "How long does order fulfillment and delivery take?",\n        "answer_ar": "للطلبات المحلية: من 3 إلى 7 أيام عمل. لطلبات التصدير: من 14 إلى 21 يوم عمل حسب الوجهة. نلتزم دائماً بمواعيد التسليم المتفق عليها.",\n        "answer_en": "For local orders: 3-7 business days. For export orders: 14-21 business days depending on destination. We always commit to agreed delivery schedules."\n      }\n    ]\n  },\n  "ctaPartnership": {\n    "title_ar": "هل تبحث عن شريك صناعي موثوق؟",\n    "title_en": "Looking for a Reliable Industrial Partner?",\n    "subtitle_ar": "سواء كنت مصنعاً للأغذية، سلسلة مطاعم، أو موزعاً عالمياً — مصنع السلام يوفر لك حلولاً مخصصة بأعلى معايير الجودة وأسعار تنافسية.",\n    "subtitle_en": "Whether you're a food manufacturer, restaurant chain, or global distributor — Elsalam Factory provides customized solutions with the highest quality standards and competitive prices.",\n    "ctaPrimary_ar": "طلب عرض سعر",\n    "ctaPrimary_en": "Request a Quote",\n    "ctaSecondary_ar": "تواصل مع فريق المبيعات",\n    "ctaSecondary_en": "Contact Sales Team"\n  },\n  "clientLogos": {\n    "badge_ar": "شركاء النجاح",\n    "badge_en": "Success Partners",\n    "titleBefore_ar": "يثق بنا أكثر من",\n    "titleBefore_en": "Trusted by over",\n    "titleCount": "200+",\n    "titleAfter_ar": "شريك صناعي",\n    "titleAfter_en": "industrial partners",\n    "names": [\n      {\n        "name_ar": "شركة الجوهرة",\n        "name_en": "Delta Industrial Co.",\n        "logo": "/uploads/upload_1776484795352_pokpsp.jpg"\n      },\n      {\n        "name_ar": "شركة فرج الله ",\n        "name_en": "",\n        "logo": "/uploads/upload_1776485103132_2d8mjh.webp"\n      },\n      {\n        "name_ar": "امكو فودز (Amco Foods) – بسكويت ",\n        "name_en": "",\n        "logo": "/uploads/upload_1776485156629_hqjcxr.png"\n      },\n      {\n        "name_ar": "ريفر فودز – كيك وبسكويت",\n        "name_en": "",\n        "logo": "/uploads/upload_1776485203590_worl7u.png"\n      },\n      {\n        "name_ar": "أوشن فودز – لمبادا",\n        "name_en": "",\n        "logo": "/uploads/upload_1776485255889_01oirv.webp"\n      },\n      {\n        "name_ar": "الصقر – جبنة وزبدة",\n        "name_en": "",\n        "logo": "/uploads/upload_1776485317963_jjbu5i.png"\n      },\n      {\n        "name_ar": "المتحدة للبويات",\n        "name_en": "",\n        "logo": "/uploads/upload_1776485390285_99h5hx.jfif"\n      },\n      {\n        "name_ar": "بروتال",\n        "name_en": "",\n        "logo": "/uploads/upload_1776485440047_kcy1jp.png"\n      },\n      {\n        "name_ar": "بسكويت سلوى",\n        "name_en": "",\n        "logo": "/uploads/upload_1776485674465_jgqpkd.jfif"\n      },\n      {\n        "name_ar": "بسكويت دهب",\n        "name_en": "",\n        "logo": "/uploads/upload_1776485845529_jnynrg.jfif"\n      },\n      {\n        "name_ar": "ملكو – جبنة",\n        "name_en": "",\n        "logo": "/uploads/upload_1776485891891_1uq6ch.jpg"\n      },\n      {\n        "name_ar": "يوني فودز – بطاطس",\n        "name_en": "",\n        "logo": "/uploads/upload_1776485948714_zfp50s.png"\n      },\n      {\n        "name_ar": "كيرو فودز – شيبسي",\n        "name_en": "",\n        "logo": "/uploads/upload_1776485979118_f3c5xo.png"\n      },\n      {\n        "name_ar": "بير فودز – بسكويت",\n        "name_en": "",\n        "logo": "/uploads/upload_1776486032484_iidbgs.png"\n      },\n      {\n        "name_ar": "فودا فودز – بسكويت",\n        "name_en": "",\n        "logo": "/uploads/upload_1776486118759_q5n133.jfif"\n      },\n      {\n        "name_ar": "إيجيبت مان – شيبسي",\n        "name_en": "",\n        "logo": "/uploads/upload_1776486169484_dz3jv4.png"\n      },\n      {\n        "name_ar": "رايت فودز – شيبسي",\n        "name_en": "",\n        "logo": "/uploads/upload_1776486195275_agnma7.jfif"\n      },\n      {\n        "name_ar": "فوكس – شيبسي",\n        "name_en": "",\n        "logo": "/uploads/upload_1776486216074_2rj1j3.jfif"\n      },\n      {\n        "name_ar": "جبنة المصريين",\n        "name_en": "",\n        "logo": "/uploads/upload_1776486278709_dzbrdf.png"\n      },\n      {\n        "name_ar": "كورونا ",\n        "name_en": "",\n        "logo": "/uploads/upload_1776486320461_ipcp1t.jfif"\n      },\n      {\n        "name_ar": "كلوكوز نودلز (إندومي) ",\n        "name_en": "",\n        "logo": "/uploads/upload_1776486351969_vtogob.png"\n      },\n      {\n        "name_ar": "ماسي فودز",\n        "name_en": "",\n        "logo": "/uploads/upload_1776486386750_ovc4b2.png"\n      },\n      {\n        "name_ar": "مصنع الطارق – جبنة",\n        "name_en": "",\n        "logo": "/uploads/upload_1776486629948_63xzeq.jfif"\n      },\n      {\n        "name_ar": "جاد",\n        "name_en": "",\n        "logo": "/uploads/upload_1776486660531_2jnymh.webp"\n      },\n      {\n        "name_ar": "أبو ربيع",\n        "name_en": "",\n        "logo": "/uploads/upload_1776486705898_0t2kqp.webp"\n      },\n      {\n        "name_ar": "الفلاح",\n        "name_en": "",\n        "logo": "/uploads/upload_1776486738907_e7pxoo.jfif"\n      },\n      {\n        "name_ar": "المدهش ",\n        "name_en": "",\n        "logo": "/uploads/upload_1776486760854_bkavyk.png"\n      },\n      {\n        "name_ar": "زفير للأسماك",\n        "name_en": "",\n        "logo": "/uploads/upload_1776486838088_o24p63.jfif"\n      },\n      {\n        "name_ar": "عروس البحر",\n        "name_en": "",\n        "logo": "/uploads/upload_1776486859854_37op37.png"\n      },\n      {\n        "name_ar": "كبدة العربي",\n        "name_en": "",\n        "logo": "/uploads/upload_1776486925916_z5lytx.jfif"\n      },\n      {\n        "name_ar": "رغيف شاورما",\n        "name_en": "",\n        "logo": "/uploads/upload_1776486945944_kexjrp.png"\n      },\n      {\n        "name_ar": "بلبع للمشويات",\n        "name_en": "",\n        "logo": "/uploads/upload_1776487023971_2hgwob.jfif"\n      },\n      {\n        "name_ar": "هرم الحمام",\n        "name_en": "",\n        "logo": "/uploads/upload_1776487042491_9j5cxy.jfif"\n      },\n      {\n        "name_ar": "قرية عبدالوهاب للمشويات",\n        "name_en": "",\n        "logo": "/uploads/upload_1776487066475_72fbz5.jfif"\n      },\n      {\n        "name_ar": "أبو عوض",\n        "name_en": "",\n        "logo": "/uploads/upload_1776487088718_9ofoyk.jfif"\n      },\n      {\n        "name_ar": "ويف",\n        "name_en": "",\n        "logo": "/uploads/upload_1776487176927_o9zo3v.jfif"\n      }\n    ]\n  },\n  "footer": {\n    "description_ar": "الريادة في عصر الزيوت النباتية وإنتاج الزيوت، السمن والشورتنج منذ عام 2000. موثوق من أكثر من 200 شريك صناعي حول العالم.",\n    "description_en": "Leading in vegetable oil pressing and production of oils, margarine & shortening since 2000. Trusted by over 200 industrial partners worldwide.",\n    "address_ar": "الأبعادية عند مجمع الكليات، البحيرة، دمنهور، مصر",\n    "address_en": "“Al-Abadiya near the Colleges Complex, Beheira, Damanhur, Egypt.”",\n    "phone": "+201050051851",\n    "email": "info@elsalamoil.com",\n    "copyright_en": "Copyright ITechonlogy ",\n    "copyright_ar": "Copyright ITechonlogy ",\n    "logo": "/uploads/upload_1777237219581_etnn18.png",\n    "brandName": "مصنع السلام لعصر وإستخلاص الزيوت النباتية ",\n    "brandEn": "El-Salam Factory for Pressing and Extracting Vegetable Oils"\n  }\n}	2026-04-26 21:03:06.676	٢٧‏/٤‏/٢٠٢٦ ١٢:٠٣:٠٦ ص
cmopb2j6a0001rtosiobs9xwb	quality	{\n  "hero": {\n    "title_ar": "معايير الجودة",\n    "title_en": "Quality Standards",\n    "subtitle_ar": "نلتزم بأعلى معايير الجودة والسلامة الغذائية العالمية في كل مرحلة من مراحل الإنتاج",\n    "subtitle_en": "We adhere to the highest global quality and food safety standards at every stage of production"\n  },\n  "qcChecks": {\n    "title_ar": "نقاط رقابة الجودة",\n    "title_en": "Quality Control Checkpoints",\n    "subtitle_ar": "8 نقاط فحص صارمة في كل دورة إنتاج",\n    "subtitle_en": "8 strict inspection points in every production cycle",\n    "items": [\n      {\n        "text_ar": "فحص المواد الخام عند الاستلام",\n        "text_en": "Raw material inspection upon receipt",\n        "image": "/uploads/upload_1777784627223_3l7vxz.jfif"\n      },\n      {\n        "text_ar": "تحليل نسبة الحموضة والرطوبة",\n        "text_en": "Acidity and moisture analysis",\n        "image": "https://images.unsplash.com/photo-1582719478250-c89e82c5a013?q=80&w=800&auto=format&fit=crop"\n      },\n      {\n        "text_ar": "اختبار اللون والشفافية",\n        "text_en": "Color and transparency testing",\n        "image": "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?q=80&w=800&auto=format&fit=crop"\n      },\n      {\n        "text_ar": "تحليل نقطة الدخان ونقطة الذوبان",\n        "text_en": "Smoke point and melting point analysis",\n        "image": "https://images.unsplash.com/photo-1579154204601-39769d4b0f09?q=80&w=800&auto=format&fit=crop"\n      },\n      {\n        "text_ar": "فحص المعادن الثقيلة والملوثات",\n        "text_en": "Heavy metals and contaminants testing",\n        "image": "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop"\n      },\n      {\n        "text_ar": "اختبار الثبات الأكسيدي",\n        "text_en": "Oxidative stability testing",\n        "image": "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=800&auto=format&fit=crop"\n      },\n      {\n        "text_ar": "فحص التعبئة والتغليف",\n        "text_en": "Packaging and labeling inspection",\n        "image": "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?q=80&w=800&auto=format&fit=crop"\n      },\n      {\n        "text_ar": "تحليل العمر الافتراضي المتسارع",\n        "text_en": "Accelerated shelf life analysis",\n        "image": "https://images.unsplash.com/photo-1576086213369-8b806f7df282?q=80&w=800&auto=format&fit=crop"\n      }\n    ]\n  },\n  "lab": {\n    "title_ar": "معامل فحص الجودة",\n    "title_en": "Quality Control Laboratories",\n    "description_ar": "مختبرات مجهزة بأحدث أجهزة التحليل والفحص لضمان مطابقة منتجاتنا لأعلى المعايير الدولية",\n    "description_en": "Laboratories equipped with the latest analysis and testing equipment to ensure our products meet the highest international standards",\n    "images": [\n      {\n        "title_ar": "فريق الجودة",\n        "title_en": "Quality Team",\n        "url": ""\n      },\n      {\n        "title_ar": "فحص الجودة",\n        "title_en": "Quality Check",\n        "url": ""\n      },\n      {\n        "title_ar": "اختبار المعمل",\n        "title_en": "Lab Test",\n        "url": ""\n      }\n    ]\n  },\n  "downloads": {\n    "title_ar": "تحميل شهادات الجودة والمواصفات الفنية",\n    "title_en": "Download Quality Certificates & Technical Specifications",\n    "items": [\n      {\n        "label_ar": "تحميل شهادة ISO 9001",\n        "label_en": "Download ISO 9001 Certificate",\n        "url": ""\n      },\n      {\n        "label_ar": "تحميل شهادة ISO 22000",\n        "label_en": "Download ISO 22000 Certificate",\n        "url": ""\n      },\n      {\n        "label_ar": "تحميل شهادة Halal",\n        "label_en": "Download Halal Certificate",\n        "url": ""\n      }\n    ]\n  }\n}	2026-05-03 05:03:54.514	٣‏/٥‏/٢٠٢٦ ٨:٠٣:٥٣ ص
cmopb5pkv0003rtos7n9k6rwm	quality	{\n  "hero": {\n    "title_ar": "معايير الجودة",\n    "title_en": "Quality Standards",\n    "subtitle_ar": "نلتزم بأعلى معايير الجودة والسلامة الغذائية العالمية في كل مرحلة من مراحل الإنتاج",\n    "subtitle_en": "We adhere to the highest global quality and food safety standards at every stage of production"\n  },\n  "qcChecks": {\n    "title_ar": "نقاط رقابة الجودة",\n    "title_en": "Quality Control Checkpoints",\n    "subtitle_ar": "8 نقاط فحص صارمة في كل دورة إنتاج",\n    "subtitle_en": "8 strict inspection points in every production cycle",\n    "items": [\n      {\n        "text_ar": "فحص المواد الخام عند الاستلام",\n        "text_en": "Raw material inspection upon receipt",\n        "image": "/uploads/upload_1777784627223_3l7vxz.jfif"\n      },\n      {\n        "text_ar": "تحليل نسبة الحموضة والرطوبة",\n        "text_en": "Acidity and moisture analysis",\n        "image": "/uploads/upload_1777784779820_g94s0s.jfif"\n      },\n      {\n        "text_ar": "اختبار اللون والشفافية",\n        "text_en": "Color and transparency testing",\n        "image": "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?q=80&w=800&auto=format&fit=crop"\n      },\n      {\n        "text_ar": "تحليل نقطة الدخان ونقطة الذوبان",\n        "text_en": "Smoke point and melting point analysis",\n        "image": "https://images.unsplash.com/photo-1579154204601-39769d4b0f09?q=80&w=800&auto=format&fit=crop"\n      },\n      {\n        "text_ar": "فحص المعادن الثقيلة والملوثات",\n        "text_en": "Heavy metals and contaminants testing",\n        "image": "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop"\n      },\n      {\n        "text_ar": "اختبار الثبات الأكسيدي",\n        "text_en": "Oxidative stability testing",\n        "image": "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=800&auto=format&fit=crop"\n      },\n      {\n        "text_ar": "فحص التعبئة والتغليف",\n        "text_en": "Packaging and labeling inspection",\n        "image": "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?q=80&w=800&auto=format&fit=crop"\n      },\n      {\n        "text_ar": "تحليل العمر الافتراضي المتسارع",\n        "text_en": "Accelerated shelf life analysis",\n        "image": "https://images.unsplash.com/photo-1576086213369-8b806f7df282?q=80&w=800&auto=format&fit=crop"\n      }\n    ]\n  },\n  "lab": {\n    "title_ar": "معامل فحص الجودة",\n    "title_en": "Quality Control Laboratories",\n    "description_ar": "مختبرات مجهزة بأحدث أجهزة التحليل والفحص لضمان مطابقة منتجاتنا لأعلى المعايير الدولية",\n    "description_en": "Laboratories equipped with the latest analysis and testing equipment to ensure our products meet the highest international standards",\n    "images": [\n      {\n        "title_ar": "فريق الجودة",\n        "title_en": "Quality Team",\n        "url": ""\n      },\n      {\n        "title_ar": "فحص الجودة",\n        "title_en": "Quality Check",\n        "url": ""\n      },\n      {\n        "title_ar": "اختبار المعمل",\n        "title_en": "Lab Test",\n        "url": ""\n      }\n    ]\n  },\n  "downloads": {\n    "title_ar": "تحميل شهادات الجودة والمواصفات الفنية",\n    "title_en": "Download Quality Certificates & Technical Specifications",\n    "items": [\n      {\n        "label_ar": "تحميل شهادة ISO 9001",\n        "label_en": "Download ISO 9001 Certificate",\n        "url": ""\n      },\n      {\n        "label_ar": "تحميل شهادة ISO 22000",\n        "label_en": "Download ISO 22000 Certificate",\n        "url": ""\n      },\n      {\n        "label_ar": "تحميل شهادة Halal",\n        "label_en": "Download Halal Certificate",\n        "url": ""\n      }\n    ]\n  }\n}	2026-05-03 05:06:22.783	٣‏/٥‏/٢٠٢٦ ٨:٠٦:٢٢ ص
cmopbb8qw0005rtosvojamldp	quality	{\n  "hero": {\n    "title_ar": "معايير الجودة",\n    "title_en": "Quality Standards",\n    "subtitle_ar": "نلتزم بأعلى معايير الجودة والسلامة الغذائية العالمية في كل مرحلة من مراحل الإنتاج",\n    "subtitle_en": "We adhere to the highest global quality and food safety standards at every stage of production"\n  },\n  "qcChecks": {\n    "title_ar": "نقاط رقابة الجودة",\n    "title_en": "Quality Control Checkpoints",\n    "subtitle_ar": "8 نقاط فحص صارمة في كل دورة إنتاج",\n    "subtitle_en": "8 strict inspection points in every production cycle",\n    "items": [\n      {\n        "text_ar": "فحص المواد الخام عند الاستلام",\n        "text_en": "Raw material inspection upon receipt",\n        "image": "/uploads/upload_1777784627223_3l7vxz.jfif"\n      },\n      {\n        "text_ar": "تحليل نسبة الحموضة والرطوبة",\n        "text_en": "Acidity and moisture analysis",\n        "image": "/uploads/upload_1777784779820_g94s0s.jfif"\n      },\n      {\n        "text_ar": "اختبار اللون والشفافية",\n        "text_en": "Color and transparency testing",\n        "image": "/uploads/upload_1777785037555_ha975f.jfif"\n      },\n      {\n        "text_ar": "تحليل نقطة الدخان ونقطة الذوبان",\n        "text_en": "Smoke point and melting point analysis",\n        "image": "https://images.unsplash.com/photo-1579154204601-39769d4b0f09?q=80&w=800&auto=format&fit=crop"\n      },\n      {\n        "text_ar": "فحص المعادن الثقيلة والملوثات",\n        "text_en": "Heavy metals and contaminants testing",\n        "image": "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop"\n      },\n      {\n        "text_ar": "اختبار الثبات الأكسيدي",\n        "text_en": "Oxidative stability testing",\n        "image": "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=800&auto=format&fit=crop"\n      },\n      {\n        "text_ar": "فحص التعبئة والتغليف",\n        "text_en": "Packaging and labeling inspection",\n        "image": "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?q=80&w=800&auto=format&fit=crop"\n      },\n      {\n        "text_ar": "تحليل العمر الافتراضي المتسارع",\n        "text_en": "Accelerated shelf life analysis",\n        "image": "https://images.unsplash.com/photo-1576086213369-8b806f7df282?q=80&w=800&auto=format&fit=crop"\n      }\n    ]\n  },\n  "lab": {\n    "title_ar": "معامل فحص الجودة",\n    "title_en": "Quality Control Laboratories",\n    "description_ar": "مختبرات مجهزة بأحدث أجهزة التحليل والفحص لضمان مطابقة منتجاتنا لأعلى المعايير الدولية",\n    "description_en": "Laboratories equipped with the latest analysis and testing equipment to ensure our products meet the highest international standards",\n    "images": [\n      {\n        "title_ar": "فريق الجودة",\n        "title_en": "Quality Team",\n        "url": ""\n      },\n      {\n        "title_ar": "فحص الجودة",\n        "title_en": "Quality Check",\n        "url": ""\n      },\n      {\n        "title_ar": "اختبار المعمل",\n        "title_en": "Lab Test",\n        "url": ""\n      }\n    ]\n  },\n  "downloads": {\n    "title_ar": "تحميل شهادات الجودة والمواصفات الفنية",\n    "title_en": "Download Quality Certificates & Technical Specifications",\n    "items": [\n      {\n        "label_ar": "تحميل شهادة ISO 9001",\n        "label_en": "Download ISO 9001 Certificate",\n        "url": ""\n      },\n      {\n        "label_ar": "تحميل شهادة ISO 22000",\n        "label_en": "Download ISO 22000 Certificate",\n        "url": ""\n      },\n      {\n        "label_ar": "تحميل شهادة Halal",\n        "label_en": "Download Halal Certificate",\n        "url": ""\n      }\n    ]\n  }\n}	2026-05-03 05:10:40.905	٣‏/٥‏/٢٠٢٦ ٨:١٠:٤٠ ص
cmopbdexa0007rtosz9afy8pb	quality	{\n  "hero": {\n    "title_ar": "معايير الجودة",\n    "title_en": "Quality Standards",\n    "subtitle_ar": "نلتزم بأعلى معايير الجودة والسلامة الغذائية العالمية في كل مرحلة من مراحل الإنتاج",\n    "subtitle_en": "We adhere to the highest global quality and food safety standards at every stage of production"\n  },\n  "qcChecks": {\n    "title_ar": "نقاط رقابة الجودة",\n    "title_en": "Quality Control Checkpoints",\n    "subtitle_ar": "8 نقاط فحص صارمة في كل دورة إنتاج",\n    "subtitle_en": "8 strict inspection points in every production cycle",\n    "items": [\n      {\n        "text_ar": "فحص المواد الخام عند الاستلام",\n        "text_en": "Raw material inspection upon receipt",\n        "image": "/uploads/upload_1777784627223_3l7vxz.jfif"\n      },\n      {\n        "text_ar": "تحليل نسبة الحموضة والرطوبة",\n        "text_en": "Acidity and moisture analysis",\n        "image": "/uploads/upload_1777784779820_g94s0s.jfif"\n      },\n      {\n        "text_ar": "اختبار اللون والشفافية",\n        "text_en": "Color and transparency testing",\n        "image": "/uploads/upload_1777785037555_ha975f.jfif"\n      },\n      {\n        "text_ar": "تحليل نقطة الدخان ونقطة الذوبان",\n        "text_en": "Smoke point and melting point analysis",\n        "image": "/uploads/upload_1777785139397_rc5kbp.jfif"\n      },\n      {\n        "text_ar": "فحص المعادن الثقيلة والملوثات",\n        "text_en": "Heavy metals and contaminants testing",\n        "image": "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop"\n      },\n      {\n        "text_ar": "اختبار الثبات الأكسيدي",\n        "text_en": "Oxidative stability testing",\n        "image": "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=800&auto=format&fit=crop"\n      },\n      {\n        "text_ar": "فحص التعبئة والتغليف",\n        "text_en": "Packaging and labeling inspection",\n        "image": "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?q=80&w=800&auto=format&fit=crop"\n      },\n      {\n        "text_ar": "تحليل العمر الافتراضي المتسارع",\n        "text_en": "Accelerated shelf life analysis",\n        "image": "https://images.unsplash.com/photo-1576086213369-8b806f7df282?q=80&w=800&auto=format&fit=crop"\n      }\n    ]\n  },\n  "lab": {\n    "title_ar": "معامل فحص الجودة",\n    "title_en": "Quality Control Laboratories",\n    "description_ar": "مختبرات مجهزة بأحدث أجهزة التحليل والفحص لضمان مطابقة منتجاتنا لأعلى المعايير الدولية",\n    "description_en": "Laboratories equipped with the latest analysis and testing equipment to ensure our products meet the highest international standards",\n    "images": [\n      {\n        "title_ar": "فريق الجودة",\n        "title_en": "Quality Team",\n        "url": ""\n      },\n      {\n        "title_ar": "فحص الجودة",\n        "title_en": "Quality Check",\n        "url": ""\n      },\n      {\n        "title_ar": "اختبار المعمل",\n        "title_en": "Lab Test",\n        "url": ""\n      }\n    ]\n  },\n  "downloads": {\n    "title_ar": "تحميل شهادات الجودة والمواصفات الفنية",\n    "title_en": "Download Quality Certificates & Technical Specifications",\n    "items": [\n      {\n        "label_ar": "تحميل شهادة ISO 9001",\n        "label_en": "Download ISO 9001 Certificate",\n        "url": ""\n      },\n      {\n        "label_ar": "تحميل شهادة ISO 22000",\n        "label_en": "Download ISO 22000 Certificate",\n        "url": ""\n      },\n      {\n        "label_ar": "تحميل شهادة Halal",\n        "label_en": "Download Halal Certificate",\n        "url": ""\n      }\n    ]\n  }\n}	2026-05-03 05:12:22.223	٣‏/٥‏/٢٠٢٦ ٨:١٢:٢٢ ص
cmopbh1ks0009rtos2ek2bjlm	quality	{\n  "hero": {\n    "title_ar": "معايير الجودة",\n    "title_en": "Quality Standards",\n    "subtitle_ar": "نلتزم بأعلى معايير الجودة والسلامة الغذائية العالمية في كل مرحلة من مراحل الإنتاج",\n    "subtitle_en": "We adhere to the highest global quality and food safety standards at every stage of production"\n  },\n  "qcChecks": {\n    "title_ar": "نقاط رقابة الجودة",\n    "title_en": "Quality Control Checkpoints",\n    "subtitle_ar": "8 نقاط فحص صارمة في كل دورة إنتاج",\n    "subtitle_en": "8 strict inspection points in every production cycle",\n    "items": [\n      {\n        "text_ar": "فحص المواد الخام عند الاستلام",\n        "text_en": "Raw material inspection upon receipt",\n        "image": "/uploads/upload_1777784627223_3l7vxz.jfif"\n      },\n      {\n        "text_ar": "تحليل نسبة الحموضة والرطوبة",\n        "text_en": "Acidity and moisture analysis",\n        "image": "/uploads/upload_1777784779820_g94s0s.jfif"\n      },\n      {\n        "text_ar": "اختبار اللون والشفافية",\n        "text_en": "Color and transparency testing",\n        "image": "/uploads/upload_1777785037555_ha975f.jfif"\n      },\n      {\n        "text_ar": "تحليل نقطة الدخان ونقطة الذوبان",\n        "text_en": "Smoke point and melting point analysis",\n        "image": "/uploads/upload_1777785139397_rc5kbp.jfif"\n      },\n      {\n        "text_ar": "فحص المعادن الثقيلة والملوثات",\n        "text_en": "Heavy metals and contaminants testing",\n        "image": "/uploads/upload_1777785309219_nr5jtd.jfif"\n      },\n      {\n        "text_ar": "اختبار الثبات الأكسيدي",\n        "text_en": "Oxidative stability testing",\n        "image": "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=800&auto=format&fit=crop"\n      },\n      {\n        "text_ar": "فحص التعبئة والتغليف",\n        "text_en": "Packaging and labeling inspection",\n        "image": "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?q=80&w=800&auto=format&fit=crop"\n      },\n      {\n        "text_ar": "تحليل العمر الافتراضي المتسارع",\n        "text_en": "Accelerated shelf life analysis",\n        "image": "https://images.unsplash.com/photo-1576086213369-8b806f7df282?q=80&w=800&auto=format&fit=crop"\n      }\n    ]\n  },\n  "lab": {\n    "title_ar": "معامل فحص الجودة",\n    "title_en": "Quality Control Laboratories",\n    "description_ar": "مختبرات مجهزة بأحدث أجهزة التحليل والفحص لضمان مطابقة منتجاتنا لأعلى المعايير الدولية",\n    "description_en": "Laboratories equipped with the latest analysis and testing equipment to ensure our products meet the highest international standards",\n    "images": [\n      {\n        "title_ar": "فريق الجودة",\n        "title_en": "Quality Team",\n        "url": ""\n      },\n      {\n        "title_ar": "فحص الجودة",\n        "title_en": "Quality Check",\n        "url": ""\n      },\n      {\n        "title_ar": "اختبار المعمل",\n        "title_en": "Lab Test",\n        "url": ""\n      }\n    ]\n  },\n  "downloads": {\n    "title_ar": "تحميل شهادات الجودة والمواصفات الفنية",\n    "title_en": "Download Quality Certificates & Technical Specifications",\n    "items": [\n      {\n        "label_ar": "تحميل شهادة ISO 9001",\n        "label_en": "Download ISO 9001 Certificate",\n        "url": ""\n      },\n      {\n        "label_ar": "تحميل شهادة ISO 22000",\n        "label_en": "Download ISO 22000 Certificate",\n        "url": ""\n      },\n      {\n        "label_ar": "تحميل شهادة Halal",\n        "label_en": "Download Halal Certificate",\n        "url": ""\n      }\n    ]\n  }\n}	2026-05-03 05:15:11.548	٣‏/٥‏/٢٠٢٦ ٨:١٥:١١ ص
cmopbmyo6000brtosf183co00	quality	{\n  "hero": {\n    "title_ar": "معايير الجودة",\n    "title_en": "Quality Standards",\n    "subtitle_ar": "نلتزم بأعلى معايير الجودة والسلامة الغذائية العالمية في كل مرحلة من مراحل الإنتاج",\n    "subtitle_en": "We adhere to the highest global quality and food safety standards at every stage of production"\n  },\n  "qcChecks": {\n    "title_ar": "نقاط رقابة الجودة",\n    "title_en": "Quality Control Checkpoints",\n    "subtitle_ar": "8 نقاط فحص صارمة في كل دورة إنتاج",\n    "subtitle_en": "8 strict inspection points in every production cycle",\n    "items": [\n      {\n        "text_ar": "فحص المواد الخام عند الاستلام",\n        "text_en": "Raw material inspection upon receipt",\n        "image": "/uploads/upload_1777784627223_3l7vxz.jfif"\n      },\n      {\n        "text_ar": "تحليل نسبة الحموضة والرطوبة",\n        "text_en": "Acidity and moisture analysis",\n        "image": "/uploads/upload_1777784779820_g94s0s.jfif"\n      },\n      {\n        "text_ar": "اختبار اللون والشفافية",\n        "text_en": "Color and transparency testing",\n        "image": "/uploads/upload_1777785037555_ha975f.jfif"\n      },\n      {\n        "text_ar": "تحليل نقطة الدخان ونقطة الذوبان",\n        "text_en": "Smoke point and melting point analysis",\n        "image": "/uploads/upload_1777785139397_rc5kbp.jfif"\n      },\n      {\n        "text_ar": "فحص المعادن الثقيلة والملوثات",\n        "text_en": "Heavy metals and contaminants testing",\n        "image": "/uploads/upload_1777785309219_nr5jtd.jfif"\n      },\n      {\n        "text_ar": "اختبار الثبات الأكسيدي",\n        "text_en": "Oxidative stability testing",\n        "image": "/uploads/upload_1777785582741_26fzcd.jfif"\n      },\n      {\n        "text_ar": "فحص التعبئة والتغليف",\n        "text_en": "Packaging and labeling inspection",\n        "image": "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?q=80&w=800&auto=format&fit=crop"\n      },\n      {\n        "text_ar": "تحليل العمر الافتراضي المتسارع",\n        "text_en": "Accelerated shelf life analysis",\n        "image": "https://images.unsplash.com/photo-1576086213369-8b806f7df282?q=80&w=800&auto=format&fit=crop"\n      }\n    ]\n  },\n  "lab": {\n    "title_ar": "معامل فحص الجودة",\n    "title_en": "Quality Control Laboratories",\n    "description_ar": "مختبرات مجهزة بأحدث أجهزة التحليل والفحص لضمان مطابقة منتجاتنا لأعلى المعايير الدولية",\n    "description_en": "Laboratories equipped with the latest analysis and testing equipment to ensure our products meet the highest international standards",\n    "images": [\n      {\n        "title_ar": "فريق الجودة",\n        "title_en": "Quality Team",\n        "url": ""\n      },\n      {\n        "title_ar": "فحص الجودة",\n        "title_en": "Quality Check",\n        "url": ""\n      },\n      {\n        "title_ar": "اختبار المعمل",\n        "title_en": "Lab Test",\n        "url": ""\n      }\n    ]\n  },\n  "downloads": {\n    "title_ar": "تحميل شهادات الجودة والمواصفات الفنية",\n    "title_en": "Download Quality Certificates & Technical Specifications",\n    "items": [\n      {\n        "label_ar": "تحميل شهادة ISO 9001",\n        "label_en": "Download ISO 9001 Certificate",\n        "url": ""\n      },\n      {\n        "label_ar": "تحميل شهادة ISO 22000",\n        "label_en": "Download ISO 22000 Certificate",\n        "url": ""\n      },\n      {\n        "label_ar": "تحميل شهادة Halal",\n        "label_en": "Download Halal Certificate",\n        "url": ""\n      }\n    ]\n  }\n}	2026-05-03 05:19:47.718	٣‏/٥‏/٢٠٢٦ ٨:١٩:٤٧ ص
cmopbt5ls000drtosukvuppkp	quality	{\n  "hero": {\n    "title_ar": "معايير الجودة",\n    "title_en": "Quality Standards",\n    "subtitle_ar": "نلتزم بأعلى معايير الجودة والسلامة الغذائية العالمية في كل مرحلة من مراحل الإنتاج",\n    "subtitle_en": "We adhere to the highest global quality and food safety standards at every stage of production"\n  },\n  "qcChecks": {\n    "title_ar": "نقاط رقابة الجودة",\n    "title_en": "Quality Control Checkpoints",\n    "subtitle_ar": "8 نقاط فحص صارمة في كل دورة إنتاج",\n    "subtitle_en": "8 strict inspection points in every production cycle",\n    "items": [\n      {\n        "text_ar": "فحص المواد الخام عند الاستلام",\n        "text_en": "Raw material inspection upon receipt",\n        "image": "/uploads/upload_1777784627223_3l7vxz.jfif"\n      },\n      {\n        "text_ar": "تحليل نسبة الحموضة والرطوبة",\n        "text_en": "Acidity and moisture analysis",\n        "image": "/uploads/upload_1777784779820_g94s0s.jfif"\n      },\n      {\n        "text_ar": "اختبار اللون والشفافية",\n        "text_en": "Color and transparency testing",\n        "image": "/uploads/upload_1777785037555_ha975f.jfif"\n      },\n      {\n        "text_ar": "تحليل نقطة الدخان ونقطة الذوبان",\n        "text_en": "Smoke point and melting point analysis",\n        "image": "/uploads/upload_1777785139397_rc5kbp.jfif"\n      },\n      {\n        "text_ar": "فحص المعادن الثقيلة والملوثات",\n        "text_en": "Heavy metals and contaminants testing",\n        "image": "/uploads/upload_1777785309219_nr5jtd.jfif"\n      },\n      {\n        "text_ar": "اختبار الثبات الأكسيدي",\n        "text_en": "Oxidative stability testing",\n        "image": "/uploads/upload_1777785582741_26fzcd.jfif"\n      },\n      {\n        "text_ar": "فحص التعبئة والتغليف",\n        "text_en": "Packaging and labeling inspection",\n        "image": "/uploads/upload_1777785873750_m96wrq.jfif"\n      },\n      {\n        "text_ar": "تحليل العمر الافتراضي المتسارع",\n        "text_en": "Accelerated shelf life analysis",\n        "image": "https://images.unsplash.com/photo-1576086213369-8b806f7df282?q=80&w=800&auto=format&fit=crop"\n      }\n    ]\n  },\n  "lab": {\n    "title_ar": "معامل فحص الجودة",\n    "title_en": "Quality Control Laboratories",\n    "description_ar": "مختبرات مجهزة بأحدث أجهزة التحليل والفحص لضمان مطابقة منتجاتنا لأعلى المعايير الدولية",\n    "description_en": "Laboratories equipped with the latest analysis and testing equipment to ensure our products meet the highest international standards",\n    "images": [\n      {\n        "title_ar": "فريق الجودة",\n        "title_en": "Quality Team",\n        "url": ""\n      },\n      {\n        "title_ar": "فحص الجودة",\n        "title_en": "Quality Check",\n        "url": ""\n      },\n      {\n        "title_ar": "اختبار المعمل",\n        "title_en": "Lab Test",\n        "url": ""\n      }\n    ]\n  },\n  "downloads": {\n    "title_ar": "تحميل شهادات الجودة والمواصفات الفنية",\n    "title_en": "Download Quality Certificates & Technical Specifications",\n    "items": [\n      {\n        "label_ar": "تحميل شهادة ISO 9001",\n        "label_en": "Download ISO 9001 Certificate",\n        "url": ""\n      },\n      {\n        "label_ar": "تحميل شهادة ISO 22000",\n        "label_en": "Download ISO 22000 Certificate",\n        "url": ""\n      },\n      {\n        "label_ar": "تحميل شهادة Halal",\n        "label_en": "Download Halal Certificate",\n        "url": ""\n      }\n    ]\n  }\n}	2026-05-03 05:24:36.64	٣‏/٥‏/٢٠٢٦ ٨:٢٤:٣٦ ص
cmopbvvu9000frtosmu3je4y6	quality	{\n  "hero": {\n    "title_ar": "معايير الجودة",\n    "title_en": "Quality Standards",\n    "subtitle_ar": "نلتزم بأعلى معايير الجودة والسلامة الغذائية العالمية في كل مرحلة من مراحل الإنتاج",\n    "subtitle_en": "We adhere to the highest global quality and food safety standards at every stage of production"\n  },\n  "qcChecks": {\n    "title_ar": "نقاط رقابة الجودة",\n    "title_en": "Quality Control Checkpoints",\n    "subtitle_ar": "8 نقاط فحص صارمة في كل دورة إنتاج",\n    "subtitle_en": "8 strict inspection points in every production cycle",\n    "items": [\n      {\n        "text_ar": "فحص المواد الخام عند الاستلام",\n        "text_en": "Raw material inspection upon receipt",\n        "image": "/uploads/upload_1777784627223_3l7vxz.jfif"\n      },\n      {\n        "text_ar": "تحليل نسبة الحموضة والرطوبة",\n        "text_en": "Acidity and moisture analysis",\n        "image": "/uploads/upload_1777784779820_g94s0s.jfif"\n      },\n      {\n        "text_ar": "اختبار اللون والشفافية",\n        "text_en": "Color and transparency testing",\n        "image": "/uploads/upload_1777785037555_ha975f.jfif"\n      },\n      {\n        "text_ar": "تحليل نقطة الدخان ونقطة الذوبان",\n        "text_en": "Smoke point and melting point analysis",\n        "image": "/uploads/upload_1777785139397_rc5kbp.jfif"\n      },\n      {\n        "text_ar": "فحص المعادن الثقيلة والملوثات",\n        "text_en": "Heavy metals and contaminants testing",\n        "image": "/uploads/upload_1777785309219_nr5jtd.jfif"\n      },\n      {\n        "text_ar": "اختبار الثبات الأكسيدي",\n        "text_en": "Oxidative stability testing",\n        "image": "/uploads/upload_1777785582741_26fzcd.jfif"\n      },\n      {\n        "text_ar": "فحص التعبئة والتغليف",\n        "text_en": "Packaging and labeling inspection",\n        "image": "/uploads/upload_1777785873750_m96wrq.jfif"\n      },\n      {\n        "text_ar": "تحليل العمر الافتراضي المتسارع",\n        "text_en": "Accelerated shelf life analysis",\n        "image": "/uploads/upload_1777785999364_jko31z.jfif"\n      }\n    ]\n  },\n  "lab": {\n    "title_ar": "معامل فحص الجودة",\n    "title_en": "Quality Control Laboratories",\n    "description_ar": "مختبرات مجهزة بأحدث أجهزة التحليل والفحص لضمان مطابقة منتجاتنا لأعلى المعايير الدولية",\n    "description_en": "Laboratories equipped with the latest analysis and testing equipment to ensure our products meet the highest international standards",\n    "images": [\n      {\n        "title_ar": "فريق الجودة",\n        "title_en": "Quality Team",\n        "url": ""\n      },\n      {\n        "title_ar": "فحص الجودة",\n        "title_en": "Quality Check",\n        "url": ""\n      },\n      {\n        "title_ar": "اختبار المعمل",\n        "title_en": "Lab Test",\n        "url": ""\n      }\n    ]\n  },\n  "downloads": {\n    "title_ar": "تحميل شهادات الجودة والمواصفات الفنية",\n    "title_en": "Download Quality Certificates & Technical Specifications",\n    "items": [\n      {\n        "label_ar": "تحميل شهادة ISO 9001",\n        "label_en": "Download ISO 9001 Certificate",\n        "url": ""\n      },\n      {\n        "label_ar": "تحميل شهادة ISO 22000",\n        "label_en": "Download ISO 22000 Certificate",\n        "url": ""\n      },\n      {\n        "label_ar": "تحميل شهادة Halal",\n        "label_en": "Download Halal Certificate",\n        "url": ""\n      }\n    ]\n  }\n}	2026-05-03 05:26:43.954	٣‏/٥‏/٢٠٢٦ ٨:٢٦:٤٣ ص
cmopcb67l000hrtos4h4oki34	quality	{\n  "hero": {\n    "title_ar": "معايير الجودة",\n    "title_en": "Quality Standards",\n    "subtitle_ar": "نلتزم بأعلى معايير الجودة والسلامة الغذائية العالمية في كل مرحلة من مراحل الإنتاج",\n    "subtitle_en": "We adhere to the highest global quality and food safety standards at every stage of production",\n    "image": "/uploads/upload_1777786711159_cq1rea.jfif"\n  },\n  "qcChecks": {\n    "title_ar": "نقاط رقابة الجودة",\n    "title_en": "Quality Control Checkpoints",\n    "subtitle_ar": "8 نقاط فحص صارمة في كل دورة إنتاج",\n    "subtitle_en": "8 strict inspection points in every production cycle",\n    "items": [\n      {\n        "text_ar": "فحص المواد الخام عند الاستلام",\n        "text_en": "Raw material inspection upon receipt",\n        "image": "/uploads/upload_1777784627223_3l7vxz.jfif"\n      },\n      {\n        "text_ar": "تحليل نسبة الحموضة والرطوبة",\n        "text_en": "Acidity and moisture analysis",\n        "image": "/uploads/upload_1777784779820_g94s0s.jfif"\n      },\n      {\n        "text_ar": "اختبار اللون والشفافية",\n        "text_en": "Color and transparency testing",\n        "image": "/uploads/upload_1777785037555_ha975f.jfif"\n      },\n      {\n        "text_ar": "تحليل نقطة الدخان ونقطة الذوبان",\n        "text_en": "Smoke point and melting point analysis",\n        "image": "/uploads/upload_1777785139397_rc5kbp.jfif"\n      },\n      {\n        "text_ar": "فحص المعادن الثقيلة والملوثات",\n        "text_en": "Heavy metals and contaminants testing",\n        "image": "/uploads/upload_1777785309219_nr5jtd.jfif"\n      },\n      {\n        "text_ar": "اختبار الثبات الأكسيدي",\n        "text_en": "Oxidative stability testing",\n        "image": "/uploads/upload_1777785582741_26fzcd.jfif"\n      },\n      {\n        "text_ar": "فحص التعبئة والتغليف",\n        "text_en": "Packaging and labeling inspection",\n        "image": "/uploads/upload_1777785873750_m96wrq.jfif"\n      },\n      {\n        "text_ar": "تحليل العمر الافتراضي المتسارع",\n        "text_en": "Accelerated shelf life analysis",\n        "image": "/uploads/upload_1777785999364_jko31z.jfif"\n      }\n    ]\n  },\n  "lab": {\n    "title_ar": "معامل فحص الجودة",\n    "title_en": "Quality Control Laboratories",\n    "description_ar": "مختبرات مجهزة بأحدث أجهزة التحليل والفحص لضمان مطابقة منتجاتنا لأعلى المعايير الدولية",\n    "description_en": "Laboratories equipped with the latest analysis and testing equipment to ensure our products meet the highest international standards",\n    "images": [\n      {\n        "title_ar": "فريق الجودة",\n        "title_en": "Quality Team",\n        "url": ""\n      },\n      {\n        "title_ar": "فحص الجودة",\n        "title_en": "Quality Check",\n        "url": ""\n      },\n      {\n        "title_ar": "اختبار المعمل",\n        "title_en": "Lab Test",\n        "url": ""\n      }\n    ]\n  },\n  "downloads": {\n    "title_ar": "تحميل شهادات الجودة والمواصفات الفنية",\n    "title_en": "Download Quality Certificates & Technical Specifications",\n    "items": [\n      {\n        "label_ar": "تحميل شهادة ISO 9001",\n        "label_en": "Download ISO 9001 Certificate",\n        "url": ""\n      },\n      {\n        "label_ar": "تحميل شهادة ISO 22000",\n        "label_en": "Download ISO 22000 Certificate",\n        "url": ""\n      },\n      {\n        "label_ar": "تحميل شهادة Halal",\n        "label_en": "Download Halal Certificate",\n        "url": ""\n      }\n    ]\n  }\n}	2026-05-03 05:38:37.234	٣‏/٥‏/٢٠٢٦ ٨:٣٨:٣٥ ص
cmopci2s5000jrtos15v92oj6	quality	{\n  "hero": {\n    "title_ar": "معايير الجودة",\n    "title_en": "Quality Standards",\n    "subtitle_ar": "نلتزم بأعلى معايير الجودة والسلامة الغذائية العالمية في كل مرحلة من مراحل الإنتاج",\n    "subtitle_en": "We adhere to the highest global quality and food safety standards at every stage of production",\n    "image": "/uploads/upload_1777786711159_cq1rea.jfif"\n  },\n  "qcChecks": {\n    "title_ar": "نقاط رقابة الجودة",\n    "title_en": "Quality Control Checkpoints",\n    "subtitle_ar": "8 نقاط فحص صارمة في كل دورة إنتاج",\n    "subtitle_en": "8 strict inspection points in every production cycle",\n    "items": [\n      {\n        "text_ar": "فحص المواد الخام عند الاستلام",\n        "text_en": "Raw material inspection upon receipt",\n        "image": "/uploads/upload_1777784627223_3l7vxz.jfif"\n      },\n      {\n        "text_ar": "تحليل نسبة الحموضة والرطوبة",\n        "text_en": "Acidity and moisture analysis",\n        "image": "/uploads/upload_1777784779820_g94s0s.jfif"\n      },\n      {\n        "text_ar": "اختبار اللون والشفافية",\n        "text_en": "Color and transparency testing",\n        "image": "/uploads/upload_1777785037555_ha975f.jfif"\n      },\n      {\n        "text_ar": "تحليل نقطة الدخان ونقطة الذوبان",\n        "text_en": "Smoke point and melting point analysis",\n        "image": "/uploads/upload_1777785139397_rc5kbp.jfif"\n      },\n      {\n        "text_ar": "فحص المعادن الثقيلة والملوثات",\n        "text_en": "Heavy metals and contaminants testing",\n        "image": "/uploads/upload_1777785309219_nr5jtd.jfif"\n      },\n      {\n        "text_ar": "اختبار الثبات الأكسيدي",\n        "text_en": "Oxidative stability testing",\n        "image": "/uploads/upload_1777785582741_26fzcd.jfif"\n      },\n      {\n        "text_ar": "فحص التعبئة والتغليف",\n        "text_en": "Packaging and labeling inspection",\n        "image": "/uploads/upload_1777785873750_m96wrq.jfif"\n      },\n      {\n        "text_ar": "تحليل العمر الافتراضي المتسارع",\n        "text_en": "Accelerated shelf life analysis",\n        "image": "/uploads/upload_1777785999364_jko31z.jfif"\n      }\n    ]\n  },\n  "lab": {\n    "title_ar": "معامل فحص الجودة",\n    "title_en": "Quality Control Laboratories",\n    "description_ar": "مختبرات مجهزة بأحدث أجهزة التحليل والفحص لضمان مطابقة منتجاتنا لأعلى المعايير الدولية",\n    "description_en": "Laboratories equipped with the latest analysis and testing equipment to ensure our products meet the highest international standards",\n    "images": [\n      {\n        "title_ar": "فريق الجودة",\n        "title_en": "Quality Team",\n        "url": "/uploads/upload_1777786877298_6npbxa.jfif"\n      },\n      {\n        "title_ar": "فحص الجودة",\n        "title_en": "Quality Check",\n        "url": "/uploads/upload_1777786959393_rhvk3d.jfif"\n      },\n      {\n        "title_ar": "اختبار المعمل",\n        "title_en": "Lab Test",\n        "url": "/uploads/upload_1777787032721_kb3fcy.jfif"\n      }\n    ]\n  },\n  "downloads": {\n    "title_ar": "تحميل شهادات الجودة والمواصفات الفنية",\n    "title_en": "Download Quality Certificates & Technical Specifications",\n    "items": [\n      {\n        "label_ar": "تحميل شهادة ISO 9001",\n        "label_en": "Download ISO 9001 Certificate",\n        "url": ""\n      },\n      {\n        "label_ar": "تحميل شهادة ISO 22000",\n        "label_en": "Download ISO 22000 Certificate",\n        "url": ""\n      },\n      {\n        "label_ar": "تحميل شهادة Halal",\n        "label_en": "Download Halal Certificate",\n        "url": ""\n      }\n    ]\n  }\n}	2026-05-03 05:43:59.382	٣‏/٥‏/٢٠٢٦ ٨:٤٣:٥٩ ص
cmopfa32v000lrtosfv9g3r4c	production	{\n  "hero": {\n    "title_ar": "مراحل الإنتاج",\n    "title_en": "Production Stages",\n    "subtitle_ar": "نتبع أحدث التقنيات العالمية في تصنيع الزيوت النباتية والسمن والشورتنينج عبر 8 خطوط إنتاج متطورة",\n    "subtitle_en": "We follow the latest global technologies in manufacturing vegetable oils, margarine & shortening across 8 advanced production lines",\n    "backgroundImage": "/uploads/upload_1777791699375_pdj53m.jfif"\n  },\n  "steps": {\n    "title_ar": "خطوات عملية الإنتاج",\n    "title_en": "Production Process Steps",\n    "subtitle_ar": "من استلام المواد الخام حتى التعبئة والتغليف",\n    "subtitle_en": "From raw material receipt to packaging and labeling",\n    "items": [\n      {\n        "title_ar": "استلام وفحص المواد الخام",\n        "title_en": "Raw Material Receipt & Inspection",\n        "description_ar": "نستقبل أجود أنواع الزيوت الخام من مصادر معتمدة عالمياً ونجري فحوصات شاملة للتأكد من جودتها ومطابقتها للمواصفات",\n        "description_en": "We receive the finest crude oils from globally certified sources and conduct comprehensive inspections to ensure quality and specification compliance",\n        "icon": "PackageCheck"\n      },\n      {\n        "title_ar": "التكرير والتنقية",\n        "title_en": "Refining & Purification",\n        "description_ar": "تمر الزيوت الخام بعمليات تكرير متعددة تشمل إزالة الصمغ، والتبييض، وإزالة الروائح للحصول على زيت نقي عالي الجودة",\n        "description_en": "Crude oils undergo multiple refining processes including degumming, bleaching, and deodorizing to produce high-quality pure oil",\n        "icon": "Filter"\n      },\n      {\n        "title_ar": "الهدرجة والتحويل",\n        "title_en": "Hydrogenation & Processing",\n        "description_ar": "يتم تحويل الزيوت السائلة إلى سمن وشورتنينج من خلال عمليات هدرجة محكمة تحت إشراف فني متخصص",\n        "description_en": "Liquid oils are converted into margarine and shortening through precise hydrogenation processes under specialized technical supervision",\n        "icon": "FlaskConical"\n      },\n      {\n        "title_ar": "مراقبة الجودة المخبرية",\n        "title_en": "Laboratory Quality Control",\n        "description_ar": "يتم إجراء تحاليل مخبرية دقيقة في كل مرحلة لضمان مطابقة المنتج للمواصفات القياسية المحلية والدولية",\n        "description_en": "Precise laboratory analyses are conducted at every stage to ensure product compliance with local and international standards",\n        "icon": "Microscope"\n      },\n      {\n        "title_ar": "التعبئة والتغليف",\n        "title_en": "Filling & Packaging",\n        "description_ar": "تعبئة آلية بالكامل في عبوات متنوعة الأحجام مع طباعة بيانات المنتج وتاريخ الإنتاج والصلاحية بأعلى معايير النظافة",\n        "description_en": "Fully automated filling in various container sizes with product data, production date, and expiry date printing under the highest hygiene standards",\n        "icon": "Package"\n      },\n      {\n        "title_ar": "التخزين والتوزيع",\n        "title_en": "Storage & Distribution",\n        "description_ar": "مستودعات مجهزة بأنظمة تحكم في درجة الحرارة وأسطول نقل متكامل لضمان وصول المنتجات بأفضل حالة",\n        "description_en": "Temperature-controlled warehouses and a comprehensive transport fleet to ensure products arrive in optimal condition",\n        "icon": "Truck"\n      }\n    ]\n  },\n  "capacity": {\n    "title_ar": "الطاقة الإنتاجية",\n    "title_en": "Production Capacity",\n    "subtitle_ar": "أرقام تعكس حجم وقدرات مصنع السلام",\n    "subtitle_en": "Numbers reflecting the scale and capabilities of Elsalam Factory",\n    "items": [\n      {\n        "label_ar": "خطوط إنتاج",\n        "label_en": "Production Lines",\n        "value": "8"\n      },\n      {\n        "label_ar": "طن يومياً",\n        "label_en": "Tons Daily",\n        "value": "500"\n      },\n      {\n        "label_ar": "دولة تصدير",\n        "label_en": "Export Countries",\n        "value": "15+"\n      },\n      {\n        "label_ar": "منتج متنوع",\n        "label_en": "Diverse Products",\n        "value": "50+"\n      }\n    ]\n  },\n  "gallery": {\n    "title_ar": "جولة في خطوط الإنتاج",\n    "title_en": "Production Lines Tour",\n    "items": [\n      {\n        "title_ar": "خط إنتاج الزيوت",\n        "title_en": "Oil Production Line",\n        "url": ""\n      },\n      {\n        "title_ar": "خط التكرير",\n        "title_en": "Refining Line",\n        "url": ""\n      },\n      {\n        "title_ar": "خط التعبئة",\n        "title_en": "Filling Line",\n        "url": ""\n      },\n      {\n        "title_ar": "مستودعات التخزين",\n        "title_en": "Storage Warehouses",\n        "url": ""\n      }\n    ]\n  }\n}	2026-05-03 07:01:45.368	٣‏/٥‏/٢٠٢٦ ١٠:٠١:٤٣ ص
cmopfe6oa000nrtosckyh91ll	production	{\n  "hero": {\n    "title_ar": "مراحل الإنتاج",\n    "title_en": "Production Stages",\n    "subtitle_ar": "نتبع أحدث التقنيات العالمية في تصنيع الزيوت النباتية والسمن والشورتنينج عبر 8 خطوط إنتاج متطورة",\n    "subtitle_en": "We follow the latest global technologies in manufacturing vegetable oils, margarine & shortening across 8 advanced production lines",\n    "backgroundImage": "/uploads/upload_1777791699375_pdj53m.jfif"\n  },\n  "steps": {\n    "title_ar": "خطوات عملية الإنتاج",\n    "title_en": "Production Process Steps",\n    "subtitle_ar": "من استلام المواد الخام حتى التعبئة والتغليف",\n    "subtitle_en": "From raw material receipt to packaging and labeling",\n    "items": [\n      {\n        "title_ar": "استلام وفحص المواد الخام",\n        "title_en": "Raw Material Receipt & Inspection",\n        "description_ar": "نستقبل أجود أنواع الزيوت الخام من مصادر معتمدة عالمياً ونجري فحوصات شاملة للتأكد من جودتها ومطابقتها للمواصفات",\n        "description_en": "We receive the finest crude oils from globally certified sources and conduct comprehensive inspections to ensure quality and specification compliance",\n        "icon": "PackageCheck",\n        "image": "/uploads/upload_1777791867288_pyu8ag.jfif"\n      },\n      {\n        "title_ar": "التكرير والتنقية",\n        "title_en": "Refining & Purification",\n        "description_ar": "تمر الزيوت الخام بعمليات تكرير متعددة تشمل إزالة الصمغ، والتبييض، وإزالة الروائح للحصول على زيت نقي عالي الجودة",\n        "description_en": "Crude oils undergo multiple refining processes including degumming, bleaching, and deodorizing to produce high-quality pure oil",\n        "icon": "Filter"\n      },\n      {\n        "title_ar": "الهدرجة والتحويل",\n        "title_en": "Hydrogenation & Processing",\n        "description_ar": "يتم تحويل الزيوت السائلة إلى سمن وشورتنينج من خلال عمليات هدرجة محكمة تحت إشراف فني متخصص",\n        "description_en": "Liquid oils are converted into margarine and shortening through precise hydrogenation processes under specialized technical supervision",\n        "icon": "FlaskConical"\n      },\n      {\n        "title_ar": "مراقبة الجودة المخبرية",\n        "title_en": "Laboratory Quality Control",\n        "description_ar": "يتم إجراء تحاليل مخبرية دقيقة في كل مرحلة لضمان مطابقة المنتج للمواصفات القياسية المحلية والدولية",\n        "description_en": "Precise laboratory analyses are conducted at every stage to ensure product compliance with local and international standards",\n        "icon": "Microscope"\n      },\n      {\n        "title_ar": "التعبئة والتغليف",\n        "title_en": "Filling & Packaging",\n        "description_ar": "تعبئة آلية بالكامل في عبوات متنوعة الأحجام مع طباعة بيانات المنتج وتاريخ الإنتاج والصلاحية بأعلى معايير النظافة",\n        "description_en": "Fully automated filling in various container sizes with product data, production date, and expiry date printing under the highest hygiene standards",\n        "icon": "Package"\n      },\n      {\n        "title_ar": "التخزين والتوزيع",\n        "title_en": "Storage & Distribution",\n        "description_ar": "مستودعات مجهزة بأنظمة تحكم في درجة الحرارة وأسطول نقل متكامل لضمان وصول المنتجات بأفضل حالة",\n        "description_en": "Temperature-controlled warehouses and a comprehensive transport fleet to ensure products arrive in optimal condition",\n        "icon": "Truck"\n      }\n    ]\n  },\n  "capacity": {\n    "title_ar": "الطاقة الإنتاجية",\n    "title_en": "Production Capacity",\n    "subtitle_ar": "أرقام تعكس حجم وقدرات مصنع السلام",\n    "subtitle_en": "Numbers reflecting the scale and capabilities of Elsalam Factory",\n    "items": [\n      {\n        "label_ar": "خطوط إنتاج",\n        "label_en": "Production Lines",\n        "value": "8"\n      },\n      {\n        "label_ar": "طن يومياً",\n        "label_en": "Tons Daily",\n        "value": "500"\n      },\n      {\n        "label_ar": "دولة تصدير",\n        "label_en": "Export Countries",\n        "value": "15+"\n      },\n      {\n        "label_ar": "منتج متنوع",\n        "label_en": "Diverse Products",\n        "value": "50+"\n      }\n    ]\n  },\n  "gallery": {\n    "title_ar": "جولة في خطوط الإنتاج",\n    "title_en": "Production Lines Tour",\n    "items": [\n      {\n        "title_ar": "خط إنتاج الزيوت",\n        "title_en": "Oil Production Line",\n        "url": ""\n      },\n      {\n        "title_ar": "خط التكرير",\n        "title_en": "Refining Line",\n        "url": ""\n      },\n      {\n        "title_ar": "خط التعبئة",\n        "title_en": "Filling Line",\n        "url": ""\n      },\n      {\n        "title_ar": "مستودعات التخزين",\n        "title_en": "Storage Warehouses",\n        "url": ""\n      }\n    ]\n  }\n}	2026-05-03 07:04:56.65	٣‏/٥‏/٢٠٢٦ ١٠:٠٤:٥٦ ص
cmopfidkp000prtosl0ff5i9t	production	{\n  "hero": {\n    "title_ar": "مراحل الإنتاج",\n    "title_en": "Production Stages",\n    "subtitle_ar": "نتبع أحدث التقنيات العالمية في تصنيع الزيوت النباتية والسمن والشورتنينج عبر 8 خطوط إنتاج متطورة",\n    "subtitle_en": "We follow the latest global technologies in manufacturing vegetable oils, margarine & shortening across 8 advanced production lines",\n    "backgroundImage": "/uploads/upload_1777791699375_pdj53m.jfif"\n  },\n  "steps": {\n    "title_ar": "خطوات عملية الإنتاج",\n    "title_en": "Production Process Steps",\n    "subtitle_ar": "من استلام المواد الخام حتى التعبئة والتغليف",\n    "subtitle_en": "From raw material receipt to packaging and labeling",\n    "items": [\n      {\n        "title_ar": "استلام وفحص المواد الخام",\n        "title_en": "Raw Material Receipt & Inspection",\n        "description_ar": "نستقبل أجود أنواع الزيوت الخام من مصادر معتمدة عالمياً ونجري فحوصات شاملة للتأكد من جودتها ومطابقتها للمواصفات",\n        "description_en": "We receive the finest crude oils from globally certified sources and conduct comprehensive inspections to ensure quality and specification compliance",\n        "icon": "PackageCheck",\n        "image": "/uploads/upload_1777791867288_pyu8ag.jfif"\n      },\n      {\n        "title_ar": "التكرير والتنقية",\n        "title_en": "Refining & Purification",\n        "description_ar": "تمر الزيوت الخام بعمليات تكرير متعددة تشمل إزالة الصمغ، والتبييض، وإزالة الروائح للحصول على زيت نقي عالي الجودة",\n        "description_en": "Crude oils undergo multiple refining processes including degumming, bleaching, and deodorizing to produce high-quality pure oil",\n        "icon": "Filter",\n        "image": "/uploads/upload_1777792085916_gdu075.jfif"\n      },\n      {\n        "title_ar": "الهدرجة والتحويل",\n        "title_en": "Hydrogenation & Processing",\n        "description_ar": "يتم تحويل الزيوت السائلة إلى سمن وشورتنينج من خلال عمليات هدرجة محكمة تحت إشراف فني متخصص",\n        "description_en": "Liquid oils are converted into margarine and shortening through precise hydrogenation processes under specialized technical supervision",\n        "icon": "FlaskConical"\n      },\n      {\n        "title_ar": "مراقبة الجودة المخبرية",\n        "title_en": "Laboratory Quality Control",\n        "description_ar": "يتم إجراء تحاليل مخبرية دقيقة في كل مرحلة لضمان مطابقة المنتج للمواصفات القياسية المحلية والدولية",\n        "description_en": "Precise laboratory analyses are conducted at every stage to ensure product compliance with local and international standards",\n        "icon": "Microscope"\n      },\n      {\n        "title_ar": "التعبئة والتغليف",\n        "title_en": "Filling & Packaging",\n        "description_ar": "تعبئة آلية بالكامل في عبوات متنوعة الأحجام مع طباعة بيانات المنتج وتاريخ الإنتاج والصلاحية بأعلى معايير النظافة",\n        "description_en": "Fully automated filling in various container sizes with product data, production date, and expiry date printing under the highest hygiene standards",\n        "icon": "Package"\n      },\n      {\n        "title_ar": "التخزين والتوزيع",\n        "title_en": "Storage & Distribution",\n        "description_ar": "مستودعات مجهزة بأنظمة تحكم في درجة الحرارة وأسطول نقل متكامل لضمان وصول المنتجات بأفضل حالة",\n        "description_en": "Temperature-controlled warehouses and a comprehensive transport fleet to ensure products arrive in optimal condition",\n        "icon": "Truck"\n      }\n    ]\n  },\n  "capacity": {\n    "title_ar": "الطاقة الإنتاجية",\n    "title_en": "Production Capacity",\n    "subtitle_ar": "أرقام تعكس حجم وقدرات مصنع السلام",\n    "subtitle_en": "Numbers reflecting the scale and capabilities of Elsalam Factory",\n    "items": [\n      {\n        "label_ar": "خطوط إنتاج",\n        "label_en": "Production Lines",\n        "value": "8"\n      },\n      {\n        "label_ar": "طن يومياً",\n        "label_en": "Tons Daily",\n        "value": "500"\n      },\n      {\n        "label_ar": "دولة تصدير",\n        "label_en": "Export Countries",\n        "value": "15+"\n      },\n      {\n        "label_ar": "منتج متنوع",\n        "label_en": "Diverse Products",\n        "value": "50+"\n      }\n    ]\n  },\n  "gallery": {\n    "title_ar": "جولة في خطوط الإنتاج",\n    "title_en": "Production Lines Tour",\n    "items": [\n      {\n        "title_ar": "خط إنتاج الزيوت",\n        "title_en": "Oil Production Line",\n        "url": ""\n      },\n      {\n        "title_ar": "خط التكرير",\n        "title_en": "Refining Line",\n        "url": ""\n      },\n      {\n        "title_ar": "خط التعبئة",\n        "title_en": "Filling Line",\n        "url": ""\n      },\n      {\n        "title_ar": "مستودعات التخزين",\n        "title_en": "Storage Warehouses",\n        "url": ""\n      }\n    ]\n  }\n}	2026-05-03 07:08:12.217	٣‏/٥‏/٢٠٢٦ ١٠:٠٨:١٢ ص
cmopfpc78000rrtosn7a5lesl	production	{\n  "hero": {\n    "title_ar": "مراحل الإنتاج",\n    "title_en": "Production Stages",\n    "subtitle_ar": "نتبع أحدث التقنيات العالمية في تصنيع الزيوت النباتية والسمن والشورتنينج عبر 8 خطوط إنتاج متطورة",\n    "subtitle_en": "We follow the latest global technologies in manufacturing vegetable oils, margarine & shortening across 8 advanced production lines",\n    "backgroundImage": "/uploads/upload_1777791699375_pdj53m.jfif"\n  },\n  "steps": {\n    "title_ar": "خطوات عملية الإنتاج",\n    "title_en": "Production Process Steps",\n    "subtitle_ar": "من استلام المواد الخام حتى التعبئة والتغليف",\n    "subtitle_en": "From raw material receipt to packaging and labeling",\n    "items": [\n      {\n        "title_ar": "استلام وفحص المواد الخام",\n        "title_en": "Raw Material Receipt & Inspection",\n        "description_ar": "نستقبل أجود أنواع الزيوت الخام من مصادر معتمدة عالمياً ونجري فحوصات شاملة للتأكد من جودتها ومطابقتها للمواصفات",\n        "description_en": "We receive the finest crude oils from globally certified sources and conduct comprehensive inspections to ensure quality and specification compliance",\n        "icon": "PackageCheck",\n        "image": "/uploads/upload_1777791867288_pyu8ag.jfif"\n      },\n      {\n        "title_ar": "التكرير والتنقية",\n        "title_en": "Refining & Purification",\n        "description_ar": "تمر الزيوت الخام بعمليات تكرير متعددة تشمل إزالة الصمغ، والتبييض، وإزالة الروائح للحصول على زيت نقي عالي الجودة",\n        "description_en": "Crude oils undergo multiple refining processes including degumming, bleaching, and deodorizing to produce high-quality pure oil",\n        "icon": "Filter",\n        "image": "/uploads/upload_1777792085916_gdu075.jfif"\n      },\n      {\n        "title_ar": "الهدرجة والتحويل",\n        "title_en": "Hydrogenation & Processing",\n        "description_ar": "يتم تحويل الزيوت السائلة إلى سمن وشورتنينج من خلال عمليات هدرجة محكمة تحت إشراف فني متخصص",\n        "description_en": "Liquid oils are converted into margarine and shortening through precise hydrogenation processes under specialized technical supervision",\n        "icon": "FlaskConical",\n        "image": "/uploads/upload_1777792345594_zdyi0v.jfif"\n      },\n      {\n        "title_ar": "مراقبة الجودة المخبرية",\n        "title_en": "Laboratory Quality Control",\n        "description_ar": "يتم إجراء تحاليل مخبرية دقيقة في كل مرحلة لضمان مطابقة المنتج للمواصفات القياسية المحلية والدولية",\n        "description_en": "Precise laboratory analyses are conducted at every stage to ensure product compliance with local and international standards",\n        "icon": "Microscope",\n        "image": "/uploads/upload_1777792360172_180jue.jfif"\n      },\n      {\n        "title_ar": "التعبئة والتغليف",\n        "title_en": "Filling & Packaging",\n        "description_ar": "تعبئة آلية بالكامل في عبوات متنوعة الأحجام مع طباعة بيانات المنتج وتاريخ الإنتاج والصلاحية بأعلى معايير النظافة",\n        "description_en": "Fully automated filling in various container sizes with product data, production date, and expiry date printing under the highest hygiene standards",\n        "icon": "Package"\n      },\n      {\n        "title_ar": "التخزين والتوزيع",\n        "title_en": "Storage & Distribution",\n        "description_ar": "مستودعات مجهزة بأنظمة تحكم في درجة الحرارة وأسطول نقل متكامل لضمان وصول المنتجات بأفضل حالة",\n        "description_en": "Temperature-controlled warehouses and a comprehensive transport fleet to ensure products arrive in optimal condition",\n        "icon": "Truck"\n      }\n    ]\n  },\n  "capacity": {\n    "title_ar": "الطاقة الإنتاجية",\n    "title_en": "Production Capacity",\n    "subtitle_ar": "أرقام تعكس حجم وقدرات مصنع السلام",\n    "subtitle_en": "Numbers reflecting the scale and capabilities of Elsalam Factory",\n    "items": [\n      {\n        "label_ar": "خطوط إنتاج",\n        "label_en": "Production Lines",\n        "value": "8"\n      },\n      {\n        "label_ar": "طن يومياً",\n        "label_en": "Tons Daily",\n        "value": "500"\n      },\n      {\n        "label_ar": "دولة تصدير",\n        "label_en": "Export Countries",\n        "value": "15+"\n      },\n      {\n        "label_ar": "منتج متنوع",\n        "label_en": "Diverse Products",\n        "value": "50+"\n      }\n    ]\n  },\n  "gallery": {\n    "title_ar": "جولة في خطوط الإنتاج",\n    "title_en": "Production Lines Tour",\n    "items": [\n      {\n        "title_ar": "خط إنتاج الزيوت",\n        "title_en": "Oil Production Line",\n        "url": ""\n      },\n      {\n        "title_ar": "خط التكرير",\n        "title_en": "Refining Line",\n        "url": ""\n      },\n      {\n        "title_ar": "خط التعبئة",\n        "title_en": "Filling Line",\n        "url": ""\n      },\n      {\n        "title_ar": "مستودعات التخزين",\n        "title_en": "Storage Warehouses",\n        "url": ""\n      }\n    ]\n  }\n}	2026-05-03 07:13:37.029	٣‏/٥‏/٢٠٢٦ ١٠:١٣:٣٧ ص
cmopfvsrq000trtospzfss8ou	production	{\n  "hero": {\n    "title_ar": "مراحل الإنتاج",\n    "title_en": "Production Stages",\n    "subtitle_ar": "نتبع أحدث التقنيات العالمية في تصنيع الزيوت النباتية والسمن والشورتنينج عبر 8 خطوط إنتاج متطورة",\n    "subtitle_en": "We follow the latest global technologies in manufacturing vegetable oils, margarine & shortening across 8 advanced production lines",\n    "backgroundImage": "/uploads/upload_1777791699375_pdj53m.jfif"\n  },\n  "steps": {\n    "title_ar": "خطوات عملية الإنتاج",\n    "title_en": "Production Process Steps",\n    "subtitle_ar": "من استلام المواد الخام حتى التعبئة والتغليف",\n    "subtitle_en": "From raw material receipt to packaging and labeling",\n    "items": [\n      {\n        "title_ar": "استلام وفحص المواد الخام",\n        "title_en": "Raw Material Receipt & Inspection",\n        "description_ar": "نستقبل أجود أنواع الزيوت الخام من مصادر معتمدة عالمياً ونجري فحوصات شاملة للتأكد من جودتها ومطابقتها للمواصفات",\n        "description_en": "We receive the finest crude oils from globally certified sources and conduct comprehensive inspections to ensure quality and specification compliance",\n        "icon": "PackageCheck",\n        "image": "/uploads/upload_1777791867288_pyu8ag.jfif"\n      },\n      {\n        "title_ar": "التكرير والتنقية",\n        "title_en": "Refining & Purification",\n        "description_ar": "تمر الزيوت الخام بعمليات تكرير متعددة تشمل إزالة الصمغ، والتبييض، وإزالة الروائح للحصول على زيت نقي عالي الجودة",\n        "description_en": "Crude oils undergo multiple refining processes including degumming, bleaching, and deodorizing to produce high-quality pure oil",\n        "icon": "Filter",\n        "image": "/uploads/upload_1777792085916_gdu075.jfif"\n      },\n      {\n        "title_ar": "الهدرجة والتحويل",\n        "title_en": "Hydrogenation & Processing",\n        "description_ar": "يتم تحويل الزيوت السائلة إلى سمن وشورتنينج من خلال عمليات هدرجة محكمة تحت إشراف فني متخصص",\n        "description_en": "Liquid oils are converted into margarine and shortening through precise hydrogenation processes under specialized technical supervision",\n        "icon": "FlaskConical",\n        "image": "/uploads/upload_1777792345594_zdyi0v.jfif"\n      },\n      {\n        "title_ar": "مراقبة الجودة المخبرية",\n        "title_en": "Laboratory Quality Control",\n        "description_ar": "يتم إجراء تحاليل مخبرية دقيقة في كل مرحلة لضمان مطابقة المنتج للمواصفات القياسية المحلية والدولية",\n        "description_en": "Precise laboratory analyses are conducted at every stage to ensure product compliance with local and international standards",\n        "icon": "Microscope",\n        "image": "/uploads/upload_1777792360172_180jue.jfif"\n      },\n      {\n        "title_ar": "التعبئة والتغليف",\n        "title_en": "Filling & Packaging",\n        "description_ar": "تعبئة آلية بالكامل في عبوات متنوعة الأحجام مع طباعة بيانات المنتج وتاريخ الإنتاج والصلاحية بأعلى معايير النظافة",\n        "description_en": "Fully automated filling in various container sizes with product data, production date, and expiry date printing under the highest hygiene standards",\n        "icon": "Package",\n        "image": "/uploads/upload_1777792560651_wd3kh3.jfif"\n      },\n      {\n        "title_ar": "التخزين والتوزيع",\n        "title_en": "Storage & Distribution",\n        "description_ar": "مستودعات مجهزة بأنظمة تحكم في درجة الحرارة وأسطول نقل متكامل لضمان وصول المنتجات بأفضل حالة",\n        "description_en": "Temperature-controlled warehouses and a comprehensive transport fleet to ensure products arrive in optimal condition",\n        "icon": "Truck",\n        "image": "/uploads/upload_1777792715598_ym5wrt.jfif"\n      }\n    ]\n  },\n  "capacity": {\n    "title_ar": "الطاقة الإنتاجية",\n    "title_en": "Production Capacity",\n    "subtitle_ar": "أرقام تعكس حجم وقدرات مصنع السلام",\n    "subtitle_en": "Numbers reflecting the scale and capabilities of Elsalam Factory",\n    "items": [\n      {\n        "label_ar": "خطوط إنتاج",\n        "label_en": "Production Lines",\n        "value": "8"\n      },\n      {\n        "label_ar": "طن يومياً",\n        "label_en": "Tons Daily",\n        "value": "500"\n      },\n      {\n        "label_ar": "دولة تصدير",\n        "label_en": "Export Countries",\n        "value": "15+"\n      },\n      {\n        "label_ar": "منتج متنوع",\n        "label_en": "Diverse Products",\n        "value": "50+"\n      }\n    ]\n  },\n  "gallery": {\n    "title_ar": "جولة في خطوط الإنتاج",\n    "title_en": "Production Lines Tour",\n    "items": [\n      {\n        "title_ar": "خط إنتاج الزيوت",\n        "title_en": "Oil Production Line",\n        "url": ""\n      },\n      {\n        "title_ar": "خط التكرير",\n        "title_en": "Refining Line",\n        "url": ""\n      },\n      {\n        "title_ar": "خط التعبئة",\n        "title_en": "Filling Line",\n        "url": ""\n      },\n      {\n        "title_ar": "مستودعات التخزين",\n        "title_en": "Storage Warehouses",\n        "url": ""\n      }\n    ]\n  }\n}	2026-05-03 07:18:38.438	٣‏/٥‏/٢٠٢٦ ١٠:١٨:٣٨ ص
cmoph0ycv000vrtoshbhbqtsu	b2b	{\n  "hero": {\n    "title_ar": "بوابة الشراكات الصناعية",\n    "title_en": "Industrial Partnerships Hub",\n    "subtitle_ar": "مصنع السلام — شريكك الاستراتيجي في توريد الزيوت النباتية والسمن والشورتنج بكميات صناعية وأسعار مباشرة من المصنع.",\n    "subtitle_en": "Elsalam Factory — Your strategic partner in supplying vegetable oils, margarine & shortening in industrial quantities at factory-direct prices.",\n    "ctaQuote_ar": "طلب عرض سعر",\n    "ctaQuote_en": "Request a Quote",\n    "ctaCatalog_ar": "تحميل الكتالوج PDF",\n    "ctaCatalog_en": "Download PDF Catalog",\n    "backgroundImage": "/uploads/upload_1777794631585_9j7hfe.png"\n  },\n  "benefits": {\n    "title_ar": "لماذا مصنع السلام؟",\n    "title_en": "Why Elsalam Factory?",\n    "subtitle_ar": "6 أسباب تجعلنا الخيار الأول للمصانع والموزعين",\n    "subtitle_en": "6 reasons that make us the first choice for factories and distributors",\n    "items": [\n      {\n        "title_ar": "طاقة إنتاجية عالية",\n        "title_en": "High Production Capacity",\n        "description_ar": "500 طن يومياً عبر 8 خطوط إنتاج مجهزة بأحدث التقنيات الأوروبية.",\n        "description_en": "500 tons daily across 8 production lines equipped with the latest European technology."\n      },\n      {\n        "title_ar": "مختبرات جودة متقدمة",\n        "title_en": "Advanced Quality Labs",\n        "description_ar": "رقابة صارمة على كل مرحلة من مراحل الإنتاج مع تقارير مخبرية لكل شحنة.",\n        "description_en": "Strict quality control at every production stage with lab reports for each shipment."\n      },\n      {\n        "title_ar": "تعبئة مخصصة",\n        "title_en": "Custom Packaging",\n        "description_ar": "من العبوات الصغيرة للتجزئة إلى الفليكسي تانك للتصدير — حسب احتياجاتك.",\n        "description_en": "From small retail bottles to flexitank for export — tailored to your needs."\n      },\n      {\n        "title_ar": "أسعار تنافسية",\n        "title_en": "Competitive Pricing",\n        "description_ar": "أسعار مباشرة من المصنع مع شروط دفع مرنة للعملاء الصناعيين.",\n        "description_en": "Direct factory prices with flexible payment terms for industrial clients."\n      },\n      {\n        "title_ar": "لوجستيات متكاملة",\n        "title_en": "Integrated Logistics",\n        "description_ar": "شحن محلي ودولي مع تتبع الشحنات وضمان التوصيل في الموعد.",\n        "description_en": "Local and international shipping with shipment tracking and on-time delivery guarantee."\n      },\n      {\n        "title_ar": "شريك استراتيجي",\n        "title_en": "Strategic Partner",\n        "description_ar": "فريق مبيعات مخصص وحلول مصممة حسب احتياجات عملك.",\n        "description_en": "Dedicated sales team and solutions designed for your business needs."\n      }\n    ]\n  },\n  "quoteForm": {\n    "title_ar": "طلب عرض سعر بالجملة",\n    "title_en": "Bulk Quote Request",\n    "subtitle_ar": "املأ البيانات التالية وسيتواصل معك فريق المبيعات خلال 24 ساعة",\n    "subtitle_en": "Fill in the details below and our sales team will contact you within 24 hours",\n    "moq_ar": "الحد الأدنى للطلب (MOQ): 5 أطنان — سيتم الرد خلال 24 ساعة عمل",\n    "moq_en": "Minimum Order Quantity (MOQ): 5 tons — Response within 24 business hours",\n    "products": [\n      {\n        "name_ar": "زيت صويا مكرر",\n        "name_en": "Refined Soybean Oil"\n      },\n      {\n        "name_ar": "زيت عباد الشمس",\n        "name_en": "Sunflower Oil"\n      },\n      {\n        "name_ar": "زيت نخيل",\n        "name_en": "Palm Oil"\n      },\n      {\n        "name_ar": "سمن نباتي",\n        "name_en": "Vegetable Ghee"\n      },\n      {\n        "name_ar": "شورتنج",\n        "name_en": "Shortening"\n      },\n      {\n        "name_ar": "زيت خلطات مخصصة",\n        "name_en": "Custom Oil Blends"\n      },\n      {\n        "name_ar": "Private Label",\n        "name_en": "Private Label"\n      }\n    ],\n    "packaging": [\n      {\n        "name_ar": "براميل (200 لتر)",\n        "name_en": "Drums (200L)"\n      },\n      {\n        "name_ar": "تنكات (18 لتر)",\n        "name_en": "Tins (18L)"\n      },\n      {\n        "name_ar": "عبوات (5 لتر)",\n        "name_en": "Bottles (5L)"\n      },\n      {\n        "name_ar": "عبوات (1 لتر)",\n        "name_en": "Bottles (1L)"\n      },\n      {\n        "name_ar": "Flexitank",\n        "name_en": "Flexitank"\n      },\n      {\n        "name_ar": "تعبئة مخصصة",\n        "name_en": "Custom Packaging"\n      }\n    ]\n  },\n  "ctaSection": {\n    "title_ar": "هل أنت مستعد لبدء شراكة؟",\n    "title_en": "Ready to Start a Partnership?",\n    "subtitle_ar": "تواصل مع فريق المبيعات الصناعية للحصول على عرض سعر مخصص",\n    "subtitle_en": "Contact our industrial sales team for a custom quote",\n    "buttonText_ar": "تواصل معنا الآن",\n    "buttonText_en": "Contact Us Now",\n    "buttonLink": "/contact"\n  }\n}	2026-05-03 07:50:38.575	٣‏/٥‏/٢٠٢٦ ١٠:٥٠:٣٦ ص
cmopjxoh3000xrtosu5p3by0q	about	{\n  "hero": {\n    "title_ar": "عن مصنع السلام",\n    "title_en": "About Elsalam Factory",\n    "subtitle_ar": "أكثر من 25 عاماً من الريادة في صناعة الزيوت النباتية والسمن والشورتنج",\n    "subtitle_en": "Over 25 years of leadership in the vegetable oils, margarine & shortening industry",\n    "badge_ar": "من نحن",\n    "badge_en": "About Us",\n    "backgroundImage": "/uploads/upload_1776643103718_x1k9vw.jfif"\n  },\n  "story": {\n    "title_ar": "قصتنا",\n    "title_en": "Our Story",\n    "paragraph1_ar": "تأسس مصنع السلام لعصر واستخلاص الزيوت النباتية عام 2000 في المنطقة الصناعية بمصر. بدأنا بخط إنتاج واحد ورؤية واضحة: تقديم زيوت نباتية بجودة عالمية وأسعار منافسة. واليوم، نفخر بامتلاك 8 خطوط إنتاج بطاقة 500 طن يومياً، ونصدّر إلى أكثر من 15 دولة.",\n    "paragraph1_en": "Elsalam Factory for Extracting and Refining Vegetable Oils was established in 2000 in the Industrial Zone, Egypt. We started with a single production line and a clear vision: to provide world-class vegetable oils at competitive prices. Today, we proudly operate 8 production lines with a daily capacity of 500 MT, exporting to over 15 countries.",\n    "paragraph2_ar": "نحن ملتزمون بالاستدامة والابتكار المستمر، مع استثمارات مستمرة في تطوير خطوط الإنتاج ومعامل الجودة لضمان مطابقة منتجاتنا لأعلى المواصفات القياسية المحلية والدولية.",\n    "paragraph2_en": "We are committed to sustainability and continuous innovation, consistently investing in our production lines and quality laboratories to ensure our products meet the highest local and international standards."\n  },\n  "timeline": {\n    "items": [\n      {\n        "year": "2000",\n        "title_ar": "التأسيس والانطلاق",\n        "title_en": "Foundation & Launch",\n        "description_ar": "بدأنا رحلتنا بخط إنتاج واحد للزيوت النباتية مع التركيز على تلبية احتياجات السوق المحلي بأعلى معايير الجودة.",\n        "description_en": "Began our journey with a single vegetable oil production line, focusing on meeting local market needs with the highest quality standards."\n      },\n      {\n        "year": "2008",\n        "title_ar": "توسعة خطوط التكرير",\n        "title_en": "Refinery Expansion",\n        "description_ar": "افتتاح خط التكرير المتطور لضمان النقاء التام والشفافية العالية لزيوتنا بمعايير أوروبية.",\n        "description_en": "Inaugurated a state-of-the-art refining line to ensure absolute purity and high transparency of our oils under European standards."\n      },\n      {\n        "year": "2015",\n        "title_ar": "دخول أسواق التصدير",\n        "title_en": "Entering Export Markets",\n        "description_ar": "حصولنا على شهادات الجودة العالمية وبلوغ طاقة إنتاجية سمحت لنا ببدء التصدير الناجح لدول أفريقيا والشرق الأوسط.",\n        "description_en": "Achieved international quality certifications and production capacity that enabled successful exports to Africa and the Middle East."\n      },\n      {\n        "year": "2020",\n        "title_ar": "إطلاق السمن والشورتنج",\n        "title_en": "Ghee & Shortening Launch",\n        "description_ar": "تنويع محفظة المنتجات لتشمل السمن النباتي الممتاز وشورتنج المخابز المتخصص لتلبية القطاع الصناعي.",\n        "description_en": "Diversified the product portfolio to include premium vegetable ghee and specialized bakery shortening to supply the industrial sector."\n      },\n      {\n        "year": "2025",\n        "title_ar": "الريادة والاستدامة",\n        "title_en": "Leadership & Sustainability",\n        "description_ar": "الوصول لطاقة 500 طن يومياً مع تصدير مستمر لـ 15 دولة وتطبيق سياسات إنتاج خضراء ومستدامة.",\n        "description_en": "Reached 500 MT daily capacity with continuous exports to 15+ countries, implementing green and sustainable production policies."\n      }\n    ]\n  },\n  "ceo": {\n    "name_ar": "محمد إسماعيل إدريس",\n    "name_en": "Mohamed Ismail Idris",\n    "role_ar": "رئيس مجلس إدارة مصنع السلام لعصر واستخلاص الزيوت النباتية",\n    "role_en": "Chairman of the Board, Elsalam Factory for Vegetable Oils and Refining",\n    "quote_ar": "نؤمن أن الجودة ليست خياراً بل هي التزام. رؤيتنا أن نكون الشريك الأول لكل مصنع ومطعم وموزع يبحث عن زيوت نباتية بمعايير عالمية مصنوعة في مصر.",\n    "quote_en": "We believe quality is an obligation, not an option. Our vision is to be the premier partner for every factory, restaurant, and distributor seeking world-class vegetable oils made in Egypt.",\n    "educationDesc_ar": "تخرج السيد محمد إسماعيل إدريس من جامعة الإسكندرية عام 1990، وبدأ مسيرته المهنية في مجال المبيعات، حيث أظهر منذ بداياته شغفًا واضحًا بمجال التسويق وبناء العلامات التجارية وتعزيز الحصة السوقية للشركات.",\n    "educationDesc_en": "Mr. Mohamed Ismail Idris graduated from Alexandria University in 1990 and began his professional career in sales, where he demonstrated a clear passion for marketing, brand building, and expanding market share from the very beginning.",\n    "careerStations": [\n      {\n        "title_ar": "شركة كوكاكولا – الإسكندرية (1990–1992)",\n        "title_en": "Coca-Cola Company – Alexandria (1990–1992)",\n        "role_ar": "مشرف مبيعات",\n        "role_en": "Sales Supervisor",\n        "desc_ar": "توسيع الحصة السوقية، زيادة المبيعات، تطبيق تقنيات تسويق مبتكرة",\n        "desc_en": "Expanded market share, increased sales, implemented innovative marketing techniques",\n        "image": "/uploads/upload_1776634969823_pkokrf.jpg"\n      },\n      {\n        "title_ar": "شركة العوجان – المملكة العربية السعودية (1993–1995)",\n        "title_en": "Aujan Industries – Saudi Arabia (1993–1995)",\n        "role_ar": "مشرف التموين",\n        "role_en": "Catering Supervisor",\n        "desc_ar": "أسّس قسم التموين بالشركة، وساهم في إدخال منتجات (راني، فيمتو، شوكولاتة كادبوري) إلى قطاعات الفنادق والمطاعم والمستشفيات والقطاع العسكري، والخطوط الجوية السعودية.",\n        "desc_en": "Founded the company's Catering Department, successfully introducing products (Rani, Vimto, Cadbury chocolate) to hotels, restaurants, hospitals, the military sector, and Saudi Arabian Airlines.",\n        "image": "/uploads/upload_1776634996004_uviykm.webp"\n      },\n      {\n        "title_ar": "شركة باعشن – السعودية (1995–1997)",\n        "title_en": "Baeshen Company – Saudi Arabia (1995–1997)",\n        "role_ar": "مدير المنطقة الشمالية",\n        "role_en": "Northern Region Manager",\n        "desc_ar": "قاد جهود تسويق علامة شاي ربيع، وأسهم في إطلاق وتوسيع انتشار المنتج في السوق السعودي.",\n        "desc_en": "Led the marketing efforts for Rabea Tea brand, contributing to the launch and extensive expansion of the product in the Saudi market.",\n        "image": "/uploads/upload_1776635060394_u8uwk5.jfif"\n      },\n      {\n        "title_ar": "شركة نستله مصر (1998)",\n        "title_en": "Nestle Egypt (1998)",\n        "role_ar": "مدير المبيعات - الإسكندرية",\n        "role_en": "Sales Manager - Alexandria",\n        "desc_ar": "أشرف على توزيع المنتجات الجافة (نسكافيه، نيدو، سيريلاك، شوكولاتة نستله) وعزز انتشار العلامة محليًا.",\n        "desc_en": "Supervised the distribution of dry products (Nescafe, Nido, Cerelac, Nestle chocolate) and enhanced the brand's local presence.",\n        "image": "/uploads/upload_1776635088623_5j5aj6.png"\n      },\n      {\n        "title_ar": "شركة صافولا سايم داربي (1999–2001)",\n        "title_en": "Savola Sime Darby (1999–2001)",\n        "role_ar": "مدير مبيعات القطاع الصناعي",\n        "role_en": "Industrial Sector Sales Manager",\n        "desc_ar": "ركز على توزيع زيت النخيل للصناعات الغذائية وقدم حلولًا صناعية مبتكرة من خلال إعادة تدوير مشتقات الزيت.",\n        "desc_en": "Focused on distributing palm oil to the food industry and introduced innovative industrial solutions by recycling oil derivatives.",\n        "image": "/uploads/upload_1776635112855_q157ia.webp"\n      }\n    ],\n    "entrepreneurshipDesc_ar": "في عام 2002، اتخذ السيد محمد إدريس خطوة جريئة بتأسيس شركة السلام كشركة متخصصة في تجارة وتكرير الزيوت النباتية وتوريد المواد الخام للمصانع الكبرى والمطاعم.",\n    "entrepreneurshipDesc_en": "In 2002, Mr. Mohamed Idris took a bold step by founding Elsalam Company as a specialized entity in trading and refining vegetable oils and supplying raw materials to major factories and restaurants.",\n    "expansionDesc_ar": "توسعت الشركة في توزيع زيت النخيل والشورتنج والمارجرين، وخدمة أكثر من 135 مصنعًا في مصر. وفي عام 2020، تم افتتاح مصنع حديث بدمنهور مزود بأحدث خطوط الإنتاج.",\n    "expansionDesc_en": "The company expanded into distributing palm oil, shortening, and margarine, serving over 135 factories in Egypt. In 2020, a modern factory was inaugurated in Damanhour, equipped with the latest production lines.",\n    "innovationPoints": [\n      {\n        "text_ar": "إدخال الشورتنج في إنتاج الأجبان",\n        "text_en": "Introducing shortening in cheese production"\n      },\n      {\n        "text_ar": "تطوير حلول صناعية لصناعة الأغذية",\n        "text_en": "Developing industrial solutions for the food industry"\n      },\n      {\n        "text_ar": "استثمار مخلفات زيت النخيل في صناعة الصابون",\n        "text_en": "Investing palm oil derivatives in soap manufacturing"\n      },\n      {\n        "text_ar": "تطبيق نظام رقابة جودة صارم في كل مراحل الإنتاج",\n        "text_en": "Implementing strictly monitored quality control across all production stages"\n      }\n    ],\n    "visionDesc_ar": "يهدف إلى الريادة في صناعة الزيوت والدهون الطبيعية في مصر والشرق الأوسط، معتمداً على بناء شراكات استراتيجية طويلة الأمد، دعم الصناعات الصغيرة، والالتزام بالمسؤولية المجتمعية.",\n    "visionDesc_en": "His vision is to lead the vegetable oils and natural fats industry in Egypt and the Middle East, relying on building long-term strategic partnerships, supporting small industries, and committing to social responsibility.",\n    "leadershipPoints": [\n      {\n        "text_ar": "خبرة تتجاوز 30 عامًا في قطاع الأغذية",\n        "text_en": "Over 30 years of experience in the food sector"\n      },\n      {\n        "text_ar": "خلفية قوية في المبيعات الصناعية",\n        "text_en": "Strong background in industrial sales"\n      },\n      {\n        "text_ar": "قدرة على بناء شراكات استراتيجية",\n        "text_en": "Ability to build strategic partnerships"\n      },\n      {\n        "text_ar": "توجه ابتكاري في تطوير المنتجات",\n        "text_en": "Innovative approach to product development"\n      },\n      {\n        "text_ar": "دعم حقيقي للصناعات الصغيرة والمتوسطة",\n        "text_en": "Genuine support for small and medium-sized industries"\n      }\n    ],\n    "image": "/uploads/upload_1777799515583_t6iflh.png"\n  },\n  "gallery": {\n    "title_ar": "جولة في المصنع",\n    "title_en": "Factory Tour",\n    "subtitle_ar": "نظرة على خطوط الإنتاج ومرافق الجودة",\n    "subtitle_en": "A look at our production lines and quality facilities",\n    "items": [\n      {\n        "title_ar": "خط إنتاج الزيوت الآلي",\n        "title_en": "Automated Oil Production Line",\n        "url": "/uploads/upload_1776643156622_joaqhw.jfif"\n      },\n      {\n        "title_ar": "معامل رقابة الجودة",\n        "title_en": "Quality Control Labs",\n        "url": "/uploads/upload_1776643556377_mlqu6e.jfif"\n      },\n      {\n        "title_ar": "خزانات التخزين",\n        "title_en": "Storage Tanks",\n        "url": "/uploads/upload_1776643692457_kvhcm0.jfif"\n      },\n      {\n        "title_ar": "خط تعبئة العبوات",\n        "title_en": "Bottle Filling Line",\n        "url": "/uploads/upload_1776643846245_gg2zai.jfif"\n      },\n      {\n        "title_ar": "مستودعات الشحن",\n        "title_en": "Shipping Warehouses",\n        "url": "/uploads/upload_1776643951492_u4bpcp.jfif"\n      },\n      {\n        "title_ar": "منطقة استقبال المواد الخام",\n        "title_en": "Raw Material Reception Area",\n        "url": "/uploads/upload_1776644148629_oi3c0v.jfif"\n      },\n      {\n        "title_ar": "غرفة التحكم المركزية",\n        "title_en": "Central Control Room",\n        "url": "/uploads/upload_1776644200524_obw0ri.jfif"\n      },\n      {\n        "title_ar": "خط إنتاج السمن",\n        "title_en": "Ghee Production Line",\n        "url": "/uploads/upload_1776644483092_5m2czr.jfif"\n      }\n    ]\n  },\n  "team": {\n    "badge_ar": "شركاء النجاح",\n    "badge_en": "Partners in Success",\n    "title_ar": "فريق الإدارة العليا",\n    "title_en": "Executive Leadership",\n    "subtitle_ar": "نخبة من الكفاءات المتميزة التي تقود رؤيتنا نحو العالمية، وتضمن أعلى معايير الجودة والتميز في كافة قطاعات الشركة.",\n    "subtitle_en": "Our distinguished leadership driving our global vision and ensuring the highest standards of quality.",\n    "members": [\n      {\n        "name_ar": "ذكى السيد ذكي",\n        "name_en": "Zaki El-Sayed Zaki",\n        "role_ar": "مشرف المبيعات ",\n        "role_en": "Sales Supervisor",\n        "image": "/uploads/upload_1776621029870_2h0jss.jfif"\n      },\n      {\n        "name_ar": "وليد بيومي",\n        "name_en": "Walid Bayoumi ",\n        "role_ar": "مدير المبيعات ",\n        "role_en": "Sales Manager",\n        "image": "/uploads/upload_1776621270095_axlqdh.jfif"\n      },\n      {\n        "name_ar": "منة الله زكريا ",\n        "name_en": "Menat Allah Zakaria",\n        "role_ar": "مديرة الحسابات",\n        "role_en": "Accounts Manager",\n        "image": "/uploads/upload_1776629197489_t4qeu8.jfif"\n      },\n      {\n        "name_ar": "محمد عاطف",\n        "name_en": "Mohamed Atef",\n        "role_ar": "مدير الإنتاج",\n        "role_en": "Production Manager",\n        "image": "/uploads/upload_1776629419135_hu8pen.jfif"\n      },\n      {\n        "name_ar": "محمد الريفي",\n        "name_en": "Mohamed Elrifi",\n        "role_ar": "مدير الجودة",\n        "role_en": "Quality Manager",\n        "image": "/uploads/upload_1776630914066_sad8o6.jfif"\n      }\n    ]\n  }\n}	2026-05-03 09:12:04.648	٣‏/٥‏/٢٠٢٦ ١٢:١٢:٠٣ م
cmopk1jgh000zrtos8wmfyp2d	about	{\n  "hero": {\n    "title_ar": "عن مصنع السلام",\n    "title_en": "About Elsalam Factory",\n    "subtitle_ar": "أكثر من 25 عاماً من الريادة في صناعة الزيوت النباتية والسمن والشورتنج",\n    "subtitle_en": "Over 25 years of leadership in the vegetable oils, margarine & shortening industry",\n    "badge_ar": "من نحن",\n    "badge_en": "About Us",\n    "backgroundImage": "/uploads/upload_1776643103718_x1k9vw.jfif"\n  },\n  "story": {\n    "title_ar": "قصتنا",\n    "title_en": "Our Story",\n    "paragraph1_ar": "تأسس مصنع السلام لعصر واستخلاص الزيوت النباتية عام 2000 في المنطقة الصناعية بمصر. بدأنا بخط إنتاج واحد ورؤية واضحة: تقديم زيوت نباتية بجودة عالمية وأسعار منافسة. واليوم، نفخر بامتلاك 8 خطوط إنتاج بطاقة 500 طن يومياً، ونصدّر إلى أكثر من 15 دولة.",\n    "paragraph1_en": "Elsalam Factory for Extracting and Refining Vegetable Oils was established in 2000 in the Industrial Zone, Egypt. We started with a single production line and a clear vision: to provide world-class vegetable oils at competitive prices. Today, we proudly operate 8 production lines with a daily capacity of 500 MT, exporting to over 15 countries.",\n    "paragraph2_ar": "نحن ملتزمون بالاستدامة والابتكار المستمر، مع استثمارات مستمرة في تطوير خطوط الإنتاج ومعامل الجودة لضمان مطابقة منتجاتنا لأعلى المواصفات القياسية المحلية والدولية.",\n    "paragraph2_en": "We are committed to sustainability and continuous innovation, consistently investing in our production lines and quality laboratories to ensure our products meet the highest local and international standards."\n  },\n  "timeline": {\n    "items": [\n      {\n        "year": "2000",\n        "title_ar": "التأسيس والانطلاق",\n        "title_en": "Foundation & Launch",\n        "description_ar": "بدأنا رحلتنا بخط إنتاج واحد للزيوت النباتية مع التركيز على تلبية احتياجات السوق المحلي بأعلى معايير الجودة.",\n        "description_en": "Began our journey with a single vegetable oil production line, focusing on meeting local market needs with the highest quality standards."\n      },\n      {\n        "year": "2008",\n        "title_ar": "توسعة خطوط التكرير",\n        "title_en": "Refinery Expansion",\n        "description_ar": "افتتاح خط التكرير المتطور لضمان النقاء التام والشفافية العالية لزيوتنا بمعايير أوروبية.",\n        "description_en": "Inaugurated a state-of-the-art refining line to ensure absolute purity and high transparency of our oils under European standards."\n      },\n      {\n        "year": "2015",\n        "title_ar": "دخول أسواق التصدير",\n        "title_en": "Entering Export Markets",\n        "description_ar": "حصولنا على شهادات الجودة العالمية وبلوغ طاقة إنتاجية سمحت لنا ببدء التصدير الناجح لدول أفريقيا والشرق الأوسط.",\n        "description_en": "Achieved international quality certifications and production capacity that enabled successful exports to Africa and the Middle East."\n      },\n      {\n        "year": "2020",\n        "title_ar": "إطلاق السمن والشورتنج",\n        "title_en": "Ghee & Shortening Launch",\n        "description_ar": "تنويع محفظة المنتجات لتشمل السمن النباتي الممتاز وشورتنج المخابز المتخصص لتلبية القطاع الصناعي.",\n        "description_en": "Diversified the product portfolio to include premium vegetable ghee and specialized bakery shortening to supply the industrial sector."\n      },\n      {\n        "year": "2025",\n        "title_ar": "الريادة والاستدامة",\n        "title_en": "Leadership & Sustainability",\n        "description_ar": "الوصول لطاقة 500 طن يومياً مع تصدير مستمر لـ 15 دولة وتطبيق سياسات إنتاج خضراء ومستدامة.",\n        "description_en": "Reached 500 MT daily capacity with continuous exports to 15+ countries, implementing green and sustainable production policies."\n      }\n    ]\n  },\n  "ceo": {\n    "name_ar": "محمد إسماعيل إدريس",\n    "name_en": "Mohamed Ismail Idris",\n    "role_ar": "رئيس مجلس إدارة مصنع السلام لعصر واستخلاص الزيوت النباتية",\n    "role_en": "Chairman of the Board, Elsalam Factory for Vegetable Oils and Refining",\n    "quote_ar": "نؤمن أن الجودة ليست خياراً بل هي التزام. رؤيتنا أن نكون الشريك الأول لكل مصنع ومطعم وموزع يبحث عن زيوت نباتية بمعايير عالمية مصنوعة في مصر.",\n    "quote_en": "We believe quality is an obligation, not an option. Our vision is to be the premier partner for every factory, restaurant, and distributor seeking world-class vegetable oils made in Egypt.",\n    "educationDesc_ar": "تخرج السيد محمد إسماعيل إدريس من جامعة الإسكندرية عام 1990، وبدأ مسيرته المهنية في مجال المبيعات، حيث أظهر منذ بداياته شغفًا واضحًا بمجال التسويق وبناء العلامات التجارية وتعزيز الحصة السوقية للشركات.",\n    "educationDesc_en": "Mr. Mohamed Ismail Idris graduated from Alexandria University in 1990 and began his professional career in sales, where he demonstrated a clear passion for marketing, brand building, and expanding market share from the very beginning.",\n    "careerStations": [\n      {\n        "title_ar": "شركة كوكاكولا – الإسكندرية (1990–1992)",\n        "title_en": "Coca-Cola Company – Alexandria (1990–1992)",\n        "role_ar": "مشرف مبيعات",\n        "role_en": "Sales Supervisor",\n        "desc_ar": "توسيع الحصة السوقية، زيادة المبيعات، تطبيق تقنيات تسويق مبتكرة",\n        "desc_en": "Expanded market share, increased sales, implemented innovative marketing techniques",\n        "image": "/uploads/upload_1776634969823_pkokrf.jpg"\n      },\n      {\n        "title_ar": "شركة العوجان – المملكة العربية السعودية (1993–1995)",\n        "title_en": "Aujan Industries – Saudi Arabia (1993–1995)",\n        "role_ar": "مشرف التموين",\n        "role_en": "Catering Supervisor",\n        "desc_ar": "أسّس قسم التموين بالشركة، وساهم في إدخال منتجات (راني، فيمتو، شوكولاتة كادبوري) إلى قطاعات الفنادق والمطاعم والمستشفيات والقطاع العسكري، والخطوط الجوية السعودية.",\n        "desc_en": "Founded the company's Catering Department, successfully introducing products (Rani, Vimto, Cadbury chocolate) to hotels, restaurants, hospitals, the military sector, and Saudi Arabian Airlines.",\n        "image": "/uploads/upload_1776634996004_uviykm.webp"\n      },\n      {\n        "title_ar": "شركة باعشن – السعودية (1995–1997)",\n        "title_en": "Baeshen Company – Saudi Arabia (1995–1997)",\n        "role_ar": "مدير المنطقة الشمالية",\n        "role_en": "Northern Region Manager",\n        "desc_ar": "قاد جهود تسويق علامة شاي ربيع، وأسهم في إطلاق وتوسيع انتشار المنتج في السوق السعودي.",\n        "desc_en": "Led the marketing efforts for Rabea Tea brand, contributing to the launch and extensive expansion of the product in the Saudi market.",\n        "image": "/uploads/upload_1776635060394_u8uwk5.jfif"\n      },\n      {\n        "title_ar": "شركة نستله مصر (1998)",\n        "title_en": "Nestle Egypt (1998)",\n        "role_ar": "مدير المبيعات - الإسكندرية",\n        "role_en": "Sales Manager - Alexandria",\n        "desc_ar": "أشرف على توزيع المنتجات الجافة (نسكافيه، نيدو، سيريلاك، شوكولاتة نستله) وعزز انتشار العلامة محليًا.",\n        "desc_en": "Supervised the distribution of dry products (Nescafe, Nido, Cerelac, Nestle chocolate) and enhanced the brand's local presence.",\n        "image": "/uploads/upload_1776635088623_5j5aj6.png"\n      },\n      {\n        "title_ar": "شركة صافولا سايم داربي (1999–2001)",\n        "title_en": "Savola Sime Darby (1999–2001)",\n        "role_ar": "مدير مبيعات القطاع الصناعي",\n        "role_en": "Industrial Sector Sales Manager",\n        "desc_ar": "ركز على توزيع زيت النخيل للصناعات الغذائية وقدم حلولًا صناعية مبتكرة من خلال إعادة تدوير مشتقات الزيت.",\n        "desc_en": "Focused on distributing palm oil to the food industry and introduced innovative industrial solutions by recycling oil derivatives.",\n        "image": "/uploads/upload_1776635112855_q157ia.webp"\n      }\n    ],\n    "entrepreneurshipDesc_ar": "في عام 2002، اتخذ السيد محمد إدريس خطوة جريئة بتأسيس شركة السلام كشركة متخصصة في تجارة وتكرير الزيوت النباتية وتوريد المواد الخام للمصانع الكبرى والمطاعم.",\n    "entrepreneurshipDesc_en": "In 2002, Mr. Mohamed Idris took a bold step by founding Elsalam Company as a specialized entity in trading and refining vegetable oils and supplying raw materials to major factories and restaurants.",\n    "expansionDesc_ar": "توسعت الشركة في توزيع زيت النخيل والشورتنج والمارجرين، وخدمة أكثر من 135 مصنعًا في مصر. وفي عام 2020، تم افتتاح مصنع حديث بدمنهور مزود بأحدث خطوط الإنتاج.",\n    "expansionDesc_en": "The company expanded into distributing palm oil, shortening, and margarine, serving over 135 factories in Egypt. In 2020, a modern factory was inaugurated in Damanhour, equipped with the latest production lines.",\n    "innovationPoints": [\n      {\n        "text_ar": "إدخال الشورتنج في إنتاج الأجبان",\n        "text_en": "Introducing shortening in cheese production"\n      },\n      {\n        "text_ar": "تطوير حلول صناعية لصناعة الأغذية",\n        "text_en": "Developing industrial solutions for the food industry"\n      },\n      {\n        "text_ar": "استثمار مخلفات زيت النخيل في صناعة الصابون",\n        "text_en": "Investing palm oil derivatives in soap manufacturing"\n      },\n      {\n        "text_ar": "تطبيق نظام رقابة جودة صارم في كل مراحل الإنتاج",\n        "text_en": "Implementing strictly monitored quality control across all production stages"\n      }\n    ],\n    "visionDesc_ar": "يهدف إلى الريادة في صناعة الزيوت والدهون الطبيعية في مصر والشرق الأوسط، معتمداً على بناء شراكات استراتيجية طويلة الأمد، دعم الصناعات الصغيرة، والالتزام بالمسؤولية المجتمعية.",\n    "visionDesc_en": "His vision is to lead the vegetable oils and natural fats industry in Egypt and the Middle East, relying on building long-term strategic partnerships, supporting small industries, and committing to social responsibility.",\n    "leadershipPoints": [\n      {\n        "text_ar": "خبرة تتجاوز 30 عامًا في قطاع الأغذية",\n        "text_en": "Over 30 years of experience in the food sector"\n      },\n      {\n        "text_ar": "خلفية قوية في المبيعات الصناعية",\n        "text_en": "Strong background in industrial sales"\n      },\n      {\n        "text_ar": "قدرة على بناء شراكات استراتيجية",\n        "text_en": "Ability to build strategic partnerships"\n      },\n      {\n        "text_ar": "توجه ابتكاري في تطوير المنتجات",\n        "text_en": "Innovative approach to product development"\n      },\n      {\n        "text_ar": "دعم حقيقي للصناعات الصغيرة والمتوسطة",\n        "text_en": "Genuine support for small and medium-sized industries"\n      }\n    ],\n    "image": "/uploads/upload_1777799701729_l6sh8u.png"\n  },\n  "gallery": {\n    "title_ar": "جولة في المصنع",\n    "title_en": "Factory Tour",\n    "subtitle_ar": "نظرة على خطوط الإنتاج ومرافق الجودة",\n    "subtitle_en": "A look at our production lines and quality facilities",\n    "items": [\n      {\n        "title_ar": "خط إنتاج الزيوت الآلي",\n        "title_en": "Automated Oil Production Line",\n        "url": "/uploads/upload_1776643156622_joaqhw.jfif"\n      },\n      {\n        "title_ar": "معامل رقابة الجودة",\n        "title_en": "Quality Control Labs",\n        "url": "/uploads/upload_1776643556377_mlqu6e.jfif"\n      },\n      {\n        "title_ar": "خزانات التخزين",\n        "title_en": "Storage Tanks",\n        "url": "/uploads/upload_1776643692457_kvhcm0.jfif"\n      },\n      {\n        "title_ar": "خط تعبئة العبوات",\n        "title_en": "Bottle Filling Line",\n        "url": "/uploads/upload_1776643846245_gg2zai.jfif"\n      },\n      {\n        "title_ar": "مستودعات الشحن",\n        "title_en": "Shipping Warehouses",\n        "url": "/uploads/upload_1776643951492_u4bpcp.jfif"\n      },\n      {\n        "title_ar": "منطقة استقبال المواد الخام",\n        "title_en": "Raw Material Reception Area",\n        "url": "/uploads/upload_1776644148629_oi3c0v.jfif"\n      },\n      {\n        "title_ar": "غرفة التحكم المركزية",\n        "title_en": "Central Control Room",\n        "url": "/uploads/upload_1776644200524_obw0ri.jfif"\n      },\n      {\n        "title_ar": "خط إنتاج السمن",\n        "title_en": "Ghee Production Line",\n        "url": "/uploads/upload_1776644483092_5m2czr.jfif"\n      }\n    ]\n  },\n  "team": {\n    "badge_ar": "شركاء النجاح",\n    "badge_en": "Partners in Success",\n    "title_ar": "فريق الإدارة العليا",\n    "title_en": "Executive Leadership",\n    "subtitle_ar": "نخبة من الكفاءات المتميزة التي تقود رؤيتنا نحو العالمية، وتضمن أعلى معايير الجودة والتميز في كافة قطاعات الشركة.",\n    "subtitle_en": "Our distinguished leadership driving our global vision and ensuring the highest standards of quality.",\n    "members": [\n      {\n        "name_ar": "ذكى السيد ذكي",\n        "name_en": "Zaki El-Sayed Zaki",\n        "role_ar": "مشرف المبيعات ",\n        "role_en": "Sales Supervisor",\n        "image": "/uploads/upload_1776621029870_2h0jss.jfif"\n      },\n      {\n        "name_ar": "وليد بيومي",\n        "name_en": "Walid Bayoumi ",\n        "role_ar": "مدير المبيعات ",\n        "role_en": "Sales Manager",\n        "image": "/uploads/upload_1776621270095_axlqdh.jfif"\n      },\n      {\n        "name_ar": "منة الله زكريا ",\n        "name_en": "Menat Allah Zakaria",\n        "role_ar": "مديرة الحسابات",\n        "role_en": "Accounts Manager",\n        "image": "/uploads/upload_1776629197489_t4qeu8.jfif"\n      },\n      {\n        "name_ar": "محمد عاطف",\n        "name_en": "Mohamed Atef",\n        "role_ar": "مدير الإنتاج",\n        "role_en": "Production Manager",\n        "image": "/uploads/upload_1776629419135_hu8pen.jfif"\n      },\n      {\n        "name_ar": "محمد الريفي",\n        "name_en": "Mohamed Elrifi",\n        "role_ar": "مدير الجودة",\n        "role_en": "Quality Manager",\n        "image": "/uploads/upload_1776630914066_sad8o6.jfif"\n      }\n    ]\n  }\n}	2026-05-03 09:15:04.77	٣‏/٥‏/٢٠٢٦ ١٢:١٥:٠٤ م
cmopk7c2f0011rtosw6q04ue6	about	{\n  "hero": {\n    "title_ar": "عن مصنع السلام",\n    "title_en": "About Elsalam Factory",\n    "subtitle_ar": "أكثر من 25 عاماً من الريادة في صناعة الزيوت النباتية والسمن والشورتنج",\n    "subtitle_en": "Over 25 years of leadership in the vegetable oils, margarine & shortening industry",\n    "badge_ar": "من نحن",\n    "badge_en": "About Us",\n    "backgroundImage": "/uploads/upload_1776643103718_x1k9vw.jfif"\n  },\n  "story": {\n    "title_ar": "قصتنا",\n    "title_en": "Our Story",\n    "paragraph1_ar": "تأسس مصنع السلام لعصر واستخلاص الزيوت النباتية عام 2000 في المنطقة الصناعية بمصر. بدأنا بخط إنتاج واحد ورؤية واضحة: تقديم زيوت نباتية بجودة عالمية وأسعار منافسة. واليوم، نفخر بامتلاك 8 خطوط إنتاج بطاقة 500 طن يومياً، ونصدّر إلى أكثر من 15 دولة.",\n    "paragraph1_en": "Elsalam Factory for Extracting and Refining Vegetable Oils was established in 2000 in the Industrial Zone, Egypt. We started with a single production line and a clear vision: to provide world-class vegetable oils at competitive prices. Today, we proudly operate 8 production lines with a daily capacity of 500 MT, exporting to over 15 countries.",\n    "paragraph2_ar": "نحن ملتزمون بالاستدامة والابتكار المستمر، مع استثمارات مستمرة في تطوير خطوط الإنتاج ومعامل الجودة لضمان مطابقة منتجاتنا لأعلى المواصفات القياسية المحلية والدولية.",\n    "paragraph2_en": "We are committed to sustainability and continuous innovation, consistently investing in our production lines and quality laboratories to ensure our products meet the highest local and international standards."\n  },\n  "timeline": {\n    "items": [\n      {\n        "year": "2000",\n        "title_ar": "التأسيس والانطلاق",\n        "title_en": "Foundation & Launch",\n        "description_ar": "بدأنا رحلتنا بخط إنتاج واحد للزيوت النباتية مع التركيز على تلبية احتياجات السوق المحلي بأعلى معايير الجودة.",\n        "description_en": "Began our journey with a single vegetable oil production line, focusing on meeting local market needs with the highest quality standards."\n      },\n      {\n        "year": "2008",\n        "title_ar": "توسعة خطوط التكرير",\n        "title_en": "Refinery Expansion",\n        "description_ar": "افتتاح خط التكرير المتطور لضمان النقاء التام والشفافية العالية لزيوتنا بمعايير أوروبية.",\n        "description_en": "Inaugurated a state-of-the-art refining line to ensure absolute purity and high transparency of our oils under European standards."\n      },\n      {\n        "year": "2015",\n        "title_ar": "دخول أسواق التصدير",\n        "title_en": "Entering Export Markets",\n        "description_ar": "حصولنا على شهادات الجودة العالمية وبلوغ طاقة إنتاجية سمحت لنا ببدء التصدير الناجح لدول أفريقيا والشرق الأوسط.",\n        "description_en": "Achieved international quality certifications and production capacity that enabled successful exports to Africa and the Middle East."\n      },\n      {\n        "year": "2020",\n        "title_ar": "إطلاق السمن والشورتنج",\n        "title_en": "Ghee & Shortening Launch",\n        "description_ar": "تنويع محفظة المنتجات لتشمل السمن النباتي الممتاز وشورتنج المخابز المتخصص لتلبية القطاع الصناعي.",\n        "description_en": "Diversified the product portfolio to include premium vegetable ghee and specialized bakery shortening to supply the industrial sector."\n      },\n      {\n        "year": "2025",\n        "title_ar": "الريادة والاستدامة",\n        "title_en": "Leadership & Sustainability",\n        "description_ar": "الوصول لطاقة 500 طن يومياً مع تصدير مستمر لـ 15 دولة وتطبيق سياسات إنتاج خضراء ومستدامة.",\n        "description_en": "Reached 500 MT daily capacity with continuous exports to 15+ countries, implementing green and sustainable production policies."\n      }\n    ]\n  },\n  "ceo": {\n    "name_ar": "محمد إسماعيل إدريس",\n    "name_en": "Mohamed Ismail Idris",\n    "role_ar": "رئيس مجلس إدارة مصنع السلام لعصر واستخلاص الزيوت النباتية",\n    "role_en": "Chairman of the Board, Elsalam Factory for Vegetable Oils and Refining",\n    "quote_ar": "نؤمن أن الجودة ليست خياراً بل هي التزام. رؤيتنا أن نكون الشريك الأول لكل مصنع ومطعم وموزع يبحث عن زيوت نباتية بمعايير عالمية مصنوعة في مصر.",\n    "quote_en": "We believe quality is an obligation, not an option. Our vision is to be the premier partner for every factory, restaurant, and distributor seeking world-class vegetable oils made in Egypt.",\n    "educationDesc_ar": "تخرج السيد محمد إسماعيل إدريس من جامعة الإسكندرية عام 1990، وبدأ مسيرته المهنية في مجال المبيعات، حيث أظهر منذ بداياته شغفًا واضحًا بمجال التسويق وبناء العلامات التجارية وتعزيز الحصة السوقية للشركات.",\n    "educationDesc_en": "Mr. Mohamed Ismail Idris graduated from Alexandria University in 1990 and began his professional career in sales, where he demonstrated a clear passion for marketing, brand building, and expanding market share from the very beginning.",\n    "careerStations": [\n      {\n        "title_ar": "شركة كوكاكولا – الإسكندرية (1990–1992)",\n        "title_en": "Coca-Cola Company – Alexandria (1990–1992)",\n        "role_ar": "مشرف مبيعات",\n        "role_en": "Sales Supervisor",\n        "desc_ar": "توسيع الحصة السوقية، زيادة المبيعات، تطبيق تقنيات تسويق مبتكرة",\n        "desc_en": "Expanded market share, increased sales, implemented innovative marketing techniques",\n        "image": "/uploads/upload_1776634969823_pkokrf.jpg"\n      },\n      {\n        "title_ar": "شركة العوجان – المملكة العربية السعودية (1993–1995)",\n        "title_en": "Aujan Industries – Saudi Arabia (1993–1995)",\n        "role_ar": "مشرف التموين",\n        "role_en": "Catering Supervisor",\n        "desc_ar": "أسّس قسم التموين بالشركة، وساهم في إدخال منتجات (راني، فيمتو، شوكولاتة كادبوري) إلى قطاعات الفنادق والمطاعم والمستشفيات والقطاع العسكري، والخطوط الجوية السعودية.",\n        "desc_en": "Founded the company's Catering Department, successfully introducing products (Rani, Vimto, Cadbury chocolate) to hotels, restaurants, hospitals, the military sector, and Saudi Arabian Airlines.",\n        "image": "/uploads/upload_1776634996004_uviykm.webp"\n      },\n      {\n        "title_ar": "شركة باعشن – السعودية (1995–1997)",\n        "title_en": "Baeshen Company – Saudi Arabia (1995–1997)",\n        "role_ar": "مدير المنطقة الشمالية",\n        "role_en": "Northern Region Manager",\n        "desc_ar": "قاد جهود تسويق علامة شاي ربيع، وأسهم في إطلاق وتوسيع انتشار المنتج في السوق السعودي.",\n        "desc_en": "Led the marketing efforts for Rabea Tea brand, contributing to the launch and extensive expansion of the product in the Saudi market.",\n        "image": "/uploads/upload_1776635060394_u8uwk5.jfif"\n      },\n      {\n        "title_ar": "شركة نستله مصر (1998)",\n        "title_en": "Nestle Egypt (1998)",\n        "role_ar": "مدير المبيعات - الإسكندرية",\n        "role_en": "Sales Manager - Alexandria",\n        "desc_ar": "أشرف على توزيع المنتجات الجافة (نسكافيه، نيدو، سيريلاك، شوكولاتة نستله) وعزز انتشار العلامة محليًا.",\n        "desc_en": "Supervised the distribution of dry products (Nescafe, Nido, Cerelac, Nestle chocolate) and enhanced the brand's local presence.",\n        "image": "/uploads/upload_1776635088623_5j5aj6.png"\n      },\n      {\n        "title_ar": "شركة صافولا سايم داربي (1999–2001)",\n        "title_en": "Savola Sime Darby (1999–2001)",\n        "role_ar": "مدير مبيعات القطاع الصناعي",\n        "role_en": "Industrial Sector Sales Manager",\n        "desc_ar": "ركز على توزيع زيت النخيل للصناعات الغذائية وقدم حلولًا صناعية مبتكرة من خلال إعادة تدوير مشتقات الزيت.",\n        "desc_en": "Focused on distributing palm oil to the food industry and introduced innovative industrial solutions by recycling oil derivatives.",\n        "image": "/uploads/upload_1776635112855_q157ia.webp"\n      }\n    ],\n    "entrepreneurshipDesc_ar": "في عام 2002، اتخذ السيد محمد إدريس خطوة جريئة بتأسيس شركة السلام كشركة متخصصة في تجارة وتكرير الزيوت النباتية وتوريد المواد الخام للمصانع الكبرى والمطاعم.",\n    "entrepreneurshipDesc_en": "In 2002, Mr. Mohamed Idris took a bold step by founding Elsalam Company as a specialized entity in trading and refining vegetable oils and supplying raw materials to major factories and restaurants.",\n    "expansionDesc_ar": "توسعت الشركة في توزيع زيت النخيل والشورتنج والمارجرين، وخدمة أكثر من 135 مصنعًا في مصر. وفي عام 2020، تم افتتاح مصنع حديث بدمنهور مزود بأحدث خطوط الإنتاج.",\n    "expansionDesc_en": "The company expanded into distributing palm oil, shortening, and margarine, serving over 135 factories in Egypt. In 2020, a modern factory was inaugurated in Damanhour, equipped with the latest production lines.",\n    "innovationPoints": [\n      {\n        "text_ar": "إدخال الشورتنج في إنتاج الأجبان",\n        "text_en": "Introducing shortening in cheese production"\n      },\n      {\n        "text_ar": "تطوير حلول صناعية لصناعة الأغذية",\n        "text_en": "Developing industrial solutions for the food industry"\n      },\n      {\n        "text_ar": "استثمار مخلفات زيت النخيل في صناعة الصابون",\n        "text_en": "Investing palm oil derivatives in soap manufacturing"\n      },\n      {\n        "text_ar": "تطبيق نظام رقابة جودة صارم في كل مراحل الإنتاج",\n        "text_en": "Implementing strictly monitored quality control across all production stages"\n      }\n    ],\n    "visionDesc_ar": "يهدف إلى الريادة في صناعة الزيوت والدهون الطبيعية في مصر والشرق الأوسط، معتمداً على بناء شراكات استراتيجية طويلة الأمد، دعم الصناعات الصغيرة، والالتزام بالمسؤولية المجتمعية.",\n    "visionDesc_en": "His vision is to lead the vegetable oils and natural fats industry in Egypt and the Middle East, relying on building long-term strategic partnerships, supporting small industries, and committing to social responsibility.",\n    "leadershipPoints": [\n      {\n        "text_ar": "خبرة تتجاوز 30 عامًا في قطاع الأغذية",\n        "text_en": "Over 30 years of experience in the food sector"\n      },\n      {\n        "text_ar": "خلفية قوية في المبيعات الصناعية",\n        "text_en": "Strong background in industrial sales"\n      },\n      {\n        "text_ar": "قدرة على بناء شراكات استراتيجية",\n        "text_en": "Ability to build strategic partnerships"\n      },\n      {\n        "text_ar": "توجه ابتكاري في تطوير المنتجات",\n        "text_en": "Innovative approach to product development"\n      },\n      {\n        "text_ar": "دعم حقيقي للصناعات الصغيرة والمتوسطة",\n        "text_en": "Genuine support for small and medium-sized industries"\n      }\n    ],\n    "image": "/uploads/upload_1777799973239_8vhq9o.png"\n  },\n  "gallery": {\n    "title_ar": "جولة في المصنع",\n    "title_en": "Factory Tour",\n    "subtitle_ar": "نظرة على خطوط الإنتاج ومرافق الجودة",\n    "subtitle_en": "A look at our production lines and quality facilities",\n    "items": [\n      {\n        "title_ar": "خط إنتاج الزيوت الآلي",\n        "title_en": "Automated Oil Production Line",\n        "url": "/uploads/upload_1776643156622_joaqhw.jfif"\n      },\n      {\n        "title_ar": "معامل رقابة الجودة",\n        "title_en": "Quality Control Labs",\n        "url": "/uploads/upload_1776643556377_mlqu6e.jfif"\n      },\n      {\n        "title_ar": "خزانات التخزين",\n        "title_en": "Storage Tanks",\n        "url": "/uploads/upload_1776643692457_kvhcm0.jfif"\n      },\n      {\n        "title_ar": "خط تعبئة العبوات",\n        "title_en": "Bottle Filling Line",\n        "url": "/uploads/upload_1776643846245_gg2zai.jfif"\n      },\n      {\n        "title_ar": "مستودعات الشحن",\n        "title_en": "Shipping Warehouses",\n        "url": "/uploads/upload_1776643951492_u4bpcp.jfif"\n      },\n      {\n        "title_ar": "منطقة استقبال المواد الخام",\n        "title_en": "Raw Material Reception Area",\n        "url": "/uploads/upload_1776644148629_oi3c0v.jfif"\n      },\n      {\n        "title_ar": "غرفة التحكم المركزية",\n        "title_en": "Central Control Room",\n        "url": "/uploads/upload_1776644200524_obw0ri.jfif"\n      },\n      {\n        "title_ar": "خط إنتاج السمن",\n        "title_en": "Ghee Production Line",\n        "url": "/uploads/upload_1776644483092_5m2czr.jfif"\n      }\n    ]\n  },\n  "team": {\n    "badge_ar": "شركاء النجاح",\n    "badge_en": "Partners in Success",\n    "title_ar": "فريق الإدارة العليا",\n    "title_en": "Executive Leadership",\n    "subtitle_ar": "نخبة من الكفاءات المتميزة التي تقود رؤيتنا نحو العالمية، وتضمن أعلى معايير الجودة والتميز في كافة قطاعات الشركة.",\n    "subtitle_en": "Our distinguished leadership driving our global vision and ensuring the highest standards of quality.",\n    "members": [\n      {\n        "name_ar": "ذكى السيد ذكي",\n        "name_en": "Zaki El-Sayed Zaki",\n        "role_ar": "مشرف المبيعات ",\n        "role_en": "Sales Supervisor",\n        "image": "/uploads/upload_1776621029870_2h0jss.jfif"\n      },\n      {\n        "name_ar": "وليد بيومي",\n        "name_en": "Walid Bayoumi ",\n        "role_ar": "مدير المبيعات ",\n        "role_en": "Sales Manager",\n        "image": "/uploads/upload_1776621270095_axlqdh.jfif"\n      },\n      {\n        "name_ar": "منة الله زكريا ",\n        "name_en": "Menat Allah Zakaria",\n        "role_ar": "مديرة الحسابات",\n        "role_en": "Accounts Manager",\n        "image": "/uploads/upload_1776629197489_t4qeu8.jfif"\n      },\n      {\n        "name_ar": "محمد عاطف",\n        "name_en": "Mohamed Atef",\n        "role_ar": "مدير الإنتاج",\n        "role_en": "Production Manager",\n        "image": "/uploads/upload_1776629419135_hu8pen.jfif"\n      },\n      {\n        "name_ar": "محمد الريفي",\n        "name_en": "Mohamed Elrifi",\n        "role_ar": "مدير الجودة",\n        "role_en": "Quality Manager",\n        "image": "/uploads/upload_1776630914066_sad8o6.jfif"\n      }\n    ]\n  }\n}	2026-05-03 09:19:35.128	٣‏/٥‏/٢٠٢٦ ١٢:١٩:٣٥ م
cmoqoh5ue0001rtns7rk2ekk1	contact	{\n  "hero": {\n    "title_ar": "تواصل معنا",\n    "title_en": "Contact Us",\n    "subtitle_ar": "نسعد بالرد على استفساراتكم خلال 24 ساعة عمل",\n    "subtitle_en": "We're happy to respond to your inquiries within 24 business hours",\n    "backgroundImage": "/uploads/upload_1777867615355_1tuqpy.png"\n  },\n  "contactInfo": {\n    "address_ar": "المنطقة الصناعية، المنوفية، مصر",\n    "address_en": "Industrial Zone, Monofia, Egypt",\n    "phone": "+20 1xx xxx xxxx",\n    "email": "info@elsalamoils.com",\n    "workingHours_ar": "السبت – الخميس: 8:00 ص – 5:00 م",\n    "workingHours_en": "Saturday – Thursday: 8:00 AM – 5:00 PM"\n  },\n  "formSettings": {\n    "title_ar": "أرسل رسالتك",\n    "title_en": "Send Your Message",\n    "submitButton_ar": "إرسال الرسالة",\n    "submitButton_en": "Send Message",\n    "successMessage_ar": "تم إرسال رسالتك بنجاح! سنرد عليك خلال 24 ساعة عمل.",\n    "successMessage_en": "Your message has been sent successfully! We'll respond within 24 business hours.",\n    "errorMessage_ar": "حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى.",\n    "errorMessage_en": "An error occurred while sending. Please try again."\n  },\n  "social": {\n    "whatsappLocal": "https://wa.me/201234567890",\n    "whatsappLocalLabel_ar": "واتساب — مبيعات محلية",\n    "whatsappLocalLabel_en": "WhatsApp — Local Sales",\n    "whatsappExport": "https://wa.me/201234567890",\n    "whatsappExportLabel_ar": "واتساب — التصدير",\n    "whatsappExportLabel_en": "WhatsApp — Export",\n    "facebook": "",\n    "instagram": "",\n    "linkedin": ""\n  },\n  "map": {\n    "mapEmbedUrl": "",\n    "lat": "30.5965",\n    "lng": "30.9876"\n  },\n  "branches": {\n    "title_ar": "فروعنا ومكاتبنا",\n    "title_en": "Our Branches & Offices",\n    "items": [\n      {\n        "name_ar": "المصنع الرئيسي",\n        "name_en": "Main Factory",\n        "address_ar": "المنطقة الصناعية، المنوفية، مصر",\n        "address_en": "Industrial Zone, Monofia, Egypt",\n        "phone": "+20 1xx xxx xxxx"\n      },\n      {\n        "name_ar": "مكتب المبيعات — القاهرة",\n        "name_en": "Sales Office — Cairo",\n        "address_ar": "القاهرة، مصر",\n        "address_en": "Cairo, Egypt",\n        "phone": "+20 1xx xxx xxxx"\n      }\n    ]\n  }\n}	2026-05-04 04:06:58.262	٤‏/٥‏/٢٠٢٦ ٧:٠٦:٥٨ ص
cmoqoy8kr0003rtnsqcwqyj8o	contact	{\n  "hero": {\n    "title_ar": "تواصل معنا",\n    "title_en": "Contact Us",\n    "subtitle_ar": "نسعد بالرد على استفساراتكم خلال 24 ساعة عمل",\n    "subtitle_en": "We're happy to respond to your inquiries within 24 business hours",\n    "backgroundImage": "/uploads/upload_1777867615355_1tuqpy.png"\n  },\n  "contactInfo": {\n    "address_ar": "المنطقة الصناعية، المنوفية، مصر",\n    "address_en": "Industrial Zone, Monofia, Egypt",\n    "phone": "+20 1xx xxx xxxx",\n    "email": "info@elsalamoils.com",\n    "workingHours_ar": "السبت – الخميس: 8:00 ص – 5:00 م",\n    "workingHours_en": "Saturday – Thursday: 8:00 AM – 5:00 PM",\n    "branches": [\n      {\n        "name_ar": "الفرع الرئيسي المصنع ",\n        "name_en": "The main factory branch",\n        "address_ar": "البحيرة - دمنهور - الأبعادية - عند مجمع الكليات ",\n        "address_en": "Beheira – Damanhur – Al-Abadiya – near the Colleges Complex",\n        "mapLink": "أبعادية دمنهور، دمنهور،، 2CRH+4GC، أبعادية دمنهور، دمنهور،، محافظة البحيرة 5854960،"\n      },\n      {\n        "name_ar": "",\n        "name_en": "",\n        "address_ar": "",\n        "address_en": "",\n        "mapLink": ""\n      }\n    ]\n  },\n  "formSettings": {\n    "title_ar": "أرسل رسالتك",\n    "title_en": "Send Your Message",\n    "submitButton_ar": "إرسال الرسالة",\n    "submitButton_en": "Send Message",\n    "successMessage_ar": "تم إرسال رسالتك بنجاح! سنرد عليك خلال 24 ساعة عمل.",\n    "successMessage_en": "Your message has been sent successfully! We'll respond within 24 business hours.",\n    "errorMessage_ar": "حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى.",\n    "errorMessage_en": "An error occurred while sending. Please try again."\n  },\n  "social": {\n    "whatsappLocal": "https://wa.me/201234567890",\n    "whatsappLocalLabel_ar": "واتساب — مبيعات محلية",\n    "whatsappLocalLabel_en": "WhatsApp — Local Sales",\n    "whatsappExport": "https://wa.me/201234567890",\n    "whatsappExportLabel_ar": "واتساب — التصدير",\n    "whatsappExportLabel_en": "WhatsApp — Export",\n    "facebook": "",\n    "instagram": "",\n    "linkedin": ""\n  },\n  "map": {\n    "mapEmbedUrl": "",\n    "lat": "30.5965",\n    "lng": "30.9876"\n  },\n  "branches": {\n    "title_ar": "فروعنا ومكاتبنا",\n    "title_en": "Our Branches & Offices",\n    "items": [\n      {\n        "name_ar": "المصنع الرئيسي",\n        "name_en": "Main Factory",\n        "address_ar": "المنطقة الصناعية، المنوفية، مصر",\n        "address_en": "Industrial Zone, Monofia, Egypt",\n        "phone": "+20 1xx xxx xxxx"\n      },\n      {\n        "name_ar": "مكتب المبيعات — القاهرة",\n        "name_en": "Sales Office — Cairo",\n        "address_ar": "القاهرة، مصر",\n        "address_en": "Cairo, Egypt",\n        "phone": "+20 1xx xxx xxxx"\n      }\n    ]\n  }\n}	2026-05-04 04:20:14.955	٤‏/٥‏/٢٠٢٦ ٧:٢٠:١٤ ص
cmoqoyp0b0005rtnsav36bofj	contact	{\n  "hero": {\n    "title_ar": "تواصل معنا",\n    "title_en": "Contact Us",\n    "subtitle_ar": "نسعد بالرد على استفساراتكم خلال 24 ساعة عمل",\n    "subtitle_en": "We're happy to respond to your inquiries within 24 business hours",\n    "backgroundImage": "/uploads/upload_1777867615355_1tuqpy.png"\n  },\n  "contactInfo": {\n    "address_ar": "المنطقة الصناعية، المنوفية، مصر",\n    "address_en": "Industrial Zone, Monofia, Egypt",\n    "phone": "+20 1xx xxx xxxx",\n    "email": "info@elsalamoils.com",\n    "workingHours_ar": "السبت – الخميس: 8:00 ص – 5:00 م",\n    "workingHours_en": "Saturday – Thursday: 8:00 AM – 5:00 PM",\n    "branches": [\n      {\n        "name_ar": "الفرع الرئيسي المصنع ",\n        "name_en": "The main factory branch",\n        "address_ar": "البحيرة - دمنهور - الأبعادية - عند مجمع الكليات ",\n        "address_en": "Beheira – Damanhur – Al-Abadiya – near the Colleges Complex",\n        "mapLink": "https://maps.app.goo.gl/fsWtecuR3ARnj5aV9"\n      },\n      {\n        "name_ar": "",\n        "name_en": "",\n        "address_ar": "",\n        "address_en": "",\n        "mapLink": ""\n      }\n    ]\n  },\n  "formSettings": {\n    "title_ar": "أرسل رسالتك",\n    "title_en": "Send Your Message",\n    "submitButton_ar": "إرسال الرسالة",\n    "submitButton_en": "Send Message",\n    "successMessage_ar": "تم إرسال رسالتك بنجاح! سنرد عليك خلال 24 ساعة عمل.",\n    "successMessage_en": "Your message has been sent successfully! We'll respond within 24 business hours.",\n    "errorMessage_ar": "حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى.",\n    "errorMessage_en": "An error occurred while sending. Please try again."\n  },\n  "social": {\n    "whatsappLocal": "https://wa.me/201234567890",\n    "whatsappLocalLabel_ar": "واتساب — مبيعات محلية",\n    "whatsappLocalLabel_en": "WhatsApp — Local Sales",\n    "whatsappExport": "https://wa.me/201234567890",\n    "whatsappExportLabel_ar": "واتساب — التصدير",\n    "whatsappExportLabel_en": "WhatsApp — Export",\n    "facebook": "",\n    "instagram": "",\n    "linkedin": ""\n  },\n  "map": {\n    "mapEmbedUrl": "",\n    "lat": "30.5965",\n    "lng": "30.9876"\n  },\n  "branches": {\n    "title_ar": "فروعنا ومكاتبنا",\n    "title_en": "Our Branches & Offices",\n    "items": [\n      {\n        "name_ar": "المصنع الرئيسي",\n        "name_en": "Main Factory",\n        "address_ar": "المنطقة الصناعية، المنوفية، مصر",\n        "address_en": "Industrial Zone, Monofia, Egypt",\n        "phone": "+20 1xx xxx xxxx"\n      },\n      {\n        "name_ar": "مكتب المبيعات — القاهرة",\n        "name_en": "Sales Office — Cairo",\n        "address_ar": "القاهرة، مصر",\n        "address_en": "Cairo, Egypt",\n        "phone": "+20 1xx xxx xxxx"\n      }\n    ]\n  }\n}	2026-05-04 04:20:36.251	٤‏/٥‏/٢٠٢٦ ٧:٢٠:٣٦ ص
cmoqp5cl80007rtns1ws98han	contact	{\n  "hero": {\n    "title_ar": "تواصل معنا",\n    "title_en": "Contact Us",\n    "subtitle_ar": "نسعد بالرد على استفساراتكم خلال 24 ساعة عمل",\n    "subtitle_en": "We're happy to respond to your inquiries within 24 business hours",\n    "backgroundImage": "/uploads/upload_1777867615355_1tuqpy.png"\n  },\n  "contactInfo": {\n    "address_ar": "المنطقة الصناعية، المنوفية، مصر",\n    "address_en": "Industrial Zone, Monofia, Egypt",\n    "phone": "+201050051851",\n    "email": "info@elsalamoils.com",\n    "workingHours_ar": "السبت – الخميس: 8:00 ص – 5:00 م",\n    "workingHours_en": "Saturday – Thursday: 8:00 AM – 5:00 PM",\n    "branches": [\n      {\n        "name_ar": "الفرع الرئيسي المصنع ",\n        "name_en": "The main factory branch",\n        "address_ar": "البحيرة - دمنهور - الأبعادية - عند مجمع الكليات ",\n        "address_en": "Beheira – Damanhur – Al-Abadiya – near the Colleges Complex",\n        "mapLink": "https://maps.app.goo.gl/fsWtecuR3ARnj5aV9"\n      },\n      {\n        "name_ar": "",\n        "name_en": "",\n        "address_ar": "",\n        "address_en": "",\n        "mapLink": ""\n      }\n    ]\n  },\n  "formSettings": {\n    "title_ar": "أرسل رسالتك",\n    "title_en": "Send Your Message",\n    "submitButton_ar": "إرسال الرسالة",\n    "submitButton_en": "Send Message",\n    "successMessage_ar": "تم إرسال رسالتك بنجاح! سنرد عليك خلال 24 ساعة عمل.",\n    "successMessage_en": "Your message has been sent successfully! We'll respond within 24 business hours.",\n    "errorMessage_ar": "حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى.",\n    "errorMessage_en": "An error occurred while sending. Please try again."\n  },\n  "social": {\n    "whatsappLocal": "https://wa.me/201234567890",\n    "whatsappLocalLabel_ar": "واتساب — مبيعات محلية",\n    "whatsappLocalLabel_en": "WhatsApp — Local Sales",\n    "whatsappExport": "https://wa.me/201234567890",\n    "whatsappExportLabel_ar": "واتساب — التصدير",\n    "whatsappExportLabel_en": "WhatsApp — Export",\n    "facebook": "",\n    "instagram": "",\n    "linkedin": ""\n  },\n  "map": {\n    "mapEmbedUrl": "",\n    "lat": "30.5965",\n    "lng": "30.9876"\n  },\n  "branches": {\n    "title_ar": "فروعنا ومكاتبنا",\n    "title_en": "Our Branches & Offices",\n    "items": [\n      {\n        "name_ar": "المصنع الرئيسي",\n        "name_en": "Main Factory",\n        "address_ar": "المنطقة الصناعية، المنوفية، مصر",\n        "address_en": "Industrial Zone, Monofia, Egypt",\n        "phone": "+20 1xx xxx xxxx"\n      },\n      {\n        "name_ar": "مكتب المبيعات — القاهرة",\n        "name_en": "Sales Office — Cairo",\n        "address_ar": "القاهرة، مصر",\n        "address_en": "Cairo, Egypt",\n        "phone": "+20 1xx xxx xxxx"\n      }\n    ]\n  }\n}	2026-05-04 04:25:46.749	٤‏/٥‏/٢٠٢٦ ٧:٢٥:٤٦ ص
cmoqp63o70009rtnsipc2p016	contact	{\n  "hero": {\n    "title_ar": "تواصل معنا",\n    "title_en": "Contact Us",\n    "subtitle_ar": "نسعد بالرد على استفساراتكم خلال 24 ساعة عمل",\n    "subtitle_en": "We're happy to respond to your inquiries within 24 business hours",\n    "backgroundImage": "/uploads/upload_1777867615355_1tuqpy.png"\n  },\n  "contactInfo": {\n    "address_ar": "المنطقة الصناعية، المنوفية، مصر",\n    "address_en": "Industrial Zone, Monofia, Egypt",\n    "phone": "+201050051851",\n    "email": "info@elsalamoils.com",\n    "workingHours_ar": "السبت – الخميس: 8:00 ص – 5:00 م",\n    "workingHours_en": "Saturday – Thursday: 8:00 AM – 5:00 PM",\n    "branches": [\n      {\n        "name_ar": "الفرع الرئيسي المصنع ",\n        "name_en": "The main factory branch",\n        "address_ar": "البحيرة - دمنهور - الأبعادية - عند مجمع الكليات ",\n        "address_en": "Beheira – Damanhur – Al-Abadiya – near the Colleges Complex",\n        "mapLink": "https://maps.app.goo.gl/fsWtecuR3ARnj5aV9"\n      },\n      {\n        "name_ar": "",\n        "name_en": "",\n        "address_ar": "",\n        "address_en": "",\n        "mapLink": ""\n      }\n    ]\n  },\n  "formSettings": {\n    "title_ar": "أرسل رسالتك",\n    "title_en": "Send Your Message",\n    "submitButton_ar": "إرسال الرسالة",\n    "submitButton_en": "Send Message",\n    "successMessage_ar": "تم إرسال رسالتك بنجاح! سنرد عليك خلال 24 ساعة عمل.",\n    "successMessage_en": "Your message has been sent successfully! We'll respond within 24 business hours.",\n    "errorMessage_ar": "حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى.",\n    "errorMessage_en": "An error occurred while sending. Please try again."\n  },\n  "social": {\n    "whatsappLocal": "https://wa.me/201234567890",\n    "whatsappLocalLabel_ar": "واتساب — مبيعات محلية",\n    "whatsappLocalLabel_en": "WhatsApp — Local Sales",\n    "whatsappExport": "https://wa.me/201234567890",\n    "whatsappExportLabel_ar": "واتساب — التصدير",\n    "whatsappExportLabel_en": "WhatsApp — Export",\n    "facebook": "",\n    "instagram": "",\n    "linkedin": ""\n  },\n  "map": {\n    "mapEmbedUrl": "https://maps.app.goo.gl/fsWtecuR3ARnj5aV9",\n    "lat": "30.5965",\n    "lng": "30.9876"\n  },\n  "branches": {\n    "title_ar": "فروعنا ومكاتبنا",\n    "title_en": "Our Branches & Offices",\n    "items": [\n      {\n        "name_ar": "المصنع الرئيسي",\n        "name_en": "Main Factory",\n        "address_ar": "المنطقة الصناعية، المنوفية، مصر",\n        "address_en": "Industrial Zone, Monofia, Egypt",\n        "phone": "+20 1xx xxx xxxx"\n      },\n      {\n        "name_ar": "مكتب المبيعات — القاهرة",\n        "name_en": "Sales Office — Cairo",\n        "address_ar": "القاهرة، مصر",\n        "address_en": "Cairo, Egypt",\n        "phone": "+20 1xx xxx xxxx"\n      }\n    ]\n  }\n}	2026-05-04 04:26:21.847	٤‏/٥‏/٢٠٢٦ ٧:٢٦:٢١ ص
cmoqp6k47000brtnshfvlwpju	contact	{\n  "hero": {\n    "title_ar": "تواصل معنا",\n    "title_en": "Contact Us",\n    "subtitle_ar": "نسعد بالرد على استفساراتكم خلال 24 ساعة عمل",\n    "subtitle_en": "We're happy to respond to your inquiries within 24 business hours",\n    "backgroundImage": "/uploads/upload_1777867615355_1tuqpy.png"\n  },\n  "contactInfo": {\n    "address_ar": "المنطقة الصناعية، المنوفية، مصر",\n    "address_en": "Industrial Zone, Monofia, Egypt",\n    "phone": "+201050051851",\n    "email": "info@elsalamoils.com",\n    "workingHours_ar": "السبت – الخميس: 8:00 ص – 5:00 م",\n    "workingHours_en": "Saturday – Thursday: 8:00 AM – 5:00 PM",\n    "branches": [\n      {\n        "name_ar": "الفرع الرئيسي المصنع ",\n        "name_en": "The main factory branch",\n        "address_ar": "البحيرة - دمنهور - الأبعادية - عند مجمع الكليات ",\n        "address_en": "Beheira – Damanhur – Al-Abadiya – near the Colleges Complex",\n        "mapLink": "https://maps.app.goo.gl/fsWtecuR3ARnj5aV9"\n      },\n      {\n        "name_ar": "",\n        "name_en": "",\n        "address_ar": "",\n        "address_en": "",\n        "mapLink": ""\n      }\n    ]\n  },\n  "formSettings": {\n    "title_ar": "أرسل رسالتك",\n    "title_en": "Send Your Message",\n    "submitButton_ar": "إرسال الرسالة",\n    "submitButton_en": "Send Message",\n    "successMessage_ar": "تم إرسال رسالتك بنجاح! سنرد عليك خلال 24 ساعة عمل.",\n    "successMessage_en": "Your message has been sent successfully! We'll respond within 24 business hours.",\n    "errorMessage_ar": "حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى.",\n    "errorMessage_en": "An error occurred while sending. Please try again."\n  },\n  "social": {\n    "whatsappLocal": "https://wa.me/201234567890",\n    "whatsappLocalLabel_ar": "واتساب — مبيعات محلية",\n    "whatsappLocalLabel_en": "WhatsApp — Local Sales",\n    "whatsappExport": "https://wa.me/201234567890",\n    "whatsappExportLabel_ar": "واتساب — التصدير",\n    "whatsappExportLabel_en": "WhatsApp — Export",\n    "facebook": "",\n    "instagram": "",\n    "linkedin": ""\n  },\n  "map": {\n    "mapEmbedUrl": "https://maps.app.goo.gl/fsWtecuR3ARnj5aV9",\n    "lat": "",\n    "lng": ""\n  },\n  "branches": {\n    "title_ar": "فروعنا ومكاتبنا",\n    "title_en": "Our Branches & Offices",\n    "items": [\n      {\n        "name_ar": "المصنع الرئيسي",\n        "name_en": "Main Factory",\n        "address_ar": "المنطقة الصناعية، المنوفية، مصر",\n        "address_en": "Industrial Zone, Monofia, Egypt",\n        "phone": "+20 1xx xxx xxxx"\n      },\n      {\n        "name_ar": "مكتب المبيعات — القاهرة",\n        "name_en": "Sales Office — Cairo",\n        "address_ar": "القاهرة، مصر",\n        "address_en": "Cairo, Egypt",\n        "phone": "+20 1xx xxx xxxx"\n      }\n    ]\n  }\n}	2026-05-04 04:26:43.16	٤‏/٥‏/٢٠٢٦ ٧:٢٦:٤٣ ص
cmoqpj4wp000drtnsz4gom8v3	contact	{\n  "hero": {\n    "title_ar": "تواصل معنا",\n    "title_en": "Contact Us",\n    "subtitle_ar": "نسعد بالرد على استفساراتكم خلال 24 ساعة عمل",\n    "subtitle_en": "We're happy to respond to your inquiries within 24 business hours",\n    "backgroundImage": "/uploads/upload_1777867615355_1tuqpy.png"\n  },\n  "contactInfo": {\n    "address_ar": "البحيرة - دمنهور - الأبعادية - عند مجمع الكليات ",\n    "address_en": "Beheira – Damanhur – Al-Abadiya – near the Colleges Complex",\n    "phone": "+201050051851",\n    "email": "info@elsalamoils.com",\n    "workingHours_ar": "السبت – الخميس: 8:00 ص – 5:00 م",\n    "workingHours_en": "Saturday – Thursday: 8:00 AM – 5:00 PM",\n    "branches": [\n      {\n        "name_ar": "الفرع الرئيسي المصنع ",\n        "name_en": "The main factory branch",\n        "address_ar": "البحيرة - دمنهور - الأبعادية - عند مجمع الكليات ",\n        "address_en": "Beheira – Damanhur – Al-Abadiya – near the Colleges Complex",\n        "mapLink": "https://maps.app.goo.gl/fsWtecuR3ARnj5aV9"\n      },\n      {\n        "name_ar": "",\n        "name_en": "",\n        "address_ar": "",\n        "address_en": "",\n        "mapLink": ""\n      }\n    ]\n  },\n  "formSettings": {\n    "title_ar": "أرسل رسالتك",\n    "title_en": "Send Your Message",\n    "submitButton_ar": "إرسال الرسالة",\n    "submitButton_en": "Send Message",\n    "successMessage_ar": "تم إرسال رسالتك بنجاح! سنرد عليك خلال 24 ساعة عمل.",\n    "successMessage_en": "Your message has been sent successfully! We'll respond within 24 business hours.",\n    "errorMessage_ar": "حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى.",\n    "errorMessage_en": "An error occurred while sending. Please try again."\n  },\n  "social": {\n    "whatsappLocal": "https://wa.me/201234567890",\n    "whatsappLocalLabel_ar": "واتساب — مبيعات محلية",\n    "whatsappLocalLabel_en": "WhatsApp — Local Sales",\n    "whatsappExport": "https://wa.me/201234567890",\n    "whatsappExportLabel_ar": "واتساب — التصدير",\n    "whatsappExportLabel_en": "WhatsApp — Export",\n    "facebook": "",\n    "instagram": "",\n    "linkedin": ""\n  },\n  "map": {\n    "mapEmbedUrl": "https://maps.app.goo.gl/fsWtecuR3ARnj5aV9",\n    "lat": "",\n    "lng": ""\n  },\n  "branches": {\n    "title_ar": "فروعنا ومكاتبنا",\n    "title_en": "Our Branches & Offices",\n    "items": [\n      {\n        "name_ar": "المصنع الرئيسي",\n        "name_en": "Main Factory",\n        "address_ar": "المنطقة الصناعية، المنوفية، مصر",\n        "address_en": "Industrial Zone, Monofia, Egypt",\n        "phone": "+20 1xx xxx xxxx"\n      },\n      {\n        "name_ar": "مكتب المبيعات — القاهرة",\n        "name_en": "Sales Office — Cairo",\n        "address_ar": "القاهرة، مصر",\n        "address_en": "Cairo, Egypt",\n        "phone": "+20 1xx xxx xxxx"\n      }\n    ]\n  }\n}	2026-05-04 04:36:29.978	٤‏/٥‏/٢٠٢٦ ٧:٣٦:٢٩ ص
cmoqpkkv7000frtnsuw2c5g02	contact	{\n  "hero": {\n    "title_ar": "تواصل معنا",\n    "title_en": "Contact Us",\n    "subtitle_ar": "نسعد بالرد على استفساراتكم خلال 24 ساعة عمل",\n    "subtitle_en": "We're happy to respond to your inquiries within 24 business hours",\n    "backgroundImage": "/uploads/upload_1777867615355_1tuqpy.png"\n  },\n  "contactInfo": {\n    "address_ar": "البحيرة - دمنهور - الأبعادية - عند مجمع الكليات ",\n    "address_en": "Beheira – Damanhur – Al-Abadiya – near the Colleges Complex",\n    "phone": "+201050051851",\n    "email": "info@elsalamoils.com",\n    "workingHours_ar": "السبت – الخميس: 8:00 ص – 5:00 م",\n    "workingHours_en": "Saturday – Thursday: 8:00 AM – 5:00 PM",\n    "branches": [\n      {\n        "name_ar": "الفرع الرئيسي المصنع ",\n        "name_en": "The main factory branch",\n        "address_ar": "البحيرة - دمنهور - الأبعادية - عند مجمع الكليات ",\n        "address_en": "Beheira – Damanhur – Al-Abadiya – near the Colleges Complex",\n        "mapLink": "https://maps.app.goo.gl/fsWtecuR3ARnj5aV9"\n      },\n      {\n        "name_ar": "",\n        "name_en": "",\n        "address_ar": "",\n        "address_en": "",\n        "mapLink": ""\n      }\n    ]\n  },\n  "formSettings": {\n    "title_ar": "أرسل رسالتك",\n    "title_en": "Send Your Message",\n    "submitButton_ar": "إرسال الرسالة",\n    "submitButton_en": "Send Message",\n    "successMessage_ar": "تم إرسال رسالتك بنجاح! سنرد عليك خلال 24 ساعة عمل.",\n    "successMessage_en": "Your message has been sent successfully! We'll respond within 24 business hours.",\n    "errorMessage_ar": "حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى.",\n    "errorMessage_en": "An error occurred while sending. Please try again."\n  },\n  "social": {\n    "whatsappLocal": "https://wa.me/201234567890",\n    "whatsappLocalLabel_ar": "واتساب — مبيعات محلية",\n    "whatsappLocalLabel_en": "WhatsApp — Local Sales",\n    "whatsappExport": "https://wa.me/201234567890",\n    "whatsappExportLabel_ar": "واتساب — التصدير",\n    "whatsappExportLabel_en": "WhatsApp — Export",\n    "facebook": "https://www.facebook.com/profile.php?id=61573886707769",\n    "instagram": "",\n    "linkedin": ""\n  },\n  "map": {\n    "mapEmbedUrl": "https://maps.app.goo.gl/fsWtecuR3ARnj5aV9",\n    "lat": "",\n    "lng": ""\n  },\n  "branches": {\n    "title_ar": "فروعنا ومكاتبنا",\n    "title_en": "Our Branches & Offices",\n    "items": [\n      {\n        "name_ar": "المصنع الرئيسي",\n        "name_en": "Main Factory",\n        "address_ar": "المنطقة الصناعية، المنوفية، مصر",\n        "address_en": "Industrial Zone, Monofia, Egypt",\n        "phone": "+20 1xx xxx xxxx"\n      },\n      {\n        "name_ar": "مكتب المبيعات — القاهرة",\n        "name_en": "Sales Office — Cairo",\n        "address_ar": "القاهرة، مصر",\n        "address_en": "Cairo, Egypt",\n        "phone": "+20 1xx xxx xxxx"\n      }\n    ]\n  }\n}	2026-05-04 04:37:37.316	٤‏/٥‏/٢٠٢٦ ٧:٣٧:٣٧ ص
cmoqpl99q000hrtnsmqvhuf5a	contact	{\n  "hero": {\n    "title_ar": "تواصل معنا",\n    "title_en": "Contact Us",\n    "subtitle_ar": "نسعد بالرد على استفساراتكم خلال 24 ساعة عمل",\n    "subtitle_en": "We're happy to respond to your inquiries within 24 business hours",\n    "backgroundImage": "/uploads/upload_1777867615355_1tuqpy.png"\n  },\n  "contactInfo": {\n    "address_ar": "البحيرة - دمنهور - الأبعادية - عند مجمع الكليات ",\n    "address_en": "Beheira – Damanhur – Al-Abadiya – near the Colleges Complex",\n    "phone": "+201050051851",\n    "email": "info@elsalamoils.com",\n    "workingHours_ar": "السبت – الخميس: 8:00 ص – 5:00 م",\n    "workingHours_en": "Saturday – Thursday: 8:00 AM – 5:00 PM",\n    "branches": [\n      {\n        "name_ar": "الفرع الرئيسي المصنع ",\n        "name_en": "The main factory branch",\n        "address_ar": "البحيرة - دمنهور - الأبعادية - عند مجمع الكليات ",\n        "address_en": "Beheira – Damanhur – Al-Abadiya – near the Colleges Complex",\n        "mapLink": "https://maps.app.goo.gl/fsWtecuR3ARnj5aV9"\n      },\n      {\n        "name_ar": "",\n        "name_en": "",\n        "address_ar": "",\n        "address_en": "",\n        "mapLink": ""\n      }\n    ]\n  },\n  "formSettings": {\n    "title_ar": "أرسل رسالتك",\n    "title_en": "Send Your Message",\n    "submitButton_ar": "إرسال الرسالة",\n    "submitButton_en": "Send Message",\n    "successMessage_ar": "تم إرسال رسالتك بنجاح! سنرد عليك خلال 24 ساعة عمل.",\n    "successMessage_en": "Your message has been sent successfully! We'll respond within 24 business hours.",\n    "errorMessage_ar": "حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى.",\n    "errorMessage_en": "An error occurred while sending. Please try again."\n  },\n  "social": {\n    "whatsappLocal": "https://wa.me/201234567890",\n    "whatsappLocalLabel_ar": "واتساب — مبيعات محلية",\n    "whatsappLocalLabel_en": "WhatsApp — Local Sales",\n    "whatsappExport": "https://wa.me/201234567890",\n    "whatsappExportLabel_ar": "واتساب — التصدير",\n    "whatsappExportLabel_en": "WhatsApp — Export",\n    "facebook": "https://www.facebook.com/profile.php?id=61573886707769",\n    "instagram": "",\n    "linkedin": ""\n  },\n  "map": {\n    "mapEmbedUrl": "https://maps.app.goo.gl/fsWtecuR3ARnj5aV9",\n    "lat": "",\n    "lng": ""\n  },\n  "branches": {\n    "title_ar": "فروعنا ومكاتبنا",\n    "title_en": "Our Branches & Offices",\n    "items": [\n      {\n        "name_ar": "المصنع الرئيسي",\n        "name_en": "Main Factory",\n        "address_ar": "المنطقة الصناعية، المنوفية، مصر",\n        "address_en": "Industrial Zone, Monofia, Egypt",\n        "phone": "+20 1xx xxx xxxx"\n      },\n      {\n        "name_ar": "مكتب المبيعات — القاهرة",\n        "name_en": "Sales Office — Cairo",\n        "address_ar": "القاهرة، مصر",\n        "address_en": "Cairo, Egypt",\n        "phone": "+20 1xx xxx xxxx"\n      }\n    ]\n  }\n}	2026-05-04 04:38:08.943	٤‏/٥‏/٢٠٢٦ ٧:٣٨:٠٨ ص
cmoqq0i61000jrtnsoayy9hhc	contact	{\n  "hero": {\n    "title_ar": "تواصل معنا",\n    "title_en": "Contact Us",\n    "subtitle_ar": "نسعد بالرد على استفساراتكم خلال 24 ساعة عمل",\n    "subtitle_en": "We're happy to respond to your inquiries within 24 business hours",\n    "backgroundImage": "/uploads/upload_1777867615355_1tuqpy.png"\n  },\n  "contactInfo": {\n    "address_ar": "البحيرة - دمنهور - الأبعادية - عند مجمع الكليات ",\n    "address_en": "Beheira – Damanhur – Al-Abadiya – near the Colleges Complex",\n    "phone": "+201050051851",\n    "email": "info@elsalamoils.com",\n    "workingHours_ar": "السبت – الخميس: 8:00 ص – 5:00 م",\n    "workingHours_en": "Saturday – Thursday: 8:00 AM – 5:00 PM",\n    "branches": [\n      {\n        "name_ar": "الفرع الرئيسي المصنع ",\n        "name_en": "The main factory branch",\n        "address_ar": "البحيرة - دمنهور - الأبعادية - عند مجمع الكليات ",\n        "address_en": "Beheira – Damanhur – Al-Abadiya – near the Colleges Complex",\n        "mapLink": "https://maps.app.goo.gl/fsWtecuR3ARnj5aV9"\n      },\n      {\n        "name_ar": "",\n        "name_en": "",\n        "address_ar": "",\n        "address_en": "",\n        "mapLink": ""\n      }\n    ]\n  },\n  "formSettings": {\n    "title_ar": "أرسل رسالتك",\n    "title_en": "Send Your Message",\n    "submitButton_ar": "إرسال الرسالة",\n    "submitButton_en": "Send Message",\n    "successMessage_ar": "تم إرسال رسالتك بنجاح! سنرد عليك خلال 24 ساعة عمل.",\n    "successMessage_en": "Your message has been sent successfully! We'll respond within 24 business hours.",\n    "errorMessage_ar": "حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى.",\n    "errorMessage_en": "An error occurred while sending. Please try again."\n  },\n  "social": {\n    "whatsappLocal": "https://wa.me/201234567890",\n    "whatsappLocalLabel_ar": "واتساب — مبيعات محلية",\n    "whatsappLocalLabel_en": "WhatsApp — Local Sales",\n    "whatsappExport": "https://wa.me/201234567890",\n    "whatsappExportLabel_ar": "واتساب — التصدير",\n    "whatsappExportLabel_en": "WhatsApp — Export",\n    "facebook": "https://www.facebook.com/profile.php?id=61573886707769",\n    "instagram": "",\n    "linkedin": ""\n  },\n  "map": {\n    "mapEmbedUrl": "https://maps.app.goo.gl/fsWtecuR3ARnj5aV9",\n    "lat": "",\n    "lng": ""\n  },\n  "branches": {\n    "title_ar": "فروعنا ومكاتبنا",\n    "title_en": "Our Branches & Offices",\n    "items": [\n      {\n        "name_ar": "المصنع الرئيسي",\n        "name_en": "Main Factory",\n        "address_ar": "المنطقة الصناعية، المنوفية، مصر",\n        "address_en": "Industrial Zone, Monofia, Egypt",\n        "phone": "+20 1xx xxx xxxx"\n      },\n      {\n        "name_ar": "مكتب المبيعات — القاهرة",\n        "name_en": "Sales Office — Cairo",\n        "address_ar": "القاهرة، مصر",\n        "address_en": "Cairo, Egypt",\n        "phone": "+20 1xx xxx xxxx"\n      }\n    ]\n  }\n}	2026-05-04 04:50:00.314	٤‏/٥‏/٢٠٢٦ ٧:٥٠:٠٠ ص
cmoqq4jda000lrtnsyoondr3j	contact	{\n  "hero": {\n    "title_ar": "تواصل معنا",\n    "title_en": "Contact Us",\n    "subtitle_ar": "نسعد بالرد على استفساراتكم خلال 24 ساعة عمل",\n    "subtitle_en": "We're happy to respond to your inquiries within 24 business hours",\n    "backgroundImage": "/uploads/upload_1777867615355_1tuqpy.png"\n  },\n  "contactInfo": {\n    "address_ar": "البحيرة - دمنهور - الأبعادية - عند مجمع الكليات ",\n    "address_en": "Beheira – Damanhur – Al-Abadiya – near the Colleges Complex",\n    "phone": "+201050051851",\n    "email": "info@elsalamoils.com",\n    "workingHours_ar": "السبت – الخميس: 8:00 ص – 5:00 م",\n    "workingHours_en": "Saturday – Thursday: 8:00 AM – 5:00 PM",\n    "branches": [\n      {\n        "name_ar": "الفرع الرئيسي المصنع ",\n        "name_en": "The main factory branch",\n        "address_ar": "البحيرة - دمنهور - الأبعادية - عند مجمع الكليات ",\n        "address_en": "Beheira – Damanhur – Al-Abadiya – near the Colleges Complex",\n        "mapLink": "https://maps.app.goo.gl/fsWtecuR3ARnj5aV9"\n      },\n      {\n        "name_ar": "",\n        "name_en": "",\n        "address_ar": "",\n        "address_en": "",\n        "mapLink": ""\n      }\n    ]\n  },\n  "formSettings": {\n    "title_ar": "أرسل رسالتك",\n    "title_en": "Send Your Message",\n    "submitButton_ar": "إرسال الرسالة",\n    "submitButton_en": "Send Message",\n    "successMessage_ar": "تم إرسال رسالتك بنجاح! سنرد عليك خلال 24 ساعة عمل.",\n    "successMessage_en": "Your message has been sent successfully! We'll respond within 24 business hours.",\n    "errorMessage_ar": "حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى.",\n    "errorMessage_en": "An error occurred while sending. Please try again."\n  },\n  "social": {\n    "whatsappLocal": "https://wa.me/201234567890",\n    "whatsappLocalLabel_ar": "واتساب — مبيعات محلية",\n    "whatsappLocalLabel_en": "WhatsApp — Local Sales",\n    "whatsappExport": "https://wa.me/201234567890",\n    "whatsappExportLabel_ar": "واتساب — التصدير",\n    "whatsappExportLabel_en": "WhatsApp — Export",\n    "facebook": "https://www.facebook.com/profile.php?id=61573886707769",\n    "instagram": "",\n    "linkedin": ""\n  },\n  "map": {\n    "mapEmbedUrl": "https://maps.app.goo.gl/fsWtecuR3ARnj5aV9",\n    "lat": "",\n    "lng": ""\n  },\n  "branches": {\n    "title_ar": "فروعنا ومكاتبنا",\n    "title_en": "Our Branches & Offices",\n    "items": [\n      {\n        "name_ar": "المصنع الرئيسي",\n        "name_en": "Main Factory",\n        "address_ar": "البحيرة - دمنهور - الأبعادية - عند مجمع الكليات ",\n        "address_en": "Beheira – Damanhur – Al-Abadiya – near the Colleges Complex",\n        "phone": "+201050051851"\n      },\n      {\n        "name_ar": "فرع كفر الدوار ",\n        "name_en": "Kafr El-Dawar branch",\n        "address_ar": "البحيرة - كفر الدوار - منشأة الأوقاف - أرض العمدة - 1 شارع والي",\n        "address_en": "Beheira – Kafr El-Dawar – Mansha’at Al-Awqaf – Ard El-Omda – 1 Wali Street",\n        "phone": "+201222455205",\n        "mapLink": "https://maps.app.goo.gl/MKoK2BWMNLXMDeWq8"\n      }\n    ]\n  }\n}	2026-05-04 04:53:08.494	٤‏/٥‏/٢٠٢٦ ٧:٥٣:٠٨ ص
cmoqq7pnr000nrtnsd0g3rvxt	contact	{\n  "hero": {\n    "title_ar": "تواصل معنا",\n    "title_en": "Contact Us",\n    "subtitle_ar": "نسعد بالرد على استفساراتكم خلال 24 ساعة عمل",\n    "subtitle_en": "We're happy to respond to your inquiries within 24 business hours",\n    "backgroundImage": "/uploads/upload_1777867615355_1tuqpy.png"\n  },\n  "contactInfo": {\n    "address_ar": "البحيرة - دمنهور - الأبعادية - عند مجمع الكليات ",\n    "address_en": "Beheira – Damanhur – Al-Abadiya – near the Colleges Complex",\n    "phone": "+201050051851",\n    "email": "info@elsalamoils.com",\n    "workingHours_ar": "السبت – الخميس: 8:00 ص – 5:00 م",\n    "workingHours_en": "Saturday – Thursday: 8:00 AM – 5:00 PM",\n    "branches": [\n      {\n        "name_ar": "الفرع الرئيسي المصنع ",\n        "name_en": "The main factory branch",\n        "address_ar": "البحيرة - دمنهور - الأبعادية - عند مجمع الكليات ",\n        "address_en": "Beheira – Damanhur – Al-Abadiya – near the Colleges Complex",\n        "mapLink": "https://maps.app.goo.gl/fsWtecuR3ARnj5aV9"\n      },\n      {\n        "name_ar": "",\n        "name_en": "",\n        "address_ar": "",\n        "address_en": "",\n        "mapLink": ""\n      }\n    ]\n  },\n  "formSettings": {\n    "title_ar": "أرسل رسالتك",\n    "title_en": "Send Your Message",\n    "submitButton_ar": "إرسال الرسالة",\n    "submitButton_en": "Send Message",\n    "successMessage_ar": "تم إرسال رسالتك بنجاح! سنرد عليك خلال 24 ساعة عمل.",\n    "successMessage_en": "Your message has been sent successfully! We'll respond within 24 business hours.",\n    "errorMessage_ar": "حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى.",\n    "errorMessage_en": "An error occurred while sending. Please try again."\n  },\n  "social": {\n    "whatsappLocal": "https://wa.me/201234567890",\n    "whatsappLocalLabel_ar": "واتساب — مبيعات محلية",\n    "whatsappLocalLabel_en": "WhatsApp — Local Sales",\n    "whatsappExport": "https://wa.me/201234567890",\n    "whatsappExportLabel_ar": "واتساب — التصدير",\n    "whatsappExportLabel_en": "WhatsApp — Export",\n    "facebook": "https://www.facebook.com/profile.php?id=61573886707769",\n    "instagram": "",\n    "linkedin": ""\n  },\n  "map": {\n    "mapEmbedUrl": "https://maps.app.goo.gl/fsWtecuR3ARnj5aV9",\n    "lat": "",\n    "lng": ""\n  },\n  "branches": {\n    "title_ar": "فروعنا ومكاتبنا",\n    "title_en": "Our Branches & Offices",\n    "items": [\n      {\n        "name_ar": "المصنع الرئيسي",\n        "name_en": "Main Factory",\n        "address_ar": "البحيرة - دمنهور - الأبعادية - عند مجمع الكليات ",\n        "address_en": "Beheira – Damanhur – Al-Abadiya – near the Colleges Complex",\n        "phone": "+201050051851"\n      },\n      {\n        "name_ar": "فرع كفر الدوار ",\n        "name_en": "Kafr El-Dawar branch",\n        "address_ar": "البحيرة - كفر الدوار - منشأة الأوقاف - أرض العمدة - 1 شارع والي",\n        "address_en": "Beheira – Kafr El-Dawar – Mansha’at Al-Awqaf – Ard El-Omda – 1 Wali Street ",\n        "phone": "+201222455205",\n        "mapLink": "https://maps.app.goo.gl/MKoK2BWMNLXMDeWq8"\n      }\n    ]\n  }\n}	2026-05-04 04:55:36.615	٤‏/٥‏/٢٠٢٦ ٧:٥٥:٣٦ ص
cmoqqx83m000prtnsi7hz2y04	contact	{\n  "hero": {\n    "title_ar": "تواصل معنا",\n    "title_en": "Contact Us",\n    "subtitle_ar": "نسعد بالرد على استفساراتكم خلال 24 ساعة عمل",\n    "subtitle_en": "We're happy to respond to your inquiries within 24 business hours",\n    "backgroundImage": "/uploads/upload_1777867615355_1tuqpy.png"\n  },\n  "contactInfo": {\n    "address_ar": "البحيرة - دمنهور - الأبعادية - عند مجمع الكليات ",\n    "address_en": "Beheira – Damanhur – Al-Abadiya – near the Colleges Complex",\n    "phone": "+201050051851",\n    "email": "info@elsalamoils.com",\n    "workingHours_ar": "السبت – الخميس: 8:00 ص – 5:00 م",\n    "workingHours_en": "Saturday – Thursday: 8:00 AM – 5:00 PM",\n    "branches": [\n      {\n        "name_ar": "الفرع الرئيسي المصنع ",\n        "name_en": "The main factory branch",\n        "address_ar": "البحيرة - دمنهور - الأبعادية - عند مجمع الكليات ",\n        "address_en": "Beheira – Damanhur – Al-Abadiya – near the Colleges Complex",\n        "mapLink": "https://maps.app.goo.gl/fsWtecuR3ARnj5aV9"\n      },\n      {\n        "name_ar": "",\n        "name_en": "",\n        "address_ar": "",\n        "address_en": "",\n        "mapLink": ""\n      }\n    ]\n  },\n  "formSettings": {\n    "title_ar": "أرسل رسالتك",\n    "title_en": "Send Your Message",\n    "submitButton_ar": "إرسال الرسالة",\n    "submitButton_en": "Send Message",\n    "successMessage_ar": "تم إرسال رسالتك بنجاح! سنرد عليك خلال 24 ساعة عمل.",\n    "successMessage_en": "Your message has been sent successfully! We'll respond within 24 business hours.",\n    "errorMessage_ar": "حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى.",\n    "errorMessage_en": "An error occurred while sending. Please try again."\n  },\n  "social": {\n    "whatsappLocal": "https://wa.me/201234567890",\n    "whatsappLocalLabel_ar": "واتساب — مبيعات محلية",\n    "whatsappLocalLabel_en": "WhatsApp — Local Sales",\n    "whatsappExport": "https://wa.me/201234567890",\n    "whatsappExportLabel_ar": "واتساب — التصدير",\n    "whatsappExportLabel_en": "WhatsApp — Export",\n    "facebook": "https://www.facebook.com/profile.php?id=61573886707769 ",\n    "instagram": "",\n    "linkedin": ""\n  },\n  "map": {\n    "mapEmbedUrl": "https://maps.app.goo.gl/fsWtecuR3ARnj5aV9",\n    "lat": "",\n    "lng": ""\n  },\n  "branches": {\n    "title_ar": "فروعنا ومكاتبنا",\n    "title_en": "Our Branches & Offices",\n    "items": [\n      {\n        "name_ar": "المصنع الرئيسي",\n        "name_en": "Main Factory",\n        "address_ar": "البحيرة - دمنهور - الأبعادية - عند مجمع الكليات ",\n        "address_en": "Beheira – Damanhur – Al-Abadiya – near the Colleges Complex",\n        "phone": "+201050051851"\n      },\n      {\n        "name_ar": "فرع كفر الدوار ",\n        "name_en": "Kafr El-Dawar branch",\n        "address_ar": "البحيرة - كفر الدوار - منشأة الأوقاف - أرض العمدة - 1 شارع والي",\n        "address_en": "Beheira – Kafr El-Dawar – Mansha’at Al-Awqaf – Ard El-Omda – 1 Wali Street ",\n        "phone": "+201222455205",\n        "mapLink": "https://maps.app.goo.gl/MKoK2BWMNLXMDeWq8"\n      }\n    ]\n  }\n}	2026-05-04 05:15:26.914	٤‏/٥‏/٢٠٢٦ ٨:١٥:٢٦ ص
\.


--
-- Data for Name: Product; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Product" (id, slug, name_ar, name_en, short_description_ar, short_description_en, description_ar, description_en, long_description_ar, long_description_en, featured_image, price, price_unit_ar, price_unit_en, is_exportable, is_featured, icon, gradient_from, gradient_to, "categoryId", "activePromotionId", pdf_datasheet, meta_title, meta_description, "createdAt", "updatedAt", stock) FROM stdin;
8	olein-oil-jerry-can-18-kg	جركن زيت أولين مكرر 18 كيلو 	Olein Oil Jerry Can – 18 KG	زيت أولين نقي عالي الأداء للقلي العميق، بثبات ممتاز وطعم خفيف.	Premium olein oil with high frying performance, excellent stability, and neutral taste.	يُعد زيت الأولين من الزيوت النباتية المكررة بعناية باستخدام أحدث تقنيات العصر والتكرير، مما يمنحه نقاءً عالياً وخالياً من الشوائب. يتميز هذا الزيت بنسبة عالية من الأحماض الدهنية غير المشبعة، ما يساعد على تحسين جودة الطعام المقلي والحفاظ على الطعم الأصلي دون امتصاص زائد للزيت.\n\nيتميز بثباته عند درجات الحرارة المرتفعة، مما يقلل من تكوّن الرغوة والدخان أثناء القلي، ويطيل عمر الاستخدام، وبالتالي يقلل من تكلفة التشغيل للمطاعم والمطابخ الصناعية.	Olein oil is a carefully refined vegetable oil processed advanced extraction and refining technologies to ensure maximum purity and clarity. It contains a high level of unsaturated fatty acids, which helps maintain food quality and reduces excessive oil absorption during frying.\n\nIts high heat stability minimizes foam formation and smoke during cooking, extending oil life and reducing operational costs for restaurants and food industries.	\N	\N	/uploads/upload_1776662638338_dlng4d.jfif	1180	للجركن 18 كيلو	1180	t	t	\N	\N	\N	5	\N	\N	\N	\N	2026-04-20 05:29:06.256	2026-05-03 04:01:44.895	79
10	refined-soybean-oil-18kg-jerrycan	جركن زيت صويا 18 كيلو	Refined Soybean Oil - 18kg Jerrycan	زيت صويا نقي وعالي الجودة، الخيار المثالي للمطاعم والمصانع لضمان أداء فائق في الطهي والقلي.	Premium refined soybean oil, the ideal choice for restaurants and food industries seeking superior cooking and frying performance.	يتميز زيت الصويا لدينا بنقائه العالي وقدرته الفائقة على تحمل درجات الحرارة المرتفعة، مما يجعله الخيار الأول للقلي العميق والخبز وتحضير مختلف الأطباق دون التأثير على النكهة الأصلية للمكونات. بفضل تركيبته المتوازنة، يضمن لك نتائج مثالية في كل استخدام مع الحفاظ على القيمة الغذائية.\n\nيأتي المنتج في جركن سعة 18 كيلو مصمم خصيصاً للاستخدام الكثيف في المطابخ التجارية ومصانع الأغذية، مما يوفر كفاءة عالية في التخزين والاستهلاك. إنه الحل الاقتصادي والاحترافي الذي يجمع بين الجودة العالمية والسعر التنافسي لتعزيز كفاءة أعمالك.	Our soybean oil is characterized by its high purity and exceptional smoke point, making it the top choice for deep frying, baking, and versatile culinary applications without altering the original food flavors. Its balanced composition ensures perfect results in every use while maintaining nutritional integrity.\n\nPackaged in a robust 18kg jerrycan designed for heavy-duty use in commercial kitchens and food manufacturing plants, this product offers high efficiency in storage and consumption. It is the professional, economical solution that combines international quality standards with competitive pricing to boost your business productivity.	\N	\N	/uploads/upload_1777325411213_oft6t8.jfif	\N	\N	\N	t	t	\N	\N	\N	6	\N	\N	\N	\N	2026-04-27 22:32:21.486	2026-04-27 22:33:06.811	100
12	carton-of-12-jouri-soybean-oil-bottles-850ml	كرتونة 12 زجاجة زيت صويا جوري 850 ملي	Carton of 12 Jouri Soybean Oil Bottles - 850ml	زيت صويا جوري النقي، الخيار الأمثل لصحة عائلتك ومذاق أطباقك الفريد. عبوة اقتصادية توفر لك الجودة والوفرة في آن واحد لمطبخك.	Jouri pure soybean oil is the perfect choice for your family's health and unique dish flavors. An economical pack providing both quality and value for your kitchen.	يعد زيت صويا جوري من أجود أنواع الزيوت النباتية، حيث يتم استخلاصه بعناية لضمان نقاء فائق ولون ذهبي صافٍ. يتميز بخفته على المعدة واحتوائه على نسبة عالية من الأحماض الدهنية غير المشبعة، مما يجعله الخيار الصحي المفضل للقلي، الطبخ، وتحضير أشهى المخبوزات والحلويات دون التأثير على الطعم الأصلي للمكونات.\nتأتي هذه الكرتونة المكونة من 12 زجاجة لتلبي احتياجات المطابخ العصرية والمطاعم بكفاءة عالية، حيث تضمن لك مخزوناً مستمراً من الزيت النقي المقاوم لدرجات الحرارة العالية. بفضل تقنيات التكرير المتقدمة، يوفر زيت جوري توازناً مثالياً بين القيمة الغذائية والأداء المتميز في المطبخ، مع الحفاظ على نضارة وجودة الأطعمة.	Jouri Soybean Oil is one of the finest vegetable oils, carefully extracted to ensure superior purity and a clear golden color. It is characterized by being light on the stomach and containing a high percentage of unsaturated fatty acids, making it the preferred healthy choice for frying, cooking, and preparing delicious baked goods and desserts without affecting the original flavor of the ingredients.\nThis carton of 12 bottles is designed to efficiently meet the needs of modern kitchens and restaurants, ensuring a steady supply of pure oil that withstands high temperatures. Thanks to advanced refining techniques, Jouri oil provides a perfect balance between nutritional value and outstanding kitchen performance, while maintaining the freshness and quality of your food.	\N	\N	/uploads/upload_1777333133941_i29fbr.png	670	للكرتونة 12 زجاجة	\N	t	t	\N	\N	\N	6	\N	\N	\N	\N	2026-04-27 23:16:40.835	2026-04-27 23:38:56.112	100
13	jory-palm-olein-oil-carton-12-x-700ml	كرتونة 12 زجاجة زيت أولين جوري 700 ملي	Jory Palm Olein Oil - Carton (12 x 700ml)	الخيار الاحترافي للقلي العميق بفضل ثباته الحراري الفائق ونتائجه الصحية المقرمشة. زيت جوري يمنحك جودة استثنائية مع امتصاص أقل للزيت في كل وجبة.	The professional choice for deep frying with superior thermal stability and healthy, crispy results. Jory oil ensures exceptional quality with less oil absorption in every meal.	يعد زيت أولين جوري الحل المتكامل للمطابخ التي تبحث عن الكفاءة والصحة في آن واحد؛ فهو مصمم خصيصاً ليتحمل درجات الحرارة العالية جداً في القلي العميق دون أن يتأثر هيكله الكيميائي، مما يضمن نكهة نقية ولوناً ذهبياً مثالياً للأطعمة. بفضل تقنية الامتصاص المنخفض، ستحصل على وجبات خفيفة وأقل دسامة، مما يجعله المفضل لدى الشيفات والمستهلكين المهتمين بنمط حياة صحي.\n\nإلى جانب أدائه المذهل، يتميز زيت جوري بكونه معززاً طبيعياً بمضادات الأكسدة وفيتامين E، وهو خالٍ تماماً من الكوليسترول والدهون المتحولة الضارة. تأتي هذه الكرتونة المكونة من 12 زجاجة لتلبي احتياجات الاستهلاك العالي مع ضمان استقرار الجودة لفترة طويلة، مما يجعله استثماراً ذكياً للمطاعم والمنازل التي لا تقبل المساومة على الجودة.	Jory Palm Olein Oil is the comprehensive solution for kitchens seeking both efficiency and health. Specifically formulated to withstand extreme temperatures in deep frying without chemical breakdown, it guarantees pure flavor and a perfect golden color for all foods. Thanks to its low-absorption technology, you will serve lighter, less greasy meals, making it the preferred choice for chefs and health-conscious consumers alike.\n\nBeyond its stunning performance, Jory oil is naturally enriched with antioxidants and Vitamin E, while being completely free from cholesterol and harmful trans fats. This 12-bottle carton is designed to meet high-volume demands while ensuring consistent quality over a long shelf life, making it a smart investment for restaurants and households that refuse to compromise on excellence.	\N	\N	/uploads/upload_1777332807226_t5pmtl.png	775	كرتونة 12 زجاجة 	Carton of 12 bottles	t	t	\N	\N	\N	5	\N	\N	\N	\N	2026-04-27 23:33:49.47	2026-04-27 23:33:49.47	100
11	soma-olein-oil-1l-case-of-12-bottles	كرتونة 12 زجاجة زيت أولين سومة 1 لتر 	Soma Olein Oil 1L - Case of 12 Bottles	الخيار الاحترافي للقلي العميق بثبات حراري فائق وأعلى معايير الصحة. زيت سومة يمنحك قرمشة مثالية مع امتصاص أقل للزيت لنتائج أخف وأشهى.	The professional choice for deep frying with superior thermal stability and the highest health standards. Soma oil delivers perfect crunch with less oil absorption for lighter results.	يعد زيت أولين سومة الحل الأمثل للمطابخ التي تبحث عن الكفاءة والجودة الصحية في آن واحد، حيث يتميز بقدرة استثنائية على تحمل درجات الحرارة العالية دون تحلل، مما يجعله مثالياً للقلي العميق المتكرر. بفضل تركيبته المتطورة، يضمن الزيت امتصاصاً أقل للأطعمة، مما يوفر وجبات خفيفة ومقرمشة تحافظ على طعمها الأصلي، وهو ما يجعله الاختيار الأول للطهاة المحترفين وربات البيوت اللواتي يهتممن بالجودة.	Soma Olein Oil is the ultimate solution for kitchens seeking both efficiency and health quality. It features an exceptional ability to withstand high temperatures without breaking down, making it ideal for frequent deep frying. Thanks to its advanced formula, the oil ensures lower absorption into food, providing light and crispy meals that retain their original flavor, making it the first choice for professional chefs and quality-conscious home cooks.	\N	\N	/uploads/upload_1777333656481_d9j7br.png	775	كرتونة 12 زجاجة 	Carton of 12 bottles	t	t	\N	\N	\N	5	\N	\N	\N	\N	2026-04-27 22:59:31.526	2026-04-27 23:47:41.31	100
14	blended-vegetable-oil-3-liters	زيت خليط 3 لتر 	Blended Vegetable Oil - 3 Liters	الخيار الأمثل لمطبخك، زيت خليط نقي يجمع بين الجودة العالية والقيمة الاقتصادية. صُمم خصيصاً ليمنحك نتائج مثالية في القلي والطهي مع الحفاظ على نكهة طعامك الأصلية.	The perfect choice for your kitchen, a pure blended oil that combines high quality with exceptional value. Specially formulated for ideal frying and cooking results while preserving original flavors.	يتميز زيت الخليط سعة 3 لتر بتركيبة متوازنة تم تطويرها بعناية لتناسب كافة احتياجات الطهي اليومي، سواء في القلي العميق أو التحمير أو إعداد الوجبات الخفيفة. بفضل درجة نقائه العالية وتحمله لدرجات الحرارة المرتفعة، يضمن لك الحصول على أطباق مقرمشة وصحية دون أي روائح غير مرغوب فيها، مما يجعله المساعد الأول لكل شيف يسعى للتميز في مطبخه.\n\nتأتي هذه العبوة الاقتصادية لتلبي متطلبات العائلات والمطاعم التي تبحث عن التوازن المثالي بين الأداء المتفوق والسعر المنافس. تم إنتاج وتعبئة الزيت وفقاً لأحدث المعايير الصحية العالمية لضمان الحفاظ على جودته وخصائصه الغذائية لفترات طويلة، مما يجعله منتجاً أساسياً لا غنى عنه في مخازن المواد الغذائية والمنازل.	Our 3L Blended Vegetable Oil features a carefully balanced formula developed to suit all daily cooking needs, from deep frying to sautéing and preparing light meals. Thanks to its high purity and high smoke point, it ensures crispy and healthy dishes without any unwanted odors, making it the primary choice for every chef striving for excellence in their kitchen.\n\nThis economical packaging is designed to meet the demands of families and restaurants seeking the perfect balance between superior performance and competitive pricing. The oil is produced and bottled according to the latest international health standards to ensure its quality and nutritional properties are preserved for long periods, making it an essential product for food warehouses and households alike.	\N	\N	/uploads/upload_1777334319195_9ls213.png	745	كرتونة 4 زجاجات 	Carton of 4 bottles	t	t	\N	\N	\N	7	\N	\N	\N	\N	2026-04-27 23:59:39.491	2026-04-27 23:59:39.491	100
15	joory-vegetable-ghee-11kg-tin	سمنة نباتي جوري 11 كيلو صفيح	Joory Vegetable Ghee - 11kg Tin	سمنة نباتي جوري بجودة استثنائية ونكهة غنية، الخيار الأمثل للمطابخ الاحترافية لضمان قوام مثالي ومذاق لا يقاوم.	Joory vegetable ghee offers exceptional quality and rich flavor, making it the perfect choice for professional kitchens to ensure ideal texture and irresistible taste.	تعد سمنة جوري النباتية شريكك المثالي في الطهي والخبز، حيث تتميز بقوامها المتجانس وقدرتها العالية على تحمل درجات الحرارة المرتفعة، مما يجعلها مثالية للقلي والتحمير وإعداد الحلويات الشرقية الفاخرة. بفضل تركيبتها المتطورة، تمنح أطباقك نكهة غنية ورائحة زكية تعزز من جودة منتجاتك النهائية وتضمن رضا عملائك الدائم.\nتأتي في عبوة صفيح اقتصادية بوزن 11 كيلو، مصممة خصيصاً لتلبية احتياجات المطاعم والفنادق وصناع الحلويات الكبار. تتميز بفترة صلاحية طويلة وسهولة في التخزين، كما أنها خالية من الكوليسترول، مما يوفر توازناً مثالياً بين الأداء المهني العالي والقيمة الغذائية المطلوبة في صناعة الأغذية الاحترافية.	Joory vegetable ghee is your ideal partner in cooking and baking, characterized by its consistent texture and high smoke point, which makes it perfect for frying, sautéing, and preparing premium oriental sweets. Thanks to its advanced formulation, it gives your dishes a rich flavor and aromatic scent that enhances the quality of your final products and ensures lasting customer satisfaction.\nIt comes in an economical 11kg tin, specifically designed to meet the needs of restaurants, hotels, and large-scale confectioners. It features a long shelf life and ease of storage, and is cholesterol-free, providing a perfect balance between high professional performance and the nutritional value required in the professional food industry.	\N	\N	/uploads/upload_1777335835582_tcht5w.png	780	صفيحة 11 كيلو	11 kg weight plate 	t	t	\N	\N	\N	8	\N	\N	\N	\N	2026-04-28 00:31:41.966	2026-04-28 00:31:41.966	100
16	somaty-vegetable-ghee-11kg-tin	سمنة نباتي سوماتي 11 كيلو  بستلة	somaty Vegetable Ghee - 11kg Tin	سمنة نباتي سوماتي بجودة استثنائية ونكهة غنية، الخيار الأمثل للمطابخ الاحترافية لضمان قوام مثالي ومذاق لا يقاوم.	somaty vegetable ghee offers exceptional quality and rich flavor, making it the perfect choice for professional kitchens to ensure ideal texture and irresistible taste.	تعد سمنة سوماتيالنباتية شريكك المثالي في الطهي والخبز، حيث تتميز بقوامها المتجانس وقدرتها العالية على تحمل درجات الحرارة المرتفعة، مما يجعلها مثالية للقلي والتحمير وإعداد الحلويات الشرقية الفاخرة. بفضل تركيبتها المتطورة، تمنح أطباقك نكهة غنية ورائحة زكية تعزز من جودة منتجاتك النهائية وتضمن رضا عملائك الدائم.\nتأتي في عبوة صفيح اقتصادية بوزن 11 كيلو، مصممة خصيصاً لتلبية احتياجات المطاعم والفنادق وصناع الحلويات الكبار. تتميز بفترة صلاحية طويلة وسهولة في التخزين، كما أنها خالية من الكوليسترول، مما يوفر توازناً مثالياً بين الأداء المهني العالي والقيمة الغذائية المطلوبة في صناعة الأغذية الاحترافية.	somaty vegetable ghee is your ideal partner in cooking and baking, characterized by its consistent texture and high smoke point, which makes it perfect for frying, sautéing, and preparing premium oriental sweets. Thanks to its advanced formulation, it gives your dishes a rich flavor and aromatic scent that enhances the quality of your final products and ensures lasting customer satisfaction.\nIt comes in an economical 11kg tin, specifically designed to meet the needs of restaurants, hotels, and large-scale confectioners. It features a long shelf life and ease of storage, and is cholesterol-free, providing a perfect balance between high professional performance and the nutritional value required in the professional food industry.	\N	\N	/uploads/upload_1777337251803_753lhw.jfif	780	بستلة 11 كيلو	11 kg weight plate 	t	t	\N	\N	\N	8	\N	\N	\N	\N	2026-04-28 00:52:27.252	2026-04-28 00:54:03.16	100
17	joory-vegetable-ghee-1kg-tin	كرتونة سمنة نباتي جوري 1كيلو صفيح	 Carton Of Joory Vegetable Ghee - 1kg Tin	سمنة نباتي جوري بجودة استثنائية ونكهة غنية، الخيار الأمثل للمطابخ الاحترافية لضمان قوام مثالي ومذاق لا يقاوم.	Joory vegetable ghee offers exceptional quality and rich flavor, making it the perfect choice for professional kitchens to ensure ideal texture and irresistible taste.	تعد سمنة جوري النباتية شريكك المثالي في الطهي والخبز، حيث تتميز بقوامها المتجانس وقدرتها العالية على تحمل درجات الحرارة المرتفعة، مما يجعلها مثالية للقلي والتحمير وإعداد الحلويات الشرقية الفاخرة. بفضل تركيبتها المتطورة، تمنح أطباقك نكهة غنية ورائحة زكية تعزز من جودة منتجاتك النهائية وتضمن رضا عملائك الدائم.\nتأتي في عبوة صفيح اقتصادية بوزن 11 كيلو، مصممة خصيصاً لتلبية احتياجات المطاعم والفنادق وصناع الحلويات الكبار. تتميز بفترة صلاحية طويلة وسهولة في التخزين، كما أنها خالية من الكوليسترول، مما يوفر توازناً مثالياً بين الأداء المهني العالي والقيمة الغذائية المطلوبة في صناعة الأغذية الاحترافية.	Joory vegetable ghee is your ideal partner in cooking and baking, characterized by its consistent texture and high smoke point, which makes it perfect for frying, sautéing, and preparing premium oriental sweets. Thanks to its advanced formulation, it gives your dishes a rich flavor and aromatic scent that enhances the quality of your final products and ensures lasting customer satisfaction.\nIt comes in an economical 11kg tin, specifically designed to meet the needs of restaurants, hotels, and large-scale confectioners. It features a long shelf life and ease of storage, and is cholesterol-free, providing a perfect balance between high professional performance and the nutritional value required in the professional food industry.	\N	\N	/uploads/upload_1777338490917_d74vrs.png	710	كرتونة 12 علبة صفيح 700 جرام 	A carton of 12 tins, 700 grams each	t	t	\N	\N	\N	8	\N	\N	\N	\N	2026-04-28 01:12:25.219	2026-04-28 01:12:25.219	100
18	jouri-600g-plant-based-margarine-tub	كرتونة سمنة نباتي جوري 650 جرام برطمان	Jouri 650g Plant Butter Jar	سمنة نباتية جوري 650 جرام، مثالية لصناعة الحلويات والمخبوزات الهشة.	Jouri 650g Plant Butter, ideal for baking and making crispy pastries.	سمنة نباتية جوري 650 جرام هي الخيار الأمثل للمخابز والمطاعم الكبيرة. تتميز بثباتها العالي عند درجات الحرارة المرتفعة، مما يجعلها مثالية للاستخدام في الطهي والخبز. كما أنها خالية تمامًا من الكوليسترول والدهون الحيوانية، مما يجعلها الخيار الصحي للعائلة. النكهة الغنية والرائحة الأصيلة تعطي منتجاتك نكهة فريدة ومميزة، بينما توفر اقتصادًا كبيرًا للمنشآت الغذائية الكبيرة.	Jouri 650g Plant Butter is the perfect choice for large bakeries and restaurants. It boasts high stability at high temperatures, making it ideal for cooking and baking. Additionally, it is completely free from cholesterol and animal fats, making it a healthy choice for your family. The rich flavor and authentic aroma give your products a unique and distinctive taste, while providing significant economic savings for large food establishments.	\N	\N	/uploads/upload_1777340663443_yhchyr.png	280	برطمان 600 جرام	600g Jar	t	t	\N	\N	\N	8	\N	\N	\N	\N	2026-04-28 01:43:13.721	2026-04-28 01:44:27.884	100
19	jouri-600g-plant-based-margarine-jar	كرتونة سمنة نباتي جوري 600 جرام برطمان 	Jouri 600g Plant-Based Margarine Jar	سمنة نباتية جوري 600 جرام، الخيار الأمثل للمخبوزات والحلويات.	Jouri 600g Plant-Based Margarine, the perfect choice for baking and pastries.	كرتونة سمنة نباتية جوري 600 جرام هي الخيار المثالي لكل من يبحث عن جودة عالية وخالية من الكوليسترول. تتميز هذه السمنة بثباتها العالي عند درجات الحرارة المرتفعة، مما يجعلها مثالية للاستخدام في صناعة الحلويات والمخبوزات الهشة. كما أنها تأتي بنكهة غنية ورائحة أصيلة، مما يضفي طابعًا فريدًا على الأطباق. بالإضافة إلى ذلك، توفر هذه السمنة اقتصادًا كبيرًا للمنشآت الغذائية الكبيرة، مما يجعلها الخيار الأمثل للمطاعم والمخابز.	The Jouri 600g Plant-Based Margarine Jar is the ideal choice for those seeking high-quality, cholesterol-free options. This margarine boasts excellent heat stability, making it perfect for baking and creating crispy pastries. It offers a rich flavor and authentic aroma, enhancing the taste of your dishes. Moreover, it provides exceptional cost savings for large food establishments, making it the go-to choice for restaurants and bakeries.	\N	\N	/uploads/upload_1777341364543_coo5oj.png	260	برطمان 600 جرام	600g Jar	t	t	\N	\N	\N	8	\N	\N	\N	\N	2026-04-28 01:56:26.807	2026-04-28 01:56:26.807	100
20	ghouri-700g-jar-of-vegetable-shortening	كرتونة سمنة نباتي جوري 700 جرام برطمان	Ghouri 700g Jar of Vegetable Shortening	سمنة نباتية جوري 700 جرام برطمان: الخيار الأمثل للحلويات والمخبوزات الهشة.	Ghouri 700g Jar of Vegetable Shortening: The perfect choice for pastries and crispy baked goods.	سمنة نباتية جوري 700 جرام برطمان هي الخيار المثالي لكل من يبحث عن جودة عالية وأداء متميز في صناعة الحلويات والمخبوزات. تتميز بثباتها العالي عند درجات الحرارة المرتفعة، مما يجعلها مثالية للاستخدام في المطاعم والمخبزات الكبيرة. كما أنها خالية تمامًا من الكوليسترول والدهون الحيوانية، مما يجعلها الخيار الصحي لعائلتك. بالإضافة إلى ذلك، توفر سمنة جوري اقتصادًا كبيرًا للمؤسسات الغذائية، حيث تضمن جودة ثابتة وكفاءة عالية في الاستخدام.	Ghouri 700g Jar of Vegetable Shortening is the ideal choice for those seeking high quality and superior performance in pastry and baking. It boasts excellent heat stability, making it perfect for use in large restaurants and bakeries. Additionally, it is completely free from cholesterol and animal fats, making it a healthy option for your family. Furthermore, Ghouri Shortening offers significant cost savings to food establishments, ensuring consistent quality and efficient use.	\N	\N	/uploads/upload_1777341691465_ksshmf.png	300	برطمان 700 جرام	700 grams of butter	t	t	\N	\N	\N	8	\N	\N	\N	\N	2026-04-28 02:03:13.17	2026-04-28 02:03:13.17	100
21	jouri-1150g-plant-butter-jar	سمنة نباتي جوري 1150 جرام برطمان 	Jouri 1150g Plant Butter Jar	سمنة نباتية غنية بنكهة أصيلة وخالية من الكوليسترول، مثالية للمخابز والحلويات.	Rich plant butter with authentic flavor and cholesterol-free, perfect for bakeries and confectioneries.	سمنة نباتي جوري 1150 جرام برطمان هي الخيار الأمثل للمخابز والحلويات. تتميز بثباتها العالي عند درجات الحرارة المرتفعة، مما يجعلها مثالية للطهي والخبز دون فقدان جودتها. كما أنها خالية تمامًا من الكوليسترول والدهون الحيوانية، مما يجعلها خيارًا صحيًا ومفضلاً للمستهلكين الذين يهتمون بصحتهم. بالإضافة إلى ذلك، توفر هذه السمنة النباتية اقتصادًا كبيرًا للمنشآت الغذائية الكبيرة، حيث تأتي في حزمة عملية توفر تكلفة أقل لكل استخدام.	The Jouri 1150g Plant Butter Jar is the ideal choice for bakeries and confectioneries. It boasts high stability at high temperatures, making it perfect for cooking and baking without compromising on quality. Additionally, it is entirely free from cholesterol and animal fats, making it a healthy and preferred option for health-conscious consumers. Moreover, this plant butter offers significant economic savings for large food establishments, as it comes in a practical package that reduces cost per use.	\N	\N	/uploads/upload_1777342104436_qbelq1.png	480	برطمان 1150 جرام	1150 grams of butter	t	t	\N	\N	\N	8	\N	\N	\N	\N	2026-04-28 02:10:27.103	2026-04-28 02:17:59.825	100
22	joory-plant-butter-1250g-jar	سمنة نباتي جوري 1250 جرام برطمان	Joory Plant Butter 1250g Jar	سمنة نباتية عالية الجودة، مثالية للمخبوزات والحلويات.	High-quality plant butter, perfect for baking and confections.	سمنة نباتي جوري هي الخيار الأمثل لكل من يبحث عن جودة عالية وخالية من الكوليسترول. تتميز بثباتها العالي عند درجات الحرارة المرتفعة، مما يجعلها مثالية لاستخدامها في صناعة الحلويات والمخبوزات الهشة. كما أنها توفر حلًّا اقتصاديًّا فائقًا للمنشآت الغذائية الكبيرة، حيث تضمن النكهة الغنية والرائحة الأصيلة في كل استخدام.	Ghori Plant Butter is the perfect choice for those seeking high quality and cholesterol-free options. It boasts exceptional stability at high temperatures, making it ideal for baking and creating crispy pastries. Additionally, it offers exceptional economic value for large food establishments, ensuring a rich flavor and authentic aroma with every use.	\N	\N	/uploads/upload_1777343394246_s8xibc.png	515	برطمان 1250 جرام	jar1250 grams	t	t	\N	\N	\N	8	\N	\N	\N	\N	2026-04-28 02:30:39.256	2026-04-28 02:30:39.256	100
23	salam-shortening-carton-25kg	كرتونة شورتنج السلام 25 كيلو 	Salam Shortening Carton 25kg	كرتونة الشورتنج السلام 25 كيلو: الخيار الأمثل للمخابز والمطاعم!	Salam Shortening Carton 25kg: The perfect choice for bakeries and restaurants!	كرتونة الشورتنج السلام 25 كيلو هي منتج عالي الجودة مصمم خصيصًا لتلبية احتياجات المخابز والمطاعم. يتميز هذا الشورتنج بقدرته على توفير نتائج متسقة وعالية الجودة في جميع أنواع الحلويات والمعجنات، مما يجعله الخيار المثالي للطهاة والمخبزين المحترفين. كما أنه سهل الاستخدام ويضمن حفظًا طويل الأمد، مما يوفر الراحة والكفاءة في المطبخ.	The Salam Shortening Carton 25kg is a high-quality product designed to meet the needs of bakeries and restaurants. This shortening is known for its ability to provide consistent and high-quality results in all types of pastries and baked goods, making it the ideal choice for professional chefs and bakers. It is easy to use and ensures long-term storage, providing convenience and efficiency in the kitchen.	\N	\N	/uploads/upload_1777343973663_t0gmia.png	1585	كرتونة 25 كيلو	25 kg carton	t	t	\N	\N	\N	9	\N	\N	\N	\N	2026-04-28 02:40:25.861	2026-04-28 02:40:25.861	100
\.


--
-- Data for Name: ProductCertification; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ProductCertification" (id, "productId", name) FROM stdin;
83	13	ISO 22000 (Food Safety Management)
84	13	Halal Certified
85	13	HACCP Certified
86	13	SASO Quality Mark
91	12	ISO 22000
92	12	Halal Certified
93	12	HACCP
94	12	Quality Mark Certificate
95	11	ISO 22000 (Food Safety Management)
96	11	Halal Certification
97	11	HACCP Certified
98	11	Egyptian Food Safety Authority (NFSA)
99	14	ISO 22000 (Food Safety Management)
100	14	Halal Certified
101	14	FDA Approved Facilities
102	14	HACCP Certified
103	15	ISO 22000 (Food Safety Management System)
104	15	Halal Certification
105	15	HACCP Certified
106	15	Quality Assurance Certificate (ES)
111	16	ISO 22000 (Food Safety Management System)
112	16	Halal Certification
113	16	HACCP Certified
114	16	Quality Assurance Certificate (ES)
115	17	ISO 22000 (Food Safety Management System)
116	17	Halal Certification
117	17	HACCP Certified
118	17	Quality Assurance Certificate (ES)
123	18	ISO 9001
124	18	FDA Approved
125	18	Halal Certified
126	18	HACCP Certified
127	19	ISO 9001
128	19	FDA
129	19	Halal
130	19	HACCP
131	20	ISO 9001
132	20	Halal
133	20	FDA
54	8	ISO 22000
55	8	HACCP
56	8	GMP
57	8	شهادة حلال
58	8	SASO
138	21	ISO 9001
139	21	FDA Approved
140	21	Halal Certified
141	21	HACCP Certified
142	22	ISO 9001
143	22	FDA
67	10	Halal Certificate (شهادة حلال)
68	10	ISO 22000 (Food Safety) (أيزو 22000 (سلامة الغذاء))
69	10	SFDA/FDA Compliant (هيئة الغذاء والدواء)
70	10	HACCP Certified (شهادة هاسب (HACCP))
144	22	Halal
145	23	ISO 9001
146	23	FDA Approved
147	23	Halal Certified
\.


--
-- Data for Name: ProductFeature; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ProductFeature" (id, "productId", feature_ar, feature_en) FROM stdin;
96	13	ثبات حراري فائق للقلي المستمر	Superior thermal stability for continuous frying
97	13	امتصاص أقل للزيت لنتائج أخف	Lower oil absorption for lighter results
98	13	خالٍ تماماً من الكوليسترول والدهون المتحولة	Zero cholesterol and trans fats
99	13	غني بفيتامين E ومضادات الأكسدة الطبيعية	Rich in Vitamin E and natural antioxidants
100	13	عمر افتراضي طويل وجودة مستقرة	Long shelf life with stable quality
106	12	نقي وطبيعي 100% وخالٍ من الكوليسترول	100% Pure, natural, and cholesterol-free
107	12	غني بالأوميجا 3 وفيتامين هـ لتعزيز صحة القلب	Rich in Omega-3 and Vitamin E for heart health
108	12	نقطة تدخين عالية تجعله مثاليًا للقلي والتحمير	High smoke point ideal for deep frying and searing
109	12	خفيف على المعدة ولا يغير طعم المأكولات الأصلي	Light on the stomach and preserves the original food flavor
110	12	تعبئة اقتصادية في كرتونة توفر قيمة ممتازة مقابل السعر	Economical carton packaging offering excellent value for money
111	11	ثبات حراري فائق للقلي العميق	Superior thermal stability for deep frying
112	11	خالٍ تماماً من الكوليسترول والدهون المتحولة	Completely free of cholesterol and trans fats
113	11	امتصاص أقل للزيت لنتائج أخف وأكثر صحة	Lower oil absorption for lighter and healthier results
114	11	غني بمضادات الأكسدة الطبيعية وفيتامين E	Rich in natural antioxidants and Vitamin E
115	11	عمر افتراضي طويل مع جودة مستقرة	Long shelf life with stable quality performance
116	14	نقطة دخان عالية مناسبة للقلي العميق	High smoke point ideal for deep frying
117	14	خالي من الكوليسترول والدهون المتحولة	Cholesterol and trans-fat free
118	14	عبوة اقتصادية موفرة سعة 3 لتر	Economical 3-liter value pack
119	14	طعم محايد يحافظ على نكهة المكونات	Neutral taste that preserves ingredient flavors
120	14	معزز بفيتامينات A و D	Fortified with Vitamins A and D
121	15	ثبات عالي عند درجات الحرارة المرتفعة	High thermal stability for frying and baking
122	15	نكهة غنية ورائحة أصيلة تعزز المذاق	Rich flavor and authentic aroma to enhance taste
123	15	خالية تماماً من الكوليسترول والدهون الحيوانية	100% free from cholesterol and animal fats
124	15	مثالية لصناعة الحلويات والمخبوزات الهشة	Ideal for confectionery and flaky pastry production
125	15	توفير اقتصادي فائق للمنشآت الغذائية الكبيرة	Superior economic savings for large food establishments
131	16	ثبات عالي عند درجات الحرارة المرتفعة	High thermal stability for frying and baking
132	16	نكهة غنية ورائحة أصيلة تعزز المذاق	Rich flavor and authentic aroma to enhance taste
133	16	خالية تماماً من الكوليسترول والدهون الحيوانية	100% free from cholesterol and animal fats
134	16	مثالية لصناعة الحلويات والمخبوزات الهشة	Ideal for confectionery and flaky pastry production
55	8	ثبات حراري عالي مناسب للقلي العميق	High thermal stability for deep frying
56	8	عمر استخدام طويل مقارنة بالزيوت التقليدية	Extended frying life
57	8	طعم محايد لا يؤثر على نكهة الطعام	Neutral taste that preserves food flavor
58	8	نسبة امتصاص منخفضة للطعام	Low oil absorption
59	8	مقاومة للأكسدة وتكوّن الرغوة	Oxidation resistant & low foaming
60	8	لون ذهبي نقي	Clear golden color
135	16	توفير اقتصادي فائق للمنشآت الغذائية الكبيرة	Superior economic savings for large food establishments
136	17	ثبات عالي عند درجات الحرارة المرتفعة	High thermal stability for frying and baking
137	17	نكهة غنية ورائحة أصيلة تعزز المذاق	Rich flavor and authentic aroma to enhance taste
138	17	خالية تماماً من الكوليسترول والدهون الحيوانية	100% free from cholesterol and animal fats
139	17	مثالية لصناعة الحلويات والمخبوزات الهشة	Ideal for confectionery and flaky pastry production
140	17	توفير اقتصادي فائق للمنشآت الغذائية الكبيرة	Superior economic savings for large food establishments
71	10	درجة احتراق عالية مثالية للقلي	High smoke point ideal for deep frying
72	10	نكهة محايدة تحافظ على طعم المأكولات	Neutral flavor that preserves food taste
73	10	غني بأحماض أوميجا 3 و 6 الصحية	Rich in healthy Omega-3 and Omega-6 fatty acids
74	10	عبوة اقتصادية مخصصة للاستخدام التجاري	Economical packaging designed for commercial use
75	10	خالٍ من الكوليسترول والدهون المتحولة	Free from cholesterol and trans fats
146	18	ثبات عالي عند درجات الحرارة المرتفعة	High stability at high temperatures
147	18	نكهة غنية ورائحة أصيلة	Rich flavor and authentic aroma
148	18	خالية تمامًا من الكوليسترول والدهون الحيوانية	Completely free from cholesterol and animal fats
149	18	مثالية لصناعة الحلويات والمخبوزات الهشة	Ideal for baking and making crispy pastries
150	18	توفير اقتصادي فائق للمنشآت الغذائية الكبيرة	Significant economic savings for large food establishments
151	19	ثبات عالي عند درجات الحرارة المرتفعة	High heat stability
152	19	نكهة غنية ورائحة أصيلة	Rich flavor and authentic aroma
153	19	خالية تمامًا من الكوليسترول والدهون الحيوانية	Cholesterol-free and animal fat-free
154	19	مثالية لصناعة الحلويات والمخبوزات الهشة	Ideal for baking and pastries
155	19	توفير اقتصادي فائق للمنشآت الغذائية الكبيرة	Exceptional cost savings for large food establishments
156	20	ثبات عالي عند درجات الحرارة المرتفعة	High stability at high temperatures
157	20	نكهة غنية ورائحة أصيلة	Rich flavor and authentic aroma
158	20	خالية تمامًا من الكوليسترول والدهون الحيوانية	Completely free from cholesterol and animal fats
159	20	مثالية لصناعة الحلويات والمخبوزات الهشة	Ideal for pastries and crispy baked goods
160	20	توفير اقتصادي فائق للمنشآت الغذائية الكبيرة	Superior economic savings for large food establishments
166	21	ثبات عالي عند درجات الحرارة المرتفعة	High stability at high temperatures
167	21	نكهة غنية ورائحة أصيلة	Rich flavor and authentic aroma
168	21	خالية تمامًا من الكوليسترول والدهون الحيوانية	Cholesterol-free and animal fat-free
169	21	مثالية لصناعة الحلويات والمخبوزات الهشة	Ideal for confectionery and crispy baked goods
170	21	توفير اقتصادي فائق للمنشآت الغذائية الكبيرة	Superior economic savings for large food establishments
171	22	ثبات عالي عند درجات الحرارة المرتفعة	High stability at high temperatures
172	22	نكهة غنية ورائحة أصيلة	Rich flavor and authentic aroma
173	22	خالية تمامًا من الكوليسترول والدهون الحيوانية	Completely free from cholesterol and animal fats
174	22	مثالية لصناعة الحلويات والمخبوزات الهشة	Ideal for confections and crispy pastries
175	22	توفير اقتصادي فائق للمنشآت الغذائية الكبيرة	Exceptional economic value for large food establishments
176	23	نتائج متسقة وعالية الجودة	Consistent and High-Quality Results
177	23	سهل الاستخدام	Easy to Use
178	23	حفظ طويل الأمد	Long Shelf Life
179	23	مناسب للحلويات والمعجنات	Ideal for Pastries and Baked Goods
180	23	خيار مثالي للمطاعم والمخابز	Perfect for Restaurants and Bakeries
\.


--
-- Data for Name: ProductImage; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ProductImage" (id, "productId", url, alt_text) FROM stdin;
6	8	/uploads/upload_1777319006646_8o8zi2.jfif	\N
7	8	/uploads/upload_1777319189214_89ekip.jfif	\N
14	10	/uploads/upload_1777328880284_534xcd.jfif	\N
15	10	/uploads/upload_1777329137568_qt4uov.jfif	\N
26	13	/uploads/upload_1777332710908_ci5dyz.png	\N
27	13	/uploads/upload_1777332810066_jg07ub.png	\N
31	12	/uploads/upload_1777331696065_k68p6e.png	\N
32	12	/uploads/upload_1777331786857_di7kkf.png	\N
33	12	/uploads/upload_1777333086225_ll3ha1.png	\N
34	11	/uploads/upload_1777330224287_ds1jtz.jfif	\N
35	11	/uploads/upload_1777330626064_71lwm1.png	\N
36	11	/uploads/upload_1777330702313_704b0a.png	\N
37	14	/uploads/upload_1777334321121_zmzav8.png	\N
38	14	/uploads/upload_1777334322968_qh2rjk.png	\N
39	15	/uploads/upload_1777336055397_sofqj8.png	\N
40	15	/uploads/upload_1777336143124_7et9iz.png	\N
44	16	/uploads/upload_1777337363540_xwhhf4.png	\N
45	16	/uploads/upload_1777337444698_27sjhg.png	\N
46	16	/uploads/upload_1777337534690_tpgl3h.png	\N
47	17	/uploads/upload_1777338466164_9afeo9.png	\N
48	17	/uploads/upload_1777338644308_60434t.png	\N
49	17	/uploads/upload_1777338730503_exk2zi.png	\N
52	18	/uploads/upload_1777340489576_acsw9w.png	\N
53	18	/uploads/upload_1777340659248_d1u210.png	\N
54	19	/uploads/upload_1777340489576_acsw9w.png	\N
55	19	/uploads/upload_1777341364536_uq55cn.png	\N
56	20	/uploads/upload_1777341692025_7i222s.png	\N
57	20	/uploads/upload_1777341693744_sq43vl.png	\N
60	21	/uploads/upload_1777342105650_cvzrqe.png	\N
61	21	/uploads/upload_1777342107090_2rfvcf.png	\N
62	22	/uploads/upload_1777343394249_udgcy4.png	\N
63	22	/uploads/upload_1777343433000_4qit3u.png	\N
64	23	/uploads/upload_1777343976481_cxziao.png	\N
65	23	/uploads/upload_1777344009834_6xv5yo.png	\N
\.


--
-- Data for Name: ProductPackaging; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ProductPackaging" (id, "productId", size_ar, size_en, price) FROM stdin;
25	8	جركن 18 كيلو	Gallon 18 Kg	1180
28	10	18 كيلو	18 kilo	1265
33	13	كرتونة 12 زجاجة * 935 جرام	Carton 12 bottles * 935 grams	775
35	12	كرتونة 12 زجاجة 	Carton of 12 bottles	670
36	11	كرتونة 12 زجاجة * 935 جرام	Carton 12 bottles * 935 grams	775
37	14	4 زجاجات * 2610 جرام	4 bottles * 2610 grams	745
38	15	صفحة 11 كيلو 	11 kg weight plate 	780
40	16	بستلة 11 كيلو 	11 kg weight plate 	740
41	17	صفيحة 1 كيلو 	1 kg weight plate 	780
43	18	برطمان 650	Jar 650	280
44	19	برطمان 600 جرام 	600 grams of butter	260
45	20	برطمان 700 جرام 	700 grams of butter	300
48	21	كرتونة 6 برطمان 	6 jar carton	2880
49	22	كرتونة 6 برطمان 	6 jar carton	3090
\.


--
-- Data for Name: ProductSpec; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ProductSpec" (id, "productId", label_ar, label_en, value_ar, value_en) FROM stdin;
\.


--
-- Data for Name: PromoCode; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."PromoCode" (id, code, type, value, "minOrderValue", "maxUses", "usedCount", "isActive", "expiresAt", "createdAt", "updatedAt") FROM stdin;
1	TEST50	PERCENTAGE	50	\N	\N	0	t	\N	2026-04-21 19:10:08.555	2026-04-21 19:10:08.555
2	FIXED50	FIXED	50	\N	\N	2	t	\N	2026-04-21 19:11:12.641	2026-04-21 19:24:02.075
\.


--
-- Data for Name: Promotion; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Promotion" (id, "productId", title_ar, title_en, description_ar, description_en, discount_type, discount_value, original_price, promo_price, badge_ar, badge_en, featured_image, starts_at, ends_at, "createdAt", "updatedAt", "isActive") FROM stdin;
\.


--
-- Data for Name: Quotation; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Quotation" (id, "userId", status, "discountAmount", "totalAmount", "adminNotes", "clientNotes", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: QuotationItem; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."QuotationItem" (id, "quotationId", "productId", quantity, price, "weightVariant", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: ShippingZone; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ShippingZone" (id, name_ar, name_en, fee, "isActive", "createdAt", "updatedAt") FROM stdin;
1	القاهرة	Cairo	50	t	2026-04-21 18:36:06.298	2026-04-21 18:36:06.298
2	الجيزة	Giza	50	t	2026-04-21 18:36:06.306	2026-04-21 18:36:06.306
3	الإسكندرية	Alexandria	70	t	2026-04-21 18:36:06.308	2026-04-21 18:36:06.308
4	القليوبية	Qalyubia	60	t	2026-04-21 18:36:06.309	2026-04-21 18:36:06.309
5	الدقهلية	Dakahlia	70	t	2026-04-21 18:36:06.369	2026-04-21 18:36:06.369
6	الشرقية	Sharqia	70	t	2026-04-21 18:36:06.37	2026-04-21 18:36:06.37
7	الغربية	Gharbia	70	t	2026-04-21 18:36:06.371	2026-04-21 18:36:06.371
8	المنوفية	Monufia	70	t	2026-04-21 18:36:06.373	2026-04-21 18:36:06.373
9	البحيرة	Beheira	75	t	2026-04-21 18:36:06.374	2026-04-21 18:36:06.374
10	كفر الشيخ	Kafr El Sheikh	75	t	2026-04-21 18:36:06.375	2026-04-21 18:36:06.375
11	بورسعيد	Port Said	80	t	2026-04-21 18:36:06.376	2026-04-21 18:36:06.376
12	دمياط	Damietta	80	t	2026-04-21 18:36:06.377	2026-04-21 18:36:06.377
13	الإسماعيلية	Ismailia	80	t	2026-04-21 18:36:06.378	2026-04-21 18:36:06.378
14	السويس	Suez	80	t	2026-04-21 18:36:06.379	2026-04-21 18:36:06.379
15	الفيوم	Faiyum	90	t	2026-04-21 18:36:06.38	2026-04-21 18:36:06.38
17	المنيا	Minya	100	t	2026-04-21 18:36:06.382	2026-04-21 18:36:06.382
18	أسيوط	Assiut	100	t	2026-04-21 18:36:06.384	2026-04-21 18:36:06.384
19	سوهاج	Sohag	120	t	2026-04-21 18:36:06.386	2026-04-21 18:36:06.386
20	قنا	Qena	120	t	2026-04-21 18:36:06.388	2026-04-21 18:36:06.388
21	الأقصر	Luxor	150	t	2026-04-21 18:36:06.389	2026-04-21 18:36:06.389
22	أسوان	Aswan	150	t	2026-04-21 18:36:06.39	2026-04-21 18:36:06.39
23	البحر الأحمر	Red Sea	150	t	2026-04-21 18:36:06.391	2026-04-21 18:36:06.391
24	جنوب سيناء	South Sinai	150	t	2026-04-21 18:36:06.392	2026-04-21 18:36:06.392
25	شمال سيناء	North Sinai	150	t	2026-04-21 18:36:06.393	2026-04-21 18:36:06.393
26	الوادي الجديد	New Valley	180	t	2026-04-21 18:36:06.394	2026-04-21 18:36:06.394
27	مطروح	Matrouh	150	t	2026-04-21 18:36:06.395	2026-04-21 18:36:06.395
16	بني سويف	Beni Suef	90	t	2026-04-21 18:36:06.381	2026-04-22 00:01:04.41
\.


--
-- Data for Name: SiteSettings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."SiteSettings" (id, "siteNameAr", "siteNameEn", "siteDescriptionAr", "siteDescriptionEn", "contactEmail", "contactPhone", "addressAr", "addressEn", "facebookUrl", "twitterUrl", "instagramUrl", "linkedinUrl", "smtpHost", "smtpPort", "smtpUser", "smtpPass", "smtpFrom", "smtpFromName", "smtpSecure", "logoUrl", "createdAt", "updatedAt", "googleAnalyticsId", "imapHost", "imapPass", "imapPort", "imapSecure", "imapUser", "invoiceNotesAr", "invoiceNotesEn", "invoiceShowLogo", "invoiceLogoUrl", "invoiceColor", "invoiceCompanyDetails", "invoiceLogoSize", "invoiceSubtitle", "invoiceWebsiteUrl", "geminiApiKey", "stabilityApiKey", "huggingFaceApiKey", "imageAiProvider", "textAiProvider") FROM stdin;
default	مصنع السلام للزيوت النباتية	Elsalam Vegetable Oils Factory	الريادة في إنتاج الزيوت النباتية والسمن النباتي منذ عام 2000	Leader in vegetable oil and ghee production since 2000	info@elsalamoil.com	+201050051851	البحيرة - دمنهور - الأبعادية - عند مجمع الكليات 	Beheira – Damanhur – Al-Abadiya – near the Colleges Complex	https://www.facebook.com/profile.php?id=61576731414550	\N	\N	\N	mail.elsalamoil.com	465	it@elsalamoil.com	Asd@1029	it@elsalamoil.com	Elsalam Factory System it	ssl	/uploads/upload_1773461572429_o147s8.png	2026-04-17 21:35:21.761	2026-05-04 05:17:26.504	\N	mail.elsalamoil.com	Asd@1029	993	tls	it@elsalamoil.com	\N	\N	t	\N	#15803d	\N	64	Industrial High-Quality Oils & Fats	www.elsalamoils.com	\N	\N	\N	pollinations	gemini
cmmokssh30002rtf0oyvuymjp	مصنع السلام للزيوت النباتية	Elsalam Vegetable Oils Factory	الريادة في إنتاج الزيوت النباتية والسمن النباتي منذ عام 2000	Leader in vegetable oil and ghee production since 2000	info@elsalamoil.com	+201050051851	البحيرة - دمنهور - الأبعادية - عند مجمع الكليات 	Beheira – Damanhur – Al-Abadiya – near the Colleges Complex	https://www.facebook.com/profile.php?id=61576731414550	\N	https://instagram.com/elsalamoils	https://linkedin.com/company/elsalamoils	mail.elsalamoil.com	465	it@elsalamoil.com	Asd@1029	it@elsalamoil.com	Elsalam Factory System it	ssl	/uploads/upload_1773461572429_o147s8.png	2026-03-13 07:29:05.32	2026-05-04 05:16:53.98	\N	mail.elsalamoil.com	Asd@1029	993	tls	it@elsalamoil.com	مصنع السلام لعصر وإستخلاص الزيوت النباتية 00		t		#15803d		64	مصنع السلام لعصر وإستخلاص الزيوت النباتية	www.elsalamoil.com	\N	\N	\N	pollinations	gemini
\.


--
-- Data for Name: TechnicalSpec; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."TechnicalSpec" (id, "productId", property_ar, property_en, value_ar, value_en, unit_ar, unit_en) FROM stdin;
92	13	نوع المنتج	Product Type	زيت أولين نخيل نقي	Pure Palm Olein Oil	\N	\N
93	13	حجم العبوة	Package Size	12 زجاجة × 700 مل	12 Bottles x 700ml	\N	\N
94	13	مدة الصلاحية	Shelf Life	12 - 18 شهر من تاريخ الإنتاج	12 - 18 Months from production	\N	\N
95	13	ظروف التخزين	Storage Conditions	يحفظ في مكان بارد وجاف بعيداً عن الشمس	Store in a cool, dry place away from sunlight	\N	\N
101	12	الحجم لكل زجاجة	Volume per bottle	850 مل	850 ml	\N	\N
102	12	عدد الزجاجات	Number of bottles	12 زجاجة في الكرتونة	12 bottles per carton	\N	\N
103	12	المكونات	Ingredients	زيت صويا نقي 100%	100% Pure Soybean Oil	\N	\N
104	12	مدة الصلاحية	Shelf Life	12-18 شهرًا	12-18 Months	\N	\N
105	12	التخزين	Storage	يحفظ في مكان بارد وجاف بعيداً عن الشمس	Store in a cool, dry place away from sunlight	\N	\N
106	11	حجم الزجاجة	Bottle Size	1 لتر	1 Liter	\N	\N
107	11	الكمية في الكرتونة	Case Quantity	12 زجاجة	12 Bottles	\N	\N
108	11	مدة الصلاحية	Shelf Life	12 - 18 شهر	12 - 18 Months	\N	\N
109	11	المكونات	Ingredients	زيت أولين نخيل مكرر نقي	Pure Refined Palm Olein Oil	\N	\N
110	11	بلد المنشأ	Country of Origin	مصر / ماليزيا (حسب الدفعة)	Egypt / Malaysia (Subject to batch)	\N	\N
111	14	الحجم	Volume	3 لتر	3 Liters	\N	\N
112	14	المكونات	Ingredients	مزيج من زيوت نباتية نقية (دوار الشمس، صويا، أولين النخيل)	Blend of pure vegetable oils (Sunflower, Soy, Palm Olein)	\N	\N
113	14	مدة الصلاحية	Shelf Life	12-18 شهر من تاريخ الإنتاج	12-18 months from production date	\N	\N
114	14	ظروف التخزين	Storage Conditions	يُحفظ في مكان بارد وجاف بعيداً عن أشعة الشمس المباشرة	Store in a cool, dry place away from direct sunlight	\N	\N
115	15	الوزن الصافي	Net Weight	11 كيلوجرام	11 kg	\N	\N
116	15	نوع التغليف	Packaging Type	عبوة صفيح محكمة الإغلاق	Hermetically sealed metal tin	\N	\N
117	15	المكونات الأساسية	Main Ingredients	زيوت نباتية نقية، نكهة السمن الطبيعي	Pure vegetable oils, natural ghee flavor	\N	\N
118	15	مدة الصلاحية	Shelf Life	18 شهراً من تاريخ الإنتاج	18 months from production date	\N	\N
119	15	ظروف التخزين	Storage Conditions	يُحفظ في مكان بارد وجاف بعيداً عن أشعة الشمس	Store in a cool, dry place away from direct sunlight	\N	\N
49	8	النوع	Refined Vegetable Olein Oil	زيت أولين نباتي مكرر	Type	\N	\N
50	8	الوزن الصافي	18 KG	18 كجم	Net Weight	\N	\N
51	8	اللون	Light golden	ذهبي فاتح	Color	\N	\N
52	8	الرائحة	Nearly odorless	عديم الرائحة تقريباً	Odor	\N	\N
53	8	نقطة التدخين	High (Approx. 220–230°C)	مرتفعة (تقريباً 220–230°C)	Smoke Point	\N	\N
54	8	نسبة الأحماض الدهنية الحرة	≤ 0.1%	≤ 0.1%	Free Fatty Acids	\N	\N
55	8	التعبئة	Packaging	جركن بلاستيك غذائي عالي الجودة	Food-grade plastic jerry can	\N	\N
56	8	مدة الصلاحية	Shelf Life	12–18 شهر	12–18 months	\N	\N
125	16	الوزن الصافي	Net Weight	11 كيلوجرام	11 kg	\N	\N
126	16	نوع التغليف	Packaging Type	عبوة صفيح محكمة الإغلاق	Hermetically sealed metal tin	\N	\N
127	16	المكونات الأساسية	Main Ingredients	زيوت نباتية نقية، نكهة السمن الطبيعي	Pure vegetable oils, natural ghee flavor	\N	\N
128	16	مدة الصلاحية	Shelf Life	18 شهراً من تاريخ الإنتاج	18 months from production date	\N	\N
129	16	ظروف التخزين	Storage Conditions	يُحفظ في مكان بارد وجاف بعيداً عن أشعة الشمس	Store in a cool, dry place away from direct sunlight	\N	\N
67	10	الوزن الصافي	Net Weight	18 كيلوجرام	18 kg	\N	\N
68	10	المكونات	Ingredients	زيت صويا نقي 100%	100% Pure Soybean Oil	\N	\N
69	10	مدة الصلاحية	Shelf Life	12 شهر من تاريخ الإنتاج	12 months from production date	\N	\N
70	10	نوع العبوة	Packaging Type	جركن بلاستيكي عالي الجودة	High-quality plastic jerrycan	\N	\N
71	10	ظروف التخزين	Storage Conditions	يُحفظ في مكان بارد وجاف بعيداً عن الشمس	Store in a cool, dry place away from sunlight	\N	\N
130	17	الوزن الصافي	Net Weight	700 جرام	700 Gram	\N	\N
131	17	نوع التغليف	Packaging Type	عبوة صفيح محكمة الإغلاق	Hermetically sealed metal tin	\N	\N
132	17	المكونات الأساسية	Main Ingredients	زيوت نباتية نقية، نكهة السمن الطبيعي	Pure vegetable oils, natural ghee flavor	\N	\N
133	17	مدة الصلاحية	Shelf Life	18 شهراً من تاريخ الإنتاج	18 months from production date	\N	\N
134	17	ظروف التخزين	Storage Conditions	يُحفظ في مكان بارد وجاف بعيداً عن أشعة الشمس	Store in a cool, dry place away from direct sunlight	\N	\N
139	18	الوزن	Weight	650 جرام	650 grams	\N	\N
140	18	مدة الصلاحية	Shelf Life	18 شهرًا	18 months	\N	\N
141	18	المكونات	Ingredients	زيوت نباتية، ماء، ملح، حمض الليمون، مثبتات طبيعية	Vegetable oils, water, salt, lemon juice, natural stabilizers	\N	\N
142	18	الحزمة	Packaging	كرتونة تحتوي على برطمان	Carton containing one jar	\N	\N
143	19	الوزن	Weight	600 جرام	600 grams	\N	\N
144	19	مدة الصلاحية	Shelf Life	18 شهرًا	18 months	\N	\N
145	19	المكونات	Ingredients	زيوت نباتية، ماء، ملح، حمض الليمون، فيتامين E	Vegetable oils, water, salt, lemon juice, Vitamin E	\N	\N
146	19	التعبئة	Packaging	كرتونة برطمان	Carton with jar	\N	\N
147	20	الوزن	Weight	700 جرام	700 grams	\N	\N
148	20	مدة الصلاحية	Shelf Life	24 شهرًا	24 months	\N	\N
149	20	المكونات	Ingredients	زيوت نباتية مهدرجة	Hydrogenated vegetable oils	\N	\N
150	20	الحالة	Form	صلبة	Solid	\N	\N
155	21	الوزن	Weight	1150 جرام	1150 grams	\N	\N
156	21	مدة الصلاحية	Shelf Life	18 شهرًا من تاريخ التصنيع	18 months from manufacturing date	\N	\N
157	21	المكونات	Ingredients	زيوت نباتية، ماء، ملح، مستحلبات، نكهات طبيعية	Vegetable oils, water, salt, emulsifiers, natural flavors	\N	\N
158	21	التعبئة	Packaging	كرتونة تحتوي على برطمان واحد	Carton containing one jar	\N	\N
159	22	الوزن	Weight	1250 جرام	1250 grams	\N	\N
160	22	مدة الصلاحية	Shelf Life	18 شهرًا	18 months	\N	\N
161	22	المكونات	Ingredients	زيوت نباتية مكررة، ماء، ملح، حليب مجفف	Refined vegetable oils, water, salt, dried milk	\N	\N
162	22	الحجم	Packaging	برطمان	Jar	\N	\N
163	23	الوزن	Weight	25 كيلوغرام	25 kg	\N	\N
164	23	مدة الصلاحية	Shelf Life	18 شهر	18 months	\N	\N
165	23	المكونات	Ingredients	زيوت نباتية مهدرجة	Hydrogenated Vegetable Oils	\N	\N
166	23	الحجم	Packaging	كرتونة	Carton	\N	\N
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."User" (id, name, email, "emailVerified", image, password, role, "createdAt", "updatedAt") FROM stdin;
cmmokssfm0001rtf0sdndqttp	Admin User	admin@elsalam.com	\N	\N	$2b$12$yjiH03zxD.8aTy8Ih8JkmuFqQaFkvhw8/ewj9mWyT1GwqycWdJogy	ADMIN	2026-03-13 07:29:05.266	2026-03-13 07:29:05.266
\.


--
-- Data for Name: WebOrder; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."WebOrder" (id, "customerName", "customerEmail", "customerPhone", governorate, "shippingAddress", "totalAmount", status, "createdAt", "updatedAt", "paymentMethod", "shippingFee", "userId", "discountAmount", "promoCode", notes, city, "isQuotation") FROM stdin;
7	محمد الشباسي	admin@elsalam.com	01013713596	Cairo	البحيرة دمنهور شارع المعهد الديني	3630	PENDING	2026-04-21 22:45:25.387	2026-04-22 00:56:35.197	COD	100	\N	10	\N	مصاريف شحن زيادة	\N	f
\.


--
-- Data for Name: WebOrderItem; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."WebOrderItem" (id, "orderId", "productId", quantity, "unitPrice", subtotal) FROM stdin;
33	7	8	1	1180	1180
34	7	8	2	1180	2360
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
c906140a-d5f1-40fb-a7e8-752dff06d4cd	12275ddf59009a6b171c63b56ee0d2be36f5a7f1569374e2ff2bea9f976e0e84	2026-04-17 17:05:42.045004+02	20260417150541_init_postgres	\N	\N	2026-04-17 17:05:41.963749+02	1
b6a93da0-b589-4e7b-9dcb-7ed4fe51b2c6	a371b0e6b5fcaecbd3e16667f15c037f5e1dc11b91e07a26478c9dbd757b0523	2026-04-18 14:40:51.512307+02	20260418124051_add_google_analytics_id	\N	\N	2026-04-18 14:40:51.510133+02	1
\.


--
-- Name: Category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Category_id_seq"', 10, true);


--
-- Name: ClientContact_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."ClientContact_id_seq"', 5, true);


--
-- Name: ClientOrder_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."ClientOrder_id_seq"', 1, false);


--
-- Name: Client_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Client_id_seq"', 3, true);


--
-- Name: Message_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Message_id_seq"', 9, true);


--
-- Name: News_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."News_id_seq"', 13, true);


--
-- Name: OrderItem_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."OrderItem_id_seq"', 1, false);


--
-- Name: ProductCertification_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."ProductCertification_id_seq"', 147, true);


--
-- Name: ProductFeature_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."ProductFeature_id_seq"', 180, true);


--
-- Name: ProductImage_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."ProductImage_id_seq"', 65, true);


--
-- Name: ProductPackaging_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."ProductPackaging_id_seq"', 49, true);


--
-- Name: ProductSpec_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."ProductSpec_id_seq"', 14, true);


--
-- Name: Product_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Product_id_seq"', 23, true);


--
-- Name: PromoCode_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."PromoCode_id_seq"', 2, true);


--
-- Name: Promotion_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Promotion_id_seq"', 3, true);


--
-- Name: ShippingZone_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."ShippingZone_id_seq"', 27, true);


--
-- Name: TechnicalSpec_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."TechnicalSpec_id_seq"', 166, true);


--
-- Name: WebOrderItem_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."WebOrderItem_id_seq"', 35, true);


--
-- Name: WebOrder_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."WebOrder_id_seq"', 24, true);


--
-- Name: CartItem CartItem_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CartItem"
    ADD CONSTRAINT "CartItem_pkey" PRIMARY KEY (id);


--
-- Name: Cart Cart_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Cart"
    ADD CONSTRAINT "Cart_pkey" PRIMARY KEY (id);


--
-- Name: Category Category_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Category"
    ADD CONSTRAINT "Category_pkey" PRIMARY KEY (id);


--
-- Name: ClientContact ClientContact_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ClientContact"
    ADD CONSTRAINT "ClientContact_pkey" PRIMARY KEY (id);


--
-- Name: ClientOrder ClientOrder_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ClientOrder"
    ADD CONSTRAINT "ClientOrder_pkey" PRIMARY KEY (id);


--
-- Name: Client Client_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Client"
    ADD CONSTRAINT "Client_pkey" PRIMARY KEY (id);


--
-- Name: Message Message_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Message"
    ADD CONSTRAINT "Message_pkey" PRIMARY KEY (id);


--
-- Name: News News_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."News"
    ADD CONSTRAINT "News_pkey" PRIMARY KEY (id);


--
-- Name: OrderItem OrderItem_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OrderItem"
    ADD CONSTRAINT "OrderItem_pkey" PRIMARY KEY (id);


--
-- Name: OutboxEvent OutboxEvent_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OutboxEvent"
    ADD CONSTRAINT "OutboxEvent_pkey" PRIMARY KEY (id);


--
-- Name: PageContentHistory PageContentHistory_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PageContentHistory"
    ADD CONSTRAINT "PageContentHistory_pkey" PRIMARY KEY (id);


--
-- Name: PageContent PageContent_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PageContent"
    ADD CONSTRAINT "PageContent_pkey" PRIMARY KEY (id);


--
-- Name: ProductCertification ProductCertification_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ProductCertification"
    ADD CONSTRAINT "ProductCertification_pkey" PRIMARY KEY (id);


--
-- Name: ProductFeature ProductFeature_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ProductFeature"
    ADD CONSTRAINT "ProductFeature_pkey" PRIMARY KEY (id);


--
-- Name: ProductImage ProductImage_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ProductImage"
    ADD CONSTRAINT "ProductImage_pkey" PRIMARY KEY (id);


--
-- Name: ProductPackaging ProductPackaging_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ProductPackaging"
    ADD CONSTRAINT "ProductPackaging_pkey" PRIMARY KEY (id);


--
-- Name: ProductSpec ProductSpec_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ProductSpec"
    ADD CONSTRAINT "ProductSpec_pkey" PRIMARY KEY (id);


--
-- Name: Product Product_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Product"
    ADD CONSTRAINT "Product_pkey" PRIMARY KEY (id);


--
-- Name: PromoCode PromoCode_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PromoCode"
    ADD CONSTRAINT "PromoCode_pkey" PRIMARY KEY (id);


--
-- Name: Promotion Promotion_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Promotion"
    ADD CONSTRAINT "Promotion_pkey" PRIMARY KEY (id);


--
-- Name: QuotationItem QuotationItem_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."QuotationItem"
    ADD CONSTRAINT "QuotationItem_pkey" PRIMARY KEY (id);


--
-- Name: Quotation Quotation_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Quotation"
    ADD CONSTRAINT "Quotation_pkey" PRIMARY KEY (id);


--
-- Name: ShippingZone ShippingZone_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ShippingZone"
    ADD CONSTRAINT "ShippingZone_pkey" PRIMARY KEY (id);


--
-- Name: SiteSettings SiteSettings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SiteSettings"
    ADD CONSTRAINT "SiteSettings_pkey" PRIMARY KEY (id);


--
-- Name: TechnicalSpec TechnicalSpec_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TechnicalSpec"
    ADD CONSTRAINT "TechnicalSpec_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: WebOrderItem WebOrderItem_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."WebOrderItem"
    ADD CONSTRAINT "WebOrderItem_pkey" PRIMARY KEY (id);


--
-- Name: WebOrder WebOrder_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."WebOrder"
    ADD CONSTRAINT "WebOrder_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: CartItem_cartId_productId_weightVariant_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "CartItem_cartId_productId_weightVariant_key" ON public."CartItem" USING btree ("cartId", "productId", "weightVariant");


--
-- Name: Cart_userId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Cart_userId_key" ON public."Cart" USING btree ("userId");


--
-- Name: Category_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Category_slug_key" ON public."Category" USING btree (slug);


--
-- Name: Client_createdAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Client_createdAt_idx" ON public."Client" USING btree ("createdAt");


--
-- Name: Client_name_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Client_name_idx" ON public."Client" USING btree (name);


--
-- Name: Client_repId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Client_repId_idx" ON public."Client" USING btree ("repId");


--
-- Name: Client_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Client_status_idx" ON public."Client" USING btree (status);


--
-- Name: News_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "News_slug_key" ON public."News" USING btree (slug);


--
-- Name: PageContentHistory_pageSlug_savedAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "PageContentHistory_pageSlug_savedAt_idx" ON public."PageContentHistory" USING btree ("pageSlug", "savedAt");


--
-- Name: PageContent_pageSlug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "PageContent_pageSlug_key" ON public."PageContent" USING btree ("pageSlug");


--
-- Name: Product_activePromotionId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Product_activePromotionId_key" ON public."Product" USING btree ("activePromotionId");


--
-- Name: Product_categoryId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Product_categoryId_idx" ON public."Product" USING btree ("categoryId");


--
-- Name: Product_createdAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Product_createdAt_idx" ON public."Product" USING btree ("createdAt");


--
-- Name: Product_is_featured_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Product_is_featured_idx" ON public."Product" USING btree (is_featured);


--
-- Name: Product_name_ar_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Product_name_ar_idx" ON public."Product" USING btree (name_ar);


--
-- Name: Product_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Product_slug_key" ON public."Product" USING btree (slug);


--
-- Name: Product_stock_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Product_stock_idx" ON public."Product" USING btree (stock);


--
-- Name: PromoCode_code_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "PromoCode_code_key" ON public."PromoCode" USING btree (code);


--
-- Name: PromoCode_isActive_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "PromoCode_isActive_idx" ON public."PromoCode" USING btree ("isActive");


--
-- Name: QuotationItem_quotationId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "QuotationItem_quotationId_idx" ON public."QuotationItem" USING btree ("quotationId");


--
-- Name: Quotation_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Quotation_status_idx" ON public."Quotation" USING btree (status);


--
-- Name: Quotation_userId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Quotation_userId_idx" ON public."Quotation" USING btree ("userId");


--
-- Name: ShippingZone_name_ar_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "ShippingZone_name_ar_key" ON public."ShippingZone" USING btree (name_ar);


--
-- Name: ShippingZone_name_en_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "ShippingZone_name_en_key" ON public."ShippingZone" USING btree (name_en);


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: WebOrder_createdAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "WebOrder_createdAt_idx" ON public."WebOrder" USING btree ("createdAt");


--
-- Name: WebOrder_isQuotation_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "WebOrder_isQuotation_idx" ON public."WebOrder" USING btree ("isQuotation");


--
-- Name: WebOrder_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "WebOrder_status_idx" ON public."WebOrder" USING btree (status);


--
-- Name: WebOrder_userId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "WebOrder_userId_idx" ON public."WebOrder" USING btree ("userId");


--
-- Name: CartItem CartItem_cartId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CartItem"
    ADD CONSTRAINT "CartItem_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES public."Cart"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: CartItem CartItem_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CartItem"
    ADD CONSTRAINT "CartItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Product"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Cart Cart_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Cart"
    ADD CONSTRAINT "Cart_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ClientContact ClientContact_clientId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ClientContact"
    ADD CONSTRAINT "ClientContact_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES public."Client"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ClientOrder ClientOrder_clientId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ClientOrder"
    ADD CONSTRAINT "ClientOrder_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES public."Client"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ClientOrder ClientOrder_repId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ClientOrder"
    ADD CONSTRAINT "ClientOrder_repId_fkey" FOREIGN KEY ("repId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Client Client_repId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Client"
    ADD CONSTRAINT "Client_repId_fkey" FOREIGN KEY ("repId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: OrderItem OrderItem_orderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OrderItem"
    ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES public."ClientOrder"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: OrderItem OrderItem_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OrderItem"
    ADD CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Product"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ProductCertification ProductCertification_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ProductCertification"
    ADD CONSTRAINT "ProductCertification_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Product"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ProductFeature ProductFeature_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ProductFeature"
    ADD CONSTRAINT "ProductFeature_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Product"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ProductImage ProductImage_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ProductImage"
    ADD CONSTRAINT "ProductImage_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Product"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ProductPackaging ProductPackaging_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ProductPackaging"
    ADD CONSTRAINT "ProductPackaging_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Product"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ProductSpec ProductSpec_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ProductSpec"
    ADD CONSTRAINT "ProductSpec_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Product"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Product Product_categoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Product"
    ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES public."Category"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Promotion Promotion_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Promotion"
    ADD CONSTRAINT "Promotion_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Product"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: QuotationItem QuotationItem_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."QuotationItem"
    ADD CONSTRAINT "QuotationItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Product"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: QuotationItem QuotationItem_quotationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."QuotationItem"
    ADD CONSTRAINT "QuotationItem_quotationId_fkey" FOREIGN KEY ("quotationId") REFERENCES public."Quotation"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Quotation Quotation_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Quotation"
    ADD CONSTRAINT "Quotation_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: TechnicalSpec TechnicalSpec_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TechnicalSpec"
    ADD CONSTRAINT "TechnicalSpec_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Product"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: WebOrderItem WebOrderItem_orderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."WebOrderItem"
    ADD CONSTRAINT "WebOrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES public."WebOrder"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: WebOrderItem WebOrderItem_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."WebOrderItem"
    ADD CONSTRAINT "WebOrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Product"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: WebOrder WebOrder_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."WebOrder"
    ADD CONSTRAINT "WebOrder_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

\unrestrict GHHEivtmzKeAEbchd0PZh0NvEUUmxmmgD5FtpEjkLnxknCVjXnpDlh7YbuM7zlQ

