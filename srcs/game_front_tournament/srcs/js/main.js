import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import Ball from './Ball.js'
import AIController from './AiPaddle.js'
import Paddle from './Paddle.js'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry'


async function getPlayerInfo(id) {
	let response = await fetch(`www.trensc-net.com/profile/${id}`,{
		method: "GET",
		headers: {
				"Authorization": `JWT ${access_token}`
			}
	})
	.then(response => response.json())
	.then(data => {
		console.log(data);
		return data;
	})
	return response;
}

export default class rGame {
  constructor() {
    this.initRenderer();
    this.initSceneAndCamera();
    this.initLights();
    this.initControls();
    this.initObjects();
    this.initWebsocket();
    this.addEventListeners();
	let is = false;
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
    this.camera.position.set(0, 25, 40);

    this.boundaries = new THREE.Vector2(18, 22);
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

    this.playerPaddle = new Paddle(this.scene, this.boundaries, new THREE.Vector3(0, 0, 18));
    this.bootPaddle = new Paddle(this.scene, this.boundaries, new THREE.Vector3(0, 0, -18));
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
    this.socket = new WebSocket(`ws://0.0.0.0:6060/ws/game/`);
    this.socket.onopen = () => {
      console.log("WebSocket is open now.");
      this.isWebSocketOpen = true;
    };

	let is = false;
    this.socket.onerror = (error) => console.error("WebSocket error:", error);

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
	//   let player1_data = getPlayerInfo(data.player_id);
	if (data.action == "waiting"){
		this.player_id = data.player_id;
		  console.log("new connection");
		  let waitingpage = document.createElement("div");
		  waitingpage.style.position = "absolute";
		  waitingpage.style.top = "0";
		  waitingpage.style.left = "0";
		  waitingpage.style.width = "100vh";
		  waitingpage.style.height = "100vh";
		  waitingpage.style.zIndex = "100";
		  waitingpage.id = "waiting";
		  waitingpage.innerHTML = `<section class="all">
		  <div class="vertical-text left">YUSEF  -  YACINE  -  MOHAMMED  -  KAMAL</div>
		  <img class="bottoml" src="../images/bottom_left.png">
		  <div class="all2">
			  <div class="content">
				  <div id="me" class="you"><img class="youimg" src="../images/profile.png"><a class="yname">youssefv</a></div>
				  <a class="vs" >VS</a>
				  <div id="opo" class="oponent"><img class="opoimg" src="../images/1vs1.png"><a class="oname">waiting</a></div>
			  </div>
		  </div>
		  <img class="topr" src="../images/top_right.png">
		  <div class="vertical-text right">YUSEF  -  YACINE  -  MOHAMMED  -  KAMAL</div>
	  </section>`;
	  document.body.appendChild(waitingpage);
			
		}
		if (data.action == "new_connection"){
			if (data.player2_id == this.player_id)
				if (!this.is){
					this.is = true;
					this.camera.position.set(0, 25, -40);
				}
			this.roomname = data.room_name;
			document.getElementById("me").innerHTML = `<img class="youimg" src="../images/profile.png"><a class="yname">uuuuu</a>`;
			document.getElementById("opo").innerHTML = `<img class="opoimg" src="../images/profile.png"><a class="oname">pppppp</a>`;
			setTimeout(() => {
				document.getElementById("waiting").remove();
			}, 4000);

		}
		if (data.action == "game_state")
		{

			// let player2_data ;
			// if (this.player_id == data.game_state.players.paddle1.id){
			// 	player2_data = getPlayerInfo(data.game_state.players.paddle2.id);

			// }
			// else
			// {
			// 	player2_data = getPlayerInfo(data.game_state.players.paddle1.id);
			// }
			this.ballPosition.set(
				data.game_state.ball.position.x,
				0,
				data.game_state.ball.position.z
			);
			if (data.game_state.players.paddle1.id == this.player_id) {
				this.player.x = data.game_state.players.paddle1.position.x;
				this.oplayer.x = data.game_state.players.paddle1.p2;
				// playerScore = data.game_state.players.player1.player_score
				// aiScore = data.game_state.players.player1.ai_score
			} else if (data.game_state.players.paddle2.id == this.player_id){
				if (!this.is){
					this.is = true;
					this.camera.position.set(0, 25, -40);
				}
				console.log(data.game_state.players.paddle1.oscore,"fffffff")
				this.player.x = data.game_state.players.paddle2.p2;
				this.oplayer.x = data.game_state.players.paddle2.position.x;

				// aiScore = data.game_state.players.player1.player_score
				// playerScore = data.game_state.players.player1.ai_score
			}
		}
    };

    this.socket.onclose = () => {
      console.error('WebSocket connection closed');
      this.isWebSocketOpen = false;
    };
  }

  addEventListeners() {
    this.keys = {
		ArrowLeft: false,
		ArrowRight: false,
    };

    window.addEventListener('resize', this.handleResize.bind(this));
	window.addEventListener('keydown', (event) => {
	console.log("pressed");
	if (event.key === 'ArrowLeft' && !this.keys.ArrowLeft) {
		this.keys.ArrowLeft = true	;
		if (this.isWebSocketOpen){
			const data = {
				type: 'paddle_movement',
				room_name: this.roomname,
				paddle_dy: -0.5,
				player_id: this.player_id
			}
			this.socket.send(JSON.stringify(data));
		}
	}
	if (event.key === 'ArrowRight' && !this.keys.ArrowRight) {
		this.keys.ArrowRight = true;
		if (this.isWebSocketOpen){
			const data = {
				type: 'paddle_movement',
				room_name: this.roomname,
				paddle_dy: 0.5,
				player_id: this.player_id
			}
			this.socket.send(JSON.stringify(data))
		}
	}
	});

	window.addEventListener('keyup', (event) => {
	if (event.key === 'ArrowLeft' && this.keys.ArrowLeft) {
		this.keys.ArrowLeft = false;
		if (this.isWebSocketOpen){
			const data = {
				type: 'paddle_movement',
				room_name: this.roomname,
				paddle_dy: 0,
				player_id: this.player_id
			}
			this.socket.send(JSON.stringify(data));
		}
	}
	if (event.key === 'ArrowRight' && this.keys.ArrowRight) {
		this.keys.ArrowRight = false;
		if (this.isWebSocketOpen){
			const data = {
				type: 'paddle_movement',
				room_name: this.roomname,
				paddle_dy: 0,
				player_id: this.player_id
			}
			this.socket.send(JSON.stringify(data))
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
const rgame = new rGame();
rgame.start();
