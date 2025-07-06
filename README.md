# Smart Task Manager

A React-based task management application with deadlines, categories, and responsive design.

## Features

- ✅ **Add, Edit, Delete Tasks** - Full CRUD operations with intuitive forms
- ⏰ **Smart Deadlines** - Set deadlines with visual alerts for overdue tasks
- ✅ **Task Completion** - Mark tasks as completed with visual feedback
- 🏷️ **Categories** - Organize tasks by Work, Personal, Learning, Health, Finance
- 🔍 **Search & Filter** - Find tasks quickly with search and category filters
- 📱 **Mobile Responsive** - Works perfectly on all screen sizes

## Tech Stack

- **Frontend**: React 18 with Hooks
- **Styling**: CSS3 with CSS Grid and Flexbox
- **Data Storage**: localStorage (browser storage)
- **Build Tool**: Create React App

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm

### Steps
1. Clone or download this project
2. Install dependencies:
   npm install

3. Start the development server:
npm start

4. Open http://localhost:3000 in your browser

## Assumptions Made

- **Single User**: Application designed for one user per browser session
- **Browser Storage**: Tasks are stored locally using localStorage (no backend required)
- **Modern Browsers**: Assumes support for ES6+, CSS Grid, and Flexbox
- **No Authentication**: No user login/logout system needed for this prototype
- **Sample Data**: Provides initial sample tasks for first-time users
- **Real-time Updates**: Deadline calculations update dynamically without page refresh


## Future Improvements

### High Priority

- **User Authentication** - Login/logout system with user sessions
- **Cloud Database** - Firebase/Supabase integration for cross-device sync
- **Push Notifications** - Browser notifications for approaching deadlines

### Medium Priority

- **Drag & Drop** - Reorder tasks and change priorities visually
- **Export/Import** - Backup and restore tasks as JSON/CSV
- **Dark Mode** - Theme switching for better user experience

### Nice to Have

- Team Collaboration
- Time Tracking
- Analytics Dashboard
- Voice Input