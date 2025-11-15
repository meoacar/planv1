'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Loader2, MessageSquare, Send } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { tr } from 'date-fns/locale'

interface User {
  id: string
  name: string | null
  username: string | null
  image: string | null
}

interface Message {
  id: string
  body: string
  senderId: string
  read: boolean
  createdAt: string
  sender: User
}

interface Conversation {
  id: string
  otherUser: User
  lastMessage?: {
    id: string
    body: string
    senderId: string
    read: boolean
    createdAt: string
  }
  unreadCount: number
  lastMessageAt: string
}

export function MessagesClient() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [newChatUserId, setNewChatUserId] = useState<string | null>(null)

  useEffect(() => {
    // Check if there's a userId in URL params (for starting new conversation)
    const params = new URLSearchParams(window.location.search)
    const userId = params.get('userId')
    if (userId) {
      setNewChatUserId(userId)
    }
    
    loadConversations()
  }, [])

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation)
    }
  }, [selectedConversation])

  const loadConversations = async () => {
    try {
      const res = await fetch('/api/messages')
      const data = await res.json()
      
      if (data.success) {
        setConversations(data.data)
      }
    } catch (error) {
      console.error('Load conversations error:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadMessages = async (conversationId: string) => {
    setLoadingMessages(true)
    try {
      const res = await fetch(`/api/messages/${conversationId}`)
      const data = await res.json()
      
      if (data.success) {
        setMessages(data.data.messages)
      }
    } catch (error) {
      console.error('Load messages error:', error)
    } finally {
      setLoadingMessages(false)
    }
  }

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newMessage.trim()) return

    // Determine receiver ID
    let receiverId: string
    if (newChatUserId) {
      receiverId = newChatUserId
    } else if (selectedConversation) {
      const conversation = conversations.find(c => c.id === selectedConversation)
      if (!conversation) return
      receiverId = conversation.otherUser.id
    } else {
      return
    }

    setSending(true)
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          receiverId,
          body: newMessage.trim()
        })
      })

      const data = await res.json()
      
      if (data.success) {
        setMessages([...messages, data.data])
        setNewMessage('')
        setNewChatUserId(null) // Clear new chat mode
        
        // Clear URL params
        window.history.replaceState({}, '', '/mesajlar')
        
        // Refresh conversation list
        await loadConversations()
        
        // Select the new conversation
        if (data.data.conversationId) {
          setSelectedConversation(data.data.conversationId)
        }
      }
    } catch (error) {
      console.error('Send message error:', error)
    } finally {
      setSending(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
      {/* Conversations List */}
      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Mesajlar
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[calc(100vh-16rem)]">
            {conversations.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Henüz mesajınız yok</p>
              </div>
            ) : (
              <div className="divide-y">
                {conversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => setSelectedConversation(conv.id)}
                    className={`w-full p-4 text-left hover:bg-muted/50 transition-colors ${
                      selectedConversation === conv.id ? 'bg-muted' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {conv.otherUser.image ? (
                          <img src={conv.otherUser.image} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-2xl">👤</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium truncate">
                            {conv.otherUser.name || `@${conv.otherUser.username}`}
                          </p>
                          {conv.unreadCount > 0 && (
                            <Badge variant="default" className="ml-2">
                              {conv.unreadCount}
                            </Badge>
                          )}
                        </div>
                        {conv.lastMessage && (
                          <>
                            <p className="text-sm text-muted-foreground truncate">
                              {conv.lastMessage.body}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {formatDistanceToNow(new Date(conv.lastMessage.createdAt), {
                                addSuffix: true,
                                locale: tr
                              })}
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Messages */}
      <Card className="md:col-span-2">
        {selectedConversation || newChatUserId ? (
          <>
            <CardHeader className="border-b">
              <CardTitle className="flex items-center gap-3">
                {newChatUserId ? (
                  <>
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-xl">👤</span>
                    </div>
                    <span>Yeni Konuşma</span>
                  </>
                ) : (() => {
                  const conv = conversations.find(c => c.id === selectedConversation)
                  if (!conv) return null
                  
                  return (
                    <>
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                        {conv.otherUser.image ? (
                          <img src={conv.otherUser.image} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-xl">👤</span>
                        )}
                      </div>
                      <span>{conv.otherUser.name || `@${conv.otherUser.username}`}</span>
                    </>
                  )
                })()}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 flex flex-col h-[calc(100vh-20rem)]">
              {/* Messages Area */}
              <ScrollArea className="flex-1 p-4">
                {newChatUserId ? (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    <div className="text-center">
                      <MessageSquare className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium mb-2">Yeni Konuşma Başlat</p>
                      <p className="text-sm">İlk mesajınızı yazın</p>
                    </div>
                  </div>
                ) : loadingMessages ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    <p>Henüz mesaj yok. İlk mesajı siz gönderin!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message) => {
                      const isOwn = message.sender.id === conversations.find(c => c.id === selectedConversation)?.otherUser.id ? false : true
                      
                      return (
                        <div
                          key={message.id}
                          className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[70%] rounded-lg p-3 ${
                              isOwn
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted'
                            }`}
                          >
                            <p className="text-sm whitespace-pre-wrap break-words">{message.body}</p>
                            <p className={`text-xs mt-1 ${isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                              {formatDistanceToNow(new Date(message.createdAt), {
                                addSuffix: true,
                                locale: tr
                              })}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </ScrollArea>

              {/* Message Input */}
              <form onSubmit={sendMessage} className="p-4 border-t">
                <div className="flex gap-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Mesajınızı yazın..."
                    disabled={sending}
                    className="flex-1"
                  />
                  <Button type="submit" disabled={sending || !newMessage.trim()}>
                    {sending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </>
        ) : (
          <CardContent className="flex items-center justify-center h-full">
            <div className="text-center text-muted-foreground">
              <MessageSquare className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p>Bir konuşma seçin</p>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  )
}
