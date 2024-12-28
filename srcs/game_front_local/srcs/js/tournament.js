
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Ball from './Ball.js';
import Paddle from './Paddle.js';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry';



export function runderr(){


function createBackground() {
    const cubeTextureLoader = new THREE.CubeTextureLoader();
    cubeTextureLoader.load([
        '../models/cube_right.png',   // positive x
        '../models/cube_left.png',    // negative x
        '../models/cube_up.png',     // positive y
        '../models/cube_down.png',  // negative y
        '../models/cube_back.png',   // positive z
        '../models/cube_front.png'     // negative z
    ], (cubeTexture) => {
        scene.background = cubeTexture;
        scene.environment = cubeTexture;
        
        // Optional: Tone mapping settings
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.0;
        renderer.outputEncoding = THREE.sRGBEncoding;
    });
}
createBackground();

let plane, leftBound, rightBound;
console.log("herree");
const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 1000);
const orbt = new OrbitControls(camera, renderer.domElement);
camera.position.set(16.9, 36, 0);

const boundaries = new THREE.Vector2(18, 27);
const planeGeometry = new THREE.PlaneGeometry(boundaries.x * 2, boundaries.y * 2, boundaries.x * 2, boundaries.y * 2);
planeGeometry.rotateX(-Math.PI * 0.5);
const planMaterial = new THREE.MeshBasicMaterial({
    side: THREE.DoubleSide,
    color: 0xBA2C4A,
});

plane = new THREE.Mesh(planeGeometry, planMaterial);
plane.position.y = -1;
scene.add(plane);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(10, 10, 10);
scene.add(directionalLight);

const boundGeometry = new RoundedBoxGeometry(0.5, 2, boundaries.y * 2);
const boundMaterial = new THREE.MeshNormalMaterial();
leftBound = new THREE.Mesh(boundGeometry, boundMaterial);
leftBound.position.x = -boundaries.x;
rightBound = leftBound.clone();
rightBound.position.x *= -1;
scene.add(leftBound, rightBound);

const playerPaddle = new Paddle(scene, boundaries, new THREE.Vector3(0, 0, 25));
const bootPaddle = new Paddle(scene, boundaries, new THREE.Vector3(0, 0, -25
));
const dball = new Ball(scene, boundaries, [playerPaddle, bootPaddle]);

const player = { x: 0, y: 0, z: 18, dx: 0 };
const oplayer = { x: 0, y: 0, z: -18, dx: 0 };
const ball = new THREE.Vector3(0, 0, 0);

let socket;
let isWebSocketOpen = false;
let tournamentState = null;
let mach_ = false;
let uiContentVisible = false
// Initialize WebSocket
async function initWebsocket() {
    if (document.getElementById("match-result"))
        document.getElementById("match-result").remove();
    socket = new WebSocket(`ws://0.0.0.0:6060/ws/localtournament/`);
    console.log("haaaaaaaa");
    socket.onopen = function () {
        const players = JSON.parse(localStorage.getItem('players')) || [];
        // console.log(players)
        if (players.length !== 4) {
            alert("Player names are not correctly set!");
            return;
        }
        console.log("WebSocket is open now.");
        isWebSocketOpen = true;

        const tournamentData = {
            type: "init_tournament",
            tournament_data: {
                rounds: {
                    round1: [
                        { name: players[0], score: 0 },
                        { name: players[1], score: 0 },
                        { name: players[2], score: 0 },
                        { name: players[3], score: 0 },
                    ],
                    round2: [
                        { name: "-", score: 0 },
                        { name: "-", score: 0 },
                    ],
                    final: {
                        name: "-",
                    },
                },
            },
        };
        console.log(tournamentData["tournament_data"]["rounds"]["round1"][0]["name"]);
        socket.send(JSON.stringify(tournamentData));
    };

    socket.onmessage = async function (event) {
        const data = JSON.parse(event.data);

        if (data.action === "match_start") {
            // Update game state for the new match
            tournamentState = data.tournament_state;
            resetGame(data.game_state);
        } else if (data.action === "tournament_update") {
            // Update tournament progress
            mach_ = false;
            tournamentState = data.tournament_state;
            await updateUI(tournamentState);
            // uiContentVisible = true;
            // function spaceKeyListener(event) {
            //     if (event.key === " " && uiContentVisible) {
            //         document.getElementById("match-result").remove();
            //         window.removeEventListener("keydown", spaceKeyListener); // Remove listener after space is pressed
            //         uiContentVisible = false;
            //         console.log("to next match");
            //     }
            // }
            // window.addEventListener("keydown", spaceKeyListener);
            setTimeout(() => {
                console.log("Waited for 5 seconds");
                    document.getElementById("match-result").remove();
            }, 5000);
            //go to next match
           console.log(tournamentState["rounds"]);
        } else if (data.action === "game_update") {
            // Update game state
            ball.set(data.game_state.ball.position.x, 0, data.game_state.ball.position.z);
            player.x = data.game_state.players.paddle1.position.x;
            oplayer.x = data.game_state.players.paddle2.position.x;
        }
    };

    socket.onclose = () => {
        console.error("WebSocket connection closed");
        isWebSocketOpen = false;
    };
}

