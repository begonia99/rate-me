"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { MAX_FILE_SIZE } from "@/lib/constants";
import { I18nStrings } from "@/lib/i18n";

interface UploadZoneProps {
  onFileSelect: (file: File, base64: string) => void;
  preview: string | null;
  strings: I18nStrings;
  isKoko: boolean;
}

export default function UploadZone({
  onFileSelect,
  preview,
  strings,
  isKoko,
}: UploadZoneProps) {
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  }, []);

  const startCamera = useCallback(async () => {
    setError(null);
    setCapturedImage(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      });
      streamRef.current = stream;
      setCameraActive(true);
      // Wait for next render so videoRef is mounted
      requestAnimationFrame(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      });
    } catch {
      setError("Camera access denied. Please upload a photo instead.");
    }
  }, []);

  const capturePhoto = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d")!.drawImage(video, 0, 0);
    const base64 = canvas.toDataURL("image/jpeg", 0.9);
    setCapturedImage(base64);
    stopCamera();
  }, [stopCamera]);

  const usePhoto = useCallback(() => {
    if (!capturedImage) return;
    // Convert base64 to Blob directly (avoids fetch issues on some browsers)
    const parts = capturedImage.split(",");
    const byteString = atob(parts[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([ab], { type: "image/jpeg" });
    const file = new File([blob], "selfie.jpg", { type: "image/jpeg" });
    onFileSelect(file, capturedImage);
    setCapturedImage(null);
  }, [capturedImage, onFileSelect]);

  const retakePhoto = useCallback(() => {
    setCapturedImage(null);
    startCamera();
  }, [startCamera]);

  const processFile = useCallback(
    (file: File) => {
      setError(null);

      const isImage =
        file.type.startsWith("image/") ||
        /\.(jpe?g|png|gif|webp|heic|heif|bmp|svg)$/i.test(file.name);
      if (!isImage) {
        setError(strings.invalidFile);
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        setError(strings.fileTooLarge);
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        onFileSelect(file, base64);
      };
      reader.readAsDataURL(file);
    },
    [onFileSelect, strings]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    // Reset so selecting the same file triggers onChange again
    e.target.value = "";
  };

  // Cleanup camera on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  if (preview) {
    return (
      <div className="w-full">
        <div className="flex items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-8">
          <img
            src={preview}
            alt="Preview"
            className="max-h-64 rounded-lg object-contain"
          />
        </div>
      </div>
    );
  }

  // Mobile: camera capture flow
  if (isMobile && (cameraActive || capturedImage)) {
    return (
      <div className="w-full">
        <div className="overflow-hidden rounded-2xl border-2 border-gray-300">
          {cameraActive && (
            <div className="relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full rounded-t-2xl"
                style={{ transform: "scaleX(-1)" }}
              />
              <div className="flex justify-center gap-3 p-4">
                <button
                  onClick={capturePhoto}
                  className={`rounded-full px-6 py-3 font-semibold text-white shadow-lg ${
                    isKoko
                      ? "bg-[#FF6B8A] hover:bg-[#e55a79]"
                      : "bg-gray-900 hover:bg-gray-800"
                  }`}
                >
                  Capture
                </button>
                <button
                  onClick={stopCamera}
                  className="rounded-full border border-gray-300 px-6 py-3 font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
          {capturedImage && (
            <div className="relative">
              <img
                src={capturedImage}
                alt="Captured"
                className="w-full rounded-t-2xl"
                style={{ transform: "scaleX(-1)" }}
              />
              <div className="flex justify-center gap-3 p-4">
                <button
                  onClick={usePhoto}
                  className={`rounded-full px-6 py-3 font-semibold text-white shadow-lg ${
                    isKoko
                      ? "bg-[#FF6B8A] hover:bg-[#e55a79]"
                      : "bg-gray-900 hover:bg-gray-800"
                  }`}
                >
                  Use this
                </button>
                <button
                  onClick={retakePhoto}
                  className="rounded-full border border-gray-300 px-6 py-3 font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Retake
                </button>
              </div>
            </div>
          )}
        </div>
        {error && (
          <p className="mt-2 text-center text-sm text-red-500">{error}</p>
        )}
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Mobile: Camera primary, upload secondary */}
      {isMobile && (
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={startCamera}
            className={`flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-5 text-lg font-semibold text-white shadow-lg transition-all ${
              isKoko
                ? "bg-[#FF6B8A] hover:bg-[#e55a79]"
                : "bg-gray-900 hover:bg-gray-800"
            }`}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
            Take a Selfie
          </button>
          <button
            onClick={() => inputRef.current?.click()}
            className="text-sm font-medium text-gray-500 underline hover:text-gray-700"
          >
            Upload a photo
          </button>
        </div>
      )}

      {/* Desktop: Upload zone (unchanged) */}
      {!isMobile && (
        <div
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          className={`relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 transition-all ${
            isDragging
              ? isKoko
                ? "border-[#FF6B8A] bg-pink-50"
                : "border-gray-900 bg-gray-50"
              : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
          }`}
        >
          <div className="mb-3 text-4xl text-gray-400">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </div>
          <p className="font-medium text-gray-700">{strings.uploadTitle}</p>
          <p className="mt-1 text-sm text-gray-500">
            {strings.uploadSubtitle}
          </p>
          <p className="mt-1 text-xs text-gray-400">{strings.uploadHint}</p>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
      />
      {error && (
        <p className="mt-2 text-center text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}
