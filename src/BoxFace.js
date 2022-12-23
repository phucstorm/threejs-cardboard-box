import * as THREE from "three";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import { FontLoader } from "three/addons/loaders/FontLoader.js";

export default class BoxFace {
  constructor(width, height, thickness, name) {
    this.width = width;
    this.height = height;
    this.thickness = thickness;
    this.name = name || "";
  }

  createLengthDefineLine(color, x, y, z) {
    const width = this.width;
    const lengthDefineLine = new THREE.Group();
    const lineShape = new THREE.Shape().moveTo(0, 0).lineTo(this.width, 0);

    const points = lineShape.getPoints();
    const geometryPoints = new THREE.BufferGeometry().setFromPoints(points);

    let line = new THREE.Line(
      geometryPoints,
      new THREE.LineBasicMaterial({ color: color })
    );
    line.position.set(x, y, z - 25);

    lengthDefineLine.add(line);

    const fontLoader = new FontLoader();

    fontLoader.load(
      "/src/assets/fonts/helvetiker_regular.typeface.json",
      function (font) {
        const geometry = new TextGeometry(`L : ${width} mm`, {
          font: font,
          size: 12,
          height: 5,
          curveSegments: 10,
          bevelEnabled: false,
        });
        const material = new THREE.LineBasicMaterial({ color: color });
        const textMesh = new THREE.Mesh(geometry, material);

        textMesh.position.set(x + width / 3, y + 10, z - 25);

        lengthDefineLine.add(textMesh);
      }
    );

    return lengthDefineLine;
  }

  createWidthDefineLine(color, x, y, z) {
    const height = this.height;
    const width = this.width;

    const lengthDefineLine = new THREE.Group();
    const lineShape = new THREE.Shape().moveTo(0, 0).lineTo(0, this.height);

    const points = lineShape.getPoints();
    const geometryPoints = new THREE.BufferGeometry().setFromPoints(points);

    let line = new THREE.Line(
      geometryPoints,
      new THREE.LineBasicMaterial({ color: color })
    );
    line.position.set(x + width / 1.5, y, z - 25);

    lengthDefineLine.add(line);

    const fontLoader = new FontLoader();

    fontLoader.load(
      "/src/assets/fonts/helvetiker_regular.typeface.json",
      function (font) {
        const geometry = new TextGeometry(`W : ${height} mm`, {
          font: font,
          size: 12,
          height: 5,
          curveSegments: 10,
          bevelEnabled: false,
        });
        const material = new THREE.LineBasicMaterial({ color: color });
        const textMesh = new THREE.Mesh(geometry, material);

        textMesh.position.set(x + width / 1.6, y + height / 2, z - 25);

        lengthDefineLine.add(textMesh);
      }
    );

    return lengthDefineLine;
  }

  createHeightDefineLine(color, x, y, z) {
    const height = this.height;
    const width = this.width;

    const lengthDefineLine = new THREE.Group();
    const lineShape = new THREE.Shape().moveTo(0, 0).lineTo(0, this.height);

    const points = lineShape.getPoints();
    const geometryPoints = new THREE.BufferGeometry().setFromPoints(points);

    let line = new THREE.Line(
      geometryPoints,
      new THREE.LineBasicMaterial({ color: color })
    );
    line.position.set(x + width / 2, y, z - 25);

    lengthDefineLine.add(line);

    const fontLoader = new FontLoader();

    fontLoader.load(
      "/src/assets/fonts/helvetiker_regular.typeface.json",
      function (font) {
        const geometry = new TextGeometry(`H : ${height} mm`, {
          font: font,
          size: 12,
          height: 5,
          curveSegments: 10,
          bevelEnabled: false,
        });
        const material = new THREE.LineBasicMaterial({ color: color });
        const textMesh = new THREE.Mesh(geometry, material);

        textMesh.position.set(x + width / 2.5, y + height / 2, z - 25);

        lengthDefineLine.add(textMesh);
      }
    );

    return lengthDefineLine;
  }

  createBoxDielineFace(color, x, y, z, s) {
    const squareShape = new THREE.Shape()
      .moveTo(0, 0)
      .lineTo(0, this.height)
      .lineTo(this.width, this.height)
      .lineTo(this.width, 0);
    squareShape.autoClose = true;

    const points = squareShape.getPoints();

    const geometryPoints = new THREE.BufferGeometry().setFromPoints(points);
    let line = new THREE.Line(
      geometryPoints,
      new THREE.LineBasicMaterial({ color: color })
    );
    line.position.set(x, y, z - 25);
    line.scale.set(s, s, s);

    return line;
  }
}