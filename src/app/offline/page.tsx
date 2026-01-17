"use client";

import { motion } from "framer-motion";
import { WifiOff, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        <div className="w-20 h-20 mx-auto bg-muted rounded-full flex items-center justify-center mb-8">
          <WifiOff className="w-10 h-10 text-muted-foreground" />
        </div>
        
        <h1 className="font-serif text-4xl text-foreground mb-4">
          You're Offline
        </h1>
        
        <p className="text-muted-foreground mb-8 leading-relaxed">
          It looks like you've lost your internet connection. Don't worry – your dreams are safely stored. 
          Reconnect to continue exploring your subconscious.
        </p>
        
        <Button
          onClick={() => window.location.reload()}
          className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </Button>
        
        <p className="text-xs text-muted-foreground mt-8">
          Dream Journal works best with an internet connection for AI analysis and cloud sync.
        </p>
      </motion.div>
    </div>
  );
}
