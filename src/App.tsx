/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo } from "react";
import { 
  Thermometer, 
  Droplets, 
  FlaskConical, 
  Sprout, 
  CloudRain, 
  Signal, 
  Battery, 
  Cpu, 
  ArrowRight, 
  MousePointer2, 
  Maximize2, 
  Pause, 
  Play,
  RotateCw,
  Map,
  Shield,
  Zap,
  PhoneCall,
  Sun,
  Radio,
  Cloud,
  Server
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// --- Types ---
interface SensorData {
  temp: number;
  hum: number;
  ph: number;
  moisture: number;
  n: number;
  p: number;
  k: number;
  rain: boolean;
  gsm: string;
  batt: number;
  calls: number;
  currentTime: string;
}

// --- Components ---

const ParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let particles: { x: number; y: number; vx: number; vy: number; size: number }[] = [];
    const particleCount = 50;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createParticles = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 2 + 1,
        });
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "rgba(0, 255, 136, 0.2)";
      ctx.strokeStyle = "rgba(0, 255, 136, 0.05)";

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Connect lines
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      });
      requestAnimationFrame(animate);
    };

    window.addEventListener("resize", resize);
    resize();
    createParticles();
    animate();

    return () => window.removeEventListener("resize", resize);
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none opacity-40 z-0" />;
};

