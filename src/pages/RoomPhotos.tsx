import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Trash2 } from "lucide-react";
import { getCurrentRoom, getRoomNotesPath } from "@/hooks/useRoomQueue";

export default function RoomPhotos() {
  const navigate = useNavigate();
  const { roomType, roomIndex } = useParams<{
    roomType: string;
    roomIndex: string;
  }>();
  const [images, setImages] = useState<string[]>([]);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const MAX_PHOTOS = 10;

  // Get current room info
  const currentRoom = getCurrentRoom();
  const roomName = currentRoom?.name || `${roomType} ${roomIndex}`;
  const storageKey = currentRoom?.storageKey || `${roomType}_${roomIndex}`;

  // Initialize camera on mount
  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Camera access error:", error);
        setCameraError("Unable to access camera. Please check permissions.");
      }
    };

    startCamera();

    // Cleanup on unmount
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;
    if (images.length >= MAX_PHOTOS) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (!context) return;

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw the video frame to the canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert canvas to data URL
    const imageDataUrl = canvas.toDataURL("image/jpeg", 0.9);
    setImages((prev) => [...prev, imageDataUrl]);
  };

  const handleDeleteImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleContinue = () => {
    // Stop camera before navigating
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
    // Save images to localStorage with room-specific key
    localStorage.setItem(`${storageKey}_photos`, JSON.stringify(images));

    // Navigate to condition notes page
    if (currentRoom) {
      navigate(getRoomNotesPath(currentRoom));
    } else {
      navigate(`/report/${roomType}/${roomIndex}/notes`);
    }
  };

  const handleBack = () => {
    // Stop camera before navigating
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
    navigate(-1);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      {/* Mobile container */}
      <div className="relative min-h-screen w-full min-w-[375px] max-w-[430px] bg-white shadow-2xl overflow-hidden">
        {/* Main content wrapper */}
        <div className="flex min-h-screen flex-col">
          {/* Header with back button */}
          <header className="pt-14 pb-4 px-6">
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-slate-100 transition-colors"
              aria-label="Go back"
              onClick={handleBack}
            >
              <ChevronLeft className="h-6 w-6 text-slate-600" />
            </button>
          </header>

          {/* Title Section */}
          <div className="text-center px-6 mb-4">
            <h1 className="text-[20px] font-semibold tracking-[-0.04em] text-slate-900 mb-1">
              {roomName}
            </h1>
            <p className="text-[14px] text-slate-500 tracking-[-0.04em]">
              Take up to {MAX_PHOTOS} photos
            </p>
          </div>

          {/* Camera View */}
          <div className="px-6 mb-4">
            <div className="relative rounded-2xl overflow-hidden">
              {/* Gradient border wrapper */}
              <div
                className="p-[3px] rounded-2xl"
                style={{
                  background:
                    "linear-gradient(135deg, #FDE68A 0%, #A7F3D0 50%, #BAE6FD 100%)",
                }}
              >
                <div className="relative bg-slate-900 rounded-[13px] overflow-hidden h-[450px]">
                  {cameraError ? (
                    <div className="absolute inset-0 flex items-center justify-center p-4">
                      <p className="text-white text-center text-sm">
                        {cameraError}
                      </p>
                    </div>
                  ) : (
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Capture Button */}
          <div className="flex justify-center mb-4 px-6">
            <button
              type="button"
              onClick={handleCapture}
              disabled={images.length >= MAX_PHOTOS || !!cameraError}
              className="h-16 w-16 rounded-full bg-white border-4 border-slate-900 flex items-center justify-center hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Capture photo"
            >
              <div className="h-10 w-10 rounded-full bg-slate-900" />
            </button>
          </div>

          {/* Photo Count */}
          <p className="text-center text-[14px] text-slate-500 mb-4 tracking-[-0.04em] px-6">
            {images.length} of {MAX_PHOTOS} photos taken
          </p>

          {/* Captured Images Grid */}
          {images.length > 0 && (
            <div className="px-6 mb-4">
              <div className="flex flex-wrap gap-2">
                {images.map((image, index) => (
                  <div
                    key={index}
                    className="relative w-[80px] h-[80px] rounded-lg overflow-hidden flex-shrink-0"
                  >
                    <img
                      src={image}
                      alt={`Captured ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteImage(index)}
                      className="absolute top-1 right-1 h-6 w-6 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                      aria-label={`Delete photo ${index + 1}`}
                    >
                      <Trash2 className="h-3 w-3 text-white" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Spacer */}
          <div className="flex-1" />

          {/* Hidden canvas for photo capture */}
          <canvas ref={canvasRef} className="hidden" />

          {/* Footer with Continue button */}
          <footer className="px-6 pb-10 pt-4">
            <Button
              type="button"
              onClick={handleContinue}
              disabled={images.length === 0}
              className="w-full rounded-full h-[56px] text-[16px] font-semibold bg-slate-900 hover:bg-slate-800 disabled:opacity-50"
            >
              Continue
            </Button>
          </footer>
        </div>
      </div>
    </div>
  );
}
