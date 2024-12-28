import { runderr } from "./tournament";
// Function to create the Game Matchup Component
function createGameMatchup() {
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
                <!-- Player 1 vs Player 2 -->
                <div class="matchup">
                    <input type="text" id="player1" name="player1" placeholder="Player 1">
                    <div class="vs">VS</div>
                    <input type="text" id="player2" name="player2" placeholder="Player 2">
                </div>
                <!-- Player 3 vs Player 4 -->
                <div class="matchup">
                    <input type="text" id="player3" name="player3" placeholder="Player 3">
                    <div class="vs">VS</div>
                    <input type="text" id="player4" name="player4" placeholder="Player 4">
                </div>
                <div class="button-container">
                    <button id="submitBtn">Submit</button>
                    <button type="reset" class="cancelbtn">Cancel</button>
                </div>
            </div>
            <img class="topr" src="../images/top_right.png">
            <div class="vertical-text right">YUSEF  -  YACINE  -  MOHAMMED  -  KAMAL</div>
    `;
    container.appendChild(brackett);

    // Add event listener for the Submit button
    const submitBtn = container.querySelector('#submitBtn');
    submitBtn.addEventListener('click', event => {
        event.preventDefault();
        const player1 = container.querySelector('#player1').value.trim();
        const player2 = container.querySelector('#player2').value.trim();
        const player3 = container.querySelector('#player3').value.trim();
        const player4 = container.querySelector('#player4').value.trim();
        
        // Check if all players are filled
        if (!player1 || !player2 || !player3 || !player4) {
            alert("Please fill in all player names.");
            return;
        }
        
        const players = [player1, player2, player3, player4];
        brackett.remove();
        // Store players in localStorage
        localStorage.setItem('players', JSON.stringify(players));
        runderr();
    });
    console.log('lol');
}

// Usage example
// Call this function with the ID of the container element where you want to render the component
// Example: createGameMatchup('app');
createGameMatchup();