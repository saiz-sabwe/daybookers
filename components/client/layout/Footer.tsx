import Link from "next/link";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-gray-50 border-t border-gray-200 pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                    {/* Column 1 */}
                    <div>
                        <h3 className="font-bold text-lg mb-4">À propos</h3>
                        <ul className="space-y-2">
                            <li><Link href="#" className="text-gray-600 hover:text-black text-sm">Qui sommes-nous ?</Link></li>
                            <li><Link href="#" className="text-gray-600 hover:text-black text-sm">Presse</Link></li>
                            <li><Link href="#" className="text-gray-600 hover:text-black text-sm">Carrières</Link></li>
                            <li><Link href="#" className="text-gray-600 hover:text-black text-sm">Blog</Link></li>
                        </ul>
                    </div>

                    {/* Column 2 */}
                    <div>
                        <h3 className="font-bold text-lg mb-4">Aide</h3>
                        <ul className="space-y-2">
                            <li><Link href="#" className="text-gray-600 hover:text-black text-sm">FAQ</Link></li>
                            <li><Link href="#" className="text-gray-600 hover:text-black text-sm">Contactez-nous</Link></li>
                            <li><Link href="#" className="text-gray-600 hover:text-black text-sm">Conditions Générales</Link></li>
                            <li><Link href="#" className="text-gray-600 hover:text-black text-sm">Mentions Légales</Link></li>
                        </ul>
                    </div>

                    {/* Column 3 */}
                    <div>
                        <h3 className="font-bold text-lg mb-4">Professionnels</h3>
                        <ul className="space-y-2">
                            <li><Link href="#" className="text-gray-600 hover:text-black text-sm">Ajouter votre hôtel</Link></li>
                            <li><Link href="#" className="text-gray-600 hover:text-black text-sm">Espace Partenaire</Link></li>
                            <li><Link href="#" className="text-gray-600 hover:text-black text-sm">Affiliation</Link></li>
                        </ul>
                    </div>

                    {/* Column 4 */}
                    <div>
                        <h3 className="font-bold text-lg mb-4">Suivez-nous</h3>
                        <div className="flex gap-4 mb-6">
                            <Link href="#" className="text-gray-400 hover:text-client-primary-500"><Facebook className="w-5 h-5" /></Link>
                            <Link href="#" className="text-gray-400 hover:text-client-primary-500"><Twitter className="w-5 h-5" /></Link>
                            <Link href="#" className="text-gray-400 hover:text-client-primary-500"><Instagram className="w-5 h-5" /></Link>
                            <Link href="#" className="text-gray-400 hover:text-client-primary-500"><Linkedin className="w-5 h-5" /></Link>
                        </div>
                        <p className="text-sm text-gray-500">
                            Recevez nos meilleures offres
                        </p>
                        {/* Newsletter input placeholder */}
                        <div className="mt-2 flex gap-2">
                            <input type="email" placeholder="Votre email" className="flex-1 px-3 py-2 border rounded-md text-sm" />
                            <button className="bg-black text-white px-4 py-2 rounded-md text-sm font-medium">OK</button>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-gray-500">© 2025 DayBooker. Tous droits réservés.</p>
                    <div className="flex gap-4">
                        <span className="text-sm text-gray-400">Confidentialité</span>
                        <span className="text-sm text-gray-400">Cookies</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}

