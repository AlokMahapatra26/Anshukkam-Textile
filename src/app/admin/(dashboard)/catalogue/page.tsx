"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Loader2, ImageIcon } from "lucide-react";
import { ImageUpload } from "@/components/admin/ImageUpload";

interface ClothingType {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    imageUrl: string | null;
    images: string[] | null;
    minOrderQuantity: number | null;
    leadTime: string | null;
    sizeRange: string | null;
    displayOrder: number | null;
    isActive: boolean | null;
}

export default function CataloguePage() {
    const [types, setTypes] = useState<ClothingType[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingType, setEditingType] = useState<ClothingType | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        description: "",
        imageUrl: "",
        images: [] as string[],
        minOrderQuantity: 500,
        leadTime: "3-5 Weeks",
        sizeRange: "XS-5XL",
        displayOrder: 0,
        isActive: true,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchTypes = async () => {
        try {
            const response = await fetch("/api/catalogue/types?includeInactive=true");
            const result = await response.json();
            if (result.success) {
                setTypes(result.data);
            }
        } catch (error) {
            console.error("Failed to fetch types:", error);
            toast.error("Failed to load catalogue types");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTypes();
    }, []);

    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");
    };

    const handleNameChange = (name: string) => {
        setFormData((prev) => ({
            ...prev,
            name,
            slug: editingType ? prev.slug : generateSlug(name),
        }));
    };

    const openCreateDialog = () => {
        setEditingType(null);
        setFormData({
            name: "",
            slug: "",
            description: "",
            imageUrl: "",
            images: [],
            minOrderQuantity: 500,
            leadTime: "3-5 Weeks",
            sizeRange: "XS-5XL",
            displayOrder: types.length,
            isActive: true,
        });
        setIsDialogOpen(true);
    };

    const openEditDialog = (type: ClothingType) => {
        setEditingType(type);

        // Handle migration logic for images
        let initialImages: string[] = [];
        if (type.images && type.images.length > 0) {
            initialImages = type.images;
        } else if (type.imageUrl) {
            initialImages = [type.imageUrl];
        }

        setFormData({
            name: type.name,
            slug: type.slug,
            description: type.description || "",
            imageUrl: type.imageUrl || "",
            images: initialImages,
            minOrderQuantity: type.minOrderQuantity || 500,
            leadTime: type.leadTime || "3-5 Weeks",
            sizeRange: type.sizeRange || "XS-5XL",
            displayOrder: type.displayOrder || 0,
            isActive: type.isActive ?? true,
        });
        setIsDialogOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const url = editingType
                ? `/api/catalogue/types/${editingType.id}`
                : "/api/catalogue/types";
            const method = editingType ? "PUT" : "POST";

            // Sync imageUrl with the first image of images array for backward compatibility
            const payload = {
                ...formData,
                imageUrl: formData.images.length > 0 ? formData.images[0] : null,
            };

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const result = await response.json();

            if (result.success) {
                toast.success(
                    editingType
                        ? "Type updated successfully"
                        : "Type created successfully"
                );
                setIsDialogOpen(false);
                fetchTypes();
            } else {
                toast.error(result.error || "Operation failed");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this type?")) return;

        try {
            const response = await fetch(`/api/catalogue/types/${id}`, {
                method: "DELETE",
            });

            const result = await response.json();

            if (result.success) {
                toast.success("Type deleted successfully");
                fetchTypes();
            } else {
                toast.error(result.error || "Failed to delete");
            }
        } catch (error) {
            toast.error("An error occurred");
        }
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Catalogue Management</h1>
                    <p className="text-muted-foreground">
                        Manage clothing types and manufacturing specifications
                    </p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={openCreateDialog} className="btn-industrial">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Clothing Type
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>
                                {editingType ? "Edit Clothing Type" : "Add Clothing Type"}
                            </DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Left Column - Image Upload */}
                                <div className="space-y-2">
                                    <Label>Images (Max 6)</Label>
                                    <ImageUpload
                                        currentImages={formData.images}
                                        onImagesChange={(urls) =>
                                            setFormData((prev) => ({ ...prev, images: urls }))
                                        }
                                        multiple={true}
                                        maxFiles={6}
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        First image will be used as the main thumbnail.
                                    </p>
                                </div>

                                {/* Right Column - Form Fields */}
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Name *</Label>
                                        <Input
                                            id="name"
                                            value={formData.name}
                                            onChange={(e) => handleNameChange(e.target.value)}
                                            placeholder="e.g., T-Shirts & Polos"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="slug">Slug *</Label>
                                        <Input
                                            id="slug"
                                            value={formData.slug}
                                            onChange={(e) =>
                                                setFormData((prev) => ({ ...prev, slug: e.target.value }))
                                            }
                                            placeholder="e.g., t-shirts-polos"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="description">Description</Label>
                                        <Textarea
                                            id="description"
                                            value={formData.description}
                                            onChange={(e) =>
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    description: e.target.value,
                                                }))
                                            }
                                            placeholder="Brief description of this category"
                                            rows={2}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Manufacturing Specifications */}
                            <div className="border-t pt-4 mt-4">
                                <h4 className="font-medium mb-4">Manufacturing Specifications</h4>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="minOrderQuantity">Min Order Qty (MOQ)</Label>
                                        <Input
                                            id="minOrderQuantity"
                                            type="number"
                                            value={formData.minOrderQuantity}
                                            onChange={(e) =>
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    minOrderQuantity: parseInt(e.target.value) || 0,
                                                }))
                                            }
                                            placeholder="500"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="leadTime">Lead Time</Label>
                                        <Input
                                            id="leadTime"
                                            value={formData.leadTime}
                                            onChange={(e) =>
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    leadTime: e.target.value,
                                                }))
                                            }
                                            placeholder="3-5 Weeks"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="sizeRange">Size Range</Label>
                                        <Input
                                            id="sizeRange"
                                            value={formData.sizeRange}
                                            onChange={(e) =>
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    sizeRange: e.target.value,
                                                }))
                                            }
                                            placeholder="XS-5XL"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="displayOrder">Display Order</Label>
                                    <Input
                                        id="displayOrder"
                                        type="number"
                                        value={formData.displayOrder}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                displayOrder: parseInt(e.target.value) || 0,
                                            }))
                                        }
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Status</Label>
                                    <div className="flex gap-2 pt-2">
                                        <Button
                                            type="button"
                                            size="sm"
                                            variant={formData.isActive ? "default" : "outline"}
                                            onClick={() =>
                                                setFormData((prev) => ({ ...prev, isActive: true }))
                                            }
                                        >
                                            Active
                                        </Button>
                                        <Button
                                            type="button"
                                            size="sm"
                                            variant={!formData.isActive ? "default" : "outline"}
                                            onClick={() =>
                                                setFormData((prev) => ({ ...prev, isActive: false }))
                                            }
                                        >
                                            Hidden
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsDialogOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="btn-industrial"
                                >
                                    {isSubmitting && (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    )}
                                    {editingType ? "Update" : "Create"}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Clothing Types Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Clothing Types</CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                    ) : types.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            <p>No clothing types yet</p>
                            <p className="text-sm">
                                Click &quot;Add Clothing Type&quot; to get started
                            </p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-16">Image</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>MOQ</TableHead>
                                    <TableHead>Lead Time</TableHead>
                                    <TableHead>Sizes</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {types.map((type) => (
                                    <TableRow key={type.id}>
                                        <TableCell>
                                            {type.imageUrl ? (
                                                <div className="relative h-10 w-14 rounded overflow-hidden bg-muted group">
                                                    <Image
                                                        src={type.imageUrl}
                                                        alt={type.name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                    {type.images && type.images.length > 1 && (
                                                        <div className="absolute bottom-0 right-0 bg-black/60 text-white text-[10px] px-1">
                                                            +{type.images.length - 1}
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="h-10 w-14 rounded bg-muted flex items-center justify-center">
                                                    <ImageIcon className="h-4 w-4 text-muted-foreground" />
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell className="font-medium">{type.name}</TableCell>
                                        <TableCell>{type.minOrderQuantity || 500}+</TableCell>
                                        <TableCell>{type.leadTime || "3-5 Weeks"}</TableCell>
                                        <TableCell>{type.sizeRange || "XS-5XL"}</TableCell>
                                        <TableCell>
                                            <Badge variant={type.isActive ? "default" : "secondary"}>
                                                {type.isActive ? "Active" : "Hidden"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => openEditDialog(type)}
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleDelete(type.id)}
                                                >
                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
