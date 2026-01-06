import { Suspense } from "react";
import { EnquiryForm } from "@/components/public";

export const metadata = {
    title: "Request a Quote | Anshuukam Textile",
    description: "Get a custom quote for your garment manufacturing needs. Fill out the form and our team will respond within 24 hours.",
};

export default function EnquiryPage() {
    return (
        <div className="min-h-screen">
            {/* Page Header */}
            <section className="relative bg-primary text-primary-foreground py-24 overflow-hidden">
                {/* Animated background pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }} />
                </div>
                <div className="container-industrial relative z-10">
                    <div className="max-w-3xl">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">
                            Request a Quote
                        </h1>
                        <p className="text-xl text-primary-foreground/80 leading-relaxed">
                            Tell us about your requirements and our team will provide a custom
                            quote within 24 business hours. No commitment required.
                        </p>
                    </div>
                </div>
            </section>

            {/* Enquiry Form */}
            <section className="section-industrial">
                <div className="container-industrial">
                    <Suspense fallback={<div className="flex justify-center py-12">Loading form...</div>}>
                        <EnquiryForm />
                    </Suspense>
                </div>
            </section>
        </div>
    );
}
