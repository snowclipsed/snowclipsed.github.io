'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

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

const DEFAULT_CONFIG: Config = {
  scale: 2,
  displayScale: 0.9,
  xOffset: 80,
  yOffset: 30,
  rotateX: 24.0,
  rotateY: -18.0,
  rotateZ: -44.0,
  sigma: 10.3,
  rho: 23.7,
  beta: 1.7,
  speed: 1.0
};

interface SliderConfig {
  key: keyof Config;
  jpLabel: string;
  enLabel: string;
  min: number;
  max: number;
  step: number;
}

const CyberpunkLorenz = () => {
  const timeRef = useRef(0);
  const animationRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const dt = 0.01;

  const [points, setPoints] = useState<Point[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
  const [isHeatmap, setIsHeatmap] = useState(false);
  const [config, setConfig] = useState<Config>(DEFAULT_CONFIG);

  const rotatePoint = useCallback((point: Point): Point => {
    const { x, y, z } = point;
    const radX = config.rotateX * Math.PI / 180;
    const radY = config.rotateY * Math.PI / 180;
    const radZ = config.rotateZ * Math.PI / 180;
    
    // Rotate around X axis
    const x1 = x;
    const y1 = y * Math.cos(radX) - z * Math.sin(radX);
    const z1 = y * Math.sin(radX) + z * Math.cos(radX);
    
    // Rotate around Y axis
    const x2 = x1 * Math.cos(radY) + z1 * Math.sin(radY);
    const y2 = y1;
    const z2 = -x1 * Math.sin(radY) + z1 * Math.cos(radY);
    
    // Rotate around Z axis
    const x3 = x2 * Math.cos(radZ) - y2 * Math.sin(radZ);
    const y3 = x2 * Math.sin(radZ) + y2 * Math.cos(radZ);
    
    return { x: x3, y: y3, z: z2 };
  }, [config.rotateX, config.rotateY, config.rotateZ]);

  const project = useCallback((point: Point): ProjectedPoint => {
    const rotated = rotatePoint(point);
    return {
      x: Math.floor(rotated.x * config.scale * config.displayScale + config.xOffset),
      y: Math.floor(rotated.y * config.scale * config.displayScale + config.yOffset)
    };
  }, [config, rotatePoint]);

  const getColorClass = useCallback((point: Point): string => {
    if (isHeatmap) {
      const { x, y, z } = point;
      
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
        Math.pow(x - center1.x, 2) + 
        Math.pow(y - center1.y, 2) + 
        Math.pow(z - center1.z, 2)
      );
      const dist2 = Math.sqrt(
        Math.pow(x - center2.x, 2) + 
        Math.pow(y - center2.y, 2) + 
        Math.pow(z - center2.z, 2)
      );
      
      const dist = Math.min(dist1, dist2);
      const maxDist = Math.sqrt(
        Math.pow(center1.x - center2.x, 2) + 
        Math.pow(center1.y - center2.y, 2) + 
        Math.pow(center1.z - center2.z, 2)
      );
      
      const normalizedDist = dist / maxDist;
      
      if (normalizedDist < 0.15) return 'text-red-500';
      if (normalizedDist < 0.3) return 'text-orange-500';
      if (normalizedDist < 0.45) return 'text-yellow-500';
      if (normalizedDist < 0.6) return 'text-green-500';
      if (normalizedDist < 0.75) return 'text-blue-500';
      return 'text-violet-500';
    }
    return theme === 'dark' ? 'text-white' : 'text-black';
  }, [isHeatmap, config.beta, config.rho, theme]);

  const createAsciiFrame = useCallback((points: Point[]): React.ReactElement => {
    const width = 100;
    const height = 45;
    const buffer: string[][] = Array(height).fill(null).map(() => Array(width).fill(' '));
    const colorBuffer: string[][] = Array(height).fill(null).map(() => Array(width).fill('text-white'));
    
    points.forEach(point => {
      const projected = project(point);
      const screenX = Math.floor(projected.x);
      const screenY = Math.floor(projected.y);
      
      if (screenX >= 0 && screenX < width && screenY >= 0 && screenY < height) {
        buffer[screenY][screenX] = '█';
        colorBuffer[screenY][screenX] = getColorClass(point);
      }
    });
    
    return (
      <>
        {buffer.map((row, i) => (
          <div key={i} className="whitespace-pre">
            {row.map((char, j) => (
              <span key={`${i}-${j}`} className={colorBuffer[i][j]}>
                {char}
              </span>
            ))}
          </div>
        ))}
      </>
    );
  }, [project, getColorClass]);

  // Animation Effect

useEffect(() => {
  let isActive = true;

  const animate = () => {
    if (!isActive) return;

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
    
    timeRef.current += dt;
    animationRef.current = requestAnimationFrame(animate);
  };
  
  // Initialize points
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
  animationRef.current = requestAnimationFrame(animate);
  
  // Cleanup function
  return () => {
    isActive = false;
    if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  };
}, [config.sigma, config.rho, config.beta, config.speed]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    // Only handle drag if we're clicking directly on the container
    if (e.target === e.currentTarget || (e.target as HTMLElement).closest('.font-mono')) {
      setIsDragging(true);
      setLastMousePos({
        x: e.clientX,
        y: e.clientY
      });
    }
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;

    // Prevent default behaviors
    e.preventDefault();
    e.stopPropagation();

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

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    // Only handle zoom if we're directly over the visualization
    if (containerRef.current?.contains(e.target as Node)) {
      // Don't prevent default behavior globally
      // Only prevent if we're actually going to handle the zoom
      if (e.deltaY !== 0) {
        e.preventDefault(); // Use preventDefault instead of stopPropagation
        
        const zoomSpeed = 0.05;
        const delta = e.deltaY > 0 ? -zoomSpeed : zoomSpeed;
        
        setConfig(prev => ({
          ...prev,
          displayScale: Math.max(0.5, Math.min(2.5, prev.displayScale + delta))
        }));
      }
    }
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    let isZooming = false;
  
    const wheelHandler = (e: WheelEvent) => {
      if (isZooming) {
        e.preventDefault();
      }
    };
  
    container.addEventListener('wheel', wheelHandler, { passive: false });
  
    return () => {
      container.removeEventListener('wheel', wheelHandler);
    };
  }, []);


  useEffect(() => {
    // Add global mouse up listener to handle cases where mouse is released outside the component
    document.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseUp]);

  const sliders: SliderConfig[] = [
    { key: 'rotateX', jpLabel: 'X軸', enLabel: 'X Axis', min: -180, max: 180, step: 1 },
    { key: 'rotateY', jpLabel: 'Y軸', enLabel: 'Y Axis', min: -180, max: 180, step: 1 },
    { key: 'rotateZ', jpLabel: 'Z軸', enLabel: 'Z Axis', min: -180, max: 180, step: 1 },
    { key: 'sigma', jpLabel: 'σ', enLabel: 'Sigma', min: 1, max: 20, step: 0.1 },
    { key: 'rho', jpLabel: 'ρ', enLabel: 'Rho', min: 0, max: 50, step: 0.1 },
    { key: 'beta', jpLabel: 'β', enLabel: 'Beta', min: 0, max: 10, step: 0.1 },
    { key: 'speed', jpLabel: '速度', enLabel: 'Speed', min: 0.1, max: 3, step: 0.1 }
  ];

  return (
    <div className="flex border transition-colors duration-100
      dark:border-white border-black 
      dark:bg-black bg-white 
      dark:text-white text-black">
      <div 
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        className="flex-1 cursor-move border-r transition-colors duration-100
          dark:border-white border-black
          overflow-hidden"
      >
        <div className="font-mono text-[0.6rem] leading-none p-2 h-full select-none">
          {createAsciiFrame(points)}
        </div>
      </div>
      
      <div className="w-44 flex flex-col p-2 text-[0.6rem] shrink-0">
        <div className="border transition-colors duration-100
          dark:border-white border-black p-2 mb-1 text-center">
          <p>Click and drag to rotate</p>
          <p>Use mouse wheel to zoom</p>
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

        {sliders.map(({ key, enLabel, min, max, step }) => (
          <div key={key} className="border transition-colors duration-100
            dark:border-white border-black p-2 mt-1">
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