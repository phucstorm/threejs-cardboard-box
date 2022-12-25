import BoxFace from "./BoxFace";
import { OrthographicCamera, PerspectiveCamera } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import React, { Suspense, useRef, useEffect } from "react";

const BoxDieline = ({ length, width, height, lineColor }) => {
  const groupRef = useRef();

  useEffect(() => {
    const bottomFace = renderBottomFace();
    const bottomLeftFace = renderBottomLeftFace();
    const bottomRightFace = renderBottomRightFace();
    const belowFrontFace = renderBelowFrontFace();
    const upperFrontFace = renderUpperFrontFace();
    const upperFace = renderUpperFace();
    const lengthDefineLine = renderLengthDefineLine();
    const widthDefineLine = renderWidthDefineLine();
    const heightDefineLine = renderHeightDefineLine();

    groupRef.current?.clear();
    groupRef.current?.add(
      bottomFace,
      bottomLeftFace,
      bottomRightFace,
      belowFrontFace,
      upperFrontFace,
      upperFace,
      lengthDefineLine,
      widthDefineLine,
      heightDefineLine
    );
  }, [length, width, height]);

  const renderBottomFace = () => {
    const boxFaceController = new BoxFace(length, width);
    return boxFaceController.createBoxDielineFace(
      lineColor,
      -length / 2,
      -width / 2,
      0,
      1
    );
  };

  const renderBottomLeftFace = () => {
    const boxFaceController = new BoxFace(height, width);
    return boxFaceController.createBoxDielineFace(
      lineColor,
      -length / 2 - height,
      -width / 2,
      0,
      1
    );
  };

  const renderBottomRightFace = () => {
    const boxFaceController = new BoxFace(height, width);
    return boxFaceController.createBoxDielineFace(
      lineColor,
      length / 2,
      -width / 2,
      0,
      1
    );
  };

  const renderBelowFrontFace = () => {
    const boxFaceController = new BoxFace(length, height);
    return boxFaceController.createBoxDielineFace(
      lineColor,
      -length / 2,
      width / 2,
      0,
      1
    );
  };
  const renderUpperFrontFace = () => {
    const boxFaceController = new BoxFace(length, height);
    return boxFaceController.createBoxDielineFace(
      lineColor,
      -length / 2,
      -width / 2 - height,
      0,
      1
    );
  };

  const renderUpperFace = () => {
    const boxFaceController = new BoxFace(length, width);
    return boxFaceController.createBoxDielineFace(
      lineColor,
      -length / 2,
      width / 2 + height,
      0,
      1
    );
  };

  const renderLengthDefineLine = () => {
    const boxFaceController = new BoxFace(length, width);
    return boxFaceController.createLengthDefineLine(
      0xfa11f2,
      -length / 2,
      -width / 4,
      0
    );
  };

  const renderWidthDefineLine = () => {
    const boxFaceController = new BoxFace(length, width);
    return boxFaceController.createWidthDefineLine(
      0xfa11f2,
      -length / 3,
      -width / 2,
      0
    );
  };

  const renderHeightDefineLine = () => {
    const boxFaceController = new BoxFace(length, height);
    return boxFaceController.createHeightDefineLine(
      0xfa11f2,
      -length / 3,
      width / 2,
      0
    );
  };

  return <group ref={groupRef}></group>;
};

export const BoxDielineWrapper = ({ length, width, height }) => {
  const canvasRef = useRef();
  const sceneRef = useRef();
  const cameraRef = useRef();
  return (
    <Canvas ref={canvasRef} shadows flat linear>
      <Suspense fallback={null}>
        <scene ref={sceneRef} />
        <PerspectiveCamera
          ref={cameraRef}
          position={[0, 0, 0]}
          fov={45}
          near={10}
          far={1000}
        />
        <OrthographicCamera zoom={1} />
        <ambientLight intensity={1} />
        <BoxDieline {...{ width, length, height }} lineColor={0xfe5959} />
      </Suspense>
    </Canvas>
  );
};
