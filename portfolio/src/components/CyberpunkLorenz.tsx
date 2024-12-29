import React, { useState, useEffect, useRef } from 'react';

interface Point {
  x: number;
  y: number;
  z: number;
}

interface ProjectedPoint {
  x: number;
  y: number;
}

interface Config {
  scale: number;
  displayScale: number;
  xOffset: number;
  yOffset: number;
  rotateX: number;
  rotateY: number;
  rotateZ: number;
  sigma: number;
  rho: number;
  beta: number;
  speed: number;
}

interface SliderConfig {
  key: keyof Config;
  jpLabel: string;
  enLabel: string;
  min: number;
  max: number;
  step: number;
}

const CyberpunkLorenz: React.FC = () => {
    const [points, setPoints] = useState<Point[]>([]);
    const [asciiFrame, setAsciiFrame] = useState<string>('');
    const [config, setConfig] = useState<Config>({
      scale: 2,
      displayScale: 0.9,  // Matches screenshot
      xOffset: 80,
      yOffset: 20,
      rotateX: 16.0,     // Matches screenshot
      rotateY: -13.0,    // Matches screenshot
      rotateZ: -44.0,    // Matches screenshot
      sigma: 10.3,
      rho: 23.7,
      beta: 1.7,
      speed: 1.0
    });
  
  const animationRef = useRef<number | null>(null);
  const dt = 0.01;

  useEffect(() => {
    let x = 0.1;
    let y = 0;
    let z = 0;
    const initialPoints: Point[] = [];
    
    for(let i = 0; i < 1000; i++) {
      const dx = config.sigma * (y - x) * dt;
      const dy = (x * (config.rho - z) - y) * dt;
      const dz = (x * y - config.beta * z) * dt;
      
      x += dx;
      y += dy;
      z += dz;
      
      initialPoints.push({ x, y, z });
    }
    
    setPoints(initialPoints);
  }, [config.sigma, config.rho, config.beta]);

  const rotatePoint = (point: Point): Point => {
    const { x, y, z } = point;
    const radX = config.rotateX * Math.PI / 180;
    const radY = config.rotateY * Math.PI / 180;
    const radZ = config.rotateZ * Math.PI / 180;
    
    let x1 = x;
    let y1 = y * Math.cos(radX) - z * Math.sin(radX);
    let z1 = y * Math.sin(radX) + z * Math.cos(radX);
    
    let x2 = x1 * Math.cos(radY) + z1 * Math.sin(radY);
    let y2 = y1;
    let z2 = -x1 * Math.sin(radY) + z1 * Math.cos(radY);
    
    let x3 = x2 * Math.cos(radZ) - y2 * Math.sin(radZ);
    let y3 = x2 * Math.sin(radZ) + y2 * Math.cos(radZ);
    
    return { x: x3, y: y3, z: z2 };
  };

  const project = (point: Point): ProjectedPoint => {
    const rotated = rotatePoint(point);
    return {
      x: Math.floor(rotated.x * config.scale + config.xOffset),
      y: Math.floor(rotated.y * config.scale + config.yOffset)
    };
  };

  const createAsciiFrame = (points: Point[]): string => {
    const width = 160;
    const height = 35;  // Increased height
    const buffer: string[][] = Array(height).fill(null).map(() => Array(width).fill(' '));
    const chars = '  ░▒▓█';
    
    points.forEach(point => {
      const projected = project(point);
      const scaledX = Math.floor(projected.x * config.displayScale);
      const scaledY = Math.floor(projected.y * config.displayScale);
      
      if (scaledX >= 0 && scaledX < width && 
          scaledY >= 0 && scaledY < height) {
        const zNormalized = (point.z + 30) / 60;
        const intensity = Math.floor(zNormalized * (chars.length - 1));
        buffer[scaledY][scaledX] = chars[Math.max(0, Math.min(chars.length - 1, intensity))];
      }
    });
    
    return buffer.map(row => row.join('')).join('\n');
  };

  useEffect(() => {
    const animate = () => {
      setPoints(prevPoints => {
        const newPoints = [...prevPoints];
        const last = newPoints[newPoints.length - 1];
        
        const dx = config.sigma * (last.y - last.x) * dt * config.speed;
        const dy = (last.x * (config.rho - last.z) - last.y) * dt * config.speed;
        const dz = (last.x * last.y - config.beta * last.z) * dt * config.speed;
        
        newPoints.push({
          x: last.x + dx,
          y: last.y + dy,
          z: last.z + dz
        });
        
        if (newPoints.length > 1000) newPoints.shift();
        return newPoints;
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [config]);

  useEffect(() => {
    setAsciiFrame(createAsciiFrame(points));
  }, [points, config]);

  const handleConfigChange = (key: keyof Config, value: number): void => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const sliders: SliderConfig[] = [
    { key: 'rotateX', jpLabel: 'X軸', enLabel: 'X Axis', min: -180, max: 180, step: 1 },
    { key: 'rotateY', jpLabel: 'Y軸', enLabel: 'Y Axis', min: -180, max: 180, step: 1 },
    { key: 'rotateZ', jpLabel: 'Z軸', enLabel: 'Z Axis', min: -180, max: 180, step: 1 },
    { key: 'sigma', jpLabel: 'σ', enLabel: 'Sigma', min: 1, max: 20, step: 0.1 },
    { key: 'rho', jpLabel: 'ρ', enLabel: 'Rho', min: 0, max: 50, step: 0.1 },
    { key: 'beta', jpLabel: 'β', enLabel: 'Beta', min: 0, max: 10, step: 0.1 },
    { key: 'displayScale', jpLabel: 'スケール', enLabel: 'Scale', min: 0.5, max: 2.5, step: 0.1 },
    { key: 'speed', jpLabel: '速度', enLabel: 'Speed', min: 0.1, max: 3, step: 0.1 }
  ];

  return (
    <div className="flex gap-4 border border-white p-4">
      <pre className="font-mono text-xs leading-none whitespace-pre border border-current p-4 overflow-hidden bg-black min-h-[35em]">
        {asciiFrame}
      </pre>
      
      <div className="w-48 space-y-2 text-xs">
        {sliders.map(({ key, enLabel, min, max, step }) => (
          <div key={key} className="border border-current p-2">
            <div className="flex justify-between mb-1">
              <span>{enLabel}</span>
              <span>{config[key].toFixed(1)}</span>
            </div>
            <input 
              type="range"
              min={min}
              max={max}
              step={step}
              value={config[key]}
              onChange={(e) => handleConfigChange(key, parseFloat(e.target.value))}
              className="w-full accent-current"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CyberpunkLorenz;