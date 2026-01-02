"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface FactoryPhoto {
    id: string;
    title: string;
    description: string | null;
    imageUrl: string;
    category: string | null;
}

interface FactoryGalleryProps {
    photos: FactoryPhoto[];
    categories: string[];
    categoryLabels: Record<string, string>;
}

export function FactoryGallery({ photos, categories, categoryLabels }: FactoryGalleryProps) {
    const [selectedPhoto, setSelectedPhoto] = useState<FactoryPhoto | null>(null);
    const [filter, setFilter] = useState<string>("all");

    const filteredPhotos = filter === "all"
        ? photos
        : photos.filter((p) => p.category === filter);

    return (
        <>
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
                            onClick={() => setFilter(cat)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${filter === cat
                                ? "bg-accent text-accent-foreground"
                                : "bg-muted hover:bg-muted/80"
                                }`}
                        >
                            {categoryLabels[cat] || cat}
                        </button>
                    ))}
                </div>
            )}

            {/* Gallery Grid */}
            {filteredPhotos.length === 0 ? (
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
                                animation: `fadeInUp 0.6s ease-out ${index * 100}ms forwards`,
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
        </>
    );
}
