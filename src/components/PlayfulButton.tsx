"use client";

import React from "react";
import { motion } from "framer-motion";

interface PlayfulButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    color?: "green" | "blue" | "orange" | "purple" | "red";
    className?: string;
    disabled?: boolean;
    type?: "button" | "submit" | "reset";
}

const PlayfulButton: React.FC<PlayfulButtonProps> = ({
    children,
    onClick,
    color = "green",
    className = "",
    disabled = false,
    type = "button",
}) => {
    const colorConfigs = {
        green: {
            bg: "bg-[#4CAF50]",
            shadow: "shadow-[0_8px_0_#388E3C]",
            border: "border-[#4CAF50]",
            glow: "from-white/40 to-transparent",
        },
        blue: {
            bg: "bg-[#2196F3]",
            shadow: "shadow-[0_8px_0_#1976D2]",
            border: "border-[#2196F3]",
            glow: "from-white/40 to-transparent",
        },
        orange: {
            bg: "bg-[#FF9800]",
            shadow: "shadow-[0_8px_0_#F57C00]",
            border: "border-[#FF9800]",
            glow: "from-white/40 to-transparent",
        },
        purple: {
            bg: "bg-[#9C27B0]",
            shadow: "shadow-[0_8px_0_#7B1FA2]",
            border: "border-[#9C27B0]",
            glow: "from-white/40 to-transparent",
        },
        red: {
            bg: "bg-[#F44336]",
            shadow: "shadow-[0_8px_0_#D32F2F]",
            border: "border-[#F44336]",
            glow: "from-white/40 to-transparent",
        },
    };

    const config = colorConfigs[color];

    return (
        <motion.button
            type={type}
            onClick={onClick}
            disabled={disabled}
            whileHover={!disabled ? { scale: 1.05, y: -2 } : {}}
            whileTap={!disabled ? { scale: 0.95, y: 4, boxShadow: "none" } : {}}
            className={`
        relative overflow-hidden
        px-8 py-3 rounded-full
        font-black text-white text-xl
        tracking-wide uppercase
        border-4 border-white
        ${config.bg}
        ${!disabled ? config.shadow : "opacity-50 grayscale cursor-not-allowed"}
        transition-all duration-100
        flex items-center justify-center
        ${className}
      `}
            style={{
                boxShadow: !disabled ? `0 8px 0px 0px ${colorConfigs[color].shadow.split('_')[3].replace(']', '')}` : 'none'
            }}
        >
            {/* 3D Inner Content */}
            <span className="relative z-10 drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)]">
                {children}
            </span>

            {/* Glossy Overlay */}
            <div className={`absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b ${config.glow} opacity-100 z-0 pointer-events-none`} />

            {/* Reflection Spot */}
            <div className="absolute top-1.5 left-6 w-8 h-2.5 bg-white/20 rounded-full z-0 blur-[1px] pointer-events-none" />
        </motion.button>
    );
};

export default PlayfulButton;
