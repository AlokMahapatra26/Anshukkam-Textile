import Link from "next/link";
import { Heart, Mail, Phone, MapPin, Youtube, Instagram, Facebook } from "lucide-react";
import Image from "next/image";

export function Footer() {
    return (
        <footer className="bg-primary text-primary-foreground bg-fabric-pattern bg-blend-overlay">
            <div className="container-industrial py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* Company Info */}
                    <div className="space-y-4">
                        <div className="relative h-16 w-48 mb-4">
                            <Image
                                src="/logo.png"
                                alt="Anshuukam Textile"
                                fill
                                className="object-contain object-left brightness-0 invert"
                            />
                        </div>
                        <p className="text-sm opacity-80 leading-relaxed">
                            Where fabric meets emotion, and quality meets trust.
                            Every stitch crafted with care.
                        </p>
                        <p className="text-xs opacity-60">
                            GSTIN: 23ABBCA8915B1Z5
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
                        <ul className="space-y-3">
                            {[
                                { name: "Product Catalogue", href: "/catalogue" },
                                { name: "Fabric Options", href: "/fabrics" },
                                { name: "Our Factory", href: "/factory" },
                                { name: "About Us", href: "/about" },
                                { name: "Request Quote", href: "/enquiry" },
                            ].map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-sm opacity-80 hover:opacity-100 transition-opacity"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Capabilities */}
                    <div>
                        <h3 className="font-semibold text-lg mb-4">We Manufacture</h3>
                        <ul className="space-y-3 text-sm opacity-80">
                            <li>T-Shirts & Polos</li>
                            <li>Hoodies & Sweatshirts</li>
                            <li>Jackets & Outerwear</li>
                            <li>Workwear & Uniforms</li>
                            <li>Athletic Wear</li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="font-semibold text-lg mb-4">Contact Us</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0" />
                                <span className="text-sm opacity-80">
                                    Neemuch, Madhya Pradesh, India
                                </span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="h-5 w-5 flex-shrink-0" />
                                <span className="text-sm opacity-80">+91 84691 59877</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="h-5 w-5 flex-shrink-0" />
                                <span className="text-sm opacity-80">info@anshuukam.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-primary-foreground/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm opacity-60 flex items-center gap-1">
                        © {new Date().getFullYear()} Anshuukam Textile Pvt Ltd.
                    </p>
                    <div className="flex items-center gap-3">
                        <a
                            href="https://youtube.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-lg bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-all duration-300 hover:scale-110 group"
                            aria-label="YouTube"
                        >
                            <Youtube className="h-5 w-5 opacity-70 group-hover:opacity-100 transition-opacity" />
                        </a>
                        <a
                            href="https://instagram.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-lg bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-all duration-300 hover:scale-110 group"
                            aria-label="Instagram"
                        >
                            <Instagram className="h-5 w-5 opacity-70 group-hover:opacity-100 transition-opacity" />
                        </a>
                        <a
                            href="https://facebook.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-lg bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-all duration-300 hover:scale-110 group"
                            aria-label="Facebook"
                        >
                            <Facebook className="h-5 w-5 opacity-70 group-hover:opacity-100 transition-opacity" />
                        </a>
                        <a
                            href="https://x.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-lg bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-all duration-300 hover:scale-110 group"
                            aria-label="X (Twitter)"
                        >
                            <svg
                                className="h-5 w-5 opacity-70 group-hover:opacity-100 transition-opacity"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                            >
                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
