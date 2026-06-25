import React, { useEffect, useRef } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  GraduationCap,
  FileText,
  IndianRupee,
  Users,
  Building2,
  Scale,
  Package,
  BookOpen,
} from 'lucide-react';

const nodesData = [
  {
    name: 'Admissions',
    icon: GraduationCap,
    desc: 'Student onboarding and admissions registry.',
    color: '#ffedd5',
    textColor: '#ea580c',
    gradStart: '#ffedd5',
    gradEnd: '#fecaca',
  },
  {
    name: 'Examination',
    icon: FileText,
    desc: 'Grade entry, result generation & publishing.',
    color: '#e0e7ff',
    textColor: '#4f46e5',
    gradStart: '#e0e7ff',
    gradEnd: '#fbcfe8',
  },
  {
    name: 'Finance',
    icon: IndianRupee,
    desc: 'Fee collection & ledger accounts processing.',
    color: '#dcfce7',
    textColor: '#16a34a',
    gradStart: '#dcfce7',
    gradEnd: '#ccfbf1',
  },
  {
    name: 'HRMS',
    icon: Users,
    desc: 'Faculty & employee lifecycle & payroll.',
    color: '#fef9c3',
    textColor: '#ca8a04',
    gradStart: '#fef9c3',
    gradEnd: '#fed7aa',
  },
  {
    name: 'Infrastructure',
    icon: Building2,
    desc: 'Campus estate tracking & asset management.',
    color: '#f3e8ff',
    textColor: '#9333ea',
    gradStart: '#f3e8ff',
    gradEnd: '#fbcfe8',
  },
  {
    name: 'Governance',
    icon: Scale,
    desc: 'RTI registry tracking & workflows.',
    color: '#d1fae5',
    textColor: '#059669',
    gradStart: '#d1fae5',
    gradEnd: '#e0f2fe',
  },
  {
    name: 'Inventory',
    icon: Package,
    desc: 'Stock ledger & centralized procurement.',
    color: '#dbeafe',
    textColor: '#2563eb',
    gradStart: '#dbeafe',
    gradEnd: '#e0e7ff',
  },
  {
    name: 'Library',
    icon: BookOpen,
    desc: 'Book catalog & student issuance records.',
    color: '#cffafe',
    textColor: '#0891b2',
    gradStart: '#cffafe',
    gradEnd: '#dcfce7',
  },
];

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = words[0] || '';

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const testLine = currentLine + ' ' + word;
    const testWidth = ctx.measureText(testLine).width;
    if (testWidth < maxWidth) {
      currentLine = testLine;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  lines.push(currentLine);
  return lines;
}

