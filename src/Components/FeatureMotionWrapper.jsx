"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

export default function FeatureMotionWrapper({ children, index }) {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef(null);

    // Simplified random function with smaller range
    const getRandomDirection = (index, min, max) => {
        const seed = Math.sin(index + 42) * 10000;
        return Math.floor((seed - Math.floor(seed)) * (max - min + 1)) + min;
    };

    useEffect(() => {
        const currentRef = ref.current;
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsVisible(entry.isIntersecting);
            },
            {
                threshold: 0.1,
                rootMargin: "50px", // Preload animations slightly before they're visible
            }
        );

        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, []);

    return (
        <motion.div
            ref={ref}
            initial={{
                x: getRandomDirection(index, -100, 100), // Reduced range
                y: getRandomDirection(index, -100, 100), // Reduced range
                opacity: 0,
            }}
            animate={isVisible ? {
                x: 0,
                y: 0,
                opacity: 1,
            } : {
                x: getRandomDirection(index, -100, 100),
                y: getRandomDirection(index, -100, 100),
                opacity: 0,
            }}
            transition={{
                type: "spring", // Changed to spring for smoother motion
                stiffness: 100,
                damping: 12,
                duration: 0.3, // Reduced base duration
                delay: index * 0.05, // Reduced delay between items
            }}
        >
            {children}
        </motion.div>
    );
}