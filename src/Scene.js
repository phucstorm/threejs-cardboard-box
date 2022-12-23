import * as THREE from "three";
import GUI from "lil-gui";
import gsap from "gsap";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { SVGRenderer } from "three/examples/jsm/renderers/SVGRenderer.js";
import { MathUtils } from "three";

export default class Scene {
  constructor(length, width, height, thickness) {
    this.length = length;
    this.width = width;
    this.height = height;
    this.thickness = thickness;
    this.renderer;
    this.orbit;
    this.rayCaster;
    this.mouse;
    this.camera;
    this.lightHolder;

    this.box = {
      params: {
        length: this.length,
        width: this.width,
        height: this.height,
        thickness: this.thickness,
        waveShape: 5
      },
      els: {
        group: new THREE.Group(),
        faceA1: {
          layerTop: new THREE.Mesh(),
          layerMid: new THREE.Mesh(),
          layerBottom: new THREE.Mesh(),
        },
        faceA2: {
          layerTop: new THREE.Mesh(),
          layerMid: new THREE.Mesh(),
          layerBottom: new THREE.Mesh(),
        },
        faceB1: {
          layerTop: new THREE.Mesh(),
          layerMid: new THREE.Mesh(),
          layerBottom: new THREE.Mesh(),
        },
        faceB2: {
          layerTop: new THREE.Mesh(),
          layerMid: new THREE.Mesh(),
          layerBottom: new THREE.Mesh(),
        },
        faceB3: {
          layerTop: new THREE.Mesh(),
          layerMid: new THREE.Mesh(),
          layerBottom: new THREE.Mesh(),
        },
        faceB4: {
          layerTop: new THREE.Mesh(),
          layerMid: new THREE.Mesh(),
          layerBottom: new THREE.Mesh(),
        },
      },
    };
  }

  init() {
    this.initScene();
    this.createObject();
    this.createZooming();

    const runAnimationButton = document.querySelector("#run-animation");
    runAnimationButton.addEventListener("click", this.runAnimation.bind(this));
    this.exportToFormat();

    window.addEventListener("resize", this.updateSceneSize.bind(this));

    const previewBtn = document.querySelector("#preview-mockup");
    previewBtn.addEventListener("click", this.previewMockup.bind(this));

    this.render();
  }

  initScene() {
    // defined for create box element
    const container = document.querySelector(".box-3d-container");
    const boxElement = document.querySelector("#box3D");
    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      canvas: boxElement,
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      10,
      1000
    );
    this.camera.position.set(40, 90, 110);
    this.rayCaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2(0, 0);

    this.updateSceneSize();

