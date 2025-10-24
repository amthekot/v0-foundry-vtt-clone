"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type Table = {
  id: string
  name: string
  players: number
  maxPlayers: number
  description: string
  password?: string // Added password field for table protection
}

type Item = {
  id: string
  name: string
  nameColor: string
  description: string
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary"
  icon: string
  weight: number
  category: string
}

type LobbyItem = Item & {
  tableId: string
}

type InventoryItem = Item & {
  userId: string
  tableId: string
  quantity: number
}

type LogEntry = {
  id: string
  timestamp: Date
  message: string
  type: "info" | "success" | "warning"
  tableId: string
}

type ChatMessage = {
  id: string
  userId: string
  username: string
  message: string
  timestamp: Date
  tableId: string // Added tableId to filter messages by table
  item?: Item
}

type GlobalChatMessage = {
  id: string
  userId: string
  username: string
  message: string
  timestamp: Date
}

type CraftRecipe = {
  id: string
  name: string
  ingredients: { itemId: string; quantity: number }[]
  resultItemId: string
}

type StagingItem = {
  itemId: string
  quantity: number
}

type ActivePlayer = {
  userId: string
  username: string
  role: "admin" | "player"
  tableId: string
  joinedAt: Date
}

type AuctionListing = {
  id: string
  sellerId: string
  sellerName: string
  item: Item
  price: number
  tableId: string
  listedAt: Date
}

const MOCK_TABLES: Table[] = [
  {
    id: "1",
    name: "Сфера",
    players: 0,
    maxPlayers: 0,
    description: "Основной игровой стол для приключений",
  },
  {
    id: "2",
    name: "2 Стол",
    players: 0,
    maxPlayers: 0,
    description: "Дополнительный стол для новых кампаний",
  },
]

const INITIAL_LOBBY_ITEMS: LobbyItem[] = [
  {
    id: "1",
    tableId: "1",
    name: "Меч воина",
    nameColor: "#ff6b6b",
    description: "Острый меч с рунами силы",
    rarity: "rare",
    icon: "⚔️",
    weight: 3.5,
    category: "Оружие",
  },
  {
    id: "2",
    tableId: "1",
    name: "Зелье здоровья",
    nameColor: "#51cf66",
    description: "Восстанавливает 50 HP",
    rarity: "common",
    icon: "🧪",
    weight: 0.5,
    category: "Зелья",
  },
]

const INITIAL_ALL_ITEMS: Item[] = [
  {
    id: "1",
    name: "Меч воина",
    nameColor: "#ff6b6b",
    description: "Острый меч с рунами силы",
    rarity: "rare",
    icon: "⚔️",
    weight: 3.5,
    category: "Оружие",
  },
  {
    id: "2",
    name: "Зелье здоровья",
    nameColor: "#51cf66",
    description: "Восстанавливает 50 HP",
    rarity: "common",
    icon: "🧪",
    weight: 0.5,
    category: "Зелья",
  },
  {
    id: "3",
    name: "Щит защитника",
    nameColor: "#4dabf7",
    description: "Прочный щит из драконьей чешуи",
    rarity: "epic",
    icon: "🛡️",
    weight: 5.0,
    category: "Броня",
  },
]

