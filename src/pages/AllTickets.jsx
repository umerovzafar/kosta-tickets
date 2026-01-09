import { Link } from 'react-router-dom'
import { useTickets } from '../context/TicketsContext'
import { useAuth } from '../context/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { PaginationControls } from '../components/PaginationControls'
import { useState, useMemo, useEffect } from 'react'
import { Clock, CheckCircle, XCircle, Ticket } from 'lucide-react'
import { format } from 'date-fns'

export const AllTickets = () => {
  const { getTicketsForUser } = useTickets()
  const { isAdmin, isIT } = useAuth()
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Получаем тикеты с учетом роли пользователя
  const userTickets = getTicketsForUser()

  const filteredTickets = useMemo(() => {
    return statusFilter === 'all'
      ? userTickets
      : userTickets.filter((t) => t.status === statusFilter)
  }, [userTickets, statusFilter])

  const totalPages = Math.ceil(filteredTickets.length / itemsPerPage)
  
  const paginatedTickets = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return filteredTickets.slice(startIndex, endIndex)
  }, [filteredTickets, currentPage, itemsPerPage])

  // Сбрасываем на первую страницу при изменении фильтра
  useEffect(() => {
    setCurrentPage(1)
  }, [statusFilter])

  const getStatusIcon = (status) => {
    switch (status) {
      case 'open':
        return <Clock className="h-4 w-4 text-blue-500" />
      case 'in_progress':
        return <Clock className="h-4 w-4 text-yellow-500" />
      case 'closed':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      default:
        return <XCircle className="h-4 w-4 text-gray-500" />
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

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-50'
      case 'medium':
        return 'text-yellow-600 bg-yellow-50'
      case 'low':
        return 'text-green-600 bg-green-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
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

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold">
          {isAdmin || isIT ? 'Все тикеты' : 'Мои тикеты'}
        </h1>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Фильтр по статусу" />
          </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все статусы</SelectItem>
              <SelectItem value="open">Открытый</SelectItem>
              <SelectItem value="in_progress">Взять на разработку</SelectItem>
              <SelectItem value="closed">Закрыть тикет</SelectItem>
            </SelectContent>
        </Select>
      </div>

      {filteredTickets.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Ticket className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">Тикеты не найдены</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="space-y-4">
            {paginatedTickets.map((ticket) => (
            <Link
              key={ticket.id}
              to={`/ticket/${ticket.id}`}
              className="block"
            >
              <Card className="hover:bg-accent transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getStatusIcon(ticket.status)}
                        <h3 className="font-semibold text-lg">{ticket.title}</h3>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(
                            ticket.priority
                          )}`}
                        >
                          {getPriorityText(ticket.priority)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {ticket.description}
                      </p>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs text-muted-foreground">
                        <span>Статус: {getStatusText(ticket.status)}</span>
                        <span>
                          Создан:{' '}
                          {format(new Date(ticket.createdAt), 'dd MMM yyyy')}
                        </span>
                        <span>Автор: {ticket.createdByName}</span>
                        {ticket.assignedToName && (
                          <span>Назначен: {ticket.assignedToName}</span>
                        )}
                        <span>Комментариев: {ticket.comments.length}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
          </div>
          
          {totalPages > 1 && (
            <div className="mt-6">
              <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                itemsPerPage={itemsPerPage}
              />
              <p className="text-sm text-muted-foreground text-center mt-4">
                Показано {paginatedTickets.length} из {filteredTickets.length} тикетов
              </p>
            </div>
          )}
        </>
      )}
    </div>
  )
}

