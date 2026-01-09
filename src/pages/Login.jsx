import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { ToastContainer } from '../components/ui/toast'
import { Ticket, Database } from 'lucide-react'
import { initTestData } from '../utils/initTestData'

export const Login = () => {
  const [loginData, setLoginData] = useState({ username: '', password: '' })
  const [registerData, setRegisterData] = useState({ username: '', password: '', confirmPassword: '', email: '' })
  const [toasts, setToasts] = useState([])
  const { login, register } = useAuth()
  const navigate = useNavigate()

  const showToast = (title, description, variant = 'default') => {
    const id = Date.now().toString()
    setToasts([...toasts, { id, title, description, variant }])
    setTimeout(() => {
      setToasts(toasts.filter((t) => t.id !== id))
    }, 3000)
  }

  const handleLogin = (e) => {
    e.preventDefault()
    const result = login(loginData.username, loginData.password)
    if (result.success) {
      navigate('/')
    } else {
      showToast('Ошибка входа', result.error, 'destructive')
    }
  }

  const handleRegister = (e) => {
    e.preventDefault()
    if (registerData.password !== registerData.confirmPassword) {
      showToast('Ошибка регистрации', 'Пароли не совпадают', 'destructive')
      return
    }
    if (registerData.password.length < 4) {
      showToast('Ошибка регистрации', 'Пароль должен быть не менее 4 символов', 'destructive')
      return
    }
    const result = register(registerData.username, registerData.password, 'user', registerData.email)
    if (result.success) {
      navigate('/')
    } else {
      showToast('Ошибка регистрации', result.error, 'destructive')
    }
  }

  const handleInitTestData = () => {
    try {
      initTestData()
      showToast('Успешно', 'Тестовые данные созданы! Проверьте консоль для данных входа.', 'default')
    } catch (error) {
      showToast('Ошибка', 'Не удалось создать тестовые данные', 'destructive')
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background to-muted px-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6 md:mb-8">
          <div className="flex items-center gap-2 text-2xl sm:text-3xl font-bold">
            <Ticket className="h-6 w-6 sm:h-8 sm:w-8" />
            <span>Тикет-система</span>
          </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Вход в систему</CardTitle>
            <CardDescription>
              Войдите в систему или зарегистрируйтесь
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Вход</TabsTrigger>
                <TabsTrigger value="register">Регистрация</TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-username">Логин</Label>
                    <Input
                      id="login-username"
                      value={loginData.username}
                      onChange={(e) =>
                        setLoginData({ ...loginData, username: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Пароль</Label>
                    <Input
                      id="login-password"
                      type="password"
                      value={loginData.password}
                      onChange={(e) =>
                        setLoginData({ ...loginData, password: e.target.value })
                      }
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Войти
                  </Button>
                </form>
              </TabsContent>
              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-username">Логин</Label>
                    <Input
                      id="register-username"
                      value={registerData.username}
                      onChange={(e) =>
                        setRegisterData({ ...registerData, username: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <Input
                      id="register-email"
                      type="email"
                      value={registerData.email}
                      onChange={(e) =>
                        setRegisterData({ ...registerData, email: e.target.value })
                      }
                      placeholder="example@company.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-password">Пароль</Label>
                    <Input
                      id="register-password"
                      type="password"
                      value={registerData.password}
                      onChange={(e) =>
                        setRegisterData({ ...registerData, password: e.target.value })
                      }
                      required
                      minLength={4}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Подтвердите пароль</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={registerData.confirmPassword}
                      onChange={(e) =>
                        setRegisterData({ ...registerData, confirmPassword: e.target.value })
                      }
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Зарегистрироваться
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
            <div className="mt-4 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleInitTestData}
              >
                <Database className="h-4 w-4 mr-2" />
                Создать тестовые данные
              </Button>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Создаст тестовых пользователей и тикеты для демонстрации
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      <ToastContainer toasts={toasts} setToasts={setToasts} />
    </div>
  )
}

