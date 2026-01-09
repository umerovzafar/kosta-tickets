import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Загружаем пользователя из localStorage при загрузке
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = (username, password) => {
    // Получаем пользователей из localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const foundUser = users.find(
      (u) => u.username === username && u.password === password
    )

    if (foundUser) {
      // Проверяем блокировку
      if (foundUser.blocked) {
        return { success: false, error: 'Ваш аккаунт заблокирован администратором' }
      }

      const userData = { ...foundUser }
      delete userData.password // Не храним пароль в состоянии
      setUser(userData)
      localStorage.setItem('user', JSON.stringify(userData))
      return { success: true }
    }

    return { success: false, error: 'Неверный логин или пароль' }
  }

  const register = (username, password, role = 'user', email = '') => {
    // Получаем пользователей из localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]')

    // Проверяем, существует ли пользователь
    if (users.find((u) => u.username === username)) {
      return { success: false, error: 'Пользователь с таким логином уже существует' }
    }

    // Проверяем, существует ли email
    if (email && users.find((u) => u.email === email)) {
      return { success: false, error: 'Пользователь с таким email уже существует' }
    }

    // Создаем нового пользователя
    const newUser = {
      id: Date.now().toString(),
      username,
      password, // В реальном приложении пароль должен быть захеширован
      role,
      email: email || '',
      blocked: false,
      createdAt: new Date().toISOString(),
    }

    users.push(newUser)
    localStorage.setItem('users', JSON.stringify(users))

    // Автоматически входим после регистрации
    const userData = { ...newUser }
    delete userData.password
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))

    return { success: true }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  const toggleUserBlock = (userId) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const updatedUsers = users.map((u) =>
      u.id === userId ? { ...u, blocked: !u.blocked } : u
    )
    localStorage.setItem('users', JSON.stringify(updatedUsers))
    
    // Если заблокирован текущий пользователь, разлогиниваем его
    if (user?.id === userId && !user.blocked) {
      logout()
    }
    
    return updatedUsers
  }

  const deleteUser = (userId) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const updatedUsers = users.filter((u) => u.id !== userId)
    localStorage.setItem('users', JSON.stringify(updatedUsers))
    
    // Если удален текущий пользователь, разлогиниваем его
    if (user?.id === userId) {
      logout()
    }
    
    return updatedUsers
  }

  const getAllUsers = () => {
    return JSON.parse(localStorage.getItem('users') || '[]')
  }

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAdmin: user?.role === 'admin',
    isIT: user?.role === 'it',
    isUser: user?.role === 'user',
    toggleUserBlock,
    deleteUser,
    getAllUsers,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

