'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent } from '@/components/ui/Card'
import { Check, X } from 'lucide-react'

function PasswordRule({ ok, label }: { ok: boolean; label: string }) {
    return (
        <div className={`flex items-center gap-2 text-xs ${ok ? 'text-green-600' : 'text-gray-400'}`}>
            {ok ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
            {label}
        </div>
    )
}

export default function SignupPage() {
    const router = useRouter()
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const pw = formData.password
    const pwRules = {
        length: pw.length >= 8,
        lower: /[a-z]/.test(pw),
        upper: /[A-Z]/.test(pw),
        digit: /[0-9]/.test(pw),
    }
    const pwValid = pwRules.length && pwRules.lower && pwRules.upper && pwRules.digit

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (formData.password !== formData.confirmPassword) {
            setError('Les mots de passe ne correspondent pas')
            return
        }

        if (!pwValid) {
            setError('Le mot de passe ne respecte pas les critères')
            return
        }

        setLoading(true)

        try {
            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                }),
            })

            const data = await res.json()

            if (!res.ok) {
                setError(data.error || 'Une erreur est survenue')
            } else {
                router.push('/login?signup=success')
            }
        } catch {
            setError('Une erreur est survenue. Veuillez réessayer.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-600 via-primary-500 to-secondary-500 flex items-center justify-center px-4 py-12">
            <Card className="w-full max-w-md">
                <CardContent className="p-8">
                    <div className="text-center mb-8">
                        <div className="flex justify-center mb-4">
                            <Image src="/logo-transparent.png" alt="Dololka Agency" width={80} height={80} />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Créer un compte</h1>
                        <p className="text-gray-600">Rejoignez Dololka Agency</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                Nom complet
                            </label>
                            <Input
                                id="name"
                                name="name"
                                type="text"
                                placeholder="Jean Dupont"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                disabled={loading}
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email
                            </label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="votre.email@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                disabled={loading}
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Mot de passe
                            </label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                disabled={loading}
                            />
                            {pw.length > 0 && (
                                <div className="mt-2 grid grid-cols-2 gap-1">
                                    <PasswordRule ok={pwRules.length} label="8 caractères min." />
                                    <PasswordRule ok={pwRules.lower} label="1 minuscule" />
                                    <PasswordRule ok={pwRules.upper} label="1 majuscule" />
                                    <PasswordRule ok={pwRules.digit} label="1 chiffre" />
                                </div>
                            )}
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                Confirmer le mot de passe
                            </label>
                            <Input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                placeholder="••••••••"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                                disabled={loading}
                            />
                            {formData.confirmPassword.length > 0 && formData.password !== formData.confirmPassword && (
                                <p className="text-xs text-red-500 mt-1">Les mots de passe ne correspondent pas</p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={loading || !pwValid}
                        >
                            {loading ? 'Création du compte...' : 'Créer mon compte'}
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Déjà un compte ?{' '}
                            <Link href="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                                Se connecter
                            </Link>
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
