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

interface Fabric {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    composition: string | null;
    weight: string | null;
    imageUrl: string | null;
    images: string[] | null;
    displayOrder: number | null;
    isActive: boolean | null;
}

export default function FabricsPage() {
    const [fabrics, setFabrics] = useState<Fabric[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingFabric, setEditingFabric] = useState<Fabric | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        description: "",
        composition: "",
        weight: "",
        imageUrl: "",
        images: [] as string[],
        displayOrder: 0,
        isActive: true,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchFabrics = async () => {
        try {
            const response = await fetch("/api/catalogue/fabrics?includeInactive=true");
            const result = await response.json();
            if (result.success) {
                setFabrics(result.data);
            }
        } catch (error) {
            console.error("Failed to fetch fabrics:", error);
            toast.error("Failed to load fabrics");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchFabrics();
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
            slug: editingFabric ? prev.slug : generateSlug(name),
        }));
    };

    const openCreateDialog = () => {
        setEditingFabric(null);
        setFormData({
            name: "",
            slug: "",
            description: "",
            composition: "",
            weight: "",
            imageUrl: "",
            images: [],
            displayOrder: fabrics.length,
            isActive: true,
        });
        setIsDialogOpen(true);
    };

    const openEditDialog = (fabric: Fabric) => {
        setEditingFabric(fabric);

        // Handle migration logic for images
        let initialImages: string[] = [];
        if (fabric.images && fabric.images.length > 0) {
            initialImages = fabric.images;
        } else if (fabric.imageUrl) {
            initialImages = [fabric.imageUrl];
        }

        setFormData({
            name: fabric.name,
            slug: fabric.slug,
            description: fabric.description || "",
            composition: fabric.composition || "",
            weight: fabric.weight || "",
            imageUrl: fabric.imageUrl || "",
            images: initialImages,
            displayOrder: fabric.displayOrder || 0,
            isActive: fabric.isActive ?? true,
        });
        setIsDialogOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const url = editingFabric
                ? `/api/catalogue/fabrics/${editingFabric.id}`
                : "/api/catalogue/fabrics";
            const method = editingFabric ? "PUT" : "POST";

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
                    editingFabric
                        ? "Fabric updated successfully"
                        : "Fabric created successfully"
                );
                setIsDialogOpen(false);
                fetchFabrics();
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
        if (!confirm("Are you sure you want to delete this fabric?")) return;

        try {
            const response = await fetch(`/api/catalogue/fabrics/${id}`, {
                method: "DELETE",
            });

            const result = await response.json();

            if (result.success) {
                toast.success("Fabric deleted successfully");
                fetchFabrics();
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
                    <h1 className="text-2xl font-bold">Fabrics Management</h1>
                    <p className="text-muted-foreground">
                        Manage available fabric options
                    </p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={openCreateDialog} className="btn-industrial">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Fabric
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>
                                {editingFabric ? "Edit Fabric" : "Add Fabric"}
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
                                            placeholder="e.g., 100% Cotton"
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
                                            placeholder="e.g., cotton"
                                            required
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="composition">Composition</Label>
                                            <Input
                                                id="composition"
                                                value={formData.composition}
                                                onChange={(e) =>
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        composition: e.target.value,
                                                    }))
                                                }
                                                placeholder="e.g., 100% Cotton"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="weight">Weight (GSM)</Label>
                                            <Input
                                                id="weight"
                                                value={formData.weight}
                                                onChange={(e) =>
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        weight: e.target.value,
                                                    }))
                                                }
                                                placeholder="e.g., 180-220 GSM"
                                            />
                                        </div>
                                    </div>
                                </div>
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
                                    placeholder="Brief description of this fabric"
                                    rows={2}
                                />
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
                                    {editingFabric ? "Update" : "Create"}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Fabrics Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Fabrics</CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                    ) : fabrics.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            <p>No fabrics yet</p>
                            <p className="text-sm">
                                Click &quot;Add Fabric&quot; to get started
                            </p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-16">Image</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Composition</TableHead>
                                    <TableHead>Weight</TableHead>
                                    <TableHead>Order</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {fabrics.map((fabric) => (
                                    <TableRow key={fabric.id}>
                                        <TableCell>
                                            {fabric.imageUrl ? (
                                                <div className="relative h-10 w-14 rounded overflow-hidden bg-muted group">
                                                    <Image
                                                        src={fabric.imageUrl}
                                                        alt={fabric.name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                    {fabric.images && fabric.images.length > 1 && (
                                                        <div className="absolute bottom-0 right-0 bg-black/60 text-white text-[10px] px-1">
                                                            +{fabric.images.length - 1}
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="h-10 w-14 rounded bg-muted flex items-center justify-center">
                                                    <ImageIcon className="h-4 w-4 text-muted-foreground" />
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell className="font-medium">{fabric.name}</TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {fabric.composition || "-"}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {fabric.weight || "-"}
                                        </TableCell>
                                        <TableCell>{fabric.displayOrder}</TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={fabric.isActive ? "default" : "secondary"}
                                            >
                                                {fabric.isActive ? "Active" : "Hidden"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => openEditDialog(fabric)}
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleDelete(fabric.id)}
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
