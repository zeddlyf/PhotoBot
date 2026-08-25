import { useState, useEffect, useRef, useCallback } from 'react';
import { useRoomStore } from '../store/useRoomStore';

export function useCamera() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const {
    isCameraActive,
    setCameraActive,
    usingVirtualCamera,
    setUsingVirtualCamera,
    mirrorCamera
  } = useRoomStore();

  // Sync stream to videoRef
  useEffect(() => {
    if (videoRef.current) {
      if (isCameraActive && stream) {
        if (videoRef.current.srcObject !== stream) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
      } else {
        videoRef.current.srcObject = null;
      }
    }
  }, [stream, isCameraActive]);

  // Start Virtual Demo Camera
  const startVirtualCamera = useCallback(() => {
    setUsingVirtualCamera(true);
    setCameraActive(true);
    setHasPermission(true);

    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 480;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;

    let animFrame: number;
    let angle = 0;

    const renderVirtual = () => {
      angle += 0.03;
      
      const gradient = ctx.createLinearGradient(0, 0, 640, 480);
      gradient.addColorStop(0, '#1e1b4b');
      gradient.addColorStop(0.5, '#4c1d95');
      gradient.addColorStop(1, '#831843');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 640, 480);

      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(320, 240, 110 + Math.sin(angle) * 8, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#18181b';
      ctx.beginPath();
      ctx.arc(280, 210, 14, 0, Math.PI * 2);
      ctx.arc(360, 210, 14, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(320, 240, 50, 0.1 * Math.PI, 0.9 * Math.PI);
      ctx.lineWidth = 10;
      ctx.strokeStyle = '#18181b';
      ctx.stroke();

      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.font = 'bold 20px "Space Grotesk", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('📷 VIRTUAL DEMO WEBCAM', 320, 430);

      animFrame = requestAnimationFrame(renderVirtual);
    };

    renderVirtual();

    const virtualStream = canvas.captureStream(30);
    setStream(virtualStream);
  }, [setCameraActive, setUsingVirtualCamera]);

  // Start Physical Camera
  const startCamera = useCallback(async () => {
    try {
      setCameraError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        },
        audio: false
      });

      setStream(mediaStream);
      setHasPermission(true);
      setCameraActive(true);
      setUsingVirtualCamera(false);
    } catch (err: any) {
      console.warn('Physical camera access failed, switching to Virtual Demo Camera fallback', err);
      setCameraError(err.message || 'Camera permission denied or unavailable');
      setHasPermission(false);
      startVirtualCamera();
    }
  }, [setCameraActive, setUsingVirtualCamera, startVirtualCamera]);

  // Stop Camera Stream
  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
    setUsingVirtualCamera(false);
  }, [stream, setCameraActive, setUsingVirtualCamera]);

  // Capture Snapshot Frame Data URL
  const captureSnapshot = useCallback((): string => {
    const canvas = document.createElement('canvas');
    canvas.width = 1280;
    canvas.height = 720;
    const ctx = canvas.getContext('2d');

    if (!ctx) return '';

    if (videoRef.current && (videoRef.current.readyState >= 2 || usingVirtualCamera)) {
      if (mirrorCamera && !usingVirtualCamera) {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
      }

      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    } else {
      ctx.fillStyle = '#27272a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 36px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('SNAPTOGETHER PHOTO', canvas.width / 2, canvas.height / 2);
    }

    return canvas.toDataURL('image/jpeg', 0.92);
  }, [mirrorCamera, usingVirtualCamera]);

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  return {
    videoRef,
    canvasRef,
    stream,
    hasPermission,
    cameraError,
    startCamera,
    startVirtualCamera,
    stopCamera,
    captureSnapshot
  };
}
