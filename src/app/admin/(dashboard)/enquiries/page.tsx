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
import { Input } from "@/components/ui/input";
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
    Download,
    Calendar,
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

    // Date filter state
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [isExporting, setIsExporting] = useState(false);

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

    const handleBulkDelete = async () => {
        if (!confirm("Are you sure you want to delete ALL enquiries? This action cannot be undone.")) return;
        if (!confirm("Really? This will wipe all enquiry data.")) return;

        try {
            const response = await fetch("/api/enquiries", {
                method: "DELETE",
            });

            const result = await response.json();

            if (result.success) {
                toast.success("All enquiries deleted");
                fetchEnquiries();
            } else {
                toast.error(result.error || "Failed to delete enquiries");
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

    // Filter enquiries by date range
    const filteredEnquiries = enquiries.filter((enquiry) => {
        if (!startDate && !endDate) return true;

        const enquiryDate = enquiry.createdAt ? new Date(enquiry.createdAt) : null;
        if (!enquiryDate) return false;

        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate + "T23:59:59") : null;

        if (start && enquiryDate < start) return false;
        if (end && enquiryDate > end) return false;

        return true;
    });

    // Export to CSV function
    const exportToCSV = () => {
        setIsExporting(true);

        try {
            const dataToExport = filteredEnquiries;

            if (dataToExport.length === 0) {
                toast.error("No enquiries to export");
                setIsExporting(false);
                return;
            }

            // CSV headers
            const headers = [
                "Date",
                "Phone",
                "Email",
                "Company",
                "Contact Person",
                "Product",
                "Fabric",
                "Quantity",
                "Size Range",
                "Status",
                "Notes",
                "Admin Notes"
            ];

            // CSV rows
            const rows = dataToExport.map((enquiry) => [
                enquiry.createdAt ? new Date(enquiry.createdAt).toLocaleDateString() : "",
                enquiry.phoneNumber || "",
                enquiry.email || "",
                enquiry.companyName || "",
                enquiry.contactPerson || "",
                enquiry.clothingTypeName || "",
                enquiry.fabricName || "",
                enquiry.quantity?.toString() || "",
                enquiry.sizeRange || "",
                enquiry.status || "",
                (enquiry.notes || "").replace(/"/g, '""'),
                (enquiry.adminNotes || "").replace(/"/g, '""'),
            ]);

            // Build CSV content
            const csvContent = [
                headers.join(","),
                ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
            ].join("\n");

            // Create and download file
            const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");

            const dateRange = startDate || endDate
                ? `_${startDate || "start"}_to_${endDate || "today"}`
                : "";
            link.setAttribute("href", url);
            link.setAttribute("download", `enquiries${dateRange}.csv`);
            link.style.visibility = "hidden";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            toast.success(`Exported ${dataToExport.length} enquiries`);
        } catch (error) {
            console.error("Export failed:", error);
            toast.error("Failed to export enquiries");
        } finally {
            setIsExporting(false);
        }
    };

    const clearFilters = () => {
        setStartDate("");
        setEndDate("");
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Enquiries</h1>
                    <p className="text-muted-foreground">
                        Manage customer enquiries and quote requests
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

            {/* Export Controls - Grouped separately */}
            <Card className="bg-muted/30">
                <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row items-start md:items-end gap-4">
                        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground shrink-0">
                            <Calendar className="h-4 w-4" />
                            <span>Export Data</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
                            <div className="space-y-1.5">
                                <label className="text-xs text-muted-foreground block">From Date</label>
                                <Input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs text-muted-foreground block">To Date</label>
                                <Input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="flex gap-2 w-full md:w-auto">
                            {(startDate || endDate) && (
                                <Button variant="ghost" onClick={clearFilters} className="shrink-0">
                                    Clear
                                </Button>
                            )}
                            <Button
                                onClick={exportToCSV}
                                disabled={isExporting || filteredEnquiries.length === 0}
                                variant="outline"
                                className="flex-1 md:flex-none"
                            >
                                {isExporting ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <Download className="mr-2 h-4 w-4" />
                                )}
                                Export CSV ({filteredEnquiries.length})
                            </Button>
                        </div>
                    </div>
                    {(startDate || endDate) && (
                        <p className="text-xs text-muted-foreground mt-3 pl-6">
                            {startDate && endDate
                                ? `Will export data from ${new Date(startDate).toLocaleDateString()} to ${new Date(endDate).toLocaleDateString()}`
                                : startDate
                                    ? `Will export data from ${new Date(startDate).toLocaleDateString()} onwards`
                                    : `Will export data up to ${new Date(endDate).toLocaleDateString()}`
                            }
                        </p>
                    )}
                </CardContent>
            </Card>

            {/* Enquiries Table */}
            <Card>
                <CardHeader>
                    <CardTitle>
                        {startDate || endDate ? `Filtered Enquiries (${filteredEnquiries.length})` : "All Enquiries"}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                    ) : filteredEnquiries.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            <p>{startDate || endDate ? "No enquiries match the selected date range" : "No enquiries yet"}</p>
                            <p className="text-sm">
                                {startDate || endDate ? "Try adjusting your date filters" : "Enquiries will appear here when customers submit requests"}
                            </p>
                        </div>
                    ) : (
                        <div className="rounded-md border max-h-[60vh] overflow-y-auto relative">
                            <Table>
                                <TableHeader className="sticky top-0 bg-card z-10 shadow-sm">
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
                                    {filteredEnquiries.map((enquiry) => (
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
                            </Table >
                        </div >
                    )
                    }
                </CardContent >
            </Card >

            {/* Detail Dialog */}
            < Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen} >
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>Enquiry Details</DialogTitle>
                    </DialogHeader>
                    {selectedEnquiry && (
                        <div className="space-y-0 text-sm">
                            {/* Header Info */}
                            <div className="grid grid-cols-2 border-b border-border bg-muted/30">
                                <div className="p-3 border-r border-border">
                                    <span className="text-muted-foreground text-xs uppercase tracking-wider font-semibold block mb-1">Enquiry ID</span>
                                    <span className="font-mono text-xs">{selectedEnquiry.id}</span>
                                </div>
                                <div className="p-3">
                                    <span className="text-muted-foreground text-xs uppercase tracking-wider font-semibold block mb-1">Date Received</span>
                                    <span>{formatDate(selectedEnquiry.createdAt)}</span>
                                </div>
                            </div>

                            {/* Customer Information Section */}
                            <div className="bg-muted/10 p-2 border-b border-border font-semibold text-xs uppercase tracking-wider text-primary">
                                Customer Information
                            </div>
                            <div className="grid grid-cols-2 border-b border-border">
                                <div className="p-3 border-r border-border">
                                    <span className="text-muted-foreground text-xs block mb-1">Company Name</span>
                                    <span className="font-medium">{selectedEnquiry.companyName || "-"}</span>
                                </div>
                                <div className="p-3">
                                    <span className="text-muted-foreground text-xs block mb-1">Contact Person</span>
                                    <span className="font-medium">{selectedEnquiry.contactPerson || "-"}</span>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 border-b border-border">
                                <div className="p-3 border-r border-border">
                                    <span className="text-muted-foreground text-xs block mb-1">Phone Number</span>
                                    <span className="font-medium">{selectedEnquiry.phoneNumber}</span>
                                </div>
                                <div className="p-3">
                                    <span className="text-muted-foreground text-xs block mb-1">Email Address</span>
                                    <span className="font-medium">{selectedEnquiry.email || "-"}</span>
                                </div>
                            </div>

                            {/* Order Details Section */}
                            <div className="bg-muted/10 p-2 border-b border-border font-semibold text-xs uppercase tracking-wider text-primary">
                                Order Specifications
                            </div>
                            <div className="grid grid-cols-2 border-b border-border">
                                <div className="p-3 border-r border-border">
                                    <span className="text-muted-foreground text-xs block mb-1">Product Type</span>
                                    <span className="font-medium">{selectedEnquiry.clothingTypeName}</span>
                                </div>
                                <div className="p-3">
                                    <span className="text-muted-foreground text-xs block mb-1">Fabric Selection</span>
                                    <span className="font-medium">{selectedEnquiry.fabricName}</span>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 border-b border-border">
                                <div className="p-3 border-r border-border">
                                    <span className="text-muted-foreground text-xs block mb-1">Quantity Required</span>
                                    <span className="font-medium">{selectedEnquiry.quantity.toLocaleString()} units</span>
                                </div>
                                <div className="p-3">
                                    <span className="text-muted-foreground text-xs block mb-1">Size Range</span>
                                    <span className="font-medium">{selectedEnquiry.sizeRange}</span>
                                </div>
                            </div>

                            {/* Notes Section */}
                            <div className="grid grid-cols-1 border-b border-border">
                                <div className="p-3">
                                    <span className="text-muted-foreground text-xs block mb-1">Customer Notes</span>
                                    <p className="text-sm whitespace-pre-wrap bg-muted/20 p-2 border border-border min-h-[60px]">
                                        {selectedEnquiry.notes || "No notes provided."}
                                    </p>
                                </div>
                            </div>

                            {/* Admin Management Section */}
                            <div className="bg-muted/10 p-2 border-b border-border font-semibold text-xs uppercase tracking-wider text-primary">
                                Internal Management
                            </div>
                            <div className="p-4 bg-muted/5 space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-medium mb-1.5 block">Current Status</label>
                                        <Select
                                            value={selectedEnquiry.status || "pending"}
                                            onValueChange={(value) =>
                                                handleStatusChange(selectedEnquiry.id, value)
                                            }
                                            disabled={isUpdating}
                                        >
                                            <SelectTrigger className="bg-background">
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
                                    <div className="flex items-end justify-end">
                                        <Button
                                            onClick={() =>
                                                handleStatusChange(
                                                    selectedEnquiry.id,
                                                    selectedEnquiry.status || "pending"
                                                )
                                            }
                                            disabled={isUpdating}
                                            className="btn-industrial w-full"
                                        >
                                            {isUpdating && (
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            )}
                                            Update Record
                                        </Button>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-medium mb-1.5 block">Admin Internal Notes</label>
                                    <Textarea
                                        value={adminNotes}
                                        onChange={(e) => setAdminNotes(e.target.value)}
                                        placeholder="Add internal notes regarding this enquiry..."
                                        rows={3}
                                        className="bg-background resize-none"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog >
        </div >
    );
}
