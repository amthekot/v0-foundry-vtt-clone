"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useGame, type Item } from "@/lib/game-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Plus, Send, Wand2, Shield, Package, Trash2, Edit, X } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export default function AdminPage() {
  const { user, isAuthenticated } = useAuth()
  const {
    tables,
    allItems,
    craftRecipes,
    stagingItems,
    createItem,
    updateItem,
    deleteItem,
    createCraftRecipe,
    deleteCraftRecipe,
    addToStaging,
    removeFromStaging,
    distributeStagingToLobby,
  } = useGame()
  const router = useRouter()

  const [itemName, setItemName] = useState("")
  const [itemNameColor, setItemNameColor] = useState("#ffffff")
  const [itemDescription, setItemDescription] = useState("")
  const [itemRarity, setItemRarity] = useState<"common" | "uncommon" | "rare" | "epic" | "legendary">("common")
  const [itemIcon, setItemIcon] = useState("")
  const [itemWeight, setItemWeight] = useState("1.0")
  const [itemCategory, setItemCategory] = useState("")

  const [recipeName, setRecipeName] = useState("")
  const [ingredient1, setIngredient1] = useState("")
  const [ingredient2, setIngredient2] = useState("")
  const [resultItemId, setResultItemId] = useState("")

  const [categoryFilter, setCategoryFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  const [stagingTableId, setStagingTableId] = useState("")
  const [stagingItemId, setStagingItemId] = useState("")
  const [stagingQuantity, setStagingQuantity] = useState("1")

  // Edit dialog state
  const [editingItem, setEditingItem] = useState<Item | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth")
      return
    }
    if (user?.role !== "admin") {
      router.push("/tables")
    }
  }, [isAuthenticated, user, router])

  const handleCreateItem = () => {
    if (!itemName || !itemDescription || !itemIcon || !itemCategory) {
      alert("Заполните все обязательные поля")
      return
    }

    createItem({
      name: itemName,
      nameColor: itemNameColor,
      description: itemDescription,
      rarity: itemRarity,
      icon: itemIcon,
      weight: Number.parseFloat(itemWeight) || 1.0,
      category: itemCategory,
    })

    // Reset form
    setItemName("")
    setItemNameColor("#ffffff")
    setItemDescription("")
    setItemRarity("common")
    setItemIcon("")
    setItemWeight("1.0")
    setItemCategory("")

    alert("Предмет создан!")
  }

  const handleCreateRecipe = () => {
    if (!recipeName || !ingredient1 || !ingredient2 || !resultItemId) {
      alert("Заполните все поля рецепта")
      return
    }

    if (ingredient1 === ingredient2) {
      alert("Ингредиенты должны быть разными")
      return
    }

    createCraftRecipe({
      name: recipeName,
      ingredients: [
        { itemId: ingredient1, quantity: 1 },
        { itemId: ingredient2, quantity: 1 },
      ],
      resultItemId,
    })

    // Reset form
    setRecipeName("")
    setIngredient1("")
    setIngredient2("")
    setResultItemId("")

    alert("Рецепт крафта создан!")
  }

  const handleAddToStaging = () => {
    if (!stagingItemId) {
      alert("Выберите предмет")
      return
    }

    const quantity = Number.parseInt(stagingQuantity) || 1
    addToStaging(stagingItemId, quantity)
    setStagingItemId("")
    setStagingQuantity("1")
  }

  const handleDistribute = () => {
    if (!stagingTableId) {
      alert("Выберите стол")
      return
    }

    if (stagingItems.length === 0) {
      alert("Добавьте предметы в staging area")
      return
    }

    distributeStagingToLobby(stagingTableId)
    setStagingTableId("")
    alert("Предметы выданы в лобби!")
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

  const categories = Array.from(new Set(allItems.map((item) => item.category)))

  const filteredItems =
    categoryFilter === "all"
      ? allItems.filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
      : allItems.filter(
          (item) => item.category === categoryFilter && item.name.toLowerCase().includes(searchQuery.toLowerCase()),
        )

  // Get item by ID helper
  const getItemById = (id: string) => allItems.find((item) => item.id === id)

  if (!isAuthenticated || user?.role !== "admin") {
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
            <ArrowLeft className="mr-2 h-4 w-4" />К столам
          </Button>

          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-wide flex items-center gap-2 justify-center">
              <Shield className="h-8 w-8 text-orange-400" />
              Панель администратора
            </h1>
            <div className="w-12 h-1 bg-orange-500 mx-auto mt-1" />
          </div>

          <div className="w-[140px]" />
        </div>

        <div className="max-w-7xl mx-auto">
          <Tabs defaultValue="create" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-black/80 border-2 border-orange-600/50">
              <TabsTrigger value="create" className="data-[state=active]:bg-orange-500 data-[state=active]:text-black">
                <Plus className="mr-2 h-4 w-4" />
                Создать
              </TabsTrigger>
              <TabsTrigger value="recipes" className="data-[state=active]:bg-orange-500 data-[state=active]:text-black">
                <Wand2 className="mr-2 h-4 w-4" />
                Рецепты
              </TabsTrigger>
              <TabsTrigger value="items" className="data-[state=active]:bg-orange-500 data-[state=active]:text-black">
                <Package className="mr-2 h-4 w-4" />
                Предметы
              </TabsTrigger>
              <TabsTrigger value="staging" className="data-[state=active]:bg-orange-500 data-[state=active]:text-black">
                <Send className="mr-2 h-4 w-4" />
                Выдача
              </TabsTrigger>
            </TabsList>

            <TabsContent value="create">
              <div className="bg-black/80 border-2 border-orange-600/50 rounded-lg p-6 backdrop-blur-sm">
                <h2 className="text-2xl font-bold text-white mb-6">Создать новый предмет</h2>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="item-name" className="text-white">
                        Название предмета *
                      </Label>
                      <Input
                        id="item-name"
                        value={itemName}
                        onChange={(e) => setItemName(e.target.value)}
                        placeholder="Например: Легендарный меч"
                        className="bg-gray-800/90 border-gray-700 text-white"
                      />
                    </div>

                    <div>
                      <Label htmlFor="item-name-color" className="text-white">
                        Цвет названия
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          id="item-name-color"
                          type="color"
                          value={itemNameColor}
                          onChange={(e) => setItemNameColor(e.target.value)}
                          className="bg-gray-800/90 border-gray-700 w-20 h-10"
                        />
                        <Input
                          value={itemNameColor}
                          onChange={(e) => setItemNameColor(e.target.value)}
                          placeholder="#ffffff"
                          className="bg-gray-800/90 border-gray-700 text-white flex-1"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="item-description" className="text-white">
                      Описание *
                    </Label>
                    <Textarea
                      id="item-description"
                      value={itemDescription}
                      onChange={(e) => setItemDescription(e.target.value)}
                      placeholder="Описание предмета..."
                      className="bg-gray-800/90 border-gray-700 text-white"
                      rows={3}
                    />
                  </div>

                  <div className="grid md:grid-cols-4 gap-4">
                    <div>
                      <Label htmlFor="item-icon" className="text-white">
                        Иконка *
                      </Label>
                      <Input
                        id="item-icon"
                        value={itemIcon}
                        onChange={(e) => setItemIcon(e.target.value)}
                        placeholder="⚔️"
                        className="bg-gray-800/90 border-gray-700 text-white text-2xl text-center"
                      />
                    </div>

                    <div>
                      <Label htmlFor="item-weight" className="text-white">
                        Вес (кг)
                      </Label>
                      <Input
                        id="item-weight"
                        type="number"
                        step="0.1"
                        value={itemWeight}
                        onChange={(e) => setItemWeight(e.target.value)}
                        placeholder="1.0"
                        className="bg-gray-800/90 border-gray-700 text-white"
                      />
                    </div>

                    <div>
                      <Label htmlFor="item-category" className="text-white">
                        Категория *
                      </Label>
                      <Input
                        id="item-category"
                        value={itemCategory}
                        onChange={(e) => setItemCategory(e.target.value)}
                        placeholder="Оружие"
                        className="bg-gray-800/90 border-gray-700 text-white"
                      />
                    </div>

                    <div>
                      <Label htmlFor="item-rarity" className="text-white">
                        Редкость
                      </Label>
                      <Select value={itemRarity} onValueChange={(v: any) => setItemRarity(v)}>
                        <SelectTrigger className="bg-gray-800/90 border-gray-700 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="common">Common</SelectItem>
                          <SelectItem value="uncommon">Uncommon</SelectItem>
                          <SelectItem value="rare">Rare</SelectItem>
                          <SelectItem value="epic">Epic</SelectItem>
                          <SelectItem value="legendary">Legendary</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button
                    onClick={handleCreateItem}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-black font-bold h-12"
                  >
                    <Plus className="mr-2 h-5 w-5" />
                    Создать предмет
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="recipes">
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Create Recipe Form */}
                <div className="bg-black/80 border-2 border-orange-600/50 rounded-lg p-6 backdrop-blur-sm">
                  <h2 className="text-2xl font-bold text-white mb-6">Создать рецепт крафта</h2>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="recipe-name" className="text-white">
                        Название рецепта
                      </Label>
                      <Input
                        id="recipe-name"
                        value={recipeName}
                        onChange={(e) => setRecipeName(e.target.value)}
                        placeholder="Например: Огненный меч"
                        className="bg-gray-800/90 border-gray-700 text-white"
                      />
                    </div>

                    <div>
                      <Label htmlFor="ingredient-1" className="text-white">
                        Ингредиент 1
                      </Label>
                      <Select value={ingredient1} onValueChange={setIngredient1}>
                        <SelectTrigger className="bg-gray-800/90 border-gray-700 text-white">
                          <SelectValue placeholder="Выберите предмет" />
                        </SelectTrigger>
                        <SelectContent>
                          {allItems.map((item) => (
                            <SelectItem key={item.id} value={item.id}>
                              {item.icon} {item.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="ingredient-2" className="text-white">
                        Ингредиент 2
                      </Label>
                      <Select value={ingredient2} onValueChange={setIngredient2}>
                        <SelectTrigger className="bg-gray-800/90 border-gray-700 text-white">
                          <SelectValue placeholder="Выберите предмет" />
                        </SelectTrigger>
                        <SelectContent>
                          {allItems.map((item) => (
                            <SelectItem key={item.id} value={item.id}>
                              {item.icon} {item.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="result-item" className="text-white">
                        Результат крафта
                      </Label>
                      <Select value={resultItemId} onValueChange={setResultItemId}>
                        <SelectTrigger className="bg-gray-800/90 border-gray-700 text-white">
                          <SelectValue placeholder="Выберите предмет" />
                        </SelectTrigger>
                        <SelectContent>
                          {allItems.map((item) => (
                            <SelectItem key={item.id} value={item.id}>
                              {item.icon} {item.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <Button
                      onClick={handleCreateRecipe}
                      className="w-full bg-orange-500 hover:bg-orange-600 text-black font-bold h-12"
                    >
                      <Wand2 className="mr-2 h-5 w-5" />
                      Создать рецепт
                    </Button>
                  </div>
                </div>

                {/* Recipes List */}
                <div className="bg-black/80 border-2 border-orange-600/50 rounded-lg p-6 backdrop-blur-sm">
                  <h2 className="text-2xl font-bold text-white mb-6">Все рецепты ({craftRecipes.length})</h2>
                  <div className="space-y-3 max-h-[500px] overflow-y-auto">
                    {craftRecipes.length === 0 ? (
                      <p className="text-gray-400 text-center py-8">Рецепты не созданы</p>
                    ) : (
                      craftRecipes.map((recipe) => {
                        const ing1 = getItemById(recipe.ingredients[0]?.itemId)
                        const ing2 = getItemById(recipe.ingredients[1]?.itemId)
                        const result = getItemById(recipe.resultItemId)

                        return (
                          <Card key={recipe.id} className="bg-gray-900/80 border-gray-700 p-4">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1">
                                <h4 className="font-bold text-white mb-2">{recipe.name}</h4>
                                <div className="flex items-center gap-2 text-sm text-gray-300">
                                  <span>
                                    {ing1?.icon} {ing1?.name}
                                  </span>
                                  <span>+</span>
                                  <span>
                                    {ing2?.icon} {ing2?.name}
                                  </span>
                                  <span>→</span>
                                  <span className="font-bold text-orange-400">
                                    {result?.icon} {result?.name}
                                  </span>
                                </div>
                              </div>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => deleteCraftRecipe(recipe.id)}
                                className="text-red-400 hover:text-red-300 hover:bg-red-950"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </Card>
                        )
                      })
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="items">
              <div className="bg-black/80 border-2 border-orange-600/50 rounded-lg p-6 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">Все предметы ({allItems.length})</h2>

                  <div className="flex gap-3">
                    <Input
                      placeholder="Поиск..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-gray-800/90 border-gray-700 text-white w-48"
                    />
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger className="bg-gray-800/90 border-gray-700 text-white w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Все категории</SelectItem>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[600px] overflow-y-auto">
                  {filteredItems.map((item) => (
                    <Card key={item.id} className="bg-gray-900/80 border-gray-700 p-4">
                      <div className="flex items-start gap-3">
                        <span className="text-4xl">{item.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-bold truncate" style={{ color: item.nameColor }}>
                              {item.name}
                            </h4>
                            <Badge
                              className={`${getRarityColor(item.rarity)} text-white border-0 text-xs flex-shrink-0`}
                            >
                              {item.rarity}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-300 mb-2 line-clamp-2">{item.description}</p>
                          <div className="flex items-center gap-3 text-xs text-gray-400">
                            <span>⚖️ {item.weight} кг</span>
                            <span>📦 {item.category}</span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setEditingItem(item)
                              setEditDialogOpen(true)
                            }}
                            className="text-blue-400 hover:text-blue-300 hover:bg-blue-950 h-8 w-8 p-0"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              if (confirm(`Удалить предмет "${item.name}"?`)) {
                                deleteItem(item.id)
                              }
                            }}
                            className="text-red-400 hover:text-red-300 hover:bg-red-950 h-8 w-8 p-0"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="staging">
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Add to Staging */}
                <div className="bg-black/80 border-2 border-orange-600/50 rounded-lg p-6 backdrop-blur-sm">
                  <h2 className="text-2xl font-bold text-white mb-6">Подготовка к выдаче</h2>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="staging-item" className="text-white">
                        Выберите предмет
                      </Label>
                      <Select value={stagingItemId} onValueChange={setStagingItemId}>
                        <SelectTrigger className="bg-gray-800/90 border-gray-700 text-white">
                          <SelectValue placeholder="Выберите предмет" />
                        </SelectTrigger>
                        <SelectContent>
                          {allItems.map((item) => (
                            <SelectItem key={item.id} value={item.id}>
                              {item.icon} {item.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="staging-quantity" className="text-white">
                        Количество
                      </Label>
                      <Input
                        id="staging-quantity"
                        type="number"
                        min="1"
                        value={stagingQuantity}
                        onChange={(e) => setStagingQuantity(e.target.value)}
                        className="bg-gray-800/90 border-gray-700 text-white"
                      />
                    </div>

                    <Button
                      onClick={handleAddToStaging}
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold h-12"
                    >
                      <Plus className="mr-2 h-5 w-5" />
                      Добавить в staging
                    </Button>

                    <div className="border-t border-gray-700 pt-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-white">Staging Area</h3>
                        {stagingItems.length > 0 && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              if (confirm("Очистить staging area?")) {
                                stagingItems.forEach((si) => removeFromStaging(si.itemId))
                              }
                            }}
                            className="text-red-400 hover:text-red-300"
                          >
                            Очистить
                          </Button>
                        )}
                      </div>

                      <div className="space-y-2 max-h-[300px] overflow-y-auto mb-4">
                        {stagingItems.length === 0 ? (
                          <p className="text-gray-400 text-center py-8">Staging area пуста</p>
                        ) : (
                          stagingItems.map((stagingItem) => {
                            const item = getItemById(stagingItem.itemId)
                            if (!item) return null

                            return (
                              <Card key={stagingItem.itemId} className="bg-gray-900/80 border-gray-700 p-3">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <span className="text-2xl">{item.icon}</span>
                                    <div>
                                      <h4 className="font-bold text-white">{item.name}</h4>
                                      <p className="text-sm text-gray-400">Количество: {stagingItem.quantity}</p>
                                    </div>
                                  </div>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => removeFromStaging(stagingItem.itemId)}
                                    className="text-red-400 hover:text-red-300"
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              </Card>
                            )
                          })
                        )}
                      </div>

                      <div>
                        <Label htmlFor="staging-table" className="text-white">
                          Выберите стол для выдачи
                        </Label>
                        <Select value={stagingTableId} onValueChange={setStagingTableId}>
                          <SelectTrigger className="bg-gray-800/90 border-gray-700 text-white">
                            <SelectValue placeholder="Выберите стол" />
                          </SelectTrigger>
                          <SelectContent>
                            {tables.map((table) => (
                              <SelectItem key={table.id} value={table.id}>
                                {table.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <Button
                        onClick={handleDistribute}
                        disabled={stagingItems.length === 0}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-black font-bold h-12 mt-4"
                      >
                        <Send className="mr-2 h-5 w-5" />
                        Выдать в лобби
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Info Panel */}
                <div className="bg-black/80 border-2 border-orange-600/50 rounded-lg p-6 backdrop-blur-sm">
                  <h2 className="text-2xl font-bold text-white mb-6">Информация</h2>
                  <div className="space-y-4 text-gray-300">
                    <div className="bg-gray-900/50 border border-gray-700 rounded p-4">
                      <h3 className="font-bold text-white mb-2">Как использовать Staging Area:</h3>
                      <ol className="list-decimal list-inside space-y-2 text-sm">
                        <li>Выберите предмет и количество</li>
                        <li>Добавьте предметы в staging area</li>
                        <li>Повторите для всех нужных предметов</li>
                        <li>Выберите стол для выдачи</li>
                        <li>Нажмите "Выдать в лобби"</li>
                      </ol>
                    </div>

                    <div className="bg-gray-900/50 border border-gray-700 rounded p-4">
                      <h3 className="font-bold text-white mb-2">Статистика:</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Всего предметов:</span>
                          <span className="font-bold text-orange-400">{allItems.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Категорий:</span>
                          <span className="font-bold text-orange-400">{categories.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Рецептов крафта:</span>
                          <span className="font-bold text-orange-400">{craftRecipes.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>В staging:</span>
                          <span className="font-bold text-orange-400">{stagingItems.length}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="bg-gray-900 border-orange-600 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle>Редактировать предмет</DialogTitle>
            <DialogDescription className="text-gray-400">Измените свойства предмета</DialogDescription>
          </DialogHeader>
          {editingItem && (
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-white">Название</Label>
                  <Input
                    value={editingItem.name}
                    onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <div>
                  <Label className="text-white">Цвет названия</Label>
                  <Input
                    type="color"
                    value={editingItem.nameColor}
                    onChange={(e) => setEditingItem({ ...editingItem, nameColor: e.target.value })}
                    className="bg-gray-800 border-gray-700 h-10"
                  />
                </div>
              </div>

              <div>
                <Label className="text-white">Описание</Label>
                <Textarea
                  value={editingItem.description}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              <div className="grid md:grid-cols-4 gap-4">
                <div>
                  <Label className="text-white">Иконка</Label>
                  <Input
                    value={editingItem.icon}
                    onChange={(e) => setEditingItem({ ...editingItem, icon: e.target.value })}
                    className="bg-gray-800 border-gray-700 text-white text-2xl text-center"
                  />
                </div>
                <div>
                  <Label className="text-white">Вес</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={editingItem.weight}
                    onChange={(e) => setEditingItem({ ...editingItem, weight: Number.parseFloat(e.target.value) })}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <div>
                  <Label className="text-white">Категория</Label>
                  <Input
                    value={editingItem.category}
                    onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <div>
                  <Label className="text-white">Редкость</Label>
                  <Select
                    value={editingItem.rarity}
                    onValueChange={(v: any) => setEditingItem({ ...editingItem, rarity: v })}
                  >
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="common">Common</SelectItem>
                      <SelectItem value="uncommon">Uncommon</SelectItem>
                      <SelectItem value="rare">Rare</SelectItem>
                      <SelectItem value="epic">Epic</SelectItem>
                      <SelectItem value="legendary">Legendary</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={() => {
                    updateItem(editingItem.id, editingItem)
                    setEditDialogOpen(false)
                    setEditingItem(null)
                  }}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-black font-bold"
                >
                  Сохранить
                </Button>
                <Button
                  onClick={() => {
                    setEditDialogOpen(false)
                    setEditingItem(null)
                  }}
                  variant="outline"
                  className="flex-1 border-gray-700 text-white hover:bg-gray-800"
                >
                  Отмена
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
