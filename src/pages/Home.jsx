import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTickets } from '../context/TicketsContext'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Plus, Ticket, Clock, CheckCircle, XCircle } from 'lucide-react'
import { format } from 'date-fns'

export const Home = () => {
  const { user, isAdmin, isIT } = useAuth()
  const { getTicketsForUser } = useTickets()
  const tickets = getTicketsForUser()

  const stats = {
    total: tickets.length,
    open: tickets.filter((t) => t.status === 'open').length,
    inProgress: tickets.filter((t) => t.status === 'in_progress').length,
    closed: tickets.filter((t) => t.status === 'closed').length,
  }

  const recentTickets = tickets
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)

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
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Добро пожаловать, {user?.username}!</h1>
          <p className="text-muted-foreground mt-2 text-sm sm:text-base">
            {isAdmin
              ? 'Панель администратора'
              : isIT
              ? 'Панель IT отдела'
              : 'Ваши тикеты'}
          </p>
        </div>
        {!isIT && !isAdmin && (
          <Button asChild className="w-full sm:w-auto">
            <Link to="/create-ticket">
              <Plus className="h-4 w-4 mr-2" />
              Создать тикет
            </Link>
          </Button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Всего тикетов</CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Открыто</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.open}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">В работе</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inProgress}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Закрыто</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.closed}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Последние тикеты</CardTitle>
          <CardDescription>
            {recentTickets.length === 0
              ? 'У вас пока нет тикетов'
              : 'Недавно созданные или обновленные тикеты'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recentTickets.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {!isIT ? (
                <>
                  <Ticket className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Создайте свой первый тикет</p>
                  <Button asChild className="mt-4">
                    <Link to="/create-ticket">
                      <Plus className="h-4 w-4 mr-2" />
                      Создать тикет
                    </Link>
                  </Button>
                </>
              ) : (
                <p>Нет доступных тикетов</p>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {recentTickets.map((ticket) => (
                <Link
                  key={ticket.id}
                  to={`/ticket/${ticket.id}`}
                  className="block p-4 border rounded-lg hover:bg-accent transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getStatusIcon(ticket.status)}
                        <h3 className="font-semibold">{ticket.title}</h3>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(
                            ticket.priority
                          )}`}
                        >
                          {getPriorityText(ticket.priority)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {ticket.description}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span>Статус: {getStatusText(ticket.status)}</span>
                        <span>
                          Создан:{' '}
                          {format(new Date(ticket.createdAt), 'dd MMM yyyy')}
                        </span>
                        {ticket.assignedToName && (
                          <span>Назначен: {ticket.assignedToName}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

