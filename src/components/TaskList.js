"use client"

import { useState } from "react"
import "./TaskList.css"

const TaskList = ({
  tasks,
  onEdit,
  onDelete,
  onToggleComplete,
  getDeadlineStatus,
  compact = false,
  showDeadlineInfo = false,
}) => {
  const [sortBy, setSortBy] = useState("deadline")

  const sortedTasks = [...tasks].sort((a, b) => {
    switch (sortBy) {
      case "deadline":
        if (!a.deadline && !b.deadline) return 0
        if (!a.deadline) return 1
        if (!b.deadline) return -1
        return new Date(a.deadline) - new Date(b.deadline)
      case "priority":
        const priorityOrder = { high: 3, medium: 2, low: 1 }
        return priorityOrder[b.priority] - priorityOrder[a.priority]
      default:
        return 0
    }
  })

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "#ef4444"
      case "medium":
        return "#f59e0b"
      case "low":
        return "#10b981"
      default:
        return "#6b7280"
    }
  }

  const getCategoryIcon = (category) => {
    const icons = { Work: "💼", Personal: "🏠", Learning: "📚", Health: "🏥", Finance: "💰" }
    return icons[category] || "📋"
  }

  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>📝</div>
        <p>No tasks found</p>
      </div>
    )
  }

  return (
    <div className="task-list">
      <div className="task-items">
        {sortedTasks.map((task) => {
          const deadlineInfo = getDeadlineStatus ? getDeadlineStatus(task.deadline) : null
          const isUrgent = deadlineInfo?.urgent

          return (
            <div
              key={task.id}
              className={`task-item ${task.completed ? "completed" : ""} ${compact ? "compact" : ""}`}
              style={{
                borderLeft: isUrgent ? "4px solid #ef4444" : "4px solid transparent",
                background: isUrgent ? "rgba(239, 68, 68, 0.02)" : "white",
              }}
            >
              <div className="task-content">
                <div className="task-header">
                  <button className="task-checkbox" onClick={() => onToggleComplete(task.id)}>
                    {task.completed ? "✅" : "⭕"}
                  </button>
                  <div className="task-info">
                    <h4 className={task.completed ? "completed" : ""}>{task.title}</h4>
                    {!compact && task.description && <p className="task-description">{task.description}</p>}
                    <div className="task-meta">
                      <span className="badge" style={{ background: getPriorityColor(task.priority) + "20" }}>
                        {getCategoryIcon(task.category)} {task.category}
                      </span>
                      <span className="badge" style={{ background: getPriorityColor(task.priority) + "20" }}>
                        {task.priority}
                      </span>
                      {deadlineInfo && (
                        <span
                          className="badge"
                          style={{
                            background: isUrgent ? "#ef444420" : "#6b728020",
                            color: isUrgent ? "#dc2626" : "#374151",
                          }}
                        >
                          {isUrgent && "🚨"} {deadlineInfo.text}
                        </span>
                      )}
                    </div>
                    {showDeadlineInfo && task.deadline && (
                      <div className="deadline-info">
                        📅 {new Date(task.deadline).toLocaleDateString()} at{" "}
                        {new Date(task.deadline).toLocaleTimeString()}
                      </div>
                    )}
                  </div>
                </div>
                <div className="task-actions">
                  <button onClick={() => onEdit(task)}>✏️</button>
                  <button onClick={() => onDelete(task.id)} style={{ color: "#dc2626" }}>
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default TaskList
