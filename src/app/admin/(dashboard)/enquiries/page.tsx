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
    Package,
    Layers,
} from "lucide-react";

interface Enquiry {
    id: string;
    phoneNumber: string;
    email: string | null;
    companyName: string | null;
    contactPerson: string | null;
    clothingTypeName: string | null;
    fabricName: string | null;
    quantity: number;
    sizeRange: string | null;
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

export default function EnquiriesPage() {
    const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [adminNotes, setAdminNotes] = useState("");
    const [isUpdating, setIsUpdating] = useState(false);

    const fetchEnquiries = async () => {
        try {
            const response = await fetch("/api/enquiries");
            const result = await response.json();
            if (result.success) {
                setEnquiries(result.data);
            }
        } catch (error) {
            console.error("Failed to fetch enquiries:", error);
            toast.error("Failed to load enquiries");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchEnquiries();
    }, []);

    const openDetail = (enquiry: Enquiry) => {
        setSelectedEnquiry(enquiry);
        setAdminNotes(enquiry.adminNotes || "");
        setIsDetailOpen(true);
    };

    const handleStatusChange = async (id: string, status: string) => {
        setIsUpdating(true);
        try {
            const response = await fetch(`/api/enquiries/${id}`, {
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
        if (!confirm("Are you sure you want to delete this enquiry?")) return;

        try {
            const response = await fetch(`/api/enquiries/${id}`, {
                method: "DELETE",
            });

            const result = await response.json();

            if (result.success) {
                toast.success("Enquiry deleted");
                setIsDetailOpen(false);
                fetchEnquiries();
            } else {
                toast.error(result.error || "Failed to delete");
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

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold">Enquiries</h1>
                <p className="text-muted-foreground">
                    Manage customer enquiries and quote requests
                </p>
            </div>

            {/* Enquiries Table */}
            <Card>
                <CardHeader>
                    <CardTitle>All Enquiries</CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                    ) : enquiries.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            <p>No enquiries yet</p>
                            <p className="text-sm">
                                Enquiries will appear here when customers submit requests
                            </p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Contact</TableHead>
                                    <TableHead>Product</TableHead>
                                    <TableHead>Quantity</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {enquiries.map((enquiry) => (
                                    <TableRow key={enquiry.id}>
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
                                                <p className="font-medium">{enquiry.clothingTypeName}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {enquiry.fabricName}
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
                    )}
                </CardContent>
            </Card>

            {/* Detail Dialog */}
            <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Enquiry Details</DialogTitle>
                    </DialogHeader>
                    {selectedEnquiry && (
                        <div className="space-y-6">
                            {/* Contact Info */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-start gap-3">
                                    <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Phone</p>
                                        <p className="font-medium">{selectedEnquiry.phoneNumber}</p>
                                    </div>
                                </div>
                                {selectedEnquiry.email && (
                                    <div className="flex items-start gap-3 min-w-0">
                                        <Mail className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm text-muted-foreground">Email</p>
                                            <p className="font-medium break-all">{selectedEnquiry.email}</p>
                                        </div>
                                    </div>
                                )}
                                {selectedEnquiry.companyName && (
                                    <div className="flex items-start gap-3">
                                        <Building className="h-5 w-5 text-muted-foreground mt-0.5" />
                                        <div>
                                            <p className="text-sm text-muted-foreground">Company</p>
                                            <p className="font-medium">{selectedEnquiry.companyName}</p>
                                        </div>
                                    </div>
                                )}
                                {selectedEnquiry.contactPerson && (
                                    <div className="flex items-start gap-3">
                                        <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                                        <div>
                                            <p className="text-sm text-muted-foreground">Contact</p>
                                            <p className="font-medium">{selectedEnquiry.contactPerson}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="border-t border-border pt-4" />

                            {/* Order Details */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-start gap-3">
                                    <Package className="h-5 w-5 text-muted-foreground mt-0.5" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Product</p>
                                        <p className="font-medium">{selectedEnquiry.clothingTypeName}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Layers className="h-5 w-5 text-muted-foreground mt-0.5" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Fabric</p>
                                        <p className="font-medium">{selectedEnquiry.fabricName}</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Quantity</p>
                                    <p className="font-medium">
                                        {selectedEnquiry.quantity.toLocaleString()} units
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Size Range</p>
                                    <p className="font-medium">{selectedEnquiry.sizeRange}</p>
                                </div>
                            </div>

                            {selectedEnquiry.notes && (
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">Notes</p>
                                    <p className="bg-muted p-3 rounded text-sm">
                                        {selectedEnquiry.notes}
                                    </p>
                                </div>
                            )}

                            <div className="border-t border-border pt-4" />

                            {/* Admin Section */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className="flex-1">
                                        <p className="text-sm font-medium mb-2">Status</p>
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
                                </div>

                                <div>
                                    <p className="text-sm font-medium mb-2">Admin Notes</p>
                                    <Textarea
                                        value={adminNotes}
                                        onChange={(e) => setAdminNotes(e.target.value)}
                                        placeholder="Internal notes about this enquiry..."
                                        rows={3}
                                    />
                                </div>

                                <div className="flex justify-end gap-3">
                                    <Button
                                        variant="outline"
                                        onClick={() => setIsDetailOpen(false)}
                                    >
                                        Close
                                    </Button>
                                    <Button
                                        onClick={() =>
                                            handleStatusChange(
                                                selectedEnquiry.id,
                                                selectedEnquiry.status || "pending"
                                            )
                                        }
                                        disabled={isUpdating}
                                        className="btn-industrial"
                                    >
                                        {isUpdating && (
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        )}
                                        Save Changes
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
