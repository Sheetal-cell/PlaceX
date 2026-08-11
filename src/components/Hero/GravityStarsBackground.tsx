import React, { useEffect, useRef, useState } from "react";

interface GravityStarsBackgroundProps {
  starsCount?: number;
  starsSize?: number;
  starsOpacity?: number;
  glowIntensity?: number;
  glowAnimation?: "ease" | "none";
  movementSpeed?: number;
  mouseInfluence?: number;
  mouseGravity?: "attract" | "repel";
  gravityStrength?: number;
  starsInteraction?: boolean;
  starsInteractionType?: "grab" | "connect" | "none";
}

interface Star {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  originalAlpha: number;
  pulseSpeed: number;
  pulsePhase: number;
}

export const GravityStarsBackground: React.FC<GravityStarsBackgroundProps> = ({
  starsCount = 85,
  starsSize = 1.8,
  starsOpacity = 0.75,
  glowIntensity = 12,
  glowAnimation = "ease",
  movementSpeed = 0.25,
  mouseInfluence = 120,
  mouseGravity = "attract",
  gravityStrength = 70,
  starsInteraction = false,
  starsInteractionType = "none"
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const mouseRef = useRef({ x: 0, y: 0, active: false });
  const [reducedMotion, setReducedMotion] = useState(false);
  const starColorRef = useRef("#FFFDF8");
  const isLightRef = useRef(false);

  // Detect prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);
    const handleQueryChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handleQueryChange);
    return () => mediaQuery.removeEventListener("change", handleQueryChange);
  }, []);

  // Update dynamic color based on container computed text style
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateColor = () => {
      const isLight = document.documentElement.classList.contains("light");
      isLightRef.current = isLight;
      // Use Deep Moss #182015 for light theme, Soft White #FFFDF8 for dark theme
      starColorRef.current = isLight ? "#182015" : "#FFFDF8";
    };

    updateColor();

    const observer = new MutationObserver(updateColor);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"]
    });

    return () => observer.disconnect();
  }, []);

  // Mouse move listener
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
      mouseRef.current.active = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const rect = canvas.getBoundingClientRect();
        mouseRef.current.x = e.touches[0].clientX - rect.left;
        mouseRef.current.y = e.touches[0].clientY - rect.top;
        mouseRef.current.active = true;
      }
    };

    const handleTouchEnd = () => {
      mouseRef.current.active = false;
    };

    window.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);
    canvas.addEventListener("touchmove", handleTouchMove, { passive: true });
    canvas.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      canvas.removeEventListener("touchmove", handleTouchMove);
      canvas.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  // Main Canvas loop and resize management
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    const initStars = (width: number, height: number) => {
      const count = reducedMotion ? Math.min(starsCount, 30) : starsCount;
      const stars: Star[] = [];
      for (let i = 0; i < count; i++) {
        const sizeRandom = Math.random();
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.5,
          size: 0.5 + sizeRandom * 0.8,
          alpha: 0.3 + Math.random() * 0.7,
          originalAlpha: 0.3 + Math.random() * 0.7,
          pulseSpeed: 0.01 + Math.random() * 0.02,
          pulsePhase: Math.random() * Math.PI * 2
        });
      }
      starsRef.current = stars;
    };

    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
      initStars(width, height);
    };

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    resizeObserver.observe(canvas);
    handleResize();

    const draw = () => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      ctx.clearRect(0, 0, width, height);

      const color = starColorRef.current;
      const dSpeed = reducedMotion ? 0.05 : movementSpeed;

      starsRef.current.forEach((star) => {
        // Move star
        star.x += star.vx * dSpeed;
        star.y += star.vy * dSpeed;

        // Apply mouse gravity influence
        if (mouseRef.current.active && !reducedMotion) {
          const dx = mouseRef.current.x - star.x;
          const dy = mouseRef.current.y - star.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < mouseInfluence && dist > 1) {
            const pct = 1 - dist / mouseInfluence;
            const force = pct * (gravityStrength / 500);

            if (mouseGravity === "attract") {
              star.vx += (dx / dist) * force;
              star.vy += (dy / dist) * force;
            } else {
              star.vx -= (dx / dist) * force;
              star.vy -= (dy / dist) * force;
            }

            // Cap velocity
            const currentSpeed = Math.sqrt(star.vx * star.vx + star.vy * star.vy);
            if (currentSpeed > 6) {
              star.vx = (star.vx / currentSpeed) * 6;
              star.vy = (star.vy / currentSpeed) * 6;
            }
          }
        }

        // Apply drag/friction to return to stable float speed
        star.vx *= 0.98;
        star.vy *= 0.98;

        // Add back minor random force to keep stars alive
        if (Math.abs(star.vx) < 0.1) star.vx += (Math.random() - 0.5) * 0.1;
        if (Math.abs(star.vy) < 0.1) star.vy += (Math.random() - 0.5) * 0.1;

        // Wrap around boundaries
        if (star.x < -10) star.x = width + 10;
        if (star.x > width + 10) star.x = -10;
        if (star.y < -10) star.y = height + 10;
        if (star.y > height + 10) star.y = -10;

        // Apply glow easing/pulsation animation
        if (glowAnimation === "ease" && !reducedMotion) {
          star.pulsePhase += star.pulseSpeed;
          star.alpha = star.originalAlpha * (0.6 + 0.4 * Math.sin(star.pulsePhase));
        } else {
          star.alpha = star.originalAlpha;
        }

        // Draw glow (disable shadow blur in light mode to keep dark stars crisp and visible)
        ctx.save();
        if (glowIntensity > 0 && !reducedMotion && !isLightRef.current) {
          ctx.shadowBlur = glowIntensity * star.size;
          ctx.shadowColor = color;
        }

        ctx.fillStyle = color;
        ctx.globalAlpha = star.alpha * starsOpacity;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size * starsSize, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Render lines connecting stars if connect option is active
      if (starsInteraction && starsInteractionType === "connect" && !reducedMotion) {
        ctx.save();
        ctx.strokeStyle = color;
        for (let i = 0; i < starsRef.current.length; i++) {
          for (let j = i + 1; j < starsRef.current.length; j++) {
            const s1 = starsRef.current[i];
            const s2 = starsRef.current[j];
            const dx = s1.x - s2.x;
            const dy = s1.y - s2.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 80) {
              const alpha = (1 - dist / 80) * 0.15 * starsOpacity;
              ctx.globalAlpha = alpha;
              ctx.lineWidth = 0.5;
              ctx.beginPath();
              ctx.moveTo(s1.x, s1.y);
              ctx.lineTo(s2.x, s2.y);
              ctx.stroke();
            }
          }
        }
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
    };
  }, [
    starsCount,
    starsSize,
    starsOpacity,
    glowIntensity,
    glowAnimation,
    movementSpeed,
    mouseInfluence,
    mouseGravity,
    gravityStrength,
    starsInteraction,
    starsInteractionType,
    reducedMotion
  ]);

  return (
    <div
      ref={containerRef}
      className="gravity-stars-container"
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 0,
        color: "inherit"
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          height: "100%",
          display: "block"
        }}
      />
    </div>
  );
};
