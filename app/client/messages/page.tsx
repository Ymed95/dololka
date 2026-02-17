'use client'

import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/Navbar'
import { Card, CardContent } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { MessageSquare, Send } from 'lucide-react'

export default function ClientMessages() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [messages, setMessages] = useState<any[]>([])
    const [newMessage, setNewMessage] = useState({ subject: '', content: '' })
    const [loading, setLoading] = useState(true)
    const [sending, setSending] = useState(false)
    const [showNewForm, setShowNewForm] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const userId = (session?.user as any)?.id

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login')
        } else if (status === 'authenticated') {
            fetchMessages()
        }
    }, [status, router])

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const fetchMessages = async () => {
        try {
            const res = await fetch('/api/messages')
            const data = await res.json()
            if (Array.isArray(data)) {
                setMessages(data.sort((a: any, b: any) =>
                    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
                ))

                // Mark unread messages as read
                data.forEach(async (msg: any) => {
                    if (!msg.isRead && msg.receiverId === (session?.user as any)?.id) {
                        try {
                            await fetch(`/api/messages/${msg.id}/read`, { method: 'PUT' })
                        } catch {}
                    }
                })
            }
            setLoading(false)
        } catch (error) {
            console.error('Error fetching messages:', error)
            setLoading(false)
        }
    }

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newMessage.content.trim()) return
        setSending(true)

        try {
            const res = await fetch('/api/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    subject: newMessage.subject || undefined,
                    content: newMessage.content,
                }),
            })

            if (res.ok) {
                setNewMessage({ subject: '', content: '' })
                setShowNewForm(false)
                fetchMessages()
            }
        } catch (error) {
            console.error('Error sending message:', error)
        } finally {
            setSending(false)
        }
    }

    const handleQuickReply = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newMessage.content.trim()) return
        setSending(true)

        try {
            const res = await fetch('/api/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: newMessage.content }),
            })

            if (res.ok) {
                setNewMessage({ subject: '', content: '' })
                fetchMessages()
            }
        } catch (error) {
            console.error('Error sending message:', error)
        } finally {
            setSending(false)
        }
    }

    if (loading) {
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

            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="mb-6 flex justify-between items-center">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">Messagerie</h1>
                        <p className="text-gray-600">Communiquez avec l'équipe Dololka</p>
                    </div>
                    {messages.length > 0 && !showNewForm && (
                        <Button onClick={() => setShowNewForm(true)} variant="outline">
                            Nouveau sujet
                        </Button>
                    )}
                </div>

                {/* New Message Form (for first message or new subject) */}
                {(messages.length === 0 || showNewForm) && (
                    <Card className="mb-6">
                        <CardContent className="p-6">
                            <h2 className="text-xl font-bold mb-4">
                                {messages.length === 0 ? 'Envoyez votre premier message' : 'Nouveau sujet'}
                            </h2>
                            <form onSubmit={handleSendMessage} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Sujet</label>
                                    <Input
                                        placeholder="Sujet de votre message"
                                        value={newMessage.subject}
                                        onChange={(e) => setNewMessage({ ...newMessage, subject: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                                    <textarea
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        rows={4}
                                        placeholder="Votre message..."
                                        value={newMessage.content}
                                        onChange={(e) => setNewMessage({ ...newMessage, content: e.target.value })}
                                        required
                                    ></textarea>
                                </div>
                                <div className="flex gap-3">
                                    <Button type="submit" disabled={sending}>
                                        <Send className="w-4 h-4 mr-2" />
                                        {sending ? 'Envoi...' : 'Envoyer'}
                                    </Button>
                                    {showNewForm && (
                                        <Button type="button" variant="outline" onClick={() => setShowNewForm(false)}>
                                            Annuler
                                        </Button>
                                    )}
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                )}

                {/* Chat Thread */}
                {messages.length > 0 && (
                    <Card>
                        <CardContent className="p-0">
                            {/* Header */}
                            <div className="p-4 border-b bg-gray-50 rounded-t-xl">
                                <p className="font-bold">Conversation avec Dololka Agency</p>
                                <p className="text-sm text-gray-500">{messages.length} message(s)</p>
                            </div>

                            {/* Messages */}
                            <div className="p-4 space-y-4 max-h-[50vh] overflow-y-auto">
                                {messages.map((message) => (
                                    <div
                                        key={message.id}
                                        className={`max-w-[80%] ${message.senderId === userId ? 'ml-auto' : 'mr-auto'}`}
                                    >
                                        <div className={`rounded-xl px-4 py-3 ${message.senderId === userId
                                            ? 'bg-primary-600 text-white'
                                            : 'bg-gray-100 text-gray-800'
                                        }`}>
                                            {message.subject && (
                                                <p className={`text-xs font-bold mb-1 ${message.senderId === userId ? 'text-primary-100' : 'text-gray-500'}`}>
                                                    {message.subject}
                                                </p>
                                            )}
                                            <p className="text-sm whitespace-pre-line">{message.content}</p>
                                        </div>
                                        <p className={`text-xs mt-1 text-gray-400 ${message.senderId === userId ? 'text-right' : ''}`}>
                                            {message.senderId === userId ? 'Vous' : message.sender?.name || 'Dololka'} - {new Date(message.createdAt).toLocaleDateString('fr-FR', {
                                                day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                                            })}
                                        </p>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Quick Reply */}
                            <form onSubmit={handleQuickReply} className="p-4 border-t bg-gray-50 rounded-b-xl">
                                <div className="flex gap-3">
                                    <textarea
                                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                                        rows={2}
                                        placeholder="Votre réponse..."
                                        value={newMessage.content}
                                        onChange={(e) => setNewMessage({ ...newMessage, content: e.target.value })}
                                        required
                                    />
                                    <Button type="submit" disabled={sending || !newMessage.content.trim()} className="self-end">
                                        <Send className="w-4 h-4" />
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}
