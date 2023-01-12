import { World, Screencast } from "../../../babylon/js/vrspace-min.js";

export class Classroom extends World {
  constructor() {
    super();
    this.file = null;
    this.worldObjects = {
      "circular_gallery_vr.glb": {
        instances: [
          {
            scale: { x: 1, y: 1, z: 1 },
            rotation: { x: 0, y: 0, z: 0 },
            position: { x: 0, y: 0, z: 0 },
          },
        ],
      },
      "city/scene.gltf": {
        instances: [
          {
            scale: { x: 0, y: 0, z: 0 },
            position: { x: 100, y: 68.7, z: -350 },
            rotation: { x: 0, y: 5.69, z: 0 },
          },
        ],
      },
    };
  }
  async createCamera() {
    //lecturer view
    //this.camera = this.universalCamera(new BABYLON.Vector3(0, 2, 0));
    //this.camera.setTarget(new BABYLON.Vector3(0,2,10));
    this.camera = this.universalCamera(new BABYLON.Vector3(-6, 2, 16));
    this.camera.setTarget(new BABYLON.Vector3(0, 2, 0));
    this.camera.speed = 0.2;
    // collision debug
    //this.camera.onCollide = (mesh)=>console.log('collided with '+mesh.id);
    return this.camera;
  }
  async createLights() {
    var light = new BABYLON.DirectionalLight(
      "light",
      new BABYLON.Vector3(-1, -1, 0),
      this.scene
    );
    light.intensity = 2;
    var light1 = new BABYLON.HemisphericLight(
      "light1",
      new BABYLON.Vector3(0, 1, 0),
      this.scene
    );
    return light1;
  }
  async createSkyBox() {
    var skybox = BABYLON.Mesh.CreateBox("skyBox", 10000, this.scene);
    var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", this.scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.disableLighting = true;
    skybox.material = skyboxMaterial;
    skybox.infiniteDistance = true;
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture(
      this.assetPath("../../skybox/hw_sahara/sahara"),
      this.scene
    );
    skyboxMaterial.reflectionTexture.coordinatesMode =
      BABYLON.Texture.SKYBOX_MODE;
    console.log(this.scene, "scene");
    return skybox;
  }

  createGround() {
    this.ground = BABYLON.MeshBuilder.CreateDisc(
      "ground",
      { radius: 100 },
      this.scene
    );
    this.ground.rotation = new BABYLON.Vector3(Math.PI / 2, 0, 0);
    this.ground.position = new BABYLON.Vector3(0, -0.05, 0);
    this.ground.parent = this.floorGroup;
    this.ground.isVisible = false;
    this.ground.checkCollisions = true;
    return this.ground;
  }

  createPhysics() {
    this.scene.gravity = new BABYLON.Vector3(0, -0.05, 0);

    // walls mess with collision detection, easy to get stuck
    // so add two invisible planes just for collision detection
    var wall1 = BABYLON.MeshBuilder.CreatePlane(
      "wall1",
      { width: 18, height: 3 },
      this.scene
    );
    wall1.position = new BABYLON.Vector3(7.8, 2, 9);
    wall1.rotation = new BABYLON.Vector3(0, Math.PI / 2, 0);
    wall1.checkCollisions = true;
    wall1.visibility = 0;

    var wall2 = BABYLON.MeshBuilder.CreatePlane(
      "wall2",
      { width: 14, height: 3 },
      this.scene
    );
    wall2.position = new BABYLON.Vector3(-7.8, 2, 9);
    wall2.rotation = new BABYLON.Vector3(0, -Math.PI / 2, 0);
    wall2.checkCollisions = true;
    wall2.visibility = 0;
  }

  isSelectableMesh(mesh) {
    // pPlane5_pantalla_0 - board
    // pCube30_blanco_0 - lecturer desk front
    // pCube78, pCube81 (transform), pCube78_puerta_0, pCube81_puerta_0 - doors
    return (
      this.screencast &&
      this.screencast.screenShareMesh &&
      mesh === this.screencast.screenShareMesh
    );
  }

  setMeshCollisions(mesh, state) {
    // if (
    //   // doors:
    //   mesh.name != 'pCube78_puerta_0' && mesh.name != 'pCube81_puerta_0'
    //   // fila1-fila6 = rows with tables and chairs
    //   // (actual meshes are named like pCubeSomething)
    //   && ! (
    //     mesh.parent &&
    //     mesh.parent.parent &&
    //     mesh.parent.parent.parent &&
    //     mesh.parent.parent.parent.name.startsWith('fila')
    //   )
    // ) {
    //   mesh.checkCollisions = state;
    // }
    // this.scene.materials[27].albedoTexture = new BABYLON.Texture(
    //   "/content/worlds/classroom.jpg"
    // );
    // console.log(this.scene.materials[0], " sceneMeshes");

    // this.scene.meshes.forEach((it, i) => {
    //   if (i >= 0 && i <= 50) {
    //     this.scene.materials[i].albedoColor = new BABYLON.Color3(
    //       0.37,
    //       0.01,
    //       0.95
    //     );
    //   } else if (i >= 51 && i <= 100) {
    //     this.scene.materials[i].albedoColor = new BABYLON.Color3(
    //       0.95,
    //       0.01,
    //       0.01
    //     );
    //   } else {
    //     this.scene.materials[i].albedoColor = new BABYLON.Color3(0, 0, 0);
    //   }

      // if (it?.material)
      //   console.log(`meshs ${i}: `, it.name, it?.material);
    // });
  }

  // executed once the world is loaded
  loaded(file, mesh) {
    this.floorMeshes = [
      this.scene.getMeshByID("pCube36_suelo_text_0"),
      this.scene.getMeshByID("pCube49_suelo_text_0"),
      this.scene.getMeshByID("pCube50_suelo_text_0"),
      this.scene.getMeshByID("pCube51_suelo_text_0"),
      this.ground,
    ];
  }

  // executed once connected to the server and entered the space
  entered(welcome) {
    this.screencast = new Screencast(this, 'teacher');
    this.screencast.screenShareMesh.position = new BABYLON.Vector3(-0.06, 2, -17);
    this.screencast.screenShareMesh.rotation = new BABYLON.Vector3(0, Math.PI, 0);
    this.screencast.videoMesh.position = new BABYLON.Vector3(0, 1.5, -17);
    this.screencast.videoMesh.rotation = new BABYLON.Vector3(0, Math.PI, 0);
    this.screencast.init();
  }
}

export const WORLD = new Classroom();
