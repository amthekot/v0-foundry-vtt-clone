"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"

export default function Page() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth")
    } else {
      router.push("/tables")
    }
  }, [isAuthenticated, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="text-white text-xl">Загрузка...</div>
    </div>
  )
}
