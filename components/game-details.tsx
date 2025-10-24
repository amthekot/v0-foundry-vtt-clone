import { Clock, Users } from "lucide-react"

export function GameDetails() {
  return (
    <div className="bg-black/80 border-2 border-orange-600/50 rounded-lg p-6 backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-center justify-center mb-6">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-orange-600 to-transparent" />
        <h2 className="px-4 text-2xl font-bold text-white">Game Details</h2>
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-orange-600 to-transparent" />
      </div>

      {/* Details */}
      <div className="space-y-4">
        <div className="flex items-center text-white">
          <Clock className="mr-3 h-5 w-5 text-gray-400" />
          <span className="font-semibold">Next Session</span>
        </div>

        <div className="flex items-center justify-between text-white">
          <div className="flex items-center">
            <Users className="mr-3 h-5 w-5 text-gray-400" />
            <span className="font-semibold">Current Players</span>
          </div>
          <span className="text-lg font-bold">2 / 11</span>
        </div>
      </div>
    </div>
  )
}
