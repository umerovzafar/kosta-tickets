import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTickets } from '../context/TicketsContext'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Textarea } from '../components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

export const CreateTicket = () => {
  const navigate = useNavigate()
  const { createTicket } = useTickets()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    category: 'other',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.title || !formData.description) {
      return
    }
    createTicket(formData)
    navigate('/')
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
        <Button variant="ghost" asChild className="w-fit">
          <Link to="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Назад
          </Link>
        </Button>
        <h1 className="text-2xl sm:text-3xl font-bold">Создать тикет</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Новая заявка</CardTitle>
          <CardDescription>
            Заполните форму для создания новой заявки в IT отдел
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Название тикета *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Краткое описание проблемы"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Описание *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Подробное описание проблемы..."
                rows={6}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="priority">Приоритет</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) =>
                    setFormData({ ...formData, priority: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Низкий</SelectItem>
                    <SelectItem value="medium">Средний</SelectItem>
                    <SelectItem value="high">Высокий</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Категория</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData({ ...formData, category: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hardware">Оборудование</SelectItem>
                    <SelectItem value="software">Программное обеспечение</SelectItem>
                    <SelectItem value="network">Сеть</SelectItem>
                    <SelectItem value="account">Учетная запись</SelectItem>
                    <SelectItem value="other">Другое</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="submit" className="flex-1">
                Создать тикет
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/')}
              >
                Отмена
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

