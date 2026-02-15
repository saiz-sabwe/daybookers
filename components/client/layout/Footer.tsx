// import Link from "next/link";
// import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-gray-50 border-t border-gray-200 py-8">
            <div className="container mx-auto px-4">
                {/* TODO: Sections du footer à implémenter (À propos, Aide, Professionnels, Réseaux sociaux) */}
                {/* 
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                    <div>
                        <h3 className="font-bold text-lg mb-4">À propos</h3>
                        <ul className="space-y-2">
                            <li><Link href="/about" className="text-gray-600 hover:text-black text-sm">Qui sommes-nous ?</Link></li>
                            <li><Link href="/press" className="text-gray-600 hover:text-black text-sm">Presse</Link></li>
                            <li><Link href="/careers" className="text-gray-600 hover:text-black text-sm">Carrières</Link></li>
                            <li><Link href="/blog" className="text-gray-600 hover:text-black text-sm">Blog</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold text-lg mb-4">Aide</h3>
                        <ul className="space-y-2">
                            <li><Link href="/faq" className="text-gray-600 hover:text-black text-sm">FAQ</Link></li>
                            <li><Link href="/contact" className="text-gray-600 hover:text-black text-sm">Contactez-nous</Link></li>
                            <li><Link href="/terms" className="text-gray-600 hover:text-black text-sm">Conditions Générales</Link></li>
                            <li><Link href="/legal" className="text-gray-600 hover:text-black text-sm">Mentions Légales</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold text-lg mb-4">Professionnels</h3>
                        <ul className="space-y-2">
                            <li><Link href="/partner/register" className="text-gray-600 hover:text-black text-sm">Ajouter votre hôtel</Link></li>
                            <li><Link href="/partner" className="text-gray-600 hover:text-black text-sm">Espace Partenaire</Link></li>
                            <li><Link href="/affiliate" className="text-gray-600 hover:text-black text-sm">Affiliation</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold text-lg mb-4">Suivez-nous</h3>
                        <div className="flex gap-4 mb-6">
                            <Link href="https://facebook.com" className="text-gray-400 hover:text-client-primary-500"><Facebook className="w-5 h-5" /></Link>
                            <Link href="https://twitter.com" className="text-gray-400 hover:text-client-primary-500"><Twitter className="w-5 h-5" /></Link>
                            <Link href="https://instagram.com" className="text-gray-400 hover:text-client-primary-500"><Instagram className="w-5 h-5" /></Link>
                            <Link href="https://linkedin.com" className="text-gray-400 hover:text-client-primary-500"><Linkedin className="w-5 h-5" /></Link>
                        </div>
                        <p className="text-sm text-gray-500">Recevez nos meilleures offres</p>
                        <div className="mt-2 flex gap-2">
                            <input type="email" placeholder="Votre email" className="flex-1 px-3 py-2 border rounded-md text-sm" />
                            <button className="bg-black text-white px-4 py-2 rounded-md text-sm font-medium">OK</button>
                        </div>
                    </div>
                </div>
                */}

                <div className="text-center">
                    <p className="text-sm text-gray-500">© 2025 DayBooker. Tous droits réservés.</p>
                    {/* TODO: Liens légaux à implémenter
                    <div className="flex gap-4 justify-center mt-4">
                        <Link href="/privacy" className="text-sm text-gray-400 hover:text-gray-600">Confidentialité</Link>
                        <Link href="/cookies" className="text-sm text-gray-400 hover:text-gray-600">Cookies</Link>
                    </div>
                    */}
                </div>
            </div>
        </footer>
    );
}

