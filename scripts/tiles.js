const board = document.getElementById('puzzle-board');
const messageDisplay = document.getElementById('message');
const nextLvlBtn = document.getElementById('next-btn'); 
const ROWS = 3;
const COLS = 3;
const TILE_SIZE = 100;
let tiles = []; 
let isGameOver = false;

function initPuzzle() {
    board.innerHTML = "";
    tiles = [];
    isGameOver = false;
    messageDisplay.textContent = "";
    if (nextLvlBtn) nextLvlBtn.style.display = "none";
    
    for (let i = 0; i < ROWS * COLS; i++) {
        const tile = document.createElement('div');
        tile.classList.add('puzzle-tile');
        
        if (i === 8) {
            tile.classList.add('empty');
        } else {
            const row = Math.floor(i / COLS);
            const col = i % COLS;
            tile.style.backgroundPosition = `-${col * TILE_SIZE}px -${row * TILE_SIZE}px`;
        }

        const tileObj = {
            element: tile,
            currentPos: i, 
            value: i       
        };

        tile.addEventListener('click', () => handleMove(tileObj));
        tiles.push(tileObj);
        board.appendChild(tile);
    }

    // SHUFFLE ON LOAD:
    shuffleLogic(); 
    updatePositions();
}

// Reusable shuffle function (200 moves for guaranteed solvability)
function shuffleLogic() {
    for (let i = 0; i < 200; i++) {
        const emptyTile = tiles.find(t => t.value === 8);
        const neighbors = tiles.filter(t => {
            const row = Math.floor(t.currentPos / COLS);
            const col = t.currentPos % COLS;
            const emptyRow = Math.floor(emptyTile.currentPos / COLS);
            const emptyCol = emptyTile.currentPos % COLS;
            return Math.abs(row - emptyRow) + Math.abs(col - emptyCol) === 1;
        });
        
        const randomTile = neighbors[Math.floor(Math.random() * neighbors.length)];
        const tempPos = randomTile.currentPos;
        randomTile.currentPos = emptyTile.currentPos;
        emptyTile.currentPos = tempPos;
    }
}

function updatePositions() {
    tiles.forEach((tileObj) => {
        const row = Math.floor(tileObj.currentPos / COLS);
        const col = tileObj.currentPos % COLS;
        tileObj.element.style.left = `${col * TILE_SIZE}px`;
        tileObj.element.style.top = `${row * TILE_SIZE}px`;
    });
}

function handleMove(clickedTile) {
    if (isGameOver) return;

    const emptyTile = tiles.find(t => t.value === 8);
    const clickedRow = Math.floor(clickedTile.currentPos / COLS);
    const clickedCol = clickedTile.currentPos % COLS;
    const emptyRow = Math.floor(emptyTile.currentPos / COLS);
    const emptyCol = emptyTile.currentPos % COLS;

    const isAdjacent = Math.abs(clickedRow - emptyRow) + Math.abs(clickedCol - emptyCol) === 1;

    if (isAdjacent) {
        const tempPos = clickedTile.currentPos;
        clickedTile.currentPos = emptyTile.currentPos;
        emptyTile.currentPos = tempPos;

        updatePositions();
        checkWin();
    }
}

function checkWin() {
    const isWin = tiles.every(t => t.currentPos === t.value);
    if (isWin) {
        isGameOver = true;
        messageDisplay.textContent = "You Win! 🎉";
        if (nextLvlBtn) nextLvlBtn.style.display = "block";
    }
}

// Button listeners
if (nextLvlBtn) {
    nextLvlBtn.onclick = () => { window.location.href = "trivia.html"; };
}

document.getElementById('shuffle-btn').onclick = () => {
    isGameOver = false;
    if (nextLvlBtn) nextLvlBtn.style.display = "none";
    messageDisplay.textContent = "";
    shuffleLogic();
    updatePositions();
};

initPuzzle();