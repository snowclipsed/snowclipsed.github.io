'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

/**
 * Represents a point in 3D space within the Lorenz system.
 */
interface Point {
  x: number;
  y: number;
  z: number;
}

/**
 * Represents a point projected onto a 2D plane for display.
 */
interface ProjectedPoint {
  x: number;
  y: number;
}

/**
 * Configuration parameters for the Lorenz system and visualization.
 */
interface Config {
  scale: number;         // Base scale factor for the visualization
  displayScale: number;  // Additional scale factor for display adjustment
  xOffset: number;       // Horizontal offset for centering
  yOffset: number;       // Vertical offset for centering
  rotateX: number;       // Rotation around X axis (degrees)
  rotateY: number;       // Rotation around Y axis (degrees)
  rotateZ: number;       // Rotation around Z axis (degrees)
  sigma: number;         // σ parameter of the Lorenz system
  rho: number;          // ρ parameter of the Lorenz system
  beta: number;         // β parameter of the Lorenz system
  speed: number;        // Animation speed multiplier
}

/**
 * Configuration for the control sliders.
 */
interface SliderConfig {
  key: keyof Config;
  jpLabel: string;      // Japanese label
  enLabel: string;      // English label
  min: number;          // Minimum value
  max: number;          // Maximum value
  step: number;         // Step size
}

/**
 * Default configuration values for the Lorenz system and visualization.
 * These values create a stable and visually pleasing initial state.
 */
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

/**
 * CyberpunkLorenz is a React component that renders an interactive ASCII art
 * visualization of the Lorenz attractor. It supports rotation, zooming, and
 * real-time parameter adjustment through a control panel.
 */
const CyberpunkLorenz = () => {
  // State management for points and interaction
  const [points, setPoints] = useState<Point[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
  const [isHeatmap, setIsHeatmap] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  
  // Initial configuration state
  const [config, setConfig] = useState<Config>(DEFAULT_CONFIG);
  
  const animationRef = useRef<number | null>(null);
  const dt = 0.01;  // Time step for numerical integration

  /**
   * Handles the start of a mouse drag operation.
   * Initializes dragging state and stores the initial mouse position.
   */
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setLastMousePos({
      x: e.clientX,
      y: e.clientY
    });
  };

  /**
   * Handles mouse movement during drag operations.
   * Updates rotation angles based on mouse movement delta.
   */
  const handleMouseMove = (e: React.MouseEvent) => {
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
  };

  /**
   * Handles mouse scroll wheel events for zooming.
   * Updates the display scale based on scroll direction.
   */
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomSpeed = 0.05;
    const delta = e.deltaY > 0 ? -zoomSpeed : zoomSpeed;
    
    setConfig(prev => ({
      ...prev,
      displayScale: Math.max(0.5, Math.min(2.5, prev.displayScale + delta))
    }));
  };

  /**
   * Rotates a point in 3D space according to the current rotation angles.
   * Applies rotations around X, Y, and Z axes in sequence.
   * 
   * @param point - The point to rotate
   * @returns The rotated point
   */
  const rotatePoint = (point: Point): Point => {
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
  };

  /**
   * Projects a 3D point onto the 2D display plane.
   * Applies rotation, scaling, and offset transformations.
   * 
   * @param point - The 3D point to project
   * @returns The projected 2D point
   */
  const project = (point: Point): ProjectedPoint => {
    const rotated = rotatePoint(point);
    return {
      x: Math.floor(rotated.x * config.scale + config.xOffset),
      y: Math.floor(rotated.y * config.scale + config.yOffset)
    };
  };

  /**
   * Determines the color class for a point based on its position relative to
   * the Lorenz attractor's centers. Creates a concentric circle effect around
   * the attractor's "eyes".
   * 
   * @param point - The point to color
   * @returns CSS class name for the point's color
   */
  const getColorClass = useCallback((point: Point): string => {
    if (isHeatmap) {
      const { x, y, z } = point;
      
      // Calculate attractor centers based on system parameters
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
      
      // Calculate 3D distances to both centers
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
      
      // Use minimum distance and normalize
      const dist = Math.min(dist1, dist2);
      const maxDist = Math.sqrt(
        Math.pow(center1.x - center2.x, 2) + 
        Math.pow(center1.y - center2.y, 2) + 
        Math.pow(center1.z - center2.z, 2)
      );
      
      const normalizedDist = dist / maxDist;
      
      // Apply color gradients based on normalized distance
      if (normalizedDist < 0.15) {
        return 'text-red-500';
      } else if (normalizedDist < 0.3) {
        return 'text-orange-500';
      } else if (normalizedDist < 0.45) {
        return 'text-yellow-500';
      } else if (normalizedDist < 0.6) {
        return 'text-green-500';
      } else if (normalizedDist < 0.75) {
        return 'text-blue-500';
      } else {
        return 'text-violet-500';
      }
    }
    return theme === 'dark' ? 'text-white' : 'text-black';
  }, [isHeatmap, config.beta, config.rho, theme]);

  /**
   * Creates an ASCII art frame from the current set of points.
   * Projects 3D points to 2D and assigns appropriate characters and colors.
   * 
   * @param points - Array of 3D points to render
   * @returns React element containing the ASCII frame
   */
  const createAsciiFrame = useCallback((points: Point[]): React.ReactElement => {
    const width = 100;
    const height = 45;
    const buffer: string[][] = Array(height).fill(null).map(() => Array(width).fill(' '));
    const colorBuffer: string[][] = Array(height).fill(null).map(() => Array(width).fill('text-white'));
    
    points.forEach(point => {
      const projected = project(point);
      const scaledX = Math.floor(projected.x * config.displayScale);
      const scaledY = Math.floor(projected.y * config.displayScale);
      
      if (scaledX >= 0 && scaledX < width && scaledY >= 0 && scaledY < height) {
        buffer[scaledY][scaledX] = '█';
        colorBuffer[scaledY][scaledX] = getColorClass(point);
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
  }, [config.displayScale, project, getColorClass]);

  /**
   * Initializes the Lorenz system with starting points.
   * Uses numerical integration to generate initial set of points.
   */
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

  /**
   * Handles the animation loop for the Lorenz system.
   * Continuously updates points using the Lorenz equations.
   */
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

  /**
   * Controls for the visualization parameters
   */
  /**
   * Handler for configuration changes from the control sliders.
   * Updates the specified configuration parameter with the new value.
   * 
   * @param key - The configuration parameter to update
   * @param value - The new value for the parameter
   */
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
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onWheel={handleWheel}
        className="flex-1 cursor-move border-r transition-colors duration-100
          dark:border-white border-black"
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