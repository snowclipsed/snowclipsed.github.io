import React, { useState, useEffect, useCallback, useRef } from 'react';

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

/**
 * CyberpunkLorenz is a React functional component that renders an interactive
 * Lorenz attractor visualization in ASCII art style. The component allows users
 * to rotate and zoom the visualization using mouse interactions and provides
 * sliders to adjust various parameters of the Lorenz system.
 *
 * @component
 * @example
 * return (
 *   <CyberpunkLorenz />
 * )
 *
 * @typedef {Object} Point
 * @property {number} x - The x-coordinate of the point.
 * @property {number} y - The y-coordinate of the point.
 * @property {number} z - The z-coordinate of the point.
 *
 * @typedef {Object} ProjectedPoint
 * @property {number} x - The x-coordinate of the projected point.
 * @property {number} y - The y-coordinate of the projected point.
 *
 * @typedef {Object} Config
 * @property {number} scale - The scale factor for the Lorenz attractor.
 * @property {number} displayScale - The display scale factor for the visualization.
 * @property {number} xOffset - The x-offset for the visualization.
 * @property {number} yOffset - The y-offset for the visualization.
 * @property {number} rotateX - The rotation angle around the X-axis.
 * @property {number} rotateY - The rotation angle around the Y-axis.
 * @property {number} rotateZ - The rotation angle around the Z-axis.
 * @property {number} sigma - The sigma parameter of the Lorenz system.
 * @property {number} rho - The rho parameter of the Lorenz system.
 * @property {number} beta - The beta parameter of the Lorenz system.
 * @property {number} speed - The speed factor for the animation.
 *
 * @typedef {Object} SliderConfig
 * @property {keyof Config} key - The key of the configuration parameter.
 * @property {string} jpLabel - The Japanese label for the slider.
 * @property {string} enLabel - The English label for the slider.
 * @property {number} min - The minimum value for the slider.
 * @property {number} max - The maximum value for the slider.
 * @property {number} step - The step value for the slider.
 *
 * @returns {React.ReactElement} The rendered CyberpunkLorenz component.
 */
