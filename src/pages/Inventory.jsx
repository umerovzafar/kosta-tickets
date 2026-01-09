import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Label } from '../components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog'
import { ToastContainer } from '../components/ui/toast'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table'
import { Image as ImageIcon, Package, Eye, Database, Download, CheckCircle, AlertCircle, XCircle, Clock, User } from 'lucide-react'
import { format } from 'date-fns'
import { initTestData } from '../utils/initTestData'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'

export const Inventory = () => {
  const { isAdmin, getAllUsers } = useAuth()
  const allUsers = getAllUsers()
  const [inventory, setInventory] = useState([])
  const [selectedItem, setSelectedItem] = useState(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    loadInventory()
  }, [])

  const loadInventory = () => {
    const stored = localStorage.getItem('inventory')
    if (stored) {
      setInventory(JSON.parse(stored))
    }
  }

  const handleViewItem = (item) => {
    setSelectedItem(item)
    setViewDialogOpen(true)
  }

  const handleUpdateResponsible = (itemId, userId) => {
    const updatedInventory = inventory.map((item) =>
      item.id === itemId
        ? { ...item, responsible: userId || null, updatedAt: new Date().toISOString() }
        : item
    )
    setInventory(updatedInventory)
    localStorage.setItem('inventory', JSON.stringify(updatedInventory))
    
    // Обновляем selectedItem если он открыт
    if (selectedItem && selectedItem.id === itemId) {
      const updatedItem = updatedInventory.find((item) => item.id === itemId)
      if (updatedItem) {
        setSelectedItem({ ...updatedItem })
      }
    }
    
    showToast('Успешно', 'Ответственный обновлен', 'default')
  }

  const getUserName = (userId) => {
    if (!userId) return null
    const user = allUsers.find((u) => u.id === userId)
    return user ? user.username : null
  }

  const getUserInitials = (username) => {
    if (!username) return ''
    return username
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const getUserColor = (userId) => {
    if (!userId) return 'bg-gray-400'
    const colors = [
      'bg-primary',
      'bg-secondary',
      'bg-accent',
      'bg-blue-500',
      'bg-green-500',
      'bg-yellow-500',
      'bg-purple-500',
    ]
    const index = allUsers.findIndex((u) => u.id === userId) % colors.length
    return colors[index] || colors[0]
  }

  const showToast = (title, description, variant = 'default') => {
    const id = Date.now().toString()
    setToasts([...toasts, { id, title, description, variant }])
    setTimeout(() => {
      setToasts(toasts.filter((t) => t.id !== id))
    }, 3000)
  }

  const handleInitTestData = () => {
    try {
      initTestData()
      loadInventory()
      showToast('Успешно', 'Тестовые данные инвентаризации созданы!', 'default')
    } catch (error) {
      showToast('Ошибка', 'Не удалось создать тестовые данные', 'destructive')
    }
  }

  const getStatusInfo = (status) => {
    switch (status) {
      case 'working':
        return {
          text: 'Рабочая',
          icon: <CheckCircle className="h-4 w-4 text-green-500" />,
          className: 'text-green-600 bg-green-50',
        }
      case 'repair':
        return {
          text: 'В ремонте',
          icon: <Clock className="h-4 w-4 text-yellow-500" />,
          className: 'text-yellow-600 bg-yellow-50',
        }
      case 'broken':
        return {
          text: 'Неисправна',
          icon: <AlertCircle className="h-4 w-4 text-red-500" />,
          className: 'text-red-600 bg-red-50',
        }
      case 'written_off':
        return {
          text: 'Списана',
          icon: <XCircle className="h-4 w-4 text-gray-500" />,
          className: 'text-gray-600 bg-gray-50',
        }
      default:
        return {
          text: 'Не указано',
          icon: <AlertCircle className="h-4 w-4 text-gray-400" />,
          className: 'text-gray-600 bg-gray-50',
        }
    }
  }

  const handleDownloadReport = () => {
    if (inventory.length === 0) {
      showToast('Ошибка', 'Нет данных для экспорта', 'destructive')
      return
    }

    // Создаем CSV файл
    const headers = ['Название', 'Тип', 'Серийный номер', 'Местоположение', 'Состояние', 'Ответственный', 'Дата добавления', 'Описание']
    const rows = inventory.map((item) => {
      const statusInfo = getStatusInfo(item.status || 'working')
      const responsibleName = getUserName(item.responsible) || '—'
      return [
        item.name || '',
        item.type || '',
        item.serialNumber || '',
        item.location || '',
        statusInfo.text,
        responsibleName,
        format(new Date(item.createdAt), 'dd.MM.yyyy'),
        item.description || '',
      ]
    })

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')),
    ].join('\n')

    // Добавляем BOM для правильного отображения кириллицы в Excel
    const BOM = '\uFEFF'
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `Инвентаризация_${format(new Date(), 'dd-MM-yyyy')}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    showToast('Успешно', 'Отчет успешно скачан', 'default')
  }

  if (!isAdmin) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground">Доступ запрещен</p>
      </div>
    )
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Инвентаризация техники</h1>
          <p className="text-muted-foreground mt-2 text-sm sm:text-base">
            Просмотр инвентаря техники компании
          </p>
        </div>
        {inventory.length > 0 && (
          <Button onClick={handleDownloadReport} variant="outline" className="w-full sm:w-auto">
            <Download className="h-4 w-4 mr-2" />
            Скачать отчет
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Список техники ({inventory.length})
          </CardTitle>
          <CardDescription>
            Полный список техники в инвентаре
          </CardDescription>
        </CardHeader>
        <CardContent>
          {inventory.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground mb-4">
                Техника еще не добавлена в инвентарь
              </p>
              <Button onClick={handleInitTestData} variant="outline">
                <Database className="h-4 w-4 mr-2" />
                Создать тестовые данные
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Фото</TableHead>
                    <TableHead>Название</TableHead>
                    <TableHead>Тип</TableHead>
                    <TableHead>Серийный номер</TableHead>
                    <TableHead>Местоположение</TableHead>
                    <TableHead>Состояние</TableHead>
                    <TableHead>Ответственный</TableHead>
                    <TableHead>Дата добавления</TableHead>
                    <TableHead className="text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inventory.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        {item.photo ? (
                          <img
                            src={item.photo}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded border"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-muted rounded border flex items-center justify-center">
                            <ImageIcon className="h-6 w-6 text-muted-foreground" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.type}</TableCell>
                      <TableCell>
                        {item.serialNumber || (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {item.location || (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusInfo(item.status || 'working').icon}
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${getStatusInfo(item.status || 'working').className}`}
                          >
                            {getStatusInfo(item.status || 'working').text}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {item.responsible ? (
                          <div className="flex items-center gap-2">
                            <div
                              className={`h-8 w-8 rounded-full flex items-center justify-center text-white text-xs font-medium ${getUserColor(item.responsible)}`}
                              title={getUserName(item.responsible) || ''}
                            >
                              {getUserInitials(getUserName(item.responsible))}
                            </div>
                            <span className="text-sm">{getUserName(item.responsible)}</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {format(new Date(item.createdAt), 'dd.MM.yyyy')}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewItem(item)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Просмотр
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          {selectedItem && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedItem.name}</DialogTitle>
                <DialogDescription>
                  Подробная информация о технике
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                {selectedItem.photo && (
                  <div>
                    <img
                      src={selectedItem.photo}
                      alt={selectedItem.name}
                      className="w-full max-h-64 object-contain rounded-lg border"
                    />
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Тип техники</Label>
                    <p className="font-medium">{selectedItem.type}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Серийный номер</Label>
                    <p className="font-medium">
                      {selectedItem.serialNumber || (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Местоположение</Label>
                    <p className="font-medium">
                      {selectedItem.location || (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Состояние</Label>
                    <div className="flex items-center gap-2 mt-1">
                      {getStatusInfo(selectedItem.status || 'working').icon}
                      <p className="font-medium">
                        {getStatusInfo(selectedItem.status || 'working').text}
                      </p>
                    </div>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Дата добавления</Label>
                    <p className="font-medium">
                      {format(new Date(selectedItem.createdAt), 'dd.MM.yyyy HH:mm')}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Ответственный за технику</Label>
                    <div className="mt-2">
                      <Select
                        value={selectedItem.responsible || ''}
                        onValueChange={(value) => handleUpdateResponsible(selectedItem.id, value || null)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Не назначен" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Не назначен</SelectItem>
                          {allUsers.map((user) => (
                            <SelectItem key={user.id} value={user.id}>
                              {user.username}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {selectedItem.responsible && (
                        <div className="flex items-center gap-2 mt-2">
                          <div
                            className={`h-10 w-10 rounded-full flex items-center justify-center text-white text-sm font-medium ${getUserColor(selectedItem.responsible)}`}
                          >
                            {getUserInitials(getUserName(selectedItem.responsible))}
                          </div>
                          <div>
                            <p className="font-medium">{getUserName(selectedItem.responsible)}</p>
                            {allUsers.find((u) => u.id === selectedItem.responsible)?.email && (
                              <p className="text-sm text-muted-foreground">
                                {allUsers.find((u) => u.id === selectedItem.responsible)?.email}
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {selectedItem.description && (
                  <div>
                    <Label className="text-muted-foreground">Описание</Label>
                    <p className="font-medium">{selectedItem.description}</p>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <ToastContainer toasts={toasts} setToasts={setToasts} />
    </div>
  )
}
