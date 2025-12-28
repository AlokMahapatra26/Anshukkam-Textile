"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, Factory } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const navigation = [
    { name: "Home", href: "/" },
    { name: "Catalogue", href: "/catalogue" },
    { name: "Fabrics", href: "/fabrics" },
    { name: "Factory", href: "/factory" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
];

export function Header() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
            <div className="container-industrial">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <Factory className="h-8 w-8 text-accent" />
                        <div className="flex flex-col">
                            <span className="font-bold text-lg leading-tight">Anshukkam Textile</span>
                            <span className="text-xs text-muted-foreground uppercase tracking-wider">
                                Manufacturing Co.
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-8">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                            >
                                {item.name}
                            </Link>
                        ))}
                    </nav>

                    {/* CTA Button */}
                    <div className="hidden md:flex items-center gap-4">
                        <Link href="/enquiry">
                            <Button className="btn-industrial">
                                Request Quote
                            </Button>
                        </Link>
                    </div>

                    {/* Mobile Menu */}
                    <Sheet open={isOpen} onOpenChange={setIsOpen}>
                        <SheetTrigger asChild className="md:hidden">
                            <Button variant="ghost" size="icon">
                                <Menu className="h-6 w-6" />
                                <span className="sr-only">Open menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-[300px]">
                            <div className="flex flex-col gap-6 mt-8">
                                {navigation.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className="text-lg font-medium text-foreground hover:text-accent transition-colors"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                                <Link href="/enquiry" onClick={() => setIsOpen(false)}>
                                    <Button className="btn-industrial w-full mt-4">
                                        Request Quote
                                    </Button>
                                </Link>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
}
