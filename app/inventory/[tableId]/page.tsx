"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from "@/lib/auth-context"
import { useGame } from "@/lib/game-context"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Share2, Package } from 'lucide-react'

export default function InventoryPage() {
  const { user, isAuthenticated } = useAuth()
  const { tables, inventory, sendChatMessage } = useGame()
  const router = useRouter()
  const params = useParams()
  const tableId = params.tableId as string

  const [shareDialogOpen, setShareDialogOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [shareMessage, setShareMessage] = useState("")

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth")
    }
  }, [isAuthenticated, router])

  const table = tables.find((t) => t.id === tableId)
  const userInventory = user ? inventory.filter((item) => item.userId === user.id) : []

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "bg-gray-500"
      case "uncommon":
        return "bg-green-500"
      case "rare":
        return "bg-blue-500"
      case "epic":
        return "bg-purple-500"
      case "legendary":
        return "bg-orange-500"
      default:
        return "bg-gray-500"
    }
  }

  const handleShareItem = () => {
    if (user && selectedItem) {
      const message = shareMessage || `Показывает предмет: ${selectedItem.name}`
      sendChatMessage(user.id, user.username, message, selectedItem)
      setShareDialogOpen(false)
      setShareMessage("")
      setSelectedItem(null)
    }
  }

  if (!isAuthenticated || !table) {
    return null
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/dark-fantasy-forest-path-atmospheric-misty.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            onClick={() => router.push(`/game/${tableId}`)}
            variant="outline"
            className="border-orange-600 text-white hover:bg-orange-600 hover:text-black bg-black/80"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Назад в игру
          </Button>

          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-wide">Инвентарь</h1>
            <div className="w-12 h-1 bg-orange-500 mx-auto mt-1" />
          </div>

          <div className="w-[140px]" />
        </div>

        {/* Inventory Grid */}
        <div className="max-w-6xl mx-auto">
          <div className="bg-black/80 border-2 border-orange-600/50 rounded-lg p-6 backdrop-blur-sm">
            <div className="flex items-center justify-center mb-6">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-orange-600 to-transparent" />
              <h2 className="px-4 text-2xl font-bold text-white flex items-center gap-2">
                <Package className="h-6 w-6 text-orange-400" />
                Мои предметы
              </h2>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-orange-600 to-transparent" />
            </div>

            {userInventory.length === 0 ? (
              <div className="text-center py-16">
                <Package className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">Ваш инвентарь пуст</p>
                <p className="text-gray-500 text-sm mt-2">Поднимите предметы в лобби, чтобы они появились здесь</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {userInventory.map((item) => (
                  <Card
                    key={item.id}
                    className="bg-gray-900/80 border-2 border-gray-700 hover:border-orange-500 transition-all p-4"
                  >
                    <div className="flex items-start gap-4">
                      <div className="text-5xl">{item.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-lg font-bold text-white">{item.name}</h3>
                          <Badge className={`${getRarityColor(item.rarity)} text-white border-0 text-xs`}>
                            {item.rarity}
                          </Badge>
                        </div>
                        <p className="text-gray-300 text-sm mb-2">{item.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-orange-400 font-semibold text-sm">x{item.quantity}</span>
                          <Dialog
                            open={shareDialogOpen && selectedItem?.id === item.id}
                            onOpenChange={setShareDialogOpen}
                          >
                            <DialogTrigger asChild>
                              <Button
                                onClick={() => setSelectedItem(item)}
                                size="sm"
                                variant="outline"
                                className="border-orange-600 text-white hover:bg-orange-600 hover:text-black bg-transparent"
                              >
                                <Share2 className="mr-1 h-3 w-3" />
                                Показать
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-gray-900 border-orange-600 text-white">
                              <DialogHeader>
                                <DialogTitle className="text-xl text-white">Показать предмет в чате</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="flex items-center gap-4 p-4 bg-gray-800 rounded">
                                  <span className="text-4xl">{item.icon}</span>
                                  <div>
                                    <h4 className="font-bold text-white">{item.name}</h4>
                                    <p className="text-sm text-gray-300">{item.description}</p>
                                  </div>
                                </div>
                                <div>
                                  <label className="text-sm text-gray-300 mb-2 block">Сообщение (необязательно)</label>
                                  <Textarea
                                    value={shareMessage}
                                    onChange={(e) => setShareMessage(e.target.value)}
                                    placeholder="Добавьте комментарий..."
                                    className="bg-gray-800 border-gray-700 text-white"
                                  />
                                </div>
                                <Button
                                  onClick={handleShareItem}
                                  className="w-full bg-orange-500 hover:bg-orange-600 text-black font-bold"
                                >
                                  <Share2 className="mr-2 h-4 w-4" />
                                  Отправить в чат
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Stats Panel */}
          <div className="mt-6 bg-black/80 border-2 border-orange-600/50 rounded-lg p-6 backdrop-blur-sm">
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <p className="text-gray-400 text-sm mb-1">Всего предметов</p>
                <p className="text-3xl font-bold text-white">
                  {userInventory.reduce((acc, item) => acc + item.quantity, 0)}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Уникальных предметов</p>
                <p className="text-3xl font-bold text-white">{userInventory.length}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Редких и выше</p>
                <p className="text-3xl font-bold text-white">
                  {userInventory.filter((item) => ["rare", "epic", "legendary"].includes(item.rarity)).length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
