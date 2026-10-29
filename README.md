# ⚡ QuickChat

A real-time, responsive full-stack messaging web application built with **React**, **Vite**, **Firebase**, and **Cloudinary**.

---

## 🌐 Live Demo & Deployments

- **Frontend (Live)**: [https://chat-app-cd37a.web.app](https://chat-app-cd37a.web.app)
- **Alternative Mirror**: [https://chat-app-cd37a.firebaseapp.com](https://chat-app-cd37a.firebaseapp.com)
- **Backend API (Render)**: [https://chatapp-gravitek.onrender.com](https://chatapp-gravitek.onrender.com)

---

## ✨ Features

- 🔐 **Authentication**: User sign up, login, and password reset via Firebase Authentication.
- 💬 **Real-time Messaging**: Instant, bidirectional messaging powered by Cloud Firestore real-time snapshot listeners.
- 🖼️ **Media & Image Sharing**:
  - Secure signed Cloudinary image uploads generated via the Node.js Express backend.
  - Image attachments displayed directly within the chat conversation stream.
- 👤 **User Profiles**: Custom avatars, bio customization, and online/last-seen status indicators.
- 📱 **Responsive Design**: Clean, modern interface designed for desktop and mobile screen viewports.
- 🚀 **High-Performance Hosting**: Fast global CDN distribution with single-page application (SPA) routing via Firebase Hosting.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Routing**: [React Router DOM v7](https://reactrouter.com/)
- **State & Realtime Sync**: React Context API + Cloud Firestore Listeners
- **Notifications**: [React Toastify](https://fkhadra.github.io/react-toastify/)
- **Hosting**: [Firebase Hosting](https://firebase.google.com/docs/hosting)

### Backend
- **Runtime**: [Node.js](https://nodejs.org/) & [Express](https://expressjs.com/)
- **Cloud Media**: [Cloudinary SDK](https://cloudinary.com/) (server-side signature generation for secure direct browser-to-cloud uploads)
- **Hosting**: [Render](https://render.com/)

### Database & Auth
- **Database**: Cloud Firestore (NoSQL realtime document store)
- **Auth**: Firebase Authentication (Email/Password)

---

## 📁 Project Structure

```text
QuickChat/
├── Frontend/                 # React + Vite application
│   ├── src/
│   │   ├── components/       # Chat UI components (Chatbox, Sidebar, etc.)
│   │   ├── Pages/            # Login, Chat, and ProfileUpdate views
│   │   ├── context/          # AppContext state management
│   │   └── config/           # Firebase initialization & helper functions
│   ├── firebase.json         # Firebase Hosting & Firestore rules configuration
│   ├── firestore.rules       # Firestore security rules
│   └── .firebaserc           # Firebase project link
│
├── Backend/                  # Express API service
│   ├── index.js              # Server entry point & Cloudinary signature endpoint
│   └── cloudinary.js         # Cloudinary configuration
│
└── README.md                 # Project documentation
```

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js (v18+)
- npm or yarn

### 1. Clone the repository
```bash
git clone https://github.com/ojus1245/QuickChat.git
cd QuickChat
```

### 2. Backend Setup
```bash
cd Backend
npm install
```
Create a `.env` file in the `Backend/` directory:
```env
PORT=5000
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```
Run the backend:
```bash
node index.js
```

### 3. Frontend Setup
```bash
cd ../Frontend
npm install
```
Create a `.env` file in the `Frontend/` directory:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_BACKEND_URL=http://localhost:5000
```
Run the frontend development server:
```bash
npm run dev
```

---

## 📦 Deployment

### Deploying Frontend to Firebase Hosting
```bash
cd Frontend
npm run build
npx firebase-tools deploy --only hosting
```

### Deploying Firestore Rules
```bash
cd Frontend
npx firebase-tools deploy --only firestore:rules
```

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
