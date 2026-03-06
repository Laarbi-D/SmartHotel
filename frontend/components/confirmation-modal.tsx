"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ConfirmationModal({ isOpen, onClose }: ConfirmationModalProps) {
  const { guest } = useAuth();
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-navy-deep/70 backdrop-blur-md"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
          >
            <div className="bg-white rounded-3xl p-8 md:p-12 max-w-md w-full text-center shadow-2xl border border-border">
              {/* Animated Check Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", damping: 15 }}
                className="relative w-24 h-24 mx-auto mb-8"
              >
                {/* Animated Wave Rings */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: [0.8, 1.5, 2], opacity: [0.5, 0.3, 0] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeOut" }}
                  className="absolute inset-0 rounded-full bg-teal/30"
                />
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: [0.8, 1.3, 1.8], opacity: [0.5, 0.3, 0] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeOut", delay: 0.5 }}
                  className="absolute inset-0 rounded-full bg-teal/20"
                />
                
                {/* Check Circle */}
                <div className="absolute inset-0 rounded-full bg-teal flex items-center justify-center">
                  <motion.div
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                  >
                    <Check className="w-12 h-12 text-white" strokeWidth={3} />
                  </motion.div>
                </div>
              </motion.div>

              {/* Wave Animation SVG */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mb-8"
              >
                <svg viewBox="0 0 200 40" className="w-32 mx-auto">
                  <motion.path
                    d="M0,20 Q50,5 100,20 T200,20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-aqua"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ delay: 0.8, duration: 1 }}
                  />
                  <motion.path
                    d="M0,30 Q50,15 100,30 T200,30"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-copper/60"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ delay: 1, duration: 1 }}
                  />
                </svg>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="font-serif text-3xl md:text-4xl text-navy-deep mb-4"
              >
                Your drink is on the way
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-navy/60 mb-4 leading-relaxed"
              >
                Sit back and relax. Our staff will bring your order shortly.
              </motion.p>

              {guest && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.65 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted border border-border mb-8"
                >
                  <span className="text-navy/60 text-sm">Delivering to</span>
                  <span className="text-navy-deep font-medium">Room {guest.roomNumber}</span>
                </motion.div>
              )}

              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="px-8 py-4 bg-teal text-white font-medium rounded-full hover:bg-teal-light transition-all duration-300"
              >
                Order more drinks
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
