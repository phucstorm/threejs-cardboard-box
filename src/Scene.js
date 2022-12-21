import * as THREE from "three";
import GUI from "lil-gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils.js";

export default class Scene {
  constructor(width, height) {
    this.height = height;
    this.width = width;

    this.renderer;
    this.orbit;
    this.rayCaster;
    this.mouse;
    this.camera;
    this.lightHolder;

    this.box = {
      params: {
        width: this.width,
        widthLimits: [15, 70],
        depth: this.height,
        depthLimits: [15, 70],
        thickness: 1,
        flute: 5,
        fluteLimits: [1, 10]
      },
      els: {
        group: new THREE.Group(),
        frontHalf: {
          width: {
            top: new THREE.Mesh(),
            side: new THREE.Mesh(),
            bottom: new THREE.Mesh(),
          }
        },
      },
      animated: {
        openingAngle: 0.02 * Math.PI,
      },
    };
  }

  init() {
    this.initScene();
    this.createObject();
    this.createControls();
    this.createZooming();
    window.addEventListener("resize", this.updateSceneSize.bind(this));
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
    for (let halfIdx = 0; halfIdx < 2; halfIdx++) {
      for (let sideIdx = 0; sideIdx < 2; sideIdx++) {
        const half = "frontHalf";
        const side = "width";
        const sideWidth = this.box.params.width;

        const sidePlaneGeometry = new THREE.PlaneGeometry(
          sideWidth,
          this.box.params.depth,
          Math.floor(5 * sideWidth),
          Math.floor(0.2 * this.box.params.depth)
        );

        const sideGeometry = this.createSideGeometry(
          sidePlaneGeometry,
          [sideWidth, this.box.params.depth],
          [true, true, true, true],
          false
        );
        
        this.box.els[half][side].side.geometry = sideGeometry;
      }
    }
  }

  render() {
    this.orbit.update();
    this.lightHolder.quaternion.copy(this.camera.quaternion);
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.render.bind(this));
  }

  createControls() {
    const gui = new GUI();
    gui
      .add(
        this.box.params,
        "width",
        this.box.params.widthLimits[0],
        this.box.params.widthLimits[1]
      )
      .step(1)
      .onChange(() => {
        this.createObject();
      });
    gui
      .add(
        this.box.params,
        "depth",
        this.box.params.depthLimits[0],
        this.box.params.depthLimits[1]
      )
      .step(1)
      .onChange(() => {
        this.createObject();
      });
  }

  createZooming() {
    const boxElement = document.querySelector("#box3D");
    this.orbit = new OrbitControls(this.camera, boxElement);
    this.orbit.enableZoom = true;
  }

  updateSceneSize() {
    // defined for responsive
    const container = document.querySelector(".box-3d-container");
    this.camera.aspect = container.clientWidth / container.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(container.clientWidth, container.clientHeight);
  }

  createSideGeometry(baseGeometry) {
    console.log("baseGeometry", baseGeometry)
    const geometriesToMerge = [];
    geometriesToMerge.push(
      getLayerGeometry((v) => -0.5 * this.box.params.thickness + 0.01 * v)
    );
    geometriesToMerge.push(
      getLayerGeometry((v) => 0.5 * this.box.params.thickness + 0.01 * v)
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
    console.log('mergedGeometry ', mergedGeometry)
    return mergedGeometry;
  }

  setGeometryHierarchy() {
    this.box.els.group.add(
      this.box.els.frontHalf.width.side
    );
  }
}
