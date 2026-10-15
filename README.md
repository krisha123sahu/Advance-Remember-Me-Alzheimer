# 🧠 Remember Me — Alzheimer’s Care & Assistance

Remember Me is a full-stack web application designed to support people living with Alzheimer’s disease and help caregivers manage everyday care activities. It brings patient information, familiar-person details, reminders, and AI-assisted support together in one place.

## ✨ Features

- **Patient Profile:** Manage essential patient information and emergency contacts.
- **Memory & People:** Store information about familiar people and their relationships.
- **Smart Reminders:** Manage medicine schedules, appointments, and daily routines.
- **Push Notifications:** Receive care reminders through browser notifications.
- **AI Care Assistant:** Access AI-assisted care support.
- **Face Recognition:** Help identify familiar people using face recognition.
- **Emergency Support:** Provide quick access to important emergency information.

## 🛠️ Tech Stack

| Component | Technology |
|---|---|
| Frontend | React.js, JavaScript, CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas |
| Authentication | Token-based authentication |
| Notifications | Web Push Notifications, Service Worker |
| Face Recognition | Python |
| Version Control | Git and GitHub |

## 📁 Project Structure

```text
Advance-Remember-Me-Alzheimer/
├── client/                  # React frontend
│   ├── public/               # Public assets and service worker
│   └── src/                  # Components, pages and application logic
├── Server/                  # Node.js and Express backend
│   ├── models/               # Database models
│   ├── routes/               # API routes
│   ├── uploads/              # Uploaded files
│   └── reminderScheduler.js  # Scheduled reminder processing
└── .gitignore
```

## ⚙️ Getting Started

### Prerequisites

Install the following tools before running the project:

- Node.js and npm
- MongoDB Atlas account or a compatible MongoDB instance
- Git

Python is also required if you want to run the face-recognition module.

### 1. Clone the Repository

```bash
git clone https://github.com/krisha123sahu/Advance-Remember-Me-Alzheimer.git
cd Advance-Remember-Me-Alzheimer
```

### 2. Configure the Backend

```bash
cd Server
npm install
```

Create a `.env` file inside the `Server` directory and configure the environment variables required by your backend.

Example placeholders:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Add any additional variables required by your existing notification and authentication code. Never commit actual credentials or private keys to GitHub.

Start the backend using the command defined in `Server/package.json`, for example:

```bash
npm start
```

### 3. Configure the Frontend

Open a new terminal:

```bash
cd client
npm install
npm start
```

If your frontend uses a different start script, use the command specified in `client/package.json`.

Configure the frontend API URL to point to your running backend.

### 4. Run the Application

Start the backend and frontend in separate terminals. Open the local URL displayed by the React development server.

Make sure MongoDB is connected and all required environment variables are configured.

## 🔔 Notifications

The application includes browser push notifications and scheduled care reminders. Notifications require appropriate browser permission, valid push configuration, and a reachable backend.

Production deployment may require additional configuration for environment variables, HTTPS, and reliable background scheduling.

## 🔐 Security

- Keep `.env` files and private credentials out of version control.
- Never publish database passwords, authentication secrets, or private push-notification keys.
- Configure production environment variables securely.
- Restrict access to patient information and uploaded files.

## 🚀 Deployment

The application can be deployed by hosting the React frontend and Node.js backend separately and connecting the backend to MongoDB.

Production deployment must also account for notification delivery, scheduled jobs, and the Python face-recognition module.

## 🎯 Project Objective

The goal of Remember Me is to make everyday Alzheimer’s care more organized and accessible by bringing important patient information, memory assistance, and care reminders into a single application.

## 👩‍💻 Author

**Krisha Sahu**

B.Tech — Computer Science Engineering (Data Science)

[GitHub Repository](https://github.com/krisha123sahu/Advance-Remember-Me-Alzheimer)

---

*Remember Me is a care-support application and is not a substitute for professional medical advice or emergency medical services.*

