"use client";
import { ReactNode, useEffect, useRef, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function App({ children }: {children: ReactNode}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const [showModal, setShowModal] = useState(false);
  const [animationsDisabled, setAnimationsDisabled] = useState<boolean>(
    typeof window !== "undefined" && localStorage.getItem("disableAnimations") ? true : false
  );

  useEffect(() => {
    if (animationsDisabled) return;

    const canvas = canvasRef.current!;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let lastFrameTime = performance.now();
    const frameTimes: number[] = [];
    const maxFrames = 10;
    let lagCounter = 0;
    const maxLagFrames = 3;
    let isPaused = false;
    let permanentStop = false;
    let pauseCount = 0;
    const bypassLagFilter = typeof window !== "undefined" && localStorage.getItem("bypassLagFilter");

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const particles: Particle[] = [];
    const particleCount = (window.innerWidth * window.innerHeight) / 10_000;
    const connectionDistance = 150;

    class Particle {
      x: number;
      y: number;
      baseSize: number;
      speedX: number;
      speedY: number;
      angle: number;
      spin: number;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.baseSize = Math.random() * 2 + 1;
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = (Math.random() - 0.5) * 0.4;
        this.angle = Math.random() * Math.PI * 2;
        this.spin = (Math.random() - 0.5) * 0.02;
      }

      update() {
        const dx = mousePos.x - this.x;
        const dy = mousePos.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 100) {
          const force = (100 - distance) / 100;
          this.x -= (dx / distance) * force * 2;
          this.y -= (dy / distance) * force * 2;
        }

        this.x += this.speedX;
        this.y += this.speedY;
        this.angle += this.spin;

        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
      }

      draw() {
        if (!ctx) return;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);

        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const angle = (i * Math.PI) / 3;
          const x = Math.cos(angle) * this.baseSize;
          const y = Math.sin(angle) * this.baseSize;
          ctx.lineTo(x, y);
        }
        ctx.closePath();

        ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
        ctx.shadowBlur = 15;
        ctx.shadowColor = "rgba(100, 255, 255, 0.5)";
        ctx.fill();
        ctx.restore();
      }
    }

    function drawConnections() {
      if (!ctx) return;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            const opacity = 1 - distance / connectionDistance;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(100, 255, 255, ${opacity * 0.2})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    }

    function init() {
      while (particles.length < particleCount) {
        particles.push(new Particle());
      }
      requestAnimationFrame(animate);
    }

    function animate(timestamp: number) {
      if (!ctx || !canvas || permanentStop) return;

      const deltaTime = timestamp - lastFrameTime;
      lastFrameTime = timestamp;

      frameTimes.push(deltaTime);
      if (frameTimes.length > maxFrames) frameTimes.shift();

      const avgFrameTime = frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length;

      if (avgFrameTime > 50) {
        lagCounter++;
        if (lagCounter >= maxLagFrames && !isPaused) {
          isPaused = true;
          lagCounter = 0;

          if (pauseCount === 0) {
            setTimeout(() => {
              isPaused = false;
              frameTimes.length = 0;
              lastFrameTime = performance.now();
              requestAnimationFrame(animate);
            }, 5000);
            pauseCount++;
          } else {
            if (bypassLagFilter) {
              isPaused = false;
              pauseCount = 0;
              frameTimes.length = 0;
              lastFrameTime = performance.now();
              requestAnimationFrame(animate);
            } else {
              setShowModal(true);
              permanentStop = true;
            }
          }
        }
      } else {
        lagCounter = Math.max(0, lagCounter - 1);
      }

      if (isPaused) return;

      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        particle.update();
        particle.draw();
      });

      drawConnections();
      requestAnimationFrame(animate);
    }

    init();

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      permanentStop = true;
    };
  }, [animationsDisabled]);

  const handleDisableAnimations = () => {
    localStorage.setItem("disableAnimations", "true");
    setAnimationsDisabled(true);
    setShowModal(false);
  };

  const handleEnableAnimations = () => {
    localStorage.removeItem("disableAnimations");
    localStorage.removeItem("bypassLagFilter");
    setAnimationsDisabled(false);
  };

  const handleDismiss = () => {
    localStorage.setItem("bypassLagFilter", "true");
    setShowModal(false);
  };

  return (
    <>
      <Header />
      <canvas
        ref={canvasRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "#000000",
          zIndex: -1,
          pointerEvents: "none",
        }}
      ></canvas>
      
      {animationsDisabled && (
        <button
          onClick={handleEnableAnimations}
          className="fixed top-4 right-4 p-3 bg-blue-500 rounded-full shadow-lg hover:bg-blue-600 transition-colors z-50"
          title="Enable background animations"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </button>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-sm text-center">
            <h3 className="text-lg font-bold mb-4">
              Low frame-rate detected
            </h3>
            <p className="mb-4">
              Do you want to disable background animations?
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={handleDisableAnimations}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Disable Animations
              </button>
              <button
                onClick={handleDismiss}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex-grow">{children}</div>
      <Footer />
    </>
  );
}