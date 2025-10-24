"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { KeyRound, Lock } from "lucide-react"

export function ReturnToSetup() {
  const [password, setPassword] = useState("")

  return (
    <div className="bg-black/80 border-2 border-orange-600/50 rounded-lg p-6 backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-center justify-center mb-6">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-orange-600 to-transparent" />
        <h2 className="px-4 text-2xl font-bold text-white">Return to Setup</h2>
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-orange-600 to-transparent" />
      </div>

      {/* Form */}
      <div className="space-y-4">
        {/* Password Input */}
        <div className="space-y-2">
          <Label htmlFor="setup-password" className="sr-only">
            Administrator Password
          </Label>
          <div className="relative">
            <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              id="setup-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-gray-800/90 border-gray-700 text-white placeholder:text-gray-500 pl-10 h-12"
            />
          </div>
        </div>

        {/* Submit Button */}
        <Button className="w-full bg-orange-500 hover:bg-orange-600 text-black font-bold h-12 text-base">
          <Lock className="mr-2 h-5 w-5" />
          RETURN TO SETUP
        </Button>
      </div>
    </div>
  )
}