export default function EverythingConnected() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const activeModuleRef = useRef<number | null>(null);
  const angleOffsetRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = 0;
    let height = 0;

    // Pre-loaded SVG images
    const iconImages = new Map<string, HTMLImageElement>();
    let coreIconImage: HTMLImageElement | null = null;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    window.addEventListener('resize', resize);
    resize();

    // 3D Perspective settings base values
    const baseOrbitRadiusX = 240; // wide horizontal span
    const baseOrbitRadiusY = 125; // tilted vertical span (more open/taller animation)
    const baseCoreRadiusX = 86;
    const baseCoreRadiusY = 36;
    const baseCoreHeight = 28;

    const drawPill = (
      c: CanvasRenderingContext2D,
      w: number,
      h: number,
      r: number,
      bgColor: string | CanvasGradient,
      isHovered: boolean,
      strokeColor: string
    ) => {
      c.beginPath();
      c.moveTo(-w / 2 + r, -h / 2);
      c.arcTo(w / 2, -h / 2, w / 2, h / 2, r);
      c.arcTo(w / 2, h / 2, -w / 2, h / 2, r);
      c.arcTo(-w / 2, h / 2, -w / 2, -h / 2, r);
      c.arcTo(-w / 2, -h / 2, w / 2, -h / 2, r);
      c.fillStyle = bgColor;
      c.fill();

      c.lineWidth = isHovered ? 1.8 : 1;
      c.strokeStyle = isHovered ? strokeColor : 'rgba(226, 232, 240, 0.8)';
      c.stroke();
    };

    const draw3DCore = (cx: number, cy: number, scaleFactor: number) => {
      const coreRadiusX = baseCoreRadiusX * scaleFactor;
      const coreRadiusY = baseCoreRadiusY * scaleFactor;
      const coreHeight = baseCoreHeight * scaleFactor;

      // Shift the cylinder vertically so its center of volume is at cy
      const dy = cy - coreHeight / 2;

      // Core Drop Shadow
      ctx.shadowColor = 'rgba(59, 130, 246, 0.25)';
      ctx.shadowBlur = 24 * scaleFactor;
      ctx.shadowOffsetY = 12 * scaleFactor;

      // Draw Base (Bottom Ellipse)
      ctx.beginPath();
      ctx.ellipse(
        cx,
        dy + coreHeight,
        coreRadiusX,
        coreRadiusY,
        0,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = '#1e40af';
      ctx.fill();

      // Reset shadow for subsequent elements
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;

      // Draw Cylinder Sides
      const sideGradient = ctx.createLinearGradient(
        cx - coreRadiusX,
        0,
        cx + coreRadiusX,
        0
      );
      sideGradient.addColorStop(0, '#1d4ed8');
      sideGradient.addColorStop(0.5, '#3b82f6');
      sideGradient.addColorStop(1, '#1e40af');

      ctx.beginPath();
      ctx.moveTo(cx - coreRadiusX, dy);
      ctx.lineTo(cx - coreRadiusX, dy + coreHeight);
      ctx.ellipse(
        cx,
        dy + coreHeight,
        coreRadiusX,
        coreRadiusY,
        0,
        Math.PI,
        0,
        true
      );
      ctx.lineTo(cx + coreRadiusX, dy + coreHeight);
      ctx.lineTo(cx + coreRadiusX, dy);
      ctx.ellipse(cx, dy, coreRadiusX, coreRadiusY, 0, 0, Math.PI, false);
      ctx.fillStyle = sideGradient;
      ctx.fill();

      // Draw Top Face (Top Ellipse)
      const topGradient = ctx.createRadialGradient(
        cx,
        dy,
        10 * scaleFactor,
        cx,
        dy,
        coreRadiusX
      );
      topGradient.addColorStop(0, '#60a5fa');
      topGradient.addColorStop(1, '#2563eb');

      ctx.beginPath();
      ctx.ellipse(cx, dy, coreRadiusX, coreRadiusY, 0, 0, Math.PI * 2);
      ctx.fillStyle = topGradient;
      ctx.fill();

      // Inner glowing ring on top
      ctx.beginPath();
      ctx.ellipse(
        cx,
        dy,
        coreRadiusX - 8 * scaleFactor,
        coreRadiusY - 4 * scaleFactor,
        0,
        0,
        Math.PI * 2
      );
      ctx.strokeStyle = 'rgba(255,255,255,0.4)';
      ctx.lineWidth = 1.5 * scaleFactor;
      ctx.stroke();

      // Text and icons on Core
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      if (coreIconImage) {
        const iconSize = Math.round(80 * scaleFactor);
        ctx.drawImage(
          coreIconImage,
          cx - iconSize / 2,
          dy - 20 * scaleFactor - iconSize / 2,
          iconSize,
          iconSize
        );
      }

      // Draw curved text on the cylinder side wall
      const drawCurvedText = (
        c: CanvasRenderingContext2D,
        textStr: string,
        ccx: number,
        ccy: number,
        rx: number,
        ry: number
      ) => {
        const fontSize = Math.round(10.5 * scaleFactor);
        c.font = `bold ${fontSize}px "Segoe UI", sans-serif`;

        const charWidths = [...textStr].map(char => c.measureText(char).width);
        const totalTextWidth = charWidths.reduce((a, b) => a + b, 0);

        const avgRadius = (rx + ry) / 2;
        const totalAngle = (totalTextWidth / avgRadius) * 1.02;

        let currentAngle = Math.PI / 2 + totalAngle / 2;

        for (let i = 0; i < textStr.length; i++) {
          const char = textStr[i];
          const charW = charWidths[i];

          const angleOffset = (charW / 2 / avgRadius) * 1.02;
          const charAngle = currentAngle - angleOffset;

          const x = ccx + rx * Math.cos(charAngle);
          const y = ccy + ry * Math.sin(charAngle);

          const tangentX = rx * Math.sin(charAngle);
          const tangentY = -ry * Math.cos(charAngle);
          const rotAngle = Math.atan2(tangentY, tangentX);

          c.save();
          c.translate(x, y);
          c.rotate(rotAngle);
          c.fillText(char, 0, 0);
          c.restore();

          currentAngle -= (charW / avgRadius) * 1.02;
        }
      };

      drawCurvedText(
        ctx,
        'Campus Core Platform',
        cx,
        dy + coreHeight * 0.62,
        coreRadiusX * 0.9,
        coreRadiusY * 0.9
      );
    };

    const drawNodeItem = (
      node: (typeof nodesData)[0] & {
        x: number;
        y: number;
        scale: number;
        isHovered: boolean;
      }
    ) => {
      ctx.save();
      ctx.translate(node.x, node.y);
      ctx.scale(node.scale, node.scale);

      const w = 172;
      const h = 60;
      const r = 26;

      // Pill Shadow
      ctx.shadowColor = node.isHovered
        ? 'rgba(59, 130, 246, 0.25)'
        : 'rgba(0,0,0,0.06)';
      ctx.shadowBlur = node.isHovered ? 14 : 8;
      ctx.shadowOffsetY = node.isHovered ? 6 : 3;

      // Pill Background and borders (White card background)
      drawPill(ctx, w, h, r, '#ffffff', node.isHovered, node.textColor);

      ctx.shadowColor = 'transparent';

      // Create gradient fill for icon circle
      const iconGrad = ctx.createLinearGradient(-73, -15, -43, 15);
      iconGrad.addColorStop(0, node.gradStart);
      iconGrad.addColorStop(1, node.gradEnd);

      // Icon Circle
      ctx.beginPath();
      ctx.arc(-58, 0, 15, 0, Math.PI * 2);
      ctx.fillStyle = iconGrad;
      ctx.fill();

      // Icon SVG
      const img = iconImages.get(node.name);
      if (img) {
        const iconSize = 16;
        ctx.drawImage(
          img,
          -58 - iconSize / 2,
          0 - iconSize / 2,
          iconSize,
          iconSize
        );
      }

      // Node Label Text
      ctx.font = `bold 10px "Segoe UI", sans-serif`;
      ctx.fillStyle = node.isHovered ? node.textColor : '#334155';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';

      const descLines = wrapText(ctx, node.desc, 116);

      if (descLines.length === 1) {
        ctx.fillText(node.name, -35, -5);
        ctx.font = `500 7.8px "Segoe UI", sans-serif`;
        ctx.fillStyle = node.isHovered ? node.textColor + 'cc' : '#64748b';
        ctx.fillText(descLines[0], -35, 7);
      } else if (descLines.length === 2) {
        ctx.fillText(node.name, -35, -10);
        ctx.font = `500 7.8px "Segoe UI", sans-serif`;
        ctx.fillStyle = node.isHovered ? node.textColor + 'cc' : '#64748b';
        ctx.fillText(descLines[0], -35, 2);
        ctx.fillText(descLines[1], -35, 11);
      } else {
        ctx.fillText(node.name, -35, -14);
        ctx.font = `500 7.8px "Segoe UI", sans-serif`;
        ctx.fillStyle = node.isHovered ? node.textColor + 'cc' : '#64748b';
        ctx.fillText(descLines[0], -35, -3);
        ctx.fillText(descLines[1], -35, 5);
        ctx.fillText(descLines[2], -35, 13);
      }

      ctx.restore();
    };

    let lastTime = 0;
    let currentSpeed = 0.0009;

    const draw = (time: number) => {
      if (!lastTime) lastTime = time;
      let dt = time - lastTime;
      lastTime = time;
      if (dt > 100) dt = 16.67;
      const frameRatio = dt / 16.67;

      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;

      // Scale responsiveness factor (base is 550px)
      const scaleFactor = Math.min(1.4, Math.max(0.45, width / 550)) * 0.93;

      const orbitRadiusX = baseOrbitRadiusX * scaleFactor;
      const orbitRadiusY = baseOrbitRadiusY * scaleFactor;

      // 1. Draw 3D Background Rings (Concentric Ellipses)
      ctx.lineWidth = 1.2;
      const ringScales = [0.45, 0.75, 1.05];
      ringScales.forEach((rScale, index) => {
        ctx.beginPath();
        ctx.ellipse(
          centerX,
          centerY,
          orbitRadiusX * rScale,
          orbitRadiusY * rScale,
          0,
          0,
          Math.PI * 2
        );
        ctx.strokeStyle =
          index === 1 ? 'rgba(96, 165, 250, 0.5)' : 'rgba(147, 197, 253, 0.25)';
        if (index === 1) ctx.setLineDash([3, 5]);
        else ctx.setLineDash([]);
        ctx.stroke();
      });
      ctx.setLineDash([]);

      // 2. Compute Node Positions and Detect Hovering
      let hoveredIndex: number | null = null;
      const mouse = mouseRef.current;

      const renderedNodes = nodesData.map((node, i) => {
        const angle =
          ((Math.PI * 2) / nodesData.length) * i + angleOffsetRef.current;

        // X and Y along the ellipse
        const x = centerX + Math.cos(angle) * orbitRadiusX;
        const y = centerY + Math.sin(angle) * orbitRadiusY;

        // Z depth: -1 (back) to +1 (front)
        const zDepth = Math.sin(angle);

        // Scale based on Z depth to simulate 3D spacing
        let scale = (0.9 + zDepth * 0.15) * scaleFactor;

        // Bounding check for mouse hovering
        const pillW = 172 * scale;
        const pillH = 60 * scale;
        const isHovered =
          Math.abs(mouse.x - x) < pillW / 2 &&
          Math.abs(mouse.y - y) < pillH / 2;

        if (isHovered) {
          hoveredIndex = i;
          scale *= 1.05;
        }

        return { ...node, x, y, zDepth, scale, isHovered, index: i };
      });

      // Update ref if needed
      if (hoveredIndex !== activeModuleRef.current) {
        activeModuleRef.current = hoveredIndex;
      }

      // Update canvas cursor style
      if (hoveredIndex !== null) {
        canvas.style.cursor = 'pointer';
      } else {
        canvas.style.cursor = 'default';
      }

      // Sort by depth (Z depth) so back nodes draw first
      renderedNodes.sort((a, b) => a.zDepth - b.zDepth);

      const backNodes = renderedNodes.filter(n => n.zDepth < 0);
      const frontNodes = renderedNodes.filter(n => n.zDepth >= 0);

      // Draw Back Nodes
      backNodes.forEach(drawNodeItem);

      // Draw active connection line behind central core
      if (hoveredIndex !== null) {
        const hNode = renderedNodes.find(n => n.index === hoveredIndex);
        if (hNode && hNode.zDepth < 0) {
          ctx.beginPath();
          ctx.moveTo(centerX, centerY);
          ctx.lineTo(hNode.x, hNode.y);
          ctx.strokeStyle = 'rgba(37, 99, 235, 0.4)';
          ctx.lineWidth = 1.5;
          ctx.setLineDash([4, 4]);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      }

      // Draw Central 3D Core
      draw3DCore(centerX, centerY, scaleFactor);

      // Draw active connection line in front of central core
      if (hoveredIndex !== null) {
        const hNode = renderedNodes.find(n => n.index === hoveredIndex);
        if (hNode && hNode.zDepth >= 0) {
          ctx.beginPath();
          ctx.moveTo(centerX, centerY);
          ctx.lineTo(hNode.x, hNode.y);
          ctx.strokeStyle = 'rgba(37, 99, 235, 0.6)';
          ctx.lineWidth = 1.8;
          ctx.setLineDash([4, 4]);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      }

      // Draw Front Nodes
      frontNodes.forEach(drawNodeItem);

      // Smoothly transition speed
      const targetSpeed = hoveredIndex !== null ? 0.00015 : 0.0009;
      currentSpeed +=
        (targetSpeed - currentSpeed) * Math.min(1, 0.1 * frameRatio);

      angleOffsetRef.current += currentSpeed * frameRatio;

      animationId = requestAnimationFrame(draw);
    };

    let active = true;

    const prepareIcons = async () => {
      // 1. Load Central Core School Icon
      const coreImg = new Image();
      coreImg.src = '/CoreIcon.png';
      await new Promise(resolve => {
        coreImg.onload = resolve;
        coreImg.onerror = resolve;
      });
      if (!active) return;
      coreIconImage = coreImg;

      // 2. Load Node Icons
      for (const node of nodesData) {
        const IconComponent = node.icon;
        const svg = renderToStaticMarkup(
          <IconComponent color={node.textColor} size={24} strokeWidth={2.2} />
        );
        const img = new Image();
        img.src = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
        await new Promise(resolve => {
          img.onload = resolve;
          img.onerror = resolve;
        });
        if (!active) return;
        iconImages.set(node.name, img);
      }

      // Start loop once everything is loaded
      animationId = requestAnimationFrame(draw);
    };

    prepareIcons();

    return () => {
      active = false;
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handleMouseLeave = () => {
    mouseRef.current = { x: -1000, y: -1000 };
    activeModuleRef.current = null;
  };

  return (
    <section className="relative py-4 md:py-16 bg-white overflow-hidden reveal">
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-4/5 bg-blue-light/30 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="absolute top-1/4 right-0 w-80 h-80 bg-accent/5 rounded-full blur-[100px] pointer-events-none z-0" />

      <div className="max-w-[1400px] mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          {/* Left Column: Headline and description */}
          <div className="lg:col-span-4 text-left">
            <h2 className="font-display text-xl sm:text-3xl font-black text-navy leading-[1.25] mb-3">
              <span className="block whitespace-nowrap">
                Everything <span className="text-[#1D4ED8]">Connected.</span>
              </span>
              <span className="block whitespace-nowrap">
                Everything <span className="text-emerald-500">Simplified.</span>
              </span>
            </h2>
            <p className="text-muted text-[13.5px] sm:text-base leading-relaxed mb-4 max-w-md">
              From admissions to alumni, from finance to governance – all
              processes on one integrated digital platform.
            </p>
            <a
              href="/solutions"
              className="inline-flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-[13px] font-black uppercase tracking-wider text-[#1D4ED8] hover:text-[#1e40af] transition-colors duration-300 group"
            >
              Explore Solutions
              <span className="transform translate-x-0 group-hover:translate-x-1.5 transition-transform duration-300 font-sans">
                &rarr;
              </span>
            </a>
          </div>

          {/* Center Column: Animated Orbital Map */}
          <div className="lg:col-span-8 flex justify-center items-center py-2">
            <div
              ref={containerRef}
              className="relative w-full h-[220px] sm:h-[380px] md:h-[450px] max-w-[850px] select-none"
            >
              <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full cursor-default"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