let isMatchStarted = false;

function handleEnterKey(event) {
    if (uiContentVisible){
        return;
    }
    isMatchStarted = true;
    const data = { type: "start_match" };
    socket.send(JSON.stringify(data));
    console.log("Match started!");
}

function resetGame(gameState) {
    ball.set(gameState.ball.position.x, 0, gameState.ball.position.z);
    player.x = gameState.players.paddle1.position.x;
    oplayer.x = gameState.players.paddle2.position.x;
    
    // Clear previous game state
    scene.remove(plane);
    scene.remove(leftBound);
    scene.remove(rightBound);
    
    // Recreate game elements
    const planeGeometry = new THREE.PlaneGeometry(boundaries.x * 2, boundaries.y * 2, boundaries.x * 2, boundaries.y * 2);
    planeGeometry.rotateX(-Math.PI * 0.5);
    const planMaterial = new THREE.MeshBasicMaterial({
        side: THREE.DoubleSide,
        color: 0xBA2C4A,
    });
    
    plane = new THREE.Mesh(planeGeometry, planMaterial);
    plane.position.y = -1;
    scene.add(plane);
    
    const boundGeometry = new RoundedBoxGeometry(0.5, 2, boundaries.y * 2);
    const boundMaterial = new THREE.MeshNormalMaterial();
    leftBound = new THREE.Mesh(boundGeometry, boundMaterial);
    leftBound.position.x = -boundaries.x;
    rightBound = leftBound.clone();
    rightBound.position.x *= -1;
    scene.add(leftBound, rightBound);
    
    // Reset match state
    isMatchStarted = false;
    // updateUI();
}


initWebsocket();

let keys = { ArrowUp: false, ArrowDown: false, w: false, s: false };
window.addEventListener("keydown", (event) => handleKey(event, true));
window.addEventListener("keyup", (event) => handleKey(event, false));

function handleKey(event, isKeyDown) {
    if (event.key === "Enter" && !mach_ && isKeyDown) {
        mach_ = true;
        handleEnterKey(event);
        return;
    }
    // if (!isMatchStarted) return;
    
    const keyMap = { w: "player1", s: "player1", ArrowUp: "player2", ArrowDown: "player2" };
    const movement = isKeyDown ? (event.key === "w" || event.key === "ArrowUp" ? -0.5 : 0.5) : 0;
    
    if (keyMap[event.key] && isWebSocketOpen) {
        const data = { type: "paddle_movement", paddle_dy: movement, player_id: keyMap[event.key] };
        // console.log(data);
        socket.send(JSON.stringify(data));
    }
}

function animate() {
    // console.log(ball);
    dball.mesh.position.x = ball.x;
    dball.mesh.position.z = ball.z;
    playerPaddle.setX(player.x);
    bootPaddle.setX(oplayer.x);
    orbt.update();
    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

function resizeHandler() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener("resize", resizeHandler);
}

