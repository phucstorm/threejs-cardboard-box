import { useEffect, useState } from "react";
import { BoxDielineWrapper } from "./BoxDieline";
import Scene from "./Scene";

const Box3D = (props) => {
  const { length, width, height, thickness } = props;

  useEffect(() => {
    const scene = new Scene(length, width, height, thickness);
    scene.init();
  }, [props]);

  return (
    <div
      className="box-3d-container"
      style={{ height: "100vh", width: "100%" }}
    >
      <canvas id="box3D"></canvas>
    </div>
  );
};

export default function App() {
  const initialValues = {
    length: 30,
    width: 20,
    height: 6,
    thickness: 0.2
  };
  const [values, setValues] = useState(initialValues);
  const [is3dMode, setIs3dMode] = useState(true);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: Number(value),
    });
  };

  return (
    <div style={{ width: "100vw", height: "100vh", display: "flex" }}>
      {is3dMode ? <Box3D {...values} /> : <BoxDielineWrapper {...values} />}
      <div style={{ width: 300 }}>
        <div className="setting-dimension">
          <div>
            <label htmlFor={"length"}>Length</label>
            <input
              type="number"
              value={values.length}
              onChange={handleInputChange}
              name="length"
            />
          </div>
          <div>
            <label htmlFor={"width"}>Width</label>
            <input
              type="number"
              value={values.width}
              onChange={handleInputChange}
              name="width"
            />
          </div>
          <div>
            <label htmlFor={"height"}>Height</label>
            <input
              type="number"
              value={values.height}
              onChange={handleInputChange}
              name="height"
            />
          </div>
          <div>
            <label htmlFor={"thickness"}>Thickness</label>
            <input
              type="number"
              value={values.thickness}
              step={0.2}
              onChange={handleInputChange}
              name="thickness"
            />
          </div>
        </div>
        <div className="show-dieline">
          <button id="dieline" onClick={() => setIs3dMode(!is3dMode)}>
            show/hide dieline
          </button>
        </div>
        <div className="aciton-animation">
          <button id="run-animation">preview animation</button>
        </div>
        <div className="aciton-preview-mockup">
          <button id="preview-mockup">preview mockup</button>
        </div>
        <div className="aciton-export">
          <select id="export-canvas">
            <option value="png">png</option>
            <option value="svg">svg</option>
          </select>

          <button id="download">download</button>
        </div>
      </div>
    </div>
  );
}
