import { useEffect, useRef } from "react";
import type { HTMLAttributes } from "react";

import "./ThreadsBackground.css";

const vertexShader = `
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragmentShader = `
precision highp float;

uniform float iTime;
uniform vec3 iResolution;
uniform vec3 uColor;
uniform float uAmplitude;
uniform float uDistance;
uniform vec2 uMouse;
uniform float uFixedLeftEdge;

#define PI 3.1415926538

const int u_line_count = 32;
const float u_line_width = 46.0;
const float u_line_blur = 30.0;

float Perlin2D(vec2 P) {
    vec2 Pi = floor(P);
    vec4 Pf_Pfmin1 = P.xyxy - vec4(Pi, Pi + 1.0);
    vec4 Pt = vec4(Pi.xy, Pi.xy + 1.0);
    Pt = Pt - floor(Pt * (1.0 / 71.0)) * 71.0;
    Pt += vec2(26.0, 161.0).xyxy;
    Pt *= Pt;
    Pt = Pt.xzxz * Pt.yyww;
    vec4 hash_x = fract(Pt * (1.0 / 951.135664));
    vec4 hash_y = fract(Pt * (1.0 / 642.949883));
    vec4 grad_x = hash_x - 0.49999;
    vec4 grad_y = hash_y - 0.49999;
    vec4 grad_results = inversesqrt(grad_x * grad_x + grad_y * grad_y)
        * (grad_x * Pf_Pfmin1.xzxz + grad_y * Pf_Pfmin1.yyww);
    grad_results *= 1.4142135623730950;
    vec2 blend = Pf_Pfmin1.xy * Pf_Pfmin1.xy * Pf_Pfmin1.xy
               * (Pf_Pfmin1.xy * (Pf_Pfmin1.xy * 6.0 - 15.0) + 10.0);
    vec4 blend2 = vec4(blend, vec2(1.0 - blend));
    return dot(grad_results, blend2.zxzx * blend2.wwyy);
}

float pixel(float count, vec2 resolution) {
    return (1.0 / max(resolution.x, resolution.y)) * count;
}

float lineFn(vec2 st, float width, float perc, float offset, vec2 mouse, float time, float amplitude, float distance) {
    float split_offset = (perc * 0.4);
    float split_point = 0.1 + split_offset;

    // When uFixedLeftEdge is 0, the lines wave across the full width (the left
    // edge moves just like the right). When 1, the original left-anchored
    // falloff applies so the left side stays still.
    float amplitude_normal = mix(1.0, smoothstep(split_point, 0.7, st.x), uFixedLeftEdge);
    float amplitude_strength = 1.5;
    float finalAmplitude = amplitude_normal * amplitude_strength
                           * amplitude * (1.0 + (mouse.y - 0.5) * 0.2);

    float time_scaled = time / 10.0 + (mouse.x - 0.5) * 1.0;
    float blur = mix(perc, smoothstep(split_point, split_point + 0.05, st.x) * perc, uFixedLeftEdge);

    float xnoise = mix(
        Perlin2D(vec2(time_scaled, st.x + perc) * 2.5),
        Perlin2D(vec2(time_scaled, st.x + time_scaled) * 3.5) / 1.5,
        st.x * 0.3
    );

    float y = 0.5 + (perc - 0.5) * distance + xnoise / 2.0 * finalAmplitude;

    float line_start = smoothstep(
        y + (width / 2.0) + (u_line_blur * pixel(1.0, iResolution.xy) * blur),
        y,
        st.y
    );

    float line_end = smoothstep(
        y,
        y - (width / 2.0) - (u_line_blur * pixel(1.0, iResolution.xy) * blur),
        st.y
    );

    return clamp(
        (line_start - line_end) * (1.0 - smoothstep(0.0, 1.0, pow(perc, 0.3))),
        0.0,
        1.0
    );
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = fragCoord / iResolution.xy;

    float line_strength = 1.0;
    for (int i = 0; i < u_line_count; i++) {
        float p = float(i) / (float(u_line_count) * 2.0);
        line_strength *= (1.0 - lineFn(
            uv,
            u_line_width * pixel(1.0, iResolution.xy) * (1.0 - p),
            p,
            (PI * 1.0) * p,
            uMouse,
            iTime,
            uAmplitude,
            uDistance
        ));
    }

    float colorVal = 1.0 - line_strength;
    fragColor = vec4(uColor * colorVal, colorVal);
}

