import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-gray-50 border-t border-gray-200 py-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 gap-8 border-b border-gray-200 pb-10 md:grid-cols-3">
                    <div>
                        <h3 className="font-bold text-lg mb-4">Decouvrir DayBooker</h3>
                        <ul className="space-y-2">
                            <li><Link href="/a-propos" className="text-gray-600 hover:text-black text-sm">A propos</Link></li>
                            <li><Link href="/presse" className="text-gray-600 hover:text-black text-sm">Presse</Link></li>
                            <li><Link href="/carrieres" className="text-gray-600 hover:text-black text-sm">Carrieres</Link></li>
                            <li><Link href="/blog" className="text-gray-600 hover:text-black text-sm">Blog</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold text-lg mb-4">Aide & contact</h3>
                        <ul className="space-y-2">
                            <li><Link href="/help" className="text-gray-600 hover:text-black text-sm">Centre d&apos;aide</Link></li>
                            <li><Link href="/contact" className="text-gray-600 hover:text-black text-sm">Contactez-nous</Link></li>
                            <li><Link href="/hotels" className="text-gray-600 hover:text-black text-sm">Reserver un hotel</Link></li>
                            <li><Link href="/contact" className="text-gray-600 hover:text-black text-sm">Devenir partenaire</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold text-lg mb-4">Coordonnees</h3>
                        <div className="space-y-3 text-sm text-gray-600">
                            <p className="flex items-start gap-2">
                                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-client-primary-600" />
                                <span>
                                    Avenue de Mont Fleury, Quartier Mont Fleury
                                    <br />
                                    Ngaliema, Kinshasa
                                </span>
                            </p>
                            <p className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-client-primary-600" />
                                <a href="tel:+243817113497" className="hover:text-black">
                                    +243 817 113 497
                                </a>
                            </p>
                            <p className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-client-primary-600" />
                                <a href="mailto:support@daybooker.cd" className="hover:text-black">
                                    support@daybooker.cd
                                </a>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="text-center pt-8">
                    <p className="text-sm text-gray-500">© 2025 DayBooker. Tous droits réservés.</p>
                    <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-sm text-gray-500">
                        <Link href="/conditions-utilisation" className="hover:text-black">
                            Conditions d&apos;utilisation
                        </Link>
                        <Link href="/confidentialite" className="hover:text-black">
                            Confidentialite
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