    this.scene.add(this.box.els.group);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);
    this.lightHolder = new THREE.Group();
    const topLight = new THREE.PointLight(0xffffff, 0.5);
    topLight.position.set(-30, 300, 0);
    this.lightHolder.add(topLight);
    const sideLight = new THREE.PointLight(0xffffff, 0.7);
    sideLight.position.set(50, 0, 150);
    this.lightHolder.add(sideLight);
    this.lightHolder.name = "Light";
    this.scene.add(this.lightHolder);

    this.scene.add(this.box.els.group);
    this.setGeometryHierarchy();

    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0xba7b13),
      side: THREE.DoubleSide,
    });
    this.box.els.group.traverse((c) => {
      if (c.isMesh) c.material = material;
    });
  }

  createObject() {
    const faceA1 = "faceA1";
    const faceA2 = "faceA2";
    const faceB1 = "faceB1";
    const faceB2 = "faceB2";
    const faceB3 = "faceB3";
    const faceB4 = "faceB4";
    const layerLength = this.box.params.length;
    const layerWidth = this.box.params.width;
    const layerHeight = this.box.params.height;
    const spacing = 0.5

    for (let halfIdx = 0; halfIdx < 2; halfIdx++) {
      for (let sideIdx = 0; sideIdx < 2; sideIdx++) {

        const faceAPlaneGeometry = new THREE.PlaneGeometry(
          layerLength,
          layerWidth,
          Math.floor(5 * layerLength),
          Math.floor(0.2 * layerWidth)
        );

        const faceBPlaneGeometry = new THREE.PlaneGeometry(
          layerHeight,
          layerWidth,
          Math.floor(5 * layerHeight),
          Math.floor(0.2 * layerWidth)
        );

        const faceBUpAndDownPlaneGeometry = new THREE.PlaneGeometry(
          layerLength,
          layerHeight,
          Math.floor(5 * layerLength),
          Math.floor(0.2 * layerHeight)
        );

        const faceAGeometry = this.createLayerGeometry(faceAPlaneGeometry);
        const faceBGeometry = this.createLayerGeometry(faceBPlaneGeometry);
        const faceBUpAndDownGeometry = this.createLayerGeometry(
          faceBUpAndDownPlaneGeometry
        );

        this.box.els[faceA1].layerMid.geometry = faceAGeometry;
        this.box.els[faceA2].layerMid.geometry = faceAGeometry;
        this.box.els[faceB1].layerMid.geometry = faceBGeometry;
        this.box.els[faceB3].layerMid.geometry = faceBGeometry;
        this.box.els[faceB2].layerMid.geometry = faceBUpAndDownGeometry;
        this.box.els[faceB4].layerMid.geometry = faceBUpAndDownGeometry;

        this.box.els[faceA2].layerMid.position.y = layerWidth + layerHeight + 0.5 * 2

        this.box.els[faceB1].layerMid.position.x = 0.5 * layerLength + layerHeight * 0.5 + spacing;
        this.box.els[faceB3].layerMid.position.x = -0.5 * layerLength + layerHeight * -0.5 - spacing;

        this.box.els[faceB2].layerMid.position.y = 0.5 * layerWidth + layerHeight * 0.5 + spacing;
        this.box.els[faceB4].layerMid.position.y = -0.5 * layerWidth + layerHeight * -0.5 - spacing;
      }
    }
  }

  render() {
    this.orbit.update();
    this.lightHolder.quaternion.copy(this.camera.quaternion);
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.render.bind(this));
  }

  createZooming() {
    const boxElement = document.querySelector("#box3D");
    this.orbit = new OrbitControls(this.camera, boxElement);
    this.orbit.enableZoom = true;
    this.orbit.enablePan = true;
  }

  updateSceneSize() {
    // defined for responsive
    const container = document.querySelector(".box-3d-container");
    this.camera.aspect = container.clientWidth / container.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(container.clientWidth, container.clientHeight);
  }

  createLayerGeometry(baseGeometry) {
    const geometriesToMerge = [];
    geometriesToMerge.push(
      getLayerGeometry(
        (v) =>
          -0.5 * this.box.params.thickness +
          0.01 * Math.sin(this.box.params.waveShape * v)
      )
    );
    geometriesToMerge.push(
      getLayerGeometry(
        (v) =>
          0.5 * this.box.params.thickness +
          0.01 * Math.sin(this.box.params.waveShape * v)
      )
    );
    geometriesToMerge.push(
      getLayerGeometry(
        (v) =>
          0.5 *
          this.box.params.thickness *
          Math.sin(this.box.params.waveShape * v)
      )
    );

    function getLayerGeometry(offset) {
      const layerGeometry = baseGeometry.clone();
      const positionAttr = layerGeometry.attributes.position;
      for (let i = 0; i < positionAttr.count; i++) {
        const x = positionAttr.getX(i);
        const y = positionAttr.getY(i);
        let z = positionAttr.getZ(i) + offset(x);
        positionAttr.setXYZ(i, x, y, z);
      }
      return layerGeometry;
    }
    const mergedGeometry = new BufferGeometryUtils.mergeBufferGeometries(
      geometriesToMerge,
      false
    );
    mergedGeometry.computeVertexNormals();
    return mergedGeometry;
  }

  setGeometryHierarchy() {
    this.box.els.group.add(
      this.box.els.faceA1.layerMid,
      this.box.els.faceA2.layerMid,
      this.box.els.faceB1.layerMid,
      this.box.els.faceB2.layerMid,
      this.box.els.faceB3.layerMid,
      this.box.els.faceB4.layerMid
    );
    this.box.els.faceA1.layerMid.add(
      this.box.els.faceA1.layerTop,
      this.box.els.faceA1.layerBottom
    );
    this.box.els.faceA2.layerMid.add(
      this.box.els.faceA2.layerTop,
      this.box.els.faceA2.layerBottom
    );
    this.box.els.faceB1.layerMid.add(
      this.box.els.faceB1.layerTop,
      this.box.els.faceB1.layerBottom
    );
    this.box.els.faceB2.layerMid.add(
      this.box.els.faceB2.layerTop,
      this.box.els.faceB2.layerBottom
    );
    this.box.els.faceB3.layerMid.add(
      this.box.els.faceB3.layerTop,
      this.box.els.faceB3.layerBottom
    );
    this.box.els.faceB4.layerMid.add(
      this.box.els.faceB4.layerTop,
      this.box.els.faceB4.layerBottom
    );

    this.box.els.faceA1.layerMid.name = "faceA1-layerMid";
    this.box.els.faceA1.layerTop.name = "faceA1-layerTop";
    this.box.els.faceA1.layerBottom.name = "faceA1-layerBottom";

    this.box.els.faceA2.layerMid.name = "faceA2";
    this.box.els.faceB1.layerMid.name = "faceB1";
    this.box.els.faceB2.layerMid.name = "faceB2";
    this.box.els.faceB3.layerMid.name = "faceB3";
    this.box.els.faceB4.layerMid.name = "faceB4";
  }

  runAnimation() {
    gsap
      .timeline()
      .to(this.box.els.faceB3.layerMid.rotation, {
        duration: 2,
        y: MathUtils.degToRad(90),
      })
      .to(this.box.els.faceB3.layerMid.position, {
        duration: 2,
        z: 2.1,
      });
  }

  exportToFormat() {
    const downloadBtn = document.querySelector("#download");
    const selectBox = document.getElementById("export-canvas");
    downloadBtn.addEventListener("click", () => {
      if (selectBox.value === "svg") {
        var rendererSVG = new SVGRenderer();
        rendererSVG.setSize(window.innerWidth, window.innerHeight);
        rendererSVG.render(this.scene, this.camera);
        var XMLS = new XMLSerializer();
        var svgfile = XMLS.serializeToString(rendererSVG.domElement);
        var svgData = svgfile;
        var preface = '<?xml version="1.0" standalone="no"?>\r\n';
        var svgBlob = new Blob([preface, svgData], {
          type: "image/svg+xml;charset=utf-8",
        });
        var svgUrl = URL.createObjectURL(svgBlob);
        var link = document.createElement("a");
        link.href = svgUrl;
        link.download = "test.svg";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        this.renderer.render(this.scene, this.camera);
        var link = document.createElement("a");
        link.href = this.renderer.domElement.toDataURL();
        link.download = "test.png";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    });
  }

  previewMockup() {
    // this.orbit.enabled = false

    const layerLength = this.box.params.length;
    const layerWidth = this.box.params.width;
    const layerHeight = this.box.params.height;

    this.scene.rotation.x = MathUtils.degToRad(-105);
    this.scene.rotation.y = MathUtils.degToRad(0);
    this.scene.rotation.z = MathUtils.degToRad(-20);

    this.scene.remove(this.scene.getObjectByName("Light"));
    this.lightHolder = new THREE.Group();
    const topLight = new THREE.PointLight(0xffffff, 0.5);
    topLight.position.set(0, -50, 0);
    this.lightHolder.add(topLight);
    this.lightHolder.name = "Light";
    this.scene.add(this.lightHolder);

    const sphereSize = 1;
    const pointLightTopHelper = new THREE.PointLightHelper(
      topLight,
      sphereSize,
      "red"
    );
    // this.scene.add(pointLightTopHelper);

    this.box.els.faceB1.layerMid.rotation.y = MathUtils.degToRad(90);
    this.box.els.faceB3.layerMid.rotation.y = MathUtils.degToRad(90);

    this.box.els.faceB2.layerMid.rotation.x = MathUtils.degToRad(90);
    this.box.els.faceB4.layerMid.rotation.x = MathUtils.degToRad(90);

    this.box.els.faceB1.layerMid.position.x = 0.5 * layerLength;
    this.box.els.faceB1.layerMid.position.z = layerHeight / 2;

    this.box.els.faceB3.layerMid.position.x = -0.5 * layerLength;
    this.box.els.faceB3.layerMid.position.z = layerHeight / 2;

    this.box.els.faceB2.layerMid.position.y = 0.5 * layerWidth;
    this.box.els.faceB2.layerMid.position.z = layerHeight / 2;

    this.box.els.faceB4.layerMid.position.y = -0.5 * layerWidth;
    this.box.els.faceB4.layerMid.position.z = layerHeight / 2;
      const fake = 6.8;
      const fake_spacing = 3; //3
    this.box.els.faceA2.layerMid.position.z = layerHeight + fake
    this.box.els.faceA2.layerMid.position.y = fake_spacing;
    this.box.els.faceA2.layerMid.rotation.x = MathUtils.degToRad(-45);
  }
}
