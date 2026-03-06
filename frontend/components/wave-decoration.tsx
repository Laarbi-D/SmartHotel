"use client";

import { motion } from "framer-motion";

export function WaveDecoration({ className = "" }: { className?: string }) {
  return (
    <div className={`overflow-hidden pointer-events-none ${className}`}>
      <svg
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        className="w-full h-16 md:h-24"
      >
        <motion.path
          d="M0,60 C200,120 400,0 600,60 C800,120 1000,0 1200,60 L1200,120 L0,120 Z"
          fill="currentColor"
          className="text-teal/10"
          initial={{ d: "M0,60 C200,120 400,0 600,60 C800,120 1000,0 1200,60 L1200,120 L0,120 Z" }}
          animate={{
            d: [
              "M0,60 C200,120 400,0 600,60 C800,120 1000,0 1200,60 L1200,120 L0,120 Z",
              "M0,80 C200,40 400,100 600,40 C800,100 1000,20 1200,80 L1200,120 L0,120 Z",
              "M0,60 C200,120 400,0 600,60 C800,120 1000,0 1200,60 L1200,120 L0,120 Z",
            ],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <motion.path
          d="M0,80 C200,40 400,100 600,40 C800,100 1000,20 1200,80 L1200,120 L0,120 Z"
          fill="currentColor"
          className="text-teal/5"
          initial={{ d: "M0,80 C200,40 400,100 600,40 C800,100 1000,20 1200,80 L1200,120 L0,120 Z" }}
          animate={{
            d: [
              "M0,80 C200,40 400,100 600,40 C800,100 1000,20 1200,80 L1200,120 L0,120 Z",
              "M0,60 C200,100 400,20 600,80 C800,20 1000,100 1200,60 L1200,120 L0,120 Z",
              "M0,80 C200,40 400,100 600,40 C800,100 1000,20 1200,80 L1200,120 L0,120 Z",
            ],
          }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      </svg>
    </div>
  );
}

export function WaveIcon({ className = "" }: { className?: string }) {
  return (
    <motion.svg
      viewBox="0 0 100 40"
      className={`w-24 h-10 ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.path
        d="M0,20 Q25,5 50,20 T100,20"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="text-teal"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />
      <motion.path
        d="M0,28 Q25,13 50,28 T100,28"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="text-navy/40"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, delay: 0.3, ease: "easeInOut" }}
      />
    </motion.svg>
  );
}
