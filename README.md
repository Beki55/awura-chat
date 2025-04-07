# 🔐 Realtime Chat App with Firebase & Redux

A fully functional real-time chat application built with **React**, **Firebase**, and **Redux Toolkit**. This app supports user authentication (Google & Email/Password), protected routing, and real-time messaging using Firestore.

---

## 🚀 Features

- 🔐 **Protected Routes**: Only authenticated users can access main chat features. Unauthenticated users are redirected to `/auth`.
- 🧑‍🤝‍🧑 **Authentication**:
  - Google Sign-in
  - Email & Password Sign-in
  - Email Verification for Email/Password accounts
- 💬 **Realtime Chat**:
  - One-to-one chat with real-time updates using Firestore listeners
  - Typing and sending messages with auto-scroll to last message
- 🗂 **State Management**:
  - Handled globally using Redux Toolkit
- 🔥 **Backend**:
  - Firebase Authentication
  - Firestore Database

---

## 🛠 Tech Stack

| Tech            | Purpose                     |
|-----------------|-----------------------------|
| React           | Frontend UI                 |
| Firebase Auth   | User Authentication         |
| Firestore       | Real-time chat data storage |
| Redux Toolkit   | Global state management     |
| React Router    | Routing and protected pages |
| Tailwind CSS    | Styling                     |

---

## 🧭 Routes Overview

| Route         | Access         | Description                    |
|---------------|----------------|--------------------------------|
| `/auth`       | Public only    | Login/Register page            |
| `/`           | Authenticated  | Home or chat list              |
| `/chat/:id`   | Authenticated  | Individual chat window         |

> ✅ All routes (except `/auth`) are protected. Unauthenticated users are redirected to `/auth`.

---

## 🔐 Authentication Logic

- When a user logs in:
  - Google users are signed in directly
  - Email/Password users are required to verify their email before accessing protected routes
- Firebase handles token management and session persistence
- Redux stores the current user data globally

---

## 🧠 State Management

This app uses **Redux Toolkit** for handling:
- Auth state (current user)
- Chat state (messages, current chatId, loading)
- Realtime updates via Firestore listeners

---

## 🔥 Firestore Structure

- Chats are auto-created when two users start a conversation
- Messages are stored as subcollections under each chat

---

### 📥 Clone the Repository

```bash
git clone https://github.com/Beki55/awura-chat.git
cd awura-chat
npm install 
npm run dev
``` 