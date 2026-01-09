import { createContext, useContext, useState, useEffect } from 'react'

const TodoContext = createContext()

export const useTodos = () => {
  const context = useContext(TodoContext)
  if (!context) {
    throw new Error('useTodos must be used within a TodoProvider')
  }
  return context
}

export const TodoProvider = ({ children }) => {
  const [todos, setTodos] = useState([])

  useEffect(() => {
    loadTodos()
  }, [])

  const loadTodos = () => {
    const stored = localStorage.getItem('todos')
    if (stored) {
      setTodos(JSON.parse(stored))
    } else {
      // Инициализация с тестовыми данными
      const initialTodos = [
        {
          id: '1',
          title: 'Обновить серверное оборудование',
          description: 'Проверить и обновить серверы в серверной комнате',
          status: 'todo',
          priority: 'high',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '2',
          title: 'Провести инвентаризацию техники',
          description: 'Проверить все единицы техники и обновить базу данных',
          status: 'in_progress',
          priority: 'medium',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '3',
          title: 'Настроить резервное копирование',
          description: 'Настроить автоматическое резервное копирование данных',
          status: 'done',
          priority: 'high',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ]
      setTodos(initialTodos)
      localStorage.setItem('todos', JSON.stringify(initialTodos))
    }
  }

  const saveTodos = (newTodos) => {
    setTodos(newTodos)
    localStorage.setItem('todos', JSON.stringify(newTodos))
  }

  const addTodo = (todo) => {
    const newTodo = {
      ...todo,
      id: Date.now().toString(),
      assignedTo: todo.assignedTo || [],
      tags: todo.tags || [],
      comments: todo.comments || [],
      todoLists: todo.todoLists || [],
      attachments: todo.attachments || [],
      storyPoints: todo.storyPoints || null,
      inFocus: todo.inFocus || false,
      read: todo.read !== undefined ? todo.read : true,
      project: todo.project || null,
      dueDate: todo.dueDate || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    const newTodos = [...todos, newTodo]
    saveTodos(newTodos)
    return newTodo
  }

  const addComment = (todoId, commentText, authorId, authorName) => {
    const comment = {
      id: Date.now().toString(),
      text: commentText,
      authorId,
      authorName,
      createdAt: new Date().toISOString(),
    }
    const newTodos = todos.map((todo) =>
      todo.id === todoId
        ? {
            ...todo,
            comments: [...(todo.comments || []), comment],
            updatedAt: new Date().toISOString(),
          }
        : todo
    )
    saveTodos(newTodos)
    return comment
  }

  const updateTodo = (id, updates) => {
    const newTodos = todos.map((todo) =>
      todo.id === id
        ? { ...todo, ...updates, updatedAt: new Date().toISOString() }
        : todo
    )
    saveTodos(newTodos)
  }

  const deleteTodo = (id) => {
    // Перемещаем в архив вместо полного удаления
    const newTodos = todos.map((todo) =>
      todo.id === id
        ? { ...todo, status: 'archived', updatedAt: new Date().toISOString() }
        : todo
    )
    saveTodos(newTodos)
  }

  const restoreTodo = (id) => {
    const newTodos = todos.map((todo) =>
      todo.id === id
        ? { ...todo, status: 'todo', updatedAt: new Date().toISOString() }
        : todo
    )
    saveTodos(newTodos)
  }

  const permanentlyDeleteTodo = (id) => {
    const newTodos = todos.filter((todo) => todo.id !== id)
    saveTodos(newTodos)
  }

  const moveTodo = (id, newStatus) => {
    updateTodo(id, { status: newStatus })
  }

  const getTodosByStatus = (status) => {
    return todos.filter((todo) => todo.status === status)
  }

  const addTodoListItem = (todoId, itemText) => {
    const newItem = {
      id: Date.now().toString(),
      text: itemText,
      checked: false,
      createdAt: new Date().toISOString(),
    }
    const newTodos = todos.map((todo) =>
      todo.id === todoId
        ? {
            ...todo,
            todoLists: [...(todo.todoLists || []), newItem],
            updatedAt: new Date().toISOString(),
          }
        : todo
    )
    saveTodos(newTodos)
    return newItem
  }

  const updateTodoListItem = (todoId, itemId, updates) => {
    const newTodos = todos.map((todo) =>
      todo.id === todoId
        ? {
            ...todo,
            todoLists: (todo.todoLists || []).map((item) =>
              item.id === itemId ? { ...item, ...updates } : item
            ),
            updatedAt: new Date().toISOString(),
          }
        : todo
    )
    saveTodos(newTodos)
  }

  const deleteTodoListItem = (todoId, itemId) => {
    const newTodos = todos.map((todo) =>
      todo.id === todoId
        ? {
            ...todo,
            todoLists: (todo.todoLists || []).filter((item) => item.id !== itemId),
            updatedAt: new Date().toISOString(),
          }
        : todo
    )
    saveTodos(newTodos)
  }

  return (
    <TodoContext.Provider
      value={{
        todos,
        addTodo,
        updateTodo,
        deleteTodo,
        restoreTodo,
        permanentlyDeleteTodo,
        moveTodo,
        getTodosByStatus,
        addComment,
        addTodoListItem,
        updateTodoListItem,
        deleteTodoListItem,
      }}
    >
      {children}
    </TodoContext.Provider>
  )
}




