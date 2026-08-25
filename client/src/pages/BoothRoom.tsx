import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRoomStore } from '../store/useRoomStore';
import { useCamera } from '../hooks/useCamera';
import { useSocket } from '../hooks/useSocket';
import { CameraPreview } from '../components/camera/CameraPreview';
import { CameraControls } from '../components/camera/CameraControls';
import { FilterSelector } from '../components/camera/FilterSelector';
import { ParticipantList } from '../components/room/ParticipantList';
import { HostControls } from '../components/room/HostControls';
import { LiveChat } from '../components/room/LiveChat';
import { EmojiReactions } from '../components/room/EmojiReactions';
import { CountdownOverlay } from '../components/photobooth/CountdownOverlay';
import { PhotoStripCanvas } from '../components/photobooth/PhotoStripCanvas';
import { StickerPicker } from '../components/photobooth/StickerPicker';
import { PrintModal } from '../components/photobooth/PrintModal';
import { QRCodeModal } from '../components/photobooth/QRCodeModal';
import { TemplateSelector } from '../components/templates/TemplateSelector';
import { DEFAULT_TEMPLATES } from '../utils/templates';
import { Copy, Check, Sparkles, User, Users } from 'lucide-react';

export const BoothRoom: React.FC = () => {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();

  const {
    currentUser,
    room,
    selectedTemplate,
    setSelectedTemplate,
    currentSlotIndex
  } = useRoomStore();

  const {
    videoRef,
    stream,
    startCamera,
    startVirtualCamera,
    stopCamera,
    captureSnapshot
  } = useCamera();

  const {
    toggleReady,
    updateTemplate,
    startSession,
    sendPhotoCaptured,
    sendChatMessage,
    sendReaction,
    retakeSession
  } = useSocket(code);

  const [copiedLink, setCopiedLink] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [qrShareUrl, setQrShareUrl] = useState('');

  // Initial redirect if no user identity exists
  useEffect(() => {
    if (!currentUser && code) {
      navigate(`/join?code=${code}`);
    }
  }, [currentUser, code, navigate]);

  const hasAutoStartedRef = React.useRef(false);

  // Auto-start camera once on initial room entry
  useEffect(() => {
    if (currentUser && !hasAutoStartedRef.current) {
      hasAutoStartedRef.current = true;
      startCamera();
    }
  }, [currentUser, startCamera]);

  // Sync selected template from room state
  useEffect(() => {
    if (room?.templateId) {
      const found = DEFAULT_TEMPLATES.find(t => t.id === room.templateId);
      if (found) setSelectedTemplate(found);
    }
  }, [room?.templateId, setSelectedTemplate]);

  // Role-based Capture handling on shutter snap (Solo vs Turn-based vs Synchronized Dual)
  const isShutterFlashing = useRoomStore(state => state.isShutterFlashing);
  useEffect(() => {
    if (isShutterFlashing && currentUser && room) {
      const activeTurn = room.activeTurn || 'both';
      const isHost = currentUser.isHost;
      const isSolo = room.boothMode === 'solo' || room.members.length === 1 || activeTurn === 'solo';

      const template = DEFAULT_TEMPLATES.find(t => t.id === room.templateId) || DEFAULT_TEMPLATES[0];
      const isDual = !isSolo && template.captureMode === 'synchronized_dual';

      if (isSolo) {
        // Solo Mode: Capture currentSlotIndex directly
        const snap = captureSnapshot();
        if (snap) {
          sendPhotoCaptured(currentSlotIndex, snap);
        }
      } else if (isDual) {
        // Dual Synchronized (8-Cut & Dual 4-Cut): Host -> Left Slot, Joiner -> Right Slot
        const snap = captureSnapshot();
        if (snap) {
          const targetSlot = isHost ? currentSlotIndex : currentSlotIndex + 1;
          sendPhotoCaptured(targetSlot, snap);
        }
      } else {
        // Turn-based 4-Cut: Only capture & upload if it is your active turn!
        const isMyTurn = (activeTurn === 'host' && isHost) || (activeTurn === 'joiner' && !isHost) || activeTurn === 'both';
        if (isMyTurn) {
          const snap = captureSnapshot();
          if (snap) {
            sendPhotoCaptured(currentSlotIndex, snap);
          }
        }
      }
    }
  }, [isShutterFlashing, captureSnapshot, sendPhotoCaptured, currentSlotIndex, currentUser, room]);

  if (!room || !currentUser) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="flex items-center gap-3 text-rose-400">
          <Sparkles className="h-6 w-6 animate-spin" />
          <span className="text-sm font-semibold">Connecting to Photo Booth Room...</span>
        </div>
      </div>
    );
  }

  const isHost = room.members.find(m => m.id === currentUser.id)?.isHost || false;
  const myReadyStatus = room.members.find(m => m.id === currentUser.id)?.readyStatus || false;
  const allMembersReady = room.members.length > 0 && room.members.every(m => m.readyStatus);
  const isSoloMode = room.boothMode === 'solo' || room.members.length === 1;

  const handleCopyLink = () => {
    const inviteUrl = `${window.location.origin}/join?code=${room.roomCode}`;
    navigator.clipboard.writeText(inviteUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleOpenQRModal = (url: string) => {
    setQrShareUrl(url);
    setIsQRModalOpen(true);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Room Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl glass-panel p-4 border border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-zinc-100">{room.roomName}</h1>
            <span className="rounded-full bg-rose-500/20 px-2.5 py-0.5 text-[11px] font-bold text-rose-300 border border-rose-500/30 uppercase flex items-center gap-1">
              {isSoloMode ? <User className="h-3 w-3" /> : <Users className="h-3 w-3" />}
              <span>{isSoloMode ? 'SOLO MODE' : 'DUO MODE'}</span>
            </span>
          </div>
          <p className="text-xs text-zinc-400">Room Code: <span className="font-bold text-zinc-200 tracking-wider">{room.roomCode}</span></p>
        </div>

        {/* Copy Invite Link */}
        {!isSoloMode && (
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-2 rounded-xl bg-zinc-800 px-4 py-2.5 text-xs font-semibold text-zinc-200 hover:bg-zinc-700 transition-all"
          >
            {copiedLink ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4 text-rose-400" />}
            <span>{copiedLink ? 'Invite Link Copied!' : 'Copy Invite Link'}</span>
          </button>
        )}
      </div>

      {/* Floating Emoji Reaction Bar */}
      <EmojiReactions onSendReaction={sendReaction} />

      {/* Synchronized Countdown Overlay */}
      <CountdownOverlay />

      {/* Main View Switcher: Lobby vs Editing Phase */}
      {room.status === 'editing' || room.status === 'finished' ? (
        <div className="space-y-6">
          <PhotoStripCanvas
            onOpenPrintModal={() => setIsPrintModalOpen(true)}
            onOpenQRModal={handleOpenQRModal}
            onRetake={retakeSession}
          />
          <StickerPicker />
        </div>
      ) : (
        /* Lobby View */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Main Camera Feed & Controls */}
          <div className="lg:col-span-8 space-y-6">
            <CameraPreview
              videoRef={videoRef}
              stream={stream}
              username={currentUser.username}
              isHost={isHost}
              readyStatus={myReadyStatus}
            />

            <CameraControls
              onStartCamera={startCamera}
              onStopCamera={stopCamera}
              onStartVirtualCamera={startVirtualCamera}
              onToggleReady={toggleReady}
              isReady={myReadyStatus}
            />

            <FilterSelector />

            {/* Template Selector for Host / Members */}
            <TemplateSelector
              templates={DEFAULT_TEMPLATES}
              selectedTemplateId={selectedTemplate?.id || room.templateId}
              onSelectTemplate={(t) => {
                setSelectedTemplate(t);
                if (isHost) updateTemplate(t.id);
              }}
            />
          </div>

          {/* Right Sidebar: Host Controls, Participants, Chat */}
          <div className="lg:col-span-4 space-y-6">
            {isHost && (
              <HostControls
                room={room}
                onStartSession={startSession}
                allMembersReady={allMembersReady}
              />
            )}

            <ParticipantList
              members={room.members}
              currentUserId={currentUser.id}
            />

            <LiveChat
              messages={room.chatMessages}
              onSendMessage={sendChatMessage}
              currentUserId={currentUser.id}
            />
          </div>
        </div>
      )}

      {/* Modals */}
      <PrintModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
      />

      <QRCodeModal
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
        shareUrl={qrShareUrl}
      />
    </div>
  );
};
