const SECRET_WORD = "GOOSE"; 
const MAX_ATTEMPTS = 6;
let currentAttempt = 0;
let currentGuess = "";
let gameOver = false;

const board = document.getElementById("game-board");
const messageDisplay = document.getElementById("message");
const resetBtn = document.getElementById("reset-btn");
const nextBtn = document.getElementById("next-btn"); // New reference

// Initialize the board
for (let i = 0; i < MAX_ATTEMPTS * 5; i++) {
    const tile = document.createElement("div");
    tile.classList.add("tile");
    tile.setAttribute("id", `tile-${i}`);
    board.appendChild(tile);
}

document.addEventListener("keydown", (e) => {
    if (gameOver) return;

    const key = e.key.toUpperCase();

    if (key === "ENTER" && currentGuess.length === 5) {
        checkGuess();
    } else if (key === "BACKSPACE") {
        currentGuess = currentGuess.slice(0, -1);
        updateBoard();
    } else if (/^[A-Z]$/.test(key) && currentGuess.length < 5) {
        currentGuess += key;
        updateBoard();
    }
});

function updateBoard() {
    for (let i = 0; i < 5; i++) {
        const tile = document.getElementById(`tile-${currentAttempt * 5 + i}`);
        tile.textContent = currentGuess[i] || "";
    }
}

function checkGuess() {
    const rowStart = currentAttempt * 5;
    let tempSecret = SECRET_WORD.split("");

    for (let i = 0; i < 5; i++) {
        const tile = document.getElementById(`tile-${rowStart + i}`);
        if (currentGuess[i] === SECRET_WORD[i]) {
            tile.classList.add("correct");
            tempSecret[i] = null; 
        }
    }

    for (let i = 0; i < 5; i++) {
        const tile = document.getElementById(`tile-${rowStart + i}`);
        if (!tile.classList.contains("correct")) {
            const index = tempSecret.indexOf(currentGuess[i]);
            if (index > -1) {
                tile.classList.add("present");
                tempSecret[index] = null;
            } else {
                tile.classList.add("absent");
            }
        }
    }

    // --- Updated Win/Loss Logic ---
    if (currentGuess === SECRET_WORD) {
        messageDisplay.textContent = "You Win! 🎉";
        gameOver = true;
        nextBtn.style.display = "block"; // Show ONLY next button on win
    } else if (currentAttempt === MAX_ATTEMPTS - 1) {
        messageDisplay.textContent = `Game Over! The word was ${SECRET_WORD}`;
        gameOver = true;
        resetBtn.style.display = "block"; // Show ONLY reset button on loss
    } else {
        currentAttempt++;
        currentGuess = "";
    }
}

// Next Page Functionality
nextBtn.addEventListener("click", () => {
    window.location.href = "tiles.html"; // Ensure level2.html exists in the same folder
});

// Reset Functionality
resetBtn.addEventListener("click", () => {
    currentAttempt = 0;
    currentGuess = "";
    gameOver = false;
    messageDisplay.textContent = "";
    resetBtn.style.display = "none";
    nextBtn.style.display = "none";

    for (let i = 0; i < MAX_ATTEMPTS * 5; i++) {
        const tile = document.getElementById(`tile-${i}`);
        tile.textContent = "";
        tile.className = "tile";
    }
});