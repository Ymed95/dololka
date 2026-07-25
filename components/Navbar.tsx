'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useSession, signOut } from 'next-auth/react'
import { ShoppingCart, User, Shield, LogOut, ChevronDown, Menu, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useCartStore } from '@/lib/stores/cartStore'

export const Navbar = () => {
    const { data: session, status } = useSession()
    const [showUserMenu, setShowUserMenu] = useState(false)
    const [showServicesMenu, setShowServicesMenu] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [mounted, setMounted] = useState(false)
    const cartCount = useCartStore((s) => s.getItemCount())

    useEffect(() => {
        setMounted(true)
    }, [])

    const handleSignOut = () => {
        signOut({ callbackUrl: '/' })
    }

    const services = [
        { href: '/services/creation-site', label: 'Création de site internet' },
        { href: '/services/graphisme', label: 'Création digitale & graphisme' },
        { href: '/services/reseaux-sociaux', label: 'Gestion des réseaux sociaux' },
        { href: '/services/publicite', label: 'Publicité & acquisition' },
        { href: '/services/branding', label: 'Branding & positionnement' },
        { href: '/services/enseignes', label: 'Enseignes sur mesure' },
        { href: '/services/photo-video', label: 'Photo & vidéo' },
        { href: '/services/textile', label: 'Accompagnement marque textile' },
        { href: '/services/conseil', label: 'Conseil & stratégie' },
        { href: '/services/ecommerce', label: 'E-commerce & business en ligne' },
        { href: '/services/production-textile', label: 'Production & fabrication textile' },
        { href: '/services/community', label: 'Community building & influence' },
    ]

    return (
        <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2 flex-shrink-0">
                        <Image
                            src="/logo-transparent.png"
                            alt="Dololka Agency"
                            width={44}
                            height={44}
                            className="object-contain"
                            priority
                        />
                        <span className="text-lg font-heading font-bold text-gray-900 hidden sm:block">Dololka Agency</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center space-x-6">
                        <Link href="/" className="text-gray-700 hover:text-primary-600 font-medium transition-colors text-sm">
                            Accueil
                        </Link>
                        <Link href="/agence" className="text-gray-700 hover:text-primary-600 font-medium transition-colors text-sm">
                            L'Agence
                        </Link>

                        {/* Services Dropdown */}
                        <div className="relative"
                            onMouseEnter={() => setShowServicesMenu(true)}
                            onMouseLeave={() => setShowServicesMenu(false)}
                        >
                            <Link href="/services" className="flex items-center text-gray-700 hover:text-primary-600 font-medium transition-colors text-sm">
                                Services
                                <ChevronDown className="w-3.5 h-3.5 ml-1" />
                            </Link>

                            {showServicesMenu && (
                                <div className="absolute left-0 mt-0 pt-2 w-72 z-50">
                                    <div className="bg-white rounded-lg shadow-xl border border-gray-200 py-2 max-h-[70vh] overflow-y-auto">
                                        {services.map((service) => (
                                            <Link
                                                key={service.href}
                                                href={service.href}
                                                className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                                                onClick={() => setShowServicesMenu(false)}
                                            >
                                                {service.label}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <Link href="/boutique" className="text-gray-700 hover:text-primary-600 font-medium transition-colors text-sm">
                            Boutique
                        </Link>
                        <Link href="/portfolio" className="text-gray-700 hover:text-primary-600 font-medium transition-colors text-sm">
                            Portfolio
                        </Link>
                        <Link href="/contact" className="text-gray-700 hover:text-primary-600 font-medium transition-colors text-sm">
                            Contact
                        </Link>
                    </div>

                    {/* Right side */}
                    <div className="flex items-center space-x-3">
                        <Link href="/cart" className="p-2 text-gray-700 hover:text-primary-600 transition-colors relative">
                            <ShoppingCart className="w-5 h-5" />
                            {mounted && cartCount > 0 && (
                                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center bg-secondary-600 text-white text-[10px] font-bold rounded-full">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        {status === 'loading' ? (
                            <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
                        ) : session ? (
                            <div className="relative">
                                <button
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                                        <span className="text-white text-sm font-medium">
                                            {session.user?.name?.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <ChevronDown className="w-4 h-4 text-gray-600 hidden sm:block" />
                                </button>

                                {showUserMenu && (
                                    <>
                                        <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)}></div>
                                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                                            <div className="px-4 py-3 border-b border-gray-100">
                                                <p className="text-sm font-medium text-gray-900">{session.user?.name}</p>
                                                <p className="text-xs text-gray-500 truncate">{session.user?.email}</p>
                                            </div>

                                            {(session.user as any)?.role === 'admin' ? (
                                                <>
                                                    <Link href="/admin/dashboard" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setShowUserMenu(false)}>
                                                        <Shield className="w-4 h-4 mr-3" />
                                                        Dashboard Admin
                                                    </Link>
                                                    <Link href="/admin/products" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setShowUserMenu(false)}>
                                                        Gestion Produits
                                                    </Link>
                                                    <Link href="/admin/orders" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setShowUserMenu(false)}>
                                                        Gestion Commandes
                                                    </Link>
                                                    <Link href="/admin/messages" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setShowUserMenu(false)}>
                                                        Messages
                                                    </Link>
                                                    <Link href="/admin/portfolio" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setShowUserMenu(false)}>
                                                        Portfolio
                                                    </Link>
                                                    <Link href="/admin/users" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setShowUserMenu(false)}>
                                                        Utilisateurs
                                                    </Link>
                                                </>
                                            ) : (
                                                <>
                                                    <Link href="/client/dashboard" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setShowUserMenu(false)}>
                                                        <User className="w-4 h-4 mr-3" />
                                                        Mon Espace
                                                    </Link>
                                                    <Link href="/client/orders" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setShowUserMenu(false)}>
                                                        Mes Commandes
                                                    </Link>
                                                    <Link href="/client/messages" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setShowUserMenu(false)}>
                                                        Messages
                                                    </Link>
                                                </>
                                            )}

                                            <div className="border-t border-gray-100 mt-2 pt-2">
                                                <button onClick={handleSignOut} className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                                                    <LogOut className="w-4 h-4 mr-3" />
                                                    Déconnexion
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        ) : (
                            <div className="hidden sm:flex items-center space-x-2">
                                <Link href="/login" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors">
                                    Connexion
                                </Link>
                                <Link href="/signup" className="px-3 py-2 text-sm font-medium bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                                    S'inscrire
                                </Link>
                            </div>
                        )}

                        {/* Mobile menu button */}
                        <button
                            className="lg:hidden p-2 text-gray-700 hover:text-primary-600"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="lg:hidden bg-white border-t border-gray-200 shadow-lg">
                    <div className="px-4 py-4 space-y-1">
                        <Link href="/" className="block px-3 py-2.5 text-base font-medium text-gray-700 hover:bg-primary-50 hover:text-primary-700 rounded-lg" onClick={() => setMobileMenuOpen(false)}>
                            Accueil
                        </Link>
                        <Link href="/agence" className="block px-3 py-2.5 text-base font-medium text-gray-700 hover:bg-primary-50 hover:text-primary-700 rounded-lg" onClick={() => setMobileMenuOpen(false)}>
                            L'Agence
                        </Link>
                        <Link href="/services" className="block px-3 py-2.5 text-base font-medium text-gray-700 hover:bg-primary-50 hover:text-primary-700 rounded-lg" onClick={() => setMobileMenuOpen(false)}>
                            Nos Services
                        </Link>
                        <Link href="/boutique" className="block px-3 py-2.5 text-base font-medium text-gray-700 hover:bg-primary-50 hover:text-primary-700 rounded-lg" onClick={() => setMobileMenuOpen(false)}>
                            Boutique
                        </Link>
                        <Link href="/portfolio" className="block px-3 py-2.5 text-base font-medium text-gray-700 hover:bg-primary-50 hover:text-primary-700 rounded-lg" onClick={() => setMobileMenuOpen(false)}>
                            Portfolio
                        </Link>
                        <Link href="/contact" className="block px-3 py-2.5 text-base font-medium text-gray-700 hover:bg-primary-50 hover:text-primary-700 rounded-lg" onClick={() => setMobileMenuOpen(false)}>
                            Contact
                        </Link>

                        {!session && (
                            <div className="pt-3 border-t border-gray-200 flex gap-2">
                                <Link href="/login" className="flex-1 text-center px-3 py-2.5 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg" onClick={() => setMobileMenuOpen(false)}>
                                    Connexion
                                </Link>
                                <Link href="/signup" className="flex-1 text-center px-3 py-2.5 text-sm font-medium bg-primary-600 text-white rounded-lg" onClick={() => setMobileMenuOpen(false)}>
                                    S'inscrire
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    )
}
