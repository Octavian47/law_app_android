# Shader Components

Beautiful GLSL shaders that create stunning backgrounds for the glass effect UI using `@shopify/react-native-skia`.

## ⚠️ Important Note

**These shaders require a development build and do NOT work in Expo Go.**

Reason: `@shopify/react-native-skia` requires `react-native-reanimated` which needs native compilation.

To use shaders:
1. Run `npx expo run:ios` to create a development build
2. Uncomment shader imports in `app/(tabs)/index.tsx`
3. Enjoy GPU-accelerated shaders through liquid glass! 🎨

For Expo Go development, the app uses simple `LinearGradient` backgrounds.

## 🎨 Available Shaders

### 1. **AnimatedGradientShader**
Creates flowing, animated gradients with multiple color layers.

**Features:**
- Palette-based color generation
- Smooth animated transitions
- Multiple layered effects
- ~6 second loop duration

**Best for:** Vibrant, colorful backgrounds

```tsx
import { AnimatedGradientShader } from '@/components/shaders/AnimatedGradientShader';

<AnimatedGradientShader />
```

---

### 2. **MorphingBlobShader**
Creates organic, morphing blob shapes using signed distance fields.

**Features:**
- 3 morphing blobs
- Smooth union (metaball effect)
- Theme-aware colors (light/dark)
- ~8 second animation loop

**Best for:** Modern, organic look through glass

```tsx
import { MorphingBlobShader } from '@/components/shaders/MorphingBlobShader';

<MorphingBlobShader />
```

---

### 3. **NoiseShader**
Subtle animated Perlin-like noise for texture.

**Features:**
- Multi-octave fractal Brownian motion (FBM)
- Very subtle color variation
- Theme-aware base colors
- ~10 second slow animation

**Best for:** Subtle texture behind glass, minimal distraction

```tsx
import { NoiseShader } from '@/components/shaders/NoiseShader';

<NoiseShader />
```

---

## 🚀 Usage with Glass Effects

Shaders are designed to work perfectly with `expo-glass-effect`:

```tsx
<View style={StyleSheet.absoluteFill}>
  {/* Shader Background */}
  <MorphingBlobShader />
  
  {/* Glass card on top */}
  <GlassCard effect="clear">
    <Text>Content visible through glass with shader behind</Text>
  </GlassCard>
</View>
```

---

## 🎯 Performance

All shaders are GPU-accelerated and highly optimized:
- Run at 60fps on modern devices
- Minimal CPU usage
- Efficient GLSL code
- Smooth animations via `useLoop`

---

## 🛠️ Creating Custom Shaders

### Basic Template

```tsx
import { Canvas, Shader, Skia } from '@shopify/react-native-skia';
import { useLoop } from '@shopify/react-native-skia';

const myShader = Skia.RuntimeEffect.Make(`
  uniform float time;
  uniform vec2 resolution;
  
  vec4 main(vec2 fragCoord) {
    vec2 uv = fragCoord / resolution.xy;
    
    // Your shader code here
    vec3 color = vec3(uv.x, uv.y, sin(time));
    
    return vec4(color, 1.0);
  }
`)!;

export const MyShader = () => {
  const time = useLoop({ duration: 5000 });
  
  return (
    <Canvas style={StyleSheet.absoluteFillObject}>
      <Shader 
        source={myShader} 
        uniforms={{ time, resolution: [width, height] }} 
      />
    </Canvas>
  );
};
```

### GLSL Tips

1. **UV Coordinates**: Normalize `fragCoord` by dividing by `resolution`
2. **Time Animation**: Use `time` uniform for animations
3. **Performance**: Keep calculations simple, avoid loops when possible
4. **Colors**: Return `vec4(r, g, b, alpha)` where values are 0.0-1.0

---

## 🎨 Shader Ideas

Future shader possibilities:
- **Particle Systems** - Floating particles
- **Wave Patterns** - Sine wave ripples
- **Grid Distortion** - Warped grid lines
- **Chromatic Aberration** - RGB split effects
- **Voronoi Patterns** - Cellular textures
- **Fractal Noise** - Complex noise patterns
- **Aurora Borealis** - Northern lights effect
- **Liquid Metal** - Metallic reflections

---

## 📱 Testing

Test on your device:
1. Tap the shader button (top-right on home screen)
2. Cycle through: Gradient → Gradient-Animated → Blob → Noise → None
3. Watch shaders through glass cards!

---

## 🐛 Troubleshooting

### Shader Not Showing
- Ensure `@shopify/react-native-skia` is installed
- Check console for GLSL compilation errors
- Verify Canvas has proper dimensions

### Performance Issues
- Reduce animation duration (slower = less GPU work)
- Simplify shader calculations
- Test on actual device, not just simulator

### Black Screen
- Check GLSL syntax (GLSL ES is strict)
- Ensure all uniforms are provided
- Verify `RuntimeEffect.Make` succeeded (not null)

---

## 📚 Resources

- [Skia Shaders Docs](https://shopify.github.io/react-native-skia/docs/shaders/overview)
- [GLSL Reference](https://www.khronos.org/opengl/wiki/OpenGL_Shading_Language)
- [Shader Toy](https://www.shadertoy.com/) - Shader examples (convert GLSL to Skia format)
- [Book of Shaders](https://thebookofshaders.com/) - Learn GLSL

---

**Pro Tip:** The morphing blob shader looks absolutely incredible through the clear glass effect! 🤩