void main() {
    mainImage(gl_FragColor, gl_FragCoord.xy);
}
`;

export type ThreadsBackgroundProps = {
  /** RGB color of the lines, each channel in 0..1 range. */
  color?: [number, number, number];
  /** Intensity of the wave effect on the lines. */
  amplitude?: number;
  /** Spacing between the lines. 0 means no offset. */
  distance?: number;
  /** Enables smooth mouse hover effects that modulate line movement. */
  enableMouseInteraction?: boolean;
  /** When true (default) the left edge of the lines stays anchored and only
   *  the right side waves. When false, the lines wave across the full width. */
  fixedLeftEdge?: boolean;
} & Omit<HTMLAttributes<HTMLDivElement>, "color">;

const ThreadsBackground = ({
  color = [1, 1, 1],
  amplitude = 1,
  distance = 0,
  enableMouseInteraction = false,
  fixedLeftEdge = true,
  ...rest
}: ThreadsBackgroundProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameId = useRef<number>(0);

  // Keep the latest props in a ref so updating them mutates the live shader
  // uniforms instead of tearing down and rebuilding the whole WebGL context.
  const propsRef = useRef({
    color,
    amplitude,
    distance,
    enableMouseInteraction,
    fixedLeftEdge,
  });
  propsRef.current = {
    color,
    amplitude,
    distance,
    enableMouseInteraction,
    fixedLeftEdge,
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // --- Set up canvas + raw WebGL 1 context (no external deps) ---
    const canvas = document.createElement("canvas");
    container.appendChild(canvas);

    const gl =
      (canvas.getContext("webgl", {
        alpha: true,
        premultipliedAlpha: false,
      }) as WebGLRenderingContext | null) ||
      (canvas.getContext("experimental-webgl", {
        alpha: true,
      }) as WebGLRenderingContext | null);
    if (!gl) return;

    gl.clearColor(0, 0, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    // --- Compile + link the shader program ---
    function compileShader(type: number, source: string): WebGLShader {
      const shader = gl.createShader(type)!;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        const info = gl.getShaderInfoLog(shader);
        gl.deleteShader(shader);
        throw new Error(`Shader compile error: ${info}`);
      }
      return shader;
    }

    const vs = compileShader(gl.VERTEX_SHADER, vertexShader);
    const fs = compileShader(gl.FRAGMENT_SHADER, fragmentShader);
    const program = gl.createProgram()!;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      const info = gl.getProgramInfoLog(program);
      gl.deleteProgram(program);
      throw new Error(`Program link error: ${info}`);
    }
    gl.useProgram(program);

    // --- Fullscreen triangle: 3 verts, each with position (vec2) + uv (vec2).
    // Covers clip space [-1,1]^2 with a single oversized triangle so the
    // fragment shader runs for every pixel without a quad's diagonal seam. ---
    const vertices = new Float32Array([
      // x,    y,   u,   v
      -1, -1, 0, 0, 3, -1, 2, 0, -1, 3, 0, 2,
    ]);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const FBYTES = 4;
    const STRIDE = 4 * FBYTES;
    const positionLoc = gl.getAttribLocation(program, "position");
    if (positionLoc >= 0) {
      gl.enableVertexAttribArray(positionLoc);
      gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, STRIDE, 0);
    }
    // uv is declared in the vertex shader but the fragment shader uses
    // gl_FragCoord, so the linker may strip the varying. Guard accordingly.
    const uvLoc = gl.getAttribLocation(program, "uv");
    if (uvLoc >= 0) {
      gl.enableVertexAttribArray(uvLoc);
      gl.vertexAttribPointer(uvLoc, 2, gl.FLOAT, false, STRIDE, 2 * FBYTES);
    }

    // --- Uniform locations (fetched once; values updated each frame) ---
    const uTimeLoc = gl.getUniformLocation(program, "iTime");
    const uResolutionLoc = gl.getUniformLocation(program, "iResolution");
    const uColorLoc = gl.getUniformLocation(program, "uColor");
    const uAmplitudeLoc = gl.getUniformLocation(program, "uAmplitude");
    const uDistanceLoc = gl.getUniformLocation(program, "uDistance");
    const uMouseLoc = gl.getUniformLocation(program, "uMouse");
    const uFixedLeftEdgeLoc = gl.getUniformLocation(program, "uFixedLeftEdge");

    // --- Resize: cap internal render resolution to keep the (heavy, per-pixel
    // Perlin noise) shader smooth on large / high-DPI screens. ---
    const MAX_RENDER_DIM = 1920;
    function resize() {
      const { clientWidth, clientHeight } = container;
      const baseDpr = Math.min(window.devicePixelRatio || 1, 2);
      const longestSide = Math.max(clientWidth, clientHeight) * baseDpr;
      const dpr = longestSide > MAX_RENDER_DIM ? (baseDpr * MAX_RENDER_DIM) / longestSide : baseDpr;
      const w = Math.max(1, Math.floor(clientWidth * dpr));
      const h = Math.max(1, Math.floor(clientHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      gl.viewport(0, 0, canvas.width, canvas.height);
    }

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    window.addEventListener("resize", resize);
    resize();

    // --- Mouse interaction (smoothed) ---
    const currentMouse = [0.5, 0.5];
    let targetMouse = [0.5, 0.5];

    function handleMouseMove(e: MouseEvent) {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = 1.0 - (e.clientY - rect.top) / rect.height;
      targetMouse = [x, y];
    }
    function handleMouseLeave() {
      targetMouse = [0.5, 0.5];
    }
    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);

    // --- Only animate while the canvas is on screen and the tab is visible. ---
    let isVisible = true;
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0].isIntersecting;
      },
      { threshold: 0 },
    );
    intersectionObserver.observe(container);

    // --- Render loop ---
    function update(t: number) {
      animationFrameId.current = requestAnimationFrame(update);
      if (!isVisible || document.hidden) return;

      const {
        color: c,
        amplitude: amp,
        distance: dist,
        enableMouseInteraction: mouseOn,
        fixedLeftEdge: fixedLeft,
      } = propsRef.current;

      if (mouseOn) {
        const smoothing = 0.05;
        currentMouse[0] += smoothing * (targetMouse[0] - currentMouse[0]);
        currentMouse[1] += smoothing * (targetMouse[1] - currentMouse[1]);
      } else {
        currentMouse[0] = 0.5;
        currentMouse[1] = 0.5;
      }

      gl.uniform1f(uTimeLoc, t * 0.001);
      gl.uniform3f(uResolutionLoc, canvas.width, canvas.height, canvas.width / canvas.height);
      gl.uniform3f(uColorLoc, c[0], c[1], c[2]);
      gl.uniform1f(uAmplitudeLoc, amp);
      gl.uniform1f(uDistanceLoc, dist);
      gl.uniform2f(uMouseLoc, currentMouse[0], currentMouse[1]);
      gl.uniform1f(uFixedLeftEdgeLoc, fixedLeft ? 1 : 0.0);

      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
    animationFrameId.current = requestAnimationFrame(update);

    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      window.removeEventListener("resize", resize);
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
      if (container.contains(canvas)) container.removeChild(canvas);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  return <div ref={containerRef} className="threads-container" {...rest} />;
};

export default ThreadsBackground;
