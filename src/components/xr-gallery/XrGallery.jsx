import { OrbitControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { Interactive, useHitTest, useXR } from "@react-three/xr";
import { Fragment, useRef, useState } from "react";
import { useCharacterAnimations } from "../../contexts/CharacterAnimations";
import Tshirt from "./Tshirt";
import Blouse from "./Blouse";
import Jacket from "./Jacket";

const XrOverlay = () => {
  const reticleRef = useRef();
  const [models, setModels] = useState([]);
  const { currentModelName } = useCharacterAnimations();
  const { isPresenting } = useXR();

  // Set camera position in non-XR mode
  useThree(({ camera }) => {
    if (!isPresenting) {
      camera.position.z = 3;
    }
  });

  // Update reticle position when a surface is found
  useHitTest((hitMatrix) => {
    hitMatrix.decompose(
      reticleRef.current.position,
      reticleRef.current.quaternion,
      reticleRef.current.scale
    );

    reticleRef.current.rotation.set(-Math.PI / 2, 0, 0);
  });

  // Place model at reticle position + slight height offset
  const placeModel = () => {
    const offsetPosition = reticleRef.current.position.clone();
    offsetPosition.y += 0.1; // Lift model 10 cm above the surface
    const id = Date.now();
    setModels([{ position: offsetPosition, id }]);
  };

  // Render the selected clothing model
  const renderModel = (position, id) => {
    switch (currentModelName) {
      case "tshirt":
        return <Tshirt key={id} position={position} />;
      case "blouse":
        return <Blouse key={id} position={position} />;
      case "jacket":
        return <Jacket key={id} position={position} />;
      default:
        return null;
    }
  };

  return (
    <>
      <OrbitControls />
      <ambientLight />

      {/* Render placed model(s) in AR */}
      {isPresenting &&
        models.map(({ position, id }) => renderModel(position, id))}

      {/* Render model in non-XR preview */}
      {!isPresenting && renderModel(undefined, "static-model")}

      {/* Reticle & interaction */}
      {isPresenting && (
        <Interactive onSelect={placeModel}>
          <mesh ref={reticleRef} rotation-x={-Math.PI / 2}>
            <ringGeometry args={[0.1, 0.25, 32]} />
            <meshStandardMaterial color={"white"} />
          </mesh>
        </Interactive>
      )}
    </>
  );
};

export default XrOverlay;
