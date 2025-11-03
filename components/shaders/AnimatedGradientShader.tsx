/**
 * Animated Gradient Shader
 * Creates a flowing, animated gradient background
 * Perfect for glass effect overlays
 */

import React, { useMemo, useEffect } from 'react';
import { Canvas, Shader, Skia, useValue } from '@shopify/react-native-skia';
import { Dimensions, StyleSheet } from 'react-native';

const { width, height } = Dimensions.get('window');

// GLSL Shader for animated gradient
const gradientShader = Skia.RuntimeEffect.Make(`
  uniform float time;
  uniform vec2 resolution;
  
  vec3 palette(float t) {
    vec3 a = vec3(0.5, 0.5, 0.5);
    vec3 b = vec3(0.5, 0.5, 0.5);
    vec3 c = vec3(1.0, 1.0, 1.0);
    vec3 d = vec3(0.263, 0.416, 0.557);
    
    return a + b * cos(6.28318 * (c * t + d));
  }
  
  vec4 main(vec2 fragCoord) {
    vec2 uv = fragCoord / resolution.xy;
    vec2 uv0 = uv;
    vec3 finalColor = vec3(0.0);
    
    for (float i = 0.0; i < 3.0; i++) {
      uv = fract(uv * 1.5) - 0.5;
      
      float d = length(uv) * exp(-length(uv0));
      
      vec3 col = palette(length(uv0) + i * 0.4 + time * 0.4);
      
      d = sin(d * 8.0 + time) / 8.0;
      d = abs(d);
      
      d = pow(0.01 / d, 1.2);
      
      finalColor += col * d;
    }
    
    return vec4(finalColor, 1.0);
  }
`)!;

export const AnimatedGradientShader: React.FC = () => {
  const time = useValue(0);

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000;
      time.current = elapsed;
    }, 16); // ~60fps

    return () => clearInterval(interval);
  }, [time]);

  const uniforms = useMemo(
    () => ({
      time,
      resolution: [width, height],
    }),
    [time]
  );

  return (
    <Canvas style={styles.canvas}>
      <Shader source={gradientShader} uniforms={uniforms} />
    </Canvas>
  );
};

const styles = StyleSheet.create({
  canvas: {
    ...StyleSheet.absoluteFillObject,
  },
});
