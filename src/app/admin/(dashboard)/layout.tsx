import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import { prisma } from "@/lib/prisma";
import { AdminShell } from "./admin-shell";

export default async function AdminLayout({ children }: { children: ReactNode }) {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/admin/login");
    }

    const pendingOrdersCount = await prisma.webOrder.count({ where: { status: "PENDING" } });
    const newMessagesCount = await prisma.message.count({ where: { status: "new" } });

    return (
        <AdminShell 
            userName={session.user?.name || "المدير"} 
            userRole={session.user?.role || "USER"}
            pendingOrdersCount={pendingOrdersCount}
            newMessagesCount={newMessagesCount}
        >
            {children}
        </AdminShell>
    );
}
