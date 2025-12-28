"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, Save, Eye, EyeOff, Plus, Trash2 } from "lucide-react";

interface SiteSection {
    id: string;
    sectionKey: string;
    title: string | null;
    isVisible: boolean | null;
    displayOrder: number | null;
}

interface CapacityStat {
    icon: string;
    value: string;
    label: string;
    description: string;
}

const defaultStats: CapacityStat[] = [
    { icon: "Package", value: "500", label: "Minimum Order Qty", description: "Units per style" },
    { icon: "TrendingUp", value: "100K+", label: "Monthly Capacity", description: "Units production" },
    { icon: "Clock", value: "3-6", label: "Lead Time", description: "Weeks to delivery" },
    { icon: "Ruler", value: "XS-5XL", label: "Size Range", description: "Full size coverage" },
    { icon: "Layers", value: "50+", label: "Fabric Options", description: "Premium materials" },
    { icon: "Award", value: "25+", label: "Years Experience", description: "In the industry" },
];

const iconOptions = [
    { value: "Package", label: "Package" },
    { value: "TrendingUp", label: "Trending Up" },
    { value: "Clock", label: "Clock" },
    { value: "Ruler", label: "Ruler" },
    { value: "Layers", label: "Layers" },
    { value: "Award", label: "Award" },
];

