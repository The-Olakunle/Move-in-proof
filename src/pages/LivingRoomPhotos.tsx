import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Trash2 } from "lucide-react";

export default function LivingRoomPhotos() {
  const navigate = useNavigate();
  const [images, setImages] = useState<string[]>([]);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const MAX_PHOTOS = 10;

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
    // Save images to localStorage and navigate to condition notes page
    localStorage.setItem("livingRoomPhotos", JSON.stringify(images));
    navigate("/report/living-room/notes");
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
      <div className="relative min-h-screen w-full min-w-[375px] max-w-[430px] bg-white shadow-2xl">
        {/* Main content wrapper */}
        <div className="flex min-h-screen flex-col px-6">
          {/* Header with back button */}
          <header className="pt-14 pb-4">
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
          <div className="mb-6 text-center">
            <h1 className="text-[24px] font-bold tracking-[-0.04em] text-slate-950 mb-2">
              Living room photos
            </h1>
            <p className="text-[14px] text-slate-500 tracking-[-0.04em]">
              Add up to {MAX_PHOTOS} photos of your living room.
            </p>
          </div>

          {/* Camera Capture Area */}
          <div className="mb-6">
            {/* Gradient border wrapper */}
            <div
              className="rounded-[16px] p-[6px]"
              style={{
                background: "linear-gradient(90deg, #FDF2F8 0%, #EFF6FF 100%)",
              }}
            >
              <div className="relative bg-slate-900 rounded-[16px] h-[450px] flex items-end justify-center pb-6 overflow-hidden">
                {/* Live Camera Feed */}
                {cameraError ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
                    <p className="text-[14px] text-slate-500 text-center px-6">
                      {cameraError}
                    </p>
                  </div>
                ) : (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                )}

                {/* Hidden canvas for capturing photos */}
                <canvas ref={canvasRef} className="hidden" />

                {/* Shutter Button */}
                <button
                  type="button"
                  onClick={handleCapture}
                  disabled={images.length >= MAX_PHOTOS || !!cameraError}
                  className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-white hover:bg-slate-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    boxShadow:
                      "0 0 0 4px rgba(255,255,255,0.3), 0 4px 12px rgba(0,0,0,0.3)",
                  }}
                  aria-label="Take photo"
                >
                  <div className="h-12 w-12 rounded-full bg-white border-4 border-slate-200" />
                </button>
              </div>
            </div>
          </div>

          {/* Images Section */}
          <div className="flex-1 mb-6">
            {images.length === 0 ? (
              /* Empty State */
              <div className="bg-slate-50 rounded-xl py-4 px-6">
                <p className="text-[14px] text-slate-400 text-center tracking-[-0.04em]">
                  Images will show here when uploaded
                </p>
              </div>
            ) : (
              /* Image Grid */
              <div className="flex flex-wrap gap-2">
                {images.map((image, index) => (
                  <div key={index} className="relative w-[80px] h-[80px]">
                    <img
                      src={image}
                      alt={`Living room photo ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    {/* Delete Button */}
                    <button
                      type="button"
                      onClick={() => handleDeleteImage(index)}
                      className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-white shadow-md hover:bg-slate-50 transition-colors"
                      aria-label={`Delete photo ${index + 1}`}
                    >
                      <Trash2 className="h-3 w-3 text-slate-600" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Photo count indicator */}
          {images.length > 0 && (
            <p className="text-[12px] text-slate-500 text-center mb-4 tracking-[-0.04em]">
              {images.length} of {MAX_PHOTOS} photos added
            </p>
          )}

          {/* Continue Button */}
          <footer className="pb-10 pt-2">
            <Button
              type="button"
              onClick={handleContinue}
              disabled={images.length === 0}
              className="w-full rounded-full h-[56px] text-[16px] font-semibold bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 disabled:cursor-not-allowed"
            >
              Continue
            </Button>
          </footer>
        </div>
      </div>
    </div>
  );
}
