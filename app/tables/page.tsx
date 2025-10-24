"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useGame } from "@/lib/game-context"
import { Button } from "@/components/ui/button"
import { LogOut, ArrowRight } from "lucide-react"

export default function TablesPage() {
  const { user, logout, isAuthenticated } = useAuth()
  const { tables, setCurrentTable } = useGame()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth")
    }
  }, [isAuthenticated, router])

  const handleJoinTable = (tableId: string) => {
    setCurrentTable(tableId)
    router.push(`/game/${tableId}`)
  }

  const handleLogout = () => {
    logout()
    router.push("/auth")
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/dark-fantasy-forest-path-atmospheric-misty.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="logo-graffiti mb-4">ТРЕТИЙ ГЛАЗ</h1>
          <div className="w-16 h-1 bg-gradient-to-r from-cyan-500 to-orange-500 mx-auto mb-4" />
          <div className="flex items-center justify-center gap-4 text-white">
            <span className="text-lg">
              Добро пожаловать, <span className="font-bold text-cyan-400">{user?.username}</span>
            </span>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="border-cyan-500 text-white hover:bg-cyan-500 hover:text-black bg-transparent"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Выйти
            </Button>
          </div>
        </header>

        {/* Tables Grid */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-black/90 border-2 border-cyan-500/50 rounded-lg p-6 backdrop-blur-sm mb-6 shadow-[0_0_30px_rgba(0,217,255,0.2)]">
            <div className="flex items-center justify-center mb-6">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
              <h2 className="px-4 text-2xl font-bold text-white">Выберите стол</h2>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {tables.map((table) => (
                <div
                  key={table.id}
                  className="bg-gray-900/80 border-2 border-gray-700 hover:border-cyan-500 rounded-lg p-6 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(0,217,255,0.4)]"
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-2xl font-bold text-cyan-400">{table.name}</h3>
                  </div>

                  <p className="text-gray-300 mb-6 leading-relaxed">{table.description}</p>

                  <Button
                    onClick={() => handleJoinTable(table.id)}
                    className="w-full bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-black font-bold h-12 shadow-[0_0_15px_rgba(0,217,255,0.5)]"
                  >
                    Присоединиться
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Info Panel */}
          <div className="bg-black/90 border-2 border-cyan-500/50 rounded-lg p-6 backdrop-blur-sm shadow-[0_0_30px_rgba(0,217,255,0.2)]">
            <div className="flex items-center justify-center mb-4">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
              <h2 className="px-4 text-xl font-bold text-white">Информация</h2>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
            </div>
            <p className="text-white text-center leading-relaxed">
              Выберите стол для начала игры. В лобби вы сможете получать предметы от мастера игры, управлять своим
              инвентарем и общаться с другими игроками.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
