# Sunsama Clone

A personal task management and time-blocking application inspired by Sunsama. Built to improve knowledge of full-stack development and solve my own productivity challenges.

![License](https://img.shields.io/badge/license-MIT-blue.svg)

## ✨ Features

- **Task Management** - Create, edit, complete, and delete tasks
- **Daily Planning** - Plan which tasks you'll work on today
- **Visual Time Blocking** - Drag and drop tasks into hourly time slots
- **Time Estimates** - Assign time estimates to tasks and track your day
- **Daily Summary** - See total planned time and percentage of day scheduled
- **Smart Organization** - Unscheduled tasks automatically appear in a separate list

## 🚀 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** - Fast build tool
- **Tailwind CSS v4** - Utility-first styling
- **React Query** - Server state management
- **@dnd-kit** - Modern drag and drop
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

1. **Create Tasks** - Click "All Tasks" and use the form to add new tasks
2. **Plan Your Day** - Click "Plan for Today" to add tasks to your daily list
3. **Time Block** - Drag tasks from "Unscheduled" to specific time slots on the timeline
4. **Track Progress** - Check off tasks as you complete them
5. **Reorganize** - Drag tasks between time slots or back to unscheduled

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
  startTime    String?
  timeEstimate Int?
  userId       String
  user         User      @relation(...)
}
```

## 🚧 Current Limitations

- Single user only (temporary hardcoded user)
- No authentication yet
- Timeline fixed to 8 AM - 5 PM
- No mobile app (web only for now)
- No calendar integrations yet

## 🗺️ Roadmap

### Near Term
- [ ] User authentication (JWT)
- [ ] Customizable timeline hours
- [ ] Pomodoro timer
- [ ] Task notes and subtasks
- [x] Keyboard shortcuts

### Future
- [ ] Google Calendar integration
- [ ] Objectives/Projects system
- [ ] Week view
- [ ] Recurring tasks
- [ ] Mobile app (React Native)
- [ ] Email/Slack integrations

## 🤝 Contributing

This is primarily a personal learning project, but suggestions and feedback are welcome! Feel free to:
- Open issues for bugs or feature requests
- Fork and experiment
- Share your own implementations

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by [Sunsama](https://sunsama.com)
- Built while practicing full-stack development
- Thanks to the React, Prisma, and @dnd-kit communities

## 📧 Contact

Morgan Welch - [@welch5788](https://github.com/welch5788)

---

**Note:** This is a personal project built for learning purposes. It is not affiliated with or endorsed by Sunsama.
