import { Header, Footer } from "@/components/public";
import { Toaster } from "@/components/ui/sonner";

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <Toaster position="top-right" />
        </div>
    );
}
