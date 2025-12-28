"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Loader2, X } from "lucide-react";

interface FactoryPhoto {
    id: string;
    title: string;
    description: string | null;
    imageUrl: string;
    category: string | null;
}

const categoryLabels: Record<string, string> = {
    production: "Production Floor",
    warehouse: "Warehouse",
    "quality-control": "Quality Control",
    machinery: "Machinery",
    office: "Office",
    exterior: "Exterior",
    team: "Our Team",
    other: "Other",
};

export default function FactoryPage() {
    const [photos, setPhotos] = useState<FactoryPhoto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedPhoto, setSelectedPhoto] = useState<FactoryPhoto | null>(null);
    const [filter, setFilter] = useState<string>("all");

    useEffect(() => {
        async function fetchPhotos() {
            try {
                const response = await fetch("/api/factory-photos");
                const result = await response.json();
                if (result.success) {
                    setPhotos(result.data);
                }
            } catch (error) {
                console.error("Failed to fetch photos:", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchPhotos();
    }, []);

    // Get unique categories from photos
    const categories = Array.from(new Set(photos.map((p) => p.category).filter(Boolean)));

    const filteredPhotos = filter === "all"
        ? photos
        : photos.filter((p) => p.category === filter);

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative bg-primary text-primary-foreground py-24 overflow-hidden">
                {/* Animated background pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }} />
                </div>
                <div className="container-industrial relative z-10">
                    <div className="max-w-3xl">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
                            Our Factory
                        </h1>
                        <p className="text-xl text-primary-foreground/80 leading-relaxed">
                            Take a virtual tour of our state-of-the-art manufacturing facility.
                            With over 50,000 sq ft of production space and cutting-edge machinery,
                            we're equipped to handle orders of any scale.
                        </p>
                    </div>
                </div>
            </section>

            {/* Factory Stats */}
            <section className="bg-muted py-12">
                <div className="container-industrial">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                            { value: "50,000+", label: "Sq Ft Facility" },
                            { value: "200+", label: "Skilled Workers" },
                            { value: "24/7", label: "Production" },
                            { value: "100%", label: "Quality Checked" },
                        ].map((stat, index) => (
                            <div
                                key={stat.label}
                                className="text-center p-6 bg-card border border-border rounded-lg hover:border-accent transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className="text-3xl md:text-4xl font-bold text-accent mb-2">
                                    {stat.value}
                                </div>
                                <div className="text-muted-foreground text-sm">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Photo Gallery */}
            <section className="section-industrial">
                <div className="container-industrial">
                    {/* Section Header */}
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Inside Our Facility
                        </h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Explore our manufacturing facility through these photos.
                            From cutting-edge machinery to our dedicated team, see what makes us different.
                        </p>
                    </div>

                    {/* Category Filter */}
                    {categories.length > 1 && (
                        <div className="flex flex-wrap justify-center gap-2 mb-8">
                            <button
                                onClick={() => setFilter("all")}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${filter === "all"
                                        ? "bg-accent text-accent-foreground"
                                        : "bg-muted hover:bg-muted/80"
                                    }`}
                            >
                                All Photos
                            </button>
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setFilter(cat!)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${filter === cat
                                            ? "bg-accent text-accent-foreground"
                                            : "bg-muted hover:bg-muted/80"
                                        }`}
                                >
                                    {categoryLabels[cat!] || cat}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Gallery Grid */}
                    {isLoading ? (
                        <div className="flex justify-center py-16">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                    ) : filteredPhotos.length === 0 ? (
                        <div className="text-center py-16">
                            <p className="text-muted-foreground">
                                No photos available yet. Check back soon!
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredPhotos.map((photo, index) => (
                                <div
                                    key={photo.id}
                                    className="group relative overflow-hidden rounded-lg cursor-pointer transform transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl"
                                    style={{
                                        animationDelay: `${index * 100}ms`,
                                        animation: "fadeInUp 0.6s ease-out forwards",
                                        opacity: 0,
                                    }}
                                    onClick={() => setSelectedPhoto(photo)}
                                >
                                    {/* Image */}
                                    <div className="aspect-[4/3] overflow-hidden">
                                        <img
                                            src={photo.imageUrl}
                                            alt={photo.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            loading="lazy"
                                        />
                                    </div>

                                    {/* Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                            {photo.category && (
                                                <span className="inline-block bg-accent text-accent-foreground text-xs font-medium px-2 py-1 rounded mb-2">
                                                    {categoryLabels[photo.category] || photo.category}
                                                </span>
                                            )}
                                            <h3 className="text-white text-lg font-semibold mb-1">
                                                {photo.title}
                                            </h3>
                                            {photo.description && (
                                                <p className="text-white/80 text-sm line-clamp-2">
                                                    {photo.description}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-primary text-primary-foreground py-16">
                <div className="container-industrial text-center">
                    <h2 className="text-3xl font-bold mb-4">
                        Want to Visit Our Factory?
                    </h2>
                    <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
                        Schedule a factory tour to see our production processes firsthand
                        and meet our dedicated team.
                    </p>
                    <Link href="/contact">
                        <Button variant="secondary" size="lg">
                            Schedule a Tour
                        </Button>
                    </Link>
                </div>
            </section>

            {/* Lightbox Modal */}
            {selectedPhoto && (
                <div
                    className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 animate-fade-in"
                    onClick={() => setSelectedPhoto(null)}
                >
                    <button
                        className="absolute top-4 right-4 text-white p-2 hover:bg-white/10 rounded-full transition-colors"
                        onClick={() => setSelectedPhoto(null)}
                    >
                        <X className="h-8 w-8" />
                    </button>
                    <div
                        className="max-w-5xl max-h-[90vh] w-full animate-scale-in"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={selectedPhoto.imageUrl}
                            alt={selectedPhoto.title}
                            className="w-full h-auto max-h-[70vh] object-contain rounded-lg"
                        />
                        <div className="mt-4 text-center text-white">
                            <h3 className="text-2xl font-bold mb-2">{selectedPhoto.title}</h3>
                            {selectedPhoto.description && (
                                <p className="text-white/80">{selectedPhoto.description}</p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* CSS Animations */}
            <style jsx global>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes fade-in {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }

                @keyframes scale-in {
                    from {
                        opacity: 0;
                        transform: scale(0.9);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }

                .animate-fade-in {
                    animation: fade-in 0.3s ease-out;
                }

                .animate-scale-in {
                    animation: scale-in 0.3s ease-out;
                }
            `}</style>
        </div>
    );
}
