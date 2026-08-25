# SnapTogether Architecture & Technical Overview

## System Overview

SnapTogether is a real-time multiplayer online photo booth web application built with a decoupled React (Vite) frontend, Node.js + Express + Socket.IO backend, HTML5 Canvas strip rendering engine, and WebRTC video streaming mesh.

```
+-----------------------------------------------------------------------+
|                             CLIENT (React/Vite)                        |
|                                                                       |
|  +--------------------+  +--------------------+  +-----------------+  |
|  | WebRTC Media Stream|  | HTML5 Canvas Engine|  |  Zustand Store  |  |
|  +---------+----------+  +---------+----------+  +--------+--------+  |
|            |                       |                      |           |
+------------|-----------------------|----------------------|-----------+
             | WebRTC Peer Video     | Upload / Sync        | WebSocket Signals
             v                       v                      v
+-----------------------------------------------------------------------+
|                             SERVER (Express + Socket.IO)               |
|                                                                       |
|  +-------------------+  +--------------------+  +------------------+  |
|  | Room State Mgr    |  | WebRTC Signaling   |  | Event Broadcaster|  |
|  +-------------------+  +--------------------+  +------------------+  |
+-----------------------------------------------------------------------+
                                     |
                                     v
+-----------------------------------------------------------------------+
|                             STORAGE & DATABASE (Supabase)             |
|                                                                       |
|  +-------------------+                          +-------------------+ |
|  | PostgreSQL DB     |                          | Supabase Storage  | |
|  +-------------------+                          +-------------------+ |
+-----------------------------------------------------------------------+
```

## System Components

### 1. Client Application (`client/`)
- **React 19 & TypeScript**: Component-based user interface.
- **Tailwind CSS v4 & Lucide Icons**: Modern dark glassmorphism aesthetic with micro-animations.
- **Zustand (`useRoomStore.ts`)**: Client-side state management for active user, room details, participant ready states, camera feed, burst photos, active filters, and stickers.
- **HTML5 Canvas Engine (`canvasRenderer.ts`)**: Multi-layer canvas generator rendering high-DPI (2x retina) photo strips, customized with text headers, event dates, themes (Wedding, Birthday, Graduation, Holiday, Minimalist, Y2K), and stickers.
- **WebRTC Peer Integration**: Multi-party WebRTC mesh signaling over Socket.IO to stream live webcam video between participants.

### 2. Backend Server (`server/`)
- **Express & Node.js**: REST API for room management, template retrieval, and gallery uploads.
- **Socket.IO Real-Time Server**: Low-latency event channel broadcasting room status, countdown synchronization (`START_COUNTDOWN`, `COUNTDOWN_TICK`, `SHUTTER_FLASH`), participant presence, and live emoji reactions.
- **Supabase Integration**: Data persistence for users, rooms, templates, photos, and photo strip galleries with in-memory fallback.

## Real-Time Synchronization Protocol

1. **Room Creation / Join**: Participant connects to Socket room `room:{roomCode}`.
2. **Ready Status Toggle**: When all participants are `ready`, host is enabled to click "Start Session".
3. **Synchronized Countdown**:
   - Host emits `start_countdown`.
   - Server broadcasts `countdown_start` to all sockets in the room with target timestamp.
   - Client timers tick in sync (3.. 2.. 1.. Flash!).
   - On `0`, each client snaps photo from local webcam stream and emits `photo_captured`.
4. **Multi-Burst Iteration**: Repeats for specified photo slot count (3, 4, or 6 photos).
5. **Canvas Generation & Sync**: Captured photos are combined on HTML5 Canvas. Resulting photo strip preview is synchronized across participants.

## Security & Reliability
- Room code verification (6-character uppercase alphanumeric code).
- In-memory state recovery if socket temporarily reconnects.
- Automatic virtual camera fallback for environments without physical webcams.
