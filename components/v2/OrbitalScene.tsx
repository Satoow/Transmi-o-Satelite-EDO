"use client";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF, useTexture, Line } from "@react-three/drei";
import {
  Suspense,
  useMemo,
  useRef,
  useEffect,
  Component,
  type ReactNode,
} from "react";
import {
  Box3,
  Vector3,
  Quaternion,
  Euler,
  Group,
  Mesh,
  MeshPhongMaterial,
  ShaderMaterial,
  SRGBColorSpace,
} from "three";
import type { OrbitControls as OrbitControlsType } from "three-stdlib";
import ThreeGlobe from "three-globe";
export type SceneProps = {
  simulation?: boolean;
  error?: number;
  time?: number;
  running?: boolean;
  autoRotate?: boolean;
  command?: { id: number; action: "reset" | "in" | "out" };
  onReady?: () => void;
};
const earthPosition = new Vector3(-1.4, 0, 0);
// Same São Luís station, Earth renderer and surface configuration as the reference.
const lat = (-2.53 * Math.PI) / 180,
  lng = (-44.3 * Math.PI) / 180;
const station = new Vector3(
  Math.cos(lat) * Math.sin(lng),
  Math.sin(lat),
  Math.cos(lat) * Math.cos(lng),
)
  .multiplyScalar(2.52)
  .applyAxisAngle(new Vector3(0, 1, 0), 1.25)
  .add(earthPosition);
