import { useParams, useNavigate, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useTickets } from '../context/TicketsContext'
import { Button } from '../components/ui/button'
import { Textarea } from '../components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { ArrowLeft, MessageSquare, User, Calendar, Tag, Clock, Mail, Phone } from 'lucide-react'
import { Input } from '../components/ui/input'
import { format } from 'date-fns'

export const TicketDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, isAdmin, isIT } = useAuth()
  const { tickets, updateTicket, addComment, assignTicket } = useTickets()
  const [commentText, setCommentText] = useState('')
  const [estimatedTime, setEstimatedTime] = useState('')

  const ticket = tickets.find((t) => t.id === id)
  
  // Обновляем estimatedTime когда тикет загружается
  useEffect(() => {
    if (ticket) {
      setEstimatedTime(ticket.estimatedTime || '')
    }
  }, [ticket])

  if (!ticket) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground">Тикет не найден</p>
        <Button asChild className="mt-4">
          <Link to="/">Вернуться на главную</Link>
        </Button>
      </div>
    )
  }

  // Обычные пользователи могут видеть только свои тикеты
  if (!isAdmin && !isIT && ticket.createdBy !== user.id) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground">Доступ запрещен</p>
        <p className="text-sm text-muted-foreground mt-2">
          Вы можете просматривать только свои тикеты
        </p>
        <Button asChild className="mt-4">
          <Link to="/">Вернуться на главную</Link>
        </Button>
      </div>
    )
  }

  const canEdit = isAdmin || isIT || ticket.createdBy === user.id
  const canComment = isAdmin || isIT || ticket.createdBy === user.id

  const handleStatusChange = (newStatus) => {
    updateTicket(id, { status: newStatus })
  }

  const handleAssign = () => {
    if (isIT || isAdmin) {
      assignTicket(id, user.id, user.username)
      handleStatusChange('in_progress')
    }
  }

  const handleAddComment = (e) => {
    e.preventDefault()
    if (commentText.trim() && canComment) {
      addComment(id, commentText)
      setCommentText('')
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'open':
        return 'Открытый'
      case 'in_progress':
        return 'Взять на разработку'
      case 'closed':
        return 'Закрыть тикет'
      default:
        return status
    }
  }

  const handleEstimatedTimeChange = (value) => {
    setEstimatedTime(value)
    updateTicket(id, { estimatedTime: value })
  }

  const getPriorityText = (priority) => {
    switch (priority) {
      case 'high':
        return 'Высокий'
      case 'medium':
        return 'Средний'
      case 'low':
        return 'Низкий'
      default:
        return priority
    }
  }

  const getCategoryText = (category) => {
    switch (category) {
      case 'hardware':
        return 'Оборудование'
      case 'software':
        return 'Программное обеспечение'
      case 'network':
        return 'Сеть'
      case 'account':
        return 'Учетная запись'
      case 'other':
        return 'Другое'
      default:
        return category
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
        <Button variant="ghost" asChild className="w-fit">
          <Link to="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Назад
          </Link>
        </Button>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold break-words">{ticket.title}</h1>
      </div>

      <div className="grid gap-4 md:gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Описание</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{ticket.description}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Комментарии ({ticket.comments.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {ticket.comments.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  Комментариев пока нет
                </p>
              ) : (
                ticket.comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="border-l-2 border-primary pl-4 py-2"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm">
                        {comment.authorName}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(comment.createdAt), 'dd MMM yyyy HH:mm')}
                      </span>
                    </div>
                    <p className="text-sm">{comment.text}</p>
                  </div>
                ))
              )}

              {canComment ? (
                <form onSubmit={handleAddComment} className="space-y-2">
                  <Textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Добавить комментарий..."
                    rows={3}
                  />
                  <Button type="submit" size="sm">
                    Отправить комментарий
                  </Button>
                </form>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Вы не можете комментировать этот тикет
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Информация</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <Tag className="h-4 w-4" />
                  Статус
                </div>
                {canEdit && isIT && !isAdmin ? (
                  <Select
                    value={ticket.status}
                    onValueChange={handleStatusChange}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Открытый</SelectItem>
                      <SelectItem value="in_progress">Взять на разработку</SelectItem>
                      <SelectItem value="closed">Закрыть тикет</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="font-medium">{getStatusText(ticket.status)}</p>
                )}
              </div>

              <div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <Tag className="h-4 w-4" />
                  Приоритет
                </div>
                <p className="font-medium">{getPriorityText(ticket.priority)}</p>
              </div>

              <div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <Tag className="h-4 w-4" />
                  Категория
                </div>
                <p className="font-medium">{getCategoryText(ticket.category)}</p>
              </div>

              <div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <User className="h-4 w-4" />
                  Создал
                </div>
                <p className="font-medium">{ticket.createdByName}</p>
                {(isIT || isAdmin) && ticket.createdByEmail && (
                  <div className="mt-2">
                    <a
                      href={`mailto:${ticket.createdByEmail}?subject=Тикет: ${encodeURIComponent(ticket.title)}`}
                      className="flex items-center gap-2 text-sm text-primary hover:underline"
                    >
                      <Mail className="h-3 w-3" />
                      {ticket.createdByEmail}
                    </a>
                  </div>
                )}
              </div>

              {ticket.assignedToName && (
                <div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <User className="h-4 w-4" />
                    Назначен
                  </div>
                  <p className="font-medium">{ticket.assignedToName}</p>
                </div>
              )}

              <div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <Calendar className="h-4 w-4" />
                  Создан
                </div>
                <p className="font-medium text-sm">
                  {format(new Date(ticket.createdAt), 'dd MMM yyyy HH:mm')}
                </p>
              </div>

              {!isAdmin && (
                <div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <Clock className="h-4 w-4" />
                    Время выполнения
                  </div>
                  {isIT ? (
                    <>
                      <div className="flex gap-2">
                        <Input
                          type="text"
                          placeholder="Например: 15 минут"
                          value={estimatedTime}
                          onChange={(e) => {
                            const value = e.target.value
                            setEstimatedTime(value)
                            handleEstimatedTimeChange(value)
                          }}
                          className="flex-1"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Укажите примерное время выполнения задачи
                      </p>
                    </>
                  ) : (
                    <p className="font-medium">
                      {ticket.estimatedTime || 'Не указано'}
                    </p>
                  )}
                </div>
              )}

              {isIT && !isAdmin && !ticket.assignedTo && ticket.status === 'open' && (
                <Button 
                  onClick={() => {
                    assignTicket(id, user.id, user.username)
                    handleStatusChange('in_progress')
                  }} 
                  className="w-full"
                >
                  Взять на разработку
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

