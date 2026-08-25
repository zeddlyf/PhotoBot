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

## 🛠️ Technology Stack

### Frontend (`client/`)
- **Framework**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS v4, Lucide Icons
- **State Management**: Zustand
- **Realtime Connection**: Socket.IO Client
- **Canvas Rendering**: Custom HTML5 Canvas Engine, Canvas-Confetti, QRCode.React

### Backend (`server/`)
- **Runtime**: Node.js, Express, TypeScript
- **Realtime Protocol**: Socket.IO, WebRTC Signaling
- **Database Connection**: Supabase PostgreSQL with in-memory fallback store

---

## 📁 Repository Structure

```txt
snaptogether/
├── client/                     # Frontend Application (React + Vite + TypeScript)
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── components/         # Camera, Room, Photo Strip, and Template UI components
│   │   │   ├── camera/         # CameraPreview, CameraControls, FilterSelector
│   │   │   ├── room/           # ParticipantList, HostControls, LiveChat, EmojiReactions
│   │   │   ├── photobooth/     # CountdownOverlay, PhotoStripCanvas, StickerPicker, PrintModal, QRCodeModal
│   │   │   └── templates/      # TemplateSelector, TemplateCard
│   │   ├── hooks/              # useCamera, useSocket
│   │   ├── pages/              # Home, CreateRoom, JoinRoom, BoothRoom, Gallery, Profile
│   │   ├── store/              # Zustand room and camera state management
│   │   ├── types/              # TypeScript definitions
│   │   └── utils/              # Canvas rendering engine and template presets
│   ├── package.json
│   └── vite.config.ts
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

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### 1. Install Dependencies
```bash
# Install root, server, and client dependencies
npm install
npm run install:all # or cd client && npm install, cd server && npm install
```

### 2. Environment Variables

Create `.env` in `server/`:
```env
PORT=3001
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
```

Create `.env` in `client/`:
```env
VITE_SOCKET_URL=http://localhost:3001
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```
> **Note**: Supabase configuration is optional for local development. An in-memory fallback store runs automatically out of the box if credentials are left blank.

### 3. Run Development Servers
```bash
# Terminal 1: Backend Server (Port 3001)
npm run server

# Terminal 2: Frontend Client (Port 5173)
npm run dev
```

Open **`http://localhost:5173`** in your browser to launch SnapTogether!

### 4. Build for Production
```bash
npm run build
```

---

## 📖 System Documentation

Detailed technical documentation is available in the `docs/` folder:
- 📑 [Architecture Overview](docs/architecture.md)
- 🔌 [API & WebSocket Specifications](docs/api.md)
- 🗄️ [Database Schema & Supabase Config](docs/database.md)

---

## 📜 License

MIT License. Designed for live remote celebrations and event photo booths.
