"use client";

import { useState, useEffect } from "react";
import {
    Mail, Inbox, Send, Archive, Star, Trash2, Search, Filter, Loader2,
    AlertCircle, Eye, Reply, X, ChevronDown, Clock, User, Building2,
    Phone, ArrowLeft, StarOff, CheckCircle2, MessageSquare,
    ChevronRight, MailOpen, Flag, Plus
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
                    <h1 className="text-2xl font-black text-slate-800">البريد الوارد</h1>
                    <p className="text-slate-400 text-sm mt-1">إدارة الرسائل والشكاوى والمقترحات والطلبات</p>
                </div>
            </div>

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
        </div>
    );
}
