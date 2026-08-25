# SnapTogether – Real-Time Multiplayer Online Photo Booth

**SnapTogether** is a modern, real-time multiplayer online photo booth web application where users can create virtual event rooms, invite remote friends, capture synchronized multi-shot photos, and generate customizable high-DPI event photo strips inspired by professional wedding and event photo booth layouts.

---

## 📸 Core Features

### 🏢 Room Management & Lobby
- **Create & Join Rooms**: Host creates custom rooms with 6-character room codes (`/join?code=XXXXXX`) or shareable invite links.
- **Host Controls**: Mid-session template switching, custom countdown duration (3s, 5s, 10s), and photo slot counts (3, 4, or 6 shots).
- **Participant Lobby**: Live presence status (Ready / Not Ready), guest list, and role badges.

### 🎥 Camera & Live Effects
- **Webcam Integration**: Real-time webcam preview, mirror toggle, and face framing guide overlay.
- **Virtual Demo Camera**: Automated fallback canvas webcam stream for testing without physical cameras.
- **Live Studio Filters**: Normal, Vintage Sepia, Noir B&W, Cyberpunk, Golden Warmth, Soft Glow, and High Contrast filters.

### ⚡ Real-Time Synchronization (Socket.IO + WebRTC)
- **Synchronized Countdown**: Shutter countdowns tick in sync across all participant screens (`3.. 2.. 1.. Flash!`).
- **Multi-Burst Photo Capture**: Automatic burst snapshot sequence across participant webcams.
- **Interactive Live Room Chat**: Real-time in-room text messaging.
- **Floating Emoji Reactions**: Interactive animated reactions floating across room screens.

### 🎨 Pro HTML5 Canvas Template Engine
- **Curated Event Layouts**:
  - 🖼️ **Clean Studio White** (Crisp pure white polaroid layout with dark typography)
  - 💍 **Wedding Elegance** (Champagne gold borders and romantic script typography)
  - 🎉 **Party Confetti** (Vibrant celebration theme)
  - 🎓 **Class Honors** (Academic blue & gold graduation theme)
  - 🎄 **Holiday Festivities** (Festive pine wreath theme)
  - ✨ **Noir Minimalist** (Sleek dark polaroid aesthetic)
  - ⚡ **Y2K Cyberpunk** (Neon matrix grid layout)
- **Studio Customizer**: Custom header title, subtitle, event date stamp, and drag & place stickers.

### 📥 Export, Printing & Mobile Sharing
- **High-Res Export**: Download as 2x Retina PNG or JPG photo strips.
- **Print Ready**: Dedicated print layout optimized for standard 2" × 6" photo strip paper format.
- **QR Code Download**: Instant mobile scanning QR code modal to view and save photo strips directly on phones.
- **Event Gallery**: Saved photo strip album and guestbook.

---

## 🌐 Deployment Guide (Step-by-Step)

Because SnapTogether uses **Socket.IO** for real-time multiplayer synchronization, deployment is split into two parts:
1. **Frontend (Vercel)**: Hosts the React / Vite application.
2. **Backend Server (Render / Railway)**: Hosts the Node.js + Socket.IO server.

---

### Step 1: Deploy Backend Server (Render or Railway)

WebSockets require a persistent Node server process. You can deploy the backend to [Render.com](https://render.com) or [Railway.app](https://railway.app) for free:

#### Using Render:
1. Push your code to a GitHub repository.
2. Go to [Render Dashboard](https://dashboard.render.com/) and click **New -> Web Service**.
3. Connect your GitHub repository.
4. Set the following settings:
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start`
5. Click **Create Web Service**.
6. Once deployed, copy your backend URL e.g. `https://snaptogether-server.onrender.com`.

---

### Step 2: Deploy Frontend Client to Vercel

1. Log into your [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **Add New -> Project** and import your GitHub repository.
3. In the project setup screen:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Select `client` (Click Edit next to Root Directory and pick `client`).
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Expand **Environment Variables** and add:
   - `VITE_SOCKET_URL` = `https://snaptogether-server.onrender.com` (Your deployed backend URL from Step 1)
   - `VITE_SUPABASE_URL` = *(Optional: Your Supabase Project URL)*
   - `VITE_SUPABASE_ANON_KEY` = *(Optional: Your Supabase Anon Key)*
5. Click **Deploy**! Vercel will build and deploy your app.

---

## 📁 Repository Structure

```txt
snaptogether/
├── client/                     # Frontend Application (React + Vite + TypeScript)
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── components/         # Camera, Room, Photo Strip, and Template UI components
│   │   ├── hooks/              # useCamera, useSocket
│   │   ├── pages/              # Home, CreateRoom, JoinRoom, BoothRoom, Gallery, Profile
│   │   ├── store/              # Zustand room and camera state management
│   │   ├── types/              # TypeScript definitions
│   │   └── utils/              # Canvas rendering engine and template presets
│   ├── package.json
│   ├── vite.config.ts
│   └── vercel.json             # Vercel SPA rewrite config
│
├── server/                     # Backend Application (Node.js + Express + Socket.IO)
│   ├── src/
│   │   ├── config/             # Supabase & in-memory database store
│   │   ├── routes/             # REST API endpoints (rooms, templates)
│   │   ├── sockets/            # Socket.IO room handlers & WebRTC signaling
│   │   └── server.ts           # Server entry point
│   ├── package.json
│   └── tsconfig.json
│
└── docs/                       # System Documentation
    ├── architecture.md         # System architecture & real-time sync protocol
    ├── api.md                  # REST API & Socket.IO specification
    └── database.md             # Supabase PostgreSQL schema
```

---

## 📜 License

MIT License. Designed for live remote celebrations and event photo booths.
