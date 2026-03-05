import { useRef, useMemo, memo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

/**
 * V4 — Spiky Crystal
 * Noise-displaced sphere with sharp peaks, fresnel glow, dark core,
 * and a low-poly wireframe overlay. Optimized: 2 noise octaves,
 * lower subdivisions, removed mouse tracking, shared noise between meshes.
 */

const NOISE_GLSL = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}

float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);
  const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));
  vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);
  vec3 l=1.0-g;
  vec3 i1=min(g.xyz,l.zxy);
  vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;
  vec3 x2=x0-i2+C.yyy;
  vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(
    i.z+vec4(0.0,i1.z,i2.z,1.0))
    +i.y+vec4(0.0,i1.y,i2.y,1.0))
    +i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857;
  vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z);
  vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy;
  vec4 y=y_*ns.x+ns.yyyy;
  vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);
  vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0;
  vec4 s1=floor(b1)*2.0+1.0;
  vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
  vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);
  vec3 p1=vec3(a0.zw,h.y);
  vec3 p2=vec3(a1.xy,h.z);
  vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
  m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}
`;

const vertexShader = /* glsl */ `
  uniform float uTime;

  varying vec3 vNormal;
  varying float vDisplacement;

  ${NOISE_GLSL}

  void main() {
    vNormal = normalize(normalMatrix * normal);

    // 2 octaves (down from 3)
    float noise = snoise(position * 1.8 + uTime * 0.25);
    noise += snoise(position * 3.6 + uTime * 0.15) * 0.45;

    // Sharpen peaks
    noise = sign(noise) * pow(abs(noise), 0.7);

    float displacement = noise * 0.32;
    vDisplacement = displacement;

    vec3 newPos = position + normal * displacement;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uColor;

  varying vec3 vNormal;
  varying float vDisplacement;

  void main() {
    float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 2.2);

    vec3 color = uColor;
    color += fresnel * uColor * 1.0;

    float spikeGlow = smoothstep(0.0, 0.3, vDisplacement);
    color += spikeGlow * uColor * 0.6;
    color *= 0.85 + vDisplacement * 0.5;

    float alpha = 0.12 + fresnel * 0.7;
    gl_FragColor = vec4(color, alpha);
  }
`;

const wireVertexShader = /* glsl */ `
  uniform float uTime;

  ${NOISE_GLSL}

  void main() {
    float noise = snoise(position * 1.8 + uTime * 0.25);
    noise += snoise(position * 3.6 + uTime * 0.15) * 0.45;
    noise = sign(noise) * pow(abs(noise), 0.7);

    vec3 newPos = position + normal * noise * 0.32;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
  }
`;

const wireFragmentShader = /* glsl */ `
  uniform vec3 uColor;
  void main() {
    gl_FragColor = vec4(uColor, 0.15);
  }
`;

interface Props {
  color: string;
  entered?: boolean;
}

const INITIAL_SCALE = 0.85;

export const AboutSphereV4 = memo(function AboutSphereV4({ color, entered = false }: Props) {
  const meshRef = useRef<THREE.Mesh>(null);
  const wireRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const scaleRef = useRef(INITIAL_SCALE);
  const { invalidate } = useThree();

  const isMobile = useMemo(
    () => typeof window !== "undefined" && window.innerWidth < 768,
    [],
  );

  const detail = isMobile ? 18 : 36;
  const wireDetail = isMobile ? 6 : 10;

  const geometry = useMemo(() => new THREE.IcosahedronGeometry(1.2, detail), [detail]);
  const wireGeo = useMemo(() => new THREE.IcosahedronGeometry(1.2, wireDetail), [wireDetail]);
  const coreGeo = useMemo(() => new THREE.IcosahedronGeometry(0.85, 8), []);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uColor: { value: new THREE.Color(color) },
  }), []);

  const wireUniforms = useMemo(() => ({
    uTime: { value: 0 },
    uColor: { value: new THREE.Color(color) },
  }), []);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    uniforms.uTime.value = t;
    uniforms.uColor.value.set(color);
    wireUniforms.uTime.value = t;
    wireUniforms.uColor.value.set(color);

    const target = entered ? 1 : INITIAL_SCALE;
    scaleRef.current += (target - scaleRef.current) * 0.03;
    if (groupRef.current) groupRef.current.scale.setScalar(scaleRef.current);

    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.06;
      meshRef.current.rotation.x = Math.sin(t * 0.03) * 0.1;
    }
    if (wireRef.current && meshRef.current) {
      wireRef.current.rotation.copy(meshRef.current.rotation);
    }

    invalidate();
  });

  return (
    <group ref={groupRef} scale={INITIAL_SCALE}>
      <Float speed={1} rotationIntensity={0.1} floatIntensity={0.2}>
        <mesh geometry={coreGeo}>
          <meshBasicMaterial color="#000000" />
        </mesh>

        <mesh ref={meshRef} geometry={geometry}>
          <shaderMaterial
            vertexShader={vertexShader}
            fragmentShader={fragmentShader}
            uniforms={uniforms}
            transparent
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>

        <mesh ref={wireRef} geometry={wireGeo}>
          <shaderMaterial
            vertexShader={wireVertexShader}
            fragmentShader={wireFragmentShader}
            uniforms={wireUniforms}
            transparent
            wireframe
            depthWrite={false}
          />
        </mesh>
      </Float>
    </group>
  );
});
