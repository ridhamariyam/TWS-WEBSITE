"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "./three-kit";

/*
 * Dark blue silk, out of focus: a slow, warped field shaded as if lit from
 * above, so soft folds of cobalt roll through navy shadow, with a fine grain
 * over it.
 *
 * One fragment shader on a bare WebGL canvas, drawn at half resolution (it
 * is all soft gradients) and only while it is on screen. Reduced motion gets
 * a single still frame.
 */

const VERTEX = `
attribute vec2 p;
void main() { gl_Position = vec4(p, 0.0, 1.0); }
`;

const FRAGMENT = `
precision highp float;
uniform vec2 res;
uniform float time;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  mat2 r = mat2(0.8, 0.6, -0.6, 0.8);
  for (int i = 0; i < 3; i++) { v += a * noise(p); p = r * p * 2.0; a *= 0.5; }
  return v;
}

// The cloth: broad folds, warped twice so they drift and twist like fabric.
float cloth(vec2 uv, float t) {
  vec2 q = vec2(fbm(uv + vec2(0.0, t)), fbm(uv + vec2(4.3, -t * 0.8)));
  vec2 r = vec2(fbm(uv + 2.2 * q + vec2(1.7, 9.2) + t * 0.6), fbm(uv + 2.2 * q + vec2(8.3, 2.8) - t * 0.5));
  return fbm(uv * 0.9 + 2.4 * r);
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * res) / res.y * 0.85;
  float t = time * 0.045;

  float h = cloth(uv, t);
  // Lit from the upper left: the slope of the cloth decides how bright.
  float e = 0.035;
  float dx = cloth(uv + vec2(e, 0.0), t) - h;
  float dy = cloth(uv + vec2(0.0, e), t) - h;
  float light = clamp(0.5 + (-dx * 0.7 + dy * 0.9) * 9.0, 0.0, 1.0);
  float tone = clamp(h * 0.55 + light * 0.65 - 0.12, 0.0, 1.0);
  tone = smoothstep(0.05, 0.95, tone);

  vec3 shadow = vec3(0.008, 0.035, 0.13);
  vec3 mid = vec3(0.02, 0.19, 0.47);
  vec3 sheen = vec3(0.09, 0.38, 0.76);
  vec3 col = tone < 0.55 ? mix(shadow, mid, tone / 0.55) : mix(mid, sheen, (tone - 0.55) / 0.45);

  // Fine grain, moving with time, as on film.
  col += (hash(gl_FragCoord.xy + fract(time) * 91.0) - 0.5) * 0.035;
  gl_FragColor = vec4(col, 1.0);
}
`;

export function SilkField({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas?.getContext("webgl", { antialias: false, alpha: false, premultipliedAlpha: false });
    if (!canvas || !gl) return;

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const program = gl.createProgram()!;
    const vs = compile(gl.VERTEX_SHADER, VERTEX);
    const fs = compile(gl.FRAGMENT_SHADER, FRAGMENT);
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(program, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const res = gl.getUniformLocation(program, "res");
    const time = gl.getUniformLocation(program, "time");

    const resize = () => {
      const scale = 0.5 * Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(canvas.clientWidth * scale));
      canvas.height = Math.max(1, Math.round(canvas.clientHeight * scale));
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(res, canvas.width, canvas.height);
    };
    const draw = (seconds: number) => {
      gl.uniform1f(time, seconds);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    resize();
    const still = prefersReducedMotion();
    let frame = 0;
    let visible = false;
    const start = performance.now();
    const loop = () => {
      draw((performance.now() - start) / 1000 + 20);
      frame = visible ? requestAnimationFrame(loop) : 0;
    };

    draw(20);
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !still && !frame) frame = requestAnimationFrame(loop);
    });
    observer.observe(canvas);
    const onResize = () => {
      resize();
      if (still || !visible) draw(20);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", onResize);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buffer);
    };
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