async function updateUI( tournament_data ) {
    const status = document.getElementById("tournament-status");
    let cont = document.createElement('div');
    cont.id = "match-result";
    cont.style.width = '100vw';
    cont.style.height = '100vh';
    cont.style.display = 'flex';
    cont.style.justifyContent = 'center';
    cont.style.alignItems = 'center';
    cont.style.backgroundColor = '#E9BF8D';
    cont.innerHTML = `
     <div class="vertical-text left">YUSEF  -  YACINE  -  MOHAMMED  -  KAMAL</div>
        <img class="bottoml" src="../images/bottom_left.png">
        <div class="form-content">
            <h1 class="bracket-title">Tournament Bracket</h1>
            <div class="theme theme-dark">
                <div class="bracket disable-image">
                    <!-- Round 1 -->
                    <div class="column one">
                        <div class="match">
                            <div class="match-top team" id="round1-player1">
                                <span class="name" id="player1-name">Player 1</span>
                                <span class="score" id="score1">4</span>
                            </div>
                            <div class="match-bottom team" id="round1-player2">
                                <span class="name" id="player2-name">Player 2</span>
                                <span class="score" id="score2">2</span>
                            </div>
                            <div class="match-lines">
                                <div class="line one"></div>
                                <div class="line two"></div>
                            </div>
                        </div>
                        <div class="match">
                            <div class="match-top team" id="round1-player3">
                                <span class="name" id="player3-name">Player 3</span>
                                <span class="score" id="score3">1</span>
                            </div>
                            <div class="match-bottom team" id="round1-player4">
                                <span class="name" id="player4-name">Player 4</span>
                                <span class="score" id="score4">4</span>
                            </div>
                            <div class="match-lines">
                                <div class="line one"></div>
                                <div class="line two"></div>
                            </div>
                        </div>
                    </div>

                    <!-- Round 2 -->
                    <div class="column two">
                        <div class="match">
                            <div class="match-top team" id="round2-player1">
                                <span class="name" id="round2-name1">Player 2</span>
                                <span class="score" id="round2-score1">0</span>
                            </div>
                            <div class="match-bottom team" id="round2-player2">
                                <span class="name" id="round2-name2">Player 4</span>
                                <span class="score" id="round2-score2">0</span>
                            </div>
                            <div class="match-lines">
                                <div class="line one"></div>
                                <div class="line two"></div>
                            </div>
                        </div>
                    </div>

                    <!-- Final Round -->
                    <div class="column three final-round">
                        <div class="match">
                            <div class="winner-header">WINNER</div>
                            <div class="match-top team" id="final-player1">
                                <span class="name" id="final-name1">Winner</span> <!-- This will be dynamically updated -->
                                <span class="score" id="final-score1">0</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <img class="topr" src="../images/top_right.png">
        <div class="vertical-text right">YUSEF  -  YACINE  -  MOHAMMED  -  KAMAL</div>
    </div>`

            cont.style.position = 'absolute';
            document.body.appendChild(cont);

            const round1 = tournament_data.rounds.round1;
            document.getElementById('player1-name').textContent = round1[0].name;
            document.getElementById('score1').textContent = round1[0].score;

            document.getElementById('player2-name').textContent = round1[1].name;
            document.getElementById('score2').textContent = round1[1].score;

            document.getElementById('player3-name').textContent = round1[2].name;
            document.getElementById('score3').textContent = round1[2].score;

            document.getElementById('player4-name').textContent = round1[3].name;
            document.getElementById('score4').textContent = round1[3].score;

            // Determine winners for Round 1
            const round1Winners = [
                round1[0].score > round1[1].score ? round1[0].name : round1[1].name,
                round1[2].score > round1[3].score ? round1[2].name : round1[3].name
            ];

            // Update Round 2 player names and scores
            const round2 = tournament_data.rounds.round2;
            document.getElementById('round2-name1').textContent = round2[0].name;
            document.getElementById('round2-score1').textContent = round2[0].score;

            document.getElementById('round2-name2').textContent = round2[1].name;
            document.getElementById('round2-score2').textContent = round2[1].score;

            // Determine winner for Round 2
            const round2Winner =
                round2[0].score > round2[1].score ? round2[0].name : round2[1].name;

            // Update Final Round with the winner and score
            const final = tournament_data.rounds.final;
            document.getElementById('final-name1').textContent = final.name;
            document.getElementById('final-score1').textContent = final.score;

        // cont.style.position = 'absolute';
        // document.body.appendChild(cont);
        // cont.style.display = 'none';
    // createGameMatchup(document.body);

    // status.textContent = `Current Round: ${tournamentState.current_round}, Match: ${tournamentState.current_match + 1}`;
}