const CyberpunkLorenz: React.FC<{}> = () => {
  const [points, setPoints] = useState<Point[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
  const [isHeatmap, setIsHeatmap] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [config, setConfig] = useState<Config>({
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
  });
  
  const animationRef = useRef<number | null>(null);
  const dt = 0.01;

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setLastMousePos({
      x: e.clientX,
      y: e.clientY
    });
  };

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

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

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
   * Rotates a given point in 3D space based on the current configuration's rotation angles.
   *
   * @param point - The point to be rotated, represented by its x, y, and z coordinates.
   * @returns The rotated point with updated x, y, and z coordinates.
   */
  const rotatePoint = (point: Point): Point => {
    const { x, y, z } = point;
    const radX = config.rotateX * Math.PI / 180;
    const radY = config.rotateY * Math.PI / 180;
    const radZ = config.rotateZ * Math.PI / 180;
    
    const x1 = x;
    const y1 = y * Math.cos(radX) - z * Math.sin(radX);
    const z1 = y * Math.sin(radX) + z * Math.cos(radX);
    
    const x2 = x1 * Math.cos(radY) + z1 * Math.sin(radY);
    const y2 = y1;
    const z2 = -x1 * Math.sin(radY) + z1 * Math.cos(radY);
    
    const x3 = x2 * Math.cos(radZ) - y2 * Math.sin(radZ);
    const y3 = x2 * Math.sin(radZ) + y2 * Math.cos(radZ);
    
    return { x: x3, y: y3, z: z2 };
  };

  const project = (point: Point): ProjectedPoint => {
    const rotated = rotatePoint(point);
    return {
      x: Math.floor(rotated.x * config.scale + config.xOffset),
      y: Math.floor(rotated.y * config.scale + config.yOffset)
    };
  };


  /**
   * Determines the color class for a given point based on its position and the current heatmap setting.
   *
   * @param point - The point for which to determine the color class.
   * @returns A string representing the CSS class for the color of the point.
   *
   * If the heatmap is enabled, the color is determined based on the distance of the point from two predefined centers,
   * creating an "onion ring" effect. The closer the point is to a center, the warmer the color.
   * - Red for distances less than 2 units.
   * - Orange for distances between 2 and 4 units.
   * - Yellow for distances between 4 and 6 units.
   * - Green for distances between 6 and 8 units.
   * - Blue for distances between 8 and 10 units.
   * - Violet for distances greater than 10 units.
   *
   * If the heatmap is not enabled, the color is white.
   */
  const getColorClass = (point: Point): string => {
    if (isHeatmap) {
      const { x, y, z } = point;
      
      // Define the two attractor centers
      const center1 = { x: -8.5, y: -8.5 };
      const center2 = { x: 8.5, y: 8.5 };
      
      // Calculate distances to both centers
      const dist1 = Math.sqrt(Math.pow(x - center1.x, 2) + Math.pow(y - center1.y, 2));
      const dist2 = Math.sqrt(Math.pow(x - center2.x, 2) + Math.pow(y - center2.y, 2));
      
      // Use the smaller distance for coloring
      const dist = Math.min(dist1, dist2);
      
      // Color based on distance from nearest center (onion ring effect)
      if (dist < 2) {
        return 'text-red-500';
      } else if (dist < 4) {
        return 'text-orange-500';
      } else if (dist < 6) {
        return 'text-yellow-500';
      } else if (dist < 8) {
        return 'text-green-500';
      } else if (dist < 10) {
        return 'text-blue-500';
      } else {
        return 'text-violet-500';
      }
    }
    return 'text-white';
  };

  /**
   * Generates an ASCII frame from a set of points and returns it as a React element.
   * 
   * @param points - An array of Point objects to be projected and rendered.
   * @returns A React element representing the ASCII frame.
   * 
   * The function creates a 2D buffer of characters and a corresponding color buffer.
   * Each point is projected and scaled according to the display scale configuration.
   * If the scaled coordinates fall within the buffer dimensions, the character and color
   * at that position are updated.
   * 
   * The resulting buffers are then mapped to a series of div and span elements to create
   * the final ASCII frame, with appropriate classes for styling.
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
  }, [config.displayScale, project, isHeatmap]);



  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const disableScroll = () => {
      document.body.style.overflow = 'hidden';
    };

    const enableScroll = () => {
      document.body.style.overflow = 'auto';
    };

    element.addEventListener('mouseenter', disableScroll);
    element.addEventListener('mouseleave', enableScroll);

    return () => {
      element.removeEventListener('mouseenter', disableScroll);
      element.removeEventListener('mouseleave', enableScroll);
      document.body.style.overflow = 'auto';
    };
  }, []);

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
    <div className="flex border border-white bg-black h-full text-white">
      <div 
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onWheel={handleWheel}
        className="flex-1 cursor-move border-r border-white"
      >
        <div className="font-mono text-[0.6rem] leading-none p-2 h-full select-none">
          {createAsciiFrame(points)}
        </div>
      </div>
      
      <div className="w-44 flex flex-col p-2 text-[0.6rem] shrink-0">
        <div className="border border-white p-2 mb-1 text-center">
          <p>Click and drag to rotate</p>
          <p>Use mouse wheel to zoom</p>
          <button
            onClick={() => setIsHeatmap(prev => !prev)}
            className="mt-2 px-2 py-1 border border-white hover:bg-white hover:text-black transition-colors w-full"
          >
            {isHeatmap ? 'Switch to White' : 'Switch to Rainbow'}
          </button>
        </div>
        {sliders.map(({ key, enLabel, min, max, step }) => (
          <div key={key} className="border border-white p-2 mt-1">
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
              className="w-full accent-white"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CyberpunkLorenz;