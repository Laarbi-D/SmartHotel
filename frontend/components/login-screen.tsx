"use client";

import React from "react"

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useAuth } from "@/lib/auth-context";
import { WaveDecoration } from "./wave-decoration";

export function LoginScreen() {
  const [name, setName] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Please enter your name");
      return;
    }

    if (!roomNumber.trim()) {
      setError("Please enter your room number");
      return;
    }

    login(name.trim(), roomNumber.trim());
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/imagehotel.png"
          alt="Luxury poolside at sunset"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-deep/60 via-navy-deep/50 to-navy-deep/70" />
      </div>

      {/* Decorative Waves */}
      <div className="absolute bottom-0 left-0 right-0 opacity-20">
        <WaveDecoration />
      </div>

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 md:p-10 shadow-2xl border border-white/50">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex justify-center mb-8"
          >
            <Image
              src="/images/logobarcelo.png"
              alt="Barceló Sevilla Renacimiento"
              width={180}
              height={120}
              className="object-contain"
            />
          </motion.div>

          {/* Welcome Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center mb-8"
          >
            <h1 className="font-serif text-3xl md:text-4xl text-navy-deep mb-2">
              Welcome
            </h1>
            <p className="text-navy/60 text-sm">
              Sign in to order drinks from your sunbed
            </p>
          </motion.div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            {/* Name Field */}
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-navy/60 uppercase tracking-wider"
              >
                Guest Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-5 py-4 bg-muted border border-border rounded-2xl text-navy-deep placeholder:text-navy/40 focus:outline-none focus:ring-2 focus:ring-teal/50 focus:border-teal transition-all duration-300 text-lg"
                autoComplete="name"
              />
            </div>

            {/* Room Number Field */}
            <div className="space-y-2">
              <label
                htmlFor="room"
                className="block text-sm font-medium text-navy/60 uppercase tracking-wider"
              >
                Room Number
              </label>
              <input
                id="room"
                type="text"
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                placeholder="e.g. 301"
                className="w-full px-5 py-4 bg-muted border border-border rounded-2xl text-navy-deep placeholder:text-navy/40 focus:outline-none focus:ring-2 focus:ring-teal/50 focus:border-teal transition-all duration-300 text-lg"
                autoComplete="off"
              />
            </div>

            {/* Error Message */}
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-sm text-center"
              >
                {error}
              </motion.p>
            )}

            {/* Submit Button */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 bg-teal text-white font-medium rounded-full text-lg shadow-lg shadow-teal/20 hover:bg-teal-light transition-all duration-300 mt-6"
            >
              Continue
            </motion.button>
          </motion.form>

          {/* Help Text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-center text-navy/50 text-xs mt-6"
          >
            Need assistance? Contact the front desk
          </motion.p>
        </div>

        {/* Five Stars */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="flex items-center justify-center gap-1 mt-6"
        >
          {[1, 2, 3, 4, 5].map((star) => (
            <svg
              key={star}
              className="w-3 h-3 text-copper"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
