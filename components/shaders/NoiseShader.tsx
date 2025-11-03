/**
 * Noise Shader
 * Creates animated Perlin-like noise
 * Subtle texture behind glass
 */

import React, { useMemo, useEffect } from 'react';
import { Canvas, Shader, Skia, useValue } from '@shopify/react-native-skia';
import { Dimensions, StyleSheet, useColorScheme } from 'react-native';

const { width, height } = Dimensions.get('window');

// GLSL Shader for noise
const noiseShader = Skia.RuntimeEffect.Make(`
  uniform float time;
  uniform vec2 resolution;
  uniform vec3 baseColor;
  
  // Simplex-like noise function
  float noise(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
  }
  
  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    vec2 shift = vec2(100.0);
    
    for (int i = 0; i < 5; i++) {
      value += amplitude * noise(p);
      p = p * 2.0 + shift + time * 0.1;
      amplitude *= 0.5;
    }
    
    return value;
  }
  
  vec4 main(vec2 fragCoord) {
    vec2 uv = fragCoord / resolution.xy;
    
    // Multiple layers of noise
    float n1 = fbm(uv * 3.0 + time * 0.2);
    float n2 = fbm(uv * 5.0 - time * 0.15);
    
    // Combine noise layers
    float n = (n1 + n2) * 0.5;
    
    // Create subtle color variation
    vec3 col = baseColor + vec3(n * 0.1);
    
    // Add some glow
    float glow = smoothstep(0.3, 0.7, n);
    col += vec3(glow * 0.05);
    
    return vec4(col, 1.0);
  }
`)!;

export const NoiseShader: React.FC = () => {
  const time = useValue(0);
  const colorScheme = useColorScheme() ?? 'light';

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000;
      time.current = elapsed;
    }, 16); // ~60fps

    return () => clearInterval(interval);
  }, [time]);

  const uniforms = useMemo(() => {
    if (colorScheme === 'dark') {
      return {
        time,
        resolution: [width, height],
        baseColor: [0.08, 0.08, 0.15], // Very dark blue
      };
    }
    
    return {
      time,
      resolution: [width, height],
      baseColor: [0.9, 0.93, 0.97], // Very light blue
    };
  }, [time, colorScheme]);

  return (
    <Canvas style={styles.canvas}>
      <Shader source={noiseShader} uniforms={uniforms} />
    </Canvas>
  );
};

const styles = StyleSheet.create({
  canvas: {
    ...StyleSheet.absoluteFillObject,
  },
});
