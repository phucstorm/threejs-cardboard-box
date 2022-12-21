import { useEffect } from "react";
import Scene from "./Scene";

const Box3D = (props) => {
  const { width, height } = props;

  useEffect(() => {
    const scene = new Scene(width, height);
    scene.init();
  }, []);

  return (
    <div className="box-3d-container" style={{ height: '100%'}}>
      <canvas id="box3D"></canvas>
    </div>
  );
};

export default function Test() {
  const width = 30;
  const height = 50;
  const props = { width, height };
  return (
    <div style={{ width: "100vw", height: '100vh'}}>
      <Box3D {...props} />
    </div>
  );
}
