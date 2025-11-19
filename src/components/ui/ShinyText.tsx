import React from "react";

interface ShinyTextProps {
  text: string;
  disabled?: boolean;
  speed?: number;       // seconds (lower = faster)
  className?: string;
}

const ShinyText: React.FC<ShinyTextProps> = ({
  text,
  disabled = false,
  speed = 5,
  className = "",
}) => {
  const duration = `${speed}s`;
  const animation = `shine ${duration} linear infinite`;

  // Combine a base gradient + white sweep on top so you keep your gold look + shine.
  const bg = `linear-gradient(120deg,
      rgba(255,255,255,0) 30%,
      rgba(255,255,255,1) 50%,
      rgba(255,255,255,0) 70%),
    var(--gradient-primary)`;

  return (
    <span
      className={`inline-block bg-clip-text text-transparent ${className}`}
      style={{
        backgroundImage: bg,
        backgroundSize: "200% 100%",
        WebkitBackgroundClip: "text",
        // ensure we set the animation directly so duration is exactly what you pass
        animation: disabled ? "none" : animation,
        WebkitAnimation: disabled ? "none" : animation,
      }}
    >
      {text}
    </span>
  );
};

export default ShinyText;