export default function SettingsPage() {
    const [sections, setSections] = useState<SiteSection[]>([]);
    const [settings, setSettings] = useState<Record<string, string>>({});
    const [capacityStats, setCapacityStats] = useState<CapacityStat[]>(defaultStats);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isSavingStats, setIsSavingStats] = useState(false);

    const fetchData = async () => {
        try {
            const [sectionsRes, settingsRes] = await Promise.all([
                fetch("/api/settings/sections"),
                fetch("/api/settings"),
            ]);

            const sectionsData = await sectionsRes.json();
            const settingsData = await settingsRes.json();

            if (sectionsData.success) {
                setSections(sectionsData.data);
            }
            if (settingsData.success && settingsData.data) {
                setSettings(settingsData.data || {});
                if (settingsData.data.capacity_stats) {
                    setCapacityStats(settingsData.data.capacity_stats);
                }
            }
        } catch (error) {
            console.error("Failed to fetch data:", error);
            toast.error("Failed to load settings");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleToggleSection = async (sectionKey: string, isVisible: boolean) => {
        try {
            const response = await fetch("/api/settings/sections", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ sectionKey, isVisible }),
            });

            const result = await response.json();

            if (result.success) {
                setSections((prev) =>
                    prev.map((s) =>
                        s.sectionKey === sectionKey ? { ...s, isVisible } : s
                    )
                );
                toast.success(
                    `Section ${isVisible ? "shown" : "hidden"} successfully`
                );
            } else {
                toast.error(result.error || "Failed to update section");
            }
        } catch (error) {
            toast.error("An error occurred");
        }
    };

    const handleSaveSettings = async () => {
        setIsSaving(true);
        try {
            const response = await fetch("/api/settings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(settings),
            });

            const result = await response.json();

            if (result.success) {
                toast.success("Settings saved successfully");
            } else {
                toast.error(result.error || "Failed to save settings");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setIsSaving(false);
        }
    };

    const handleSaveCapacityStats = async () => {
        setIsSavingStats(true);
        try {
            const response = await fetch("/api/settings", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    key: "capacity_stats",
                    value: capacityStats,
                }),
            });

            const result = await response.json();

            if (result.success) {
                toast.success("Production capabilities saved successfully");
            } else {
                toast.error(result.error || "Failed to save");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setIsSavingStats(false);
        }
    };

    const updateStat = (index: number, field: keyof CapacityStat, value: string) => {
        setCapacityStats((prev) =>
            prev.map((stat, i) =>
                i === index ? { ...stat, [field]: value } : stat
            )
        );
    };

    const addStat = () => {
        setCapacityStats((prev) => [
            ...prev,
            { icon: "Package", value: "", label: "", description: "" },
        ]);
    };

    const removeStat = (index: number) => {
        setCapacityStats((prev) => prev.filter((_, i) => i !== index));
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold">Site Settings</h1>
                <p className="text-muted-foreground">
                    Manage website content and section visibility
                </p>
            </div>

            <Tabs defaultValue="general" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="general">General Settings</TabsTrigger>
                    <TabsTrigger value="capacity">Production Capabilities</TabsTrigger>
                    <TabsTrigger value="sections">Section Visibility</TabsTrigger>
                </TabsList>

                {/* General Settings Tab */}
                <TabsContent value="general">
                    <Card>
                        <CardHeader>
                            <CardTitle>Company Information</CardTitle>
                            <CardDescription>
                                Basic information displayed on the website
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="company_name">Company Name</Label>
                                    <Input
                                        id="company_name"
                                        value={settings.company_name || ""}
                                        onChange={(e) =>
                                            setSettings((prev) => ({
                                                ...prev,
                                                company_name: e.target.value,
                                            }))
                                        }
                                        placeholder="Premium Textiles Mfg."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="company_tagline">Tagline</Label>
                                    <Input
                                        id="company_tagline"
                                        value={settings.company_tagline || ""}
                                        onChange={(e) =>
                                            setSettings((prev) => ({
                                                ...prev,
                                                company_tagline: e.target.value,
                                            }))
                                        }
                                        placeholder="Quality Garments, High Volume"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="contact_email">Contact Email</Label>
                                    <Input
                                        id="contact_email"
                                        type="email"
                                        value={settings.contact_email || ""}
                                        onChange={(e) =>
                                            setSettings((prev) => ({
                                                ...prev,
                                                contact_email: e.target.value,
                                            }))
                                        }
                                        placeholder="info@company.com"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="contact_phone">Contact Phone</Label>
                                    <Input
                                        id="contact_phone"
                                        value={settings.contact_phone || ""}
                                        onChange={(e) =>
                                            setSettings((prev) => ({
                                                ...prev,
                                                contact_phone: e.target.value,
                                            }))
                                        }
                                        placeholder="+1 234 567 890"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end pt-4">
                                <Button
                                    onClick={handleSaveSettings}
                                    disabled={isSaving}
                                    className="btn-industrial"
                                >
                                    {isSaving ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                        <Save className="mr-2 h-4 w-4" />
                                    )}
                                    Save Settings
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Production Capabilities Tab */}
                <TabsContent value="capacity">
                    <Card>
                        <CardHeader>
                            <CardTitle>Production Capabilities</CardTitle>
                            <CardDescription>
                                Edit the stats displayed on the homepage
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {capacityStats.map((stat, index) => (
                                <div
                                    key={index}
                                    className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border border-border rounded-lg"
                                >
                                    <div className="space-y-2">
                                        <Label>Icon</Label>
                                        <Select
                                            value={stat.icon}
                                            onValueChange={(value) => updateStat(index, "icon", value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {iconOptions.map((opt) => (
                                                    <SelectItem key={opt.value} value={opt.value}>
                                                        {opt.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Value</Label>
                                        <Input
                                            value={stat.value}
                                            onChange={(e) => updateStat(index, "value", e.target.value)}
                                            placeholder="e.g., 500+"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Label</Label>
                                        <Input
                                            value={stat.label}
                                            onChange={(e) => updateStat(index, "label", e.target.value)}
                                            placeholder="e.g., Minimum Order"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Description</Label>
                                        <Input
                                            value={stat.description}
                                            onChange={(e) =>
                                                updateStat(index, "description", e.target.value)
                                            }
                                            placeholder="e.g., Units per style"
                                        />
                                    </div>
                                    <div className="flex items-end">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removeStat(index)}
                                            disabled={capacityStats.length <= 1}
                                        >
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </div>
                                </div>
                            ))}

                            <div className="flex justify-between pt-4">
                                <Button variant="outline" onClick={addStat}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Stat
                                </Button>
                                <Button
                                    onClick={handleSaveCapacityStats}
                                    disabled={isSavingStats}
                                    className="btn-industrial"
                                >
                                    {isSavingStats ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                        <Save className="mr-2 h-4 w-4" />
                                    )}
                                    Save Capabilities
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Section Visibility Tab */}
                <TabsContent value="sections">
                    <Card>
                        <CardHeader>
                            <CardTitle>Section Visibility</CardTitle>
                            <CardDescription>
                                Show or hide sections on the public website
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {sections.length === 0 ? (
                                <p className="text-muted-foreground text-center py-8">
                                    No sections configured. Run database migrations to initialize
                                    default sections.
                                </p>
                            ) : (
                                <div className="space-y-4">
                                    {sections.map((section) => (
                                        <div
                                            key={section.id}
                                            className="flex items-center justify-between p-4 border border-border rounded-lg"
                                        >
                                            <div className="flex items-center gap-4">
                                                {section.isVisible ? (
                                                    <Eye className="h-5 w-5 text-green-500" />
                                                ) : (
                                                    <EyeOff className="h-5 w-5 text-muted-foreground" />
                                                )}
                                                <div>
                                                    <p className="font-medium">{section.title}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {section.sectionKey}
                                                    </p>
                                                </div>
                                            </div>
                                            <Switch
                                                checked={section.isVisible ?? false}
                                                onCheckedChange={(checked) =>
                                                    handleToggleSection(section.sectionKey, checked)
                                                }
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
