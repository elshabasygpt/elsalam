"use client";

import React, { useState, useEffect, useRef } from "react";
import {
    Mail, Inbox, Send, Archive, Star, Trash2, Search, Filter, Loader2,
    AlertCircle, Eye, Reply, X, ChevronDown, Clock, User, Building2,
    Phone, ArrowLeft, StarOff, CheckCircle2, MessageSquare,
    ChevronRight, MailOpen, Flag, Plus, Paperclip, Download,
    Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, List, Type, Link2,
    RefreshCw, Forward, BookOpen
} from "lucide-react";

/* ─── Types ─── */
interface Message {
    id: number; name: string; email: string; phone?: string; company?: string;
    subject: string; body: string; type: string; status: string; priority: string;
    reply?: string; repliedAt?: string; repliedBy?: string; notes?: string;
    isStarred: boolean; createdAt: string; updatedAt: string;
}

interface Counts {
    total: number; new: number; read: number; replied: number; archived: number; starred: number;
}

const TYPES = [
    { value: "inquiry", label: "استفسار", icon: "❓", color: "bg-blue-50 text-blue-700 border-blue-100" },
    { value: "complaint", label: "شكوى", icon: "⚠️", color: "bg-red-50 text-red-700 border-red-100" },
    { value: "suggestion", label: "اقتراح", icon: "💡", color: "bg-amber-50 text-amber-700 border-amber-100" },
    { value: "order", label: "طلب", icon: "📦", color: "bg-green-50 text-green-700 border-green-100" },
    { value: "partnership", label: "شراكة", icon: "🤝", color: "bg-purple-50 text-purple-700 border-purple-100" },
];

const PRIORITIES = [
    { value: "low", label: "منخفض", color: "text-slate-400" },
    { value: "normal", label: "عادي", color: "text-blue-500" },
    { value: "high", label: "مرتفع", color: "text-orange-500" },
    { value: "urgent", label: "عاجل", color: "text-red-500" },
];

const SIDEBAR_ITEMS = [
    { id: "all", label: "كل الرسائل", icon: Inbox, countKey: "total" },
    { id: "new", label: "غير مقروءة", icon: Mail, countKey: "new" },
    { id: "read", label: "مقروءة", icon: MailOpen, countKey: "read" },
    { id: "replied", label: "تم الرد", icon: Send, countKey: "replied" },
    { id: "starred", label: "مميزة بنجمة", icon: Star, countKey: "starred" },
    { id: "archived", label: "الأرشيف", icon: Archive, countKey: "archived" },
];

function timeAgo(date: string) {
    const d = new Date(date);
    const now = new Date();
    const diff = Math.floor((now.getTime() - d.getTime()) / 1000);
    if (diff < 60) return "الآن";
    if (diff < 3600) return `منذ ${Math.floor(diff / 60)} دقيقة`;
    if (diff < 86400) return `منذ ${Math.floor(diff / 3600)} ساعة`;
    if (diff < 604800) return `منذ ${Math.floor(diff / 86400)} يوم`;
    return d.toLocaleDateString("ar-EG", { month: "short", day: "numeric" });
}

