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

  useThree(({ camera }) => {
    if (!isPresenting) {
      camera.position.z = 3;
    }
  });

  useHitTest((hitMatrix, hit) => {
    hitMatrix.decompose(
      reticleRef.current.position,
      reticleRef.current.quaternion,
      reticleRef.current.scale
    );

    reticleRef.current.rotation.set(-Math.PI / 2, 0, 0);
  });

  const placeModel = (e) => {
    let position = e.intersection.object.position.clone();
    let id = Date.now();
    setModels([{ position, id }]);
  };

  return (
    <>
      <OrbitControls />
      <ambientLight />
      {isPresenting &&
        models.map(({ position, id }) => {
          return (
            <Fragment key={id}>
              {currentModelName === "tshirt" && (
                <Tshirt position={position} />)}
              {currentModelName === "blouse" && (
                <Blouse position={position} />
              )}
              {currentModelName === "jacket" && (
                <Jacket position={position} />
              )}
            </Fragment>
          );
        })}
      {isPresenting && (
        <Interactive onSelect={placeModel}>
          <mesh ref={reticleRef} rotation-x={-Math.PI / 2}>
            <ringGeometry args={[0.1, 0.25, 32]} />
            <meshStandardMaterial color={"white"} />
          </mesh>
        </Interactive>
      )}

      {!isPresenting && currentModelName === "tshirt" && <Tshirt />}
      {!isPresenting && currentModelName === "blouse" && (
        <Blouse />
      )}
      {!isPresenting && currentModelName === "jacket" && <Jacket />}
    </>
  );
};

export default XrOverlay;
