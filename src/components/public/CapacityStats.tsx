"use client";

import { useEffect, useState } from "react";
import {
    Package, Layers, Clock, Ruler, TrendingUp, Award, Loader2,
    Factory, Users, Globe, Target, Shield, Zap,
    Truck, Settings, Star, CheckCircle, Box, Shirt,
    Scissors, Palette, Sparkles, BadgeCheck, Timer, Calendar,
} from "lucide-react";

interface CapacityStat {
    icon: string;
    value: string;
    label: string;
    description: string;
}

const defaultStats: CapacityStat[] = [
    {
        icon: "Package",
        value: "500",
        label: "Minimum Order Qty",
        description: "Units per style",
    },
    {
        icon: "TrendingUp",
        value: "100K+",
        label: "Monthly Capacity",
        description: "Units production",
    },
    {
        icon: "Clock",
        value: "3-6",
        label: "Lead Time",
        description: "Weeks to delivery",
    },
    {
        icon: "Ruler",
        value: "XS-5XL",
        label: "Size Range",
        description: "Full size coverage",
    },
    {
        icon: "Layers",
        value: "50+",
        label: "Fabric Options",
        description: "Premium materials",
    },
    {
        icon: "Award",
        value: "25+",
        label: "Years Experience",
        description: "In the industry",
    },
];

const iconMap: Record<string, React.ElementType> = {
    Package, Layers, Clock, Ruler, TrendingUp, Award,
    Factory, Users, Globe, Target, Shield, Zap,
    Truck, Settings, Star, CheckCircle, Box, Shirt,
    Scissors, Palette, Sparkles, BadgeCheck, Timer, Calendar,
};

export function CapacityStats() {
    const [stats, setStats] = useState<CapacityStat[]>(defaultStats);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchStats() {
            try {
                const response = await fetch("/api/settings?key=capacity_stats");
                const result = await response.json();

                // API now returns value directly when fetching by key
                if (result.success && result.data && Array.isArray(result.data) && result.data.length > 0) {
                    setStats(result.data);
                }
                // If no data or empty array, keep defaults
            } catch (error) {
                console.error("Failed to fetch capacity stats:", error);
                // Keep default stats on error
            } finally {
                setIsLoading(false);
            }
        }
        fetchStats();
    }, []);

    return (
        <section className="section-industrial-alt">
            <div className="container-industrial">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Production Capabilities
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        We have the capacity and expertise to handle orders of any size,
                        with flexible MOQs and reliable delivery timelines.
                    </p>
                </div>

                {/* Stats Grid */}
                {isLoading ? (
                    <div className="flex justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                        {stats.map((stat, index) => {
                            const IconComponent = iconMap[stat.icon] || Package;
                            return (
                                <div
                                    key={`${stat.label}-${index}`}
                                    className="bg-card border border-border p-6 text-center hover:border-accent transition-colors"
                                >
                                    <IconComponent className="h-8 w-8 mx-auto mb-4 text-accent" />
                                    <div className="text-2xl md:text-3xl font-bold text-primary mb-1">
                                        {stat.value}
                                    </div>
                                    <div className="text-sm font-medium mb-1">{stat.label}</div>
                                    <div className="text-xs text-muted-foreground">
                                        {stat.description}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
}
