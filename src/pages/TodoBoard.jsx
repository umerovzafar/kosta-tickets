import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTodos } from '../context/TodoContext'
import { Card, CardContent } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Textarea } from '../components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '../components/ui/dropdown-menu'
import { ToastContainer } from '../components/ui/toast'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import {
  Plus,
  Trash2,
  Search,
  Bell,
  HelpCircle,
  User,
  MoreVertical,
  X,
  Edit2,
  MessageSquare,
  Paperclip,
  Calendar,
  UserPlus,
  Share2,
  Settings,
  Sparkles,
  Volume2,
  Image as ImageIcon,
  CheckSquare,
  Clock,
  Tag as TagIcon,
  Send,
  Circle,
  Radio,
  Star,
  Flag,
  Check,
  Sun,
  Moon,
  Download,
  Upload,
  AlertCircle,
  CheckCircle,
  XCircle,
  Info,
} from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { cn } from '../lib/utils'

export const TodoBoard = () => {
  const navigate = useNavigate()
  const { user, isAdmin, isIT, getAllUsers } = useAuth()
  const {
    todos,
    addTodo,
    updateTodo,
    deleteTodo,
    moveTodo,
    getTodosByStatus,
    addComment,
    addTodoListItem,
    updateTodoListItem,
    deleteTodoListItem,
  } = useTodos()
  const [searchQuery, setSearchQuery] = useState('')
  const [draggedTodo, setDraggedTodo] = useState(null)
  const [createCardDialogOpen, setCreateCardDialogOpen] = useState(false)
  const [createColumnDialogOpen, setCreateColumnDialogOpen] = useState(false)
  const [selectedColumnId, setSelectedColumnId] = useState(null)
  const [toasts, setToasts] = useState([])
  const [newCardTitle, setNewCardTitle] = useState('')
  const [newColumnTitle, setNewColumnTitle] = useState('')
  const [selectedBoard, setSelectedBoard] = useState('Проверка')
  const [editingColumnId, setEditingColumnId] = useState(null)
  const [editColumnTitle, setEditColumnTitle] = useState('')
  const [selectedTodo, setSelectedTodo] = useState(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editTitle, setEditTitle] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editDueDate, setEditDueDate] = useState('')
  const [editTagInput, setEditTagInput] = useState('')
  const [commentText, setCommentText] = useState('')
  const [activeTab, setActiveTab] = useState('comments')
  const [newChecklistItem, setNewChecklistItem] = useState('')
  const [tagsDialogOpen, setTagsDialogOpen] = useState(false)
  const [datesDialogOpen, setDatesDialogOpen] = useState(false)
  const [participantsDialogOpen, setParticipantsDialogOpen] = useState(false)
  const [newTagName, setNewTagName] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [notificationsEnabled, setNotificationsEnabled] = useState(() => {
    const saved = localStorage.getItem('todoBoardNotificationsEnabled')
    return saved ? saved === 'true' : true
  })
  const [attachImageDialogOpen, setAttachImageDialogOpen] = useState(false)
  const [selectedImageFile, setSelectedImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [columnBackgroundDialogOpen, setColumnBackgroundDialogOpen] = useState(false)
  const [selectedColumnForBackground, setSelectedColumnForBackground] = useState(null)
  const [columnImageFile, setColumnImageFile] = useState(null)
  const [columnImagePreview, setColumnImagePreview] = useState(null)
  const [priorityDialogOpen, setPriorityDialogOpen] = useState(false)
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false)
  const [notificationsPanelOpen, setNotificationsPanelOpen] = useState(false)
  const [notifications, setNotifications] = useState(() => {
    const stored = localStorage.getItem('todoBoardNotifications')
    return stored ? JSON.parse(stored) : []
  })
  const [theme, setTheme] = useState(() => {
    // Загружаем тему из localStorage или используем системную
    const saved = localStorage.getItem('todoBoardTheme')
    if (saved) return saved
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })
  
  // Колонки доски с настройками цветов
  const [columns, setColumns] = useState([
    { id: 'todo', title: 'Нужно сделать', status: 'todo', color: 'primary', backgroundImage: null },
    { id: 'in_progress', title: 'В процессе', status: 'in_progress', color: 'secondary', backgroundImage: null },
    { id: 'done', title: 'Готово', status: 'done', color: 'accent', backgroundImage: null },
  ])

  // Цветовая палитра проекта
  const colorPalette = {
    primary: { bg: 'bg-primary/10', border: 'border-primary/30', text: 'text-primary-foreground', header: 'bg-blue-500 text-white' },
    secondary: { bg: 'bg-secondary/10', border: 'border-secondary/30', text: 'text-secondary-foreground', header: 'bg-green-500 text-white' },
    accent: { bg: 'bg-accent/10', border: 'border-accent/30', text: 'text-accent-foreground', header: 'bg-purple-500 text-white' },
    muted: { bg: 'bg-muted/10', border: 'border-muted/30', text: 'text-muted-foreground', header: 'bg-gray-400 text-white' },
  }

  const allUsers = getAllUsers()

  useEffect(() => {
    // Загружаем колонки из localStorage
    const savedColumns = localStorage.getItem('todoBoardColumns')
    if (savedColumns) {
      try {
        const parsed = JSON.parse(savedColumns)
        // Убеждаемся, что все колонки имеют поле color
        const columnsWithColor = parsed.map((col) => ({
          ...col,
          color: col.color || 'primary',
          backgroundImage: col.backgroundImage || null,
        }))
        setColumns(columnsWithColor)
      } catch (error) {
        console.error('Ошибка загрузки колонок из localStorage:', error)
      }
    }
  }, [])

  useEffect(() => {
    // Сохраняем колонки в localStorage
    localStorage.setItem('todoBoardColumns', JSON.stringify(columns))
  }, [columns])

  useEffect(() => {
    // Сохраняем уведомления в localStorage
    localStorage.setItem('todoBoardNotifications', JSON.stringify(notifications))
  }, [notifications])

  // Очистка старых уведомлений при загрузке компонента
  useEffect(() => {
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    
    setNotifications((prev) => {
      const filtered = prev.filter((notif) => {
        const notifDate = new Date(notif.createdAt)
        return notifDate >= thirtyDaysAgo
      })
      
      if (filtered.length !== prev.length) {
        return filtered
      }
      return prev
    })
  }, []) // Запускаем только при монтировании компонента

  useEffect(() => {
    // Сохраняем состояние уведомлений в localStorage
    localStorage.setItem('todoBoardNotificationsEnabled', notificationsEnabled.toString())
  }, [notificationsEnabled])

  useEffect(() => {
    // Применяем тему к document.documentElement сразу при загрузке
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    localStorage.setItem('todoBoardTheme', theme)
  }, [theme])

  // Применяем тему сразу при монтировании компонента
  useEffect(() => {
    const root = document.documentElement
    const savedTheme = localStorage.getItem('todoBoardTheme')
    const initialTheme = savedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    if (initialTheme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [])

  useEffect(() => {
    // Обновляем выбранную задачу при изменении todos
    if (selectedTodo) {
      const updated = todos.find((t) => t.id === selectedTodo.id)
      if (updated) {
        setSelectedTodo(updated)
        setEditTitle(updated.title)
        setEditDescription(updated.description || '')
        setEditDueDate(updated.dueDate ? new Date(updated.dueDate).toISOString().slice(0, 10) : '')
      }
    }
  }, [todos, selectedTodo?.id])

  const handleOpenEditDialog = (todo) => {
    setSelectedTodo(todo)
    setEditTitle(todo.title)
    setEditDescription(todo.description || '')
    setEditDueDate(todo.dueDate ? new Date(todo.dueDate).toISOString().slice(0, 10) : '')
    setStartDate('')
    setEndDate('')
    setNewTagName('')
    setCommentText('')
    setNewChecklistItem('')
    setActiveTab('comments')
    setTagsDialogOpen(false)
    setDatesDialogOpen(false)
    setParticipantsDialogOpen(false)
    setPriorityDialogOpen(false)
    setEditDialogOpen(true)
  }

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false)
    setSelectedTodo(null)
    setEditTitle('')
    setEditDescription('')
    setEditDueDate('')
    setEditTagInput('')
    setCommentText('')
    setNewChecklistItem('')
  }

  const handleSaveTodo = () => {
    if (!selectedTodo || !editTitle.trim()) {
      showToast('Ошибка', 'Введите название задачи', 'destructive')
      return
    }

    updateTodo(selectedTodo.id, {
      title: editTitle,
      description: editDescription,
      dueDate: editDueDate || null,
      })
      showToast('Успешно', 'Задача обновлена', 'default')
  }

  const handleAddTag = () => {
    if (!selectedTodo || !newTagName.trim()) {
      showToast('Ошибка', 'Введите название метки', 'destructive')
      return
    }

    const tagName = newTagName.trim()
    if (selectedTodo.tags && selectedTodo.tags.includes(tagName)) {
      showToast('Ошибка', 'Эта метка уже добавлена', 'destructive')
      return
    }

    const newTags = [...(selectedTodo.tags || []), tagName]
    updateTodo(selectedTodo.id, { tags: newTags })
    
    sendNotificationWithSound(
      'Метка добавлена',
      `Метка "${tagName}" добавлена к карточке "${selectedTodo.title}"`,
      'success',
      selectedTodo.id
    )
    
    setNewTagName('')
    setTagsDialogOpen(false)
    showToast('Успешно', 'Метка добавлена', 'default')
  }

  const handleRemoveTag = (tagToRemove) => {
    if (!selectedTodo) return

    const newTags = (selectedTodo.tags || []).filter((tag) => tag !== tagToRemove)
    updateTodo(selectedTodo.id, { tags: newTags })
    showToast('Успешно', 'Метка удалена', 'default')
  }

  const handleSaveDate = () => {
    if (!selectedTodo) return

    updateTodo(selectedTodo.id, {
      dueDate: editDueDate || null,
    })
    
    if (editDueDate) {
      sendNotificationWithSound(
        'Дата установлена',
        `Срок выполнения для "${selectedTodo.title}" установлен: ${format(new Date(editDueDate), 'dd MMMM yyyy')}`,
        'info',
        selectedTodo.id
      )
    } else {
      sendNotificationWithSound(
        'Дата удалена',
        `Срок выполнения для "${selectedTodo.title}" удален`,
        'info',
        selectedTodo.id
      )
    }
    
    setDatesDialogOpen(false)
    showToast('Успешно', 'Дата обновлена', 'default')
  }

  const handleOpenDatesDialog = () => {
    if (selectedTodo && selectedTodo.dueDate) {
      setEditDueDate(new Date(selectedTodo.dueDate).toISOString().slice(0, 10))
    } else {
      setEditDueDate('')
    }
    setDatesDialogOpen(true)
  }

  const handleAddParticipant = (userId) => {
    if (!selectedTodo) return

    if (selectedTodo.assignedTo && selectedTodo.assignedTo.includes(userId)) {
      showToast('Ошибка', 'Участник уже добавлен', 'destructive')
      return
    }

    const assignedUser = allUsers.find((u) => u.id === userId)
    const newParticipants = [...(selectedTodo.assignedTo || []), userId]
    updateTodo(selectedTodo.id, { assignedTo: newParticipants })
    
    sendNotificationWithSound(
      'Участник добавлен',
      `"${assignedUser?.username || 'Пользователь'}" добавлен к карточке "${selectedTodo.title}"`,
      'success',
      selectedTodo.id
    )
    
    showToast('Успешно', 'Участник добавлен', 'default')
  }

  const handleRemoveParticipant = (userId) => {
    if (!selectedTodo) return

    const removedUser = allUsers.find((u) => u.id === userId)
    const newParticipants = (selectedTodo.assignedTo || []).filter((id) => id !== userId)
    updateTodo(selectedTodo.id, { assignedTo: newParticipants })
    
    sendNotificationWithSound(
      'Участник удален',
      `"${removedUser?.username || 'Пользователь'}" удален из карточки "${selectedTodo.title}"`,
      'info',
      selectedTodo.id
    )
    
    showToast('Успешно', 'Участник удален', 'default')
  }

  const handleChangePriority = (priority) => {
    if (!selectedTodo) return
    const priorityLabels = { high: 'Высокий', medium: 'Средний', low: 'Низкий' }
    updateTodo(selectedTodo.id, { priority })
    
    sendNotificationWithSound(
      'Приоритет изменен',
      `Приоритет карточки "${selectedTodo.title}" изменен на "${priorityLabels[priority]}"`,
      'info',
      selectedTodo.id
    )
    
    setPriorityDialogOpen(false)
    showToast('Успешно', 'Приоритет изменен', 'default')
  }

  const handleDeleteChecklist = () => {
    if (!selectedTodo) return

    if (confirm('Вы уверены, что хотите удалить весь чек-лист?')) {
      updateTodo(selectedTodo.id, { todoLists: [] })
      showToast('Успешно', 'Чек-лист удален', 'default')
    }
  }

  const addNotification = (title, message, type = 'info', relatedTodoId = null) => {
    const newNotification = {
      id: Date.now().toString(),
      title,
      message,
      type, // 'info', 'success', 'warning', 'error'
      relatedTodoId,
      read: false,
      createdAt: new Date().toISOString(),
    }
    setNotifications((prev) => [newNotification, ...prev])
    return newNotification
  }

  const markNotificationAsRead = (notificationId) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    )
  }

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })))
  }

  const deleteNotification = (notificationId) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== notificationId))
  }

  const clearAllNotifications = () => {
    if (confirm('Вы уверены, что хотите удалить все уведомления?')) {
      setNotifications([])
      showToast('Успешно', 'Все уведомления удалены', 'default')
    }
  }

  const sendNotificationWithSound = (title, body, type = 'info', relatedTodoId = null) => {
    // Добавляем уведомление в список
    addNotification(title, body, type, relatedTodoId)

    // Проверяем поддержку браузерных уведомлений
    if (notificationsEnabled && 'Notification' in window && Notification.permission === 'granted') {
      // Создаем браузерное уведомление
      const notification = new Notification(title, {
        body,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
      })

      // Воспроизводим звук
      try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)()
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()
        
        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)
        
        oscillator.frequency.value = 800
        oscillator.type = 'sine'
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)
        
        oscillator.start(audioContext.currentTime)
        oscillator.stop(audioContext.currentTime + 0.5)
      } catch (error) {
        console.error('Ошибка воспроизведения звука:', error)
      }

      // Закрываем браузерное уведомление через 3 секунды
      setTimeout(() => {
        notification.close()
      }, 3000)
    }
  }

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Info className="h-4 w-4 text-blue-500" />
    }
  }

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markNotificationAsRead(notification.id)
    }
    
    // Если есть связанная задача, открываем её
    if (notification.relatedTodoId) {
      const todo = todos.find((t) => t.id === notification.relatedTodoId)
      if (todo) {
        handleOpenEditDialog(todo)
        setNotificationsPanelOpen(false)
      }
    }
  }

  const handleImageFileSelect = (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Проверяем тип файла
    if (!file.type.startsWith('image/')) {
      showToast('Ошибка', 'Выберите файл изображения', 'destructive')
      return
    }

    // Проверяем размер файла (макс 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showToast('Ошибка', 'Размер файла не должен превышать 5MB', 'destructive')
      return
    }

    setSelectedImageFile(file)

    // Создаем предпросмотр
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const handleSetBackgroundImage = () => {
    if (!selectedTodo || !selectedImageFile) {
      showToast('Ошибка', 'Выберите изображение', 'destructive')
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      const imageDataUrl = reader.result
      
      // Сохраняем изображение как backgroundImage в карточке
      // Удаляем старое фоновое изображение, если есть
      const existingAttachments = (selectedTodo.attachments || []).filter(att => !att.isBackground)
      
      updateTodo(selectedTodo.id, { 
        backgroundImage: imageDataUrl,
        attachments: [
          ...existingAttachments,
          {
            id: Date.now().toString(),
            type: 'image',
            url: imageDataUrl,
            name: selectedImageFile.name,
            uploadedAt: new Date().toISOString(),
            isBackground: true,
          }
        ]
      })
      
      setSelectedImageFile(null)
      setImagePreview(null)
      setAttachImageDialogOpen(false)
      showToast('Успешно', 'Фон карточки установлен', 'default')
    }
    reader.readAsDataURL(selectedImageFile)
  }

  const handleRemoveBackgroundImage = () => {
    if (!selectedTodo) return

    if (confirm('Вы уверены, что хотите удалить фоновое изображение?')) {
      // Удаляем backgroundImage и вложение-фон
      const newAttachments = (selectedTodo.attachments || []).filter((att) => !att.isBackground)
      updateTodo(selectedTodo.id, { 
        backgroundImage: null,
        attachments: newAttachments
      })
      showToast('Успешно', 'Фоновое изображение удалено', 'default')
    }
  }

  const handleColumnImageFileSelect = (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Проверяем тип файла
    if (!file.type.startsWith('image/')) {
      showToast('Ошибка', 'Выберите файл изображения', 'destructive')
      return
    }

    // Проверяем размер файла (макс 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showToast('Ошибка', 'Размер файла не должен превышать 5MB', 'destructive')
      return
    }

    setColumnImageFile(file)

    // Создаем предпросмотр
    const reader = new FileReader()
    reader.onloadend = () => {
      setColumnImagePreview(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const handleSetColumnBackgroundImage = () => {
    if (!selectedColumnForBackground || !columnImageFile) {
      showToast('Ошибка', 'Выберите изображение', 'destructive')
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      const imageDataUrl = reader.result
      
      // Обновляем колонку с фоновым изображением
      setColumns(columns.map((col) =>
        col.id === selectedColumnForBackground
          ? { ...col, backgroundImage: imageDataUrl }
          : col
      ))
      
      setColumnImageFile(null)
      setColumnImagePreview(null)
      setColumnBackgroundDialogOpen(false)
      setSelectedColumnForBackground(null)
      showToast('Успешно', 'Фон колонки установлен', 'default')
    }
    reader.readAsDataURL(columnImageFile)
  }

  const handleRemoveColumnBackgroundImage = (columnId) => {
    if (confirm('Вы уверены, что хотите удалить фоновое изображение колонки?')) {
      setColumns(columns.map((col) =>
        col.id === columnId
          ? { ...col, backgroundImage: null }
          : col
      ))
      showToast('Успешно', 'Фоновое изображение колонки удалено', 'default')
    }
  }

  const handleOpenColumnBackgroundDialog = (columnId) => {
    setSelectedColumnForBackground(columnId)
    setColumnImageFile(null)
    setColumnImagePreview(null)
    setColumnBackgroundDialogOpen(true)
  }


  const handleRemoveAttachment = (attachmentId) => {
    if (!selectedTodo) return

    const attachment = selectedTodo.attachments?.find(att => att.id === attachmentId)
    // Если удаляем фоновое изображение, также удаляем backgroundImage
    const updates = { 
      attachments: (selectedTodo.attachments || []).filter((att) => att.id !== attachmentId)
    }
    
    if (attachment?.isBackground) {
      updates.backgroundImage = null
    }
    
    updateTodo(selectedTodo.id, updates)
    showToast('Успешно', 'Вложение удалено', 'default')
  }

  const handleAddCommentSubmit = () => {
    if (!selectedTodo || !commentText.trim()) return

    addComment(selectedTodo.id, commentText, user.id, user.username)
    
    // Добавляем уведомление о новом комментарии
    sendNotificationWithSound(
      'Новый комментарий',
      `Добавлен комментарий к карточке "${selectedTodo.title}"`,
      'info',
      selectedTodo.id
    )
    
    setCommentText('')
    showToast('Успешно', 'Комментарий добавлен', 'default')
  }

  const handleAddChecklistItem = () => {
    if (!selectedTodo || !newChecklistItem.trim()) return

    addTodoListItem(selectedTodo.id, newChecklistItem)
    setNewChecklistItem('')
    showToast('Успешно', 'Пункт добавлен', 'default')
  }

  const handleToggleChecklistItem = (itemId, checked) => {
    if (!selectedTodo) return
    updateTodoListItem(selectedTodo.id, itemId, { checked })
  }

  const handleDeleteChecklistItem = (itemId) => {
    if (!selectedTodo) return
    deleteTodoListItem(selectedTodo.id, itemId)
    showToast('Успешно', 'Пункт удален', 'default')
  }

  const showToast = (title, description, variant = 'default') => {
    const id = Date.now().toString()
    setToasts([...toasts, { id, title, description, variant }])
    setTimeout(() => {
      setToasts(toasts.filter((t) => t.id !== id))
    }, 3000)
  }

  const handleCreateCard = (columnId) => {
    if (!newCardTitle.trim()) {
      showToast('Ошибка', 'Введите название карточки', 'destructive')
      return
    }

    const column = columns.find((col) => col.id === columnId)
    if (!column) return

    const newTodo = addTodo({
      title: newCardTitle,
      description: '',
      status: column.status,
      priority: 'medium',
      assignedTo: [],
      tags: [],
      comments: [],
      todoLists: [],
      attachments: [],
      storyPoints: null,
      inFocus: false,
      read: true,
      project: null,
      dueDate: null,
    })

    sendNotificationWithSound(
      'Карточка создана',
      `"${newCardTitle}" создана в колонке "${column.title}"`,
      'success',
      newTodo.id
    )

    setNewCardTitle('')
    setCreateCardDialogOpen(false)
    setSelectedColumnId(null)
    showToast('Успешно', 'Карточка создана', 'default')
  }

  const handleCreateColumn = () => {
    if (!newColumnTitle.trim()) {
      showToast('Ошибка', 'Введите название колонки', 'destructive')
      return
    }

    const newColumn = {
      id: `column-${Date.now()}`,
      title: newColumnTitle,
      status: `custom_${Date.now()}`,
      color: 'primary', // По умолчанию используется primary цвет
      backgroundImage: null,
    }

    setColumns([...columns, newColumn])
    setNewColumnTitle('')
    setCreateColumnDialogOpen(false)
    showToast('Успешно', 'Колонка создана', 'default')
  }

  const handleUpdateColumnColor = (columnId, color) => {
    setColumns((prevColumns) => {
      const updatedColumns = prevColumns.map((col) =>
        col.id === columnId ? { ...col, color: color } : col
      )
      // Сохраняем сразу в localStorage для надежности
      localStorage.setItem('todoBoardColumns', JSON.stringify(updatedColumns))
      return updatedColumns
    })
    showToast('Успешно', 'Цвет колонки обновлен', 'default')
  }

  const handleDeleteColumn = (columnId) => {
    const column = columns.find((col) => col.id === columnId)
    if (!column) return

    // Перемещаем все задачи из удаляемой колонки в первую колонку
    todos
      .filter((todo) => todo.status === column.status)
      .forEach((todo) => {
        if (columns.length > 1) {
          moveTodo(todo.id, columns[0].status)
        }
      })

    setColumns(columns.filter((col) => col.id !== columnId))
    showToast('Успешно', 'Колонка удалена', 'default')
  }

  const handleRenameColumn = (columnId) => {
    const column = columns.find((col) => col.id === columnId)
    if (!column) return

    setEditingColumnId(columnId)
    setEditColumnTitle(column.title)
  }

  const handleSaveColumnName = (columnId) => {
    if (!editColumnTitle.trim()) {
      showToast('Ошибка', 'Введите название колонки', 'destructive')
      return
    }

    setColumns(columns.map((col) =>
      col.id === columnId ? { ...col, title: editColumnTitle } : col
    ))
    setEditingColumnId(null)
    setEditColumnTitle('')
    showToast('Успешно', 'Название колонки обновлено', 'default')
  }

  const handleDragStart = (e, todo) => {
    setDraggedTodo(todo)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/html', todo.id)
    e.currentTarget.style.opacity = '0.5'
  }

  const handleDragEnd = (e) => {
    e.currentTarget.style.opacity = '1'
    setDraggedTodo(null)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e, column) => {
    e.preventDefault()

    if (draggedTodo && draggedTodo.status !== column.status) {
      moveTodo(draggedTodo.id, column.status)
      sendNotificationWithSound(
        'Карточка перемещена',
        `"${draggedTodo.title}" перемещена в "${column.title}"`,
        'success',
        draggedTodo.id
      )
      showToast('Успешно', 'Карточка перемещена', 'default')
    }
    setDraggedTodo(null)
  }

  const filteredTodos = todos.filter((todo) => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      todo.title.toLowerCase().includes(query) ||
      todo.description?.toLowerCase().includes(query)
    )
  })

  const getUserInitials = (username) => {
    return username
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const getUserColor = (userId) => {
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

  if (!isAdmin && !isIT) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground">Доступ запрещен</p>
        <p className="text-sm text-muted-foreground mt-2">
          Только администраторы и IT отдел могут просматривать список дел.
        </p>
      </div>
    )
  }

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))
  }

  const handleExportData = () => {
    const exportData = {
      todos: todos,
      columns: columns,
      selectedBoard: selectedBoard,
      theme: theme,
      notifications: notifications,
      exportDate: new Date().toISOString(),
      version: '1.0'
    }
    
    const dataStr = JSON.stringify(exportData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `todo-board-export-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    
    showToast('Успешно', 'Данные экспортированы', 'default')
  }

  const handleImportData = (event) => {
    const file = event.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result)
        
        if (confirm('Импорт данных перезапишет текущие данные. Продолжить?')) {
          if (importedData.todos) {
            localStorage.setItem('todos', JSON.stringify(importedData.todos))
          }
          if (importedData.columns) {
            localStorage.setItem('todoBoardColumns', JSON.stringify(importedData.columns))
          }
          if (importedData.theme) {
            localStorage.setItem('todoBoardTheme', importedData.theme)
            setTheme(importedData.theme)
          }
          if (importedData.notifications) {
            localStorage.setItem('todoBoardNotifications', JSON.stringify(importedData.notifications))
            setNotifications(importedData.notifications)
          }
          
          showToast('Успешно', 'Данные импортированы', 'default')
          setTimeout(() => window.location.reload(), 1000)
        }
      } catch (error) {
        showToast('Ошибка', 'Не удалось импортировать данные. Проверьте формат файла.', 'destructive')
      }
    }
    reader.readAsText(file)
    // Сброс input для возможности повторного выбора того же файла
    event.target.value = ''
  }

  const handleClearAllData = () => {
    if (confirm('Вы уверены, что хотите удалить все данные? Это действие нельзя отменить!')) {
      if (confirm('Последнее предупреждение! Все задачи и колонки будут удалены. Продолжить?')) {
        localStorage.removeItem('todos')
        localStorage.removeItem('todoBoardColumns')
        showToast('Успешно', 'Все данные удалены', 'default')
        setTimeout(() => window.location.reload(), 1000)
      }
    }
  }

  const handleResetColumns = () => {
    if (confirm('Вы уверены, что хотите сбросить колонки к значениям по умолчанию?')) {
      const defaultColumns = [
        { id: 'todo', title: 'Нужно сделать', status: 'todo', color: 'primary', backgroundImage: null },
        { id: 'in_progress', title: 'В процессе', status: 'in_progress', color: 'secondary', backgroundImage: null },
        { id: 'done', title: 'Готово', status: 'done', color: 'accent', backgroundImage: null },
      ]
      setColumns(defaultColumns)
      localStorage.setItem('todoBoardColumns', JSON.stringify(defaultColumns))
      showToast('Успешно', 'Колонки сброшены к значениям по умолчанию', 'default')
    }
  }

  return (
    <div className="h-full flex flex-col bg-background transition-colors duration-300">
      {/* Top Navigation Bar - Transparent with Blur */}
      <div className={cn(
        "fixed top-0 left-0 right-0 z-50 border-b px-4 py-3 flex items-center justify-between gap-4 flex-shrink-0 backdrop-blur-md transition-all duration-300",
        theme === 'dark' 
          ? "bg-gray-900/80 border-gray-800/50 backdrop-blur-lg" 
          : "bg-white/80 border-gray-200/50 backdrop-blur-lg"
      )}>
        <div className="flex items-center gap-4 flex-1">
          {/* Board Selector */}
          <Select value={selectedBoard} onValueChange={setSelectedBoard}>
            <SelectTrigger className={cn(
              "w-[140px] transition-colors",
              theme === 'dark' 
                ? "bg-gray-800/80 border-gray-700/50 text-white hover:bg-gray-800/90" 
                : "bg-white/80 border-gray-300/50 text-gray-900 hover:bg-white/90"
            )}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Проверка">Проверка</SelectItem>
              <SelectItem value="Разработка">Разработка</SelectItem>
              <SelectItem value="Дизайн">Дизайн</SelectItem>
            </SelectContent>
          </Select>
                </div>

        {/* Search */}
        <div className="flex items-center gap-3 flex-1 justify-center">
          <div className="relative flex-1 max-w-md">
            <Search className={cn(
              "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 transition-colors",
              theme === 'dark' ? "text-gray-400" : "text-gray-500"
            )} />
            <Input
              placeholder="Поиск"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn(
                "pl-9 pr-4 transition-colors",
                theme === 'dark'
                  ? "bg-gray-800/80 border-gray-700/50 text-white placeholder:text-gray-400 hover:bg-gray-800/90"
                  : "bg-white/80 border-gray-300/50 text-gray-900 placeholder:text-gray-500 hover:bg-white/90"
              )}
            />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all">
            <Sparkles className="h-4 w-4 mr-2" />
            Создать
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setNotificationsPanelOpen(true)}
            className={cn(
              "relative transition-all",
              theme === 'dark'
                ? "text-white hover:bg-gray-800/50"
                : "text-gray-700 hover:bg-gray-100/50"
            )}
            title="Уведомления"
          >
            <Bell className="h-5 w-5" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1 right-1 h-5 w-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
              </span>
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className={cn(
              "transition-all",
              theme === 'dark'
                ? "text-white hover:bg-gray-800/50"
                : "text-gray-700 hover:bg-gray-100/50"
            )}
            title={theme === 'dark' ? 'Переключить на светлую тему' : 'Переключить на темную тему'}
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className={cn(
                  "transition-all",
                  theme === 'dark'
                    ? "text-white hover:bg-gray-800/50"
                    : "text-gray-700 hover:bg-gray-100/50"
                )}
              >
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSettingsDialogOpen(true)}>
                <Settings className="h-4 w-4 mr-2" />
                Настройки
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExportData}>
                <Download className="h-4 w-4 mr-2" />
                Экспорт данных
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Spacer for fixed navigation */}
      <div className="h-[57px] flex-shrink-0"></div>

      {/* Main Board Area */}
      <div className={cn(
        "flex-1 overflow-x-auto overflow-y-hidden p-4 scrollbar-hide transition-colors duration-300",
        theme === 'dark'
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
          : "bg-gradient-to-br from-gray-50 to-gray-100"
      )}>
        <div className="flex gap-4 h-full">
          {columns.map((column) => {
            const columnTodos = filteredTodos.filter((todo) => todo.status === column.status)

            return (
              <div
                key={column.id}
                className={cn(
                  "flex flex-col flex-shrink-0 w-80 rounded-lg shadow-sm relative overflow-hidden backdrop-blur-sm transition-colors duration-300",
                  theme === 'dark' 
                    ? "bg-gray-800/30 border border-gray-700/30" 
                    : "bg-white/30 border border-gray-200/30"
                )}
                style={{
                  backgroundColor: column.backgroundImage 
                    ? (theme === 'dark' ? 'rgba(31, 41, 55, 0.3)' : 'rgba(255, 255, 255, 0.3)')
                    : undefined,
                  backgroundImage: column.backgroundImage ? `url(${column.backgroundImage})` : undefined,
                  backgroundSize: column.backgroundImage ? 'cover' : undefined,
                  backgroundPosition: column.backgroundImage ? 'center' : undefined,
                  backgroundRepeat: column.backgroundImage ? 'no-repeat' : undefined,
                }}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, column)}
              >
                {column.backgroundImage && (
                  <div className={cn(
                    "absolute inset-0 backdrop-blur-sm pointer-events-none transition-colors",
                    theme === 'dark' ? "bg-black/20" : "bg-white/20"
                  )}></div>
                )}
                {/* Column Header */}
                <div className={cn(
                  "p-3 border-b flex items-center justify-between rounded-t-lg relative z-10",
                  colorPalette[column.color]?.header || colorPalette.primary.header
                )}>
                  {editingColumnId === column.id ? (
                    <div className="flex items-center gap-2 flex-1">
                      <Input
                        value={editColumnTitle}
                        onChange={(e) => setEditColumnTitle(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleSaveColumnName(column.id)
                          }
                          if (e.key === 'Escape') {
                            setEditingColumnId(null)
                            setEditColumnTitle('')
                          }
                        }}
                        className="h-7 text-sm bg-white/20 border-white/30 text-white placeholder:text-white/70"
                        placeholder="Название колонки"
                        autoFocus
                      />
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleSaveColumnName(column.id)}
                        className="h-7 px-2 text-white hover:bg-white/20"
                      >
                        Сохранить
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setEditingColumnId(null)
                          setEditColumnTitle('')
                        }}
                        className="h-7 px-2 text-white hover:bg-white/20"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <h3 className="font-semibold text-sm">{column.title}</h3>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-6 w-6 text-white hover:bg-white/20">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                          <DropdownMenuItem onClick={() => handleRenameColumn(column.id)}>
                            <Edit2 className="h-4 w-4 mr-2" />
                            Переименовать
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleOpenColumnBackgroundDialog(column.id)}>
                            <ImageIcon className="h-4 w-4 mr-2" />
                            Установить фон
                          </DropdownMenuItem>
                          {column.backgroundImage && (
                            <DropdownMenuItem 
                              onClick={() => handleRemoveColumnBackgroundImage(column.id)}
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Удалить фон
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuLabel>Цвет колонки</DropdownMenuLabel>
                          <DropdownMenuItem 
                            onClick={() => handleUpdateColumnColor(column.id, 'primary')}
                          >
                            <div className="w-4 h-4 rounded bg-blue-500 mr-2 border border-gray-300"></div>
                            Основной
                            {column.color === 'primary' && <Check className="h-4 w-4 ml-auto" />}
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleUpdateColumnColor(column.id, 'secondary')}
                          >
                            <div className="w-4 h-4 rounded bg-green-500 mr-2 border border-gray-300"></div>
                            Вторичный
                            {column.color === 'secondary' && <Check className="h-4 w-4 ml-auto" />}
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleUpdateColumnColor(column.id, 'accent')}
                          >
                            <div className="w-4 h-4 rounded bg-purple-500 mr-2 border border-gray-300"></div>
                            Акцент
                            {column.color === 'accent' && <Check className="h-4 w-4 ml-auto" />}
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleUpdateColumnColor(column.id, 'muted')}
                          >
                            <div className="w-4 h-4 rounded bg-gray-400 mr-2 border border-gray-300"></div>
                            Приглушенный
                            {column.color === 'muted' && <Check className="h-4 w-4 ml-auto" />}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => {
                              if (confirm(`Вы уверены, что хотите удалить колонку "${column.title}"?`)) {
                                handleDeleteColumn(column.id)
                              }
                            }}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Удалить
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </>
                  )}
                </div>

                {/* Cards */}
                <div className={cn(
                  "flex-1 overflow-y-auto p-3 space-y-2 min-h-[200px] scrollbar-hide relative z-10 transition-colors",
                  theme === 'dark' ? "bg-transparent" : "bg-transparent"
                )}>
                  {columnTodos.map((todo) => (
                    <Card
                      key={todo.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, todo)}
                      onDragEnd={handleDragEnd}
                      onClick={() => handleOpenEditDialog(todo)}
                      className={cn(
                        "group cursor-pointer transition-all duration-200 relative overflow-hidden",
                        theme === 'dark'
                          ? "bg-gray-700/50 border-gray-600/50 hover:shadow-lg hover:border-primary/50 hover:bg-gray-700/70"
                          : "bg-white border-gray-200 hover:shadow-md hover:border-primary/50"
                      )}
                      style={{
                        backgroundImage: todo.backgroundImage ? `url(${todo.backgroundImage})` : undefined,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                      }}
                    >
                      {todo.backgroundImage && (
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors"></div>
                      )}
                      <CardContent className="p-3 relative z-10">
                        <div className="space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className={cn(
                              "font-medium text-sm leading-tight transition-colors flex-1",
                              todo.backgroundImage 
                                ? "text-white drop-shadow-md" 
                                : theme === 'dark' ? "text-gray-100" : "text-gray-900"
                            )}>
                              {todo.title}
                            </h4>
                            {todo.priority && (
                              <Flag className={cn(
                                "h-3.5 w-3.5 flex-shrink-0 mt-0.5",
                                todo.priority === 'high' && "text-red-500 fill-red-500",
                                todo.priority === 'medium' && "text-yellow-500 fill-yellow-500",
                                todo.priority === 'low' && "text-blue-500 fill-blue-500",
                                todo.backgroundImage && "drop-shadow-md"
                              )} />
                            )}
                          </div>
                          {todo.description && (
                            <p className={cn(
                              "text-xs line-clamp-2 transition-colors",
                              todo.backgroundImage 
                                ? "text-white/90 drop-shadow-md" 
                                : theme === 'dark' ? "text-gray-300" : "text-gray-600"
                            )}>
                              {todo.description}
                            </p>
                          )}
                          {todo.tags && todo.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {todo.tags.slice(0, 3).map((tag, idx) => {
                                const tagColors = [
                                  'bg-blue-100 text-blue-700',
                                  'bg-purple-100 text-purple-700',
                                  'bg-red-100 text-red-700',
                                  'bg-yellow-100 text-yellow-700',
                                  'bg-green-100 text-green-700',
                                ]
                                return (
                                  <span
                                    key={idx}
                                    className={cn(
                                      'px-2 py-0.5 rounded text-xs font-medium',
                                      tagColors[idx % tagColors.length]
                                    )}
                                  >
                                    {tag}
                                  </span>
                                )
                              })}
            </div>
                          )}
                          {todo.assignedTo && todo.assignedTo.length > 0 && (
                            <div className="flex items-center -space-x-1">
                              {todo.assignedTo.slice(0, 3).map((userId) => {
                                const assignedUser = allUsers.find((u) => u.id === userId)
                                if (!assignedUser) return null
                                return (
                                  <div
                                    key={userId}
                                    className={cn(
                                      'h-6 w-6 rounded-full flex items-center justify-center text-white text-xs font-medium border-2 border-white',
                                      getUserColor(userId)
                                    )}
                                    title={assignedUser.username}
                                  >
                                    {getUserInitials(assignedUser.username)}
                                  </div>
                                )
                              })}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {/* Add Card Button */}
                  <Dialog
                    open={createCardDialogOpen && selectedColumnId === column.id}
                    onOpenChange={(open) => {
                      setCreateCardDialogOpen(open)
                      if (!open) setSelectedColumnId(null)
                    }}
                  >
              <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        className={cn(
                          "w-full justify-start transition-colors",
                          theme === 'dark'
                            ? "text-gray-400 hover:text-gray-200 hover:bg-gray-700/50"
                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                        )}
                        onClick={() => {
                          setSelectedColumnId(column.id)
                          setCreateCardDialogOpen(true)
                        }}
                      >
                  <Plus className="h-4 w-4 mr-2" />
                        Добавить карточку
                </Button>
              </DialogTrigger>
                    <DialogContent>
                <DialogHeader>
                        <DialogTitle>Создать карточку</DialogTitle>
                  <DialogDescription>
                          Добавьте новую карточку в колонку "{column.title}"
                  </DialogDescription>
                </DialogHeader>
                      <div className="space-y-4">
                  <div className="space-y-2">
                          <Label htmlFor="cardTitle">Название карточки</Label>
                    <Input
                            id="cardTitle"
                            value={newCardTitle}
                            onChange={(e) => setNewCardTitle(e.target.value)}
                            placeholder="Введите название..."
                            onKeyPress={(e) => {
                              if (e.key === 'Enter' && newCardTitle.trim()) {
                                handleCreateCard(column.id)
                              }
                            }}
                    />
                  </div>
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            onClick={() => {
                              setCreateCardDialogOpen(false)
                              setSelectedColumnId(null)
                              setNewCardTitle('')
                            }}
                          >
                            Отмена
                          </Button>
                          <Button
                            onClick={() => handleCreateCard(column.id)}
                            disabled={!newCardTitle.trim()}
                          >
                            Добавить
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            )
          })}

          {/* Add Column Button */}
          <Dialog open={createColumnDialogOpen} onOpenChange={setCreateColumnDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "flex-shrink-0 w-80 h-fit backdrop-blur-sm border-2 border-dashed transition-all",
                  theme === 'dark'
                    ? "bg-gray-800/50 border-gray-600/50 hover:border-primary hover:bg-primary/10 text-gray-300 hover:text-primary"
                    : "bg-white/90 border-gray-300 hover:border-primary hover:bg-primary/5 text-gray-600 hover:text-primary"
                )}
              >
                <Plus className="h-4 w-4 mr-2" />
                Добавьте еще одну колонку
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Создать колонку</DialogTitle>
                <DialogDescription>
                  Добавьте новую колонку на доску
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                  <div className="space-y-2">
                  <Label htmlFor="columnTitle">Название колонки</Label>
                  <Input
                    id="columnTitle"
                    value={newColumnTitle}
                    onChange={(e) => setNewColumnTitle(e.target.value)}
                    placeholder="Введите название..."
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && newColumnTitle.trim()) {
                        handleCreateColumn()
                      }
                    }}
                    />
                  </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setCreateColumnDialogOpen(false)
                      setNewColumnTitle('')
                    }}
                  >
                    Отмена
                  </Button>
                  <Button
                    onClick={handleCreateColumn}
                    disabled={!newColumnTitle.trim()}
                  >
                    Добавить
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Edit Todo Dialog - Full Screen Modal */}
      <Dialog open={editDialogOpen} onOpenChange={handleCloseEditDialog}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] w-[95vw] h-[95vh] p-0 flex flex-col [&>button]:hidden !translate-x-[-50%] !translate-y-[-50%] !left-1/2 !top-1/2 !mx-0">
          {selectedTodo && (
            <>
              {/* Top Header Bar */}
              <div className={cn(
                "flex items-center justify-between p-4 border-b transition-colors",
                theme === 'dark' ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200"
              )}>
                    <Select
                  value={selectedTodo.status}
                  onValueChange={(newStatus) => {
                    updateTodo(selectedTodo.id, { status: newStatus })
                    const column = columns.find((col) => col.status === newStatus)
                    if (column) {
                      sendNotificationWithSound(
                        'Карточка перемещена',
                        `"${selectedTodo.title}" перемещена в "${column.title}"`,
                        'success',
                        selectedTodo.id
                      )
                      showToast('Успешно', `Карточка перемещена в "${column.title}"`, 'default')
                    }
                  }}
                >
                  <SelectTrigger className="w-[200px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                    {columns.map((col) => (
                      <SelectItem key={col.id} value={col.status}>
                        {col.title}
                      </SelectItem>
                    ))}
                      </SelectContent>
                    </Select>
                <div className="flex items-center gap-2">
                    <Button
                    variant="ghost" 
                    size="icon"
                    onClick={() => {
                      const newState = !notificationsEnabled
                      setNotificationsEnabled(newState)
                      
                      if (newState) {
                        // Запрос разрешения на уведомления
                        if ('Notification' in window && Notification.permission === 'default') {
                          Notification.requestPermission().then((permission) => {
                            if (permission === 'granted') {
                              sendNotificationWithSound('Уведомления включены', 'Теперь вы будете получать звуковые уведомления', 'success')
                            }
                          })
                        } else if (Notification.permission === 'granted') {
                          sendNotificationWithSound('Уведомления включены', 'Теперь вы будете получать звуковые уведомления', 'success')
                        }
                      } else {
                        sendNotificationWithSound('Уведомления отключены', 'Вы больше не будете получать звуковые уведомления', 'info')
                      }
                    }}
                    title={notificationsEnabled ? "Отключить уведомления" : "Включить уведомления"}
                  >
                    <Volume2 className={cn("h-5 w-5", !notificationsEnabled && "text-gray-400")} />
                    </Button>
                    <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => setAttachImageDialogOpen(true)}
                    title="Прикрепить изображение"
                  >
                    <ImageIcon className="h-5 w-5" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" title="Дополнительные опции">
                        <MoreVertical className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => {
                        if (selectedTodo && confirm('Вы уверены, что хотите удалить эту карточку?')) {
                          const todoTitle = selectedTodo.title
                          deleteTodo(selectedTodo.id)
                          sendNotificationWithSound(
                            'Карточка удалена',
                            `Карточка "${todoTitle}" перемещена в архив`,
                            'warning'
                          )
                          handleCloseEditDialog()
                          showToast('Успешно', 'Карточка удалена', 'default')
                        }
                      }}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Удалить карточку
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => {
                        if (selectedTodo) {
                          const wasInFocus = selectedTodo.inFocus
                          updateTodo(selectedTodo.id, { inFocus: !selectedTodo.inFocus })
                          sendNotificationWithSound(
                            wasInFocus ? 'Убрано из фокуса' : 'Добавлено в фокус',
                            wasInFocus 
                              ? `"${selectedTodo.title}" убрана из фокуса`
                              : `"${selectedTodo.title}" добавлена в фокус`,
                            'info',
                            selectedTodo.id
                          )
                          showToast('Успешно', wasInFocus ? 'Убрано из фокуса' : 'Добавлено в фокус', 'default')
                        }
                      }}>
                        <Star className={cn("h-4 w-4 mr-2", selectedTodo?.inFocus && "fill-yellow-400")} />
                        {selectedTodo?.inFocus ? 'Убрать из фокуса' : 'Добавить в фокус'}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setPriorityDialogOpen(true)}>
                        <Flag className="h-4 w-4 mr-2" />
                        Изменить приоритет
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => {
                        if (selectedTodo) {
                          const todoText = `Название: ${selectedTodo.title}\nОписание: ${selectedTodo.description || 'Нет описания'}\nСтатус: ${columns.find(col => col.status === selectedTodo.status)?.title || selectedTodo.status}`
                          navigator.clipboard.writeText(todoText)
                          showToast('Успешно', 'Информация о карточке скопирована', 'default')
                        }
                      }}>
                        <Paperclip className="h-4 w-4 mr-2" />
                        Копировать информацию
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button variant="ghost" size="icon" onClick={handleCloseEditDialog} title="Закрыть">
                    <X className="h-5 w-5" />
                    </Button>
                  </div>
          </div>

              {/* Main Content - Two Panels */}
              <div className="flex-1 flex overflow-hidden">
                {/* Left Panel - Task Details */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {/* Title with Radio Button */}
                  <div className="flex items-start gap-3">
                    <Radio className="h-6 w-6 mt-1 text-gray-400" />
                    <Input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      onBlur={handleSaveTodo}
                      className="text-2xl font-semibold border-0 p-0 focus-visible:ring-0 h-auto"
                      placeholder="Название задачи"
                    />
        </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" onClick={() => setTagsDialogOpen(true)}>
                      <TagIcon className="h-4 w-4 mr-2" />
                      Метки
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleOpenDatesDialog}>
                      <Clock className="h-4 w-4 mr-2" />
                      Даты
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setPriorityDialogOpen(true)}>
                      <Flag className={cn(
                        "h-4 w-4 mr-2",
                        selectedTodo.priority === 'high' && "text-red-500 fill-red-500",
                        selectedTodo.priority === 'medium' && "text-yellow-500 fill-yellow-500",
                        selectedTodo.priority === 'low' && "text-blue-500 fill-blue-500"
                      )} />
                      Приоритет
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setParticipantsDialogOpen(true)}>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Участники
                    </Button>
      </div>

                  {/* Priority Display */}
                  {selectedTodo.priority && (
                    <div className="space-y-2">
                      <h3 className="font-semibold text-sm">Приоритет</h3>
                      <div className="flex items-center gap-2">
                        <Flag className={cn(
                          "h-4 w-4",
                          selectedTodo.priority === 'high' && "text-red-500 fill-red-500",
                          selectedTodo.priority === 'medium' && "text-yellow-500 fill-yellow-500",
                          selectedTodo.priority === 'low' && "text-blue-500 fill-blue-500"
                        )} />
                        <span className={cn(
                          "text-sm font-medium px-2 py-1 rounded",
                          selectedTodo.priority === 'high' && "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
                          selectedTodo.priority === 'medium' && "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
                          selectedTodo.priority === 'low' && "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                        )}>
                          {selectedTodo.priority === 'high' ? 'Высокий' : selectedTodo.priority === 'medium' ? 'Средний' : 'Низкий'}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Tags Display */}
                  {selectedTodo.tags && selectedTodo.tags.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="font-semibold text-sm">Метки</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedTodo.tags.map((tag, idx) => {
                          const tagColors = [
                            'bg-blue-100 text-blue-700 border-blue-300',
                            'bg-purple-100 text-purple-700 border-purple-300',
                            'bg-red-100 text-red-700 border-red-300',
                            'bg-yellow-100 text-yellow-700 border-yellow-300',
                            'bg-green-100 text-green-700 border-green-300',
                          ]
                          return (
                            <span
                              key={idx}
                              className={cn(
                                'px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-2',
                                tagColors[idx % tagColors.length]
                              )}
                            >
                              {tag}
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-4 w-4 hover:bg-transparent p-0"
                                onClick={() => handleRemoveTag(tag)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </span>
                          )
                        })}
              </div>
              </div>
                  )}

                  {/* Dates Display */}
                  {selectedTodo.dueDate && (
                    <div className="space-y-2">
                      <h3 className="font-semibold text-sm">Дата выполнения</h3>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-700">
                          {format(parseISO(selectedTodo.dueDate), 'dd MMMM yyyy')}
                        </span>
            </div>
          </div>
                  )}

                  {/* Participants Display */}
                  {selectedTodo.assignedTo && selectedTodo.assignedTo.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="font-semibold text-sm">Участники</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedTodo.assignedTo.map((userId) => {
                          const assignedUser = allUsers.find((u) => u.id === userId)
                          if (!assignedUser) return null
                          return (
                            <div
                              key={userId}
                              className={cn(
                                'h-8 w-8 rounded-full flex items-center justify-center text-white text-xs font-medium border-2 border-white relative group',
                                getUserColor(userId)
                              )}
                              title={assignedUser.username}
                            >
                              {getUserInitials(assignedUser.username)}
                              <Button
                                variant="ghost"
                                size="icon"
                                className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 hover:bg-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity p-0"
                                onClick={() => handleRemoveParticipant(userId)}
                              >
                                <X className="h-3 w-3 text-white" />
                              </Button>
              </div>
                          )
                        })}
              </div>
            </div>
                  )}

                  {/* Description Section */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">Описание</h3>
                    </div>
                    <Textarea
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      onBlur={handleSaveTodo}
                      placeholder="Добавить более подробное описание..."
                      className="min-h-[120px]"
                    />
      </div>

                  {/* Attachments Section */}
                  {selectedTodo.attachments && selectedTodo.attachments.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="font-semibold text-sm">Вложения</h3>
                      <div className="grid grid-cols-3 gap-2">
                        {selectedTodo.attachments.map((attachment) => (
                          <div key={attachment.id} className="relative group">
                            {attachment.type === 'image' ? (
                              <div className="relative">
                                <img
                                  src={attachment.url}
                                  alt={attachment.name}
                                  className="w-full h-24 object-cover rounded-md border border-gray-200"
                                  onError={(e) => {
                                    e.target.style.display = 'none'
                                  }}
                                />
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="absolute top-1 right-1 h-6 w-6 bg-red-500 hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                  onClick={() => handleRemoveAttachment(attachment.id)}
                                >
                                  <X className="h-4 w-4 text-white" />
                                </Button>
                </div>
                            ) : (
                              <div className="flex items-center gap-2 p-2 border border-gray-200 rounded-md">
                                <Paperclip className="h-4 w-4" />
                                <span className="text-xs truncate">{attachment.name}</span>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-4 w-4 ml-auto"
                                  onClick={() => handleRemoveAttachment(attachment.id)}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                </div>
                            )}
          </div>
        ))}
      </div>
            </div>
                  )}

                  {/* Checklist Section */}
            <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckSquare className="h-5 w-5" />
                        <h3 className="font-semibold">Чек-лист</h3>
                  </div>
                      {selectedTodo.todoLists && selectedTodo.todoLists.length > 0 && (
                        <Button variant="ghost" size="sm" className="text-destructive" onClick={handleDeleteChecklist}>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Удалить
                        </Button>
                      )}
      </div>

                    {/* Progress Bar */}
                    {selectedTodo.todoLists && selectedTodo.todoLists.length > 0 && (
                      <div className="space-y-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all"
                            style={{
                              width: `${
                                (selectedTodo.todoLists.filter((item) => item.checked).length /
                                  selectedTodo.todoLists.length) *
                                100
                              }%`,
                            }}
                          />
                </div>
                        <p className="text-sm text-gray-600">
                          {Math.round(
                            (selectedTodo.todoLists.filter((item) => item.checked).length /
                              selectedTodo.todoLists.length) *
                              100
                          )}
                          %
                  </p>
                </div>
                    )}

                    {/* Checklist Items */}
                    {selectedTodo.todoLists && selectedTodo.todoLists.length > 0 && (
                      <div className="space-y-2">
                        {selectedTodo.todoLists.map((item) => (
                          <div key={item.id} className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={item.checked || false}
                              onChange={(e) =>
                                handleToggleChecklistItem(item.id, e.target.checked)
                              }
                              className="h-4 w-4 rounded"
                            />
                            <span
                              className={cn(
                                'flex-1',
                                item.checked && 'line-through text-gray-500'
                              )}
                            >
                              {item.text}
                  </span>
                          <Button
                            variant="ghost"
                            size="icon"
                              className="h-6 w-6"
                              onClick={() => handleDeleteChecklistItem(item.id)}
                            >
                              <X className="h-4 w-4" />
                          </Button>
                </div>
                        ))}
                      </div>
                    )}

                    {/* Add Checklist Item */}
                    <div className="flex gap-2">
                      <Input
                        value={newChecklistItem}
                        onChange={(e) => setNewChecklistItem(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && newChecklistItem.trim()) {
                            handleAddChecklistItem()
                          }
                        }}
                        placeholder="Добавить элемент"
                        className="flex-1"
                      />
                          <Button
                        onClick={handleAddChecklistItem}
                        disabled={!newChecklistItem.trim()}
                      >
                        <Plus className="h-4 w-4" />
                          </Button>
                        </div>
              </div>
            </div>

                {/* Right Panel - Comments and Activity */}
                <div className={cn(
                  "w-96 border-l flex flex-col transition-colors",
                  theme === 'dark' ? "bg-gray-800/50 border-gray-700/50" : "bg-gray-50 border-gray-200"
                )}>
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">
                    <TabsList className="w-full rounded-none flex-shrink-0">
                      <TabsTrigger value="comments" className="flex-1">
                        Комментарии и события
                      </TabsTrigger>
                      <TabsTrigger value="details" className="flex-1">
                        Показать подробности
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="comments" className="flex-1 flex flex-col mt-0 p-0 overflow-hidden min-h-0">
                      {/* Comment Input - Fixed at top */}
                      <div className={cn(
                        "p-4 space-y-2 flex-shrink-0 border-b transition-colors",
                        theme === 'dark' ? "bg-gray-900/50 border-gray-700/50" : "bg-white border-gray-200"
                      )}>
                        <Textarea
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          placeholder="Напишите комментарий..."
                          className="min-h-[80px] max-h-[120px] resize-none"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter' && e.ctrlKey && commentText.trim()) {
                              handleAddCommentSubmit()
                            }
                          }}
                        />
                        <Button
                          onClick={handleAddCommentSubmit}
                          disabled={!commentText.trim()}
                          className="w-full"
                        >
                          <Send className="h-4 w-4 mr-2" />
                          Отправить
                          </Button>
                  </div>

                      {/* Comments and Activity - Scrollable */}
                      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}>
                        {selectedTodo.comments && selectedTodo.comments.length > 0 ? (
                          selectedTodo.comments.map((comment) => (
                            <div key={comment.id} className="flex gap-3 flex-shrink-0">
                              <div className="h-8 w-8 rounded-full bg-teal-500 flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
                                {comment.authorName
                                  ? comment.authorName
                                      .split(' ')
                                      .map((n) => n[0])
                                      .join('')
                                      .toUpperCase()
                                      .slice(0, 2)
                                  : 'U'}
                      </div>
                              <div className="flex-1 min-w-0 break-words">
                                <p className="text-sm break-words">
                                  <span className="font-semibold">
                                    {comment.authorName || 'Пользователь'}
                                  </span>{' '}
                                  {comment.text}
                                </p>
                                <p className="text-xs text-gray-500 mt-1 whitespace-nowrap">
                                  {format(parseISO(comment.createdAt), 'dd MMMM yyyy, HH:mm')}
                  </p>
                </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-8 text-gray-400 text-sm">
                            Нет комментариев
                          </div>
                        )}
                        
                        {/* Activity Log */}
                        {selectedTodo.status && (
                          <div className="flex gap-3 pt-2 flex-shrink-0 border-t">
                            <div className="h-8 w-8 rounded-full bg-teal-500 flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
                              {getUserInitials(user?.username || 'User')}
                            </div>
                            <div className="flex-1 min-w-0 break-words">
                              <p className="text-sm break-words">
                                <span className="font-semibold">{user?.username || 'Пользователь'}</span>{' '}
                                добавил(а) эту карточку в список{' '}
                                <span className="font-semibold">
                                  {columns.find((col) => col.status === selectedTodo.status)?.title ||
                                    selectedTodo.status}
                                </span>
                              </p>
                              <p className="text-xs text-gray-500 mt-1 cursor-pointer hover:underline whitespace-nowrap">
                                12 минут назад
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </TabsContent>

                    <TabsContent value="details" className="p-4 mt-0">
                      <div className="space-y-4">
                        <div>
                          <Label>Приоритет</Label>
                          <p className="text-sm text-gray-600 mt-1">
                            {selectedTodo.priority === 'high'
                              ? 'Высокий'
                              : selectedTodo.priority === 'medium'
                              ? 'Средний'
                              : 'Низкий'}
                          </p>
                        </div>
                        <div>
                          <Label>Создано</Label>
                          <p className="text-sm text-gray-600 mt-1">
                            {selectedTodo.createdAt
                              ? format(parseISO(selectedTodo.createdAt), 'dd MMMM yyyy, HH:mm')
                              : '-'}
                          </p>
                        </div>
                        <div>
                          <Label>Обновлено</Label>
                          <p className="text-sm text-gray-600 mt-1">
                            {selectedTodo.updatedAt
                              ? format(parseISO(selectedTodo.updatedAt), 'dd MMMM yyyy, HH:mm')
                              : '-'}
                          </p>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Tags Dialog */}
      <Dialog open={tagsDialogOpen} onOpenChange={setTagsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Добавить метку</DialogTitle>
            <DialogDescription>
              Создайте новую метку для этой карточки
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="tagName">Название метки</Label>
              <Input
                id="tagName"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                placeholder="Введите название метки..."
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && newTagName.trim()) {
                    handleAddTag()
                  }
                }}
              />
            </div>
            {selectedTodo && selectedTodo.tags && selectedTodo.tags.length > 0 && (
              <div className="space-y-2">
                <Label>Существующие метки</Label>
                <div className="flex flex-wrap gap-2">
                  {selectedTodo.tags.map((tag, idx) => {
                    const tagColors = [
                      'bg-blue-100 text-blue-700',
                      'bg-purple-100 text-purple-700',
                      'bg-red-100 text-red-700',
                      'bg-yellow-100 text-yellow-700',
                      'bg-green-100 text-green-700',
                    ]
                    return (
                        <span
                        key={idx}
                        className={cn(
                          'px-2 py-1 rounded text-xs font-medium',
                          tagColors[idx % tagColors.length]
                        )}
                      >
                        {tag}
                        </span>
                    )
                  })}
                      </div>
              </div>
            )}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setTagsDialogOpen(false)}>
                Отмена
              </Button>
              <Button onClick={handleAddTag} disabled={!newTagName.trim()}>
                Добавить
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dates Dialog */}
      <Dialog open={datesDialogOpen} onOpenChange={setDatesDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Назначить дату</DialogTitle>
            <DialogDescription>
              Установите срок выполнения для этой карточки
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="dueDate">Срок выполнения</Label>
              <Input
                id="dueDate"
                type="date"
                value={editDueDate}
                onChange={(e) => setEditDueDate(e.target.value)}
              />
            </div>
            {selectedTodo && selectedTodo.dueDate && (
              <div className="p-3 bg-gray-50 rounded-md">
                <p className="text-sm text-gray-600">
                  Текущая дата: {format(parseISO(selectedTodo.dueDate), 'dd MMMM yyyy')}
                </p>
              </div>
            )}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDatesDialogOpen(false)}>
                Отмена
              </Button>
                          <Button
                variant="destructive"
                onClick={() => {
                  if (selectedTodo) {
                    updateTodo(selectedTodo.id, { dueDate: null })
                    setEditDueDate('')
                    setDatesDialogOpen(false)
                    showToast('Успешно', 'Дата удалена', 'default')
                  }
                }}
              >
                Удалить дату
                          </Button>
              <Button onClick={handleSaveDate}>
                Сохранить
              </Button>
                    </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Priority Dialog */}
      <Dialog open={priorityDialogOpen} onOpenChange={setPriorityDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Установить приоритет</DialogTitle>
            <DialogDescription>
              Выберите приоритет для этой карточки
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Выберите приоритет</Label>
              <div className="grid grid-cols-1 gap-2">
                          <Button
                  variant={selectedTodo?.priority === 'high' ? 'default' : 'outline'}
                  className={cn(
                    "w-full justify-start",
                    selectedTodo?.priority === 'high' && "bg-red-500 hover:bg-red-600 text-white border-red-500"
                  )}
                  onClick={() => handleChangePriority('high')}
                >
                  <Flag className="h-4 w-4 mr-2 fill-red-500 text-red-500" />
                  <span className="font-medium">Высокий</span>
                  {selectedTodo?.priority === 'high' && <Check className="h-4 w-4 ml-auto" />}
                </Button>
                <Button
                  variant={selectedTodo?.priority === 'medium' ? 'default' : 'outline'}
                  className={cn(
                    "w-full justify-start",
                    selectedTodo?.priority === 'medium' && "bg-yellow-500 hover:bg-yellow-600 text-white border-yellow-500"
                  )}
                  onClick={() => handleChangePriority('medium')}
                >
                  <Flag className="h-4 w-4 mr-2 fill-yellow-500 text-yellow-500" />
                  <span className="font-medium">Средний</span>
                  {selectedTodo?.priority === 'medium' && <Check className="h-4 w-4 ml-auto" />}
                </Button>
                <Button
                  variant={selectedTodo?.priority === 'low' ? 'default' : 'outline'}
                  className={cn(
                    "w-full justify-start",
                    selectedTodo?.priority === 'low' && "bg-blue-500 hover:bg-blue-600 text-white border-blue-500"
                  )}
                  onClick={() => handleChangePriority('low')}
                >
                  <Flag className="h-4 w-4 mr-2 fill-blue-500 text-blue-500" />
                  <span className="font-medium">Низкий</span>
                  {selectedTodo?.priority === 'low' && <Check className="h-4 w-4 ml-auto" />}
                </Button>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setPriorityDialogOpen(false)}>
                Отмена
              </Button>
              {selectedTodo?.priority && (
                <Button
                  variant="outline"
                  onClick={() => {
                    if (selectedTodo) {
                      updateTodo(selectedTodo.id, { priority: 'medium' })
                      setPriorityDialogOpen(false)
                      showToast('Успешно', 'Приоритет сброшен', 'default')
                    }
                  }}
                >
                  Сбросить
                          </Button>
              )}
                        </div>
                      </div>
        </DialogContent>
      </Dialog>

      {/* Participants Dialog */}
      <Dialog open={participantsDialogOpen} onOpenChange={setParticipantsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Добавить участников</DialogTitle>
            <DialogDescription>
              Выберите участников для этой карточки
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {allUsers.map((userItem) => {
                const isAssigned = selectedTodo?.assignedTo?.includes(userItem.id)
                return (
                  <div
                    key={userItem.id}
                    className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          'h-10 w-10 rounded-full flex items-center justify-center text-white text-sm font-medium',
                          getUserColor(userItem.id)
                        )}
                      >
                        {getUserInitials(userItem.username)}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{userItem.username}</p>
                        <p className="text-xs text-gray-500">{userItem.email || ''}</p>
          </div>
      </div>
                    <Button
                      variant={isAssigned ? 'destructive' : 'default'}
                      size="sm"
                      onClick={() => {
                        if (isAssigned) {
                          handleRemoveParticipant(userItem.id)
                        } else {
                          handleAddParticipant(userItem.id)
                        }
                      }}
                    >
                      {isAssigned ? (
                        <>
                          <X className="h-4 w-4 mr-2" />
                          Удалить
                        </>
                      ) : (
                        <>
                          <UserPlus className="h-4 w-4 mr-2" />
                          Добавить
                        </>
                      )}
                    </Button>
                  </div>
                )
              })}
            </div>
            <div className="flex justify-end">
              <Button variant="outline" onClick={() => setParticipantsDialogOpen(false)}>
                Закрыть
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Attach Image Dialog */}
      <Dialog open={attachImageDialogOpen} onOpenChange={(open) => {
        setAttachImageDialogOpen(open)
        if (!open) {
          setSelectedImageFile(null)
          setImagePreview(null)
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Установить фон карточки</DialogTitle>
            <DialogDescription>
              Выберите изображение для фона карточки
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="imageFile">Выберите изображение</Label>
              <Input
                id="imageFile"
                type="file"
                accept="image/*"
                onChange={handleImageFileSelect}
                className="cursor-pointer"
              />
              <p className="text-xs text-gray-500">
                Поддерживаются форматы: JPG, PNG, GIF, WebP (макс. 5MB)
              </p>
            </div>
            {selectedTodo?.backgroundImage && (
              <div className="p-3 bg-gray-50 rounded-md">
                <p className="text-sm text-gray-600 mb-2">Текущий фон:</p>
                <div className="relative w-full h-32 rounded-md overflow-hidden border border-gray-200">
                  <img
                    src={selectedTodo.backgroundImage}
                    alt="Current background"
                    className="w-full h-full object-cover"
                  />
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  className="mt-2 w-full"
                  onClick={handleRemoveBackgroundImage}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Удалить фон
                </Button>
              </div>
            )}
            {imagePreview && (
              <div className="space-y-2">
                <Label>Предпросмотр</Label>
                <div className="border border-gray-200 rounded-md p-2">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-w-full max-h-48 object-contain mx-auto rounded"
                  />
                    </div>
              </div>
            )}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => {
                setAttachImageDialogOpen(false)
                setSelectedImageFile(null)
                setImagePreview(null)
              }}>
                Отмена
              </Button>
              <Button onClick={handleSetBackgroundImage} disabled={!selectedImageFile}>
                Установить фон
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Column Background Dialog */}
      <Dialog open={columnBackgroundDialogOpen} onOpenChange={(open) => {
        setColumnBackgroundDialogOpen(open)
        if (!open) {
          setSelectedColumnForBackground(null)
          setColumnImageFile(null)
          setColumnImagePreview(null)
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Установить фон колонки</DialogTitle>
            <DialogDescription>
              Выберите изображение для фона колонки
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="columnImageFile">Выберите изображение</Label>
              <Input
                id="columnImageFile"
                type="file"
                accept="image/*"
                onChange={handleColumnImageFileSelect}
                className="cursor-pointer"
              />
              <p className="text-xs text-gray-500">
                Поддерживаются форматы: JPG, PNG, GIF, WebP (макс. 5MB)
              </p>
      </div>
            {selectedColumnForBackground && columns.find((c) => c.id === selectedColumnForBackground)?.backgroundImage && (
              <div className="p-3 bg-gray-50 rounded-md">
                <p className="text-sm text-gray-600 mb-2">Текущий фон:</p>
                <div className="relative w-full h-32 rounded-md overflow-hidden border border-gray-200">
                  <img
                    src={columns.find((c) => c.id === selectedColumnForBackground)?.backgroundImage}
                    alt="Current background"
                    className="w-full h-full object-cover"
                  />
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  className="mt-2 w-full"
                  onClick={() => {
                    if (selectedColumnForBackground) {
                      handleRemoveColumnBackgroundImage(selectedColumnForBackground)
                      setColumnBackgroundDialogOpen(false)
                    }
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Удалить фон
                </Button>
              </div>
            )}
            {columnImagePreview && (
              <div className="space-y-2">
                <Label>Предпросмотр</Label>
                <div className="border border-gray-200 rounded-md p-2">
                  <img
                    src={columnImagePreview}
                    alt="Preview"
                    className="max-w-full max-h-48 object-contain mx-auto rounded"
                  />
                </div>
              </div>
            )}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => {
                setColumnBackgroundDialogOpen(false)
                setSelectedColumnForBackground(null)
                setColumnImageFile(null)
                setColumnImagePreview(null)
              }}>
                Отмена
              </Button>
              <Button onClick={handleSetColumnBackgroundImage} disabled={!columnImageFile}>
                Установить фон
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Settings Dialog */}
      <Dialog open={settingsDialogOpen} onOpenChange={setSettingsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Настройки доски</DialogTitle>
            <DialogDescription>
              Управление настройками и данными доски задач
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {/* Export/Import Section */}
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-sm mb-2">Экспорт и импорт данных</h3>
                <div className="space-y-2">
                  <Button onClick={handleExportData} variant="outline" className="w-full justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    Экспортировать данные в JSON
                  </Button>
                  <div className="relative">
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImportData}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      id="import-file-input"
                    />
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <label htmlFor="import-file-input" className="cursor-pointer w-full flex items-center">
                        <Upload className="h-4 w-4 mr-2" />
                        Импортировать данные из JSON
                      </label>
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <div>
                <h3 className="font-semibold text-sm mb-2">Управление данными</h3>
                <div className="space-y-2">
                  <Button 
                    onClick={handleResetColumns} 
                    variant="outline" 
                    className="w-full justify-start"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Сбросить колонки к значениям по умолчанию
                  </Button>
                  <Button 
                    onClick={handleClearAllData} 
                    variant="destructive" 
                    className="w-full justify-start"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Удалить все данные
                  </Button>
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <div>
                <h3 className="font-semibold text-sm mb-2">Информация</h3>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <p>Всего задач: <span className="font-medium">{todos.length}</span></p>
                  <p>Колонок: <span className="font-medium">{columns.length}</span></p>
                  <p>Текущая доска: <span className="font-medium">{selectedBoard}</span></p>
                  <p>Тема: <span className="font-medium">{theme === 'dark' ? 'Темная' : 'Светлая'}</span></p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <Button variant="outline" onClick={() => setSettingsDialogOpen(false)}>
              Закрыть
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Notifications Panel */}
      <Dialog open={notificationsPanelOpen} onOpenChange={setNotificationsPanelOpen}>
        <DialogContent className={cn(
          "max-w-md max-h-[80vh] flex flex-col p-0 transition-colors",
          theme === 'dark' ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        )}>
          <DialogHeader className={cn(
            "px-6 pt-6 pb-4 border-b transition-colors",
            theme === 'dark' ? "border-gray-700" : "border-gray-200"
          )}>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle>Уведомления</DialogTitle>
                <DialogDescription>
                  {unreadNotificationsCount > 0 
                    ? `${unreadNotificationsCount} непрочитанных`
                    : 'Нет непрочитанных уведомлений'}
                </DialogDescription>
              </div>
              {notifications.length > 0 && (
                <div className="flex items-center gap-2">
                  {unreadNotificationsCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={markAllNotificationsAsRead}
                      className="text-xs"
                    >
                      Отметить все как прочитанные
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={clearAllNotifications}
                    className="h-8 w-8"
                    title="Очистить все"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto p-4 space-y-2 min-h-0 scrollbar-hide">
            {notifications.length === 0 ? (
              <div className={cn(
                "text-center py-12 transition-colors",
                theme === 'dark' ? "text-gray-500" : "text-gray-400"
              )}>
                <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-sm">Нет уведомлений</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={cn(
                    "p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md",
                    !notification.read
                      ? theme === 'dark'
                        ? "bg-blue-900/30 border-blue-700/50 hover:bg-blue-900/40"
                        : "bg-blue-50 border-blue-200 hover:bg-blue-100"
                      : theme === 'dark'
                        ? "bg-gray-800/30 border-gray-700/50 hover:bg-gray-800/50"
                        : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex-shrink-0">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className={cn(
                          "font-semibold text-sm transition-colors",
                          !notification.read && "font-bold",
                          theme === 'dark' ? "text-gray-100" : "text-gray-900"
                        )}>
                          {notification.title}
                        </h4>
                        {!notification.read && (
                          <div className="h-2 w-2 bg-blue-500 rounded-full flex-shrink-0 mt-1.5"></div>
                        )}
                      </div>
                      <p className={cn(
                        "text-xs mt-1 break-words transition-colors",
                        theme === 'dark' ? "text-gray-300" : "text-gray-600"
                      )}>
                        {notification.message}
                      </p>
                      <p className={cn(
                        "text-xs mt-2 transition-colors",
                        theme === 'dark' ? "text-gray-500" : "text-gray-400"
                      )}>
                        {format(parseISO(notification.createdAt), 'dd MMMM yyyy, HH:mm')}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn(
                        "h-6 w-6 flex-shrink-0 transition-colors",
                        theme === 'dark' 
                          ? "hover:bg-gray-700 text-gray-400 hover:text-gray-200"
                          : "hover:bg-gray-100 text-gray-400 hover:text-gray-600"
                      )}
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteNotification(notification.id)
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      <ToastContainer toasts={toasts} setToasts={setToasts} />
    </div>
  )
}
