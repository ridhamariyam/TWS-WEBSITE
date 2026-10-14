"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { createRenderer, disposeTree, prefersReducedMotion } from "./three-kit";
import { easeInOut, easeOut, lerp, range, useScrollStage } from "./use-scroll-stage";
import styles from "./flow.module.css";

/*
 * The dive. A sphere of particles turns slowly; scrolling flies
 * the camera into the sphere, which bursts outward into a field that drifts
 * past on either side, and the type comes into focus once the camera is through.
 *
 * The scene renders only while the section is on screen.
 */

const COUNT = 7000;
const RADIUS = 3;
/*
 * Violet, dark navy and blue. The navy is lifted from the brand's #0b1440,
 * which would vanish under additive blending on the black stage.
 */
const PALETTE = [0x7c3aed, 0x1d2b7a, 0x2f5bff, 0x7c3aed, 0x1d2b7a, 0x2f5bff];

const VERTEX = /* glsl */ `
  attribute vec3 aColor;
  attribute float aSeed;
  uniform float uTime;
  uniform float uExpand;
  uniform float uSize;
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    vec3 dir = normalize(position);
    vec3 p = position * (1.0 + uExpand * (0.4 + aSeed * 2.6));
    p += dir * 0.04 * sin(uTime * 0.9 + aSeed * 40.0);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    float depth = -mv.z;
    gl_PointSize = min(uSize / max(depth, 0.001), 28.0);
    vColor = aColor;
    vAlpha = smoothstep(0.15, 1.2, depth) * (0.55 + 0.45 * aSeed);
  }
`;

const FRAGMENT = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    gl_FragColor = vec4(vColor, smoothstep(0.5, 0.0, d) * vAlpha);
  }
`;

function createSphere() {
  const positions = new Float32Array(COUNT * 3);
  const colors = new Float32Array(COUNT * 3);
  const seeds = new Float32Array(COUNT);
  const color = new THREE.Color();
  const golden = Math.PI * (3 - Math.sqrt(5));

  for (let i = 0; i < COUNT; i++) {
    // A Fibonacci sphere, roughened so it reads as a cloud, not a lattice.
    const y = 1 - (i / (COUNT - 1)) * 2;
    const ring = Math.sqrt(1 - y * y);
    const theta = golden * i;
    const r = RADIUS * (1 + (Math.random() - 0.5) * 0.12);
    positions.set([Math.cos(theta) * ring * r, y * r, Math.sin(theta) * ring * r], i * 3);
    color.setHex(PALETTE[i % PALETTE.length]);
    colors.set([color.r, color.g, color.b], i * 3);
    seeds[i] = Math.random();
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("aColor", new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));

  const material = new THREE.ShaderMaterial({
    vertexShader: VERTEX,
    fragmentShader: FRAGMENT,
    uniforms: {
      uTime: { value: 0 },
      uExpand: { value: 0 },
      uSize: { value: 30 },
    },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  return new THREE.Points(geometry, material);
}

export function ParticleDive() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const progress = useRef(0);

  useScrollStage(sectionRef, (p) => {
    progress.current = p;
    const stage = stageRef.current;
    if (!stage) return;
    const set = (name: string, value: number) => stage.style.setProperty(name, value.toFixed(3));
    // The hero's closing panel covers the screen in this stage's own black, so the
    // stage can turn opaque the instant it pins and the sphere fade up on it.
    stage.toggleAttribute("data-entered", p > 0);
    set("--enter", range(p, 0, 0.05));
    set("--copy-top", range(p, 0.42, 0.6));
    set("--copy-bottom", range(p, 0.5, 0.68));
    set("--copy-text", range(p, 0.6, 0.74));
    set("--glow", range(p, 0.5, 0.75));
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = createRenderer(canvas, false);
    } catch {
      return; // No WebGL: the stage's CSS glow stands in.
    }
    renderer.setClearColor(0x000000, 1);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.05, 100);

    const sphere = createSphere();
    const uniforms = (sphere.material as THREE.ShaderMaterial).uniforms;
    scene.add(sphere);

    const resize = () => {
      const { clientWidth: w, clientHeight: h } = canvas;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      uniforms.uSize.value = 38 * renderer.getPixelRatio() * (h / 900);
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    const still = prefersReducedMotion();
    const clock = new THREE.Clock();
    let frame = 0;

    const draw = () => {
      const p = progress.current;
      const time = still ? 0 : clock.getElapsedTime();
      const fly = easeInOut(range(p, 0, 0.6));
      const burst = easeOut(range(p, 0.25, 0.85));

      camera.position.set(0, 0, lerp(9, 1.15, fly));
      camera.lookAt(0, 0, 0);
      uniforms.uTime.value = time;
      uniforms.uExpand.value = burst * 1.6;
      sphere.rotation.y = time * 0.05 + p * 1.4;
      sphere.rotation.x = p * 0.3;

      renderer.render(scene, camera);
    };

    const loop = () => {
      draw();
      frame = requestAnimationFrame(loop);
    };

    const visibility = new IntersectionObserver(([entry]) => {
      cancelAnimationFrame(frame);
      if (entry.isIntersecting) loop();
    });
    visibility.observe(section);

    return () => {
      cancelAnimationFrame(frame);
      visibility.disconnect();
      observer.disconnect();
      disposeTree(scene);
      renderer.dispose();
    };
  }, []);

  return (
    <section ref={sectionRef} className={styles.diveSection} aria-labelledby="dive-title">
      <div ref={stageRef} className={styles.diveStage}>
        <canvas ref={canvasRef} className={styles.diveCanvas} aria-hidden="true" />
        <div className={styles.diveCopy}>
          <h2 id="dive-title" className={styles.diveTitle}>
            <span className={styles.diveTitleTop}>Beyond</span>
            <span className={styles.diveTitleBottom}>ordinary</span>
          </h2>
          <div className={styles.diveText}>
            <p>People decide online now. Before they call, visit or buy, they look you up — and what they find decides what happens next.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