export default function AdminInboxPage() {
    const [viewMode, setViewMode] = useState<"internal" | "webmail">("internal");
    const [messages, setMessages] = useState<Message[]>([]);
    const [counts, setCounts] = useState<Counts>({ total: 0, new: 0, read: 0, replied: 0, archived: 0, starred: 0 });
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState("all");
    const [typeFilter, setTypeFilter] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedMsg, setSelectedMsg] = useState<Message | null>(null);
    const [replyText, setReplyText] = useState("");
    const [replying, setReplying] = useState(false);
    const [showReplyBox, setShowReplyBox] = useState(false);
    const [success, setSuccess] = useState("");

    const fetchMessages = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (activeFilter === "starred") params.set("starred", "true");
            else if (activeFilter !== "all") params.set("status", activeFilter);
            if (typeFilter !== "all") params.set("type", typeFilter);
            const res = await fetch(`/api/admin/messages?${params}`);
            if (res.ok) {
                const data = await res.json();
                setMessages(data.messages);
                setCounts(data.counts);
            }
        } catch { }
        setLoading(false);
    };

    useEffect(() => { fetchMessages(); }, [activeFilter, typeFilter]);

    const selectMessage = async (msg: Message) => {
        setSelectedMsg(msg);
        setShowReplyBox(false);
        setReplyText("");
        // Mark as read
        if (msg.status === "new") {
            await fetch(`/api/admin/messages/${msg.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: "read" }) });
            fetchMessages();
        }
    };

    const toggleStar = async (id: number, current: boolean, e?: React.MouseEvent) => {
        e?.stopPropagation();
        await fetch(`/api/admin/messages/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ isStarred: !current }) });
        fetchMessages();
        if (selectedMsg?.id === id) setSelectedMsg({ ...selectedMsg, isStarred: !current });
    };

    const handleReply = async () => {
        if (!replyText.trim() || !selectedMsg) return;
        setReplying(true);
        try {
            const res = await fetch(`/api/admin/messages/${selectedMsg.id}`, {
                method: "PUT", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ reply: replyText }),
            });
            if (res.ok) {
                const updated = await res.json();
                setSelectedMsg(updated);
                setShowReplyBox(false);
                setReplyText("");
                setSuccess("تم إرسال الرد بنجاح");
                setTimeout(() => setSuccess(""), 3000);
                fetchMessages();
            }
        } catch { }
        setReplying(false);
    };

    const handleArchive = async (id: number) => {
        await fetch(`/api/admin/messages/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: "archived" }) });
        setSelectedMsg(null);
        fetchMessages();
    };

    const handleDelete = async (id: number) => {
        if (!confirm("هل أنت متأكد من حذف هذه الرسالة؟")) return;
        await fetch(`/api/admin/messages/${id}`, { method: "DELETE" });
        setSelectedMsg(null);
        fetchMessages();
    };

    const getTypeInfo = (type: string) => TYPES.find(t => t.value === type) || TYPES[0];
    const getPriorityInfo = (p: string) => PRIORITIES.find(pr => pr.value === p) || PRIORITIES[1];

    const filteredMessages = messages.filter(m =>
        !searchQuery || m.subject.includes(searchQuery) || m.name.includes(searchQuery) || m.email.includes(searchQuery)
    );

    return (
        <div className="space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-slate-800">{viewMode === "internal" ? "البريد الوارد (Internal)" : "البريد الوارد (Webmail)"}</h1>
                    <p className="text-slate-400 text-sm mt-1">{viewMode === "internal" ? "إدارة طلبات ورسائل الموقع الداخلية" : "قراءة البريد الرسمي المباشر وإرسال رسائل جديدة"}</p>
                </div>
                <div className="flex items-center gap-3 bg-slate-100 p-1 rounded-xl">
                    <button onClick={() => setViewMode("internal")} className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${viewMode === "internal" ? "bg-white text-slate-800 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}>طلبات الموقع</button>
                    <button onClick={() => setViewMode("webmail")} className={`px-4 py-2 text-sm font-bold rounded-lg transition-all flex items-center gap-2 ${viewMode === "webmail" ? "bg-green-600 text-white shadow-sm shadow-green-600/20" : "text-slate-400 hover:text-slate-600"}`}><Mail className="w-5 h-5"/> صندوق البريد</button>
                </div>
            </div>

            {viewMode === "webmail" ? (
                <WebmailInbox />
            ) : (
                <>

            {success && (
                <div className="flex items-center gap-2 p-3 bg-green-50 text-green-700 rounded-xl text-sm font-bold border border-green-100">
                    <CheckCircle2 className="w-5 h-5" /> {success}
                </div>
            )}

            <div className="flex gap-5 h-[calc(100vh-220px)] min-h-[500px]">
                {/* ─── Left Sidebar ─── */}
                <div className="w-56 shrink-0 space-y-1.5">
                    {SIDEBAR_ITEMS.map((item) => {
                        const count = counts[item.countKey as keyof Counts] || 0;
                        const active = activeFilter === item.id;
                        return (
                            <button key={item.id} onClick={() => { setActiveFilter(item.id); setSelectedMsg(null); }}
                                className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-[13px] font-bold transition-all ${active ? "bg-green-600 text-white shadow-lg shadow-green-600/15" : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"}`}>
                                <item.icon className={`w-5 h-5 ${active ? "text-white" : ""}`} />
                                <span className="flex-1 text-right">{item.label}</span>
                                {count > 0 && (
                                    <span className={`text-[10px] min-w-[20px] text-center px-1.5 py-0.5 rounded-full font-black ${active ? "bg-white/20 text-white" : item.id === "new" ? "bg-red-100 text-red-600" : "bg-slate-100 text-slate-500"}`}>{count}</span>
                                )}
                            </button>
                        );
                    })}

                    <hr className="border-gray-100 my-3" />

                    {/* Type Filter */}
                    <div className="px-2 mb-2">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">حسب النوع</p>
                    </div>
                    {TYPES.map((t) => (
                        <button key={t.value} onClick={() => { setTypeFilter(typeFilter === t.value ? "all" : t.value); setSelectedMsg(null); }}
                            className={`w-full flex items-center gap-2 px-3.5 py-2 rounded-lg text-[12px] font-bold transition-all ${typeFilter === t.value ? "bg-slate-100 text-slate-800" : "text-slate-400 hover:bg-slate-50 hover:text-slate-600"}`}>
                            <span>{t.icon}</span> {t.label}
                        </button>
                    ))}
                </div>

                {/* ─── Message List ─── */}
                <div className={`${selectedMsg ? "w-[360px]" : "flex-1"} bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm flex flex-col shrink-0`}>
                    {/* Search */}
                    <div className="px-4 py-3 border-b border-gray-50 flex items-center gap-2">
                        <div className="flex-1 relative">
                            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                            <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pr-9 pl-3 py-2 bg-slate-50 rounded-lg border border-transparent focus:border-green-200 focus:bg-white outline-none text-sm text-slate-700 placeholder:text-slate-300"
                                placeholder="بحث في الرسائل..." />
                        </div>
                    </div>

                    {/* List */}
                    <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
                        {loading ? (
                            <div className="flex items-center justify-center py-20"><Loader2 className="w-7 h-7 text-green-500 animate-spin" /></div>
                        ) : filteredMessages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-center px-6">
                                <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4"><Inbox className="w-8 h-8 text-slate-300" /></div>
                                <h3 className="text-lg font-bold text-slate-500 mb-1">لا توجد رسائل</h3>
                                <p className="text-slate-400 text-xs">ستظهر الرسائل الواردة هنا</p>
                            </div>
                        ) : (
                            filteredMessages.map((msg) => {
                                const typeInfo = getTypeInfo(msg.type);
                                const isSelected = selectedMsg?.id === msg.id;
                                const isNew = msg.status === "new";
                                return (
                                    <button key={msg.id} onClick={() => selectMessage(msg)}
                                        className={`w-full text-right px-4 py-3.5 transition-all hover:bg-blue-50/30 ${isSelected ? "bg-green-50/50 border-r-[3px] border-green-500" : ""} ${isNew ? "bg-blue-50/20" : ""}`}>
                                        <div className="flex items-start gap-3">
                                            {/* Avatar */}
                                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-black shrink-0 ${isNew ? "bg-gradient-to-br from-green-500 to-emerald-600" : "bg-slate-300"}`}>
                                                {msg.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between gap-2">
                                                    <span className={`text-sm truncate ${isNew ? "font-black text-slate-800" : "font-bold text-slate-600"}`}>{msg.name}</span>
                                                    <span className="text-[10px] text-slate-400 whitespace-nowrap">{timeAgo(msg.createdAt)}</span>
                                                </div>
                                                <div className={`text-[12px] truncate mt-0.5 ${isNew ? "font-bold text-slate-700" : "text-slate-500"}`}>{msg.subject}</div>
                                                <div className="flex items-center gap-1.5 mt-1.5">
                                                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold border ${typeInfo.color}`}>{typeInfo.icon} {typeInfo.label}</span>
                                                    {msg.isStarred && <Star className="w-5 h-5 text-amber-500 fill-amber-500" />}
                                                    {isNew && <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />}
                                                    {msg.priority === "urgent" && <Flag className="w-5 h-5 text-red-500 fill-red-500" />}
                                                    {msg.priority === "high" && <Flag className="w-5 h-5 text-orange-500" />}
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* ─── Message Detail ─── */}
                {selectedMsg && (
                    <div className="flex-1 bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm flex flex-col">
                        {/* Detail Header */}
                        <div className="px-5 py-3.5 border-b border-gray-50 flex items-center justify-between">
                            <button onClick={() => setSelectedMsg(null)} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all">
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                            <div className="flex items-center gap-1.5">
                                <button onClick={() => toggleStar(selectedMsg.id, selectedMsg.isStarred)}
                                    className={`p-2 rounded-lg transition-all ${selectedMsg.isStarred ? "text-amber-500 bg-amber-50 hover:bg-amber-100" : "text-slate-300 hover:text-amber-500 hover:bg-amber-50"}`}
                                    title={selectedMsg.isStarred ? "إزالة النجمة" : "تمييز بنجمة"}>
                                    <Star className={`w-5 h-5 ${selectedMsg.isStarred ? "fill-amber-500" : ""}`} />
                                </button>
                                <button onClick={() => handleArchive(selectedMsg.id)}
                                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="أرشفة">
                                    <Archive className="w-5 h-5" />
                                </button>
                                <button onClick={() => handleDelete(selectedMsg.id)}
                                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all" title="حذف">
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Detail Content */}
                        <div className="flex-1 overflow-y-auto p-5 space-y-5">
                            {/* Subject */}
                            <div>
                                <h2 className="text-xl font-black text-slate-800 mb-2">{selectedMsg.subject}</h2>
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className={`text-[10px] px-2 py-0.5 rounded-lg font-bold border ${getTypeInfo(selectedMsg.type).color}`}>
                                        {getTypeInfo(selectedMsg.type).icon} {getTypeInfo(selectedMsg.type).label}
                                    </span>
                                    <span className={`text-[10px] font-bold ${getPriorityInfo(selectedMsg.priority).color}`}>
                                        ● {getPriorityInfo(selectedMsg.priority).label}
                                    </span>
                                    <span className="text-[10px] text-slate-400">
                                        {new Date(selectedMsg.createdAt).toLocaleDateString("ar-EG", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                                    </span>
                                </div>
                            </div>

                            {/* Sender Info */}
                            <div className="bg-slate-50 rounded-xl p-4 space-y-2.5">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-black">
                                        {selectedMsg.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <div className="font-bold text-sm text-slate-800">{selectedMsg.name}</div>
                                        <div className="text-[11px] text-slate-400" dir="ltr">{selectedMsg.email}</div>
                                    </div>
                                </div>
                                {(selectedMsg.phone || selectedMsg.company) && (
                                    <div className="flex items-center gap-4 text-[11px] text-slate-500 pt-1">
                                        {selectedMsg.phone && <span className="flex items-center gap-1"><Phone className="w-5 h-5" /> {selectedMsg.phone}</span>}
                                        {selectedMsg.company && <span className="flex items-center gap-1"><Building2 className="w-5 h-5" /> {selectedMsg.company}</span>}
                                    </div>
                                )}
                            </div>

                            {/* Message Body */}
                            <div className="prose prose-sm max-w-none text-slate-700 leading-loose text-sm whitespace-pre-wrap">
                                {selectedMsg.body}
                            </div>

                            {/* Existing Reply */}
                            {selectedMsg.reply && (
                                <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Send className="w-5 h-5 text-green-600" />
                                        <span className="text-[11px] font-bold text-green-700">تم الرد</span>
                                        <span className="text-[10px] text-green-500">
                                            بواسطة {selectedMsg.repliedBy} — {selectedMsg.repliedAt && new Date(selectedMsg.repliedAt).toLocaleDateString("ar-EG", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                                        </span>
                                    </div>
                                    <div className="text-sm text-green-800 leading-relaxed whitespace-pre-wrap">{selectedMsg.reply}</div>
                                </div>
                            )}

                            {/* Reply Box */}
                            {showReplyBox && (
                                <div className="border border-green-200 rounded-xl overflow-hidden">
                                    <div className="px-4 py-2.5 bg-green-50 border-b border-green-100 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Reply className="w-5 h-5 text-green-600" />
                                            <span className="text-xs font-bold text-green-700">الرد على {selectedMsg.name}</span>
                                        </div>
                                        <button onClick={() => setShowReplyBox(false)} className="p-1 text-green-400 hover:text-green-600"><X className="w-5 h-5" /></button>
                                    </div>
                                    <textarea
                                        value={replyText} onChange={(e) => setReplyText(e.target.value)}
                                        rows={5}
                                        className="w-full px-4 py-3 text-sm outline-none resize-none placeholder:text-slate-300 text-slate-700 leading-relaxed"
                                        placeholder="اكتب ردك هنا... سيتم إرساله للبريد الإلكتروني إذا تم ضبط إعدادات SMTP"
                                    />
                                    <div className="px-4 py-3 bg-slate-50 border-t border-gray-100 flex items-center justify-between">
                                        <span className="text-[10px] text-slate-400">يتم الإرسال من info@elsalamoil.com</span>
                                        <button onClick={handleReply} disabled={replying || !replyText.trim()}
                                            className="inline-flex items-center gap-1.5 bg-green-600 text-white px-4 py-2 rounded-lg font-bold text-xs hover:bg-green-700 transition-all disabled:opacity-50">
                                            {replying ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                                            إرسال الرد
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Reply Action Bar */}
                        {!showReplyBox && (
                            <div className="px-5 py-3 border-t border-gray-50 flex items-center gap-2">
                                <button onClick={() => setShowReplyBox(true)}
                                    className="flex-1 inline-flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-green-700 transition-all">
                                    <Reply className="w-5 h-5" /> {selectedMsg.reply ? "رد جديد" : "الرد على الرسالة"}
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
            </>
            )}
        </div>
    );
}

// -------------------------------------------------------------
// Webmail Component
// -------------------------------------------------------------
function WebmailInbox() {
    const [emails, setEmails] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [selectedEmail, setSelectedEmail] = useState<any | null>(null);
    const [showCompose, setShowCompose] = useState(false);
    const [folder, setFolder] = useState<"INBOX" | "Sent">("INBOX");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [showCc, setShowCc] = useState(false);
    const [showBcc, setShowBcc] = useState(false);

    const defaultSignature = "<br><br><br><br><p style='color: gray; font-size: 14px;'>مع خالص التحيات،<br><b>قسم الإدارة - مصنع السلام</b></p>";
    const [form, setForm] = useState({ to: "", cc: "", bcc: "", subject: "", html: defaultSignature });
    const [attachments, setAttachments] = useState<any[]>([]);
    const [sending, setSending] = useState(false);
    
    // Address Book states
    const [clients, setClients] = useState<any[]>([]);
    const [showAddressBook, setShowAddressBook] = useState(false);
    const [addressSearch, setAddressSearch] = useState("");

    const editorRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [savedSelection, setSavedSelection] = useState<Range | null>(null);

    useEffect(() => {
        fetch("/api/admin/clients")
            .then(res => res.json())
            .then(data => setClients(data))
            .catch(console.error);
    }, []);

    const saveSelection = () => {
        const sel = window.getSelection();
        if (sel && sel.rangeCount > 0) {
            setSavedSelection(sel.getRangeAt(0));
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        files.forEach(file => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                setAttachments(prev => [...prev, { filename: file.name, size: file.size, contentUrl: reader.result as string }]);
            };
        });
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const execCmd = (cmd: string, val?: string) => {
        if (savedSelection) {
            const sel = window.getSelection();
            sel?.removeAllRanges();
            sel?.addRange(savedSelection);
        }
        document.execCommand(cmd, false, val);
        editorRef.current?.focus();
        saveSelection();
    };

    const fetchEmails = async (targetFolder = folder, targetPage = page, targetSearch = searchQuery) => {
        setLoading(true); setError(""); 
        if (targetPage === 1) setEmails([]); 
        setSelectedEmail(null);
        try {
            const res = await fetch(`/api/admin/webmail?folder=${targetFolder}&page=${targetPage}&search=${targetSearch}`);
            const data = await res.json();
            if (res.ok) {
                if (targetPage === 1) setEmails(data.emails);
                else setEmails(prev => [...prev, ...data.emails]);
                setTotalPages(data.totalPages || 1);
            }
            else setError(data.error || "فشل الاتصال بـ IMAP");
        } catch { setError("حدث خطأ أثناء جلب الرسائل"); }
        setLoading(false);
    };

    const handleSelectEmail = async (email: any) => {
        setSelectedEmail(email);
        if (!email.isRead) {
            setEmails(prev => prev.map(m => m.uid === email.uid ? { ...m, isRead: true } : m));
            try {
                await fetch('/api/admin/webmail/action', {
                    method: 'POST', headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ uid: email.uid, action: 'markRead', folder })
                });
            } catch {}
        }
    };

    const handleDelete = async () => {
        if (!selectedEmail) return;
        if (!confirm("هل أنت متأكد من حذف هذه الرسالة؟")) return;
        
        try {
            await fetch('/api/admin/webmail/action', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ uid: selectedEmail.uid, action: 'delete', folder })
            });
            setSelectedEmail(null);
            fetchEmails(folder, 1, searchQuery); 
        } catch {}
    };

    useEffect(() => { 
        setPage(1); 
        fetchEmails(folder, 1, searchQuery); 
    }, [folder, searchQuery]);

    useEffect(() => {
        if (showCompose && editorRef.current && editorRef.current.innerHTML !== form.html) {
            editorRef.current.innerHTML = form.html;
        }
    }, [showCompose, form.html]);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSearchQuery(searchInput);
    };

    const handleSend = async () => {
        const htmlBody = editorRef.current?.innerHTML || "";
        if (!form.to || !form.subject || !htmlBody.trim()) {
            setError("يرجى ملء كافة بيانات الرسالة والموضوع.");
            return;
        }
        setSending(true); setError("");
        try {
            const res = await fetch("/api/admin/webmail/send", {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...form, html: htmlBody, attachments })
            });
            if (res.ok) {
                setShowCompose(false); 
                setForm({ to: "", cc: "", bcc: "", subject: "", html: defaultSignature });
                setAttachments([]);
                if (editorRef.current) editorRef.current.innerHTML = "";
                alert("تم إرسال الرسالة بنجاح!");
            } else { const d = await res.json(); setError(d.error); }
        } catch { setError("حدث خطأ أثناء الإرسال"); }
        setSending(false);
    };

    return (
        <div className="flex gap-5 h-[calc(100vh-180px)] min-h-[600px] relative">
            {/* Sidebar List */}
            <div className={`${selectedEmail ? "w-[360px]" : "flex-1"} bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm flex flex-col shrink-0 transition-all`}>
                <div className="px-4 py-3 border-b border-gray-50 flex items-center justify-between">
                    <button onClick={() => {
                        setForm({ to: "", cc: "", bcc: "", subject: "", html: defaultSignature });
                        setShowCompose(true);
                    }} className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-green-700 transition-all shadow-md shadow-green-600/15">
                        <Plus className="w-5 h-5"/> رسالة جديدة
                    </button>
                    <div className="flex gap-2">
                        <button onClick={() => fetchEmails(folder, 1, searchQuery)} disabled={loading} className="flex items-center justify-center bg-white border border-slate-200 text-slate-600 w-10 h-10 rounded-xl hover:bg-slate-50 transition-all shadow-sm">
                            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin text-green-600' : ''}`} />
                        </button>
                        <div className="flex bg-slate-100 rounded-lg p-1">
                            <button onClick={() => setFolder("INBOX")} className={`text-xs font-bold px-3 py-1.5 rounded-md transition-all ${folder === "INBOX" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>الوارد</button>
                            <button onClick={() => setFolder("Sent")} className={`text-xs font-bold px-3 py-1.5 rounded-md transition-all ${folder === "Sent" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>الصادر</button>
                        </div>
                    </div>
                </div>

                <div className="px-4 py-3 bg-slate-50 border-b border-gray-100">
                    <form onSubmit={handleSearchSubmit} className="relative">
                        <input type="text" placeholder="البحث في الرسائل..." className="w-full pr-10 pl-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-semibold outline-none focus:border-green-500 transition-colors shadow-sm" value={searchInput} onChange={(e) => setSearchInput(e.target.value)}/>
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <button type="submit" className="hidden"></button>
                    </form>
                </div>

                <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
                    {loading && emails.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20"><Loader2 className="w-8 h-8 text-green-500 animate-spin mb-4" /><p className="text-sm font-bold text-slate-400 animate-pulse">جاري الاتصال وسحب الرسائل (IMAP)...</p></div>
                    ) : error && emails.length === 0 ? (
                        <div className="p-6 text-center text-red-500 font-bold text-sm bg-red-50 m-4 rounded-xl border border-red-100">{error}</div>
                    ) : emails.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-slate-400 text-sm font-bold"><Inbox className="w-12 h-12 mb-3 opacity-20" /> لا توجد رسائل خارجية</div>
                    ) : (
                        emails.map((msg, i) => {
                            const isUnread = !msg.isRead;
                            return (
                                <button key={i} onClick={() => handleSelectEmail(msg)} className={`w-full text-right px-4 py-4 transition-all hover:bg-slate-50 flex items-start gap-3 border-b border-gray-50 last:border-0 ${selectedEmail?.uid === msg.uid ? "bg-green-50/70 border-r-[3px] border-green-500" : isUnread ? "bg-blue-50/40 border-r-[3px] border-transparent" : "bg-white border-r-[3px] border-transparent"}`}>
                                    
                                    {/* Unread Indicator */}
                                    <div className="pt-1.5 shrink-0">
                                        {isUnread ? (
                                            <div className="w-2.5 h-2.5 bg-blue-500 rounded-full shadow-[0_0_5px_rgba(59,130,246,0.5)]" />
                                        ) : (
                                            <div className="w-2.5 h-2.5 rounded-full border-2 border-slate-200" />
                                        )}
                                    </div>
                                    
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className={`text-sm ${isUnread ? "font-black text-slate-800" : "font-bold text-slate-500"} truncate`}>{msg.fromName || msg.from}</span>
                                            <span className="text-[10px] text-slate-400 whitespace-nowrap pl-1" dir="ltr">{new Date(msg.date).toLocaleDateString()}</span>
                                        </div>
                                        <div className={`text-xs ${isUnread ? "font-bold text-slate-700" : "text-slate-400"} truncate`}>{msg.subject || "بدون عنوان"}</div>
                                        <div className="text-[11px] text-slate-400 truncate mt-1 opacity-80">{msg.text.substring(0, 60)}{msg.text.length > 60 && "..."}</div>
                                    </div>
                                </button>
                            );
                        })
                    )}
                    
                    {emails.length > 0 && page < totalPages && (
                        <div className="p-4 flex justify-center border-t border-slate-50">
                            <button onClick={() => setPage(page + 1)} disabled={loading} className="px-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-bold transition-colors disabled:opacity-50">
                                {loading ? "جاري التحميل..." : "عرض رسائل أقدم"}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Email Viewer */}
            {selectedEmail && (
                <div className="flex-1 bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm flex flex-col relative">
                    <div className="px-6 py-4 border-b border-gray-50 bg-slate-50/50">
                        <div className="flex items-center justify-between mb-4">
                            <button onClick={() => setSelectedEmail(null)} className="text-slate-400 hover:text-slate-600"><ArrowLeft className="w-5 h-5"/></button>
                            <div className="flex gap-2">
                                <button onClick={handleDelete} className="flex items-center gap-1.5 text-sm font-bold bg-white border border-gray-200 text-red-500 px-3 py-1.5 rounded-lg hover:border-red-300 hover:bg-red-50 shadow-sm transition-all">
                                    <Trash2 className="w-5 h-5"/> حذف
                                </button>
                                <button onClick={() => {
                                    const quote = `<br/><br/><div dir="rtl" style="border-right: 3px solid #cbd5e1; padding-right: 15px; color: #64748b; margin-top: 20px;">
                                        <p><strong>في ${new Date(selectedEmail.date).toLocaleString('ar-EG')}، كتب ${selectedEmail.fromName || selectedEmail.from}:</strong></p>
                                        <blockquote style="margin: 0;">${selectedEmail.html}</blockquote>
                                    </div>${defaultSignature}`;
                                    setForm({ to: selectedEmail.from, cc: "", bcc: "", subject: `Re: ${selectedEmail.subject}`, html: quote });
                                    setShowCompose(true);
                                }} className="flex items-center gap-1.5 text-sm font-bold bg-white border border-gray-200 text-slate-600 px-3 py-1.5 rounded-lg hover:border-green-300 hover:text-green-700 shadow-sm transition-all">
                                    <Reply className="w-5 h-5"/> رد
                                </button>
                                <button onClick={() => {
                                    const quote = `<br/><br/><div dir="rtl" style="border-right: 3px solid #cbd5e1; padding-right: 15px; color: #64748b; margin-top: 20px;">
                                        <p><strong>---------- رسالة مُعاد توجيهها ----------</strong><br/>
                                        من: ${selectedEmail.fromName || selectedEmail.from}<br/>
                                        التاريخ: ${new Date(selectedEmail.date).toLocaleString('ar-EG')}<br/>
                                        الموضوع: ${selectedEmail.subject}</p>
                                        <blockquote style="margin: 0; margin-top: 15px;">${selectedEmail.html}</blockquote>
                                    </div>${defaultSignature}`;
                                    setForm({ to: "", cc: "", bcc: "", subject: `Fwd: ${selectedEmail.subject}`, html: quote });
                                    setShowCompose(true);
                                }} className="flex items-center gap-1.5 text-sm font-bold bg-white border border-gray-200 text-slate-600 px-3 py-1.5 rounded-lg hover:border-blue-300 hover:text-blue-700 shadow-sm transition-all">
                                    <Forward className="w-5 h-5"/> إعادة توجيه
                                </button>
                            </div>
                        </div>
                        <h2 className="text-xl font-black text-slate-800 mb-3">{selectedEmail.subject}</h2>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-black">{selectedEmail.fromName?.charAt(0) || selectedEmail.from?.charAt(0) || "U"}</div>
                            <div>
                                <div className="text-sm font-bold text-slate-700">{selectedEmail.fromName || "Unknown"}</div>
                                <div className="text-xs text-slate-500" dir="ltr">{selectedEmail.from}</div>
                            </div>
                        </div>
                    </div>
                    {selectedEmail.attachments && selectedEmail.attachments.length > 0 && (
                        <div className="px-6 py-3 border-b border-gray-50 flex gap-3 flex-wrap bg-slate-50">
                            {selectedEmail.attachments.map((att: any, i: number) => (
                                <a key={i} href={att.contentUrl} download={att.filename || `attachment-${i}`} className="inline-flex items-center gap-2 bg-white border border-gray-200 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 hover:border-green-300 hover:text-green-700 transition-all shadow-sm">
                                    <Paperclip className="w-3.5 h-3.5" />
                                    <span className="truncate max-w-[150px]" dir="ltr">{att.filename}</span>
                                    <span className="text-[9px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">{(att.size / 1024).toFixed(1)}KB</span>
                                </a>
                            ))}
                        </div>
                    )}
                    <div className="flex-1 overflow-y-auto p-6 bg-white prose prose-sm max-w-none prose-img:rounded-xl prose-a:text-blue-600" dangerouslySetInnerHTML={{__html: selectedEmail.html}} />
                </div>
            )}

            {/* Compose Modal */}
            {showCompose && (
                <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col">
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-slate-50 rounded-t-2xl">
                            <div className="flex items-center gap-2 text-slate-800 font-black"><Send className="w-5 h-5 text-green-600" /> رسالة جديدة</div>
                            <button onClick={() => setShowCompose(false)} className="text-slate-400 hover:text-red-500"><X className="w-6 h-6"/></button>
                        </div>
                        <div className="p-6 space-y-4 flex-1 flex flex-col min-h-[400px]">
                            {error && <div className="p-3 bg-red-50 text-red-600 text-xs font-bold rounded-xl border border-red-100">{error}</div>}
                            <div className="flex gap-2 items-center bg-slate-50 rounded-xl px-4 py-1.5 border border-slate-200 focus-within:border-green-500 transition-colors">
                                <label className="text-xs font-bold text-slate-400 w-12 shrink-0">إلى:</label>
                                <input type="email" placeholder="المرسل إليه" dir="ltr" className="flex-1 bg-transparent border-none outline-none text-sm font-semibold h-10 py-1" value={form.to} onChange={e => setForm({...form, to: e.target.value})}/>
                                <div className="flex gap-1 relative">
                                    <button type="button" onClick={() => setShowAddressBook(!showAddressBook)} className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-green-50 text-green-700 text-sm font-bold hover:bg-green-100 transition-all">
                                        <BookOpen className="w-5 h-5"/> العملاء
                                    </button>
                                    
                                    {showAddressBook && (() => {
                                        const filtered = clients.map(c => {
                                            if (!addressSearch) return c;
                                            return {
                                                ...c,
                                                contacts: c.contacts?.filter((contact: any) => 
                                                    contact.personName?.toLowerCase().includes(addressSearch.toLowerCase()) || 
                                                    contact.department?.toLowerCase().includes(addressSearch.toLowerCase()) || 
                                                    contact.email.toLowerCase().includes(addressSearch.toLowerCase())
                                                )
                                            };
                                        }).filter(c => 
                                            (c.name.toLowerCase().includes(addressSearch.toLowerCase()) || 
                                            c.company?.toLowerCase().includes(addressSearch.toLowerCase()) ||
                                            (c.contacts && c.contacts.length > 0)) && c.contacts && c.contacts.length > 0
                                        );

                                        return (
                                            <div className="absolute top-full right-0 mt-2 w-[320px] bg-white border border-slate-200 rounded-xl shadow-2xl z-50 flex flex-col max-h-[350px] overflow-hidden" dir="rtl">
                                                <div className="p-2 border-b border-slate-100 bg-slate-50">
                                                    <div className="relative">
                                                        <Search className="w-5 h-5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                                                        <input 
                                                            type="text" 
                                                            placeholder="بحث بالاسم، القسم أو البريد..." 
                                                            className="w-full pl-3 pr-10 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-lg outline-none focus:border-green-500 transition-colors"
                                                            value={addressSearch}
                                                            onChange={(e) => setAddressSearch(e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="overflow-y-auto p-2">
                                                    {filtered.map(c => (
                                                        <div key={c.id} className="mb-2">
                                                            <div className="text-xs font-black text-slate-800 px-2 py-1 bg-slate-50 rounded-t-lg">{c.company || c.name}</div>
                                                            <div className="border border-t-0 border-slate-100 rounded-b-lg overflow-hidden">
                                                                {c.contacts.map((contact: any, i: number) => (
                                                                    <button 
                                                                        key={i} 
                                                                        type="button" 
                                                                        onClick={() => { setForm({...form, to: contact.email}); setShowAddressBook(false); setAddressSearch(""); }} 
                                                                        className="w-full text-right flex flex-col px-3 py-2 hover:bg-green-50 border-b border-slate-50 last:border-0 group transition-colors"
                                                                    >
                                                                        <div className="flex items-center justify-end gap-1.5 text-xs font-bold text-slate-600 group-hover:text-green-700">
                                                                            {contact.department || "عام"} {contact.personName ? `(${contact.personName})` : ''}
                                                                            <User style={{ width: '18px', height: '18px', minWidth: '18px' }} className="text-red-500 group-hover:text-green-600 shrink-0 ml-1" />
                                                                        </div>
                                                                        <div className="text-[11px] font-mono text-slate-500 mt-0.5" dir="ltr">{contact.email}</div>
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ))}
                                                    {filtered.length === 0 && <div className="text-xs text-center text-slate-500 py-4 font-bold">لا يوجد نتائج</div>}
                                                </div>
                                            </div>
                                        );
                                    })()}

                                    <button onClick={() => setShowCc(!showCc)} className={`text-xs font-bold px-2 py-1.5 rounded transition-all ${showCc ? "bg-slate-200 text-slate-800" : "text-slate-400 hover:bg-slate-200"}`}>CC</button>
                                    <button onClick={() => setShowBcc(!showBcc)} className={`text-xs font-bold px-2 py-1.5 rounded transition-all ${showBcc ? "bg-slate-200 text-slate-800" : "text-slate-400 hover:bg-slate-200"}`}>BCC</button>
                                </div>
                            </div>
                            {showCc && <div className="flex gap-2 items-center bg-slate-50 rounded-xl px-4 py-1.5 border border-slate-200 focus-within:border-green-500 transition-colors"><label className="text-xs font-bold text-slate-400 w-12 shrink-0">CC:</label><input type="email" dir="ltr" className="flex-1 bg-transparent border-none outline-none text-sm font-semibold h-10 py-1" value={form.cc} onChange={e => setForm({...form, cc: e.target.value})}/></div>}
                            {showBcc && <div className="flex gap-2 items-center bg-slate-50 rounded-xl px-4 py-1.5 border border-slate-200 focus-within:border-green-500 transition-colors"><label className="text-xs font-bold text-slate-400 w-12 shrink-0">BCC:</label><input type="email" dir="ltr" className="flex-1 bg-transparent border-none outline-none text-sm font-semibold h-10 py-1" value={form.bcc} onChange={e => setForm({...form, bcc: e.target.value})}/></div>}
                            
                            <input type="text" placeholder="الموضوع" className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-green-500 text-sm font-semibold" value={form.subject} onChange={e => setForm({...form, subject: e.target.value})}/>
                            
                            {/* Rich Text Editor */}
                            <div className="border border-slate-200 rounded-xl overflow-hidden flex flex-col flex-1 bg-slate-50">
                                {/* Toolbar */}
                                {/* Toolbar */}
                                <div className="border-b border-slate-200 bg-white p-2.5 flex flex-wrap gap-1.5 items-center">
                                    <select onChange={(e) => execCmd('fontName', e.target.value)} className="p-2 border border-slate-200 rounded-lg text-sm text-slate-600 outline-none hover:bg-slate-50 cursor-pointer">
                                        <option value="Cairo">Cairo (افتراضي)</option>
                                        <option value="Arial">Arial</option>
                                        <option value="Tahoma">Tahoma</option>
                                        <option value="Times New Roman">Times New Roman</option>
                                    </select>
                                    <select onChange={(e) => execCmd('fontSize', e.target.value)} className="p-2 border border-slate-200 rounded-lg text-sm text-slate-600 outline-none hover:bg-slate-50 cursor-pointer">
                                        <option value="3">حجم عادي</option>
                                        <option value="1">صغير جداً</option>
                                        <option value="2">صغير</option>
                                        <option value="4">كبير</option>
                                        <option value="5">كبير جداً</option>
                                        <option value="6">ضخم</option>
                                    </select>
                                    <div className="w-px h-5 bg-slate-200 mx-2"></div>
                                    <button onMouseDown={(e) => { e.preventDefault(); execCmd('bold'); }} className="p-2 hover:bg-slate-100 rounded text-slate-600" title="عريض"><Bold className="w-5 h-5"/></button>
                                    <button onMouseDown={(e) => { e.preventDefault(); execCmd('italic'); }} className="p-2 hover:bg-slate-100 rounded text-slate-600" title="مائل"><Italic className="w-5 h-5"/></button>
                                    <button onMouseDown={(e) => { e.preventDefault(); execCmd('underline'); }} className="p-2 hover:bg-slate-100 rounded text-slate-600" title="مسطر"><Underline className="w-5 h-5"/></button>
                                    <div className="w-px h-5 bg-slate-200 mx-2"></div>
                                    <button onMouseDown={(e) => { e.preventDefault(); execCmd('justifyLeft'); }} className="p-2 hover:bg-slate-100 rounded text-slate-600" title="محاذاة لليسار"><AlignLeft className="w-5 h-5"/></button>
                                    <button onMouseDown={(e) => { e.preventDefault(); execCmd('justifyCenter'); }} className="p-2 hover:bg-slate-100 rounded text-slate-600" title="محاذاة للوسط"><AlignCenter className="w-5 h-5"/></button>
                                    <button onMouseDown={(e) => { e.preventDefault(); execCmd('justifyRight'); }} className="p-2 hover:bg-slate-100 rounded text-slate-600" title="محاذاة لليمين"><AlignRight className="w-5 h-5"/></button>
                                    <div className="w-px h-5 bg-slate-200 mx-2"></div>
                                    <button onMouseDown={(e) => { e.preventDefault(); execCmd('insertUnorderedList'); }} className="p-2 hover:bg-slate-100 rounded text-slate-600" title="قائمة نقطية"><List className="w-5 h-5"/></button>
                                    <button onMouseDown={(e) => { e.preventDefault(); execCmd('formatBlock', 'H2'); }} className="px-3 py-2 hover:bg-slate-100 rounded text-slate-600 flex items-center gap-1.5 text-sm font-bold" title="رأس 2"><Type className="w-5 h-5"/> 2</button>
                                    <div className="w-px h-5 bg-slate-200 mx-2"></div>
                                    <button onMouseDown={(e) => {
                                        e.preventDefault();
                                        const url = prompt('أدخل الرابط:');
                                        if (url) execCmd('createLink', url);
                                    }} className="p-2 hover:bg-slate-100 rounded text-slate-600" title="إدراج رابط"><Link2 className="w-5 h-5"/></button>
                                </div>
                                <div 
                                    ref={editorRef}
                                    className="p-4 flex-1 outline-none text-sm min-h-[150px] bg-white prose prose-sm max-w-none prose-a:text-blue-600"
                                    contentEditable
                                    onMouseUp={saveSelection}
                                    onKeyUp={saveSelection}
                                    onBlur={(e) => {
                                        saveSelection();
                                        setForm({ ...form, html: e.currentTarget.innerHTML });
                                    }}
                                />
                            </div>

                            {/* Attachments Section */}
                            <div className="flex items-center gap-3 flex-wrap">
                                <input type="file" multiple className="hidden" ref={fileInputRef} onChange={handleFileSelect} />
                                <button type="button" onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 bg-slate-100 border border-slate-200 text-slate-600 px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-200 transition-all">
                                    <Paperclip className="w-5 h-5" /> إضافة ملفات مرفقة
                                </button>
                                {attachments.map((att, i) => (
                                    <div key={i} className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600">
                                        <Paperclip className="w-3.5 h-3.5 text-slate-400" />
                                        <span className="truncate max-w-[150px]" dir="ltr">{att.filename}</span>
                                        <button type="button" onClick={() => setAttachments(prev => prev.filter((_, idx) => idx !== i))} className="text-red-400 hover:text-red-600 ml-1"><X className="w-3.5 h-3.5" /></button>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="px-6 py-4 bg-slate-50 border-t border-gray-100 flex justify-end gap-3 shrink-0">
                            <button onClick={() => setShowCompose(false)} className="px-6 py-2 rounded-xl text-slate-500 font-bold hover:bg-slate-200 text-sm">إلغاء</button>
                            <button onClick={handleSend} disabled={sending} className="flex items-center gap-2 bg-gradient-to-l from-green-600 to-green-700 text-white px-8 py-2.5 rounded-xl font-bold shadow-lg shadow-green-600/20 hover:from-green-700 hover:to-green-800 transition-all disabled:opacity-50 text-sm">
                                {sending ? <Loader2 className="w-5 h-5 animate-spin"/> : <Send className="w-5 h-5"/>} إرسال
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
