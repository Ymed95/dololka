'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { CheckCircle, Package, AlertCircle } from 'lucide-react'

function CheckoutSuccessContent() {
    const searchParams = useSearchParams()
    const sessionId = searchParams.get('session_id')
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')

    useEffect(() => {
        if (sessionId) {
            verifyPayment()
        } else {
            setStatus('success')
        }
    }, [sessionId])

    const verifyPayment = async () => {
        try {
            const res = await fetch(`/api/checkout/verify?session_id=${sessionId}`)
            if (res.ok) {
                setStatus('success')
            } else {
                setStatus('error')
            }
        } catch {
            setStatus('error')
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />

            <div className="flex-1 flex items-center">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
                    {status === 'loading' && (
                        <Card>
                            <CardContent className="p-12 text-center">
                                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-6"></div>
                                <h1 className="text-2xl font-bold mb-2">Vérification du paiement...</h1>
                                <p className="text-gray-600">Veuillez patienter un instant.</p>
                            </CardContent>
                        </Card>
                    )}

                    {status === 'success' && (
                        <Card>
                            <CardContent className="p-12 text-center">
                                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle className="w-12 h-12 text-green-600" />
                                </div>

                                <h1 className="text-3xl font-bold mb-4">Paiement confirmé !</h1>
                                <p className="text-gray-600 mb-8">
                                    Merci pour votre commande. Votre paiement a été accepté et nous allons traiter votre commande dans les plus brefs délais.
                                </p>

                                <div className="bg-primary-50 rounded-lg p-6 mb-8">
                                    <Package className="w-12 h-12 text-primary-600 mx-auto mb-4" />
                                    <h3 className="font-bold mb-2">Prochaines étapes</h3>
                                    <ul className="text-sm text-left space-y-2 max-w-md mx-auto">
                                        <li className="flex items-start">
                                            <span className="text-primary-600 mr-2">1.</span>
                                            <span>Votre commande est en cours de traitement</span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="text-primary-600 mr-2">2.</span>
                                            <span>Elle sera mise en production sous 24-48h</span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="text-primary-600 mr-2">3.</span>
                                            <span>Vous pourrez suivre l'état dans votre espace client</span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="text-primary-600 mr-2">4.</span>
                                            <span>N'hésitez pas à nous contacter via la messagerie</span>
                                        </li>
                                    </ul>
                                </div>

                                <div className="flex gap-4 justify-center">
                                    <Link href="/client/orders">
                                        <Button>Voir mes commandes</Button>
                                    </Link>
                                    <Link href="/">
                                        <Button variant="outline">Continuer mes achats</Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {status === 'error' && (
                        <Card>
                            <CardContent className="p-12 text-center">
                                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <AlertCircle className="w-12 h-12 text-red-600" />
                                </div>

                                <h1 className="text-3xl font-bold mb-4">Problème de paiement</h1>
                                <p className="text-gray-600 mb-8">
                                    Nous n'avons pas pu vérifier votre paiement. Si votre compte a été débité, veuillez nous contacter.
                                </p>

                                <div className="flex gap-4 justify-center">
                                    <Link href="/contact">
                                        <Button>Nous contacter</Button>
                                    </Link>
                                    <Link href="/cart">
                                        <Button variant="outline">Retour au panier</Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    )
}

export default function CheckoutSuccess() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-gray-50"><Navbar /><div className="flex items-center justify-center min-h-[60vh]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div></div>}>
            <CheckoutSuccessContent />
        </Suspense>
    )
}
