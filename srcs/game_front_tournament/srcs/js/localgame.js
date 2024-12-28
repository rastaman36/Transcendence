import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Ball from './Ball.js';
import Paddle from './Paddle.js';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry';

export default class Game {
  constructor() {
    this.initRenderer();
    this.initSceneAndCamera();
    this.initLights();
    this.initControls();
    this.initObjects();
    this.initWebsocket();
    this.addEventListeners();
    this.handleResize();
  }

  initRenderer() {
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    document.body.appendChild(this.renderer.domElement);
  }

  initSceneAndCamera() {
    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.01,
      1000
    );
    this.camera.position.set(16.9, 36, 0);

    this.boundaries = new THREE.Vector2(18, 27);
  }

  initControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
  }

  initLights() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 10, 10);
    this.scene.add(directionalLight);
  }

  initObjects() {
    this.createBackground();
    this.addPlane();
    this.addBoundaries();

    this.playerPaddle = new Paddle(this.scene, this.boundaries, new THREE.Vector3(0, 0, 25));
    this.bootPaddle = new Paddle(this.scene, this.boundaries, new THREE.Vector3(0, 0, -25));
    this.ball = new Ball(this.scene, this.boundaries, [this.playerPaddle, this.bootPaddle]);

    this.player = { x: 0, y: 0, z: 18, dx: 0 };
    this.oplayer = { x: 0, y: 0, z: -18, dx: 0 };
    this.ballPosition = new THREE.Vector3(0, 0, 0);
  }

  createBackground() {
    const cubeTextureLoader = new THREE.CubeTextureLoader();
    cubeTextureLoader.load([
      '../models/cube_right.png',
      '../models/cube_left.png',
      '../models/cube_up.png',
      '../models/cube_down.png',
      '../models/cube_back.png',
      '../models/cube_front.png'
    ], (cubeTexture) => {
      this.scene.background = cubeTexture;
      this.scene.environment = cubeTexture;
      this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      this.renderer.toneMappingExposure = 1.0;
      this.renderer.outputEncoding = THREE.sRGBEncoding;
    });
  }

  addPlane() {
    const planeGeometry = new THREE.PlaneGeometry(
      this.boundaries.x * 2,
      this.boundaries.y * 2,
      this.boundaries.x * 2,
      this.boundaries.y * 2
    );
    planeGeometry.rotateX(-Math.PI * 0.5);
    const planMaterial = new THREE.MeshBasicMaterial({
      side: THREE.DoubleSide,
      color: 0xBA2C4A
    });

    const plane = new THREE.Mesh(planeGeometry, planMaterial);
    plane.position.y = -1;
    this.scene.add(plane);
  }

  addBoundaries() {
    const boundGeometry = new RoundedBoxGeometry(0.5, 2, this.boundaries.y * 2);
    const boundMaterial = new THREE.MeshNormalMaterial();

    const leftBound = new THREE.Mesh(boundGeometry, boundMaterial);
    leftBound.position.x = -this.boundaries.x;

    const rightBound = leftBound.clone();
    rightBound.position.x *= -1;

    this.scene.add(leftBound, rightBound);
  }

  initWebsocket() {
    this.socket = new WebSocket(`ws://0.0.0.0:6060/ws/localgame/`);
    this.socket.onopen = () => {
      console.log("WebSocket is open now.");
      this.isWebSocketOpen = true;
    };

    this.socket.onerror = (error) => console.error("WebSocket error:", error);

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.action === "game_ready") {
        this.ballPosition.set(
          data.game_state.ball.position.x,
          0,
          data.game_state.ball.position.z
        );
      }

      if (data.action === "update") {
        this.ballPosition.set(
          data.game_state.ball.position.x,
          0,
          data.game_state.ball.position.z
        );
        this.player.x = data.game_state.players.paddle1.position.x;
        this.oplayer.x = data.game_state.players.paddle2.position.x;
      }
    };

    this.socket.onclose = () => {
      console.error('WebSocket connection closed');
      this.isWebSocketOpen = false;
    };
  }

  addEventListeners() {
    this.keys = {
      ArrowUp: false,
      ArrowDown: false,
      w: false,
      s: false
    };
    window.addEventListener('resize', this.handleResize.bind(this));
    window.addEventListener('keydown', (event) => {
        
        if (event.key === 'w' && !this.keys.w) {
            this.keys.w = true;
            if (this.isWebSocketOpen) {
                const data = {
                    type: 'paddle_movement',
                    paddle_dy: -0.5, 
                    player_id: 'player1',
                }
                this.socket.send(JSON.stringify(data));
            }
        }
        if (event.key === 's' && !this.keys.s) {
            this.keys.s = true;
            if (this.isWebSocketOpen) {
                const data = {
                    type: 'paddle_movement',
                    paddle_dy: 0.5,
                    player_id: 'player1', 
                }
                this.socket.send(JSON.stringify(data));
            }
        }
        
        if (event.key === 'ArrowUp' && !this.keys.ArrowUp) {
            this.keys.ArrowUp = true;
            if (this.isWebSocketOpen) {
                const data = {
                    type: 'paddle_movement',
                    paddle_dy: -0.5, 
                    player_id: 'player2',
                }
                this.socket.send(JSON.stringify(data));
            }
        }
        if (event.key === 'ArrowDown' && !this.keys.ArrowDown) {
            this.keys.ArrowDown = true;
            if (this.isWebSocketOpen) {
                const data = {
                    type: 'paddle_movement',
                    paddle_dy: 0.5,
                    player_id: 'player2',
                }
                this.socket.send(JSON.stringify(data));
            }
        }
    });
    
    window.addEventListener('keyup', (event) => {
        if (event.key === 'w' && this.keys.w) {
            this.keys.w = false;
            if (this.isWebSocketOpen) {
                const data = {
                    type: 'paddle_movement',
                    paddle_dy: 0,
                    player_id: 'player1',
                }
                this.socket.send(JSON.stringify(data));
            }
        }
        if (event.key === 's' && this.keys.s) {
            this.keys.s = false;
            if (this.isWebSocketOpen) {
                const data = {
                    type: 'paddle_movement',
                    paddle_dy: 0,
                    player_id: 'player1',
                }
                this.socket.send(JSON.stringify(data));
            }
        }
        
        if (event.key === 'ArrowUp' && this.keys.ArrowUp) {
            this.keys.ArrowUp = false;
            if (this.isWebSocketOpen) {
                const data = {
                    type: 'paddle_movement',
                    paddle_dy: 0,
                    player_id: 'player2',
                }
                this.socket.send(JSON.stringify(data));
            }
        }
        if (event.key === 'ArrowDown' && this.keys.ArrowDown) {
            this.keys.ArrowDown = false;
            if (this.isWebSocketOpen) {
                const data = {
                    type: 'paddle_movement',
                    paddle_dy: 0,
                    player_id: 'player2',
                }
                this.socket.send(JSON.stringify(data));
            }
        }
    });
    
}
  handleResize() {
    const sizes = { width: window.innerWidth, height: window.innerHeight };

    this.camera.aspect = sizes.width / sizes.height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(sizes.width, sizes.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  animate() {
    this.ball.mesh.position.copy(this.ballPosition);
    this.playerPaddle.setX(this.player.x);
    this.bootPaddle.setX(this.oplayer.x);
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  start() {
    this.renderer.setAnimationLoop(this.animate.bind(this));
  }
}

// Usage
const game = new Game();
game.start();
