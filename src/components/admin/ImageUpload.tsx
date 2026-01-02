"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Upload, X, Loader2, ImageIcon, Plus } from "lucide-react";

interface ImageUploadProps {
    currentImages?: string[]; // Changed to array
    currentImage?: string | null; // Backward compatibility
    onImagesChange?: (urls: string[]) => void; // New callback
    onImageUploaded?: (url: string) => void; // Backward compatibility
    onImageRemoved?: () => void; // Backward compatibility
    className?: string;
    maxFiles?: number;
    multiple?: boolean;
}

export function ImageUpload({
    currentImages = [],
    currentImage,
    onImagesChange,
    onImageUploaded,
    onImageRemoved,
    className = "",
    maxFiles = 1,
    multiple = false,
}: ImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    // Initialize state combining both props
    const [images, setImages] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (currentImages.length > 0) {
            setImages(currentImages);
        } else if (currentImage) {
            setImages([currentImage]);
        } else {
            setImages([]);
        }
    }, [currentImages, currentImage]);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        // Check limits
        if (images.length + files.length > maxFiles) {
            toast.error(`You can only upload up to ${maxFiles} images`);
            return;
        }

        setIsUploading(true);
        const newUrls: string[] = [];

        try {
            // Upload files sequentially or in parallel
            const uploadPromises = Array.from(files).map(async (file) => {
                // Validate file type
                if (!file.type.startsWith("image/")) {
                    throw new Error(`File ${file.name} is not an image`);
                }

                // Validate file size (5MB max)
                if (file.size > 5 * 1024 * 1024) {
                    throw new Error(`File ${file.name} is larger than 5MB`);
                }

                const formData = new FormData();
                formData.append("file", file);

                const response = await fetch("/api/upload", {
                    method: "POST",
                    body: formData,
                });

                const result = await response.json();

                if (!result.success) {
                    throw new Error(result.error || `Failed to upload ${file.name}`);
                }

                return result.data.url;
            });

            const uploadedUrls = await Promise.all(uploadPromises);
            newUrls.push(...uploadedUrls);

            const updatedImages = [...images, ...newUrls];
            setImages(updatedImages);

            // Notify parent
            if (onImagesChange) {
                onImagesChange(updatedImages);
            }
            // Backward compatibility for single image
            if (onImageUploaded && newUrls.length > 0) {
                onImageUploaded(newUrls[0]);
            }

            toast.success(`Successfully uploaded ${newUrls.length} image(s)`);
        } catch (error: any) {
            console.error("Upload error:", error);
            toast.error(error.message || "Failed to upload images");
        } finally {
            setIsUploading(false);
            // Reset input
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const handleRemove = async (indexToRemove: number) => {
        const imageToRemove = images[indexToRemove];
        const updatedImages = images.filter((_, index) => index !== indexToRemove);

        setImages(updatedImages);

        // Notify parent
        if (onImagesChange) {
            onImagesChange(updatedImages);
        }

        // Backward compatibility
        if (updatedImages.length === 0 && onImageRemoved) {
            onImageRemoved();
        } else if (onImageUploaded && updatedImages.length > 0) {
            // If we removed the "current" one in single mode, we might want to update to the next one?
            // But usually single mode only has 1 image.
            if (maxFiles === 1) {
                onImageRemoved?.();
            }
        }

        // Optionally delete from storage
        try {
            await fetch("/api/upload", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url: imageToRemove }),
            });
        } catch (error) {
            console.error("Failed to delete image:", error);
        }
    };

    return (
        <div className={`space-y-4 ${className}`}>
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple={multiple}
                onChange={handleFileSelect}
                className="hidden"
            />

            {/* Image Grid */}
            {images.length > 0 && (
                <div className={`grid gap-4 ${multiple ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'}`}>
                    {images.map((url, index) => (
                        <div key={url + index} className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border border-border bg-muted group shadow-sm">
                            <Image
                                src={url}
                                alt={`Image ${index + 1}`}
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    onClick={() => handleRemove(index)}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                            {/* Primary Badge for first image if multiple */}
                            {multiple && index === 0 && (
                                <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded shadow-sm">
                                    Main
                                </div>
                            )}
                        </div>
                    ))}

                    {/* Add Button in Grid (if multiple and limit not reached) */}
                    {multiple && images.length < maxFiles && (
                        <div
                            onClick={() => !isUploading && fileInputRef.current?.click()}
                            className="flex flex-col items-center justify-center aspect-[4/3] w-full rounded-lg border-2 border-dashed border-border bg-muted/30 cursor-pointer hover:bg-muted transition-colors"
                        >
                            {isUploading ? (
                                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                            ) : (
                                <>
                                    <Plus className="h-6 w-6 text-muted-foreground mb-1" />
                                    <span className="text-xs text-muted-foreground">Add Image</span>
                                </>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Empty State / Single Upload Button */}
            {images.length === 0 && (
                <div
                    onClick={() => !isUploading && fileInputRef.current?.click()}
                    className="flex flex-col items-center justify-center aspect-video w-full rounded-lg border-2 border-dashed border-border bg-muted/50 cursor-pointer hover:bg-muted transition-colors"
                >
                    {isUploading ? (
                        <>
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-2" />
                            <p className="text-sm text-muted-foreground">Uploading...</p>
                        </>
                    ) : (
                        <>
                            <ImageIcon className="h-8 w-8 text-muted-foreground mb-2" />
                            <p className="text-sm text-muted-foreground">Click to upload {multiple ? "images" : "image"}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                                PNG, JPG, WebP up to 5MB
                            </p>
                        </>
                    )}
                </div>
            )}

            {/* Helper text */}
            {multiple && (
                <p className="text-xs text-muted-foreground text-right">
                    {images.length} / {maxFiles} images
                </p>
            )}
        </div>
    );
}
