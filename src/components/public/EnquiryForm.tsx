"use client";

import { useState, useEffect } from "react";
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
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";

interface ClothingType {
    id: string;
    name: string;
}

interface Fabric {
    id: string;
    name: string;
}

const sizeRanges = [
    "S - XL",
    "XS - XXL",
    "XS - 3XL",
    "XS - 5XL",
    "One Size",
    "Custom Range",
];

interface FormData {
    clothingTypeId: string;
    fabricId: string;
    quantity: string;
    sizeRange: string;
    phoneNumber: string;
    email: string;
    companyName: string;
    contactPerson: string;
    notes: string;
}

const initialFormData: FormData = {
    clothingTypeId: "",
    fabricId: "",
    quantity: "",
    sizeRange: "",
    phoneNumber: "",
    email: "",
    companyName: "",
    contactPerson: "",
    notes: "",
};

const steps = [
    { id: 1, title: "Product Selection", description: "Choose garment type and fabric" },
    { id: 2, title: "Order Details", description: "Quantity and size requirements" },
    { id: 3, title: "Contact Information", description: "Your contact details" },
    { id: 4, title: "Review & Submit", description: "Confirm your enquiry" },
];

export function EnquiryForm() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    // Dynamic data from API
    const [clothingTypes, setClothingTypes] = useState<ClothingType[]>([]);
    const [fabrics, setFabrics] = useState<Fabric[]>([]);
    const [isLoadingData, setIsLoadingData] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const [typesRes, fabricsRes] = await Promise.all([
                    fetch("/api/catalogue/types"),
                    fetch("/api/catalogue/fabrics"),
                ]);

                const typesData = await typesRes.json();
                const fabricsData = await fabricsRes.json();

                if (typesData.success) {
                    setClothingTypes(typesData.data);
                }
                if (fabricsData.success) {
                    setFabrics(fabricsData.data);
                }
            } catch (error) {
                console.error("Failed to fetch form data:", error);
                toast.error("Failed to load form options");
            } finally {
                setIsLoadingData(false);
            }
        }
        fetchData();
    }, []);

    const updateField = (field: keyof FormData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const validateStep = (step: number): boolean => {
        switch (step) {
            case 1:
                return !!formData.clothingTypeId && !!formData.fabricId;
            case 2:
                return !!formData.quantity && parseInt(formData.quantity) > 0 && !!formData.sizeRange;
            case 3:
                return !!formData.phoneNumber;
            default:
                return true;
        }
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep((prev) => Math.min(prev + 1, 4));
        } else {
            toast.error("Please fill in all required fields");
        }
    };

    const handlePrev = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 1));
    };

    const handleSubmit = async () => {
        if (!validateStep(3)) {
            toast.error("Please fill in all required fields");
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch("/api/enquiries", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    quantity: parseInt(formData.quantity),
                }),
            });

            const result = await response.json();

            if (result.success) {
                setIsSubmitted(true);
                toast.success("Enquiry submitted successfully!");
            } else {
                console.error("Validation error:", result.details);
                toast.error(result.error || "Failed to submit enquiry");
            }
        } catch (error) {
            console.error("Submit error:", error);
            toast.error("An error occurred. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className="text-center py-12">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Check className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold mb-4">Thank You!</h2>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                    Your enquiry has been submitted successfully. Our team will review your
                    requirements and get back to you within 24 hours.
                </p>
                <Button onClick={() => router.push("/")} className="btn-industrial">
                    Return to Home
                </Button>
            </div>
        );
    }

    const getSelectedName = (id: string, list: { id: string; name: string }[]) => {
        return list.find((item) => item.id === id)?.name || "-";
    };

    if (isLoadingData) {
        return (
            <div className="flex items-center justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto">
            {/* Progress Steps */}
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    {steps.map((step, index) => (
                        <div key={step.id} className="flex items-center">
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${currentStep > step.id
                                    ? "bg-accent text-accent-foreground"
                                    : currentStep === step.id
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-muted text-muted-foreground"
                                    }`}
                            >
                                {currentStep > step.id ? (
                                    <Check className="h-5 w-5" />
                                ) : (
                                    step.id
                                )}
                            </div>
                            {index < steps.length - 1 && (
                                <div
                                    className={`w-12 md:w-24 h-1 mx-2 ${currentStep > step.id ? "bg-accent" : "bg-muted"
                                        }`}
                                />
                            )}
                        </div>
                    ))}
                </div>
                <div className="mt-4 text-center">
                    <h3 className="font-semibold">{steps[currentStep - 1].title}</h3>
                    <p className="text-sm text-muted-foreground">
                        {steps[currentStep - 1].description}
                    </p>
                </div>
            </div>

            {/* Form Steps */}
            <div className="bg-card border border-border p-6 md:p-8">
                {/* Step 1: Product Selection */}
                {currentStep === 1 && (
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="clothingType">
                                Clothing Type <span className="text-destructive">*</span>
                            </Label>
                            {clothingTypes.length === 0 ? (
                                <p className="text-sm text-muted-foreground p-3 bg-muted rounded">
                                    No clothing types available. Please contact us directly.
                                </p>
                            ) : (
                                <Select
                                    value={formData.clothingTypeId}
                                    onValueChange={(value) => updateField("clothingTypeId", value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select garment type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {clothingTypes.map((type) => (
                                            <SelectItem key={type.id} value={type.id}>
                                                {type.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="fabric">
                                Fabric <span className="text-destructive">*</span>
                            </Label>
                            {fabrics.length === 0 ? (
                                <p className="text-sm text-muted-foreground p-3 bg-muted rounded">
                                    No fabrics available. Please contact us directly.
                                </p>
                            ) : (
                                <Select
                                    value={formData.fabricId}
                                    onValueChange={(value) => updateField("fabricId", value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select fabric type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {fabrics.map((fabric) => (
                                            <SelectItem key={fabric.id} value={fabric.id}>
                                                {fabric.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        </div>
                    </div>
                )}

                {/* Step 2: Order Details */}
                {currentStep === 2 && (
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="quantity">
                                Quantity (units) <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="quantity"
                                type="number"
                                min="1"
                                placeholder="e.g., 1000"
                                value={formData.quantity}
                                onChange={(e) => updateField("quantity", e.target.value)}
                            />
                            <p className="text-xs text-muted-foreground">
                                Minimum order quantity varies by product (typically 300-500 units)
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="sizeRange">
                                Size Range <span className="text-destructive">*</span>
                            </Label>
                            <Select
                                value={formData.sizeRange}
                                onValueChange={(value) => updateField("sizeRange", value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select size range" />
                                </SelectTrigger>
                                <SelectContent>
                                    {sizeRanges.map((range) => (
                                        <SelectItem key={range} value={range}>
                                            {range}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                )}

                {/* Step 3: Contact Information */}
                {currentStep === 3 && (
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="phoneNumber">
                                Phone Number <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="phoneNumber"
                                type="tel"
                                placeholder="+1 234 567 890"
                                value={formData.phoneNumber}
                                onChange={(e) => updateField("phoneNumber", e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email (optional)</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="your@email.com"
                                value={formData.email}
                                onChange={(e) => updateField("email", e.target.value)}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="companyName">Company Name (optional)</Label>
                                <Input
                                    id="companyName"
                                    placeholder="Your company"
                                    value={formData.companyName}
                                    onChange={(e) => updateField("companyName", e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="contactPerson">Contact Person (optional)</Label>
                                <Input
                                    id="contactPerson"
                                    placeholder="Your name"
                                    value={formData.contactPerson}
                                    onChange={(e) => updateField("contactPerson", e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="notes">Additional Notes (optional)</Label>
                            <Textarea
                                id="notes"
                                placeholder="Any specific requirements, customizations, or questions..."
                                rows={4}
                                value={formData.notes}
                                onChange={(e) => updateField("notes", e.target.value)}
                            />
                        </div>
                    </div>
                )}

                {/* Step 4: Review */}
                {currentStep === 4 && (
                    <div className="space-y-6">
                        <h4 className="font-semibold text-lg">Review Your Enquiry</h4>

                        <div className="space-y-4 divide-y divide-border">
                            <div className="grid grid-cols-2 gap-4 pb-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">Clothing Type</p>
                                    <p className="font-medium">
                                        {getSelectedName(formData.clothingTypeId, clothingTypes)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Fabric</p>
                                    <p className="font-medium">
                                        {getSelectedName(formData.fabricId, fabrics)}
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 py-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">Quantity</p>
                                    <p className="font-medium">{formData.quantity} units</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Size Range</p>
                                    <p className="font-medium">{formData.sizeRange}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 py-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">Phone</p>
                                    <p className="font-medium">{formData.phoneNumber}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Email</p>
                                    <p className="font-medium">{formData.email || "-"}</p>
                                </div>
                            </div>

                            {(formData.companyName || formData.contactPerson) && (
                                <div className="grid grid-cols-2 gap-4 py-4">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Company</p>
                                        <p className="font-medium">{formData.companyName || "-"}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Contact Person</p>
                                        <p className="font-medium">{formData.contactPerson || "-"}</p>
                                    </div>
                                </div>
                            )}

                            {formData.notes && (
                                <div className="pt-4">
                                    <p className="text-sm text-muted-foreground">Notes</p>
                                    <p className="font-medium">{formData.notes}</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8 pt-6 border-t border-border">
                    {currentStep > 1 ? (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handlePrev}
                            disabled={isSubmitting}
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Previous
                        </Button>
                    ) : (
                        <div />
                    )}

                    {currentStep < 4 ? (
                        <Button type="button" onClick={handleNext} className="btn-industrial">
                            Next
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    ) : (
                        <Button
                            type="button"
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="btn-industrial"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    Submit Enquiry
                                    <Check className="ml-2 h-4 w-4" />
                                </>
                            )}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
