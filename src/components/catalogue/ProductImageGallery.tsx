"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ProductImageGalleryProps {
    images: string[];
    productName: string;
}

export function ProductImageGallery({ images, productName }: ProductImageGalleryProps) {
    const [selectedImage, setSelectedImage] = useState(images[0]);

    if (!images || images.length === 0) {
        return (
            <div className="aspect-[4/5] bg-muted relative rounded-lg overflow-hidden border border-border flex items-center justify-center text-muted-foreground">
                No image available
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-[4/5] bg-muted relative rounded-lg overflow-hidden border border-border">
                <Image
                    src={selectedImage}
                    alt={productName}
                    fill
                    className="object-cover"
                    priority
                />
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                    {images.map((img, idx) => (
                        <button
                            key={idx}
                            onClick={() => setSelectedImage(img)}
                            className={cn(
                                "aspect-square bg-muted relative rounded-md overflow-hidden border cursor-pointer transition-all",
                                selectedImage === img
                                    ? "border-primary ring-2 ring-primary/20"
                                    : "border-border hover:border-accent"
                            )}
                        >
                            <Image
                                src={img}
                                alt={`${productName} view ${idx + 1}`}
                                fill
                                className="object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