type GameContextType = {
  tables: Table[]
  currentTable: string | null
  setCurrentTable: (tableId: string) => void
  lobbyItems: LobbyItem[]
  inventory: InventoryItem[]
  eventLog: LogEntry[]
  chatMessages: ChatMessage[]
  globalChatMessages: GlobalChatMessage[]
  allItems: Item[]
  craftRecipes: CraftRecipe[]
  stagingItems: StagingItem[]
  activePlayers: ActivePlayer[]
  auctionListings: AuctionListing[]
  pickupItem: (itemId: string, userId: string, username: string) => void
  sendChatMessage: (userId: string, username: string, message: string, tableId: string, item?: Item) => void
  sendGlobalChatMessage: (userId: string, username: string, message: string) => void
  addEventLog: (message: string, type: "info" | "success" | "warning", tableId?: string) => void
  createItem: (item: Omit<Item, "id">) => Item
  updateItem: (itemId: string, updates: Partial<Item>) => void
  deleteItem: (itemId: string) => void
  addItemToLobby: (itemId: string, tableId: string, quantity?: number) => void
  createCraftRecipe: (recipe: Omit<CraftRecipe, "id">) => void
  deleteCraftRecipe: (recipeId: string) => void
  addToStaging: (itemId: string, quantity: number) => void
  removeFromStaging: (itemId: string) => void
  clearStaging: () => void
  distributeStagingToLobby: (tableId: string) => void
  setTablePassword: (tableId: string, password: string) => void
  checkTablePassword: (tableId: string, password: string) => boolean
  getTablePassword: (tableId: string) => string | undefined
  joinTable: (userId: string, username: string, role: "admin" | "player", tableId: string) => void
  leaveTable: (userId: string, tableId: string) => void
  kickPlayer: (userId: string, tableId: string) => void
  listItemOnAuction: (userId: string, username: string, itemId: string, price: number, tableId: string) => boolean
  buyAuctionItem: (buyerId: string, buyerName: string, listingId: string) => boolean
  removeAuctionListing: (listingId: string, userId: string) => boolean
}

const GameContext = createContext<GameContextType | undefined>(undefined)

