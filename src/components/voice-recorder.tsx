"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Mic, Square, Loader2 } from "lucide-react";

interface VoiceRecorderProps {
  onRecordingComplete: (audioBlob: Blob) => void;
  isProcessing?: boolean;
}

export function VoiceRecorder({
  onRecordingComplete,
  isProcessing = false,
}: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const updateAudioLevel = useCallback(() => {
    if (analyserRef.current) {
      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
      analyserRef.current.getByteFrequencyData(dataArray);
      const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
      setAudioLevel(average / 255);
    }
    animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Setup audio analyser for visualization
      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;

      // Setup media recorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm;codecs=opus",
      });

      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
        onRecordingComplete(audioBlob);

        // Cleanup
        stream.getTracks().forEach((track) => track.stop());
        audioContext.close();
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        setAudioLevel(0);
      };

      mediaRecorder.start(100);
      setIsRecording(true);
      setDuration(0);

      // Start timer
      timerRef.current = setInterval(() => {
        setDuration((d) => d + 1);
      }, 1000);

      // Start audio level visualization
      updateAudioLevel();
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Could not access microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col items-center gap-8">
      {/* Recording button with pulsing animation */}
      <div className="relative">
        {/* Outer glow rings */}
        <AnimatePresence>
          {isRecording && (
            <>
              <motion.div
                initial={{ scale: 1, opacity: 0 }}
                animate={{
                  scale: [1, 1.2 + audioLevel * 0.4],
                  opacity: [0.1, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
                className="absolute inset-0 rounded-full bg-primary"
              />
              <motion.div
                initial={{ scale: 1, opacity: 0 }}
                animate={{
                  scale: [1, 1.1 + audioLevel * 0.2],
                  opacity: [0.2, 0],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "easeOut",
                  delay: 0.2,
                }}
                className="absolute inset-0 rounded-full bg-primary"
              />
            </>
          )}
        </AnimatePresence>

        {/* Main button */}
        <Button
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isProcessing}
          className={`relative w-24 h-24 rounded-full transition-all duration-300 flex items-center justify-center ${
            isRecording
              ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl border-none"
              : "bg-card hover:bg-card/80 text-foreground border border-border hover:border-primary/50"
          } ${isProcessing ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <AnimatePresence mode="wait">
            {isProcessing ? (
              <motion.div
                key="processing"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <Loader2 className="w-8 h-8 animate-spin text-foreground" />
              </motion.div>
            ) : isRecording ? (
              <motion.div
                key="stop"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <Square className="w-8 h-8 fill-current" />
              </motion.div>
            ) : (
              <motion.div
                key="mic"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                 <Mic className="w-8 h-8" />
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </div>

      {/* Status text */}
      <AnimatePresence mode="wait">
        {isProcessing ? (
          <motion.div
            key="processing"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col items-center gap-2"
          >
            <p className="text-foreground font-medium tracking-wide">Processing...</p>
            <p className="text-muted-foreground text-sm">Translating your subconscious</p>
          </motion.div>
        ) : isRecording ? (
          <motion.div
            key="recording"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col items-center gap-2"
          >
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-2 h-2 bg-red-500 rounded-full"
              />
              <span className="text-foreground font-mono text-xl tracking-wider">
                {formatDuration(duration)}
              </span>
            </div>
            <p className="text-muted-foreground text-sm">Listening...</p>
          </motion.div>
        ) : (
          <motion.p
            key="idle"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-muted-foreground text-sm"
          >
            Tap the mic to record your dream
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
