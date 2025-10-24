"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useGame } from "@/lib/game-context"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ArrowLeft,
  Package,
  MessageSquare,
  ScrollText,
  Sparkles,
  Hammer,
  Gamepad2,
  Gavel,
  Map,
  Globe,
  Users,
  UserX,
  Coins,
  X,
  Newspaper,
  Lock,
  Key,
} from "lucide-react"

export default function GamePage() {
  const { user, isAuthenticated } = useAuth()
  const {
    tables,
    lobbyItems,
    eventLog,
    chatMessages,
    globalChatMessages,
    activePlayers,
    auctionListings,
    inventory,
    pickupItem,
    currentTable,
    setCurrentTable,
    joinTable,
    leaveTable,
    kickPlayer,
    listItemOnAuction,
    buyAuctionItem,
    removeAuctionListing,
    sendChatMessage,
    sendGlobalChatMessage,
    setTablePassword,
    checkTablePassword,
    getTablePassword,
    addEventLog,
  } = useGame()
  const router = useRouter()
  const params = useParams()
  const tableId = params.tableId as string

  const [mainTab, setMainTab] = useState<"news" | "connect" | "auction" | "map" | "global-chat">("news")
  const [selectedTab, setSelectedTab] = useState<"log" | "chat" | "players">("log")

  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false)
  const [passwordInput, setPasswordInput] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [isConnectUnlocked, setIsConnectUnlocked] = useState(false)
  const [adminPasswordDialogOpen, setAdminPasswordDialogOpen] = useState(false)
  const [adminPasswordInput, setAdminPasswordInput] = useState("")

  const [listDialogOpen, setListDialogOpen] = useState(false)
  const [selectedItemToList, setSelectedItemToList] = useState<string>("")
  const [listingPrice, setListingPrice] = useState("")

  const [globalChatInput, setGlobalChatInput] = useState("")
  const [chatInput, setChatInput] = useState("")

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth")
      return
    }
    setCurrentTable(tableId)

    if (user) {
      joinTable(user.id, user.username, user.role, tableId)
    }

    return () => {
      if (user) {
        leaveTable(user.id, tableId)
      }
    }
  }, [isAuthenticated, tableId, router, user])

  useEffect(() => {
    if (user?.role === "admin") {
      setIsConnectUnlocked(true)
    } else {
      const password = getTablePassword(tableId)
      if (!password) {
        setIsConnectUnlocked(true)
      }
    }
  }, [user, tableId])

  useEffect(() => {
    if (adminPasswordDialogOpen && user?.role === "admin") {
      const currentPassword = getTablePassword(tableId)
      setAdminPasswordInput(currentPassword || "")
    }
  }, [adminPasswordDialogOpen, user, tableId])

  const table = tables.find((t) => t.id === tableId)
  const currentLobbyItems = lobbyItems.filter((item) => item.tableId === tableId)
  const tablePlayers = activePlayers.filter((p) => p.tableId === tableId)
  const tableAuctionListings = auctionListings.filter((l) => l.tableId === tableId)
  const tableChatMessages = chatMessages.filter((m) => m.tableId === tableId)
  const tableEventLog = eventLog.filter((e) => e.tableId === tableId)
  const userInventory = user ? inventory.filter((item) => item.userId === user.id && item.tableId === tableId) : []

  const handleConnectTabClick = () => {
    if (user?.role === "admin" || isConnectUnlocked) {
      setMainTab("connect")
    } else {
      setPasswordDialogOpen(true)
    }
  }

  const handlePasswordSubmit = () => {
    if (checkTablePassword(tableId, passwordInput)) {
      setIsConnectUnlocked(true)
      setPasswordDialogOpen(false)
      setPasswordInput("")
      setPasswordError("")
      setMainTab("connect")
    } else {
      setPasswordError("Неверный пароль")
    }
  }

  const handleAdminPasswordSave = () => {
    setTablePassword(tableId, adminPasswordInput)
    setAdminPasswordDialogOpen(false)
    addEventLog(
      adminPasswordInput
        ? "Мастер игры установил пароль для вкладки 'Подключиться к игре'"
        : "Мастер игры снял пароль с вкладки 'Подключиться к игре'",
      "info",
      tableId,
    )
  }

  const handlePickup = (itemId: string) => {
    if (user) {
      pickupItem(itemId, user.id, user.username)
    }
  }

  const handleKickPlayer = (playerId: string) => {
    if (user?.role === "admin") {
      kickPlayer(playerId, tableId)
    }
  }

  const handleListItem = () => {
    if (user && selectedItemToList && listingPrice) {
      const price = Number.parseInt(listingPrice)
      if (price > 0) {
        const success = listItemOnAuction(user.id, user.username, selectedItemToList, price, tableId)
        if (success) {
          setListDialogOpen(false)
          setSelectedItemToList("")
          setListingPrice("")
        }
      }
    }
  }

  const handleBuyItem = (listingId: string) => {
    if (user) {
      buyAuctionItem(user.id, user.username, listingId)
    }
  }

  const handleRemoveListing = (listingId: string) => {
    if (user) {
      removeAuctionListing(listingId, user.id)
    }
  }

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

  const handleSendGlobalMessage = () => {
    if (user && globalChatInput.trim()) {
      sendGlobalChatMessage(user.id, user.username, globalChatInput.trim())
      setGlobalChatInput("")
    }
  }

  const handleSendChatMessage = () => {
    if (user && chatInput.trim()) {
      sendChatMessage(user.id, user.username, chatInput.trim(), tableId)
      setChatInput("")
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
            onClick={() => router.push("/tables")}
            variant="outline"
            className="border-orange-600 text-white hover:bg-orange-600 hover:text-black bg-black/80"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Назад к столам
          </Button>

          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-wide">{table.name}</h1>
            <div className="w-12 h-1 bg-orange-500 mx-auto mt-1" />
          </div>

          <div className="flex gap-2">
            {user?.role === "admin" && (
              <Button
                onClick={() => router.push("/admin")}
                className="bg-purple-500 hover:bg-purple-600 text-white font-bold"
              >
                <Hammer className="mr-2 h-4 w-4" />
                Создать предметы
              </Button>
            )}
            <Button
              onClick={() => router.push(`/inventory/${tableId}`)}
              className="bg-orange-500 hover:bg-orange-600 text-black font-bold"
            >
              <Package className="mr-2 h-4 w-4" />
              Инвентарь
            </Button>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Left Sidebar - Tabs */}
          <div className="w-48 flex-shrink-0">
            <div className="bg-black/80 border-2 border-orange-600/50 rounded-lg backdrop-blur-sm overflow-hidden sticky top-6">
              <button
                onClick={() => setMainTab("news")}
                className={`w-full px-4 py-4 font-semibold transition-colors flex items-center gap-3 border-b border-gray-700 ${
                  mainTab === "news" ? "bg-orange-500 text-black" : "bg-gray-900/50 text-white hover:bg-gray-800"
                }`}
              >
                <Newspaper className="h-5 w-5" />
                <span>Новости</span>
              </button>
              <button
                onClick={handleConnectTabClick}
                className={`w-full px-4 py-4 font-semibold transition-colors flex items-center gap-3 border-b border-gray-700 ${
                  mainTab === "connect" ? "bg-orange-500 text-black" : "bg-gray-900/50 text-white hover:bg-gray-800"
                }`}
              >
                <Gamepad2 className="h-5 w-5" />
                <span className="text-sm">Подключиться</span>
                {!isConnectUnlocked && user?.role !== "admin" && <Lock className="h-4 w-4 ml-auto" />}
              </button>
              <button
                onClick={() => setMainTab("auction")}
                className={`w-full px-4 py-4 font-semibold transition-colors flex items-center gap-3 border-b border-gray-700 ${
                  mainTab === "auction" ? "bg-orange-500 text-black" : "bg-gray-900/50 text-white hover:bg-gray-800"
                }`}
              >
                <Gavel className="h-5 w-5" />
                <span>Аукцион</span>
              </button>
              <button
                onClick={() => setMainTab("map")}
                className={`w-full px-4 py-4 font-semibold transition-colors flex items-center gap-3 border-b border-gray-700 ${
                  mainTab === "map" ? "bg-orange-500 text-black" : "bg-gray-900/50 text-white hover:bg-gray-800"
                }`}
              >
                <Map className="h-5 w-5" />
                <span>Карта</span>
              </button>
              <button
                onClick={() => setMainTab("global-chat")}
                className={`w-full px-4 py-4 font-semibold transition-colors flex items-center gap-3 ${
                  mainTab === "global-chat" ? "bg-orange-500 text-black" : "bg-gray-900/50 text-white hover:bg-gray-800"
                }`}
              >
                <Globe className="h-5 w-5" />
                <span className="text-sm">Мировой чат</span>
              </button>

              {user?.role === "admin" && mainTab === "connect" && (
                <div className="p-3 border-t border-gray-700">
                  <Button
                    onClick={() => setAdminPasswordDialogOpen(true)}
                    size="sm"
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    <Key className="mr-2 h-4 w-4" />
                    Пароль
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            {mainTab === "news" && (
              <div className="bg-black/80 border-2 border-orange-600/50 rounded-lg p-8 backdrop-blur-sm">
                <div className="text-center py-16">
                  <Newspaper className="h-20 w-20 text-orange-400 mx-auto mb-4" />
                  <h2 className="text-3xl font-bold text-white mb-2">Новости</h2>
                  <p className="text-gray-300 text-lg">Здесь будут отображаться новости и объявления</p>
                  <p className="text-gray-500 mt-2">Раздел в разработке</p>
                </div>
              </div>
            )}

            {mainTab === "connect" && (
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Left Column - Lobby Items */}
                <div className="lg:col-span-2">
                  <div className="bg-black/80 border-2 border-orange-600/50 rounded-lg p-6 backdrop-blur-sm">
                    <div className="flex items-center justify-center mb-6">
                      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-orange-600 to-transparent" />
                      <h2 className="px-4 text-2xl font-bold text-white flex items-center gap-2">
                        <Sparkles className="h-6 w-6 text-orange-400" />
                        Предметы в лобби
                      </h2>
                      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-orange-600 to-transparent" />
                    </div>

                    {currentLobbyItems.length === 0 ? (
                      <div className="text-center py-12">
                        <p className="text-gray-400 text-lg">Пока нет предметов от мастера игры</p>
                      </div>
                    ) : (
                      <div className="grid md:grid-cols-2 gap-4">
                        {currentLobbyItems.map((item) => (
                          <Card
                            key={item.id}
                            className="bg-gray-900/80 border-2 border-gray-700 hover:border-orange-500 transition-all p-4"
                          >
                            <div className="flex items-start gap-4">
                              <div className="text-4xl">{item.icon}</div>
                              <div className="flex-1">
                                <div className="flex items-start justify-between mb-2">
                                  <h3 className="text-lg font-bold text-white">{item.name}</h3>
                                  <Badge className={`${getRarityColor(item.rarity)} text-white border-0`}>
                                    {item.rarity}
                                  </Badge>
                                </div>
                                <p className="text-gray-300 text-sm mb-3">{item.description}</p>
                                <Button
                                  onClick={() => handlePickup(item.id)}
                                  size="sm"
                                  className="w-full bg-orange-500 hover:bg-orange-600 text-black font-bold"
                                >
                                  Взять предмет
                                </Button>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column - Event Log, Chat & Players */}
                <div className="lg:col-span-1">
                  <div className="bg-black/80 border-2 border-orange-600/50 rounded-lg backdrop-blur-sm overflow-hidden">
                    <div className="flex border-b border-gray-700">
                      <button
                        onClick={() => setSelectedTab("log")}
                        className={`flex-1 px-3 py-3 font-semibold transition-colors text-sm ${
                          selectedTab === "log"
                            ? "bg-orange-500 text-black"
                            : "bg-gray-900/50 text-white hover:bg-gray-800"
                        }`}
                      >
                        <ScrollText className="inline-block mr-1 h-4 w-4" />
                        Журнал
                      </button>
                      <button
                        onClick={() => setSelectedTab("chat")}
                        className={`flex-1 px-3 py-3 font-semibold transition-colors text-sm ${
                          selectedTab === "chat"
                            ? "bg-orange-500 text-black"
                            : "bg-gray-900/50 text-white hover:bg-gray-800"
                        }`}
                      >
                        <MessageSquare className="inline-block mr-1 h-4 w-4" />
                        Чат
                      </button>
                      <button
                        onClick={() => setSelectedTab("players")}
                        className={`flex-1 px-3 py-3 font-semibold transition-colors text-sm ${
                          selectedTab === "players"
                            ? "bg-orange-500 text-black"
                            : "bg-gray-900/50 text-white hover:bg-gray-800"
                        }`}
                      >
                        <Users className="inline-block mr-1 h-4 w-4" />
                        Игроки
                      </button>
                    </div>

                    {/* Content */}
                    <ScrollArea className="h-[500px] p-4">
                      {selectedTab === "log" ? (
                        <div className="space-y-3">
                          {tableEventLog.map((entry) => (
                            <div
                              key={entry.id}
                              className={`p-3 rounded border-l-4 ${
                                entry.type === "success"
                                  ? "bg-green-950/50 border-green-500"
                                  : entry.type === "warning"
                                    ? "bg-yellow-950/50 border-yellow-500"
                                    : "bg-blue-950/50 border-blue-500"
                              }`}
                            >
                              <p className="text-white text-sm">{entry.message}</p>
                              <p className="text-gray-400 text-xs mt-1">{entry.timestamp.toLocaleTimeString()}</p>
                            </div>
                          ))}
                        </div>
                      ) : selectedTab === "chat" ? (
                        <div className="space-y-3">
                          {tableChatMessages.length === 0 ? (
                            <p className="text-gray-400 text-center py-8">Пока нет сообщений</p>
                          ) : (
                            tableChatMessages.map((msg) => (
                              <div key={msg.id} className="bg-gray-900/50 p-3 rounded">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-orange-400 font-semibold text-sm">{msg.username}</span>
                                  <span className="text-gray-500 text-xs">{msg.timestamp.toLocaleTimeString()}</span>
                                </div>
                                <p className="text-white text-sm">{msg.message}</p>
                                {msg.item && (
                                  <div className="mt-2 p-2 bg-gray-800 rounded flex items-center gap-2">
                                    <span className="text-2xl">{msg.item.icon}</span>
                                    <span className="text-white text-sm font-semibold">{msg.item.name}</span>
                                  </div>
                                )}
                              </div>
                            ))
                          )}
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {tablePlayers.length === 0 ? (
                            <p className="text-gray-400 text-center py-8">Нет активных игроков</p>
                          ) : (
                            tablePlayers.map((player) => (
                              <div
                                key={player.userId}
                                className="bg-gray-900/50 p-3 rounded flex items-center justify-between"
                              >
                                <div className="flex items-center gap-3">
                                  <Users className="h-5 w-5 text-orange-400" />
                                  <div>
                                    <p className="text-white font-semibold">{player.username}</p>
                                    <p className="text-gray-400 text-xs">
                                      {player.role === "admin" ? "Мастер игры" : "Игрок"}
                                    </p>
                                  </div>
                                </div>
                                {user?.role === "admin" && player.userId !== user.id && (
                                  <Button
                                    onClick={() => handleKickPlayer(player.userId)}
                                    size="sm"
                                    variant="destructive"
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    <UserX className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            ))
                          )}
                        </div>
                      )}
                    </ScrollArea>

                    {selectedTab === "chat" && (
                      <div className="p-4 border-t border-gray-700">
                        <div className="flex gap-2">
                          <Input
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault()
                                handleSendChatMessage()
                              }
                            }}
                            placeholder="Введите сообщение..."
                            className="flex-1 bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
                          />
                          <Button
                            onClick={handleSendChatMessage}
                            disabled={!chatInput.trim()}
                            className="bg-orange-500 hover:bg-orange-600 text-black font-bold"
                          >
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {mainTab === "auction" && (
              <div className="bg-black/80 border-2 border-orange-600/50 rounded-lg p-6 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <Gavel className="h-8 w-8 text-orange-400" />
                    <h2 className="text-3xl font-bold text-white">Аукцион</h2>
                  </div>
                  <Dialog open={listDialogOpen} onOpenChange={setListDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-orange-500 hover:bg-orange-600 text-black font-bold">
                        <Coins className="mr-2 h-4 w-4" />
                        Выставить предмет
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-gray-900 border-orange-600 text-white">
                      <DialogHeader>
                        <DialogTitle className="text-xl text-white">Выставить предмет на аукцион</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label className="text-white mb-2 block">Выберите предмет</Label>
                          <Select value={selectedItemToList} onValueChange={setSelectedItemToList}>
                            <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                              <SelectValue placeholder="Выберите предмет из инвентаря" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 border-gray-700">
                              {userInventory.map((item) => (
                                <SelectItem key={item.id} value={item.id} className="text-white">
                                  {item.icon} {item.name} (x{item.quantity})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-white mb-2 block">Цена (золото)</Label>
                          <Input
                            type="number"
                            value={listingPrice}
                            onChange={(e) => setListingPrice(e.target.value)}
                            placeholder="Введите цену"
                            className="bg-gray-800 border-gray-700 text-white"
                            min="1"
                          />
                        </div>
                        <Button
                          onClick={handleListItem}
                          disabled={!selectedItemToList || !listingPrice}
                          className="w-full bg-orange-500 hover:bg-orange-600 text-black font-bold"
                        >
                          Выставить на аукцион
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                {tableAuctionListings.length === 0 ? (
                  <div className="text-center py-16">
                    <Gavel className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 text-lg">На аукционе пока нет предметов</p>
                    <p className="text-gray-500 text-sm mt-2">Выставьте свои предметы на продажу</p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {tableAuctionListings.map((listing) => (
                      <Card
                        key={listing.id}
                        className="bg-gray-900/80 border-2 border-gray-700 hover:border-orange-500 transition-all p-4"
                      >
                        <div className="flex items-start gap-4">
                          <div className="text-5xl">{listing.item.icon}</div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="text-lg font-bold text-white">{listing.item.name}</h3>
                              <Badge className={`${getRarityColor(listing.item.rarity)} text-white border-0 text-xs`}>
                                {listing.item.rarity}
                              </Badge>
                            </div>
                            <p className="text-gray-300 text-sm mb-2">{listing.item.description}</p>
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-yellow-400 font-bold flex items-center gap-1">
                                <Coins className="h-4 w-4" />
                                {listing.price}
                              </span>
                              <span className="text-gray-400 text-xs">от {listing.sellerName}</span>
                            </div>
                            {listing.sellerId === user?.id ? (
                              <Button
                                onClick={() => handleRemoveListing(listing.id)}
                                size="sm"
                                variant="outline"
                                className="w-full border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                              >
                                <X className="mr-1 h-3 w-3" />
                                Снять с аукциона
                              </Button>
                            ) : (
                              <Button
                                onClick={() => handleBuyItem(listing.id)}
                                size="sm"
                                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold"
                              >
                                <Coins className="mr-1 h-3 w-3" />
                                Купить
                              </Button>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {mainTab === "map" && (
              <div className="bg-black/80 border-2 border-orange-600/50 rounded-lg p-8 backdrop-blur-sm">
                <div className="text-center py-16">
                  <Map className="h-20 w-20 text-orange-400 mx-auto mb-4" />
                  <h2 className="text-3xl font-bold text-white mb-2">Интерактивная карта</h2>
                  <p className="text-gray-300 text-lg">Здесь будет 3D карта мира</p>
                  <p className="text-gray-500 mt-2">Заготовка для будущей интерактивной карты</p>
                </div>
              </div>
            )}

            {mainTab === "global-chat" && (
              <div className="bg-black/80 border-2 border-orange-600/50 rounded-lg backdrop-blur-sm overflow-hidden">
                <div className="flex items-center gap-3 p-6 border-b border-gray-700">
                  <Globe className="h-8 w-8 text-orange-400" />
                  <div>
                    <h2 className="text-2xl font-bold text-white">Мировой чат</h2>
                    <p className="text-gray-400 text-sm">Общий чат для всех игроков</p>
                  </div>
                </div>

                <ScrollArea className="h-[500px] p-6">
                  <div className="space-y-3">
                    {globalChatMessages.length === 0 ? (
                      <div className="text-center py-16">
                        <MessageSquare className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-400 text-lg">Пока нет сообщений</p>
                        <p className="text-gray-500 text-sm mt-2">Начните общение с другими игроками</p>
                      </div>
                    ) : (
                      globalChatMessages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`p-4 rounded-lg ${
                            msg.userId === user?.id ? "bg-orange-900/30 border-l-4 border-orange-500" : "bg-gray-900/50"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-orange-400 font-semibold">{msg.username}</span>
                            <span className="text-gray-500 text-xs">{msg.timestamp.toLocaleTimeString()}</span>
                          </div>
                          <p className="text-white">{msg.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>

                <div className="p-4 border-t border-gray-700">
                  <div className="flex gap-2">
                    <Input
                      value={globalChatInput}
                      onChange={(e) => setGlobalChatInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault()
                          handleSendGlobalMessage()
                        }
                      }}
                      placeholder="Введите сообщение..."
                      className="flex-1 bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
                    />
                    <Button
                      onClick={handleSendGlobalMessage}
                      disabled={!globalChatInput.trim()}
                      className="bg-orange-500 hover:bg-orange-600 text-black font-bold"
                    >
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
        <DialogContent className="bg-gray-900 border-orange-600 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl text-white flex items-center gap-2">
              <Lock className="h-6 w-6 text-orange-400" />
              Вход в игру
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-gray-300">Для доступа к игре введите пароль, который назвал мастер игры</p>
            <div>
              <Label className="text-white mb-2 block">Пароль</Label>
              <Input
                type="password"
                value={passwordInput}
                onChange={(e) => {
                  setPasswordInput(e.target.value)
                  setPasswordError("")
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handlePasswordSubmit()
                  }
                }}
                placeholder="Введите пароль"
                className="bg-gray-800 border-gray-700 text-white"
              />
              {passwordError && <p className="text-red-400 text-sm mt-2">{passwordError}</p>}
            </div>
            <Button
              onClick={handlePasswordSubmit}
              disabled={!passwordInput}
              className="w-full bg-orange-500 hover:bg-orange-600 text-black font-bold"
            >
              Войти
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={adminPasswordDialogOpen} onOpenChange={setAdminPasswordDialogOpen}>
        <DialogContent className="bg-gray-900 border-orange-600 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl text-white flex items-center gap-2">
              <Key className="h-6 w-6 text-purple-400" />
              Управление паролем
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-gray-300">
              Установите пароль для вкладки "Подключиться к игре". Игроки смогут войти только после ввода пароля.
            </p>
            <div>
              <Label className="text-white mb-2 block">Пароль (оставьте пустым для снятия защиты)</Label>
              <Input
                type="text"
                value={adminPasswordInput}
                onChange={(e) => setAdminPasswordInput(e.target.value)}
                placeholder="Введите пароль"
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <Button
              onClick={handleAdminPasswordSave}
              className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold"
            >
              Сохранить
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
