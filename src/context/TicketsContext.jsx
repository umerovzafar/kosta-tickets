import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'

const TicketsContext = createContext(null)

export const useTickets = () => {
  const context = useContext(TicketsContext)
  if (!context) {
    throw new Error('useTickets must be used within TicketsProvider')
  }
  return context
}

export const TicketsProvider = ({ children }) => {
  const { user } = useAuth()
  const [tickets, setTickets] = useState([])

  useEffect(() => {
    // Загружаем тикеты из localStorage
    const storedTickets = localStorage.getItem('tickets')
    if (storedTickets) {
      setTickets(JSON.parse(storedTickets))
    } else {
      // Инициализируем пустой массив
      setTickets([])
    }
  }, [])

  const saveTickets = (newTickets) => {
    setTickets(newTickets)
    localStorage.setItem('tickets', JSON.stringify(newTickets))
  }

  const createTicket = (ticketData) => {
    const newTicket = {
      id: Date.now().toString(),
      title: ticketData.title,
      description: ticketData.description,
      priority: ticketData.priority || 'medium',
      status: 'open',
      category: ticketData.category || 'other',
      createdBy: user.id,
      createdByName: user.username,
      createdByEmail: user.email || '',
      assignedTo: null,
      assignedToName: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      comments: [],
    }

    const updatedTickets = [...tickets, newTicket]
    saveTickets(updatedTickets)
    return newTicket
  }

  const updateTicket = (ticketId, updates) => {
    const updatedTickets = tickets.map((ticket) =>
      ticket.id === ticketId
        ? { ...ticket, ...updates, updatedAt: new Date().toISOString() }
        : ticket
    )
    saveTickets(updatedTickets)
  }

  const addComment = (ticketId, commentText) => {
    const comment = {
      id: Date.now().toString(),
      text: commentText,
      authorId: user.id,
      authorName: user.username,
      createdAt: new Date().toISOString(),
    }

    const updatedTickets = tickets.map((ticket) =>
      ticket.id === ticketId
        ? {
            ...ticket,
            comments: [...ticket.comments, comment],
            updatedAt: new Date().toISOString(),
          }
        : ticket
    )
    saveTickets(updatedTickets)
  }

  const assignTicket = (ticketId, userId, userName) => {
    updateTicket(ticketId, {
      assignedTo: userId,
      assignedToName: userName,
    })
  }

  const getTicketsForUser = () => {
    if (!user) return []
    
    if (user.role === 'admin') {
      return tickets
    } else if (user.role === 'it') {
      return tickets.filter(
        (t) => t.assignedTo === user.id || t.status === 'open'
      )
    } else {
      return tickets.filter((t) => t.createdBy === user.id)
    }
  }

  const value = {
    tickets,
    createTicket,
    updateTicket,
    addComment,
    assignTicket,
    getTicketsForUser,
  }

  return (
    <TicketsContext.Provider value={value}>{children}</TicketsContext.Provider>
  )
}

