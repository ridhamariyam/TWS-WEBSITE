import * as THREE from "three";

/** The pieces the homepage's WebGL scenes share. */

export function createRenderer(canvas: HTMLCanvasElement, alpha: boolean) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  return renderer;
}

/** Releases every geometry and material under `root`. */
export function disposeTree(root: THREE.Object3D) {
  root.traverse((node) => {
    if (node instanceof THREE.Mesh || node instanceof THREE.Points) {
      node.geometry.dispose();
      const materials = Array.isArray(node.material) ? node.material : [node.material];
      materials.forEach((material) => material.dispose());
    }
  });
}

export const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
