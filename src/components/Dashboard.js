"use client"

import { useState, useEffect } from "react"
import TaskList from "./TaskList"
import TaskForm from "./TaskForm"
import "./Dashboard.css"

const SAMPLE_TASKS = [
  {
    id: "1",
    title: "Complete project proposal",
    description: "Write and submit the Q4 project proposal",
    category: "Work",
    priority: "high",
    deadline: "2025-01-10T10:00",
    completed: false,
    createdAt: "2025-01-05T09:00:00.000Z",
  },
  {
    id: "2",
    title: "Buy groceries",
    description: "Get milk, bread, and vegetables",
    category: "Personal",
    priority: "medium",
    deadline: "2025-01-07T18:00",
    completed: false,
    createdAt: "2025-01-05T10:00:00.000Z",
  },
]

const CATEGORIES = ["Work", "Personal", "Learning", "Health", "Finance"]
const PRIORITIES = ["low", "medium", "high"]

const Dashboard = () => {
  const [tasks, setTasks] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [activeView, setActiveView] = useState("dashboard")
  const [filters, setFilters] = useState({
    category: "all",
    priority: "all",
    status: "all",
    deadline: "all",
    search: "",
  })
  const [showFloatingAlert, setShowFloatingAlert] = useState(true)

  // Load/save tasks
  useEffect(() => {
    const saved = localStorage.getItem("smart-tasks")
    if (saved) {
      setTasks(JSON.parse(saved))
    } else {
      setTasks(SAMPLE_TASKS)
      localStorage.setItem("smart-tasks", JSON.stringify(SAMPLE_TASKS))
    }
  }, [])

  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem("smart-tasks", JSON.stringify(tasks))
    }
  }, [tasks])

  // Deadline utilities - DYNAMIC TIME CALCULATION
  const getDeadlineStatus = (deadline) => {
    if (!deadline) return null

    const deadlineDate = new Date(deadline)
    const now = new Date()

    // Calculate precise time differences
    const diffMs = deadlineDate.getTime() - now.getTime()
    const diffHours = diffMs / (1000 * 60 * 60)
    const diffDays = diffMs / (1000 * 60 * 60 * 24)
    const diffMinutes = diffMs / (1000 * 60)

    // Dynamic status determination with actual time remaining
    if (diffMs < 0) {
      const overdueDays = Math.abs(Math.floor(diffDays))
      const overdueHours = Math.abs(Math.floor(diffHours % 24))
      if (overdueDays > 0) {
        return { status: "overdue", text: `Overdue by ${overdueDays} day${overdueDays > 1 ? "s" : ""}`, urgent: true }
      } else if (overdueHours > 0) {
        return {
          status: "overdue",
          text: `Overdue by ${overdueHours} hour${overdueHours > 1 ? "s" : ""}`,
          urgent: true,
        }
      } else {
        return { status: "overdue", text: "Overdue", urgent: true }
      }
    }

    if (diffMinutes <= 60) {
      const minutes = Math.floor(diffMinutes)
      return { status: "urgent", text: `Due in ${minutes} minute${minutes !== 1 ? "s" : ""}`, urgent: true }
    }

    if (diffHours <= 24) {
      const hours = Math.floor(diffHours)
      const minutes = Math.floor((diffHours - hours) * 60)
      if (hours === 0) {
        return { status: "urgent", text: `Due in ${minutes} minute${minutes !== 1 ? "s" : ""}`, urgent: true }
      } else if (minutes === 0) {
        return { status: "today", text: `Due in ${hours} hour${hours !== 1 ? "s" : ""}`, urgent: true }
      } else {
        return { status: "today", text: `Due in ${hours}h ${minutes}m`, urgent: true }
      }
    }

    if (diffDays <= 3) {
      const days = Math.floor(diffDays)
      const hours = Math.floor((diffDays - days) * 24)
      if (hours === 0) {
        return { status: "soon", text: `Due in ${days} day${days !== 1 ? "s" : ""}`, urgent: false }
      } else {
        return { status: "soon", text: `Due in ${days}d ${hours}h`, urgent: false }
      }
    }

    const days = Math.floor(diffDays)
    return { status: "normal", text: `Due in ${days} day${days !== 1 ? "s" : ""}`, urgent: false }
  }

  // Task operations
  const addTask = (taskData) => {
    const newTask = {
      id: Date.now().toString(),
      ...taskData,
      completed: false,
      createdAt: new Date().toISOString(),
    }
    setTasks([...tasks, newTask])
    setShowForm(false)
  }

  const updateTask = (taskData) => {
    setTasks(tasks.map((task) => (task.id === editingTask.id ? { ...task, ...taskData } : task)))
    setEditingTask(null)
    setShowForm(false)
  }

  const deleteTask = (taskId) => {
    if (window.confirm("Delete this task?")) {
      setTasks(tasks.filter((task) => task.id !== taskId))
    }
  }

  const toggleComplete = (taskId) => {
    setTasks(tasks.map((task) => (task.id === taskId ? { ...task, completed: !task.completed } : task)))
  }

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    if (filters.category !== "all" && task.category !== filters.category) return false
    if (filters.priority !== "all" && task.priority !== filters.priority) return false
    if (filters.status === "completed" && !task.completed) return false
    if (filters.status === "pending" && task.completed) return false
    if (filters.search && !task.title.toLowerCase().includes(filters.search.toLowerCase())) return false

    if (filters.deadline !== "all") {
      const deadlineInfo = getDeadlineStatus(task.deadline)
      switch (filters.deadline) {
        case "overdue":
          return deadlineInfo?.status === "overdue"
        case "today":
          return deadlineInfo?.status === "today" || deadlineInfo?.status === "urgent"
        case "week":
          return deadlineInfo?.status === "soon"
        case "no-deadline":
          return !task.deadline
        default:
          return true
      }
    }
    return true
  })

  // Stats
  const stats = {
    total: tasks.length,
    completed: tasks.filter((t) => t.completed).length,
    pending: tasks.filter((t) => !t.completed).length,
    overdue: tasks.filter((t) => !t.completed && getDeadlineStatus(t.deadline)?.status === "overdue").length,
  }

  const criticalTasks = tasks
    .filter((t) => !t.completed && t.deadline)
    .filter((t) => {
      const info = getDeadlineStatus(t.deadline)
      return info && ["overdue", "urgent", "today"].includes(info.status)
    })

  return (
    <div className="command-center">
      {/* Header */}
      <div className="command-bar">
        <div className="command-bar-content">
          <div className="brand">
            <h1 className="command-bar-title">Smart Task Manager</h1>
          </div>
          <div className="command-bar-search">
            <input
              type="text"
              className="search-input"
              placeholder="Search tasks..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </div>

          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            Add New Task
          </button>
        </div>
      </div>
      <div className={`dashboard-container ${criticalTasks.length > 0 ? "with-alert" : ""}`}>
        {/* Navigation */}
        <div className="nav-tabs">
          {["dashboard", "all tasks", "deadlines"].map((view) => (
            <button
              key={view}
              className={`nav-tab ${activeView === view ? "active" : ""}`}
              onClick={() => setActiveView(view)}
            >
              {view === "dashboard" && "📊"} {view === "all tasks" && "📃"} {view === "deadlines" && "⏰"}{" "}
              {view.charAt(0).toUpperCase() + view.slice(1)}
            </button>
          ))}
        </div>

        {/* Dashboard View */}
        {activeView === "dashboard" && (
          <div className="dashboard-main">
            {/* Stats */}
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-info">
                  <h3>Total</h3>
                  <div className="stat-number">{stats.total}</div>
                </div>
                <div className="stat-icon">📋</div>
              </div>
              <div className="stat-card">
                <div className="stat-info">
                  <h3>Completed</h3>
                  <div className="stat-number">{stats.completed}</div>
                </div>
                <div className="stat-icon">✅</div>
              </div>
              <div className="stat-card">
                <div className="stat-info">
                  <h3>Pending</h3>
                  <div className="stat-number">{stats.pending}</div>
                </div>
                <div className="stat-icon">⏳</div>
              </div>
              <div className="stat-card">
                <div className="stat-info">
                  <h3>Overdue</h3>
                  <div className="stat-number">{stats.overdue}</div>
                </div>
                <div className="stat-icon">🚨</div>
              </div>
            </div>

            <div className="dashboard-grid">
              {/* Recent Tasks */}
              <div className="dashboard-content">
                <div className="task-list-header">
                  <h2>Recent Tasks</h2>
                  <button className="btn btn-small btn-secondary" onClick={() => setActiveView("all tasks")}>
                    View All ({filteredTasks.length})
                  </button>
                </div>
                <div className="task-list-container">
                  <TaskList
                    tasks={filteredTasks.filter((t) => !t.completed).slice(0, 5)}
                    onEdit={(task) => {
                      setEditingTask(task)
                      setShowForm(true)
                    }}
                    onDelete={deleteTask}
                    onToggleComplete={toggleComplete}
                    getDeadlineStatus={getDeadlineStatus}
                    compact={true}
                  />
                </div>
              </div>

              {/* Filters */}
              <div className="dashboard-sidebar">
                <div className="filters-card">
                  <h3>Quick Filters</h3>
                  <div className="form-group">
                    <select
                      className="form-select"
                      value={filters.category}
                      onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                    >
                      <option value="all">All Categories</option>
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <select
                      className="form-select"
                      value={filters.deadline}
                      onChange={(e) => setFilters({ ...filters, deadline: e.target.value })}
                    >
                      <option value="all">All Deadlines</option>
                      <option value="overdue">Overdue</option>
                      <option value="today">Due Today</option>
                      <option value="week">Due Soon</option>
                      <option value="no-deadline">No Deadline</option>
                    </select>
                  </div>
                  <button
                    className="btn btn-secondary"
                    onClick={() =>
                      setFilters({ category: "all", priority: "all", status: "all", deadline: "all", search: "" })
                    }
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tasks View */}
        {activeView === "all tasks" && (
          <div className="deadline-task-content">
            <div className="task-list-header">
              <h2>List of All Tasks</h2>
            </div>
            <div className="task-list-container">
              <TaskList
                tasks={filteredTasks}
                onEdit={(task) => {
                  setEditingTask(task)
                  setShowForm(true)
                }}
                onDelete={deleteTask}
                onToggleComplete={toggleComplete}
                getDeadlineStatus={getDeadlineStatus}
              />
            </div>
          </div>
        )}

        {/* Deadlines View */}
        {activeView === "deadlines" && (
          <div className="deadline-task-content">
            <div className="task-list-header">
              <h2>Deadline Management</h2>
            </div>
            <div className="task-list-container">
              {criticalTasks.length > 0 && (
                <div>
                  <h3 style={{ color: "#dc2626", marginBottom: "16px" }}>🚨 Critical Tasks</h3>
                  <TaskList
                    tasks={criticalTasks}
                    onEdit={(task) => {
                      setEditingTask(task)
                      setShowForm(true)
                    }}
                    onDelete={deleteTask}
                    onToggleComplete={toggleComplete}
                    getDeadlineStatus={getDeadlineStatus}
                    showDeadlineInfo={true}
                  />
                </div>
              )}
              <h3>All Tasks with Deadlines</h3>
              <TaskList
                tasks={tasks.filter((t) => t.deadline && !t.completed)}
                onEdit={(task) => {
                  setEditingTask(task)
                  setShowForm(true)
                }}
                onDelete={deleteTask}
                onToggleComplete={toggleComplete}
                getDeadlineStatus={getDeadlineStatus}
                showDeadlineInfo={true}
              />
            </div>
          </div>
        )}
      </div>

      {/* Overdue Alert */}
      {stats.overdue > 0 && showFloatingAlert && (
        <div className="floating-alert">
          🚨 {stats.overdue} overdue task{stats.overdue > 1 ? "s" : ""}!
          <button
            className="btn btn-small"
            onClick={() => {
              setActiveView("deadlines")
              setShowFloatingAlert(false)
            }}
          >
            View
          </button>
        </div>
      )}

      {/* Task Form */}
      {showForm && (
        <TaskForm
          task={editingTask}
          categories={CATEGORIES}
          priorities={PRIORITIES}
          onSubmit={editingTask ? updateTask : addTask}
          onCancel={() => {
            setShowForm(false)
            setEditingTask(null)
          }}
        />
      )}
    </div>
  )
}

export default Dashboard
