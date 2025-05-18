import { useGLTF } from "@react-three/drei";
import { useRef } from "react";

const Jacket = ({ position }) => {
  const modelRef = useRef();
  const gltf = useGLTF("/models/denimJacket.glb");

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[5, 10, 7.5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <pointLight position={[0, 2, 5]} intensity={0.4} />

      <primitive
        ref={modelRef}
        object={gltf.scene}
        position={position}
        scale={1}
      />
    </>
  );
};

export default Jacket;
