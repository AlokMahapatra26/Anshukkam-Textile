"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Package,
    Layers,
    MessageSquare,
    TrendingUp,
    Clock,
    ArrowRight,
    AlertCircle,
    CheckCircle,
    Loader2,
} from "lucide-react";

interface Stats {
    totalEnquiries: number;
    pendingEnquiries: number;
    catalogueItems: number;
    fabrics: number;
}

interface Enquiry {
    id: string;
    companyName: string | null;
    clothingTypeName: string | null;
    quantity: number;
    status: string | null;
    createdAt: string;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<Stats>({
        totalEnquiries: 0,
        pendingEnquiries: 0,
        catalogueItems: 0,
        fabrics: 0,
    });
    const [recentEnquiries, setRecentEnquiries] = useState<Enquiry[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showBanner, setShowBanner] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const [typesRes, fabricsRes, enquiriesRes] = await Promise.all([
                    fetch("/api/catalogue/types?includeInactive=true"),
                    fetch("/api/catalogue/fabrics?includeInactive=true"),
                    fetch("/api/enquiries"),
                ]);

                const typesData = await typesRes.json();
                const fabricsData = await fabricsRes.json();
                const enquiriesData = await enquiriesRes.json();

                const enquiries = enquiriesData.success ? enquiriesData.data : [];
                const pendingCount = enquiries.filter((e: Enquiry) => e.status === "pending").length;

                setStats({
                    totalEnquiries: enquiries.length,
                    pendingEnquiries: pendingCount,
                    catalogueItems: typesData.success ? typesData.data.length : 0,
                    fabrics: fabricsData.success ? fabricsData.data.length : 0,
                });

                // Get recent 5 enquiries
                setRecentEnquiries(enquiries.slice(0, 5));
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchData();
    }, []);

    const isSetupComplete = stats.catalogueItems > 0 && stats.fabrics > 0;

    const statsCards = [
        {
            title: "Total Enquiries",
            value: stats.totalEnquiries.toString(),
            change: stats.totalEnquiries === 0 ? "No enquiries yet" : "All time",
            icon: MessageSquare,
        },
        {
            title: "Pending",
            value: stats.pendingEnquiries.toString(),
            change: "Awaiting response",
            icon: Clock,
        },
        {
            title: "Catalogue Items",
            value: stats.catalogueItems.toString(),
            change: "Clothing types",
            icon: Package,
        },
        {
            title: "Fabrics",
            value: stats.fabrics.toString(),
            change: "Materials available",
            icon: Layers,
        },
    ];

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <p className="text-muted-foreground">
                    Overview of your manufacturing website
                </p>
            </div>

            {/* Setup Notice - Only show if not setup */}
            {!isSetupComplete ? (
                <Card className="border-accent bg-accent/5">
                    <CardContent className="flex items-start gap-4 pt-6">
                        <AlertCircle className="h-6 w-6 text-accent flex-shrink-0" />
                        <div className="flex-1">
                            <h3 className="font-semibold mb-1">Setup Required</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                {stats.catalogueItems === 0 && stats.fabrics === 0
                                    ? "Add your catalogue items and fabrics to get started."
                                    : stats.catalogueItems === 0
                                        ? "Add catalogue items to complete your setup."
                                        : "Add fabrics to complete your setup."}
                            </p>
                            <div className="flex gap-3">
                                {stats.catalogueItems === 0 && (
                                    <Link href="/admin/catalogue">
                                        <Button size="sm" className="btn-industrial">
                                            Add Catalogue Items
                                        </Button>
                                    </Link>
                                )}
                                {stats.fabrics === 0 && (
                                    <Link href="/admin/fabrics">
                                        <Button size="sm" variant={stats.catalogueItems === 0 ? "outline" : "default"}>
                                            Add Fabrics
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ) : isSetupComplete && showBanner ? (
                <Card className="border-green-500 bg-green-500/5">
                    <CardContent className="flex items-center gap-4 pt-6">
                        <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
                        <div className="flex-1">
                            <h3 className="font-semibold text-green-700">Setup Complete</h3>
                            <p className="text-sm text-muted-foreground">
                                Your website is ready! You have {stats.catalogueItems} catalogue items and {stats.fabrics} fabrics.
                            </p>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setShowBanner(false)}
                            className="text-muted-foreground hover:text-foreground"
                        >
                            <span className="text-xl">&times;</span>
                        </Button>
                    </CardContent>
                </Card>
            ) : null}

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statsCards.map((stat) => (
                    <Card key={stat.title}>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                {stat.title}
                            </CardTitle>
                            <stat.icon className="h-5 w-5 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{stat.value}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {stat.change}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Recent Enquiries */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Recent Enquiries</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                            Latest customer enquiries
                        </p>
                    </div>
                    <Link href="/admin/enquiries">
                        <Button variant="outline" size="sm">
                            View All
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </CardHeader>
                <CardContent>
                    {recentEnquiries.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>No enquiries yet</p>
                            <p className="text-sm">
                                Enquiries will appear here once customers submit requests
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {recentEnquiries.map((enquiry) => (
                                <div
                                    key={enquiry.id}
                                    className="flex items-center justify-between p-4 border border-border rounded-lg"
                                >
                                    <div>
                                        <p className="font-medium">
                                            {enquiry.companyName || "Unknown Company"}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {enquiry.clothingTypeName || "Product"} · {enquiry.quantity.toLocaleString()} units
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <Badge
                                            variant={enquiry.status === "pending" ? "default" : "secondary"}
                                        >
                                            {enquiry.status || "pending"}
                                        </Badge>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {new Date(enquiry.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="hover:border-accent transition-colors cursor-pointer">
                    <Link href="/admin/catalogue">
                        <CardContent className="flex items-center gap-4 pt-6">
                            <div className="p-3 bg-accent/10 rounded-lg">
                                <Package className="h-6 w-6 text-accent" />
                            </div>
                            <div>
                                <h3 className="font-semibold">Manage Catalogue</h3>
                                <p className="text-sm text-muted-foreground">
                                    Add, edit, or remove products
                                </p>
                            </div>
                        </CardContent>
                    </Link>
                </Card>

                <Card className="hover:border-accent transition-colors cursor-pointer">
                    <Link href="/admin/enquiries">
                        <CardContent className="flex items-center gap-4 pt-6">
                            <div className="p-3 bg-accent/10 rounded-lg">
                                <MessageSquare className="h-6 w-6 text-accent" />
                            </div>
                            <div>
                                <h3 className="font-semibold">View Enquiries</h3>
                                <p className="text-sm text-muted-foreground">
                                    Respond to customer requests
                                </p>
                            </div>
                        </CardContent>
                    </Link>
                </Card>

                <Card className="hover:border-accent transition-colors cursor-pointer">
                    <Link href="/admin/settings">
                        <CardContent className="flex items-center gap-4 pt-6">
                            <div className="p-3 bg-accent/10 rounded-lg">
                                <TrendingUp className="h-6 w-6 text-accent" />
                            </div>
                            <div>
                                <h3 className="font-semibold">Site Settings</h3>
                                <p className="text-sm text-muted-foreground">
                                    Customize content and sections
                                </p>
                            </div>
                        </CardContent>
                    </Link>
                </Card>
            </div>
        </div>
    );
}
