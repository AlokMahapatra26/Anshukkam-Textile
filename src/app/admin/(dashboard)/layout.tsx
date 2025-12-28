import { AdminSidebar } from "@/components/admin";
import { Toaster } from "@/components/ui/sonner";

export const metadata = {
    title: "Admin Panel",
};

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-muted">
            <AdminSidebar />
            <main className="lg:pl-64 pt-16 lg:pt-0">
                <div className="p-6 lg:p-8">{children}</div>
            </main>
            <Toaster position="top-right" />
        </div>
    );
}
