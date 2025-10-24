# Sunsama Clone

A personal task management and time-blocking application inspired by Sunsama. Built to refresh/develop full-stack development knowledge and solve my own productivity challenges.

![License](https://img.shields.io/badge/license-MIT-blue.svg)

## ✨ Features

### Task Management
- **Create, edit, complete, and delete tasks** - Full CRUD operations
- **Time estimates** - Assign estimated duration to tasks
- **Due dates** - Track deadlines
- **Task descriptions** - Add detailed notes

### Daily Planning
- **Today view** - Focus on today's planned tasks
- **Plan for Today** - Drag tasks from backlog to today
- **Smart rescheduling** - Automatically surface tasks from past dates
- **Daily summary** - See total time, scheduled vs unscheduled breakdown

### Visual Time Blocking
- **Drag and drop scheduling** - Drag tasks into hourly time slots
- **Task duration blocks** - Tasks scale visually based on time estimates
- **Multi-hour spanning** - Long tasks seamlessly span multiple hours
- **Overlap detection** - Visual warnings when tasks conflict
- **Current time indicator** - Red line shows where you are in your day

### Customization
- **Customizable timeline hours** - Set your work day (6 AM - 10 PM range)
- **Persistent settings** - Preferences saved locally

### Productivity Features
- **Keyboard shortcuts** - Navigate and create tasks without the mouse
  - `N` - Create new task
  - `T` - Switch to Today view
  - `A` - Switch to All Tasks view
  - `Escape` - Close modals
- **Unscheduled task list** - See what still needs to be time-blocked

## 🚀 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** - Fast build tool
- **Tailwind CSS v4** - Utility-first styling
- **React Query** - Server state management
- **@dnd-kit** - Modern drag and drop
- **Zustand** - Lightweight state management
- **Axios** - HTTP client

### Backend
- **Node.js** with Express
- **TypeScript** - Type safety
- **Prisma ORM** - Database toolkit
- **PostgreSQL** - Database (via Supabase)

### Infrastructure
- **Supabase** - Hosted PostgreSQL
- **Monorepo** - npm workspaces
- **Git** - Version control

## 📁 Project Structure
```
sunsama-clone/
├── client/                 # React frontend
│   ├── src/
│   │   ├── api/           # API client functions
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Full page views
│   │   ├── hooks/         # Custom React hooks
│   │   ├── store/         # Zustand state management
│   │   ├── types/         # TypeScript types
│   │   └── utils/         # Helper functions
│   └── package.json
├── server/                # Express backend
│   ├── src/
│   │   ├── routes/        # API routes
│   │   └── utils/         # Helper functions
│   ├── prisma/
│   │   └── schema.prisma  # Database schema
│   └── package.json
└── package.json           # Root workspace config
```

## 🛠️ Setup & Installation

### Prerequisites
- Node.js 22+ 
- npm or pnpm
- Supabase account (free tier works)

### 1. Clone the Repository
```bash
git clone https://github.com/welch5788/sunsama-clone.git
cd sunsama-clone
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Database
1. Create a project on [Supabase](https://supabase.com)
2. Get your database connection string from Project Settings → Database
3. Create `server/.env`:
```env
DATABASE_URL="your-supabase-connection-string"
PORT=3001
NODE_ENV=development
```

### 4. Run Database Migrations
```bash
cd server
npx prisma db push
```

### 5. Set Up Frontend Environment
Create `client/.env`:
```env
VITE_API_URL=http://localhost:3001
```

### 6. Start Development Servers
From the root directory:
```bash
npm run dev
```

This starts both frontend (port 5173) and backend (port 3001).

## 🎯 Usage

### Getting Started
1. **Create Tasks** - Click "New Task" button or press `N`
2. **Add Time Estimates** - Assign how long each task will take
3. **Plan Your Day** - Click "Plan for Today" to add tasks to your daily list
4. **Time Block** - Drag tasks from "Unscheduled" to specific time slots on the timeline
5. **Track Progress** - Check off tasks as you complete them
6. **Customize** - Click ⚙️ to set your work hours

### Keyboard Shortcuts
- `N` - Create new task
- `T` - Switch to Today view
- `A` - Switch to All Tasks view
- `Escape` - Close any open modal

### Tips
- **Overlapping tasks** turn orange - reschedule to avoid conflicts
- **Past tasks** can be rescheduled with the "Reschedule for Today" button
- **The red line** shows your current time in the timeline
- **Drag tasks between time slots** to reorganize your day

## 📊 Database Schema
```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String?
  password  String
  tasks     Task[]
}

model Task {
  id           String    @id @default(uuid())
  title        String
  description  String?
  completed    Boolean   @default(false)
  dueDate      DateTime?
  plannedDate  DateTime?
  startTime    String?      # "09:00", "14:30", etc.
  timeEstimate Int?         # Minutes
  userId       String
  user         User      @relation(...)
}
```

## 🚧 Current Limitations

- Single user only (temporary hardcoded user)
- No authentication yet
- No mobile app (web only for now)
- No calendar integrations yet
- No recurring tasks

## 🗺️ Roadmap

### Near Term
- [ ] User authentication (JWT)
- [ ] Pomodoro timer integration
- [ ] Task notes and subtasks
- [ ] Week view for planning ahead

### Future
- [ ] Google Calendar integration
- [ ] Objectives/Projects system
- [ ] Recurring tasks
- [ ] Mobile app (React Native)
- [ ] Email/Slack integrations
- [ ] Team collaboration features

## 🤝 Contributing

This is primarily a personal learning project, but suggestions and feedback are welcome! Feel free to:
- Open issues for bugs or feature requests
- Fork and experiment
- Share your own implementations

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by [Sunsama](https://sunsama.com)
- Thanks to the React, Prisma, and @dnd-kit communities

## 📧 Contact

Morgan Welch - [@welch5788](https://github.com/welch5788)

---

**Note:** This is a personal project built for learning purposes. It is not affiliated with or endorsed by Sunsama.