const satellite = new Vector3(3.1, 1.4, station.z);
export function Fallback({
  error = 0,
  onReady,
}: {
  error?: number;
  onReady?: () => void;
}) {
  useEffect(() => {
    onReady?.();
  }, [onReady]);
  return (
    <div className="fallback">
      <svg
        viewBox="0 0 700 400"
        role="img"
        aria-label="Diagrama alternativo do apontamento"
      >
        <circle cx="210" cy="220" r="120" fill="#123447" />
        <text x="185" y="225" fill="#fff">
          Terra
        </text>
        <path d="M500 100L310 170" stroke="#9baebc" strokeDasharray="5 6" />
        <g
          transform={`translate(500 100) rotate(${-20 + (error * 180) / Math.PI})`}
        >
          <path d="M0 0H-202" stroke="#79e8db" strokeWidth="3" />
          <rect x="-18" y="-18" width="36" height="36" fill="#d4bc75" />
        </g>
      </svg>
      <p>
        Visualização 2D · O 3D não pôde ser carregado. Os cálculos continuam
        disponíveis.
      </p>
      <button onClick={() => location.reload()}>
        Tentar carregar novamente
      </button>
    </div>
  );
}
class SceneBoundary extends Component<
  { children: ReactNode; error: number; onReady?: () => void },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <Fallback error={this.props.error} onReady={this.props.onReady} />
    ) : (
      this.props.children
    );
  }
}
function Earth() {
  const globe = useMemo(() => {
    const g = new ThreeGlobe({ animateIn: false })
      .globeImageUrl("/textures/earth-night.jpg")
      .bumpImageUrl("/textures/earth-topology.png")
      .showAtmosphere(true)
      .atmosphereColor("#72DBE7")
      .atmosphereAltitude(0.15)
      .showGraticules(true);
    const material = g.globeMaterial() as MeshPhongMaterial;
    material.color.set("#b5c9e6");
    material.emissive.set("#000000");
    material.emissiveIntensity = 0;
    material.shininess = 8;
    material.bumpScale = 0.12;
    g.scale.setScalar(0.025);
    g.onGlobeReady(() => {
      material.emissiveMap = material.map;
      material.emissive.set("#ffffff");
      material.emissiveIntensity = 0.45;
      material.needsUpdate = true;
      g.traverse((obj) => {
        if (
          obj instanceof Mesh &&
          obj.material instanceof ShaderMaterial &&
          obj.material.uniforms.hollowRadius
        )
          obj.material.uniforms.hollowRadius.value = 2.5;
      });
    });
    return g;
  }, []);
  useEffect(
    () => () => {
      globe._destructor();
    },
    [globe],
  );
  return (
    <group position={earthPosition} rotation={[0, 1.25, 0]}>
      <primitive object={globe} />
    </group>
  );
}
function SatelliteModel() {
  const gltf = useGLTF(
    "/models/Tracking and Data Relay Satellites (TDRS) (D).glb",
    "/draco/",
  );
  const model = useMemo(() => {
    const copy = gltf.scene.clone(true);
    const bounds = new Box3().setFromObject(copy);
    const size = bounds.getSize(new Vector3());
    const scale = 2.65 / Math.max(size.x, size.y, size.z);
    copy.scale.setScalar(scale);
    copy.position.set(-0.6 * scale, -0.07 * scale, 0);
    copy.traverse((child) => {
      if (child instanceof Mesh) child.frustumCulled = false;
    });
    return copy;
  }, [gltf]);
  return <primitive object={model} />;
}
function Backdrop() {
  const texture = useTexture("/textures/night-sky.png");
  texture.colorSpace = SRGBColorSpace;
  return (
    <mesh>
      <sphereGeometry args={[70, 48, 32]} />
      <meshBasicMaterial map={texture} side={1} color="#73818f" />
    </mesh>
  );
}
function ViewControls({ autoRotate, command, simulation }: SceneProps) {
  const controls = useRef<OrbitControlsType>(null);
  const { camera, size } = useThree();
  useEffect(() => {
    const c = controls.current;
    if (!c) return;
    const reset = () => {
      const distance = Math.min(
        22,
        Math.max(
          simulation ? 10.5 : 11.7,
          2.3 + 10 / (0.767 * (size.width / size.height)),
        ),
      );
      camera.position.set(0.4, 1.4, distance);
      c.target.set(0, 0, 0);
      c.update();
    };
    if (!command || command.action === "reset") reset();
    else {
      const delta = camera.position.clone().sub(c.target);
      const length = Math.max(
        7,
        Math.min(22, delta.length() * (command.action === "in" ? 0.82 : 1.22)),
      );
      camera.position.copy(c.target).add(delta.setLength(length));
      c.update();
    }
  }, [command, camera, size.width, size.height, simulation]);
  return (
    <OrbitControls
      ref={controls}
      makeDefault
      autoRotate={autoRotate}
      autoRotateSpeed={0.15}
      enablePan={false}
      enableDamping
      dampingFactor={0.055}
      minDistance={7}
      maxDistance={22}
      minPolarAngle={0.35}
      maxPolarAngle={Math.PI - 0.35}
    />
  );
}
function World({
  simulation = false,
  error = 0,
  time = 0,
  running = false,
  onReady,
}: SceneProps) {
  const pulse = useRef<Group>(null);
  const direction = useMemo(
    () =>
      station
        .clone()
        .sub(satellite)
        .normalize()
        .applyAxisAngle(new Vector3(0, 0, 1), error),
    [error],
  );
  const rotation = useMemo(
    () => new Quaternion().setFromUnitVectors(new Vector3(0, 1, 0), direction),
    [direction],
  );
  const length = station.distanceTo(satellite);
  const endpoint = satellite.clone().addScaledVector(direction, length);
  useFrame(() => {
    if (pulse.current) {
      const fraction = (time * 0.65) % 1;
      pulse.current.position.copy(satellite).lerp(endpoint, fraction);
    }
  });
  useEffect(() => {
    onReady?.();
  }, [onReady]);
  return (
    <>
      <ambientLight intensity={1.6} />
      <directionalLight position={[-6, 5, 8]} intensity={3.1} color="#dcefff" />
      <directionalLight position={[6, -2, 4]} intensity={1.5} color="#a3c6ed" />
      <Backdrop />
      <Earth />
      <group
        position={satellite}
        quaternion={
          simulation
            ? rotation
            : new Quaternion().setFromEuler(new Euler(0.8, 0.35, -0.5))
        }
      >
        <SatelliteModel />
      </group>
      {simulation && (
        <>
          <Line
            points={[satellite, station]}
            color="#91a9b5"
            lineWidth={1}
            dashed
            dashSize={0.09}
            gapSize={0.09}
          />
          <Line
            points={[satellite, endpoint]}
            color={Math.abs(error) <= Math.PI / 180 ? "#79e8db" : "#e9b977"}
            lineWidth={2}
          />
          <group ref={pulse} visible={running}>
            <mesh>
              <sphereGeometry args={[0.045, 12, 12]} />
              <meshBasicMaterial color="#d8fff7" />
            </mesh>
          </group>
          <mesh position={station}>
            <sphereGeometry args={[0.045, 16, 16]} />
            <meshBasicMaterial color="#79e8db" />
          </mesh>
        </>
      )}
    </>
  );
}
export default function OrbitalScene(props: SceneProps) {
  return (
    <SceneBoundary error={props.error ?? 0} onReady={props.onReady}>
      <Canvas
        camera={{ position: [0.4, 1.4, 12.5], fov: 42 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: false }}
        fallback={<Fallback error={props.error} onReady={props.onReady} />}
      >
        <Suspense fallback={null}>
          <World {...props} />
        </Suspense>
        <ViewControls {...props} />
      </Canvas>
    </SceneBoundary>
  );
}
