# Recipe Collection App

A full-stack web application for managing your recipe collection with full CRUD (Create, Read, Update, Delete) functionality.

## Project Overview

This application allows users to:
- **Create** new recipes with details like ingredients, instructions, prep time, and cook time
- **Read** and view all saved recipes
- **Update** existing recipe information
- **Delete** recipes from the collection

## Tech Stack

### Frontend
- **React** - UI library
- **Vite** - Build tool and development server
- Modern React Hooks (useState, useEffect)

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **PostgreSQL** - Relational database

## Project Structure

```
recipe-project/
├── frontend/          # React application
├── backend/           # Express API server
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository
2. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```

3. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

### Development

Start the frontend development server:
```bash
cd frontend
npm run dev
```

Start the backend server:
```bash
cd backend
npm start
```

## Features

- ✅ Full CRUD operations
- ✅ React components with hooks
- ✅ RESTful API
- ✅ PostgreSQL database integration
- ✅ Environment variable configuration

## License

ISC

