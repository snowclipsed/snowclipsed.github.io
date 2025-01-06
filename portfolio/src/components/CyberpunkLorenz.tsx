import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

interface Point {
  x: number;
  y: number;
  z: number;
}

interface ColoredChar {
  char: string;
  color: string;
}

interface Config {
  sigma: number;
  rho: number;
  beta: number;
  speed: number;
  rotateX: number;
  rotateY: number;
  rotateZ: number;
  scale: number;
}

const DEFAULT_CONFIG: Config = {
  sigma: 10.3,
  rho: 23.7,
  beta: 1.7,
  speed: 1.0,
  rotateX: 24.0,
  rotateY: -18.0,
  rotateZ: -44.0,
  scale: 2.0
};

const CyberpunkLorenz = () => {
  const { theme } = useTheme();
  const animationRef = useRef<number | null>(null);
  const pointsRef = useRef<Point[]>([]);
  
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
  const [isHeatmap, setIsHeatmap] = useState(false);
  const [config, setConfig] = useState<Config>(DEFAULT_CONFIG);
  const [frame, setFrame] = useState<ColoredChar[][]>([]);

  // Calculate the center of rotation based on the Lorenz attractor's parameters
  const getRotationCenter = useCallback((): Point => {
    // The Lorenz attractor has two stable points (the "eyes")
    // Their positions depend on the system parameters
    const r = Math.sqrt(config.beta * (config.rho - 1));
    const eye1 = { x: r, y: r, z: config.rho - 1 };
    const eye2 = { x: -r, y: -r, z: config.rho - 1 };
    
    // Return the midpoint between the two eyes
    return {
      x: (eye1.x + eye2.x) / 2,
      y: (eye1.y + eye2.y) / 2,
      z: (eye1.z + eye2.z) / 2
    };
  }, [config.beta, config.rho]);

  const rotatePoint = useCallback((point: Point): Point => {
    // Get the center of rotation
    const center = getRotationCenter();
    
    // Translate point to origin (relative to rotation center)
    let x = point.x - center.x;
    let y = point.y - center.y;
    let z = point.z - center.z;
    
    const radX = config.rotateX * Math.PI / 180;
    const radY = config.rotateY * Math.PI / 180;
    const radZ = config.rotateZ * Math.PI / 180;
    
    // X rotation
    const x1 = x;
    const y1 = y * Math.cos(radX) - z * Math.sin(radX);
    const z1 = y * Math.sin(radX) + z * Math.cos(radX);
    
    // Y rotation
    const x2 = x1 * Math.cos(radY) + z1 * Math.sin(radY);
    const y2 = y1;
    const z2 = -x1 * Math.sin(radY) + z1 * Math.cos(radY);
    
    // Z rotation
    const x3 = x2 * Math.cos(radZ) - y2 * Math.sin(radZ);
    const y3 = x2 * Math.sin(radZ) + y2 * Math.cos(radZ);
    
    // Translate back from origin
    return { 
      x: x3 + center.x,
      y: y3 + center.y,
      z: z2 + center.z
    };
  }, [config.rotateX, config.rotateY, config.rotateZ, getRotationCenter]);

  const project = useCallback((point: Point): { x: number; y: number } => {
    const rotated = rotatePoint(point);
    const center = getRotationCenter();
    
    // Adjust projection to maintain center position
    return {
      x: Math.floor((rotated.x - center.x) * config.scale + 50),
      y: Math.floor((rotated.y - center.y) * config.scale + 25)
    };
  }, [config.scale, rotatePoint, getRotationCenter]);

  const getColor = useCallback((point: Point): string => {
    if (!isHeatmap) return theme === 'dark' ? '#ffffff' : '#000000';
    
    const center1 = { 
      x: Math.sqrt(config.beta * (config.rho - 1)), 
      y: Math.sqrt(config.beta * (config.rho - 1)),
      z: config.rho - 1
    };
    const center2 = {
      x: -Math.sqrt(config.beta * (config.rho - 1)),
      y: -Math.sqrt(config.beta * (config.rho - 1)),
      z: config.rho - 1
    };
    
    const dist1 = Math.sqrt(
      Math.pow(point.x - center1.x, 2) + 
      Math.pow(point.y - center1.y, 2) + 
      Math.pow(point.z - center1.z, 2)
    );
    const dist2 = Math.sqrt(
      Math.pow(point.x - center2.x, 2) + 
      Math.pow(point.y - center2.y, 2) + 
      Math.pow(point.z - center2.z, 2)
    );
    
    const dist = Math.min(dist1, dist2);
    const maxDist = Math.sqrt(
      Math.pow(center1.x - center2.x, 2) + 
      Math.pow(center1.y - center2.y, 2) + 
      Math.pow(center1.z - center2.z, 2)
    );
    
    const normalizedDist = dist / maxDist;
    
    if (normalizedDist < 0.15) return '#ef4444';
    if (normalizedDist < 0.3) return '#f97316';
    if (normalizedDist < 0.45) return '#eab308';
    if (normalizedDist < 0.6) return '#22c55e';
    if (normalizedDist < 0.75) return '#3b82f6';
    return '#8b5cf6';
  }, [isHeatmap, config.beta, config.rho, theme]);

  const createFrame = useCallback((points: Point[]): ColoredChar[][] => {
    const width = 100;
    const height = 45;
    const buffer: ColoredChar[][] = Array(height).fill(null).map(() => 
      Array(width).fill({ char: ' ', color: theme === 'dark' ? '#ffffff' : '#000000' })
    );
    
    // Sort points by Z for proper depth
    const center = getRotationCenter();
    const sortedPoints = [...points].sort((a, b) => {
      const rotatedA = rotatePoint(a);
      const rotatedB = rotatePoint(b);
      // Sort based on distance from rotation center for better depth perception
      return (rotatedB.z - center.z) - (rotatedA.z - center.z);
    });
    
    sortedPoints.forEach(point => {
      const projected = project(point);
      const screenX = Math.floor(projected.x);
      const screenY = Math.floor(projected.y);
      
      if (screenX >= 0 && screenX < width && screenY >= 0 && screenY < height) {
        buffer[screenY][screenX] = {
          char: '█',
          color: getColor(point)
        };
      }
    });
    
    return buffer;
  }, [project, getColor, rotatePoint, theme, getRotationCenter]);

  // Initialize and run animation
   useEffect(() => {
    // Initialize points
    const points: Point[] = [];
    let x = 0.1, y = 0, z = 0;
    const dt = 0.01;
    
    for(let i = 0; i < 1000; i++) {
      const dx = config.sigma * (y - x) * dt;
      const dy = (x * (config.rho - z) - y) * dt;
      const dz = (x * y - config.beta * z) * dt;
      
      x += dx;
      y += dy;
      z += dz;
      
      points.push({ x, y, z });
    }
    
    pointsRef.current = points;

    let animationTime = 0;
    const animate = () => {
      const last = pointsRef.current[pointsRef.current.length - 1];
      const dx = config.sigma * (last.y - last.x) * dt * config.speed;
      const dy = (last.x * (config.rho - last.z) - last.y) * dt * config.speed;
      const dz = (last.x * last.y - config.beta * last.z) * dt * config.speed;
      
      const newPoint = {
        x: last.x + dx,
        y: last.y + dy,
        z: last.z + dz
      };
      
      pointsRef.current = [...pointsRef.current.slice(1), newPoint];
      
      if (animationTime % 2 === 0) {
        setFrame(createFrame(pointsRef.current));
      }
      
      animationTime++;
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [config.sigma, config.rho, config.beta, config.speed, createFrame]);
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget || (e.target as HTMLElement).closest('.visualization-area')) {
      setIsDragging(true);
      setLastMousePos({
        x: e.clientX,
        y: e.clientY
      });
    }
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;

    const deltaX = e.clientX - lastMousePos.x;
    const deltaY = e.clientY - lastMousePos.y;
    const rotationSpeed = 0.5;

    setConfig(prev => ({
      ...prev,
      rotateY: prev.rotateY + deltaX * rotationSpeed,
      rotateX: prev.rotateX + deltaY * rotationSpeed
    }));

    setLastMousePos({
      x: e.clientX,
      y: e.clientY
    });
  }, [isDragging, lastMousePos]);

  return (
    <div className="flex border transition-colors duration-100
      dark:border-white border-black 
      dark:bg-black bg-white 
      dark:text-white text-black">
      <div 
        className="visualization-area flex-1 cursor-move border-r transition-colors duration-100
          dark:border-white border-black overflow-hidden"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
      >
        <pre className="font-mono text-[0.6rem] leading-none p-2 h-full select-none">
          {frame.map((row, i) => (
            <div key={i} className="whitespace-pre">
              {row.map((cell, j) => (
                <span key={`${i}-${j}`} style={{ color: cell.color }}>
                  {cell.char}
                </span>
              ))}
            </div>
          ))}
        </pre>
      </div>
      
      <div className="w-44 flex flex-col p-2 text-[0.6rem] shrink-0">
        <div className="border transition-colors duration-100
          dark:border-white border-black p-2 mb-1 text-center">
          <p>Click and drag to rotate</p>
          <button
            onClick={() => setIsHeatmap(prev => !prev)}
            className="mt-2 px-2 py-1 border transition-colors duration-100
              dark:border-white border-black 
              hover:bg-black hover:text-white
              dark:hover:bg-white dark:hover:text-black 
              w-full"
          >
            {isHeatmap ? 'Switch to Monochrome' : 'Switch to Heatmap'}
          </button>
          <button
            onClick={() => setConfig(DEFAULT_CONFIG)}
            className="mt-2 px-2 py-1 border transition-colors duration-100
              dark:border-white border-black 
              hover:bg-black hover:text-white
              dark:hover:bg-white dark:hover:text-black 
              w-full"
          >
            Reset to Default
          </button>
        </div>

        {Object.entries(config).map(([key, value]) => (
          <div key={key} className="border transition-colors duration-100
            dark:border-white border-black p-2 mt-1">
            <div className="flex justify-between mb-1">
              <span>{key}</span>
              <span>{value.toFixed(1)}</span>
            </div>
            <input 
              type="range"
              min={key.startsWith('rotate') ? -180 : (key === 'speed' ? 0.1 : 1)}
              max={key.startsWith('rotate') ? 180 : (key === 'speed' ? 3 : (key === 'rho' ? 50 : 20))}
              step={key === 'speed' ? 0.1 : (key.startsWith('rotate') ? 1 : 0.1)}
              value={value}
              onChange={(e) => setConfig(prev => ({ 
                ...prev, 
                [key]: parseFloat(e.target.value) 
              }))}
              className="w-full accent-current"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CyberpunkLorenz;