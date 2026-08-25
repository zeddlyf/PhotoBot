# SnapTogether Database Schema (Supabase PostgreSQL)

## Entity Relationship Diagram & Tables

### 1. `users`
Stores user profile information.
```sql
CREATE TABLE public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 2. `rooms`
Stores photo booth session rooms.
```sql
CREATE TABLE public.rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_code VARCHAR(10) UNIQUE NOT NULL,
  host_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  room_name TEXT NOT NULL DEFAULT 'Snap Party',
  template_id TEXT NOT NULL DEFAULT 'wedding_champagne',
  status VARCHAR(20) NOT NULL DEFAULT 'lobby', -- 'lobby', 'capturing', 'editing', 'finished'
  max_photos INTEGER DEFAULT 4,
  countdown_seconds INTEGER DEFAULT 3,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_rooms_code ON public.rooms(room_code);
```

### 3. `room_members`
Junction table tracking room participants and ready status.
```sql
CREATE TABLE public.room_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID REFERENCES public.rooms(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  ready_status BOOLEAN DEFAULT FALSE,
  is_host BOOLEAN DEFAULT FALSE,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(room_id, user_id)
);
```

### 4. `templates`
Presets for photo strip layouts and frames.
```sql
CREATE TABLE public.templates (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category VARCHAR(50) NOT NULL, -- 'wedding', 'birthday', 'graduation', 'holiday', 'minimalist', 'y2k'
  thumbnail_url TEXT,
  frame_url TEXT,
  config JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 5. `photos`
Individual captured shots per session.
```sql
CREATE TABLE public.photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID REFERENCES public.rooms(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  position INTEGER NOT NULL, -- Slot index 0..3
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 6. `galleries`
Merged high-res final photo strip renders.
```sql
CREATE TABLE public.galleries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID REFERENCES public.rooms(id) ON DELETE CASCADE,
  final_image_url TEXT NOT NULL,
  template_id TEXT NOT NULL,
  event_name TEXT,
  guest_messages JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Row Level Security (RLS) & Storage
- Storage buckets: `photo-strips`, `avatars`, `custom-templates`.
- Public read access for generated galleries via unique URL.
