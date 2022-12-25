import * as THREE from "three";
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
    this.thickness = thickness || 1;
    this.waveShape = 5;
    this.container = document.querySelector("#storm-canvas-container");
    this.boxElement = document.querySelector("#storm-canvas");
    this.renderer, this.orbit, this.rayCaster, this.mouse, this.camera, this.lightHolder;

    this.box = {
      els: {
        group: new THREE.Group(),
        faceA0: {
          layer: new THREE.Group(),
          layerTop: new THREE.Mesh(),
          layerMid: new THREE.Mesh(),
          layerBottom: new THREE.Mesh(),
        },
        faceA1: {
          layer: new THREE.Group(),
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
    const downloadBtn = document.querySelector("#download");
    const previewBtn = document.querySelector("#preview-mockup");

    runAnimationButton.addEventListener("click", this.runAnimation.bind(this));
    downloadBtn.addEventListener("click", this.exportToFormat.bind(this));
    previewBtn.addEventListener("click", this.previewMockup.bind(this));
    window.addEventListener("resize", this.updateSceneSize.bind(this));
    this.render();
  }

  initScene() {
    // defined for create box element
    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      canvas: this.boxElement,
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      45,
      this.container.clientWidth / this.container.clientHeight,
      10,
      1000
    );
    this.camera.position.set(40, 90, 110);
    this.rayCaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2(0, 0);

    this.updateSceneSize();

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

    const sceneColor = "black"
    this.renderer.setClearColor(sceneColor);
    this.renderer.gammaOutput = true;

    const gridAxisXHelper = new THREE.GridHelper(100, 100);
    gridAxisXHelper.position.y = 0;
    this.scene.add(gridAxisXHelper);

    const gridAxisYHelper = new THREE.GridHelper(100, 100);
    gridAxisYHelper.rotation.x = Math.PI / 2;
    gridAxisYHelper.rotation.z = Math.PI / 2;
    this.scene.add(gridAxisYHelper);

    const axesHelper = new THREE.AxesHelper(50);
    axesHelper.position.y = 0;
    this.scene.add(axesHelper);
  }

  createObject() {
    const faceA1 = "faceA1";
    const faceA2 = "faceA2";
    const faceB1 = "faceB1";
    const faceB2 = "faceB2";
    const faceB3 = "faceB3";
    const faceB4 = "faceB4";
    const layerLength = this.length;
    const layerWidth = this.width;
    const layerHeight = this.height;
    const spacing = 0.5;

    for (let halfIdx = 0; halfIdx < 2; halfIdx++) {
      for (let sideIdx = 0; sideIdx < 2; sideIdx++) {
        const faceAPlaneGeometry = new THREE.PlaneGeometry(
          this.length,
          this.width,
          Math.floor(5 * this.length),
          Math.floor(0.2 * this.width)
        );

        // const faceBPlaneGeometry = new THREE.PlaneGeometry(
        //   layerHeight,
        //   layerWidth,
        //   Math.floor(5 * layerHeight),
        //   Math.floor(0.2 * layerWidth)
        // );

        // const faceBUpAndDownPlaneGeometry = new THREE.PlaneGeometry(
        //   layerLength,
        //   layerHeight,
        //   Math.floor(5 * layerLength),
        //   Math.floor(0.2 * layerHeight)
        // );

        const texture = new THREE.TextureLoader().load('https://images.pexels.com/photos/358482/pexels-photo-358482.jpeg?auto=compress&cs=tinysrgb');
        const customMaterial = new THREE.MeshBasicMaterial({map: texture, side: THREE.DoubleSide});
        const defaultMaterial = new THREE.MeshStandardMaterial({
          color: new THREE.Color(0xba7b13),
          side: THREE.DoubleSide,
        });

        this.box.els[faceA1].layerTop.geometry = this.createLayerTopGeometry(faceAPlaneGeometry);
        this.box.els[faceA1].layerMid.geometry = this.createLayerMidGeometry(faceAPlaneGeometry);
        this.box.els[faceA1].layerBottom.geometry = this.createLayerBottomGeometry(faceAPlaneGeometry);
        this.box.els[faceA1].layerBottom.material = customMaterial;
        this.box.els[faceA1].layerMid.material = defaultMaterial;
        this.box.els[faceA1].layerTop.material = defaultMaterial;

        // this.box.els[faceA1].layer.rotation.x = MathUtils.degToRad(-90)

      
        // const faceAGeometry = this.createLayerGeometry(faceAPlaneGeometry);
        // const faceBGeometry = this.createLayerGeometry(faceBPlaneGeometry);
        // const faceBUpAndDownGeometry = this.createLayerGeometry(
        //   faceBUpAndDownPlaneGeometry
        // );

        // this.box.els[faceA1].layerTop.geometry = faceAGeometry;
        // this.box.els[faceA1].layerMid.geometry = faceAGeometry;
        // this.box.els[faceA1].layerBottom.geometry = faceAGeometry;

        // this.box.els[faceA2].layerMid.geometry = faceAGeometry;
        // this.box.els[faceB1].layerMid.geometry = faceBGeometry;
        // this.box.els[faceB3].layerMid.geometry = faceBGeometry;
        // this.box.els[faceB2].layerMid.geometry = faceBUpAndDownGeometry;
        // this.box.els[faceB4].layerMid.geometry = faceBUpAndDownGeometry;

        // this.box.els[faceA2].layerMid.position.y =
        //   layerWidth + layerHeight + 0.5 * 2;

        // this.box.els[faceB1].layerMid.position.x =
        //   0.5 * layerLength + layerHeight * 0.5 + spacing;
        // this.box.els[faceB3].layerMid.position.x =
        //   -0.5 * layerLength + layerHeight * -0.5 - spacing;

        // this.box.els[faceB2].layerMid.position.y =
        //   0.5 * layerWidth + layerHeight * 0.5 + spacing;
        // this.box.els[faceB4].layerMid.position.y =
        //   -0.5 * layerWidth + layerHeight * -0.5 - spacing;
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
    this.orbit = new OrbitControls(this.camera, this.boxElement);
    this.orbit.enableZoom = true;
    this.orbit.enablePan = true;
  }

  updateSceneSize() {
    // defined for responsive
    this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
  }

  createLayerTopGeometry(baseGeometry) {
    const geometriesToMerge = [];
    geometriesToMerge.push(
      this.getLayerGeometry(baseGeometry,
        (v) =>
        0.5 * this.thickness +
        0.01 * Math.sin(this.waveShape * v)
      )
    ); 
    const mergedGeometry = new BufferGeometryUtils.mergeBufferGeometries(
      geometriesToMerge,
      false
    );
    mergedGeometry.computeVertexNormals();
    return mergedGeometry;
  }

  createLayerBottomGeometry(baseGeometry) {
    const geometriesToMerge = [];
    geometriesToMerge.push(
      this.getLayerGeometry(baseGeometry,
        (v) =>
          -0.5 * this.thickness +
          0.01 * Math.sin(this.waveShape * v)
      )
    ); 
    const mergedGeometry = new BufferGeometryUtils.mergeBufferGeometries(
      geometriesToMerge,
      false
    );
    mergedGeometry.computeVertexNormals();
    return mergedGeometry;
  }

  createLayerMidGeometry(baseGeometry) {
    const geometriesToMerge = [];
    geometriesToMerge.push(
      this.getLayerGeometry(baseGeometry,
        (v) =>
        0.5 *
        this.thickness *
        Math.sin(this.waveShape * v)
      )
    ); 
    const mergedGeometry = new BufferGeometryUtils.mergeBufferGeometries(
      geometriesToMerge,
      false
    );
    mergedGeometry.computeVertexNormals();
    return mergedGeometry;
  }

  getLayerGeometry(baseGeometry, offset) {
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

  setGeometryHierarchy() {
    this.box.els.group.add(
      this.box.els.faceA1.layer,
      // this.box.els.faceA2.layer,
      // this.box.els.faceB1.layer,
      // this.box.els.faceB2.layer,
      // this.box.els.faceB3.layer,
      // this.box.els.faceB4.layer
    );
    this.box.els.faceA1.layer.add(
      this.box.els.faceA1.layerTop,
      this.box.els.faceA1.layerMid,
      this.box.els.faceA1.layerBottom,
    );
    // this.box.els.faceA1.layerMid.add(
    //   this.box.els.faceA1.layerTop,
    //   this.box.els.faceA1.layerBottom
    // );
    // this.box.els.faceA2.layerMid.add(
    //   this.box.els.faceA2.layerTop,
    //   this.box.els.faceA2.layerBottom
    // );
    // this.box.els.faceB1.layerMid.add(
    //   this.box.els.faceB1.layerTop,
    //   this.box.els.faceB1.layerBottom
    // );
    // this.box.els.faceB2.layerMid.add(
    //   this.box.els.faceB2.layerTop,
    //   this.box.els.faceB2.layerBottom
    // );
    // this.box.els.faceB3.layerMid.add(
    //   this.box.els.faceB3.layerTop,
    //   this.box.els.faceB3.layerBottom
    // );
    // this.box.els.faceB4.layerMid.add(
    //   this.box.els.faceB4.layerTop,
    //   this.box.els.faceB4.layerBottom
    // );

    // this.box.els.faceA1.layerMid.name = "faceA1-layerMid";
    // this.box.els.faceA1.layerTop.name = "faceA1-layerTop";
    // this.box.els.faceA1.layerBottom.name = "faceA1-layerBottom";

    // this.box.els.faceA2.layerMid.name = "faceA2";
    // this.box.els.faceB1.layerMid.name = "faceB1";
    // this.box.els.faceB2.layerMid.name = "faceB2";
    // this.box.els.faceB3.layerMid.name = "faceB3";
    // this.box.els.faceB4.layerMid.name = "faceB4";
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
    const selectBox = document.getElementById("export-canvas");
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
  }

  previewMockup() {
    // this.orbit.enabled = false
    const layerLength = this.length;
    const layerWidth = this.width;
    const layerHeight = this.height;

    this.scene.rotation.x = MathUtils.degToRad(-105);
    this.scene.rotation.y = MathUtils.degToRad(0);
    this.scene.rotation.z = MathUtils.degToRad(-20);

    this.scene.remove(this.scene.getObjectByName("Light"));
    this.lightHolder = new THREE.Group();
    const topLight = new THREE.PointLight(0xffffff, 0.7);
    const sideLight = new THREE.PointLight(0xffffff, 0.7);
    topLight.position.set(0, -50, 0);
    sideLight.position.set(0, 50, 0);
    this.lightHolder.add(topLight);
    this.lightHolder.add(sideLight);
    this.lightHolder.name = "Light";
    this.scene.add(this.lightHolder);

    const sphereSize = 1;
    const pointLightTopHelper = new THREE.PointLightHelper(
      topLight,
      sphereSize,
      "red"
    );
    const pointLightSideHelper = new THREE.PointLightHelper(
      sideLight,
      sphereSize,
      "blue"
    );
    this.scene.add(pointLightTopHelper);
    this.scene.add(pointLightSideHelper);

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
    const fake_spacing = 3;
    this.box.els.faceA2.layerMid.position.z = layerHeight + fake;
    this.box.els.faceA2.layerMid.position.y = Math.cos(45) * ( layerLength * 0.5 );
    this.box.els.faceA2.layerMid.rotation.x = MathUtils.degToRad(-45);
  }
}
