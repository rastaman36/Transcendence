import { runderr } from "./tournament";

function updateUI() {
    let container = document.body;
    if (!container) {
        console.error(`Container with ID '${container}' not found.`);
        return;
    }

    const style = document.createElement("style");
    style.textContent = `
    @font-face {
        font-family: 'Karasha';
        src: url('./Karasha.ttf') format('truetype');
        font-weight: normal;
        font-style: normal;
    }

    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }
    .bottoml{
        position: absolute;
        bottom: 0;
        width: 20vw;
        left: 4.5%;
        z-index: -99;
        opacity: .7;
    }

    .topr{
        position: absolute;
        right: 5%;
        top: 0%;
        z-index: -99;
        opacity: .7;
        width: 20vw;    
    }
    body {
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #d8163d;
        font-family: 'Koulen';
        height: 100vh;
        width: 100%;
        overflow: hidden;
    }

    .container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        color: #E9BF8D;
        position: relative;
    }

    .vertical-text {
        background: black;
        display: flex;
        align-items: center;
        justify-content: center;
        writing-mode: vertical-lr;
        width: 5%;
        word-spacing: 3vw;
        letter-spacing: 0.2vw;
        color: #E9BF8D;
        border-left: #E9BF8D 2px solid;
        position: absolute;
    }

    .vertical-text.left {
        transform: rotate(180deg);
        left: 0;
        height: 100%;
    }

    .vertical-text.right {
        right: 0;
        height: 100%;
    }

    .form-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 2rem;
        border-radius: 0; /* Removes rounded corners */
        box-shadow: none; /* Removes shadow */
        min-width: 600px; 
        width: auto; 
        min-height: 400px; 
        max-width: 90%; 
    }

    .matchup {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 2rem; /* Increased space between inputs */
        width: 100%;
    }

    .matchup input {
        flex: 1;
        padding: 1rem; /* Larger padding */
        font-size: 1.5rem; /* Larger font size */
        border: 2px solid #E9BF8D;
        border-radius: 8px; /* Slightly more rounded corners */
        background: transparent; /* Removed white background */
        color: #333;
        text-align: center;
        margin: 0 1rem; /* Increased space between inputs */
    }

    input::placeholder {
        color: #bbb;
    }

    .vs {
        color: #E9BF8D;
        font-size: 2rem; /* Larger font size for VS */
        font-family: 'Zen Dots', sans-serif;
        letter-spacing: 5px;
        text-align: center;
    }

    .button-container {
        display: flex;
        justify-content: center; /* Centers the buttons */
        gap: 260px; /* Adds space between buttons, you can adjust this value */
        width: 100%;
        margin-top: 2rem; /* Space above buttons */
    }

    button {
        padding: 1rem 3rem;
        font-size: 12px; 
        letter-spacing: 1em; 
        text-align: center; 
        background-color: #FF7E7E; 
        border: 3px solid black;
        cursor: pointer;
        transition: all 0.3s ease-in-out;
        font-family: 'Koulen';
        display: inline-flex;
        align-items: center;
        justify-content: center;
    }

    button:hover {
        scale: 1.1;
        /* background-color: black; */
        /* color: white; */
    }
    .bracket-title {
        font-family: 'Koulen', sans-serif;
        font-size: 2rem;
        text-align: center;
        margin-bottom: 20px;
        color: #333;
    }

    .theme {
        margin: 20px auto;
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
    }

    .bracket {
        display: flex;
        flex-direction: row;
        position: relative;
        gap: 20px;
    }

    .column {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
    }

    .match {
        display: flex;
        flex-direction: column;
        align-items: stretch;
        width: 200px;
        margin: 10px 0;
        position: relative;
    }

    .team {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px;
        font-family: 'Zen Dots', sans-serif;
        background-color: #f9f9f9;
        border: 1px solid #ccc;
        border-radius: 5px;
    }

    .match .team:first-child {
        margin-bottom: -1px;
        border-radius: 5px 5px 0 0;
    }

    .match .team:last-child {
        border-radius: 0 0 5px 5px;
    }

    .match-lines {
        position: absolute;
        top: 50%;
        right: -20px;
    }

    .match-lines .line {
        background: #ccc;
        position: absolute;
    }

    .line.one {
        height: 1px;
        width: 20px;
    }

    .line.two {
        height: 50px;
        width: 1px;
        top: -25px;
        left: 20px;
    }

    /* Dark Theme */
    .theme-dark {
        background: linear-gradient(120deg, #0e1217, #232c36); /* Existing gradient */
        border: 5px solid #0e1217; /* Add a border */
        border-radius: 10px; /* Optional: Rounded corners */
        transition: transform 0.5s ease, background-color 0.5s ease; /* Smooth transition */
        transform: scale(1); /* Default scale */
    }


    .theme-dark .team {
        background: #182026;
        border-color: #232c36;
        color: #6b798c;
        transition: all 0.3s ease-in-out;
    }

    .team .score {
        font-size: 18px; /* Increased font size for better visibility */
        color: #E9BF8D; /* Set the score color to match the theme */
        font-weight: bold; /* Make the score stand out */
        margin-left: 10px; /* Space between name and score */
    }



    .theme-dark .match-lines .line {
        background: #36404e;
    }

    .match {
        display: flex;
        flex-direction: column;
        align-items: stretch;
        width: var(--match-width, 240px);
        margin: var(--match-spacing, 24px) 0;
        position: relative;
    }

    .match .team:first-child {
        border-radius: 5px 5px 0 0;
    }

    .match .team:last-child {
        border-radius: 0 0 5px 5px;
    }
    .winner-header {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        top : -100%;
        font-size: 2em;
        font-weight: bold;
        text-align: center;
        color: #FFD700; /* Gold for emphasis */
        margin-bottom: 10px;
    }
    /* Optional: Style the winner in the final round */
    /* .final-round .team.winner {
        background-color: #d8163d; 
        color: #fff; 
        font-weight: bold;
        border-color: #03d9ce;
    } */
    `

    const brackett = document.createElement("div");
    brackett.className = "container";
    container.appendChild(style)

    brackett.innerHTML = `
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
    `;
    container.appendChild(brackett);

    // Add event listener for the Submit button
    document.addEventListener("DOMContentLoaded", () => {
        // Fetch the tournament JSON data
        fetch("http://localhost:8000/structure/tournament.json")
            .then(response => response.json())
            .then(data => {
                // Update Round 1 player names and scores
                const round1 = data.rounds.round1;
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
                const round2 = data.rounds.round2;
                document.getElementById('round2-name1').textContent = round2[0].name;
                document.getElementById('round2-score1').textContent = round2[0].score;

                document.getElementById('round2-name2').textContent = round2[1].name;
                document.getElementById('round2-score2').textContent = round2[1].score;

                // Determine winner for Round 2
                const round2Winner =
                    round2[0].score > round2[1].score ? round2[0].name : round2[1].name;

                // Update Final Round with the winner and score
                const final = data.rounds.final;
                document.getElementById('final-name1').textContent = final.name;
                document.getElementById('final-score1').textContent = final.score;
            })
            .catch(error => console.error("Error loading tournament data:", error));
    });
}

// Usage example
// Call this function with the ID of the container element where you want to render the component
// Example: createGameMatchup('app')