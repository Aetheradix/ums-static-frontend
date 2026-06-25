import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  depth: number;
  alpha: number;
}

export default function HeroCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const particles = useRef<Particle[]>([]);
  const width = useRef(0);
  const height = useRef(0);

  // Parallax offsets
  const mouseNorm = useRef({ x: 0, y: 0 });
  const parallaxX = useRef(0);
  const parallaxY = useRef(0);
  const targetParallaxX = useRef(0);
  const targetParallaxY = useRef(0);

  // Mouse position in canvas space for particle attraction
  const mouseCanvas = useRef({ x: 0, y: 0, active: false });

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;

    // Initialize canvas size
    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect();
      const newWidth = rect.width;
      const newHeight = rect.height;

      canvas.width = newWidth * dpr;
      canvas.height = newHeight * dpr;
      ctx.scale(dpr, dpr);

      if (width.current > 0 && height.current > 0) {
        // Rescale existing particles to fit new dimensions
        particles.current.forEach(p => {
          p.x = (p.x / width.current) * newWidth;
          p.y = (p.y / height.current) * newHeight;
        });
      } else {
        // First-time initialization
        const count = 50; // Balanced count for nice density
        const arr: Particle[] = [];
        for (let i = 0; i < count; i++) {
          const depth = 0.4 + Math.random() * 1.2; // 3D depth layer factor (0.4 to 1.6)
          arr.push({
            x: Math.random() * newWidth,
            y: Math.random() * newHeight,
            vx: (Math.random() - 0.5) * 0.35 * depth, // drift speed depends on depth
            vy: (Math.random() - 0.5) * 0.35 * depth,
            size: (1.2 + Math.random() * 1.8) * depth, // size scales with depth
            depth,
            alpha: (0.25 + Math.random() * 0.4) * (depth / 1.6), // opacity matches depth
          });
        }
        particles.current = arr;
      }

      width.current = newWidth;
      height.current = newHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Event listeners
    const handleMouseMove = (e: MouseEvent) => {
      // Normalized coordinates [-1, 1] for parallax
      mouseNorm.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1,
      };

      // Coordinates in canvas space for local attraction
      const rect = canvas.getBoundingClientRect();
      mouseCanvas.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true,
      };
    };

    const handleMouseLeave = () => {
      mouseCanvas.current.active = false;
      mouseNorm.current = { x: 0, y: 0 };
    };

    window.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    let animationId = 0;

    const animate = () => {
      ctx.clearRect(0, 0, width.current, height.current);

      // Smooth parallax interpolation
      targetParallaxX.current = mouseNorm.current.x * 24;
      targetParallaxY.current = mouseNorm.current.y * 14;

      parallaxX.current += (targetParallaxX.current - parallaxX.current) * 0.08;
      parallaxY.current += (targetParallaxY.current - parallaxY.current) * 0.08;

      const pArr = particles.current;
      const len = pArr.length;

      // 1. Update and Draw Particles
      for (let i = 0; i < len; i++) {
        const p = pArr[i];

        // Drift
        p.x += p.vx;
        p.y += p.vy;

        // Apply Parallax offset to render positions
        let renderX = p.x + parallaxX.current * p.depth;
        let renderY = p.y + parallaxY.current * p.depth;

        // Mouse attraction in 2D space
        if (mouseCanvas.current.active) {
          const dx = mouseCanvas.current.x - renderX;
          const dy = mouseCanvas.current.y - renderY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 150) {
            const attractionForce = (150 - dist) * 0.0004 * p.depth;
            p.x += dx * attractionForce;
            p.y += dy * attractionForce;

            // Re-calculate render coordinates after attraction
            renderX = p.x + parallaxX.current * p.depth;
            renderY = p.y + parallaxY.current * p.depth;
          }
        }

        // Screen boundary wrapping (with safety padding)
        const pad = 60;
        if (p.x < -pad) p.x = width.current + pad;
        if (p.x > width.current + pad) p.x = -pad;
        if (p.y < -pad) p.y = height.current + pad;
        if (p.y > height.current + pad) p.y = -pad;

        // Draw particle
        ctx.beginPath();
        ctx.arc(renderX, renderY, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(59, 130, 246, ${p.alpha})`; // Blue color (#3B82F6) matching branding
        ctx.fill();
      }

      // 2. Draw Connection Lines
      const maxDistance = 165;
      ctx.lineWidth = 0.85;

      for (let i = 0; i < len; i++) {
        const p1 = pArr[i];
        const rX1 = p1.x + parallaxX.current * p1.depth;
        const rY1 = p1.y + parallaxY.current * p1.depth;

        for (let j = i + 1; j < len; j++) {
          const p2 = pArr[j];
          const rX2 = p2.x + parallaxX.current * p2.depth;
          const rY2 = p2.y + parallaxY.current * p2.depth;

          const dx = rX1 - rX2;
          const dy = rY1 - rY2;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            // Line opacity scales with distance and particle depths
            const alphaFactor = 1 - dist / maxDistance;
            const lineOpacity = alphaFactor * 0.15 * (p1.depth + p2.depth);

            ctx.beginPath();
            ctx.moveTo(rX1, rY1);
            ctx.lineTo(rX2, rY2);
            ctx.strokeStyle = `rgba(59, 130, 246, ${lineOpacity})`;
            ctx.stroke();
          }
        }
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full z-0 pointer-events-none overflow-hidden"
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}