const Device3D = () => {
  const [rotation, setRotation] = useState({ x: -15, y: 45 });
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!isAutoRotating) return;
    const interval = setInterval(() => {
      setRotation(prev => ({ ...prev, y: prev.y + 0.5 }));
    }, 20);
    return () => clearInterval(interval);
  }, [isAutoRotating]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsAutoRotating(false);
    isDragging.current = true;
    lastPos.current = { x: e.clientX, y: e.clientY };
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsAutoRotating(false);
    isDragging.current = true;
    lastPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const handleMove = (e: MouseEvent | TouchEvent) => {
    if (!isDragging.current) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    const deltaX = clientX - lastPos.current.x;
    const deltaY = clientY - lastPos.current.y;
    
    setRotation(prev => ({
      x: Math.max(-60, Math.min(60, prev.x - deltaY * 0.5)),
      y: prev.y + deltaX * 0.5
    }));
    
    lastPos.current = { x: clientX, y: clientY };
  };

  const handleEnd = () => {
    isDragging.current = false;
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('touchmove', handleMove);
    window.addEventListener('touchend', handleEnd);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, []);

  const snapTo = (x: number, y: number) => {
    setIsAutoRotating(false);
    setRotation({ x, y });
  };

  return (
    <div className="relative w-full h-[550px] md:h-[650px] flex flex-col items-center justify-center perspective-1000 overflow-visible hud-panel group/device py-20">
      <div className="hud-panel-header absolute top-0 left-0 w-full z-10">
        <span>HARDWARE_EXPLORER_V1</span>
        <span className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-[#00ff88] rounded-full pulse-green" />
          INTERACTIVE_MATRIX
        </span>
      </div>

      <motion.div 
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        className="relative w-[200px] h-[180px] md:w-[260px] md:h-[240px] transition-transform duration-150 ease-out preserve-3d cursor-grab active:cursor-grabbing z-20"
        style={{ transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)` }}
      >
        {/* Front Face */}
        <div className="absolute inset-0 bg-[#0d2a1a] border-2 border-[#00ff88]/40 preserve-3d translate-z-[60px] md:translate-z-[120px] flex flex-col p-4 shadow-[inset_0_0_30px_rgba(0,255,136,0.3)]">
          <div className="text-[10px] md:text-sm font-display font-black text-[#00ff88] mb-1 tracking-wider text-center text-glow-green">KRISHI AI</div>
          <div className="w-full bg-[#001a0d] border border-[#00ff88]/50 h-24 p-2 font-mono text-[9px] md:text-[11px] text-[#00ff88] overflow-hidden leading-tight flex flex-col justify-center shadow-[inset_0_0_15px_rgba(0,0,0,0.8)]">
            <div className="animate-pulse">BOOT_SEQ_OK</div>
             <div>OS_V1.4.2_STABLE</div>
             <div className="text-cyan-400">ENCRYPTED_LINK</div>
          </div>
          <div className="flex justify-around mt-auto pb-1">
            {['PWR', 'SND', 'ALT', 'NET'].map((label, i) => (
              <div key={label} className="flex flex-col items-center">
                <div className={`w-2 md:w-3 h-2 md:h-3 rounded-full mb-1 ${i === 0 ? 'bg-[#00ff88] shadow-[0_0_10px_#00ff88]' : (i === 1 && Math.random() > 0.5 ? 'bg-orange-500 shadow-[0_0_8px_orange]' : 'bg-[#00ff88]/30 pulse-green')}`} />
                <span className="text-[5px] md:text-[7px] font-mono text-[#00ff88] font-bold">{label}</span>
              </div>
            ))}
          </div>
          <div className="absolute top-2 right-2 text-[5px] md:text-[7px] border border-[#00ff88]/40 px-1 text-[#00ff88] font-display bg-black/60 shadow-[0_0_5px_rgba(0,255,136,0.2)]">IP54</div>
        </div>

        {/* Back Face */}
        <div className="absolute inset-0 bg-[#0d2a1a] border-2 border-[#00ff88]/40 preserve-3d translate-z-[-60px] md:translate-z-[-120px] rotate-y-180 flex flex-col p-4 shadow-[inset_0_0_30px_rgba(0,255,136,0.3)]">
          <div className="flex flex-col gap-4 mt-12 items-center">
            <div className="w-14 h-7 bg-black border border-[#00ff88]/30 flex items-center justify-center text-[7px] text-cyan-400 font-mono">DEBUG_PORT</div>
            <div className="w-8 h-8 rounded-full bg-black border-2 border-gray-700 shadow-inner" />
          </div>
        </div>

        {/* Top Face */}
        <div className="absolute w-[200px] md:w-[260px] h-[120px] md:h-[240px] bg-[#0d2a1a] border-2 border-[#00ff88]/40 preserve-3d -rotate-x-90 translate-y-[-60px] md:translate-y-[-120px] flex items-center justify-center overflow-hidden">
           <div className="w-[85%] h-[85%] bg-black/95 border border-blue-400/30 grid grid-cols-4 grid-rows-2 gap-2 p-2 shadow-[inset_0_0_20px_rgba(0,229,255,0.2)]">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-gradient-to-br from-blue-900 to-black border border-blue-400/20 relative group/cell overflow-hidden">
                   <div className="absolute inset-0 opacity-10 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] bg-[length:20px_20px]" />
                </div>
              ))}
           </div>
        </div>

        {/* Side Faces */}
        <div className="absolute w-[120px] md:w-[240px] h-[180px] md:h-[240px] bg-[#092215] border-2 border-[#00ff88]/40 preserve-3d -rotate-y-90 -translate-x-[60px] md:-translate-x-[120px] flex flex-col p-4 shadow-[inset_0_0_30px_rgba(0,0,0,0.6)]">
           <div className="text-[7px] text-[#00ff88]/60 mb-6 font-display tracking-widest uppercase">Cooling_System</div>
           {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="w-full h-1 bg-black/90 mb-2 border-b border-white/5 opacity-80" />
           ))}
        </div>
        
        <div className="absolute w-[120px] md:w-[240px] h-[180px] md:h-[240px] bg-[#092215] border-2 border-[#00ff88]/40 preserve-3d rotate-y-90 translate-x-[140px] md:translate-x-[140px] shadow-[inset_0_0_30px_rgba(0,0,0,0.6)]" />
        
        {/* Bottom Face */}
        <div className="absolute w-[200px] md:w-[260px] h-[120px] md:h-[240px] bg-[#051a0d] border-2 border-[#00ff88]/40 preserve-3d rotate-x-90 translate-y-[120px] md:translate-y-[120px]" />
      </motion.div>

      <div className="flex flex-wrap justify-center gap-3 mt-48 md:mt-72 relative z-30 px-4">
        {[
          { label: "FRONT", x: 0, y: 0 },
          { label: "TOP", x: 90, y: 0 },
          { label: "SIDE", x: 0, y: 90 },
          { label: "BACK", x: 0, y: 180 },
        ].map(btn => (
          <button 
            key={btn.label}
            onMouseDown={(e) => { e.stopPropagation(); snapTo(btn.x, btn.y); }}
            className="px-4 py-1.5 bg-black/80 border border-[#00ff88]/30 text-[#00ff88] text-[9px] hover:bg-[#00ff88]/30 font-display tracking-widest transition-all hover:scale-105 active:scale-95 shadow-lg"
          >
            {btn.label}
          </button>
        ))}
        <button 
          onMouseDown={(e) => { e.stopPropagation(); setIsAutoRotating(!isAutoRotating); }}
          className={`px-4 py-1.5 border text-[#00ff88] text-[9px] font-display tracking-widest transition-all shadow-lg ${
            isAutoRotating ? 'bg-[#00ff88]/30 border-[#00ff88] animate-pulse' : 'bg-black/80 border-[#00ff88]/30'
          }`}
        >
          {isAutoRotating ? "PAUSE_ROT" : "AUTO_ROT"}
        </button>
      </div>
    </div>
  );
};

const CircuitWorkflow = () => {
  return (
    <div className="w-full grid lg:grid-cols-5 gap-8 items-start">
      <div className="lg:col-span-3 hud-panel min-h-[500px] relative overflow-hidden">
        <div className="hud-panel-header">
           <span>SYSTEM_ARCHITECTURE_FLOW</span>
           <span className="text-[#00e5ff] animate-pulse whitespace-nowrap">STREAMING_PATHWAYS</span>
        </div>
        
        <div className="p-4 md:p-8">
          <svg viewBox="0 0 800 500" className="w-full h-auto drop-shadow-[0_0_20px_rgba(0,255,136,0.1)]">
            <defs>
              <marker id="arrow-flow" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
                <path d="M0,0 L10,5 L0,10 Z" fill="#00ff88" />
              </marker>
              <filter id="neon-glow">
                 <feGaussianBlur stdDeviation="3" result="glow"/>
                 <feMerge>
                     <feMergeNode in="glow"/><feMergeNode in="SourceGraphic"/>
                 </feMerge>
              </filter>
            </defs>

            {/* Grid Helper Grid */}
            <g className="opacity-[0.05]">
               {Array.from({ length: 20 }).map((_, i) => (
                  <line key={`v-${i}`} x1={i * 40} y1="0" x2={i * 40} y2="500" stroke="#00ff88" strokeWidth="1" />
               ))}
               {Array.from({ length: 13 }).map((_, i) => (
                  <line key={`h-${i}`} x1="0" y1={i * 40} x2={800} y2={i * 40} stroke="#00ff88" strokeWidth="1" />
               ))}
            </g>

            {/* Signal Paths */}
            <g filter="url(#neon-glow)" fill="none" strokeWidth="2">
              {/* Solar to ESP32 */}
              <motion.path 
                d="M 120 100 L 400 100 L 400 180" 
                stroke="#ff4d4d" strokeDasharray="5 5" className="animate-[dash_15s_linear_infinite]"
                initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }}
              />
              {/* Sensor Hub to ESP32 */}
              <motion.path 
                d="M 120 350 L 280 350 L 280 250 L 350 250" 
                stroke="#00e5ff"
                initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }}
              />
              {/* ESP32 to GSM */}
              <motion.path 
                d="M 530 250 L 630 250" 
                stroke="#00ff88" markerEnd="url(#arrow-flow)"
                initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }}
              />
              {/* GSM to Cloud */}
              <motion.path 
                d="M 690 220 L 690 120" 
                stroke="#00ff88" strokeDasharray="4 4"
                initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }}
              />
            </g>

            {/* Nodes */}
            <g className="font-display">
              {/* Solar Node */}
              <motion.g initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.1 }}>
                 <rect x="20" y="60" width="120" height="80" rx="2" fill="#000d05" stroke="#ff4d4d" strokeWidth="1" />
                 <text x="80" y="105" textAnchor="middle" fill="#ff4d4d" fontSize="11" fontWeight="900">SOLAR ARRAY</text>
                 <foreignObject x="70" y="70" width="20" height="20">
                    <Sun size={20} className="text-[#ff4d4d]" />
                 </foreignObject>
                 <rect x="25" y="120" width="110" height="4" fill="#ff4d4d/20" />
                 <motion.rect x="25" y="120" width="80" height="4" fill="#ff4d4d" initial={{ width: 0 }} whileInView={{ width: 88 }} />
              </motion.g>

              {/* Sensor Hub Node */}
              <motion.g initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                 <rect x="20" y="260" width="120" height="180" rx="2" fill="#000d05" stroke="#00e5ff" strokeWidth="1" />
                 <text x="80" y="290" textAnchor="middle" fill="#00e5ff" fontSize="11" fontWeight="900" className="tracking-widest">SENSORS</text>
                 <g fontSize="8" fontFamily="monospace" fill="#00e5ff" opacity="0.7">
                    <text x="35" y="320">PH_LEVEL</text>
                    <text x="35" y="345">NPK_MATRIX</text>
                    <text x="35" y="370">MOISTURE</text>
                    <text x="35" y="395">HUMIDITY</text>
                    <text x="35" y="420">AMBIENT_TEMP</text>
                 </g>
                 <foreignObject x="105" y="265" width="12" height="12">
                    <FlaskConical size={12} className="text-cyan-400" />
                 </foreignObject>
              </motion.g>

              {/* Central Controller Node */}
              <motion.g initial={{ scale: 0.9, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} transition={{ delay: 0.5 }}>
                 <rect x="350" y="180" width="180" height="140" rx="4" fill="#051a0d" stroke="#00ff88" strokeWidth="3" />
                 <rect x="360" y="190" width="160" height="120" fill="none" stroke="#00ff88/20" strokeWidth="1" strokeDasharray="2 2" />
                 <text x="440" y="240" textAnchor="middle" fill="#00ff88" fontSize="16" fontWeight="900" className="tracking-tighter">ESP32_CORE</text>
                 <text x="440" y="260" textAnchor="middle" fill="#00ff88" fontSize="8" fontFamily="monospace" opacity="0.6">WROOM_DUAL_CORE_RTOS</text>
                 <foreignObject x="428" y="275" width="24" height="24">
                    <Cpu size={24} className="text-[#00ff88]" />
                 </foreignObject>
              </motion.g>

              {/* GSM Node */}
              <motion.g initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.7 }}>
                 <rect x="630" y="220" width="120" height="80" rx="2" fill="#000d05" stroke="#00ff88" strokeWidth="1" />
                 <text x="690" y="265" textAnchor="middle" fill="#00ff88" fontSize="11" fontWeight="900">GSM MODEM</text>
                 <foreignObject x="681" y="235" width="18" height="18">
                    <Radio size={18} className="text-[#00ff88]/60" />
                 </foreignObject>
                 <text x="690" y="285" textAnchor="middle" fill="#00ff88" fontSize="7" fontFamily="monospace" opacity="0.5">SIM800L GPRS_LINK</text>
              </motion.g>

              {/* Cloud Node */}
              <motion.g initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.9 }}>
                 <foreignObject x="660" y="40" width="60" height="60">
                    <Cloud size={60} className="text-cyan-400 opacity-80" />
                 </foreignObject>
                 <text x="690" y="115" textAnchor="middle" fill="#00e5ff" fontSize="10" fontWeight="900" className="tracking-widest capitalize">VITE DASHBOARD</text>
              </motion.g>
            </g>

            {/* Floating Data Packets */}
            <motion.circle r="3" fill="#00e5ff">
               <animateMotion path="M 120 350 L 280 350 L 280 250 L 350 250" dur="4s" repeatCount="indefinite" />
            </motion.circle>
            <motion.circle r="3" fill="#00ff88">
               <animateMotion path="M 530 250 L 630 250 L 690 220 L 690 120" dur="5s" repeatCount="indefinite" delay="1s" />
            </motion.circle>
          </svg>
        </div>

        <div className="px-8 pb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-t border-[#00ff88]/10 pt-6">
           <div className="flex flex-wrap gap-6 font-mono text-[9px] text-gray-500 uppercase tracking-widest">
              <div className="flex items-center gap-2"><div className="w-2 h-0.5 bg-[#ff4d4d]" /> PWR_6V_INPUT</div>
              <div className="flex items-center gap-2"><div className="w-2 h-0.5 bg-[#00e5ff]" /> SENSOR_INPUT</div>
              <div className="flex items-center gap-2"><div className="w-2 h-0.5 bg-[#00ff88]" /> GPRS_UPLINK</div>
           </div>
           <div className="bg-[#00ff88]/5 px-4 py-1 border border-[#00ff88]/20 rounded-full">
              <span className="text-[10px] font-display text-[#00ff88] uppercase tracking-[0.2em] font-bold">STATE: TRANSMITTING // PKT_LVL: 14KB/S</span>
           </div>
        </div>
      </div>

      <div className="lg:col-span-2 space-y-6">
         <div className="hud-panel p-6 shadow-[0_0_30px_rgba(0,255,136,0.05)]">
            <h4 className="text-xs font-display text-[#00ff88] uppercase tracking-[0.3em] font-bold mb-6 flex items-center gap-3">
               <Server size={14} className="text-cyan-400" /> TECHNICAL_SPECIFICATION
            </h4>
            <div className="space-y-6">
               <div className="group">
                  <div className="text-[10px] font-mono text-white mb-2 uppercase tracking-[0.2em] flex justify-between">
                     <span>01. Energy Source</span>
                     <span className="text-[#ff4d4d]">HIGH_EFFICIENCY</span>
                  </div>
                  <p className="text-[11px] text-gray-400 font-mono leading-relaxed border-l border-[#ff4d4d]/20 pl-4 group-hover:border-[#ff4d4d] transition-colors">
                     A 5W Polycrystalline array feeds the system. The XL6009 Boost-Buck controller stabilizes the 6-24V input into a constant 5V rail for the MCU.
                  </p>
               </div>
               <div className="group">
                  <div className="text-[10px] font-mono text-white mb-2 uppercase tracking-[0.2em] flex justify-between">
                     <span>02. Processing Core</span>
                     <span className="text-[#00ff88]">DYNAMIC_LOAD</span>
                  </div>
                  <p className="text-[11px] text-gray-400 font-mono leading-relaxed border-l border-[#00ff88]/20 pl-4 group-hover:border-[#00ff88] transition-colors">
                     The ESP32 processes 12-bit ADC values from the pH and Moisture probes. Integrated edge-logic applies Kalman filtering to reduce sensor noise.
                  </p>
               </div>
               <div className="group">
                  <div className="text-[10px] font-mono text-white mb-2 uppercase tracking-[0.2em] flex justify-between">
                     <span>03. Uplink Mesh</span>
                     <span className="text-[#00e5ff]">GLOBAL_READY</span>
                  </div>
                  <p className="text-[11px] text-gray-400 font-mono leading-relaxed border-l border-[#00e5ff]/20 pl-4 group-hover:border-[#00e5ff] transition-colors">
                     Utilizing SIM800L for 2G GPRS connectivity. Data is relayed via an optimized MQTT broker, ensuring delivery even in low-signal rural zones.
                  </p>
               </div>
            </div>
         </div>

         <div className="hud-panel p-6 bg-[#00ff88]/5 group overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#00ff88]/10 blur-[60px] rounded-full -mr-16 -mt-16 group-hover:bg-[#00ff88]/20 transition-all" />
            <h4 className="text-[10px] font-display text-white uppercase tracking-[0.4em] mb-4 font-black">POWER_BALANCE_SHEET</h4>
            <div className="space-y-3 relative z-10">
               <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-gray-500 uppercase">SOLAR_IN (PEAK)</span>
                  <span className="text-[#00ff88]">+850mA</span>
               </div>
               <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-gray-500 uppercase">SYS_LOAD (ACTIVE)</span>
                  <span className="text-[#ff4d4d]">-120mA</span>
               </div>
               <div className="pt-2 mt-2 border-t border-white/5 flex justify-between text-[11px] font-mono">
                  <span className="text-white uppercase font-bold tracking-tighter">NET_HARVEST</span>
                  <span className="text-[#00ff88]">+730mA</span>
               </div>
            </div>
            <div className="mt-6 flex gap-1">
               {Array.from({ length: 40 }).map((_, i) => (
                  <div key={i} className={`h-3 w-1 ${i < 32 ? 'bg-[#00ff88]' : 'bg-[#00ff88]/20'}`} />
               ))}
            </div>
            <div className="mt-2 text-[8px] font-mono text-gray-500 uppercase text-center tracking-[0.5em]">SYSTEM_AUTONOMY: 48HRS_RESERVE</div>
         </div>
      </div>
    </div>
  );
};

const HUDWidget = ({ icon: Icon, title, value, unit, color = "#00ff88", children }: any) => (
  <div className="bg-black/30 border border-[#00e5ff]/20 p-5 rounded-sm relative overflow-hidden group hover:border-[#00ff88]/50 transition-all backdrop-blur-sm">
    <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-all group-hover:-translate-x-2">
      <Icon size={100} color={color} />
    </div>
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-[10px] font-display text-cyan-400 uppercase tracking-[0.2em] font-bold">{title}</h3>
      <div className="p-1.5 bg-gray-900/80 rounded-sm border border-gray-800 group-hover:border-[#00ff88]/30 transition-colors">
        <Icon size={14} color={color} />
      </div>
    </div>
    <div className="flex items-baseline gap-1 mb-2">
      <span className="text-3xl font-mono text-white tracking-tighter text-glow-green" style={{ color: color }}>{value}</span>
      <span className="text-xs font-mono text-gray-500 uppercase">{unit}</span>
    </div>
    {children}
    <div className="absolute top-0 left-0 w-[2px] h-0 bg-[#00ff88] group-hover:h-full transition-all duration-300" />
  </div>
);

const PCBViewer = () => {
    const components = [
        { name: "ESP32", x: 180, y: 150, w: 160, h: 100, color: "#00ff88", desc: "Dual-Core Matrix Controller" },
        { name: "SIM800L", x: 420, y: 140, w: 120, h: 120, color: "#00e5ff", desc: "Global Satcom Gateway" },
        { name: "TP4056", x: 500, y: 40, w: 60, h: 60, color: "#f00", desc: "Cryo-Safe Charge IC" },
        { name: "XL6009", x: 500, y: 300, w: 80, h: 60, color: "#f00", desc: "5V Pulse Regulator" },
        { name: "MAX485", x: 120, y: 180, w: 40, h: 40, color: "#00e5ff", desc: "RS485 Vector Node" },
    ];

    return (
        <div className="w-full hud-panel border-4 border-[#00331c] bg-[#051a0d]">
            <div className="hud-panel-header">
              <span>PCB LAYOUT VIEWER v1.0</span>
              <span>FR4 100x80MM // DOUBLE LAYER</span>
            </div>
            
            <div className="p-10 relative">
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #fff, #fff 10px, transparent 10px, transparent 20px)' }} />
                <div className="relative aspect-[100/80] w-full">
                    <svg viewBox="0 0 700 400" className="w-full h-full">
                        {/* Copper Traces Background */}
                        <path d="M 0 100 L 700 100 M 0 200 L 700 200 M 0 300 L 700 300" stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="10 5" />
                        
                        {/* Interactive Components */}
                        {components.map((c, i) => (
                            <g key={i} className="group cursor-help">
                                <rect 
                                    x={c.x} y={c.y} width={c.w} height={c.h} 
                                    fill="rgba(0,0,0,0.6)" stroke={c.color} strokeWidth="1.5"
                                    className="group-hover:fill-[#00ff88]/10 transition-colors"
                                />
                                <text 
                                    x={c.x + c.w/2} y={c.y + c.h/2 + 5} 
                                    fill={c.color} fontSize="9" fontFamily="Orbitron" textAnchor="middle" fontWeight="black"
                                    className="opacity-70 group-hover:opacity-100 uppercase tracking-widest"
                                >
                                    {c.name}
                                </text>
                                
                                <foreignObject x={c.x} y={c.y - 35} width="160" height="30" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="bg-black border border-[#00ff88] text-[7px] p-1 font-mono text-white tracking-widest uppercase">
                                        {c.desc}
                                    </div>
                                </foreignObject>
                            </g>
                        ))}
                        
                        {/* Board Text */}
                        <text x="350" y="380" fill="#00ff8844" fontSize="10" fontFamily="Orbitron" textAnchor="middle" fontWeight="bold" className="tracking-[0.5em]">
                            KRISHI AI MAIN PCB v1.0
                        </text>
                    </svg>
                </div>
            </div>
        </div>
    );
};

export default function App() {
  const [data, setData] = useState<SensorData>({
    temp: 28.4,
    hum: 74,
    ph: 6.8,
    moisture: 72,
    n: 42,
    p: 18,
    k: 30,
    rain: false,
    gsm: "OK",
    batt: 85,
    calls: 124,
    currentTime: new Date().toLocaleTimeString(),
  });

  const [isPresentMode, setIsPresentMode] = useState(false);
  const [activeSection, setActiveSection] = useState(0);

  // Periodic sensor fluctuation
  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => ({
        ...prev,
        temp: +(prev.temp + (Math.random() - 0.5) * 0.1).toFixed(1),
        hum: Math.min(100, Math.max(0, prev.hum + (Math.random() - 0.5) * 0.2)),
        ph: +(prev.ph + (Math.random() - 0.5) * 0.05).toFixed(1),
        moisture: Math.min(100, Math.max(0, prev.moisture + (Math.random() - 0.5) * 0.5)),
        calls: prev.calls + (Math.random() > 0.95 ? 1 : 0),
        currentTime: new Date().toLocaleTimeString(),
      }));
    }, 1000); // Update every second for the clock
    return () => clearInterval(interval);
  }, []);

  // Presentation Timer
  useEffect(() => {
    if (!isPresentMode) return;
    const interval = setInterval(() => {
      setActiveSection(prev => (prev + 1) % 7);
      const sectionIds = ["hero", "device", "circuit", "livedata", "pcb", "bom", "about"];
      document.getElementById(sectionIds[(activeSection + 1) % 7])?.scrollIntoView({ behavior: 'smooth' });
    }, 8000);
    return () => clearInterval(interval);
  }, [isPresentMode, activeSection]);

  const togglePresentMode = () => {
    setIsPresentMode(!isPresentMode);
    if (!isPresentMode) setActiveSection(0);
  };

  const navItems = [
    { name: "Hero", id: "hero" },
    { name: "Device", id: "device" },
    { name: "Circuit", id: "circuit" },
    { name: "Live Data", id: "livedata" },
    { name: "PCB", id: "pcb" },
    { name: "BOM", id: "bom" },
    { name: "About", id: "about" },
  ];

  return (
    <div className="relative font-sans scroll-smooth overflow-x-hidden">
      <div className="scanline" />
      <ParticleBackground />

      {/* Navigation */}
      <AnimatePresence>
        {!isPresentMode && (
          <motion.nav 
            initial={{ y: -100 }} 
            animate={{ y: 0 }} 
            exit={{ y: -100 }}
            className="fixed top-0 left-0 w-full h-16 bg-black/40 backdrop-blur-md border-b border-white/5 z-50 flex items-center justify-between px-6 lg:px-12"
          >
            <div className="flex items-center gap-2">
              <Sprout className="text-[#00ff88]" size={20} />
              <span className="font-display text-sm tracking-tighter text-white">KRISHI <span className="text-[#00ff88]">AI</span></span>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <a key={item.id} href={`#${item.id}`} className="text-[10px] uppercase font-display tracking-widest text-gray-400 hover:text-[#00ff88] transition-colors">{item.name}</a>
              ))}
            </div>

            <button 
              onClick={togglePresentMode}
              className="flex items-center gap-2 bg-[#00ff88]/10 border border-[#00ff88]/30 px-3 py-1.5 rounded-sm hover:bg-[#00ff88]/20 transition-all text-[#00ff88] font-display text-[10px]"
            >
              <Maximize2 size={12} /> PRESENT MODE
            </button>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section id="hero" className="min-h-screen flex flex-col items-center justify-center relative px-6 text-center">
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="z-10 w-full max-w-5xl px-4 text-center"
        >
          <div className="inline-flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/30 px-4 md:px-6 py-1.5 rounded-sm mb-8 backdrop-blur shadow-[0_0_20px_rgba(0,255,136,0.1)]">
             <div className="w-2 h-2 bg-[#00ff88] rounded-full pulse-green shrink-0" />
             <span className="text-[9px] md:text-[10px] font-display text-white tracking-[0.3em] md:tracking-[0.4em] uppercase">SYSTEM_STATE: ONLINE // HUB_01_KARNATAKA</span>
          </div>
          
          <h1 className="text-5xl sm:text-7xl md:text-9xl font-display font-black text-white mb-6 uppercase tracking-tighter leading-none text-glow-green">
            KRISHI <span className="text-[#00ff88]">AI</span>
          </h1>
          <p className="text-[#00e5ff] max-w-2xl mx-auto text-[10px] md:text-sm mb-12 font-mono uppercase tracking-[0.2em] md:tracking-[0.3em] font-medium leading-relaxed opacity-80 decoration-[#00e5ff]/30 underline underline-offset-8">
            Agricultural intelligence for the grass-roots farmer
          </p>

          <div className="lcd-strip max-w-4xl mx-auto shadow-[0_0_30px_rgba(0,255,136,0.1)] mb-8">
            <div className="lcd-scroll">
               {data.currentTime} | VILLAGE HUB v1.0 | SENSORS: ACTIVE | GSM: OK | POWER: SOLAR ({data.batt}%) | TEMP: {data.temp}°C | HUM: {data.hum.toFixed(1)}% | PH: {data.ph} | NPK: {data.n}/{data.p}/{data.k} | UNIVERSITY: VTU | JITHESH VTU 2026
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6 md:gap-12 mt-6">
              {['PWR', 'NET', 'SYS', 'SAT'].map((l, i) => (
                  <div key={l} className="flex flex-col items-center gap-2 group">
                      <div className={`w-3 h-3 rounded-full ${i === 0 ? 'bg-[#00ff88] shadow-[0_0_10px_#00ff88]' : 'bg-[#00ff88]/20'} group-hover:scale-110 transition-transform`} />
                      <span className="text-[8px] font-mono text-gray-500 tracking-[0.2em] uppercase font-bold">{l}</span>
                  </div>
              ))}
          </div>
        </motion.div>

        <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute bottom-12 flex flex-col items-center gap-3"
        >
          <span className="text-[9px] font-display uppercase tracking-[0.5em] text-[#00ff88]/60">INITIATE_DESCENT</span>
          <div className="w-px h-16 bg-gradient-to-b from-[#00ff88] to-transparent shadow-[0_0_10px_#00ff88]" />
        </motion.div>
      </section>

      {/* 3D Device Model Section */}
      <section id="device" className="min-h-screen py-24 flex flex-col items-center justify-center px-6 bg-gradient-to-b from-transparent via-[#00ff88]/5 to-transparent">
        <h2 className="text-3xl md:text-5xl font-display font-medium text-white mb-4 uppercase text-center">3D HARDWARE <span className="text-[#00ff88]">EXPLORER</span></h2>
        <div className="w-24 h-1 bg-[#00ff88] mb-12 shadow-[0_0_10px_#00ff88]" />
        
        <div className="grid lg:grid-cols-2 gap-12 w-full max-w-7xl">
            <motion.div 
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="flex flex-col justify-center"
            >
                <Device3D />
            </motion.div>
            <motion.div 
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="flex flex-col justify-center p-8 bg-black/40 border-l border-[#00ff88]/20 backdrop-blur"
            >
                <div className="space-y-8">
                    <div className="space-y-2">
                        <h3 className="text-xl font-display text-white flex items-center gap-3">
                            <Shield className="text-[#00ff88]" size={20} />
                            RUGGED ENCLOSURE
                        </h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            ABS IP54 rated housing (220×200×100mm) designed to withstand extreme monsoon rains 
                            and high humidity environments common in coastal Karnataka.
                        </p>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="w-8 h-8 rounded-full bg-[#00ff88]/10 flex items-center justify-center text-[#00ff88] font-mono text-xs">01</div>
                            <span className="text-xs font-display text-white tracking-widest">5W SOLAR INTEGRATED TOP</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-8 h-8 rounded-full bg-[#00ff88]/10 flex items-center justify-center text-[#00ff88] font-mono text-xs">02</div>
                            <span className="text-xs font-display text-white tracking-widest">SIM800L EXTERNAL ANTENNA</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-8 h-8 rounded-full bg-[#00ff88]/10 flex items-center justify-center text-[#00ff88] font-mono text-xs">03</div>
                            <span className="text-xs font-display text-white tracking-widest">MODULAR SENSOR GLANDS</span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
      </section>

      {/* Circuit Section */}
      <section id="circuit" className="min-h-screen py-24 px-6 flex flex-col items-center justify-center">
        <h2 className="text-3xl md:text-5xl font-display font-medium text-white mb-4 uppercase text-center">SYSTEM <span className="text-[#00ff88]">ARCHITECT</span></h2>
        <p className="text-gray-500 mb-12 font-mono text-xs text-center uppercase tracking-widest">Real-time signal flow visualization</p>
        <CircuitWorkflow />
      </section>

      {/* Live Data HUD Section */}
      <section id="livedata" className="min-h-screen py-24 px-6 max-w-7xl mx-auto overflow-hidden">
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8 border-b border-[#00ff88]/10 pb-12">
           <div className="w-full md:w-auto">
              <h2 className="text-3xl sm:text-4xl md:text-6xl font-display font-medium text-white mb-4 uppercase tracking-tighter">MISSION <span className="text-[#00ff88]">CONTROL</span></h2>
              <p className="text-[#00e5ff] font-mono text-[10px] uppercase tracking-[0.4em] opacity-80">Real-time telemetry stream // Unit_001_Moodabidri</p>
           </div>
           <div className="flex flex-wrap items-center gap-4 md:gap-6 bg-black/40 border border-[#00ff88]/20 p-4 md:p-5 rounded-sm uppercase font-mono text-[10px] backdrop-blur shadow-[0_0_20px_rgba(0,255,136,0.05)] w-full md:w-auto">
              <div className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-[#00ff88] pulse-green" /> LINK: ENCRYPTED</div>
              <div className="flex items-center gap-3"><Signal size={14} className="text-cyan-400" /> RSSI: -64dBm</div>
              <div className="flex items-center gap-3"><Battery size={14} className={data.batt < 20 ? 'text-red-500' : 'text-[#00ff88]'} /> {data.currentTime}</div>
           </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
           <HUDWidget icon={Thermometer} title="Core Temp" value={data.temp} unit="°C">
              <div className="w-full h-1.5 bg-gray-900 rounded-full overflow-hidden mt-4">
                <motion.div 
                    animate={{ width: `${(data.temp / 50) * 100}%` }}
                    className="h-full bg-orange-500" 
                />
              </div>
           </HUDWidget>
           
           <HUDWidget icon={Droplets} title="Atmo Humidity" value={data.hum.toFixed(1)} unit="%" color="#00e5ff">
              <div className="w-full h-1.5 bg-gray-900 rounded-full overflow-hidden mt-4">
                <motion.div 
                    animate={{ width: `${data.hum}%` }}
                    className="h-full bg-[#00e5ff]" 
                />
              </div>
           </HUDWidget>

           <HUDWidget icon={FlaskConical} title="Soil pH Level" value={data.ph} unit="pH" color={data.ph > 6 && data.ph < 7.5 ? "#00ff88" : "#ef4444"}>
              <div className="flex justify-between mt-2 text-[8px] font-mono text-gray-500">
                <span>0 ACIDIC</span>
                <span>7 OPT</span>
                <span>14 ALK</span>
              </div>
              <div className="w-full h-1.5 bg-gray-900 rounded-full overflow-hidden mt-1 relative">
                <motion.div 
                    animate={{ left: `${(data.ph / 14) * 100}%` }}
                    className="absolute top-0 w-2 h-full bg-white z-10" 
                />
                <div className="w-full h-full bg-gradient-to-r from-red-500 via-green-500 to-blue-500 opacity-30" />
              </div>
           </HUDWidget>

           <HUDWidget icon={Sprout} title="Soil Moisture" value={data.moisture.toFixed(1)} unit="%" color="#14b8a6">
              <div className="w-full h-1.5 bg-gray-900 rounded-full overflow-hidden mt-4">
                <motion.div 
                    animate={{ width: `${data.moisture}%` }}
                    className="h-full bg-[#14b8a6]" 
                />
              </div>
           </HUDWidget>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
            <div className="lg:col-span-2 hud-panel">
                <div className="hud-panel-header">
                    <span>SOIL NUTRIENT MATRIX</span>
                    <span className="text-glow-green">NPK SENSOR: ACTIVE</span>
                </div>
                <div className="p-8 space-y-8">
                    {[
                        { label: 'NITROGEN (N)', val: data.n, max: 100, color: '#ff4d4d' },
                        { label: 'PHOSPHORUS (P)', val: data.p, max: 100, color: '#ffa500' },
                        { label: 'POTASSIUM (K)', val: data.k, max: 100, color: '#ffff00' },
                    ].map(n => (
                        <div key={n.label}>
                            <div className="flex justify-between mb-3">
                                <span className="text-[10px] font-mono text-gray-400 tracking-widest">{n.label}</span>
                                <span className="text-xs font-mono text-white text-glow-green">{n.val} mg/kg</span>
                            </div>
                            <div className="w-full h-1 bg-gray-900 overflow-hidden relative">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    whileInView={{ width: `${n.val}%` }}
                                    className="h-full relative z-10"
                                    style={{ backgroundColor: n.color, boxShadow: `0 0 10px ${n.color}` }}
                                />
                                <div className="absolute inset-0 opacity-20" style={{ backgroundColor: n.color }} />
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mx-8 mb-8 p-5 bg-[#00ff88]/5 border border-[#00ff88]/20 rounded-sm flex items-start gap-5">
                    <Zap className="text-[#00ff88] shrink-0 mt-1" size={20} />
                    <div className="space-y-1">
                        <span className="text-[10px] font-display text-[#00ff88] uppercase tracking-[0.3em] font-bold">CROP_ADVISORY_ENGINE</span>
                        <p className="text-xs text-gray-300 leading-relaxed font-mono">
                           MATRIX_ANALYSIS: OPTIMAL_FOR_PADDY. NITROGEN_LOW (-15%). RECOMMENDATION: APPLY_UREA_10KG/ACRE.
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-rows-2 gap-8">
                <div className="hud-panel flex flex-col justify-between group">
                    <div className="hud-panel-header">
                        <span>METEOROLOGY</span>
                        <CloudRain className={data.rain ? 'text-blue-500 pulse-green' : 'text-gray-700'} size={14} />
                    </div>
                    <div className="p-8 pb-12">
                        <div className="text-3xl font-mono text-white mb-2 tracking-tighter">{data.rain ? 'RAIN_DETECTED' : 'CLEAR_SKY'}</div>
                        <div className="text-[9px] font-mono text-gray-600 uppercase tracking-widest">HYDROMETER_READY // PREC: 0.0mm</div>
                    </div>
                </div>
                <div className="hud-panel flex flex-col justify-between group">
                    <div className="hud-panel-header">
                        <span>FARMER_UPLIFT</span>
                        <PhoneCall className="text-cyan-400" size={14} />
                    </div>
                    <div className="p-8 pb-12">
                        <div className="flex items-baseline gap-3">
                            <span className="text-6xl font-mono text-white tracking-tighter">{data.calls}</span>
                            <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Active Links</span>
                        </div>
                        <div className="text-[9px] font-mono text-[#00ff88] bg-[#00ff88]/5 p-1 px-2 border border-[#00ff88]/20 inline-block mt-6 uppercase tracking-widest font-bold">
                            YIELD_IMPACT: +24% PROJECTED
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* PCB Viewer Section */}
      <section id="pcb" className="min-h-screen py-24 px-6 flex flex-col items-center justify-center bg-black/40">
        <h2 className="text-3xl md:text-5xl font-display font-medium text-white mb-4 uppercase text-center">PCB <span className="text-[#00ff88]">BLUEPRINT</span></h2>
        <p className="text-gray-500 mb-12 font-mono text-xs text-center uppercase tracking-widest">100mm x 80mm Custom FR4 Stackup</p>
        <div className="w-full max-w-4xl mx-auto">
            <PCBViewer />
        </div>
      </section>

      {/* BOM Table Section */}
      <section id="bom" className="min-h-screen py-32 px-6 max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-6xl font-display font-medium text-white mb-16 uppercase tracking-tighter">BILL OF <span className="text-[#00ff88]">MATERIALS</span></h2>
        
        <div className="hud-panel overflow-hidden">
            <div className="hud-panel-header">
                <span>COMPONENT SPECIFICATION LIST</span>
                <span className="text-glow-green">TOTAL_NODES: 11</span>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-[11px]">
                    <thead className="bg-black/80 border-b border-[#00ff88]/20">
                        <tr>
                            <th className="px-8 py-5 text-gray-500 font-display uppercase tracking-[0.2em]">Component</th>
                            <th className="px-8 py-5 text-gray-500 font-display uppercase tracking-[0.2em]">Model</th>
                            <th className="px-8 py-5 text-gray-500 font-display uppercase tracking-[0.2em]">Qty</th>
                            <th className="px-8 py-5 text-gray-500 font-display uppercase tracking-[0.2em]">Purpose</th>
                            <th className="px-8 py-5 text-gray-500 font-display uppercase tracking-[0.2em] text-right">Cost (₹)</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 bg-black/20">
                    {[
                        ["ESP32-WROOM-32", "-", "1", "Main MCU WiFi+BT", "350"],
                        ["SIM800L", "-", "1", "GSM Voice+SMS", "450"],
                        ["DHT22", "-", "1", "Temp+Humidity", "180"],
                        ["pH Electrode", "SEN0161", "1", "Soil pH", "800"],
                        ["Capacitive Moisture", "-", "2", "Soil moisture", "240"],
                        ["NPK Sensor", "JXCT RS485", "1", "NPK levels", "1,800"],
                        ["Rain Sensor", "FC-37", "1", "Rain detect", "80"],
                        ["LCD 16x2 I2C", "0x27", "1", "Local UI Display", "150"],
                        ["Solar Panel", "5V 1A", "1", "Renewable Power", "350"],
                        ["18650 Li-ion", "3.7V 3Ah", "2", "Energy Storage", "400"],
                        ["Enclosure", "ABS IP54", "1", "Field Protection", "500"],
                    ].map((row, i) => (
                        <motion.tr 
                            key={i} 
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="hover:bg-[#00ff88]/5 transition-colors group"
                        >
                            <td className="px-6 py-3 text-white group-hover:text-[#00ff88]">{row[0]}</td>
                            <td className="px-6 py-3 text-gray-500">{row[1]}</td>
                            <td className="px-6 py-3 text-gray-500">{row[2]}</td>
                            <td className="px-6 py-3 text-gray-400">{row[3]}</td>
                            <td className="px-6 py-3 text-white text-right">₹{row[4]}</td>
                        </motion.tr>
                    ))}
                    <tr className="bg-[#00ff88]/10 text-[#00ff88] font-display">
                        <td colSpan={4} className="px-6 py-4 text-right tracking-widest">TOTAL PROJECT COST</td>
                        <td className="px-6 py-4 text-right">₹7,400</td>
                    </tr>
                </tbody>
            </table>
        </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {[
                { label: "Coverage", icon: Map, value: "1 device", sub: "per village" },
                { label: "Operating Cost", icon: FlaskConical, value: "₹5-42", sub: "per farmer/mo" },
                { label: "Income Uplift", icon: Zap, value: "₹3-19k", sub: "per season" },
                { label: "Scale Target", icon: ArrowRight, value: "100+", sub: "villages (18mo)" },
            ].map((card, i) => (
                <div key={i} className="bg-[#0c0c14] border border-gray-800 p-6 rounded relative group hover:border-[#00ff88]/30 transition-all overflow-hidden">
                    <card.icon className="text-[#00ff88]/20 absolute -right-4 -bottom-4 group-hover:scale-110 transition-transform" size={80} />
                    <h4 className="text-[10px] font-display text-[#00ff88] uppercase tracking-widest mb-4">{card.label}</h4>
                    <div className="text-3xl font-mono text-white mb-1 group-hover:text-[#00ff88] transition-colors">{card.value}</div>
                    <div className="text-xs text-gray-500 font-medium uppercase tracking-tight">{card.sub}</div>
                </div>
            ))}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="min-h-screen py-24 px-6 bg-gradient-to-t from-[#0a0a0f] to-transparent flex flex-col items-center">
        <div className="max-w-4xl w-full">
            <h2 className="text-3xl md:text-6xl font-display font-medium text-white mb-20 uppercase text-center tracking-tighter">PROJECT <span className="text-[#00ff88]">LEGACY</span></h2>
            
            <div className="grid md:grid-cols-2 gap-16 mb-32">
                <div className="space-y-8 relative">
                    <div className="absolute -left-4 top-0 w-1 h-full bg-[#00ff88]/20" />
                    <div className="font-mono text-[10px] text-[#00ff88] uppercase tracking-[0.5em] mb-4">LEAD_ENGINEER</div>
                    <div className="font-display text-5xl text-white font-black tracking-tighter">JITHESH</div>
                    <div className="font-display text-xl text-[#00e5ff] tracking-widest uppercase">Yenepoya Institute of Technology</div>
                    <div className="font-mono text-sm text-gray-500 tracking-wide">VTU Engineering • Karnataka, India</div>
                    <div className="pt-8 border-t border-white/5 flex gap-8">
                        <div>
                            <div className="text-[10px] font-mono text-gray-600 uppercase">Batch</div>
                            <div className="text-sm font-display text-white">2022-2026</div>
                        </div>
                        <div>
                            <div className="text-[10px] font-mono text-gray-600 uppercase">Location</div>
                            <div className="text-sm font-display text-white">Mangaluru, IN</div>
                        </div>
                    </div>
                </div>
                
                <div className="relative pl-12 border-l border-[#00ff88]/10 space-y-12">
                    <div className="font-mono text-[10px] text-gray-500 uppercase tracking-[0.4em] mb-8">MILESTONES</div>
                    <div className="space-y-10">
                        {[
                            { date: "01/26", task: "Schematic design & Simulation", status: "COMPLETE" },
                            { date: "02/26", task: "PCB Routing & Prototype Fab", status: "COMPLETE" },
                            { date: "03/26", task: "Field testing - Moodabidri", status: "COMPLETE" },
                            { date: "04/26", task: "Final Integration v1.0", status: "ACTIVE" },
                        ].map((t, i) => (
                            <div key={i} className="relative group">
                                <div className="absolute -left-[53px] top-1.5 w-3 h-3 rounded-full bg-black border border-[#00ff88] flex items-center justify-center">
                                    <div className={`w-1.5 h-1.5 rounded-full ${t.status === 'ACTIVE' ? 'bg-[#00ff88] pulse-green' : 'bg-[#00ff88]/40'}`} />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-[10px] font-mono text-[#00ff88] tracking-widest">{t.date} // {t.status}</span>
                                    <span className="text-sm font-display text-white group-hover:text-[#00e5ff] transition-colors uppercase tracking-tight">{t.task}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <footer className="w-full border-t border-white/5 pt-16 flex flex-col md:flex-row items-center justify-between gap-8 text-gray-600 font-mono text-[9px] uppercase tracking-[0.3em]">
                <div className="flex items-center gap-4">
                    <div className="w-2 h-2 bg-[#00ff88]/20 rounded-full" />
                    KRISHI AI VILLAGE HUB v1.0 © 2026
                </div>
                <div className="flex items-center gap-8">
                    <span className="hover:text-white transition-colors cursor-default">Open Source Core</span>
                    <span className="hover:text-white transition-colors cursor-default">Hardware Prototype v1.0</span>
                    <a href="#" className="text-[#00ff88] hover:underline underline-offset-4">VTU_ARCHIVE</a>
                </div>
            </footer>
        </div>
      </section>

      {/* Presentation Mode Control */}
      {isPresentMode && (
         <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-center gap-4">
             <div className="bg-black/80 backdrop-blur border border-[#00ff88]/40 p-4 rounded-sm flex items-center gap-6 shadow-2xl">
                 <div className="flex flex-col">
                    <span className="text-[8px] font-display text-[#00ff88] animate-pulse">PRESENTATION RUNNING</span>
                    <span className="text-xs font-mono text-white uppercase tracking-widest">{navItems[activeSection].name}</span>
                 </div>
                 <button onClick={togglePresentMode} className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30">
                    <Pause size={16} />
                 </button>
             </div>
             <div className="flex gap-1">
                 {navItems.map((_, i) => (
                     <div key={i} className={`h-1 transition-all duration-1000 ${i === activeSection ? 'w-8 bg-[#00ff88]' : 'w-2 bg-gray-800'}`} />
                 ))}
             </div>
         </div>
      )}

      {/* Floating Status Bar for Presentation mode */}
      <AnimatePresence>
        {isPresentMode && (
            <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed top-8 left-8 z-[100] pointer-events-none"
            >
                <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping" />
                    <span className="text-[10px] font-mono text-white tracking-[0.4em] opacity-80 uppercase">LIVE STREAM: VILLAGE UNIT #001</span>
                </div>
            </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: marquee 25s linear infinite;
        }
        .perspective-1000 {
          perspective: 1000px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        .rotate-x-90 {
          transform: rotateX(90deg);
        }
        .-rotate-x-90 {
          transform: rotateX(-90deg);
        }
        .rotate-y-90 {
          transform: rotateY(90deg);
        }
        .-rotate-y-90 {
          transform: rotateY(-90deg);
        }
        .translate-z-50 {
          transform: translateZ(50px);
        }
        .translate-z--50 {
          transform: translateZ(-50px);
        }
        .translate-z-\[50px\] {
          transform: translateZ(50px);
        }
        .translate-z-\[-50px\] {
          transform: translateZ(-50px);
        }
      `}</style>
    </div>
  );
}

