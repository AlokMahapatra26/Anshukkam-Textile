import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Heart, MapPin, Scissors } from "lucide-react";
import { FadeIn, FadeInStagger, FadeInItem } from "@/components/ui/MotionContainer";

export function Hero() {
    return (
        <section className="relative overflow-hidden bg-fabric-pattern">
            <div className="absolute inset-0 bg-background/40 backdrop-blur-[1px]" />
            <div className="relative container-industrial">
                <div className="py-16 md:py-24 lg:py-32">

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* Left side - Content */}
                        <div>
                            {/* Tagline */}
                            <FadeIn delay={0.1}>
                                <p className="text-accent font-medium mb-4 tracking-wide">
                                    Every dream starts small. Ours began with a single thread.
                                </p>
                            </FadeIn>

                            {/* Headline */}
                            <FadeIn delay={0.2}>
                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                                    <span className="text-accent">Anshuukam Textile</span>{" "}
                                    — Where Quality Meets Passion
                                </h1>
                            </FadeIn>

                            {/* Subheadline */}
                            <FadeIn delay={0.3}>
                                <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
                                    Every stitch, every thread, and every design reflects our belief —
                                    quality isn't just made, it's crafted with care.
                                </p>
                            </FadeIn>

                            {/* CTA Buttons */}
                            <FadeIn delay={0.4}>
                                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                                    <Link href="/enquiry">
                                        <Button size="lg" className="btn-industrial text-base h-12 px-8">
                                            Request a Quote
                                            <ArrowRight className="ml-2 h-5 w-5" />
                                        </Button>
                                    </Link>
                                    <Link href="/catalogue">
                                        <Button
                                            size="lg"
                                            variant="outline"
                                            className="btn-industrial-outline text-base h-12 px-8"
                                        >
                                            View Catalogue
                                        </Button>
                                    </Link>
                                </div>
                            </FadeIn>

                            {/* Trust Indicators */}
                            <FadeInStagger className="flex flex-wrap gap-6 text-sm text-muted-foreground" staggerDelay={0.1}>
                                <FadeInItem>
                                    <div className="flex items-center gap-2">
                                        <Heart className="h-5 w-5 text-accent" />
                                        <span>Crafted with Care</span>
                                    </div>
                                </FadeInItem>
                                <FadeInItem>
                                    <div className="flex items-center gap-2">
                                        <Scissors className="h-5 w-5 text-accent" />
                                        <span>Precision Tailoring</span>
                                    </div>
                                </FadeInItem>
                                <FadeInItem>
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-5 w-5 text-accent" />
                                        <span>Made in Neemuch, M.P.</span>
                                    </div>
                                </FadeInItem>
                            </FadeInStagger>
                        </div>

                        {/* Right side - Video (seamless blend) */}
                        <div className="relative lg:mt-8">
                            <video
                                autoPlay
                                loop
                                muted
                                playsInline
                                className="w-full h-auto"
                                style={{
                                    filter: 'brightness(1.05) contrast(1.02)',
                                    mixBlendMode: 'multiply'
                                }}
                            >
                                <source src="/animated.mp4" type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
