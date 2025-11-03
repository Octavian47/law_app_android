/**
 * Morphing Blob Shader
 * Creates organic, morphing blob shapes
 * Looks amazing through glass effects
 */

import React, { useMemo, useEffect } from 'react';
import { Canvas, Shader, Skia, useValue } from '@shopify/react-native-skia';
import { Dimensions, StyleSheet, useColorScheme } from 'react-native';

const { width, height } = Dimensions.get('window');

// GLSL Shader for morphing blobs
const blobShader = Skia.RuntimeEffect.Make(`
  uniform float time;
  uniform vec2 resolution;
  uniform vec3 color1;
  uniform vec3 color2;
  uniform vec3 color3;
  
  float sdCircle(vec2 p, float r) {
    return length(p) - r;
  }
  
  float opSmoothUnion(float d1, float d2, float k) {
    float h = clamp(0.5 + 0.5 * (d2 - d1) / k, 0.0, 1.0);
    return mix(d2, d1, h) - k * h * (1.0 - h);
  }
  
  vec4 main(vec2 fragCoord) {
    vec2 uv = (fragCoord - resolution.xy * 0.5) / resolution.y;
    
    // Create multiple moving circles
    float blob1 = sdCircle(
      uv - vec2(sin(time * 0.5) * 0.3, cos(time * 0.3) * 0.2),
      0.3 + sin(time * 0.7) * 0.1
    );
    
    float blob2 = sdCircle(
      uv - vec2(cos(time * 0.4) * 0.25, sin(time * 0.6) * 0.3),
      0.25 + cos(time * 0.8) * 0.08
    );
    
    float blob3 = sdCircle(
      uv - vec2(sin(time * 0.6) * 0.2, cos(time * 0.4) * 0.25),
      0.2 + sin(time * 0.5) * 0.1
    );
    
    // Smooth union of blobs
    float d = opSmoothUnion(blob1, blob2, 0.3);
    d = opSmoothUnion(d, blob3, 0.25);
    
    // Create gradient based on distance
    vec3 col = mix(color1, color2, smoothstep(0.0, 1.0, uv.y + 0.5));
    col = mix(col, color3, smoothstep(-0.5, 0.5, d));
    
    // Soft edges
    float alpha = 1.0 - smoothstep(-0.02, 0.02, d);
    
    return vec4(col * alpha, alpha * 0.8);
  }
`)!;

export const MorphingBlobShader: React.FC = () => {
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
        color1: [0.1, 0.1, 0.18], // Dark blue
        color2: [0.16, 0.13, 0.26], // Dark purple
        color3: [0.05, 0.19, 0.38], // Deep blue
      };
    }
    
    return {
      time,
      resolution: [width, height],
      color1: [0.4, 0.56, 0.92], // Light blue
      color2: [0.46, 0.29, 0.66], // Purple
      color3: [0.94, 0.58, 0.98], // Pink
    };
  }, [time, colorScheme]);

  return (
    <Canvas style={styles.canvas}>
      <Shader source={blobShader} uniforms={uniforms} />
    </Canvas>
  );
};

const styles = StyleSheet.create({
  canvas: {
    ...StyleSheet.absoluteFillObject,
  },
});
