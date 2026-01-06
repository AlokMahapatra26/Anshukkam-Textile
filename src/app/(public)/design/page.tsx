"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import {
    Upload,
    Loader2,
    Check,
    ArrowLeft,
    Trash2,
    Type,
    Square,
    Circle as CircleIcon,
    Triangle,
    Undo,
    Redo,
    Download,
    Shirt,
    Move,
    Palette,
    Layers,
    ChevronRight,
    ChevronLeft,
    Star,
    Heart,
    Hexagon,
    Diamond,
    ArrowRight,
    Zap,
    Search,
    Image as ImageIcon,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Inter, Roboto, Oswald, Pacifico, Anton, Lobster } from 'next/font/google';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

const roboto = Roboto({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-roboto' });
const oswald = Oswald({ subsets: ['latin'], variable: '--font-oswald' });
const pacifico = Pacifico({ subsets: ['latin'], weight: ['400'], variable: '--font-pacifico' });
const anton = Anton({ subsets: ['latin'], weight: ['400'], variable: '--font-anton' });
const lobster = Lobster({ subsets: ['latin'], weight: ['400'], variable: '--font-lobster' });

const fontOptions = [
    { name: "Arial", value: "Arial" },
    { name: "Roboto", value: roboto.style.fontFamily },
    { name: "Oswald", value: oswald.style.fontFamily },
    { name: "Pacifico", value: pacifico.style.fontFamily },
    { name: "Anton", value: anton.style.fontFamily },
    { name: "Lobster", value: lobster.style.fontFamily },
];

// Define types for our templates
interface CatalogueItemColor {
    id: string;
    name: string;
    hex: string;
    frontImageUrl: string;
    backImageUrl: string;
    sideImageUrl: string;
}

interface CatalogueItem {
    id: string;
    name: string;
    colors: CatalogueItemColor[];
    availableFabrics?: string[];
}

interface FabricItem {
    id: string;
    name: string;
}

const printTypes = [
    { value: "embroidery", label: "Embroidery" },
    { value: "printing", label: "Printing" },
];

const sizeRanges = [
    "S - XL",
    "XS - XXL",
    "XS - 3XL",
    "XS - 5XL",
    "One Size",
    "Custom Range",
];

// Fallback colors if no templates exist
const fallbackColors = [
    { name: "White", value: "#FFFFFF", textColor: "#000" },
    { name: "Black", value: "#1a1a1a", textColor: "#fff" },
    { name: "Navy", value: "#1e3a5f", textColor: "#fff" },
];



export default function DesignPage() {
    const router = useRouter();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fabricCanvasRef = useRef<any>(null); // Fabric canvas instance
    const fileInputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Data State
    const [catalogueItems, setCatalogueItems] = useState<CatalogueItem[]>([]);
    const [fabrics, setFabrics] = useState<FabricItem[]>([]);
    const [isLoadingData, setIsLoadingData] = useState(true);

    // UI State
    const [step, setStep] = useState<1 | 2>(1); // 1: Design, 2: Details
    const [currentView, setCurrentView] = useState<"front" | "back" | "side">("front");
    const [selectedItem, setSelectedItem] = useState<CatalogueItem | null>(null);
    const [selectedColor, setSelectedColor] = useState<CatalogueItemColor | null>(null);
    const [isCanvasReady, setIsCanvasReady] = useState(false);

    // Design State
    const [canvasStates, setCanvasStates] = useState<{ [key: string]: any }>({
        front: null,
        back: null,
        side: null,
    });
    const [originalLogoUrl, setOriginalLogoUrl] = useState<string | null>(null);
    const [selectedObject, setSelectedObject] = useState<any>(null);
    const [fillColor, setFillColor] = useState("#000000");

    // Clipart State
    const [isClipartOpen, setIsClipartOpen] = useState(false);
    const [clipartQuery, setClipartQuery] = useState("");
    const [clipartResults, setClipartResults] = useState<string[]>([]);
    const [isSearchingClipart, setIsSearchingClipart] = useState(false);



    // Form State
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        fabricId: "",
        printType: "",
        quantity: "",
        sizeRange: "",
        phoneNumber: "",
        email: "",
        companyName: "",
        contactPerson: "",
        notes: "",
    });

    // Fetch Initial Data
    useEffect(() => {
        async function fetchData() {
            try {
                const [fabricsRes, itemsRes] = await Promise.all([
                    fetch("/api/catalogue/fabrics", { cache: "no-store" }),
                    fetch("/api/catalogue/items?isCustomizable=true", { cache: "no-store" }),
                ]);

                const fabricsData = await fabricsRes.json();
                const itemsData = await itemsRes.json();

                if (fabricsData.success) setFabrics(fabricsData.data);
                if (itemsData.success && itemsData.data.length > 0) {
                    // Filter items that have colors
                    const validItems = itemsData.data.filter((item: any) => item.colors && item.colors.length > 0);
                    setCatalogueItems(validItems);
                    if (validItems.length > 0) {
                        setSelectedItem(validItems[0]);
                        setSelectedColor(validItems[0].colors[0]);
                    }
                }
            } catch (error) {
                console.error("Failed to load data:", error);
                toast.error("Failed to load design assets");
            } finally {
                setIsLoadingData(false);
            }
        }
        fetchData();
    }, []);

    // Initialize Fabric.js
    useEffect(() => {
        let fabricInstance: any;

        const initCanvas = async () => {
            if (!canvasRef.current || !containerRef.current || !selectedColor) return;

            // Dynamically import fabric to avoid SSR issues
            const fabricModule = await import("fabric");
            const { Canvas, Rect, Circle, Triangle, IText, Image: FabricImage } = fabricModule;

            // Calculate dimensions based on container
            const width = containerRef.current.clientWidth;
            const height = containerRef.current.clientHeight;

            // Initialize canvas
            if (!fabricCanvasRef.current) {
                fabricInstance = new Canvas(canvasRef.current, {
                    width: width,
                    height: height,
                    backgroundColor: "transparent", // Transparent to show image behind
                    preserveObjectStacking: true,
                });
                fabricCanvasRef.current = fabricInstance;

                // Event listeners
                fabricInstance.on("selection:created", (e: any) => setSelectedObject(e.selected[0]));
                fabricInstance.on("selection:updated", (e: any) => setSelectedObject(e.selected[0]));
                fabricInstance.on("selection:cleared", () => setSelectedObject(null));

                setIsCanvasReady(true);
            } else {
                fabricInstance = fabricCanvasRef.current;
                fabricInstance.setDimensions({ width, height });
            }

            // Load state for current view if exists
            if (canvasStates[currentView]) {
                await fabricInstance.loadFromJSON(canvasStates[currentView]);
            } else {
                fabricInstance.clear();
                fabricInstance.backgroundColor = "transparent";
            }

            fabricInstance.renderAll();
        };

        if (!isLoadingData && selectedColor) {
            // Small delay to ensure DOM is ready
            const timer = setTimeout(initCanvas, 100);
            return () => clearTimeout(timer);
        }
    }, [isLoadingData, selectedColor, currentView]); // Re-init when view changes? No, handle view change separately

    // Handle View Change
    const handleViewChange = async (newView: "front" | "back" | "side") => {
        if (!fabricCanvasRef.current || !selectedColor) return;

        // Check if image exists for the new view
        let newImage = "";
        if (newView === "front") newImage = selectedColor.frontImageUrl;
        if (newView === "back") newImage = selectedColor.backImageUrl;
        if (newView === "side") newImage = selectedColor.sideImageUrl;

        if (!newImage) {
            toast.error(`${newView.charAt(0).toUpperCase() + newView.slice(1)} view is not available for this color.`);
            return;
        }

        // Save current state
        const json = fabricCanvasRef.current.toJSON();
        setCanvasStates((prev) => ({ ...prev, [currentView]: json }));

        // Switch view
        setCurrentView(newView);

        // Load new state (handled in useEffect or here)
        // We'll handle it here to be faster
        const newState = canvasStates[newView];
        if (newState) {
            await fabricCanvasRef.current.loadFromJSON(newState);
        } else {
            fabricCanvasRef.current.clear();
            fabricCanvasRef.current.backgroundColor = "transparent";
        }
        fabricCanvasRef.current.renderAll();
    };

    // Handle Color Change - Preserve canvas designs when switching colors
    const handleColorChange = (color: CatalogueItemColor) => {
        if (!fabricCanvasRef.current) return;

        // Save current canvas state before changing color
        const json = fabricCanvasRef.current.toJSON();
        setCanvasStates((prev) => ({ ...prev, [currentView]: json }));

        setSelectedColor(color);
    };

    const handleItemChange = (itemId: string) => {
        const item = catalogueItems.find(i => i.id === itemId);
        if (item && item.colors.length > 0) {
            // Clear all canvas states when changing product
            setCanvasStates({
                front: null,
                back: null,
                side: null,
            });

            // Clear the actual canvas
            if (fabricCanvasRef.current) {
                fabricCanvasRef.current.clear();
                fabricCanvasRef.current.backgroundColor = "transparent";
                fabricCanvasRef.current.renderAll();
            }

            setSelectedItem(item);
            setSelectedColor(item.colors[0]);
        }
    };

    // Tools
    const addText = async () => {
        if (!fabricCanvasRef.current) return;
        const { IText } = await import("fabric");
        const text = new IText("Your Text", {
            left: 100,
            top: 100,
            fontFamily: "Arial",
            fill: fillColor,
            fontSize: 40,
        });
        fabricCanvasRef.current.add(text);
        fabricCanvasRef.current.setActiveObject(text);
        fabricCanvasRef.current.renderAll();
    };

    const addShape = async (type: "rect" | "circle" | "triangle" | "star" | "heart" | "hexagon" | "diamond" | "arrow" | "zap") => {
        if (!fabricCanvasRef.current) return;
        const fabricModule = await import("fabric");
        let shape;
        const commonProps = { left: 150, top: 150, fill: fillColor, width: 100, height: 100 };

        if (type === "rect") shape = new fabricModule.Rect(commonProps);
        if (type === "circle") shape = new fabricModule.Circle({ ...commonProps, radius: 50 });
        if (type === "triangle") shape = new fabricModule.Triangle(commonProps);

        if (type === "star") {
            const points = [
                { x: 50, y: 0 }, { x: 61, y: 35 }, { x: 98, y: 35 }, { x: 68, y: 57 },
                { x: 79, y: 91 }, { x: 50, y: 70 }, { x: 21, y: 91 }, { x: 32, y: 57 },
                { x: 2, y: 35 }, { x: 39, y: 35 }
            ];
            shape = new fabricModule.Polygon(points, { ...commonProps, scaleX: 1, scaleY: 1 });
        }

        if (type === "hexagon") {
            const points = [
                { x: 25, y: 0 }, { x: 75, y: 0 }, { x: 100, y: 43 }, { x: 75, y: 86 },
                { x: 25, y: 86 }, { x: 0, y: 43 }
            ];
            shape = new fabricModule.Polygon(points, { ...commonProps, scaleX: 1, scaleY: 1 });
        }

        if (type === "diamond") {
            shape = new fabricModule.Rect({ ...commonProps, angle: 45 });
        }

        if (type === "heart") {
            const path = "M 272.70141,238.71731 C 206.46141,238.71731 152.70141,292.47731 152.70141,358.71731 C 152.70141,493.71731 288.66541,573.71731 381.26341,621.82531 C 468.89841,575.61531 609.82541,492.44431 609.82541,358.71731 C 609.82541,292.47731 556.06541,238.71731 489.82541,238.71731 C 443.42941,238.71731 403.39041,264.53131 381.26341,302.28931 C 359.13641,264.53131 319.09741,238.71731 272.70141,238.71731 z";
            shape = new fabricModule.Path(path, { ...commonProps, scaleX: 0.2, scaleY: 0.2 });
        }

        if (type === "arrow") {
            const path = "M 0 50 L 50 0 L 50 25 L 100 25 L 100 75 L 50 75 L 50 100 z";
            shape = new fabricModule.Path(path, { ...commonProps, scaleX: 0.8, scaleY: 0.8 });
        }

        if (type === "zap") {
            const path = "M 55 0 L 0 60 L 40 60 L 25 100 L 80 40 L 40 40 z";
            shape = new fabricModule.Path(path, { ...commonProps, scaleX: 0.8, scaleY: 0.8 });
        }

        if (shape) {
            fabricCanvasRef.current.add(shape);
            fabricCanvasRef.current.setActiveObject(shape);
            fabricCanvasRef.current.renderAll();
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !fabricCanvasRef.current) return;

        const reader = new FileReader();
        reader.onload = async (event) => {
            const dataUrl = event.target?.result as string;
            setOriginalLogoUrl(dataUrl); // Save high-res original

            const { FabricImage } = await import("fabric");
            const imgElement = new window.Image();
            imgElement.src = dataUrl;
            imgElement.onload = () => {
                const imgInstance = new FabricImage(imgElement, {
                    scaleX: 0.3,
                    scaleY: 0.3,
                    left: 100,
                    top: 100,
                });
                fabricCanvasRef.current.add(imgInstance);
                fabricCanvasRef.current.setActiveObject(imgInstance);
                fabricCanvasRef.current.renderAll();
            };
        };
        reader.readAsDataURL(file);
        e.target.value = "";
    };

    const deleteSelected = () => {
        if (!fabricCanvasRef.current) return;
        const activeObj = fabricCanvasRef.current.getActiveObject();
        if (activeObj) {
            fabricCanvasRef.current.remove(activeObj);
            fabricCanvasRef.current.discardActiveObject();
            fabricCanvasRef.current.renderAll();
            setSelectedObject(null);
        }
    };

    const updateColor = (color: string) => {
        setFillColor(color);
        if (selectedObject) {
            selectedObject.set("fill", color);
            fabricCanvasRef.current.renderAll();
        }
    };

    const updateFont = (font: string) => {
        if (selectedObject && (selectedObject.type === "i-text" || selectedObject.type === "text")) {
            selectedObject.set("fontFamily", font);
            fabricCanvasRef.current.renderAll();
            // Force update to reflect change if needed, though fabric handles render
        }
    };

    // Clipart Functions
    const searchClipart = async () => {
        if (!clipartQuery.trim()) return;
        setIsSearchingClipart(true);
        try {
            const res = await fetch(`https://api.iconify.design/search?query=${encodeURIComponent(clipartQuery)}&limit=50`);
            const data = await res.json();
            if (data.icons) {
                setClipartResults(data.icons);
            } else {
                setClipartResults([]);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to search clipart");
        } finally {
            setIsSearchingClipart(false);
        }
    };

    const addClipartToCanvas = async (iconName: string) => {
        if (!fabricCanvasRef.current) return;

        const [prefix, name] = iconName.split(":");
        const url = `https://api.iconify.design/${prefix}/${name}.svg`;

        try {
            const fabricModule = await import("fabric");

            // Fetch SVG content
            const res = await fetch(url);
            const svgStr = await res.text();

            // Load SVG
            const { objects, options } = await fabricModule.loadSVGFromString(svgStr);
            const obj = fabricModule.util.groupSVGElements(objects.filter(o => o !== null), options);

            // Set properties
            obj.set({
                left: 150,
                top: 150,
                scaleX: 3, // Scale up a bit as icons are usually small (24px)
                scaleY: 3,
            });

            // If it's a simple path, we can set fill. If it's a group, it's harder.
            // We'll leave color as is for now.

            fabricCanvasRef.current.add(obj);
            fabricCanvasRef.current.setActiveObject(obj);
            fabricCanvasRef.current.renderAll();
            setIsClipartOpen(false);

        } catch (error) {
            console.error(error);
            toast.error("Failed to load clipart");
        }
    };





    // Submit
    const handleSubmit = async () => {
        if (!formData.fabricId || !formData.printType || !formData.quantity || !formData.phoneNumber) {
            toast.error("Please fill in all required fields");
            return;
        }

        setIsSubmitting(true);

        try {
            // Save current view state first
            let updatedCanvasStates = { ...canvasStates };
            if (fabricCanvasRef.current) {
                const json = fabricCanvasRef.current.toJSON();
                updatedCanvasStates = { ...updatedCanvasStates, [currentView]: json };
                setCanvasStates(updatedCanvasStates);
            }

            const fabricModule = await import("fabric");

            // Helper function to generate composite image for a view
            const generateCompositeImage = async (view: "front" | "back", canvasState: any, backgroundUrl: string | undefined): Promise<string> => {
                if (!fabricCanvasRef.current || !backgroundUrl || !canvasState) return "";

                const canvas = fabricCanvasRef.current;

                // Load the canvas state for this view
                await canvas.loadFromJSON(canvasState);

                // Add background image
                try {
                    await new Promise<void>((resolve) => {
                        fabricModule.FabricImage.fromURL(backgroundUrl, { crossOrigin: 'anonymous' }).then((img) => {
                            const scaleX = canvas.width! / img.width!;
                            const scaleY = canvas.height! / img.height!;
                            const scale = Math.max(scaleX, scaleY);
                            img.scale(scale);
                            img.set({
                                originX: 'center',
                                originY: 'center',
                                left: canvas.width! / 2,
                                top: canvas.height! / 2
                            });
                            canvas.backgroundImage = img;
                            canvas.renderAll();
                            resolve();
                        }).catch(() => resolve());
                    });

                    const dataUrl = canvas.toDataURL();

                    // Clear background
                    canvas.backgroundImage = null;
                    canvas.renderAll();

                    return dataUrl;
                } catch (e) {
                    console.error(`Error creating ${view} composite image`, e);
                    return canvas.toDataURL();
                }
            };

            // Generate front design image
            let designImageUrl = "";
            if (selectedColor?.frontImageUrl && updatedCanvasStates.front) {
                designImageUrl = await generateCompositeImage("front", updatedCanvasStates.front, selectedColor.frontImageUrl);
            } else if (fabricCanvasRef.current && updatedCanvasStates.front) {
                await fabricCanvasRef.current.loadFromJSON(updatedCanvasStates.front);
                designImageUrl = fabricCanvasRef.current.toDataURL();
            }

            // Generate back design image
            let backDesignImageUrl = "";
            if (selectedColor?.backImageUrl && updatedCanvasStates.back) {
                backDesignImageUrl = await generateCompositeImage("back", updatedCanvasStates.back, selectedColor.backImageUrl);
            } else if (fabricCanvasRef.current && updatedCanvasStates.back) {
                await fabricCanvasRef.current.loadFromJSON(updatedCanvasStates.back);
                backDesignImageUrl = fabricCanvasRef.current.toDataURL();
            }

            // Generate side design image
            let sideDesignImageUrl = "";
            if (selectedColor?.sideImageUrl && updatedCanvasStates.side) {
                sideDesignImageUrl = await generateCompositeImage("side" as any, updatedCanvasStates.side, selectedColor.sideImageUrl);
            } else if (fabricCanvasRef.current && updatedCanvasStates.side) {
                await fabricCanvasRef.current.loadFromJSON(updatedCanvasStates.side);
                sideDesignImageUrl = fabricCanvasRef.current.toDataURL();
            }

            // Restore current view state
            if (fabricCanvasRef.current && updatedCanvasStates[currentView]) {
                await fabricCanvasRef.current.loadFromJSON(updatedCanvasStates[currentView]);
                fabricCanvasRef.current.renderAll();
            }

            const response = await fetch("/api/design-enquiries", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    designImageUrl,
                    backDesignImageUrl: backDesignImageUrl || undefined,
                    sideDesignImageUrl: sideDesignImageUrl || undefined,
                    originalLogoUrl: originalLogoUrl || undefined,
                    designJson: updatedCanvasStates, // Send ALL views
                    fabricId: formData.fabricId,
                    printType: formData.printType,
                    quantity: parseInt(formData.quantity),
                    sizeRange: formData.sizeRange,
                    phoneNumber: formData.phoneNumber,
                    email: formData.email || undefined,
                    companyName: formData.companyName || undefined,
                    contactPerson: formData.contactPerson || undefined,
                    notes: formData.notes || undefined,
                }),
            });

            const result = await response.json();

            if (result.success) {
                setIsSubmitted(true);
                toast.success("Enquiry submitted successfully!");
            } else {
                if (result.details) {
                    const messages = result.details.map((d: any) => `${d.path.join('.')}: ${d.message}`).join('\n');
                    toast.error(`Validation failed:\n${messages}`);
                } else {
                    toast.error(result.error || "Failed to submit");
                }
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Render Logic
    if (isSubmitted) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-muted/30">
                <div className="text-center max-w-md mx-auto p-8 bg-background rounded-xl shadow-lg border">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Check className="h-10 w-10 text-green-600" />
                    </div>
                    <h2 className="text-3xl font-bold mb-4">Enquiry Sent!</h2>
                    <p className="text-muted-foreground mb-8">
                        We have received your design. Our team will review it and send you a quote shortly.
                    </p>
                    <Button onClick={() => window.location.reload()} className="w-full">
                        Create Another Design
                    </Button>
                </div>
            </div>
        );
    }

    if (isLoadingData) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    // Fallback if no items
    if (catalogueItems.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
                <Shirt className="h-16 w-16 text-muted-foreground mb-4" />
                <h1 className="text-2xl font-bold mb-2">Design Tool Unavailable</h1>
                <p className="text-muted-foreground max-w-md">
                    No design templates are currently available. Please contact the administrator to add T-shirt templates.
                </p>
                <Button variant="outline" className="mt-6" onClick={() => router.push("/")}>
                    Return Home
                </Button>
            </div>
        );
    }

    return (
        <div className={`min-h-screen bg-muted/10 flex flex-col ${roboto.variable} ${oswald.variable} ${pacifico.variable} ${anton.variable} ${lobster.variable}`}>
            {/* Header */}
            <header className="bg-background border-b sticky top-0 z-20 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/" className="p-2 hover:bg-muted rounded-full transition-colors">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <div>
                        <h1 className="font-bold text-lg">Design Studio</h1>
                        <p className="text-xs text-muted-foreground">
                            {step === 1 ? "Customize your design" : "Finalize enquiry details"}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {step === 1 ? (
                        <Button onClick={() => setStep(2)} className="gap-2">
                            Next Step <ChevronRight className="h-4 w-4" />
                        </Button>
                    ) : (
                        <>
                            <Button variant="ghost" onClick={() => setStep(1)}>Back</Button>
                            <Button onClick={handleSubmit} disabled={isSubmitting} className="gap-2">
                                {isSubmitting ? <Loader2 className="animate-spin h-4 w-4" /> : <Check className="h-4 w-4" />}
                                Submit Enquiry
                            </Button>
                        </>
                    )}
                </div>
            </header>

            <main className="flex-1 flex overflow-hidden h-[calc(100vh-73px)]">
                {/* Left Sidebar - Tools (Only in Step 1) */}
                {step === 1 && (
                    <aside className="w-80 bg-background border-r flex flex-col overflow-y-auto z-10">
                        <div className="p-4 space-y-6">
                            {/* Product & Color Selection */}
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Select Product</Label>
                                    <Select
                                        value={selectedItem?.id}
                                        onValueChange={handleItemChange}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a product" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {catalogueItems.map(item => (
                                                <SelectItem key={item.id} value={item.id}>
                                                    {item.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2">
                                        <Palette className="h-4 w-4" /> Product Color
                                    </Label>
                                    <div className="grid grid-cols-5 gap-2">
                                        {selectedItem?.colors.map((color) => (
                                            <button
                                                key={color.id}
                                                onClick={() => handleColorChange(color)}
                                                className={`w-10 h-10 rounded-full border-2 transition-all ${selectedColor?.id === color.id
                                                    ? "border-primary ring-2 ring-primary/20 scale-110"
                                                    : "border-transparent hover:scale-105"
                                                    }`}
                                                style={{ backgroundColor: color.hex }}
                                                title={color.name}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-xs text-muted-foreground text-center">
                                        {selectedColor?.name}
                                    </p>
                                </div>
                            </div>

                            <div className="h-px bg-border" />

                            {/* Add Elements */}
                            <div className="space-y-3">
                                <Label className="flex items-center gap-2">
                                    <Layers className="h-4 w-4" /> Add Elements
                                </Label>
                                <div className="grid grid-cols-2 gap-2">
                                    <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="h-20 flex flex-col gap-2">
                                        <Upload className="h-6 w-6" />
                                        <span className="text-xs">Upload Logo</span>
                                    </Button>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                    />

                                    <Button variant="outline" onClick={addText} className="h-20 flex flex-col gap-2">
                                        <Type className="h-6 w-6" />
                                        <span className="text-xs">Add Text</span>
                                    </Button>

                                    <Dialog open={isClipartOpen} onOpenChange={setIsClipartOpen}>
                                        <DialogTrigger asChild>
                                            <Button variant="outline" className="h-20 flex flex-col gap-2 col-span-2">
                                                <ImageIcon className="h-6 w-6" />
                                                <span className="text-xs">Add Clipart</span>
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-[600px] h-[80vh] flex flex-col">
                                            <DialogHeader>
                                                <DialogTitle>Search Clipart Library</DialogTitle>
                                            </DialogHeader>
                                            <div className="flex gap-2 my-4">
                                                <Input
                                                    placeholder="Search icons (e.g. tiger, flower, skull)..."
                                                    value={clipartQuery}
                                                    onChange={(e) => setClipartQuery(e.target.value)}
                                                    onKeyDown={(e) => e.key === 'Enter' && searchClipart()}
                                                />
                                                <Button onClick={searchClipart} disabled={isSearchingClipart}>
                                                    {isSearchingClipart ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                                                </Button>
                                            </div>

                                            <div className="flex-1 overflow-y-auto grid grid-cols-5 sm:grid-cols-6 gap-4 p-2 border rounded-md">
                                                {clipartResults.map((icon) => (
                                                    <button
                                                        key={icon}
                                                        onClick={() => addClipartToCanvas(icon)}
                                                        className="aspect-square flex items-center justify-center p-2 border rounded hover:bg-muted hover:border-primary transition-colors"
                                                        title={icon}
                                                    >
                                                        {/* We can use an img tag for preview */}
                                                        <img
                                                            src={`https://api.iconify.design/${icon.split(":")[0]}/${icon.split(":")[1]}.svg`}
                                                            alt={icon}
                                                            className="w-full h-full object-contain"
                                                            loading="lazy"
                                                        />
                                                    </button>
                                                ))}
                                                {clipartResults.length === 0 && !isSearchingClipart && (
                                                    <div className="col-span-full flex flex-col items-center justify-center text-muted-foreground h-40">
                                                        <Search className="h-8 w-8 mb-2 opacity-20" />
                                                        <p>Search for something...</p>
                                                    </div>
                                                )}
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <Button variant="outline" size="icon" onClick={() => addShape("rect")} title="Rectangle">
                                        <Square className="h-4 w-4" />
                                    </Button>
                                    <Button variant="outline" size="icon" onClick={() => addShape("circle")} title="Circle">
                                        <CircleIcon className="h-4 w-4" />
                                    </Button>
                                    <Button variant="outline" size="icon" onClick={() => addShape("triangle")} title="Triangle">
                                        <Triangle className="h-4 w-4" />
                                    </Button>
                                    <Button variant="outline" size="icon" onClick={() => addShape("star")} title="Star">
                                        <Star className="h-4 w-4" />
                                    </Button>
                                    <Button variant="outline" size="icon" onClick={() => addShape("heart")} title="Heart">
                                        <Heart className="h-4 w-4" />
                                    </Button>
                                    <Button variant="outline" size="icon" onClick={() => addShape("hexagon")} title="Hexagon">
                                        <Hexagon className="h-4 w-4" />
                                    </Button>
                                    <Button variant="outline" size="icon" onClick={() => addShape("diamond")} title="Diamond">
                                        <Diamond className="h-4 w-4" />
                                    </Button>
                                    <Button variant="outline" size="icon" onClick={() => addShape("arrow")} title="Arrow">
                                        <ArrowRight className="h-4 w-4" />
                                    </Button>
                                    <Button variant="outline" size="icon" onClick={() => addShape("zap")} title="Lightning">
                                        <Zap className="h-4 w-4" />
                                    </Button>

                                </div>
                            </div>

                            {/* Element Properties */}
                            {selectedObject && (
                                <div className="p-4 bg-muted/50 rounded-lg space-y-3 animate-in fade-in slide-in-from-left-4">
                                    <Label>Element Color</Label>
                                    <div className="flex flex-wrap gap-2">
                                        {["#000000", "#FFFFFF", "#FF0000", "#00FF00", "#0000FF", "#FFFF00"].map(c => (
                                            <button
                                                key={c}
                                                onClick={() => updateColor(c)}
                                                className="w-6 h-6 rounded-full border shadow-sm"
                                                style={{ backgroundColor: c }}
                                            />
                                        ))}
                                        <input
                                            type="color"
                                            value={fillColor}
                                            onChange={(e) => updateColor(e.target.value)}
                                            className="w-6 h-6 p-0 border-0 rounded-full overflow-hidden"
                                        />
                                    </div>

                                    {(selectedObject.type === "i-text" || selectedObject.type === "text") && (
                                        <div className="space-y-2">
                                            <Label>Font Family</Label>
                                            <Select onValueChange={updateFont} defaultValue={selectedObject.fontFamily}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Font" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {fontOptions.map(f => (
                                                        <SelectItem key={f.name} value={f.value} style={{ fontFamily: f.value }}>
                                                            {f.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    )}

                                    <Button variant="destructive" size="sm" onClick={deleteSelected} className="w-full">
                                        <Trash2 className="h-4 w-4 mr-2" /> Remove Element
                                    </Button>
                                </div>
                            )}
                        </div>
                    </aside>
                )}

                {/* Center - Canvas Area */}
                <div className={`flex-1 relative bg-muted/20 flex flex-col ${step === 2 ? "hidden lg:flex" : ""}`}>
                    {/* View Controls */}
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-background/90 backdrop-blur border rounded-full p-1 shadow-sm flex gap-1">
                        {(["front", "back", "side"] as const).map((view) => (
                            <button
                                key={view}
                                onClick={() => handleViewChange(view)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${currentView === view
                                    ? "bg-primary text-primary-foreground"
                                    : "hover:bg-muted text-muted-foreground"
                                    }`}
                            >
                                {view.charAt(0).toUpperCase() + view.slice(1)} View
                            </button>
                        ))}
                    </div>

                    {/* Canvas Container */}
                    <div className="flex-1 flex items-center justify-center p-8 overflow-hidden">
                        <div
                            ref={containerRef}
                            className="relative w-full max-w-[600px] aspect-[3/4] bg-white shadow-2xl rounded-lg overflow-hidden"
                        >
                            {/* Background Image (T-Shirt) */}
                            {/* Background Image (T-Shirt) */}
                            {selectedColor && (() => {
                                const currentSrc = currentView === "front" ? selectedColor.frontImageUrl :
                                    currentView === "back" ? selectedColor.backImageUrl :
                                        selectedColor.sideImageUrl;

                                if (!currentSrc) return null;

                                return (
                                    <div className="absolute inset-0 z-0">
                                        <Image
                                            src={currentSrc}
                                            alt="Product Template"
                                            fill
                                            className="object-cover"
                                            priority
                                        />
                                    </div>
                                );
                            })()}



                            {/* Fabric Canvas */}
                            <canvas ref={canvasRef} className="absolute inset-0 z-20" />
                        </div>
                    </div>
                </div>

                {/* Right Sidebar - Enquiry Form (Only in Step 2) */}
                {step === 2 && (
                    <aside className="w-full lg:w-[500px] bg-background border-l overflow-y-auto p-6 animate-in slide-in-from-right-8">
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-xl font-bold">Order Details</h2>
                                <p className="text-muted-foreground text-sm">Tell us about your requirements</p>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Fabric Type <span className="text-destructive">*</span></Label>
                                    <Select value={formData.fabricId} onValueChange={(v) => setFormData({ ...formData, fabricId: v })}>
                                        <SelectTrigger><SelectValue placeholder="Select fabric" /></SelectTrigger>
                                        <SelectContent>
                                            {fabrics
                                                .filter(f => !selectedItem?.availableFabrics || selectedItem.availableFabrics.length === 0 || selectedItem.availableFabrics.includes(f.id))
                                                .map(f => <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>)
                                            }
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Print Method <span className="text-destructive">*</span></Label>
                                    <Select value={formData.printType} onValueChange={(v) => setFormData({ ...formData, printType: v })}>
                                        <SelectTrigger><SelectValue placeholder="Select method" /></SelectTrigger>
                                        <SelectContent>
                                            {printTypes.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Quantity <span className="text-destructive">*</span></Label>
                                        <Input
                                            type="number"
                                            value={formData.quantity}
                                            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                            placeholder="e.g. 50"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Size Range <span className="text-destructive">*</span></Label>
                                        <Select value={formData.sizeRange} onValueChange={(v) => setFormData({ ...formData, sizeRange: v })}>
                                            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                                            <SelectContent>
                                                {sizeRanges.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="h-px bg-border my-4" />

                                <div className="space-y-2">
                                    <Label>Phone Number <span className="text-destructive">*</span></Label>
                                    <Input
                                        value={formData.phoneNumber}
                                        onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                        placeholder="+91..."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Email (Optional)</Label>
                                    <Input
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        placeholder="email@example.com"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Additional Notes</Label>
                                    <Textarea
                                        value={formData.notes}
                                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                        placeholder="Any specific instructions..."
                                    />
                                </div>
                            </div>
                        </div>
                    </aside>
                )}
            </main>
        </div>
    );
}

