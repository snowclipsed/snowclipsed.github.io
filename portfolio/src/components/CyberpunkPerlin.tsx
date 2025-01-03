
import React, { useState, useEffect, useCallback, useRef } from 'react';

type ColoredChar = {
  char: string;
  color: string;
};

const defaultConfig = {
  scale: 0.05,
  speed: 0.02,
  octaves: 2,
  persistence: 0.5,
  lacunarity: 2.0,
  zoom: 1.0,
  contrast: 1.5,
  heightScale: 1.0
};


/**
 * CyberpunkPerlin component generates a visual representation of Perlin noise, 
 * which is a type of gradient noise developed by Ken Perlin in 1983. 
 * Perlin noise is used in computer graphics for creating textures, terrains, and other 
 * procedural content. It is a type of coherent noise, meaning it has a smooth gradient of values 
 * across space.
 * 
 * This component allows users to switch between a 2D noise flow mode and a 3D landscape 
 * mode. Users can also toggle between white and heatmap color modes, and adjust various 
 * parameters such as scale, speed, zoom, octaves, persistence, contrast, and height scale 
 * using sliders.
 * 
 * The component supports mouse interactions for rotating the 3D landscape view and resetting 
 * all settings to their default values.
 * 
 */
const CyberpunkPerlin = () => {
  const timeRef = useRef(0);
  const [frame, setFrame] = useState<ColoredChar[][]>([]);
  const animationRef = useRef<number | null>(null);
  const [isLandscape, setIsLandscape] = useState(false);
  const [colorMode, setColorMode] = useState<'white' | 'heatmap'>('white');
  const [rotation, setRotation] = useState({ x: 30, y: 45, z: 0 });
  const [config, setConfig] = useState(defaultConfig);
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });


  /**
 * Generates a heatmap color based on a given value.
 *
 * @param value - The value to be converted to a color, expected to be in the range [0, 1].
 * @param is3D - Optional boolean indicating if the value is for a 3D point. Defaults to false.
 * @returns A string representing the color in hexadecimal format.
 *
 * This function maps the input value to a color gradient ranging from blue to red.
 * If `is3D` is true, the value is normalized to the range [0, 1] before mapping.
 * The color gradient is defined by a series of color stops, and the function interpolates
 * between these stops to determine the final color.
 */

  const getHeatmapColor = useCallback((value: number, is3D: boolean = false): string => {
    let v;
    if (is3D) {
      // instead of scaling relative to heightScale, i use a fixed range
      v = (value + 1) / 2; // since height values are normalized to [-1, 1]. we're doing this so that when we increase heightScale, the colors don't get into only one range
      v = Math.max(0, Math.min(1, v));
    } else {
      v = Math.max(0, Math.min(1, value));
    }

    const colors = [
      { pos: 0, color: '#000066' },
      { pos: 0.3, color: '#0000FF' },
      { pos: 0.5, color: '#00FFFF' },
      { pos: 0.7, color: '#00FF00' },
      { pos: 0.85, color: '#FFFF00' },
      { pos: 1, color: '#FF0000' }
    ];

    for (let i = 0; i < colors.length - 1; i++) {
      if (v >= colors[i].pos && v <= colors[i + 1].pos) {
        const startColor = colors[i];
        const endColor = colors[i + 1];
        
        const t = (v - startColor.pos) / (endColor.pos - startColor.pos);
        
        const start = {
          r: parseInt(startColor.color.slice(1,3), 16),
          g: parseInt(startColor.color.slice(3,5), 16),
          b: parseInt(startColor.color.slice(5,7), 16)
        };
        
        const end = {
          r: parseInt(endColor.color.slice(1,3), 16),
          g: parseInt(endColor.color.slice(3,5), 16),
          b: parseInt(endColor.color.slice(5,7), 16)
        };
        
        const r = Math.round(start.r + (end.r - start.r) * t);
        const g = Math.round(start.g + (end.g - start.g) * t);
        const b = Math.round(start.b + (end.b - start.b) * t);
        
        return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`;
      }
    }
    
    return v <= colors[0].pos ? colors[0].color : colors[colors.length - 1].color;
  }, []);


  /**
 * Rotates a 3D point around the x, y, and z axes based on the current rotation state.
 *
 * @param point - A tuple representing the 3D point to be rotated, in the format [x, y, z].
 * @returns A tuple representing the rotated 3D point, in the format [x, y, z].
 *
 * This function applies a series of rotations to the input point:
 * - First, it rotates the point around the x-axis by the angle specified in `rotation.x`.
 * - Then, it rotates the resulting point around the y-axis by the angle specified in `rotation.y`.
 * - Finally, it returns the rotated point.
 *
 * The rotation angles are converted from degrees to radians before applying the rotation.
 */
  const rotatePoint = useCallback((point: [number, number, number]): [number, number, number] => {
    const [x, y, z] = point;
    const toRad = (deg: number) => deg * Math.PI / 180;

    const y1 = y * Math.cos(toRad(rotation.x)) - z * Math.sin(toRad(rotation.x));
    const z1 = y * Math.sin(toRad(rotation.x)) + z * Math.cos(toRad(rotation.x));

    const x2 = x * Math.cos(toRad(rotation.y)) + z1 * Math.sin(toRad(rotation.y));
    const z2 = -x * Math.sin(toRad(rotation.y)) + z1 * Math.cos(toRad(rotation.y));

    return [x2, y1, z2];
  }, [rotation]);


  /**
   * Projects a 3D point onto a 2D plane based on the current configuration.
   *
   * @param point - A tuple representing the 3D point to be projected, in the format [x, y, z].
   * @returns A tuple representing the projected 2D point, in the format [x, y].
   *
   * This function applies a perspective projection to the input point:
   * - The point is scaled based on its distance from the view plane.
   * - A vertical offset is added to keep the terrain centered as the height scale increases.
   * - The resulting 2D coordinates are returned.
   */
  const projectPoint = useCallback((point: [number, number, number]): [number, number] => {
    const viewDistance = 100;
    const [x, y, z] = point;
    const scale = viewDistance / (z + viewDistance);
    // Add vertical offset to keep terrain centered as height scale increases
    const verticalOffset = -config.heightScale * 0.8;
    return [x * scale, (y + verticalOffset) * scale];
  }, [config.heightScale]);


  // Perlin Noise Functions
  
  /**
   * Generates 2D Perlin noise value for given coordinates.
   *
   * @param x - The x-coordinate.
   * @param y - The y-coordinate.
   * @returns A noise value in the range [0, 1].
   *
   * This function uses a pseudo-random number generator based on sine and cosine functions
   * to produce a smooth noise value. The noise value is interpolated between four surrounding
   * grid points using a fade function.
   */
  const noise2D = useCallback((x: number, y: number): number => {
    const xi = Math.floor(x);
    const yi = Math.floor(y);
    
    const getRandom = (x: number, y: number) => {
      const n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453123;
      return n - Math.floor(n);
    };
    
    const v00 = getRandom(xi, yi);
    const v10 = getRandom(xi + 1, yi);
    const v01 = getRandom(xi, yi + 1);
    const v11 = getRandom(xi + 1, yi + 1);
    
    const sx = x - xi;
    const sy = y - yi;
    const nx = (3 - 2 * sx) * sx * sx;
    const ny = (3 - 2 * sy) * sy * sy;
    
    return v00 * (1 - nx) * (1 - ny) +
           v10 * nx * (1 - ny) +
           v01 * (1 - nx) * ny +
           v11 * nx * ny;
  }, []);


  /**
   * Generates a multi-octave Perlin noise value for given coordinates.
   *
   * @param x - The x-coordinate.
   * @param y - The y-coordinate.
   * @returns A noise value in the range [0, 1].
   *
   * This function combines multiple layers (octaves) of Perlin noise to create a more complex and detailed noise pattern.
   * Each octave has its own frequency and amplitude, which are controlled by the `config` state.
   * The resulting noise value is normalized to the range [0, 1].
   */
  const octaveNoise = useCallback((x: number, y: number): number => {
    let result = 0;
    let amp = 1;
    let freq = 1;
    let maxVal = 0;

    for (let i = 0; i < config.octaves; i++) {
      result += noise2D(x * freq, y * freq) * amp;
      maxVal += amp;
      amp *= config.persistence;
      freq *= config.lacunarity;
    }

    return result / maxVal;
  }, [config.octaves, config.persistence, config.lacunarity, noise2D]);



  /**
   * Creates a 3D landscape frame for the current time.
   *
   * @param currentTime - The current time used to generate the frame.
   * @returns A 2D array of `ColoredChar` representing the 3D landscape frame.
   *
   * This function generates a 3D landscape frame by:
   * - Initializing a buffer and z-buffer for rendering.
   * - Generating terrain points using Perlin noise and rotating/projecting them.
   * - Sorting points by depth and rendering them to the buffer.
   * - Returning the final buffer representing the 3D landscape.
   */
  const create3DLandscapeFrame = useCallback((currentTime: number): ColoredChar[][] => {
    const width = 80;
    const height = 48;
    const terrainSize = 40;
    const chars = ' .,:;~!?▒█';
    const buffer: ColoredChar[][] = Array(height).fill(null).map(() => 
      Array(width).fill({ char: ' ', color: colorMode === 'white' ? '#ffffff' : '#00008B' })
    );
    const zBuffer: number[][] = Array(height).fill(null).map(() => Array(width).fill(-Infinity));
    
    const points: Array<{
      pos: [number, number, number];
      projected: [number, number];
      brightness: number;
      heightForColor: number;
    }> = [];

    for (let z = -terrainSize/2; z < terrainSize/2; z++) {
      for (let x = -terrainSize/2; x < terrainSize/2; x++) {
        const nx = x * config.scale * config.zoom;
        const nz = z * config.scale * config.zoom;
        
        let height = octaveNoise(nx + currentTime * 0.1, nz);
        height = Math.pow(height * 0.5 + 0.5, config.contrast) * 2 - 1;
        const heightForColor = height;

        // scale height and shift it to keep terrain centered
        height = (height + 0.5) * config.heightScale;
        
        const pos: [number, number, number] = [x * 2, height, z * 2];
        const rotated = rotatePoint(pos);
        const projected = projectPoint(rotated);
        
        points.push({
          pos: rotated,
          projected,
          brightness: height,
          heightForColor: heightForColor
        });
      }
    }

    points.sort((a, b) => b.pos[2] - a.pos[2]);

    points.forEach(point => {
      const [px, py] = point.projected;
      const screenX = Math.floor(px + width/2);
      const screenY = Math.floor(py + height/2);
      
      if (screenX >= 0 && screenX < width && screenY >= 0 && screenY < height) {
        if (point.pos[2] > zBuffer[screenY][screenX]) {
          zBuffer[screenY][screenX] = point.pos[2];
          const charIndex = Math.floor((point.brightness + 1) * 0.5 * (chars.length - 1));
          const char = chars[Math.max(0, Math.min(chars.length - 1, charIndex))];
          const color = colorMode === 'white' ? '#ffffff' : getHeatmapColor(point.heightForColor, true);
          buffer[screenY][screenX] = { char, color };
        }
      }
    });
    
    return buffer;
  }, [config, colorMode, getHeatmapColor, octaveNoise, projectPoint, rotatePoint]);


  /**
   * Creates a 2D noise frame for the current time.
   *
   * @param currentTime - The current time used to generate the frame.
   * @returns A 2D array of `ColoredChar` representing the noise frame.
   *
   * This function generates a 2D noise frame by:
   * - Initializing a buffer for rendering.
   * - Generating noise values using Perlin noise and mapping them to characters and colors.
   * - Returning the final buffer representing the 2D noise.
   */
  const createNoiseFrame = useCallback((currentTime: number): ColoredChar[][] => {
    const width = 80;
    const height = 48;
    const chars = ' .:-=+*#%@';
    const buffer: ColoredChar[][] = [];
    
    for (let y = 0; y < height; y++) {
      const row: ColoredChar[] = [];
      for (let x = 0; x < width; x++) {
        const nx = x * config.scale * config.zoom;
        const ny = y * config.scale * config.zoom;
        
        let value = octaveNoise(nx + currentTime, ny + currentTime);
        value = Math.pow(value * 0.5 + 0.5, config.contrast);
        
        const charIndex = Math.floor(value * (chars.length - 0.01));
        const char = chars[Math.max(0, Math.min(chars.length - 1, charIndex))];
        const color = colorMode === 'white' ? '#ffffff' : getHeatmapColor(value);
        
        row.push({ char, color });
      }
      buffer.push(row);
    }
    
    return buffer;
  }, [config, colorMode, getHeatmapColor, octaveNoise]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    setLastMousePos({ x: e.clientX, y: e.clientY });
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !isLandscape) return;

    e.preventDefault();
    const currentX = e.clientX;
    const currentY = e.clientY;

    requestAnimationFrame(() => {
      const deltaX = currentX - lastMousePos.x;
      const deltaY = currentY - lastMousePos.y;

      setRotation(prev => ({
        x: prev.x + deltaY * 0.5,
        y: prev.y + deltaX * 0.5,
        z: prev.z
      }));

      setLastMousePos({ x: currentX, y: currentY });
    });
  }, [isDragging, isLandscape, lastMousePos]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleReset = useCallback(() => {
    setConfig(defaultConfig);
    setRotation({ x: 30, y: 45, z: 0 });
  }, []);

  useEffect(() => {
    const animate = () => {
      timeRef.current += config.speed;
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [config.speed]);

  useEffect(() => {
    const frameId = requestAnimationFrame(() => {
      const newFrame = isLandscape ? 
        create3DLandscapeFrame(timeRef.current) : 
        createNoiseFrame(timeRef.current);
      setFrame(newFrame);
    });
    
    return () => cancelAnimationFrame(frameId);
  }, [timeRef.current, isLandscape, create3DLandscapeFrame, createNoiseFrame, rotation, colorMode]);

  const sliders = [
    { key: 'scale', label: 'Pattern Scale', min: 0.01, max: 0.2, step: 0.01 },
    { key: 'speed', label: 'Speed', min: 0, max: 0.05, step: 0.001 },
    { key: 'zoom', label: 'Zoom', min: 0.5, max: 2, step: 0.1 },
    { key: 'octaves', label: 'Detail Layers', min: 1, max: 4, step: 1 },
    { key: 'persistence', label: 'Detail Strength', min: 0.1, max: 0.9, step: 0.1 },
    { key: 'contrast', label: 'Contrast', min: 0.5, max: 2.5, step: 0.1 },
    { key: 'heightScale', label: 'Height Scale', min: 0.5, max: 25.0, step: 0.5 }
  ];

  return (
    <div className="flex border border-white bg-black">
      <div 
        className="flex-1 border-r border-white"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <pre className="font-mono text-xs leading-none whitespace-pre p-1 select-none">
          {frame.map((row, i) => (
            <div key={i}>
              {row.map((cell, j) => (
                <span key={`${i}-${j}`} style={{ color: cell.color }}>
                  {cell.char}
                </span>
              ))}
            </div>
          ))}
        </pre>
      </div>
      
      <div className="w-44 flex flex-col p-1 space-y-1 bg-black text-white">
        <div className="border border-white p-1 text-center text-xs">
          <h3 className="font-bold">NOISE CONTROL MATRIX</h3>
          {isLandscape && <p className="opacity-75 text-xs">Drag to rotate view</p>}
        </div>

        <div className="flex flex-col gap-1">
          <button 
            onClick={() => setIsLandscape(prev => !prev)}
            className="border border-white p-1 text-xs font-bold hover:bg-white hover:text-black transition-colors"
          >
            {isLandscape ? 'SWITCH TO FLOW MODE' : 'SWITCH TO 3D MODE'}
          </button>
          
          <button 
            onClick={() => setColorMode(prev => prev === 'white' ? 'heatmap' : 'white')}
            className="border border-white p-1 text-xs font-bold hover:bg-white hover:text-black transition-colors"
          >
            {colorMode === 'white' ? 'SWITCH TO HEATMAP' : 'SWITCH TO WHITE'}
          </button>

          <button 
            onClick={handleReset}
            className="border border-white p-1 text-xs font-bold hover:bg-white hover:text-black transition-colors"
          >
            RESET ALL SETTINGS
          </button>
        </div>
        
        {sliders.map(({ key, label, min, max, step }) => (
          <div key={key} className={`border border-white p-1 ${
            key === 'heightScale' && !isLandscape ? 'opacity-50 pointer-events-none' : ''
          }`}>
            <div className="flex justify-between mb-0.5 text-xs">
              <span className="font-bold">{label}</span>
              <span className="opacity-75">
                {config[key as keyof typeof config].toFixed(3)}
              </span>
            </div>
            <input 
              type="range"
              min={min}
              max={max}
              step={step}
              value={config[key as keyof typeof config]}
              onChange={(e) => setConfig(prev => ({ 
                ...prev, 
                [key]: parseFloat(e.target.value) 
              }))}
              className="w-full accent-white"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CyberpunkPerlin;