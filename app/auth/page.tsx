"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, KeyRound, Check, AlertCircle, UserPlus } from "lucide-react"

export default function AuthPage() {
  // Login state
  const [loginUsername, setLoginUsername] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [loginError, setLoginError] = useState("")

  const [registerUsername, setRegisterUsername] = useState("")
  const [registerPassword, setRegisterPassword] = useState("")
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("")
  const [registerError, setRegisterError] = useState("")
  const [registerSuccess, setRegisterSuccess] = useState(false)

  const { login, register } = useAuth()
  const router = useRouter()

  const handleLogin = () => {
    setLoginError("")

    if (!loginUsername || !loginPassword) {
      setLoginError("Пожалуйста, заполните все поля")
      return
    }

    const success = login(loginUsername, loginPassword)

    if (success) {
      router.push("/tables")
    } else {
      setLoginError("Неверное имя пользователя или пароль")
    }
  }

  const handleRegister = () => {
    setRegisterError("")
    setRegisterSuccess(false)

    if (!registerUsername || !registerPassword || !registerConfirmPassword) {
      setRegisterError("Пожалуйста, заполните все поля")
      return
    }

    if (registerPassword !== registerConfirmPassword) {
      setRegisterError("Пароли не совпадают")
      return
    }

    const result = register(registerUsername, registerPassword)

    if (result.success) {
      setRegisterSuccess(true)
      setRegisterUsername("")
      setRegisterPassword("")
      setRegisterConfirmPassword("")
      setTimeout(() => {
        setRegisterSuccess(false)
      }, 3000)
    } else {
      setRegisterError(result.error || "Ошибка регистрации")
    }
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
      <div className="relative z-10 container mx-auto px-4 py-8 flex items-center justify-center min-h-screen">
        <div className="w-full max-w-md">
          {/* Header */}
          <header className="text-center mb-8">
            <h1 className="logo-graffiti mb-4">ТРЕТИЙ ГЛАЗ</h1>
            <div className="w-16 h-1 bg-gradient-to-r from-cyan-500 to-orange-500 mx-auto" />
          </header>

          <div className="bg-black/90 border-2 border-cyan-500/50 rounded-lg p-6 backdrop-blur-sm shadow-[0_0_30px_rgba(0,217,255,0.3)]">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Вход</TabsTrigger>
                <TabsTrigger value="register">Регистрация</TabsTrigger>
              </TabsList>

              {/* Login Tab */}
              <TabsContent value="login">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-username" className="text-white">
                      Имя пользователя
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="login-username"
                        type="text"
                        placeholder="Введите имя пользователя"
                        value={loginUsername}
                        onChange={(e) => setLoginUsername(e.target.value)}
                        className="bg-gray-800/90 border-gray-700 text-white placeholder:text-gray-500 pl-10 h-12"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password" className="text-white">
                      Пароль
                    </Label>
                    <div className="relative">
                      <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="login-password"
                        type="password"
                        placeholder="Введите пароль"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                        className="bg-gray-800/90 border-gray-700 text-white placeholder:text-gray-500 pl-10 h-12"
                      />
                    </div>
                  </div>

                  {loginError && (
                    <div className="flex items-center gap-2 text-red-400 text-sm bg-red-950/50 border border-red-800 rounded p-3">
                      <AlertCircle className="h-4 w-4 flex-shrink-0" />
                      <span>{loginError}</span>
                    </div>
                  )}

                  <Button
                    onClick={handleLogin}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-black font-bold h-12 text-base"
                  >
                    <Check className="mr-2 h-5 w-5" />
                    ВОЙТИ
                  </Button>

                  <div className="bg-gray-900/50 border border-gray-700 rounded p-3">
                    <p className="text-sm text-white">
                      <span className="font-semibold">По умолчанию:</span>
                      <br />
                      Admin: <code className="bg-gray-800 px-2 py-1 rounded text-orange-400">admin / 1111</code>
                      <br />
                      Players: <code className="bg-gray-800 px-2 py-1 rounded text-orange-400">foundry</code>
                    </p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="register">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-username" className="text-white">
                      Имя пользователя
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="register-username"
                        type="text"
                        placeholder="Введите имя пользователя"
                        value={registerUsername}
                        onChange={(e) => setRegisterUsername(e.target.value)}
                        className="bg-gray-800/90 border-gray-700 text-white placeholder:text-gray-500 pl-10 h-12"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-password" className="text-white">
                      Пароль
                    </Label>
                    <div className="relative">
                      <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="register-password"
                        type="password"
                        placeholder="Введите пароль"
                        value={registerPassword}
                        onChange={(e) => setRegisterPassword(e.target.value)}
                        className="bg-gray-800/90 border-gray-700 text-white placeholder:text-gray-500 pl-10 h-12"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-confirm-password" className="text-white">
                      Подтвердите пароль
                    </Label>
                    <div className="relative">
                      <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="register-confirm-password"
                        type="password"
                        placeholder="Повторите пароль"
                        value={registerConfirmPassword}
                        onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleRegister()}
                        className="bg-gray-800/90 border-gray-700 text-white placeholder:text-gray-500 pl-10 h-12"
                      />
                    </div>
                  </div>

                  {registerError && (
                    <div className="flex items-center gap-2 text-red-400 text-sm bg-red-950/50 border border-red-800 rounded p-3">
                      <AlertCircle className="h-4 w-4 flex-shrink-0" />
                      <span>{registerError}</span>
                    </div>
                  )}

                  {registerSuccess && (
                    <div className="flex items-center gap-2 text-green-400 text-sm bg-green-950/50 border border-green-800 rounded p-3">
                      <Check className="h-4 w-4 flex-shrink-0" />
                      <span>Регистрация успешна! Теперь вы можете войти.</span>
                    </div>
                  )}

                  <Button
                    onClick={handleRegister}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-black font-bold h-12 text-base"
                  >
                    <UserPlus className="mr-2 h-5 w-5" />
                    ЗАРЕГИСТРИРОВАТЬСЯ
                  </Button>

                  <div className="bg-gray-900/50 border border-gray-700 rounded p-3">
                    <p className="text-sm text-white">
                      <span className="font-semibold">Требования:</span>
                      <br />• Минимум 3 символа для имени
                      <br />• Минимум 4 символа для пароля
                      <br />• Уникальное имя пользователя
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
