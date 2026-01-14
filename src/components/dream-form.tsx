"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { VoiceRecorder } from "./voice-recorder";
import { Mic, PenLine, Save, Loader2 } from "lucide-react";

interface DreamFormProps {
  onSubmit: (data: {
    transcript: string;
    moodBefore?: number;
    stressLevel?: number;
    sleepQuality?: number;
  }) => Promise<void>;
}

export function DreamForm({ onSubmit }: DreamFormProps) {
  const [mode, setMode] = useState<"voice" | "text">("voice");
  const [transcript, setTranscript] = useState("");
  const [moodBefore, setMoodBefore] = useState<number>(5);
  const [stressLevel, setStressLevel] = useState<number>(5);
  const [sleepQuality, setSleepQuality] = useState<number>(5);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showMetrics, setShowMetrics] = useState(false);

  const handleVoiceRecording = async (audioBlob: Blob) => {
    setIsProcessing(true);
    try {
      // Convert blob to base64
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = async () => {
        const base64Audio = reader.result as string;

        // Send to transcription API
        const response = await fetch("/api/transcribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ audio: base64Audio }),
        });

        if (!response.ok) throw new Error("Transcription failed");

        const { transcript: transcribedText } = await response.json();
        setTranscript(transcribedText);
        setShowMetrics(true);
        setIsProcessing(false);
      };
    } catch (error) {
      console.error("Error processing recording:", error);
      setIsProcessing(false);
      alert("Failed to process recording. Please try again.");
    }
  };

  const handleSubmit = async () => {
    if (!transcript.trim()) return;

    setIsProcessing(true);
    try {
      await onSubmit({
        transcript,
        moodBefore,
        stressLevel,
        sleepQuality,
      });
      // Reset form
      setTranscript("");
      setShowMetrics(false);
      setMoodBefore(5);
      setStressLevel(5);
      setSleepQuality(5);
    } catch (error) {
      console.error("Error saving dream:", error);
      alert("Failed to save dream. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const SliderInput = ({
    label,
    value,
    onChange,
    emoji,
  }: {
    label: string;
    value: number;
    onChange: (v: number) => void;
    emoji: string;
  }) => (
    <div className="space-y-3">
      <div className="flex justify-between items-center text-sm">
        <span className="text-muted-foreground font-medium">{label}</span>
        <span className="text-base">{emoji}</span>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-xs text-muted-foreground font-medium">1</span>
        <input
          type="range"
          min="1"
          max="10"
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="flex-1 h-1.5 bg-muted rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-background [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110"
        />
        <span className="text-xs text-muted-foreground font-medium">10</span>
      </div>
    </div>
  );

  return (
    <div className="bg-card text-card-foreground">
      
      {/* Mode toggle */}
      <div className="flex items-center border-b border-border p-2 bg-background/50">
        <button
          onClick={() => setMode("voice")}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            mode === "voice"
              ? "bg-card text-foreground shadow-sm border border-border"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          }`}
        >
          <Mic className="w-4 h-4" /> Voice
        </button>
        <button
          onClick={() => setMode("text")}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            mode === "text"
              ? "bg-card text-foreground shadow-sm border border-border"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          }`}
        >
          <PenLine className="w-4 h-4" /> Text
        </button>
      </div>

      <div className="p-6">
        <AnimatePresence mode="wait">
          {mode === "voice" && !showMetrics ? (
            <motion.div
              key="voice"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="py-12 flex flex-col items-center justify-center"
            >
              <VoiceRecorder
                onRecordingComplete={handleVoiceRecording}
                isProcessing={isProcessing}
              />
              <p className="mt-8 text-muted-foreground text-sm text-center max-w-xs mx-auto">
                 Tap to record. Speak naturally about your dream. We'll transcribe it instantly.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="text"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              {/* Transcript */}
              <div className="space-y-3">
                <Textarea
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                  placeholder="I was walking through a library made of glass..."
                  className="min-h-[200px] bg-background border-border text-lg text-foreground placeholder:text-muted-foreground focus:border-ring resize-none p-4 rounded-xl leading-relaxed"
                />
              </div>

              {/* Metrics */}
              <div className="space-y-6 pt-6 border-t border-border">
                <SliderInput
                  label="Mood before sleep"
                  value={moodBefore}
                  onChange={setMoodBefore}
                  emoji={moodBefore > 7 ? "😊" : moodBefore > 4 ? "😐" : "😔"}
                />
                <SliderInput
                  label="Stress level"
                  value={stressLevel}
                  onChange={setStressLevel}
                  emoji={stressLevel > 7 ? "😰" : stressLevel > 4 ? "😐" : "😌"}
                />
                <SliderInput
                  label="Sleep quality"
                  value={sleepQuality}
                  onChange={setSleepQuality}
                  emoji={sleepQuality > 7 ? "😴" : sleepQuality > 4 ? "😐" : "😫"}
                />
              </div>

              {/* Submit button */}
              <Button
                onClick={handleSubmit}
                disabled={!transcript.trim() || isProcessing}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 text-sm font-medium rounded-full mt-4 disabled:opacity-50 transition-colors border border-transparent"
              >
                {isProcessing ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                {isProcessing ? "Processing..." : "Save Entry"}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
