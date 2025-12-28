"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Upload, X, Loader2, ImageIcon } from "lucide-react";

interface ImageUploadProps {
    currentImage?: string | null;
    onImageUploaded: (url: string) => void;
    onImageRemoved?: () => void;
    className?: string;
}

export function ImageUpload({
    currentImage,
    onImageUploaded,
    onImageRemoved,
    className = "",
}: ImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(currentImage || null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith("image/")) {
            toast.error("Please select an image file");
            return;
        }

        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image must be less than 5MB");
            return;
        }

        setIsUploading(true);

        try {
            const formData = new FormData();
            formData.append("file", file);

            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            const result = await response.json();

            if (result.success) {
                setPreviewUrl(result.url);
                onImageUploaded(result.url);
                toast.success("Image uploaded successfully");
            } else {
                toast.error(result.error || "Failed to upload image");
            }
        } catch (error) {
            console.error("Upload error:", error);
            toast.error("Failed to upload image");
        } finally {
            setIsUploading(false);
            // Reset input
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const handleRemove = async () => {
        if (previewUrl && onImageRemoved) {
            // Optionally delete from storage
            try {
                await fetch("/api/upload", {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ url: previewUrl }),
                });
            } catch (error) {
                console.error("Failed to delete image:", error);
            }
        }
        setPreviewUrl(null);
        onImageRemoved?.();
    };

    return (
        <div className={`space-y-2 ${className}`}>
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
            />

            {previewUrl ? (
                <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-border bg-muted">
                    <Image
                        src={previewUrl}
                        alt="Preview"
                        fill
                        className="object-cover"
                    />
                    <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={handleRemove}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            ) : (
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
                            <p className="text-sm text-muted-foreground">Click to upload image</p>
                            <p className="text-xs text-muted-foreground mt-1">
                                PNG, JPG, WebP up to 5MB
                            </p>
                        </>
                    )}
                </div>
            )}

            {!previewUrl && !isUploading && (
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => fileInputRef.current?.click()}
                >
                    <Upload className="mr-2 h-4 w-4" />
                    Choose Image
                </Button>
            )}
        </div>
    );
}
