"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
    Eye,
    Trash2,
    Loader2,
    Phone,
    Mail,
    Building,
    User,
    Palette,
    Download,
    Image as ImageIcon,
} from "lucide-react";
import Image from "next/image";

interface DesignEnquiry {
    id: string;
    designImageUrl: string;
    backDesignImageUrl: string | null;
    sideDesignImageUrl: string | null;
    originalLogoUrl: string | null;
    designJson: any;
    fabricName: string | null;
    printType: string | null;
    quantity: number;
    sizeRange: string | null;
    phoneNumber: string;
    email: string | null;
    companyName: string | null;
    contactPerson: string | null;
    notes: string | null;
    status: string | null;
    adminNotes: string | null;
    createdAt: string | null;
}



const statusOptions = [
    { value: "pending", label: "Pending", color: "default" },
    { value: "contacted", label: "Contacted", color: "secondary" },
    { value: "quoted", label: "Quoted", color: "outline" },
    { value: "closed", label: "Closed", color: "secondary" },
];

const printTypeLabels: Record<string, string> = {
    screen_printed: "Screen Printed",
    embroidered: "Embroidered",
    dtg: "DTG",
    heat_transfer: "Heat Transfer",
};

export default function DesignEnquiriesPage() {
    const [enquiries, setEnquiries] = useState<DesignEnquiry[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedEnquiry, setSelectedEnquiry] = useState<DesignEnquiry | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [adminNotes, setAdminNotes] = useState("");
    const [isUpdating, setIsUpdating] = useState(false);

    const fetchEnquiries = async () => {
        try {
            const response = await fetch("/api/design-enquiries");
            const result = await response.json();
            if (result.success) {
                setEnquiries(result.data);
            }
        } catch (error) {
            console.error("Failed to fetch design enquiries:", error);
            toast.error("Failed to load design enquiries");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchEnquiries();
    }, []);

    const openDetail = (enquiry: DesignEnquiry) => {
        setSelectedEnquiry(enquiry);
        setAdminNotes(enquiry.adminNotes || "");
        setIsDetailOpen(true);
    };

    const handleStatusChange = async (id: string, status: string) => {
        setIsUpdating(true);
        try {
            const response = await fetch(`/api/design-enquiries/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status, adminNotes }),
            });

            const result = await response.json();

            if (result.success) {
                toast.success("Status updated");
                fetchEnquiries();
                if (selectedEnquiry?.id === id) {
                    setSelectedEnquiry({ ...selectedEnquiry, status, adminNotes });
                }
            } else {
                toast.error(result.error || "Failed to update status");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setIsUpdating(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this design enquiry?")) return;

        try {
            const response = await fetch(`/api/design-enquiries/${id}`, {
                method: "DELETE",
            });

            const result = await response.json();

            if (result.success) {
                toast.success("Design enquiry deleted");
                setIsDetailOpen(false);
                fetchEnquiries();
            } else {
                toast.error(result.error || "Failed to delete");
            }
        } catch (error) {
            toast.error("An error occurred");
        }
    };

    const handleBulkDelete = async () => {
        if (!confirm("Are you sure you want to delete ALL design enquiries? This action cannot be undone.")) return;
        if (!confirm("Really? This will wipe all design enquiry data.")) return;

        try {
            const response = await fetch("/api/design-enquiries", {
                method: "DELETE",
            });

            const result = await response.json();

            if (result.success) {
                toast.success("All design enquiries deleted");
                fetchEnquiries();
            } else {
                toast.error(result.error || "Failed to delete design enquiries");
            }
        } catch (error) {
            toast.error("An error occurred");
        }
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getStatusBadge = (status: string | null) => {
        const option = statusOptions.find((o) => o.value === status) ||
            statusOptions[0];
        return <Badge variant={option.color as "default" | "secondary" | "outline"}>{option.label}</Badge>;
    };

    const downloadDesignImage = (imageUrl: string, id: string) => {
        const link = document.createElement("a");
        link.href = imageUrl;
        link.download = `design-${id}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Design Enquiries</h1>
                    <p className="text-muted-foreground">
                        Manage custom T-shirt design requests
                    </p>
                </div>
                <Button
                    variant="destructive"
                    onClick={handleBulkDelete}
                    disabled={enquiries.length === 0}
                >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete All
                </Button>
            </div>

            {/* Enquiries Table */}
            <Card>
                <CardHeader>
                    <CardTitle>All Design Enquiries</CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                    ) : enquiries.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            <Palette className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>No design enquiries yet</p>
                            <p className="text-sm">Design enquiries will appear here when customers submit designs</p>
                        </div>
                    ) : (
                        <div className="rounded-md border max-h-[60vh] overflow-y-auto relative">
                            <Table>
                                <TableHeader className="sticky top-0 bg-card z-10 shadow-sm">
                                    <TableRow>
                                        <TableHead>Preview</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Contact</TableHead>
                                        <TableHead>Details</TableHead>
                                        <TableHead>Quantity</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {enquiries.map((enquiry) => (
                                        <TableRow key={enquiry.id}>
                                            <TableCell>
                                                <div className="w-12 h-12 relative rounded overflow-hidden border border-border">
                                                    <Image
                                                        src={enquiry.designImageUrl}
                                                        alt="Design preview"
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground text-sm">
                                                {formatDate(enquiry.createdAt)}
                                            </TableCell>
                                            <TableCell>
                                                <div>
                                                    <p className="font-medium">
                                                        {enquiry.companyName || enquiry.contactPerson || "N/A"}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {enquiry.phoneNumber}
                                                    </p>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div>
                                                    <p className="font-medium">{enquiry.fabricName}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {printTypeLabels[enquiry.printType || ""] || enquiry.printType}
                                                    </p>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {enquiry.quantity.toLocaleString()} units
                                            </TableCell>
                                            <TableCell>{getStatusBadge(enquiry.status)}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => openDetail(enquiry)}
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleDelete(enquiry.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4 text-destructive" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Detail Dialog */}
            <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                <DialogContent className="sm:max-w-[90vw] w-full max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Design Enquiry Details</DialogTitle>
                    </DialogHeader>
                    {selectedEnquiry && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Left Column - Design Previews */}
                            <div className="space-y-4">
                                {/* Front Design */}
                                <div>
                                    <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2 font-medium">Front Design</p>
                                    <div className="aspect-square relative rounded-lg overflow-hidden border border-border bg-muted">
                                        <Image
                                            src={selectedEnquiry.designImageUrl}
                                            alt="Front Design"
                                            fill
                                            className="object-contain"
                                        />
                                    </div>
                                    <Button
                                        variant="outline"
                                        className="w-full mt-2"
                                        onClick={() => downloadDesignImage(selectedEnquiry.designImageUrl, `${selectedEnquiry.id}-front`)}
                                    >
                                        <Download className="mr-2 h-4 w-4" />
                                        Download Front
                                    </Button>
                                </div>

                                {/* Back Design */}
                                {selectedEnquiry.backDesignImageUrl && (
                                    <div>
                                        <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2 font-medium">Back Design</p>
                                        <div className="aspect-square relative rounded-lg overflow-hidden border border-border bg-muted">
                                            <Image
                                                src={selectedEnquiry.backDesignImageUrl}
                                                alt="Back Design"
                                                fill
                                                className="object-contain"
                                            />
                                        </div>
                                        <Button
                                            variant="outline"
                                            className="w-full mt-2"
                                            onClick={() => downloadDesignImage(selectedEnquiry.backDesignImageUrl!, `${selectedEnquiry.id}-back`)}
                                        >
                                            <Download className="mr-2 h-4 w-4" />
                                            Download Back
                                        </Button>
                                    </div>
                                )}

                                {/* Side Design */}
                                {selectedEnquiry.sideDesignImageUrl && (
                                    <div>
                                        <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2 font-medium">Side Design</p>
                                        <div className="aspect-square relative rounded-lg overflow-hidden border border-border bg-muted">
                                            <Image
                                                src={selectedEnquiry.sideDesignImageUrl}
                                                alt="Side Design"
                                                fill
                                                className="object-contain"
                                            />
                                        </div>
                                        <Button
                                            variant="outline"
                                            className="w-full mt-2"
                                            onClick={() => downloadDesignImage(selectedEnquiry.sideDesignImageUrl!, `${selectedEnquiry.id}-side`)}
                                        >
                                            <Download className="mr-2 h-4 w-4" />
                                            Download Side
                                        </Button>
                                    </div>
                                )}

                                {/* Original Logo */}
                                {selectedEnquiry.originalLogoUrl && (
                                    <Button
                                        className="w-full"
                                        onClick={() => downloadDesignImage(selectedEnquiry.originalLogoUrl!, `${selectedEnquiry.id}-logo`)}
                                    >
                                        <ImageIcon className="mr-2 h-4 w-4" />
                                        Download Original Logo
                                    </Button>
                                )}
                            </div>

                            {/* Right Column - Details */}
                            <div className="space-y-4">
                                {/* Header Info */}
                                <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
                                    <div>
                                        <p className="text-xs text-muted-foreground uppercase">Enquiry ID</p>
                                        <p className="font-mono text-xs">{selectedEnquiry.id.slice(0, 8)}...</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground uppercase">Date</p>
                                        <p className="text-sm">{formatDate(selectedEnquiry.createdAt)}</p>
                                    </div>
                                </div>

                                {/* Customer Info */}
                                <div className="space-y-2">
                                    <h4 className="font-semibold text-sm uppercase text-muted-foreground">Customer</h4>
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        <div className="flex items-center gap-2">
                                            <Phone className="h-3 w-3 text-muted-foreground" />
                                            <span>{selectedEnquiry.phoneNumber}</span>
                                        </div>
                                        {selectedEnquiry.email && (
                                            <div className="flex items-center gap-2">
                                                <Mail className="h-3 w-3 text-muted-foreground shrink-0" />
                                                <span className="break-all">{selectedEnquiry.email}</span>
                                            </div>
                                        )}
                                        {selectedEnquiry.companyName && (
                                            <div className="flex items-center gap-2">
                                                <Building className="h-3 w-3 text-muted-foreground" />
                                                <span>{selectedEnquiry.companyName}</span>
                                            </div>
                                        )}
                                        {selectedEnquiry.contactPerson && (
                                            <div className="flex items-center gap-2">
                                                <User className="h-3 w-3 text-muted-foreground" />
                                                <span>{selectedEnquiry.contactPerson}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Order Details */}
                                <div className="space-y-2">
                                    <h4 className="font-semibold text-sm uppercase text-muted-foreground">Order Details</h4>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <p className="text-muted-foreground">Fabric</p>
                                            <p className="font-medium">{selectedEnquiry.fabricName}</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground">Print Type</p>
                                            <p className="font-medium">
                                                {printTypeLabels[selectedEnquiry.printType || ""] || selectedEnquiry.printType}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground">Quantity</p>
                                            <p className="font-medium">{selectedEnquiry.quantity.toLocaleString()} units</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground">Size Range</p>
                                            <p className="font-medium">{selectedEnquiry.sizeRange}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Notes */}
                                {selectedEnquiry.notes && (
                                    <div className="space-y-2">
                                        <h4 className="font-semibold text-sm uppercase text-muted-foreground">Customer Notes</h4>
                                        <p className="text-sm bg-muted p-3 rounded">{selectedEnquiry.notes}</p>
                                    </div>
                                )}

                                {/* Admin Controls */}
                                <div className="space-y-3 pt-4 border-t">
                                    <h4 className="font-semibold text-sm uppercase text-muted-foreground">Admin Controls</h4>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Status</label>
                                        <Select
                                            value={selectedEnquiry.status || "pending"}
                                            onValueChange={(value) =>
                                                handleStatusChange(selectedEnquiry.id, value)
                                            }
                                            disabled={isUpdating}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {statusOptions.map((option) => (
                                                    <SelectItem key={option.value} value={option.value}>
                                                        {option.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Admin Notes</label>
                                        <Textarea
                                            value={adminNotes}
                                            onChange={(e) => setAdminNotes(e.target.value)}
                                            placeholder="Internal notes..."
                                            rows={3}
                                        />
                                    </div>
                                    <Button
                                        onClick={() =>
                                            handleStatusChange(
                                                selectedEnquiry.id,
                                                selectedEnquiry.status || "pending"
                                            )
                                        }
                                        disabled={isUpdating}
                                        className="w-full"
                                    >
                                        {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Update
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
