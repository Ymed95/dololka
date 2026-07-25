'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Navbar } from '@/components/Navbar'
import { Card, CardContent } from '@/components/ui/Card'
import { ShoppingCart, Trash2, ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useCartStore } from '@/lib/stores/cartStore'

const STEP_ORDER = ['cart', 'shipping', 'confirm'] as const

// Variantes de transition entre étapes : glissement directionnel + fondu.
// `custom` = direction (1 = on avance, -1 = on recule).
const stepVariants = {
    enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 60 : -60 }),
    center: { opacity: 1, x: 0 },
    exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -60 : 60 }),
}
import type { CheckoutItemPayload } from '@/lib/types/customization'

interface ShippingInfo {
    firstName: string
    lastName: string
    email: string
    phone: string
    address: string
    city: string
    postalCode: string
    country: string
    notes: string
}

function CartPageContent() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const searchParams = useSearchParams()
    const cancelled = searchParams.get('cancelled')
    const cartItems = useCartStore((s) => s.items)
    const removeItem = useCartStore((s) => s.removeItem)
    const clearCart = useCartStore((s) => s.clearCart)
    const getTotalPrice = useCartStore((s) => s.getTotalPrice)
    const [mounted, setMounted] = useState(false)
    const [step, setStep] = useState<'cart' | 'shipping' | 'confirm'>('cart')
    const [direction, setDirection] = useState(1)
    const [ordering, setOrdering] = useState(false)

    // Change d'étape en calculant la direction (avance/recul) pour l'animation.
    const goToStep = (next: 'cart' | 'shipping' | 'confirm') => {
        setDirection(STEP_ORDER.indexOf(next) >= STEP_ORDER.indexOf(step) ? 1 : -1)
        setStep(next)
    }
    const [shipping, setShipping] = useState<ShippingInfo>({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        postalCode: '',
        country: 'France',
        notes: '',
    })

    // Évite tout mismatch d'hydratation : le panier persisté n'est lu qu'après montage.
    useEffect(() => {
        setMounted(true)
    }, [])

    // En cas de paiement annulé/échoué : on nettoie les commandes orphelines
    // restées en "pending_payment", tout en conservant le panier intact.
    useEffect(() => {
        if (cancelled) {
            fetch('/api/checkout/cancel', { method: 'POST' }).catch(() => {})
        }
    }, [cancelled])

    useEffect(() => {
        if (session?.user) {
            setShipping(prev => ({
                ...prev,
                email: prev.email || session.user?.email || '',
                firstName: prev.firstName || session.user?.name?.split(' ')[0] || '',
                lastName: prev.lastName || session.user?.name?.split(' ').slice(1).join(' ') || '',
            }))
        }
    }, [session])

    const total = getTotalPrice()

    const handleGoToShipping = () => {
        if (!session) {
            router.push('/login?redirect=/cart')
            return
        }
        goToStep('shipping')
    }

    const handleGoToConfirm = (e: React.FormEvent) => {
        e.preventDefault()
        goToStep('confirm')
    }

    const handlePlaceOrder = async () => {
        setOrdering(true)

        try {
            const res = await fetch('/api/checkout/session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: cartItems.map((item): CheckoutItemPayload => ({
                        productId: item.productId,
                        size: item.size,
                        color: item.color,
                        quantity: item.quantity || 1,
                        customization: item.customization,
                    })),
                    shipping,
                }),
            })

            const data = await res.json()

            if (!res.ok) {
                alert(data.error || 'Erreur lors de la création du paiement')
                setOrdering(false)
                return
            }

            if (data.url) {
                // Ne pas vider le panier avant le paiement — on le vide seulement après succès
                window.location.href = data.url
            } else {
                alert('Erreur : impossible de rediriger vers la page de paiement')
                setOrdering(false)
            }
        } catch (error) {
            console.error('Error creating checkout session:', error)
            alert('Une erreur est survenue. Veuillez réessayer.')
            setOrdering(false)
        }
    }

    if (!mounted) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Payment cancelled banner */}
                {cancelled && (
                    <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-800">
                        Le paiement a été annulé. Votre panier est toujours disponible.
                    </div>
                )}

                {/* Progress Steps */}
                {cartItems.length > 0 && (
                    <div className="flex items-center justify-center gap-4 mb-10">
                        {[
                            { key: 'cart', label: 'Panier', num: 1 },
                            { key: 'shipping', label: 'Livraison', num: 2 },
                            { key: 'confirm', label: 'Confirmation', num: 3 },
                        ].map((s, i) => {
                            const currentIndex = STEP_ORDER.indexOf(step)
                            const done = currentIndex > i
                            const active = step === s.key
                            return (
                                <div key={s.key} className="flex items-center gap-2">
                                    <motion.div
                                        animate={{
                                            scale: active ? 1.12 : 1,
                                            backgroundColor: active ? '#08867e' : done ? '#22c55e' : '#e5e7eb',
                                            color: active || done ? '#ffffff' : '#6b7280',
                                        }}
                                        transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                                        className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-sm"
                                    >
                                        <AnimatePresence mode="wait" initial={false}>
                                            {done ? (
                                                <motion.span
                                                    key="check"
                                                    initial={{ scale: 0, rotate: -90 }}
                                                    animate={{ scale: 1, rotate: 0 }}
                                                    exit={{ scale: 0 }}
                                                    transition={{ type: 'spring', stiffness: 500, damping: 18 }}
                                                >
                                                    <CheckCircle className="w-5 h-5" />
                                                </motion.span>
                                            ) : (
                                                <motion.span key="num" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                                    {s.num}
                                                </motion.span>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                    <span className={`text-sm font-medium transition-colors duration-300 ${active ? 'text-primary-700' : done ? 'text-green-600' : 'text-gray-500'}`}>
                                        {s.label}
                                    </span>
                                    {i < 2 && (
                                        <div className="w-12 h-0.5 bg-gray-200 mx-2 rounded-full overflow-hidden">
                                            <motion.div
                                                className="h-full bg-green-500"
                                                initial={false}
                                                animate={{ width: done ? '100%' : '0%' }}
                                                transition={{ duration: 0.4, ease: 'easeInOut' }}
                                            />
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                )}

                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.25 }}
                    >
                        <h1 className="text-4xl font-bold mb-2">
                            {step === 'cart' && 'Panier'}
                            {step === 'shipping' && 'Adresse de livraison'}
                            {step === 'confirm' && 'Récapitulatif'}
                        </h1>
                        <p className="text-gray-600 mb-8">
                            {step === 'cart' && `${cartItems.length} article(s)`}
                            {step === 'shipping' && 'Renseignez vos informations de livraison'}
                            {step === 'confirm' && 'Vérifiez votre commande avant de valider'}
                        </p>
                    </motion.div>
                </AnimatePresence>

                <AnimatePresence mode="wait" custom={direction}>
                {/* STEP 1 : CART */}
                {step === 'cart' && (
                    <motion.div
                        key="step-cart"
                        custom={direction}
                        variants={stepVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                        {cartItems.length === 0 ? (
                            <Card>
                                <CardContent className="p-12 text-center">
                                    <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                    <h3 className="text-xl font-medium text-gray-700 mb-2">Votre panier est vide</h3>
                                    <p className="text-gray-500 mb-6">Ajoutez des produits personnalisés à votre panier</p>
                                    <Link href="/"><Button>Parcourir les produits</Button></Link>
                                </CardContent>
                            </Card>
                        ) : (
                            <>
                                <div className="space-y-4 mb-8">
                                    <AnimatePresence initial={false}>
                                        {cartItems.map((item, i) => (
                                            <motion.div
                                                key={item.id}
                                                layout
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, x: -80, transition: { duration: 0.2 } }}
                                                transition={{ delay: i * 0.06, type: 'spring', stiffness: 300, damping: 26 }}
                                            >
                                                <Card>
                                                    <CardContent className="p-6">
                                                        <div className="flex items-center gap-6">
                                                            <div className="w-24 h-24 bg-gray-50 rounded-lg flex items-center justify-center overflow-hidden relative flex-shrink-0">
                                                                {item.product?.imageUrl ? (
                                                                    <Image
                                                                        src={item.product.imageUrl}
                                                                        alt={item.product.name}
                                                                        fill
                                                                        className="object-contain p-2"
                                                                    />
                                                                ) : (
                                                                    <ShoppingCart className="w-12 h-12 text-gray-400" />
                                                                )}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <h3 className="text-lg font-bold mb-1 truncate">{item.product?.name}</h3>
                                                                {item.size && <p className="text-sm text-gray-600">Taille: {item.size}</p>}
                                                                {item.color && <p className="text-sm text-gray-600">Couleur: {item.color}</p>}
                                                                {(item.quantity || 1) > 1 && <p className="text-sm text-gray-600">Quantité: {item.quantity}</p>}
                                                                <p className="font-bold text-primary-600 mt-1">{item.totalPrice?.toFixed(2)}€</p>
                                                            </div>
                                                            <motion.button
                                                                whileHover={{ scale: 1.15 }}
                                                                whileTap={{ scale: 0.9 }}
                                                                onClick={() => removeItem(item.id)}
                                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                                                            >
                                                                <Trash2 className="w-5 h-5" />
                                                            </motion.button>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>

                                <Card className="bg-gradient-to-br from-primary-50 to-secondary-50">
                                    <CardContent className="p-6">
                                        <div className="flex justify-between items-center mb-4">
                                            <span className="text-xl font-medium">Total</span>
                                            <span className="text-3xl font-bold text-primary-600">{total.toFixed(2)}€</span>
                                        </div>
                                        <div className="space-y-3">
                                            <Button onClick={handleGoToShipping} className="w-full" size="lg">
                                                {session ? 'Continuer' : 'Se connecter pour commander'}
                                                <ArrowRight className="w-5 h-5 ml-2" />
                                            </Button>
                                            <Button onClick={clearCart} variant="outline" className="w-full">
                                                Vider le panier
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </>
                        )}
                    </motion.div>
                )}

                {/* STEP 2 : SHIPPING */}
                {step === 'shipping' && (
                    <motion.form
                        key="step-shipping"
                        custom={direction}
                        variants={stepVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        onSubmit={handleGoToConfirm}
                    >
                        <Card>
                            <CardContent className="p-8 space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Prénom</label>
                                        <Input required value={shipping.firstName} onChange={(e) => setShipping({ ...shipping, firstName: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Nom</label>
                                        <Input required value={shipping.lastName} onChange={(e) => setShipping({ ...shipping, lastName: e.target.value })} />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                        <Input type="email" required value={shipping.email} onChange={(e) => setShipping({ ...shipping, email: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                                        <Input type="tel" required value={shipping.phone} onChange={(e) => setShipping({ ...shipping, phone: e.target.value })} />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Adresse</label>
                                    <Input required value={shipping.address} onChange={(e) => setShipping({ ...shipping, address: e.target.value })} placeholder="Numéro et nom de rue" />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Code postal</label>
                                        <Input required value={shipping.postalCode} onChange={(e) => setShipping({ ...shipping, postalCode: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Ville</label>
                                        <Input required value={shipping.city} onChange={(e) => setShipping({ ...shipping, city: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Pays</label>
                                        <Input required value={shipping.country} onChange={(e) => setShipping({ ...shipping, country: e.target.value })} />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Notes (optionnel)</label>
                                    <textarea
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        rows={3}
                                        value={shipping.notes}
                                        onChange={(e) => setShipping({ ...shipping, notes: e.target.value })}
                                        placeholder="Instructions spéciales, code porte..."
                                    ></textarea>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <Button type="button" variant="outline" onClick={() => goToStep('cart')}>
                                        <ArrowLeft className="w-4 h-4 mr-2" />
                                        Retour
                                    </Button>
                                    <Button type="submit" className="flex-1">
                                        Continuer
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.form>
                )}

                {/* STEP 3 : CONFIRM */}
                {step === 'confirm' && (
                    <motion.div
                        key="step-confirm"
                        custom={direction}
                        variants={stepVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="space-y-6"
                    >
                        {/* Order Summary */}
                        <Card>
                            <CardContent className="p-6">
                                <h2 className="text-xl font-bold mb-4">Articles</h2>
                                <div className="divide-y">
                                    {cartItems.map((item) => (
                                        <div key={item.id} className="flex items-center gap-4 py-3">
                                            <div className="w-16 h-16 bg-gray-50 rounded-lg flex items-center justify-center overflow-hidden relative flex-shrink-0">
                                                {item.product?.imageUrl ? (
                                                    <Image src={item.product.imageUrl} alt={item.product.name} fill className="object-contain p-1" />
                                                ) : (
                                                    <ShoppingCart className="w-8 h-8 text-gray-400" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium truncate">{item.product?.name}</p>
                                                <p className="text-sm text-gray-500">
                                                    {[item.size, item.color, (item.quantity || 1) > 1 ? `Qté: ${item.quantity}` : null].filter(Boolean).join(' - ')}
                                                </p>
                                            </div>
                                            <p className="font-bold text-primary-600">{item.totalPrice?.toFixed(2)}€</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="border-t pt-4 mt-4 flex justify-between items-center">
                                    <span className="text-xl font-bold">Total</span>
                                    <span className="text-2xl font-bold text-primary-600">{total.toFixed(2)}€</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Shipping Summary */}
                        <Card>
                            <CardContent className="p-6">
                                <h2 className="text-xl font-bold mb-4">Adresse de livraison</h2>
                                <div className="text-gray-700 space-y-1">
                                    <p className="font-medium">{shipping.firstName} {shipping.lastName}</p>
                                    <p>{shipping.address}</p>
                                    <p>{shipping.postalCode} {shipping.city}</p>
                                    <p>{shipping.country}</p>
                                    <p className="text-sm text-gray-500">{shipping.email} - {shipping.phone}</p>
                                    {shipping.notes && <p className="text-sm text-gray-500 italic mt-2">Notes: {shipping.notes}</p>}
                                </div>
                            </CardContent>
                        </Card>

                        <div className="flex gap-3">
                            <Button variant="outline" onClick={() => goToStep('shipping')}>
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Modifier
                            </Button>
                            <motion.div className="flex-1" whileHover={{ scale: ordering ? 1 : 1.02 }} whileTap={{ scale: ordering ? 1 : 0.98 }}>
                                <Button className="w-full" size="lg" onClick={handlePlaceOrder} disabled={ordering}>
                                    {ordering ? (
                                        <span className="flex items-center justify-center">
                                            <span className="w-4 h-4 mr-2 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                            Redirection vers le paiement...
                                        </span>
                                    ) : 'Payer maintenant'}
                                </Button>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
                </AnimatePresence>
            </div>
        </div>
    )
}

export default function CartPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-gray-50"><Navbar /><div className="flex items-center justify-center min-h-[60vh]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div></div>}>
            <CartPageContent />
        </Suspense>
    )
}
