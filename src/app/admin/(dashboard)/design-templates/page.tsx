"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Trash2, Upload, Loader2, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

interface DesignTemplate {
    id: string;
    name: string;
    colorName: string;
    colorHex: string;
    frontImageUrl: string;
    backImageUrl: string;
    sideImageUrl: string;
    isActive: boolean;
}

export default function DesignTemplatesPage() {
    const [templates, setTemplates] = useState<DesignTemplate[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        name: "Classic T-Shirt",
        colorName: "",
        colorHex: "#000000",
        frontImageUrl: "",
        backImageUrl: "",
        sideImageUrl: "",
    });

    const frontInputRef = useRef<HTMLInputElement>(null);
    const backInputRef = useRef<HTMLInputElement>(null);
    const sideInputRef = useRef<HTMLInputElement>(null);

    const fetchTemplates = async () => {
        try {
            const response = await fetch("/api/design-templates");
            const result = await response.json();
            if (result.success) {
                setTemplates(result.data);
            }
        } catch (error) {
            toast.error("Failed to load templates");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTemplates();
    }, []);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            setFormData((prev) => ({ ...prev, [field]: event.target?.result as string }));
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async () => {
        if (!formData.name || !formData.colorName || !formData.frontImageUrl || !formData.backImageUrl || !formData.sideImageUrl) {
            toast.error("Please fill in all fields and upload all images");
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await fetch("/api/design-templates", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (result.success) {
                toast.success("Template created successfully");
                setIsDialogOpen(false);
                setFormData({
                    name: "Classic T-Shirt",
                    colorName: "",
                    colorHex: "#000000",
                    frontImageUrl: "",
                    backImageUrl: "",
                    sideImageUrl: "",
                });
                fetchTemplates();
            } else {
                toast.error(result.error || "Failed to create template");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this template?")) return;

        try {
            const response = await fetch(`/api/design-templates/${id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                toast.success("Template deleted");
                fetchTemplates();
            } else {
                toast.error("Failed to delete template");
            }
        } catch (error) {
            toast.error("An error occurred");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Design Templates</h1>
                    <p className="text-muted-foreground">
                        Manage T-shirt colors and mockup images
                    </p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Template
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Add New Template Color</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Template Name</Label>
                                    <Input
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="e.g. Classic T-Shirt"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Color Name</Label>
                                    <Input
                                        value={formData.colorName}
                                        onChange={(e) => setFormData({ ...formData, colorName: e.target.value })}
                                        placeholder="e.g. Navy Blue"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Color Hex Code</Label>
                                <div className="flex gap-2">
                                    <Input
                                        type="color"
                                        value={formData.colorHex}
                                        onChange={(e) => setFormData({ ...formData, colorHex: e.target.value })}
                                        className="w-12 h-10 p-1"
                                    />
                                    <Input
                                        value={formData.colorHex}
                                        onChange={(e) => setFormData({ ...formData, colorHex: e.target.value })}
                                        placeholder="#000000"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                {/* Front Image */}
                                <div className="space-y-2">
                                    <Label>Front View</Label>
                                    <div
                                        className="aspect-[3/4] border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 relative overflow-hidden"
                                        onClick={() => frontInputRef.current?.click()}
                                    >
                                        {formData.frontImageUrl ? (
                                            <Image src={formData.frontImageUrl} alt="Front" fill className="object-cover" />
                                        ) : (
                                            <>
                                                <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                                                <span className="text-xs text-muted-foreground">Upload Front</span>
                                            </>
                                        )}
                                    </div>
                                    <input
                                        type="file"
                                        ref={frontInputRef}
                                        className="hidden"
                                        accept="image/*"
                                        onChange={(e) => handleImageUpload(e, "frontImageUrl")}
                                    />
                                </div>

                                {/* Back Image */}
                                <div className="space-y-2">
                                    <Label>Back View</Label>
                                    <div
                                        className="aspect-[3/4] border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 relative overflow-hidden"
                                        onClick={() => backInputRef.current?.click()}
                                    >
                                        {formData.backImageUrl ? (
                                            <Image src={formData.backImageUrl} alt="Back" fill className="object-cover" />
                                        ) : (
                                            <>
                                                <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                                                <span className="text-xs text-muted-foreground">Upload Back</span>
                                            </>
                                        )}
                                    </div>
                                    <input
                                        type="file"
                                        ref={backInputRef}
                                        className="hidden"
                                        accept="image/*"
                                        onChange={(e) => handleImageUpload(e, "backImageUrl")}
                                    />
                                </div>

                                {/* Side Image */}
                                <div className="space-y-2">
                                    <Label>Side View</Label>
                                    <div
                                        className="aspect-[3/4] border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 relative overflow-hidden"
                                        onClick={() => sideInputRef.current?.click()}
                                    >
                                        {formData.sideImageUrl ? (
                                            <Image src={formData.sideImageUrl} alt="Side" fill className="object-cover" />
                                        ) : (
                                            <>
                                                <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                                                <span className="text-xs text-muted-foreground">Upload Side</span>
                                            </>
                                        )}
                                    </div>
                                    <input
                                        type="file"
                                        ref={sideInputRef}
                                        className="hidden"
                                        accept="image/*"
                                        onChange={(e) => handleImageUpload(e, "sideImageUrl")}
                                    />
                                </div>
                            </div>

                            <Button onClick={handleSubmit} disabled={isSubmitting} className="w-full">
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Create Template
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Existing Templates</CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex justify-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                    ) : templates.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            No templates found. Add one to get started.
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Preview</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Color</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {templates.map((template) => (
                                    <TableRow key={template.id}>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                <div className="w-10 h-10 relative rounded overflow-hidden border">
                                                    <Image src={template.frontImageUrl} alt="Front" fill className="object-cover" />
                                                </div>
                                                <div className="w-10 h-10 relative rounded overflow-hidden border">
                                                    <Image src={template.backImageUrl} alt="Back" fill className="object-cover" />
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-medium">{template.name}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className="w-4 h-4 rounded-full border"
                                                    style={{ backgroundColor: template.colorHex }}
                                                />
                                                {template.colorName}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleDelete(template.id)}
                                            >
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
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
