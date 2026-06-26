import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Target launch date - November 19, 2026 at 00:00 Local Time
const TARGET_DATE = new Date('2026-11-19T00:00:00').getTime();

export default function Countdown() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = TARGET_DATE - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  // Avoid hydration mismatch by not rendering until mounted
  if (!isMounted) return null;

  return (
    <div className="relative flex flex-col items-center justify-center w-full">
      {/* Intro Neon Line */}
      <motion.div
        initial={{ width: 0, opacity: 1 }}
        animate={{ width: '100%', opacity: 0 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[2px] bg-fuchsia-500 shadow-[0_0_15px_#d946ef,0_0_30px_#d946ef] z-30"
      />

      {/* Countdown Blocks Container */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.15,
              delayChildren: 1.2, // Wait for neon line animation
            },
          },
        }}
        className="grid grid-cols-2 gap-x-8 gap-y-10 md:flex md:space-x-12 lg:space-x-16 md:gap-0 place-items-center"
      >
        <TimeUnit value={timeLeft.days} label="DÍAS" isDays />
        <TimeUnit value={timeLeft.hours} label="HORAS" />
        <TimeUnit value={timeLeft.minutes} label="MINUTOS" />
        <TimeUnit value={timeLeft.seconds} label="SEGUNDOS" />
      </motion.div>
    </div>
  );
}

function TimeUnit({ value, label, isDays = false }: { value: number; label: string; isDays?: boolean }) {
  // Format to 2 digits (or 3 for days if required)
  const formattedValue = isDays 
    ? value.toString().padStart(3, '0') 
    : value.toString().padStart(2, '0');

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, scale: 0.8, filter: 'blur(20px)' },
        visible: { 
          opacity: 1, 
          scale: 1, 
          filter: 'blur(0px)',
          transition: { duration: 0.8, ease: "easeOut" }
        },
      }}
      className="group flex flex-col items-center cursor-default z-40"
      whileHover={{ scale: 1.05 }}
      transition={{ type: "tween", ease: "easeOut", duration: 0.3 }}
    >
      <div className="relative flex items-center justify-center 
                      text-white text-[13vw] sm:text-6xl md:text-8xl lg:text-9xl font-black 
                      tabular-nums
                      drop-shadow-[0_0_25px_rgba(34,211,238,0.9)] drop-shadow-[0_5px_15px_rgba(0,0,0,1)]
                      group-hover:drop-shadow-[0_0_50px_rgba(217,70,239,1)]
                      transition-all duration-300 h-[1.2em]">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={value}
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "-100%", opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 25,
              mass: 1,
            }}
            className="block"
          >
            {formattedValue}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="mt-4 text-[10px] md:text-sm text-gray-300 uppercase tracking-[5px] md:tracking-[8px] opacity-70 group-hover:opacity-100 transition-opacity duration-300">
        {label}
      </span>
    </motion.div>
  );
}
