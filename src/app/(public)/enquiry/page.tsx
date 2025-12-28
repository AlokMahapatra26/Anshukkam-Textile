import { EnquiryForm } from "@/components/public";

export const metadata = {
    title: "Request a Quote | Premium Textiles Manufacturing",
    description: "Get a custom quote for your garment manufacturing needs. Fill out the form and our team will respond within 24 hours.",
};

export default function EnquiryPage() {
    return (
        <section className="section-industrial">
            <div className="container-industrial">
                {/* Page Header */}
                <div className="text-center mb-12">
                    <h1 className="text-3xl md:text-4xl font-bold mb-4">
                        Request a Quote
                    </h1>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Tell us about your requirements and our team will provide a custom
                        quote within 24 business hours. No commitment required.
                    </p>
                </div>

                {/* Enquiry Form */}
                <EnquiryForm />
            </div>
        </section>
    );
}
