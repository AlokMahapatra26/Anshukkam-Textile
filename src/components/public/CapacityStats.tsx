import {
    Package, Layers, Clock, Ruler, TrendingUp, Award,
    Factory, Users, Globe, Target, Shield, Zap,
    Truck, Settings, Star, CheckCircle, Box, Shirt,
    Scissors, Palette, Sparkles, BadgeCheck, Timer, Calendar,
} from "lucide-react";
import { FadeInStagger, FadeInItem } from "@/components/ui/MotionContainer";
import { getCachedCapacityStats } from "@/lib/services/cached-data";

const iconMap: Record<string, React.ElementType> = {
    Package, Layers, Clock, Ruler, TrendingUp, Award,
    Factory, Users, Globe, Target, Shield, Zap,
    Truck, Settings, Star, CheckCircle, Box, Shirt,
    Scissors, Palette, Sparkles, BadgeCheck, Timer, Calendar,
};

export async function CapacityStats() {
    const stats = await getCachedCapacityStats();

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
                <FadeInStagger className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                    {stats.map((stat, index) => {
                        const IconComponent = iconMap[stat.icon] || Package;
                        return (
                            <FadeInItem key={`${stat.label}-${index}`}>
                                <div
                                    className="bg-card p-6 text-center border-stitch border-stitch-hover rounded-lg h-full"
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
                            </FadeInItem>
                        );
                    })}
                </FadeInStagger>
            </div>
        </section>
    );
}
