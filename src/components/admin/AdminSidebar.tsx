"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
    Factory,
    LayoutDashboard,
    Package,
    Layers,
    MessageSquare,
    Settings,
    LogOut,
    Menu,
    X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const navigation = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Catalogue", href: "/admin/catalogue", icon: Package },
    { name: "Fabrics", href: "/admin/fabrics", icon: Layers },
    { name: "Enquiries", href: "/admin/enquiries", icon: MessageSquare },
    { name: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const handleLogout = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        router.push("/admin/login");
        router.refresh();
    };

    const isActive = (href: string) => {
        if (href === "/admin") return pathname === "/admin";
        return pathname.startsWith(href);
    };

    const SidebarContent = () => (
        <>
            {/* Logo */}
            <div className="p-6 border-b border-border">
                <Link href="/admin" className="flex items-center gap-2">
                    <Factory className="h-8 w-8 text-accent" />
                    <div>
                        <span className="font-bold">Admin Panel</span>
                        <p className="text-xs text-muted-foreground">Anshukkam Textile</p>
                    </div>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1">
                {navigation.map((item) => (
                    <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsMobileOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive(item.href)
                                ? "bg-accent text-accent-foreground"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            }`}
                    >
                        <item.icon className="h-5 w-5" />
                        {item.name}
                    </Link>
                ))}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-border">
                <Link
                    href="/"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-2"
                >
                    View Website →
                </Link>
                <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={handleLogout}
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                </Button>
            </div>
        </>
    );

    return (
        <>
            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-background border-b border-border p-4 flex items-center justify-between">
                <Link href="/admin" className="flex items-center gap-2">
                    <Factory className="h-6 w-6 text-accent" />
                    <span className="font-bold">Admin</span>
                </Link>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsMobileOpen(!isMobileOpen)}
                >
                    {isMobileOpen ? (
                        <X className="h-6 w-6" />
                    ) : (
                        <Menu className="h-6 w-6" />
                    )}
                </Button>
            </div>

            {/* Mobile Sidebar */}
            {isMobileOpen && (
                <div className="lg:hidden fixed inset-0 z-40 bg-background/80 backdrop-blur-sm">
                    <div className="fixed inset-y-0 left-0 w-72 bg-background border-r border-border flex flex-col pt-16">
                        <SidebarContent />
                    </div>
                </div>
            )}

            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-background border-r border-border">
                <SidebarContent />
            </aside>
        </>
    );
}
