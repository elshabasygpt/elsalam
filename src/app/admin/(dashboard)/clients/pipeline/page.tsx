"use client";

import React, { useState, useEffect } from "react";
import { Loader2, Plus, GripVertical, Building2, Phone, CreditCard, ChevronLeft } from "lucide-react";
import Link from "next/link";

const PIPELINE_COLUMNS = [
    { id: "LEAD", title: "عملاء محتملين", color: "bg-slate-100", textColor: "text-slate-700", badge: "bg-slate-200" },
    { id: "NEGOTIATION", title: "قيد التفاوض", color: "bg-blue-50", textColor: "text-blue-700", badge: "bg-blue-200" },
    { id: "ACTIVE", title: "عملاء نشطين (دائمين)", color: "bg-green-50", textColor: "text-green-700", badge: "bg-green-200" },
    { id: "INACTIVE", title: "عملاء غير نشطين", color: "bg-red-50", textColor: "text-red-700", badge: "bg-red-200" },
];

export default function CRMPipelinePage() {
    const [clients, setClients] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [draggedItem, setDraggedItem] = useState<number | null>(null);

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        try {
            const res = await fetch(`/api/admin/crm/clients?t=${Date.now()}`, { cache: "no-store" });
            if (res.ok) {
                const data = await res.json();
                setClients(data);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const updateClientStatus = async (clientId: number, newStatus: string) => {
        try {
            // Optimistic update
            setClients(clients.map(c => c.id === clientId ? { ...c, status: newStatus } : c));
            
            await fetch(`/api/admin/crm/clients/${clientId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus })
            });
        } catch (error) {
            console.error("Failed to update status");
            fetchClients(); // Revert on failure
        }
    };

    const handleDragStart = (e: React.DragEvent, id: number) => {
        setDraggedItem(id);
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("clientId", id.toString());
        // Highlight dragging
        setTimeout(() => {
            const el = document.getElementById(`client-${id}`);
            if (el) el.classList.add("opacity-50");
        }, 0);
    };

    const handleDragEnd = (e: React.DragEvent, id: number) => {
        setDraggedItem(null);
        const el = document.getElementById(`client-${id}`);
        if (el) el.classList.remove("opacity-50");
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    };

    const handleDrop = (e: React.DragEvent, statusId: string) => {
        e.preventDefault();
        const clientIdStr = e.dataTransfer.getData("clientId");
        if (!clientIdStr) return;
        const clientId = parseInt(clientIdStr);
        
        const client = clients.find(c => c.id === clientId);
        if (client && client.status !== statusId) {
            updateClientStatus(clientId, statusId);
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center p-20"><Loader2 className="w-10 h-10 animate-spin text-green-500" /></div>;
    }

    return (
        <div className="space-y-6 min-h-[80vh]">
            <div className="flex items-center gap-4 bg-white p-5 py-4 rounded-3xl border border-gray-100 shadow-sm">
                <Link href="/admin/clients" className="bg-slate-100 p-2.5 rounded-full hover:bg-slate-200 transition-colors">
                    <ChevronLeft className="w-5 h-5 text-slate-700" />
                </Link>
                <div>
                    <h1 className="text-2xl font-black text-slate-800">مراحل المبيعات (Sales Pipeline)</h1>
                    <p className="text-sm text-slate-500 mt-0.5 font-medium">سحب وإفلات العملاء بصرياً لتتبع دورة المبيعات الخاصة بهم</p>
                </div>
            </div>

            <div className="flex gap-6 overflow-x-auto pb-8 custom-scrollbar h-full min-h-[calc(100vh-200px)]">
                {PIPELINE_COLUMNS.map((col) => {
                    const colClients = clients.filter(c => c.status === col.id);
                    
                    return (
                        <div 
                            key={col.id} 
                            className={`flex flex-col min-w-[320px] w-[320px] rounded-[24px] ${col.color} border border-slate-200/50 flex-shrink-0 transition-colors`}
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, col.id)}
                        >
                            <div className="p-4 flex items-center justify-between border-b border-black/5">
                                <h3 className={`font-black text-sm uppercase tracking-wide ${col.textColor}`}>{col.title}</h3>
                                <span className={`${col.badge} text-xs font-black px-2.5 py-1.5 rounded-lg ${col.textColor}`}>{colClients.length}</span>
                            </div>
                            
                            <div className="p-3 flex-1 flex flex-col gap-3 min-h-[150px]">
                                {colClients.map(client => (
                                    <div 
                                        key={client.id}
                                        id={`client-${client.id}`}
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, client.id)}
                                        onDragEnd={(e) => handleDragEnd(e, client.id)}
                                        className="bg-white p-4 rounded-[20px] shadow-sm border border-slate-100/80 cursor-grab active:cursor-grabbing hover:border-green-300 hover:shadow-md transition-all group"
                                    >
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex-1">
                                                <h4 className="font-bold text-[15px] text-slate-800 leading-tight mb-1">{client.name}</h4>
                                                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                                                    <Building2 className="w-3.5 h-3.5" />
                                                    {client.company || client.storeType}
                                                </div>
                                            </div>
                                            <button className="text-slate-300 hover:text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <GripVertical className="w-5 h-5" />
                                            </button>
                                        </div>
                                        
                                        <div className="pt-3 border-t border-dashed border-slate-100 flex items-center justify-between">
                                            <a href={`tel:${client.mainPhone}`} className="text-slate-400 hover:text-green-600 flex items-center gap-1.5 text-[11px] font-bold">
                                                <Phone className="w-3.5 h-3.5" /> {client.mainPhone || "لا يوجد"}
                                            </a>
                                            
                                            {client.creditLimit > 0 && (
                                                <div className={`flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-md ${client.outstandingBalance >= client.creditLimit ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"}`}>
                                                    <CreditCard className="w-3.5 h-3.5" />
                                                    {client.outstandingBalance?.toLocaleString()} ج.م
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
