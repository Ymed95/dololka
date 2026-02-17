'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/Navbar'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { MessageSquare, Send, Mail, MailOpen } from 'lucide-react'

export default function AdminMessages() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [messages, setMessages] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
    const [replyContent, setReplyContent] = useState('')
    const [sending, setSending] = useState(false)

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login')
        } else if (status === 'authenticated') {
            if ((session.user as any)?.role !== 'admin') {
                router.push('/client/dashboard')
            } else {
                fetchMessages()
            }
        }
    }, [status, session, router])

    const fetchMessages = async () => {
        try {
            const res = await fetch('/api/messages')
            const data = await res.json()
            if (Array.isArray(data)) setMessages(data)
            setLoading(false)
        } catch (error) {
            console.error('Error fetching messages:', error)
            setLoading(false)
        }
    }

    const adminId = (session?.user as any)?.id

    // Group messages by conversation partner
    const conversations = messages.reduce((acc: Record<string, any>, msg) => {
        const partnerId = msg.senderId === adminId ? msg.receiverId : msg.senderId
        const partnerName = msg.senderId === adminId ? msg.receiver?.name : msg.sender?.name
        const partnerEmail = msg.senderId === adminId ? msg.receiver?.email : msg.sender?.email

        if (!acc[partnerId]) {
            acc[partnerId] = {
                partnerId,
                partnerName: partnerName || 'Inconnu',
                partnerEmail: partnerEmail || '',
                messages: [],
                unread: 0,
                lastMessage: null,
            }
        }
        acc[partnerId].messages.push(msg)
        if (!msg.isRead && msg.receiverId === adminId) {
            acc[partnerId].unread++
        }
        if (!acc[partnerId].lastMessage || new Date(msg.createdAt) > new Date(acc[partnerId].lastMessage.createdAt)) {
            acc[partnerId].lastMessage = msg
        }
        return acc
    }, {})

    const conversationList = Object.values(conversations).sort((a: any, b: any) =>
        new Date(b.lastMessage?.createdAt).getTime() - new Date(a.lastMessage?.createdAt).getTime()
    )

    const currentConversation = selectedConversation ? conversations[selectedConversation] : null
    const sortedMessages = currentConversation
        ? [...currentConversation.messages].sort((a: any, b: any) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        )
        : []

    const markAsRead = async (messageId: string) => {
        try {
            await fetch(`/api/messages/${messageId}/read`, { method: 'PUT' })
        } catch (error) {
            console.error('Error marking as read:', error)
        }
    }

    const handleSelectConversation = (partnerId: string) => {
        setSelectedConversation(partnerId)
        const conv = conversations[partnerId]
        if (conv) {
            conv.messages.forEach((msg: any) => {
                if (!msg.isRead && msg.receiverId === adminId) {
                    markAsRead(msg.id)
                    msg.isRead = true
                }
            })
            conv.unread = 0
            setMessages([...messages])
        }
    }

    const handleReply = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!replyContent.trim() || !selectedConversation) return
        setSending(true)

        try {
            const res = await fetch('/api/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    receiverId: selectedConversation,
                    content: replyContent,
                }),
            })

            if (res.ok) {
                setReplyContent('')
                fetchMessages()
            }
        } catch (error) {
            console.error('Error sending reply:', error)
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

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2">Messages</h1>
                    <p className="text-gray-600">Gérez les messages des clients</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" style={{ minHeight: '60vh' }}>
                    {/* Conversation List */}
                    <Card className="lg:col-span-1">
                        <CardContent className="p-0">
                            <div className="p-4 border-b">
                                <h2 className="font-bold text-lg">Conversations</h2>
                            </div>
                            {conversationList.length === 0 ? (
                                <div className="p-8 text-center text-gray-500">
                                    <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                    <p>Aucun message</p>
                                </div>
                            ) : (
                                <div className="divide-y max-h-[60vh] overflow-y-auto">
                                    {conversationList.map((conv: any) => (
                                        <button
                                            key={conv.partnerId}
                                            onClick={() => handleSelectConversation(conv.partnerId)}
                                            className={`w-full text-left p-4 hover:bg-gray-50 transition-colors ${selectedConversation === conv.partnerId ? 'bg-primary-50 border-l-4 border-primary-500' : ''
                                                }`}
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-center gap-2">
                                                        {conv.unread > 0 ? (
                                                            <Mail className="w-4 h-4 text-primary-600 flex-shrink-0" />
                                                        ) : (
                                                            <MailOpen className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                                        )}
                                                        <p className={`text-sm truncate ${conv.unread > 0 ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>
                                                            {conv.partnerName}
                                                        </p>
                                                    </div>
                                                    <p className="text-xs text-gray-500 mt-1 truncate">{conv.partnerEmail}</p>
                                                    <p className="text-xs text-gray-500 mt-1 truncate">
                                                        {conv.lastMessage?.subject && `[${conv.lastMessage.subject}] `}
                                                        {conv.lastMessage?.content?.slice(0, 50)}...
                                                    </p>
                                                </div>
                                                <div className="flex flex-col items-end ml-2 flex-shrink-0">
                                                    <span className="text-xs text-gray-400">
                                                        {conv.lastMessage && new Date(conv.lastMessage.createdAt).toLocaleDateString('fr-FR')}
                                                    </span>
                                                    {conv.unread > 0 && (
                                                        <span className="mt-1 bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                                            {conv.unread}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Message Thread */}
                    <Card className="lg:col-span-2">
                        <CardContent className="p-0 flex flex-col" style={{ minHeight: '60vh' }}>
                            {!selectedConversation ? (
                                <div className="flex-1 flex items-center justify-center text-gray-500">
                                    <div className="text-center">
                                        <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-20" />
                                        <p>Sélectionnez une conversation</p>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {/* Header */}
                                    <div className="p-4 border-b bg-gray-50">
                                        <p className="font-bold">{currentConversation?.partnerName}</p>
                                        <p className="text-sm text-gray-500">{currentConversation?.partnerEmail}</p>
                                    </div>

                                    {/* Messages */}
                                    <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[45vh]">
                                        {sortedMessages.map((msg: any) => (
                                            <div
                                                key={msg.id}
                                                className={`max-w-[80%] ${msg.senderId === adminId
                                                    ? 'ml-auto'
                                                    : 'mr-auto'
                                                    }`}
                                            >
                                                <div className={`rounded-xl px-4 py-3 ${msg.senderId === adminId
                                                    ? 'bg-primary-600 text-white'
                                                    : 'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {msg.subject && (
                                                        <p className={`text-xs font-bold mb-1 ${msg.senderId === adminId ? 'text-primary-100' : 'text-gray-500'}`}>
                                                            {msg.subject}
                                                        </p>
                                                    )}
                                                    <p className="text-sm whitespace-pre-line">{msg.content}</p>
                                                </div>
                                                <p className={`text-xs mt-1 ${msg.senderId === adminId ? 'text-right' : ''} text-gray-400`}>
                                                    {new Date(msg.createdAt).toLocaleDateString('fr-FR', {
                                                        day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                                                    })}
                                                </p>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Reply Form */}
                                    <form onSubmit={handleReply} className="p-4 border-t bg-gray-50">
                                        <div className="flex gap-3">
                                            <textarea
                                                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                                                rows={2}
                                                placeholder="Votre réponse..."
                                                value={replyContent}
                                                onChange={(e) => setReplyContent(e.target.value)}
                                                required
                                            />
                                            <Button type="submit" disabled={sending || !replyContent.trim()} className="self-end">
                                                <Send className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </form>
                                </>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
