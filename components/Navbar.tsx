'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useSession, signOut } from 'next-auth/react'
import { ShoppingCart, User, Shield, LogOut, ChevronDown } from 'lucide-react'
import { useState } from 'react'

export const Navbar = () => {
    const { data: session, status } = useSession()
    const [showUserMenu, setShowUserMenu] = useState(false)

    const handleSignOut = () => {
        signOut({ callbackUrl: '/' })
    }

    return (
        <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2">
                        <Image
                            src="/logo-transparent.png"
                            alt="Dololka Agency"
                            width={44}
                            height={44}
                            className="object-contain"
                            priority
                        />
                        <span className="text-xl font-heading font-bold text-gray-900">Dololka Agency</span>
                    </Link>

                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link href="/#produits" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
                            Produits
                        </Link>
                        <Link href="/about" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
                            À propos
                        </Link>
                        <Link href="/contact" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
                            Contact
                        </Link>
                    </div>

                    {/* Right side icons */}
                    <div className="flex items-center space-x-4">
                        <Link href="/cart" className="p-2 text-gray-700 hover:text-primary-600 transition-colors relative">
                            <ShoppingCart className="w-6 h-6" />
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
                                    <ChevronDown className="w-4 h-4 text-gray-600" />
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
                                                    <Link
                                                        href="/admin/dashboard"
                                                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                        onClick={() => setShowUserMenu(false)}
                                                    >
                                                        <Shield className="w-4 h-4 mr-3" />
                                                        Dashboard Admin
                                                    </Link>
                                                    <Link
                                                        href="/admin/products"
                                                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                        onClick={() => setShowUserMenu(false)}
                                                    >
                                                        Gestion Produits
                                                    </Link>
                                                    <Link
                                                        href="/admin/orders"
                                                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                        onClick={() => setShowUserMenu(false)}
                                                    >
                                                        Gestion Commandes
                                                    </Link>
                                                    <Link
                                                        href="/admin/messages"
                                                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                        onClick={() => setShowUserMenu(false)}
                                                    >
                                                        Messages
                                                    </Link>
                                                </>
                                            ) : (
                                                <>
                                                    <Link
                                                        href="/client/dashboard"
                                                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                        onClick={() => setShowUserMenu(false)}
                                                    >
                                                        <User className="w-4 h-4 mr-3" />
                                                        Mon Espace
                                                    </Link>
                                                    <Link
                                                        href="/client/orders"
                                                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                        onClick={() => setShowUserMenu(false)}
                                                    >
                                                        Mes Commandes
                                                    </Link>
                                                    <Link
                                                        href="/client/messages"
                                                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                        onClick={() => setShowUserMenu(false)}
                                                    >
                                                        Messages
                                                    </Link>
                                                </>
                                            )}

                                            <div className="border-t border-gray-100 mt-2 pt-2">
                                                <button
                                                    onClick={handleSignOut}
                                                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                                >
                                                    <LogOut className="w-4 h-4 mr-3" />
                                                    Déconnexion
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center space-x-2">
                                <Link
                                    href="/login"
                                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors"
                                >
                                    Connexion
                                </Link>
                                <Link
                                    href="/signup"
                                    className="px-4 py-2 text-sm font-medium bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                                >
                                    S'inscrire
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
}
