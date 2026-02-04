import { useEffect, useRef } from "react";

export default function SecurityVisual() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = 700 * dpr;
    canvas.height = 700 * dpr;
    canvas.style.width = "700px";
    canvas.style.height = "700px";
    ctx.scale(dpr, dpr);

    let time = 0;
    const centerX = 350;
    const centerY = 350;
    const baseRadius = 160; // 20% smaller than 200

    function drawBlob() {
      if (!ctx || !canvas) return;
      
      ctx.clearRect(0, 0, 700, 700);

      // Create circular blob shape with subtle waves
      ctx.beginPath();
      const points = 20; // Even more points for smoother circular shape
      
      for (let i = 0; i <= points; i++) {
        const angle = (i / points) * Math.PI * 2;
        
        // Much smaller waves to keep it circular
        const wave1 = Math.sin(angle * 2 + time * 0.8) * 6;
        const wave2 = Math.cos(angle * 3 - time * 0.6) * 4;
        const wave3 = Math.sin(angle + time * 0.4) * 8;
        
        const radius = baseRadius + wave1 + wave2 + wave3;
        
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          // Very smooth curves for circular effect
          const prevAngle = ((i - 1) / points) * Math.PI * 2;
          const prevWave1 = Math.sin(prevAngle * 2 + time * 0.8) * 6;
          const prevWave2 = Math.cos(prevAngle * 3 - time * 0.6) * 4;
          const prevWave3 = Math.sin(prevAngle + time * 0.4) * 8;
          const prevRadius = baseRadius + prevWave1 + prevWave2 + prevWave3;
          
          const prevX = centerX + Math.cos(prevAngle) * prevRadius;
          const prevY = centerY + Math.sin(prevAngle) * prevRadius;
          
          const cp1x = prevX + Math.cos(prevAngle + 0.2) * 30;
          const cp1y = prevY + Math.sin(prevAngle + 0.2) * 30;
          const cp2x = x + Math.cos(angle - 0.2) * 30;
          const cp2y = y + Math.sin(angle - 0.2) * 30;
          
          ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
        }
      }
      
      ctx.closePath();

      // Gentle pulsing opacity
      const opacityPulse = 0.75 + Math.sin(time * 1.2) * 0.08;

      // Smooth green gradient
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, baseRadius + 50);
      gradient.addColorStop(0, `rgba(189, 224, 56, ${opacityPulse})`);
      gradient.addColorStop(0.5, `rgba(189, 224, 56, ${opacityPulse * 0.7})`);
      gradient.addColorStop(1, `rgba(189, 224, 56, ${opacityPulse * 0.3})`);
      
      ctx.fillStyle = gradient;
      ctx.fill();

      // Soft outline
      ctx.strokeStyle = `rgba(140, 170, 40, ${opacityPulse * 0.6})`;
      ctx.lineWidth = 2;
      ctx.stroke();

      time += 0.0153; // 2% faster (0.015 * 1.02)
      requestAnimationFrame(drawBlob);
    }

    drawBlob();
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute right-[-1%] top-1/2 -translate-y-1/2 opacity-95"
      style={{ filter: "blur(3px)" }}
    />
  );
}