export function GameProvider({ children }: { children: ReactNode }) {
  const [currentTable, setCurrentTable] = useState<string | null>(null)
  const [lobbyItems, setLobbyItems] = useState<LobbyItem[]>([])
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [allItems, setAllItems] = useState<Item[]>([])
  const [craftRecipes, setCraftRecipes] = useState<CraftRecipe[]>([])
  const [stagingItems, setStagingItems] = useState<StagingItem[]>([])
  const [activePlayers, setActivePlayers] = useState<ActivePlayer[]>([])
  const [auctionListings, setAuctionListings] = useState<AuctionListing[]>([])
  const [globalChatMessages, setGlobalChatMessages] = useState<GlobalChatMessage[]>([])
  const [eventLog, setEventLog] = useState<LogEntry[]>([
    {
      id: "1",
      timestamp: new Date(),
      message: "Добро пожаловать в игру!",
      type: "info",
    },
  ])
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [tablePasswords, setTablePasswords] = useState<{ [key: string]: string }>({})

  useEffect(() => {
    const savedItems = localStorage.getItem("foundry_items")
    const savedRecipes = localStorage.getItem("foundry_recipes")
    const savedLobbyItems = localStorage.getItem("foundry_lobby_items")
    const savedPasswords = localStorage.getItem("foundry_table_passwords")
    const savedActivePlayers = localStorage.getItem("foundry_active_players")
    const savedAuctionListings = localStorage.getItem("foundry_auction_listings")
    const savedGlobalChat = localStorage.getItem("foundry_global_chat")
    const savedChatMessages = localStorage.getItem("foundry_chat_messages") // Added chat messages loading

    if (savedItems) {
      setAllItems(JSON.parse(savedItems))
    } else {
      setAllItems(INITIAL_ALL_ITEMS)
      localStorage.setItem("foundry_items", JSON.stringify(INITIAL_ALL_ITEMS))
    }

    if (savedRecipes) {
      setCraftRecipes(JSON.parse(savedRecipes))
    }

    if (savedLobbyItems) {
      setLobbyItems(JSON.parse(savedLobbyItems))
    } else {
      setLobbyItems(INITIAL_LOBBY_ITEMS)
      localStorage.setItem("foundry_lobby_items", JSON.stringify(INITIAL_LOBBY_ITEMS))
    }

    if (savedPasswords) {
      setTablePasswords(JSON.parse(savedPasswords))
    }

    if (savedActivePlayers) {
      setActivePlayers(JSON.parse(savedActivePlayers))
    }

    if (savedAuctionListings) {
      setAuctionListings(JSON.parse(savedAuctionListings))
    }

    if (savedGlobalChat) {
      const parsed = JSON.parse(savedGlobalChat)
      setGlobalChatMessages(parsed.map((msg: any) => ({ ...msg, timestamp: new Date(msg.timestamp) })))
    }

    if (savedChatMessages) {
      const parsed = JSON.parse(savedChatMessages)
      setChatMessages(parsed.map((msg: any) => ({ ...msg, timestamp: new Date(msg.timestamp) })))
    }
  }, [])

  useEffect(() => {
    if (allItems.length > 0) {
      localStorage.setItem("foundry_items", JSON.stringify(allItems))
    }
  }, [allItems])

  useEffect(() => {
    localStorage.setItem("foundry_recipes", JSON.stringify(craftRecipes))
  }, [craftRecipes])

  useEffect(() => {
    localStorage.setItem("foundry_lobby_items", JSON.stringify(lobbyItems))
  }, [lobbyItems])

  useEffect(() => {
    localStorage.setItem("foundry_table_passwords", JSON.stringify(tablePasswords))
  }, [tablePasswords])

  useEffect(() => {
    localStorage.setItem("foundry_active_players", JSON.stringify(activePlayers))
  }, [activePlayers])

  useEffect(() => {
    localStorage.setItem("foundry_auction_listings", JSON.stringify(auctionListings))
  }, [auctionListings])

  useEffect(() => {
    localStorage.setItem("foundry_global_chat", JSON.stringify(globalChatMessages))
  }, [globalChatMessages])

  useEffect(() => {
    localStorage.setItem("foundry_chat_messages", JSON.stringify(chatMessages))
  }, [chatMessages])

  const pickupItem = (itemId: string, userId: string, username: string) => {
    const item = lobbyItems.find((i) => i.id === itemId)
    if (!item) return

    const tableId = item.tableId

    setLobbyItems((prev) => prev.filter((i) => i.id !== itemId))

    setInventory((prev) => {
      const existing = prev.find((i) => i.id === itemId && i.userId === userId && i.tableId === tableId)
      if (existing) {
        return prev.map((i) =>
          i.id === itemId && i.userId === userId && i.tableId === tableId ? { ...i, quantity: i.quantity + 1 } : i,
        )
      }
      return [...prev, { ...item, userId, tableId, quantity: 1 }]
    })

    setEventLog((prev) => [
      {
        id: Date.now().toString(),
        timestamp: new Date(),
        message: `${username} поднял предмет: ${item.name}`,
        type: "success",
        tableId,
      },
      ...prev,
    ])
  }

  const sendChatMessage = (userId: string, username: string, message: string, tableId: string, item?: Item) => {
    // Added tableId parameter
    setChatMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        userId,
        username,
        message,
        tableId, // Include tableId in message
        timestamp: new Date(),
        item,
      },
    ])
  }

  const sendGlobalChatMessage = (userId: string, username: string, message: string) => {
    setGlobalChatMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        userId,
        username,
        message,
        timestamp: new Date(),
      },
    ])
  }

  const addEventLog = (message: string, type: "info" | "success" | "warning", tableId?: string) => {
    setEventLog((prev) => [
      {
        id: Date.now().toString(),
        timestamp: new Date(),
        message,
        type,
        tableId: tableId || "",
      },
      ...prev,
    ])
  }

  const createItem = (itemData: Omit<Item, "id">): Item => {
    const newItem: Item = {
      id: Date.now().toString(),
      ...itemData,
    }
    setAllItems((prev) => [...prev, newItem])
    return newItem
  }

  const updateItem = (itemId: string, updates: Partial<Item>) => {
    setAllItems((prev) => prev.map((item) => (item.id === itemId ? { ...item, ...updates } : item)))
  }

  const deleteItem = (itemId: string) => {
    setAllItems((prev) => prev.filter((item) => item.id !== itemId))
    // Also remove from staging if present
    setStagingItems((prev) => prev.filter((si) => si.itemId !== itemId))
  }

  const addItemToLobby = (itemId: string, tableId: string, quantity = 1) => {
    const item = allItems.find((i) => i.id === itemId)
    if (!item) return

    for (let i = 0; i < quantity; i++) {
      const lobbyItem: LobbyItem = {
        ...item,
        tableId,
        id: `${itemId}-${Date.now()}-${i}`,
      }
      setLobbyItems((prev) => [...prev, lobbyItem])
    }

    setEventLog((prev) => [
      {
        id: Date.now().toString(),
        timestamp: new Date(),
        message: `Мастер игры добавил предмет в лобби: ${item.name} (x${quantity})`,
        type: "info",
        tableId,
      },
      ...prev,
    ])
  }

  const createCraftRecipe = (recipe: Omit<CraftRecipe, "id">) => {
    const newRecipe: CraftRecipe = {
      id: Date.now().toString(),
      ...recipe,
    }
    setCraftRecipes((prev) => [...prev, newRecipe])
  }

  const deleteCraftRecipe = (recipeId: string) => {
    setCraftRecipes((prev) => prev.filter((r) => r.id !== recipeId))
  }

  const addToStaging = (itemId: string, quantity: number) => {
    setStagingItems((prev) => {
      const existing = prev.find((si) => si.itemId === itemId)
      if (existing) {
        return prev.map((si) => (si.itemId === itemId ? { ...si, quantity: si.quantity + quantity } : si))
      }
      return [...prev, { itemId, quantity }]
    })
  }

  const removeFromStaging = (itemId: string) => {
    setStagingItems((prev) => prev.filter((si) => si.itemId !== itemId))
  }

  const clearStaging = () => {
    setStagingItems([])
  }

  const distributeStagingToLobby = (tableId: string) => {
    stagingItems.forEach((stagingItem) => {
      addItemToLobby(stagingItem.itemId, tableId, stagingItem.quantity)
    })
    clearStaging()
  }

  const setTablePassword = (tableId: string, password: string) => {
    setTablePasswords((prev) => ({ ...prev, [tableId]: password }))
  }

  const checkTablePassword = (tableId: string, password: string): boolean => {
    const storedPassword = tablePasswords[tableId]
    if (!storedPassword) return true // No password set, allow access
    return storedPassword === password
  }

  const getTablePassword = (tableId: string): string | undefined => {
    return tablePasswords[tableId]
  }

  const joinTable = (userId: string, username: string, role: "admin" | "player", tableId: string) => {
    // Remove player from any other tables first
    setActivePlayers((prev) => prev.filter((p) => p.userId !== userId))

    // Add player to this table
    const newPlayer: ActivePlayer = {
      userId,
      username,
      role,
      tableId,
      joinedAt: new Date(),
    }
    setActivePlayers((prev) => [...prev, newPlayer])

    setEventLog((prev) => [
      {
        id: Date.now().toString(),
        timestamp: new Date(),
        message: `${username} присоединился к игре`,
        type: "info",
        tableId,
      },
      ...prev,
    ])
  }

  const leaveTable = (userId: string, tableId: string) => {
    const player = activePlayers.find((p) => p.userId === userId && p.tableId === tableId)
    if (player) {
      setActivePlayers((prev) => prev.filter((p) => p.userId !== userId))

      setEventLog((prev) => [
        {
          id: Date.now().toString(),
          timestamp: new Date(),
          message: `${player.username} покинул игру`,
          type: "warning",
          tableId,
        },
        ...prev,
      ])
    }
  }

  const kickPlayer = (userId: string, tableId: string) => {
    const player = activePlayers.find((p) => p.userId === userId && p.tableId === tableId)
    if (player) {
      setActivePlayers((prev) => prev.filter((p) => p.userId !== userId))

      setEventLog((prev) => [
        {
          id: Date.now().toString(),
          timestamp: new Date(),
          message: `${player.username} был исключен из игры`,
          type: "warning",
          tableId,
        },
        ...prev,
      ])
    }
  }

  const listItemOnAuction = (
    userId: string,
    username: string,
    itemId: string,
    price: number,
    tableId: string,
  ): boolean => {
    const inventoryItem = inventory.find((i) => i.id === itemId && i.userId === userId && i.tableId === tableId)
    if (!inventoryItem || inventoryItem.quantity < 1) {
      return false
    }

    // Remove one item from inventory
    setInventory((prev) =>
      prev
        .map((i) =>
          i.id === itemId && i.userId === userId && i.tableId === tableId ? { ...i, quantity: i.quantity - 1 } : i,
        )
        .filter((i) => i.quantity > 0),
    )

    // Create auction listing
    const listing: AuctionListing = {
      id: Date.now().toString(),
      sellerId: userId,
      sellerName: username,
      item: inventoryItem,
      price,
      tableId,
      listedAt: new Date(),
    }

    setAuctionListings((prev) => [...prev, listing])

    setEventLog((prev) => [
      {
        id: Date.now().toString(),
        timestamp: new Date(),
        message: `${username} выставил на аукцион: ${inventoryItem.name} за ${price} золота`,
        type: "info",
        tableId,
      },
      ...prev,
    ])

    return true
  }

  const buyAuctionItem = (buyerId: string, buyerName: string, listingId: string): boolean => {
    const listing = auctionListings.find((l) => l.id === listingId)
    if (!listing || listing.sellerId === buyerId) {
      return false
    }

    const tableId = listing.tableId

    // Remove listing
    setAuctionListings((prev) => prev.filter((l) => l.id !== listingId))

    // Add item to buyer's inventory
    setInventory((prev) => {
      const existing = prev.find((i) => i.id === listing.item.id && i.userId === buyerId && i.tableId === tableId)
      if (existing) {
        return prev.map((i) =>
          i.id === listing.item.id && i.userId === buyerId && i.tableId === tableId
            ? { ...i, quantity: i.quantity + 1 }
            : i,
        )
      }
      return [...prev, { ...listing.item, userId: buyerId, tableId, quantity: 1 }]
    })

    setEventLog((prev) => [
      {
        id: Date.now().toString(),
        timestamp: new Date(),
        message: `${buyerName} купил ${listing.item.name} у ${listing.sellerName} за ${listing.price} золота`,
        type: "success",
        tableId,
      },
      ...prev,
    ])

    return true
  }

  const removeAuctionListing = (listingId: string, userId: string): boolean => {
    const listing = auctionListings.find((l) => l.id === listingId && l.sellerId === userId)
    if (!listing) {
      return false
    }

    const tableId = listing.tableId

    // Remove listing
    setAuctionListings((prev) => prev.filter((l) => l.id !== listingId))

    // Return item to seller's inventory
    setInventory((prev) => {
      const existing = prev.find((i) => i.id === listing.item.id && i.userId === userId && i.tableId === tableId)
      if (existing) {
        return prev.map((i) =>
          i.id === listing.item.id && i.userId === userId && i.tableId === tableId
            ? { ...i, quantity: i.quantity + 1 }
            : i,
        )
      }
      return [...prev, { ...listing.item, userId, tableId, quantity: 1 }]
    })

    setEventLog((prev) => [
      {
        id: Date.now().toString(),
        timestamp: new Date(),
        message: `${listing.sellerName} снял с аукциона: ${listing.item.name}`,
        type: "info",
        tableId,
      },
      ...prev,
    ])

    return true
  }

  return (
    <GameContext.Provider
      value={{
        tables: MOCK_TABLES,
        currentTable,
        setCurrentTable,
        lobbyItems,
        inventory,
        eventLog,
        chatMessages,
        globalChatMessages,
        allItems,
        craftRecipes,
        stagingItems,
        activePlayers,
        auctionListings,
        pickupItem,
        sendChatMessage,
        sendGlobalChatMessage,
        addEventLog,
        createItem,
        updateItem,
        deleteItem,
        addItemToLobby,
        createCraftRecipe,
        deleteCraftRecipe,
        addToStaging,
        removeFromStaging,
        clearStaging,
        distributeStagingToLobby,
        setTablePassword,
        checkTablePassword,
        getTablePassword,
        joinTable,
        leaveTable,
        kickPlayer,
        listItemOnAuction,
        buyAuctionItem,
        removeAuctionListing,
      }}
    >
      {children}
    </GameContext.Provider>
  )
}

export function useGame() {
  const context = useContext(GameContext)
  if (context === undefined) {
    throw new Error("useGame must be used within a GameProvider")
  }
  return context
}

export type { Item, CraftRecipe, StagingItem, ActivePlayer, AuctionListing }
