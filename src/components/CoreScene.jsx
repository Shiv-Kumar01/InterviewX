import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import Pipeline from './Pipeline';

const STAGES = ['Knowledge', 'Interview', 'Analysis', 'Feedback', 'Improvement'];

// A ring of five nodes around a wireframe "core". Nodes drift and the group tilts toward the mouse.
export default function CoreScene() {
  const mount = useRef(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const el = mount.current;
    let renderer;
    try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); } catch { setFailed(true); return undefined; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    camera.position.z = 7;
    const group = new THREE.Group();
    scene.add(group);

    const teal = 0x4fd8c4, blue = 0x5b9dff;
    const core = new THREE.Mesh(new THREE.IcosahedronGeometry(1.1, 1), new THREE.MeshBasicMaterial({ color: teal, wireframe: true, transparent: true, opacity: 0.55 }));
    group.add(core);

    const nodes = STAGES.map((_, i) => {
      const a = (i / STAGES.length) * Math.PI * 2;
      const m = new THREE.Mesh(new THREE.SphereGeometry(0.22, 24, 24), new THREE.MeshBasicMaterial({ color: i === 2 ? teal : blue }));
      m.userData = { a, r: 2.6 };
      group.add(m);
      return m;
    });
    const lineMat = new THREE.LineBasicMaterial({ color: blue, transparent: true, opacity: 0.45 });
    const ring = new THREE.LineLoop(new THREE.BufferGeometry(), lineMat);
    group.add(ring);
    const spokes = nodes.map(() => { const l = new THREE.Line(new THREE.BufferGeometry(), new THREE.LineBasicMaterial({ color: teal, transparent: true, opacity: 0.2 })); group.add(l); return l; });

    const dust = new THREE.Points(
      new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(Array.from({ length: 240 }, () => (Math.random() - 0.5) * 14), 3)),
      new THREE.PointsMaterial({ color: 0x93a1b8, size: 0.03, transparent: true, opacity: 0.6 })
    );
    scene.add(dust);

    const size = () => { const w = el.clientWidth, h = el.clientHeight; renderer.setSize(w, h); camera.aspect = w / h; camera.updateProjectionMatrix(); };
    size();
    const ro = new ResizeObserver(size); ro.observe(el);

    const mouse = { x: 0, y: 0 };
    const onMove = (e) => { const r = el.getBoundingClientRect(); mouse.x = ((e.clientX - r.left) / r.width - 0.5) * 2; mouse.y = ((e.clientY - r.top) / r.height - 0.5) * 2; };
    window.addEventListener('pointermove', onMove);

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf, t = 0;
    const frame = () => {
      t += 0.01;
      nodes.forEach((n, i) => {
        const a = n.userData.a + t * 0.25;
        n.position.set(Math.cos(a) * n.userData.r, Math.sin(a) * n.userData.r * 0.7, Math.sin(t * 1.3 + i) * 0.4);
      });
      ring.geometry.setFromPoints(nodes.map((n) => n.position));
      spokes.forEach((s, i) => s.geometry.setFromPoints([new THREE.Vector3(), nodes[i].position]));
      core.rotation.y += 0.004; core.rotation.x += 0.002;
      group.rotation.y += (mouse.x * 0.35 - group.rotation.y) * 0.05;
      group.rotation.x += (mouse.y * 0.25 - group.rotation.x) * 0.05;
      renderer.render(scene, camera);
      if (!reduce) raf = requestAnimationFrame(frame);
    };
    frame();

    return () => {
      cancelAnimationFrame(raf); ro.disconnect(); window.removeEventListener('pointermove', onMove);
      scene.traverse((o) => { o.geometry?.dispose(); o.material?.dispose?.(); });
      renderer.dispose(); renderer.domElement.remove();
    };
  }, []);

  if (failed) return <Pipeline />;
  return (
    <div>
      <div ref={mount} className="scene" role="img" aria-label="Animated network: Knowledge, Interview, Analysis, Feedback, Improvement" />
      <p className="scene-legend">{STAGES.join('  →  ')}</p>
    </div>
  );
}
