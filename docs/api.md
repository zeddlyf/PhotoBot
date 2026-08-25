# SnapTogether API & WebSocket Specifications

## REST API Endpoints

### 1. Health & System
- **GET `/api/health`**
  - **Response**: `{ status: "ok", timestamp: string }`

### 2. Rooms
- **POST `/api/rooms`**
  - **Body**: `{ hostName: string, roomName: string, category: string, maxPhotos: number, countdownDuration: number }`
  - **Response**: `{ roomCode: string, roomId: string, hostId: string }`

- **GET `/api/rooms/:code`**
  - **Response**: `{ id: string, code: string, hostId: string, status: "lobby" | "capturing" | "editing" | "finished", members: Array, templateId: string }`

- **POST `/api/rooms/:code/join`**
  - **Body**: `{ username: string }`
  - **Response**: `{ user: { id: string, username: string }, room: Object }`

### 3. Templates & Assets
- **GET `/api/templates`**
  - **Response**: Array of available templates:
    `[ { id: string, name: string, category: string, primaryColor: string, frameStyle: string, headerText: string } ]`

### 4. Photo Strip Gallery
- **POST `/api/galleries`**
  - **Body**: `{ roomId: string, finalImageUrl: string, photoCount: number, templateId: string }`
  - **Response**: `{ galleryId: string, shareUrl: string }`

- **GET `/api/galleries/:id`**
  - **Response**: `{ gallery: Object, photos: Array }`

---

## Socket.IO Events

### Client -> Server Events

| Event | Payload | Description |
|-------|---------|-------------|
| `join_room` | `{ roomCode: string, userId: string, username: string }` | Join room socket channel |
| `leave_room` | `{ roomCode: string, userId: string }` | Leave room |
| `toggle_ready` | `{ roomCode: string, isReady: boolean }` | Toggle participant ready status |
| `update_template` | `{ roomCode: string, templateId: string }` | Host updates active template |
| `start_session` | `{ roomCode: string }` | Host initiates photo session countdown |
| `photo_captured` | `{ roomCode: string, slotIndex: number, photoDataUrl: string }` | Send captured slot image |
| `send_chat` | `{ roomCode: string, message: string }` | Send room text message |
| `send_reaction` | `{ roomCode: string, emoji: string }` | Broadcast floating emoji reaction |
| `webrtc_signal` | `{ roomCode: string, targetUserId: string, signal: any }` | WebRTC peer negotiation signal |

### Server -> Client Events

| Event | Payload | Description |
|-------|---------|-------------|
| `room_state_updated` | `{ room: Object, members: Array }` | Updated room state & member status |
| `countdown_started` | `{ seconds: number, totalSlots: number }` | Triggers synchronized countdown UI |
| `countdown_tick` | `{ currentSecond: number }` | Countdown second tick |
| `shutter_snap` | `{ slotIndex: number }` | Trigger shutter flash and snap photo |
| `chat_received` | `{ id: string, userId: string, username: string, text: string, timestamp: string }` | Chat broadcast |
| `reaction_received`| `{ userId: string, emoji: string }` | Emoji animation broadcast |
| `webrtc_signal` | `{ senderUserId: string, signal: any }` | Forward WebRTC signal to peer |
