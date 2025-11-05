// ===== SPACESHIP MAZE PUZZLE GAME v2.7 =====
console.log('🚀 Game script v2.7 loaded successfully!');
console.log('Features: Path strips, Rotation, Arrow direction change, Corner/T paths, Path highlighting, 3-minute timer');
console.log('🔧 Fixed: Comprehensive dynamic element cleanup system implemented');

// ===== GAME STATE =====
const gameState = {
    currentLevel: 1,
    moves: 0,
    score: 0,
    timeLimit: 180, // 3 minutes in seconds
    timeRemaining: 180,
    timerInterval: null,
    selectedTile: null,
    grid: [],
    gridSize: { rows: 4, cols: 4 },
    startPos: { row: 2, col: 0 }, // Middle left - spaceship starts here
    endPos: { row: 1, col: 3 }, // Top right - earth is here
    optimalMoves: 0,
    gameStarted: false,
    showAnswerAllowed: false
};

// ===== TILE TYPES =====
const TILE_TYPES = {
    EMPTY: 'empty',
    PATH: 'path',
    DARK: 'dark'
};

// ===== ARROW DIRECTIONS =====
const DIRECTIONS = {
    UP: 'up',
    DOWN: 'down',
    LEFT: 'left',
    RIGHT: 'right'
};

// ===== PATH TYPES =====
const PATH_TYPES = {
    STRAIGHT: 'straight',
    CORNER: 'corner',
    T_JUNCTION: 't_junction'
};

// ===== PATH CONFIGURATIONS =====
const PATH_CONFIGS = {
    // Straight paths (original behavior)
    STRAIGHT_UP: { type: PATH_TYPES.STRAIGHT, directions: ['up'] },
    STRAIGHT_DOWN: { type: PATH_TYPES.STRAIGHT, directions: ['down'] },
    STRAIGHT_LEFT: { type: PATH_TYPES.STRAIGHT, directions: ['left'] },
    STRAIGHT_RIGHT: { type: PATH_TYPES.STRAIGHT, directions: ['right'] },
    
    // Corner paths (L-shapes)
    CORNER_UP_RIGHT: { type: PATH_TYPES.CORNER, directions: ['up', 'right'] },
    CORNER_RIGHT_DOWN: { type: PATH_TYPES.CORNER, directions: ['right', 'down'] },
    CORNER_DOWN_LEFT: { type: PATH_TYPES.CORNER, directions: ['down', 'left'] },
    CORNER_LEFT_UP: { type: PATH_TYPES.CORNER, directions: ['left', 'up'] },
    
    // T-junction paths (3-way connections)
    T_UP_LEFT_RIGHT: { type: PATH_TYPES.T_JUNCTION, directions: ['up', 'left', 'right'] },
    T_DOWN_LEFT_RIGHT: { type: PATH_TYPES.T_JUNCTION, directions: ['down', 'left', 'right'] },
    T_LEFT_UP_DOWN: { type: PATH_TYPES.T_JUNCTION, directions: ['left', 'up', 'down'] },
    T_RIGHT_UP_DOWN: { type: PATH_TYPES.T_JUNCTION, directions: ['right', 'up', 'down'] }
};

// ===== PATH GENERATION =====
function randomPathConfig() {
    const configs = Object.values(PATH_CONFIGS);
    return configs[Math.floor(Math.random() * configs.length)];
}

function randomSingleDirection() {
    const dirs = [DIRECTIONS.UP, DIRECTIONS.RIGHT, DIRECTIONS.DOWN, DIRECTIONS.LEFT];
    return dirs[Math.floor(Math.random() * dirs.length)];
}

function generateLevelTiles(levelNum) {
    const levelConfig = {
        1: { rows: 4, cols: 4 },
        2: { rows: 4, cols: 5 },
        3: { rows: 5, cols: 5 },
        4: { rows: 5, cols: 6 },
        5: { rows: 6, cols: 6 }
    };
    
    const size = levelConfig[levelNum] || { rows: 4, cols: 4 };
    const tiles = [];
    
    for (let row = 0; row < size.rows; row++) {
        for (let col = 0; col < size.cols; col++) {
            // Most tiles should have paths (85%)
            const isDark = Math.random() < 0.35;
            const hasPath = Math.random() < 0.85;
            if (hasPath) {
                const pathConfig = randomPathConfig();
                console.log(`🎯 Generated tile at (${row},${col}) with path type:`, pathConfig.type, 'directions:', pathConfig.directions);
                tiles.push({
                    row,
                    col,
                    type: isDark ? TILE_TYPES.DARK : TILE_TYPES.PATH,
                    pathType: pathConfig.type,
                    arrows: pathConfig.directions.slice(), // copy the directions array
                    rotation: 0 // rotation disabled in v2.1
                });
            } else {
                tiles.push({
                    row,
                    col,
                    type: TILE_TYPES.EMPTY,
                    arrows: [],
                    rotation: 0
                });
            }
        }
    }
    
    return tiles;
}

// ===== LEVEL CONFIGURATIONS =====
const levels = [
    {
        level: 1,
        gridSize: { rows: 4, cols: 4 },
        startPos: { row: 2, col: 0 },
        endPos: { row: 1, col: 3 },
        optimalMoves: 6,
        timeLimit: 180,
        tiles: null
    },
    {
        level: 2,
        gridSize: { rows: 4, cols: 5 },
        startPos: { row: 2, col: 0 },
        endPos: { row: 2, col: 4 },
        optimalMoves: 8,
        timeLimit: 180,
        tiles: null
    },
    {
        level: 3,
        gridSize: { rows: 5, cols: 5 },
        startPos: { row: 2, col: 0 },
        endPos: { row: 3, col: 4 },
        optimalMoves: 10,
        timeLimit: 180,
        tiles: null
    },
    {
        level: 4,
        gridSize: { rows: 5, cols: 6 },
        startPos: { row: 2, col: 0 },
        endPos: { row: 3, col: 5 },
        optimalMoves: 12,
        timeLimit: 180,
        tiles: null
    },
    {
        level: 5,
        gridSize: { rows: 6, cols: 6 },
        startPos: { row: 3, col: 0 },
        endPos: { row: 2, col: 5 },
        optimalMoves: 15,
        timeLimit: 180,
        tiles: null
    }
];

// ===== GLOBAL CLEANUP FUNCTION =====
function cleanupDynamicElements() {
    // Remove all dynamically created modals
    const dynamicModals = document.querySelectorAll('.modal.active');
    dynamicModals.forEach(modal => {
        if (modal.parentNode) {
            modal.remove();
        }
    });
    
    // Remove all floating messages
    const messages = document.querySelectorAll('.floating-message, .message-overlay, .success-message, .path-found-message');
    messages.forEach(msg => {
        if (msg.parentNode) {
            msg.remove();
        }
    });
    
    console.log('🧹 Cleaned up dynamic elements');
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    cleanupDynamicElements(); // Clean up any existing elements
    initializeGame();
    setupEventListeners();
    initializeTouchFeedback();
    showRulesModal();
});

function initializeGame() {
    loadLevel(gameState.currentLevel);
    updateDisplay();
}

function setupEventListeners() {
    console.log('🔧 Setting up event listeners...');
    
    // Rules modal
    document.getElementById('rulesBtn').addEventListener('click', showRulesModal);
    document.getElementById('closeModal').addEventListener('click', hideRulesModal);
    document.getElementById('startGameBtn').addEventListener('click', () => {
        hideRulesModal();
        startGame();
    });

    // Control buttons
    const rotateBtn = document.getElementById('rotateBtn');
    const arrowBtn = document.getElementById('arrowBtn');
    
    if (rotateBtn) {
        rotateBtn.addEventListener('click', rotateTile);
        console.log('✅ Rotate button event listener added');
    } else {
        console.error('❌ Rotate button not found!');
    }
    
    if (arrowBtn) {
        arrowBtn.addEventListener('click', changeArrowDirection);
        console.log('✅ Arrow button event listener added');
    } else {
        console.error('❌ Arrow button not found!');
    }
    const showPathBtn = document.getElementById('showPathBtn');
    if (showPathBtn) {
        showPathBtn.addEventListener('click', showPath);
    }
    document.getElementById('resetBtn').addEventListener('click', resetLevel);
    document.getElementById('nextLevelBtn').addEventListener('click', () => {
        stopTimer();
        gameState.gameStarted = false;
        nextLevel();
    });
    
    // Show Answer button
    const showAnswerBtn = document.getElementById('showAnswerBtn');
    if (showAnswerBtn) {
        showAnswerBtn.addEventListener('click', showAnswer);
    }

    // Success modal
    document.getElementById('nextLevelBtn').addEventListener('click', nextLevel);

    // Game over modal
    document.getElementById('retryBtn').addEventListener('click', () => {
        hideGameOverModal();
        resetLevel();
    });
    document.getElementById('skipBtn').addEventListener('click', () => {
        hideGameOverModal();
        nextLevel();
    });

    // Close modals on outside click (but not on mobile to prevent accidental closes)
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal') && window.innerWidth > 768) {
            e.target.classList.remove('active');
        }
    });
    
    // Handle mobile modal closing with touch
    window.addEventListener('touchend', (e) => {
        if (e.target.classList.contains('modal') && window.innerWidth <= 768) {
            // Only close if touch was held for less than 200ms (quick tap)
            e.target.classList.remove('active');
        }
    });
}

// ===== LEVEL LOADING =====
function loadLevel(levelNum) {
    const level = levels[levelNum - 1];
    if (!level) {
        alert('Congratulations! You completed all levels!');
        return;
    }

    gameState.currentLevel = levelNum;
    gameState.moves = 0;
    gameState.gridSize = level.gridSize;
    gameState.startPos = level.startPos;
    gameState.endPos = level.endPos;
    gameState.optimalMoves = level.optimalMoves;
    gameState.timeLimit = level.timeLimit;
    gameState.timeRemaining = level.timeLimit;
    gameState.showAnswerAllowed = false;
    
    // Generate tiles for this level if not already generated
    if (!level.tiles) {
        level.tiles = generateLevelTiles(levelNum);
    }
    // Copy tiles with their path configurations
    gameState.grid = level.tiles.map(t => ({
        ...t,
        pathType: t.pathType || PATH_TYPES.STRAIGHT,
        arrows: (t.arrows && t.arrows.length > 0) ? t.arrows.slice() : [],
        rotation: 0
    }));
    gameState.selectedTile = null;

    renderGrid();
    updateDisplay();
    updateShowAnswerButton();
}

function renderGrid() {
    const mazeGrid = document.getElementById('mazeGrid');
    mazeGrid.innerHTML = '';
    
    const { rows, cols } = gameState.gridSize;
    mazeGrid.style.gridTemplateColumns = `repeat(${cols}, 100px)`;
    mazeGrid.style.gridTemplateRows = `repeat(${rows}, 100px)`;

    console.log('Rendering grid:', rows, 'x', cols, 'Total tiles:', gameState.grid.length);

    gameState.grid.forEach((tile, index) => {
    const tileElement = createTileElement(tile, index);
        
        // Add start indicator (spaceship)
        const startIndex = gameState.startPos.row * cols + gameState.startPos.col;
        if (index === startIndex) {
            console.log('🚀 Adding spaceship at index:', index, 'position:', gameState.startPos);
            const startMarker = document.createElement('div');
            startMarker.className = 'start-marker';
            startMarker.innerHTML = `
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L3 7l9 5 9-5-9-5Z" fill="#00D9FF"/>
                    <path d="M3 12l9 5 9-5" stroke="#00D9FF" stroke-width="2"/>
                    <circle cx="12" cy="12" r="2" fill="#0A0E27"/>
                </svg>`;
            startMarker.style.cssText = 'position: absolute; left: -45px; top: 50%; transform: translateY(-50%); font-size: 32px; z-index: 100;';
            tileElement.appendChild(startMarker);
        }
        
        // Add end indicator (earth)
        const endIndex = gameState.endPos.row * cols + gameState.endPos.col;
        if (index === endIndex) {
            console.log('🌍 Adding earth at index:', index, 'position:', gameState.endPos);
            const endMarker = document.createElement('div');
            endMarker.className = 'end-marker';
            endMarker.innerHTML = `
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" fill="#00FF88"/>
                    <path d="M7 12h10M12 7v10" stroke="#0A0E27" stroke-width="2" stroke-linecap="round"/>
                </svg>`;
            endMarker.style.cssText = 'position: absolute; right: -45px; top: 50%; transform: translateY(-50%); font-size: 32px; z-index: 100;';
            tileElement.appendChild(endMarker);
        }
        
        mazeGrid.appendChild(tileElement);
    });

    console.log('Grid rendered with', mazeGrid.children.length, 'tiles');

    // No canvas in v2.1
}

function createTileElement(tile, index) {
    const tileDiv = document.createElement('div');
    tileDiv.className = `tile ${tile.type}`;
    tileDiv.dataset.index = index;

    // Create path container (no rotation)
    const pathContainer = document.createElement('div');
    pathContainer.className = 'path-container';
    
    // Add path type class for CSS styling
    if (tile.pathType) {
        tileDiv.classList.add(`path-${tile.pathType}`);
    }
    
    // Mark tile with direction classes for CSS visibility
    if (tile.arrows && tile.arrows.length > 0) {
        tile.arrows.forEach(dir => {
            tileDiv.classList.add(`dir-${dir}`);
        });
    }

    // Draw all active direction strips
    if (tile.arrows && tile.arrows.length > 0) {
        tile.arrows.forEach(activeDir => {
            const pathStrip = document.createElement('div');
            pathStrip.className = `path-strip path-${activeDir}`;
            const arrowCount = tile.pathType === PATH_TYPES.T_JUNCTION ? 2 : 3;
            for (let i = 0; i < arrowCount; i++) {
                const arrowIcon = document.createElement('div');
                arrowIcon.className = `strip-arrow arrow-${activeDir}`;
                pathStrip.appendChild(arrowIcon);
            }
            pathContainer.appendChild(pathStrip);
        });
    }

    tileDiv.appendChild(pathContainer);
    tileDiv.addEventListener('click', () => selectTile(index));
    
    // Add touch feedback for mobile
    addTouchFeedback(tileDiv);

    return tileDiv;
}

// no canvas in v2.1

// ===== TILE SELECTION =====
function selectTile(index) {
    if (!gameState.gameStarted) {
        startGame();
    }

    const tiles = document.querySelectorAll('.tile');
    
    // Deselect previous
    if (gameState.selectedTile !== null) {
        tiles[gameState.selectedTile].classList.remove('selected');
    }

    // Select new tile
    if (gameState.selectedTile === index) {
        gameState.selectedTile = null;
        updateControlButtons(false);
    } else {
        gameState.selectedTile = index;
        tiles[index].classList.add('selected');
        updateControlButtons(true);
    }
}

function updateControlButtons(enabled) {
    const rotateBtn = document.getElementById('rotateBtn');
    const arrowBtn = document.getElementById('arrowBtn');
    rotateBtn.disabled = !enabled;
    arrowBtn.disabled = !enabled;
}

// ===== TILE ACTIONS =====
function changeArrowDirection() {
    if (gameState.selectedTile === null) return;
    console.log('⇅ CHANGE ARROW: Cycling tile path configuration');
    const tile = gameState.grid[gameState.selectedTile];
    
    // Get all path configurations in order
    const configOrder = Object.keys(PATH_CONFIGS);
    
    // Find current configuration
    let currentConfigKey = null;
    for (const [key, config] of Object.entries(PATH_CONFIGS)) {
        if (arraysEqual(config.directions, tile.arrows)) {
            currentConfigKey = key;
            break;
        }
    }
    
    // If not found, start with first straight config
    if (!currentConfigKey) {
        currentConfigKey = 'STRAIGHT_RIGHT';
    }
    
    // Get next configuration
    const currentIndex = configOrder.indexOf(currentConfigKey);
    const nextIndex = (currentIndex + 1) % configOrder.length;
    const nextConfigKey = configOrder[nextIndex];
    const nextConfig = PATH_CONFIGS[nextConfigKey];
    
    // Update tile
    tile.pathType = nextConfig.type;
    tile.arrows = nextConfig.directions.slice();

    // Re-render the tile
    renderTile(gameState.selectedTile);

    gameState.moves++;
    updateDisplay();
    clearPathHighlights();
}

function rotateTile() {
    if (gameState.selectedTile === null) {
        console.log('❌ ROTATE: No tile selected');
        return;
    }
    console.log('🔄 ROTATE: Rotating tile', gameState.selectedTile, 'path configuration 90° clockwise');
    const tile = gameState.grid[gameState.selectedTile];
    console.log('🔄 Before rotation:', tile.arrows);
    
    // Rotate the directions 90 degrees clockwise
    tile.arrows = tile.arrows.map(dir => rotateDirection(dir));
    console.log('🔄 After rotation:', tile.arrows);
    
    // Re-render the tile
    renderTile(gameState.selectedTile);

    gameState.moves++;
    updateDisplay();
    clearPathHighlights();
}

function rotateDirection(direction) {
    const rotationMap = {
        [DIRECTIONS.UP]: DIRECTIONS.RIGHT,
        [DIRECTIONS.RIGHT]: DIRECTIONS.DOWN,
        [DIRECTIONS.DOWN]: DIRECTIONS.LEFT,
        [DIRECTIONS.LEFT]: DIRECTIONS.UP
    };
    return rotationMap[direction] || direction;
}

function arraysEqual(a, b) {
    if (a.length !== b.length) return false;
    const sortedA = [...a].sort();
    const sortedB = [...b].sort();
    return sortedA.every((val, i) => val === sortedB[i]);
}

function renderTile(index) {
    const tile = gameState.grid[index];
    const tileElement = document.querySelector(`[data-index="${index}"]`);
    
    // Clear existing classes and content
    tileElement.classList.remove('dir-up','dir-down','dir-left','dir-right', 'path-straight', 'path-corner', 'path-t_junction');
    
    // Add path type class
    if (tile.pathType) {
        tileElement.classList.add(`path-${tile.pathType}`);
    }
    
    // Add direction classes
    if (tile.arrows && tile.arrows.length > 0) {
        tile.arrows.forEach(dir => {
            tileElement.classList.add(`dir-${dir}`);
        });
    }
    
    // Re-render path container
    const pathContainer = tileElement.querySelector('.path-container');
    if (pathContainer) {
        pathContainer.innerHTML = '';
        
        // Draw all active direction strips
        if (tile.arrows && tile.arrows.length > 0) {
            tile.arrows.forEach(activeDir => {
                const pathStrip = document.createElement('div');
                pathStrip.className = `path-strip path-${activeDir}`;
                const arrowCount = tile.pathType === PATH_TYPES.T_JUNCTION ? 2 : 3;
                for (let i = 0; i < arrowCount; i++) {
                    const arrowIcon = document.createElement('div');
                    arrowIcon.className = `strip-arrow arrow-${activeDir}`;
                    pathStrip.appendChild(arrowIcon);
                }
                pathContainer.appendChild(pathStrip);
            });
        }
    }
}

// ===== PATH CHECKING (Follow arrows only, no diagonals) =====
function followPathFromStart() {
    const { rows, cols } = gameState.gridSize;
    const startIdx = gameState.startPos.row * cols + gameState.startPos.col;
    const endIdx = gameState.endPos.row * cols + gameState.endPos.col;
    
    // Use BFS to find path through multi-directional tiles
    const queue = [{index: startIdx, path: [startIdx]}];
    const visited = new Set([startIdx]);

    while (queue.length > 0) {
        const {index: current, path} = queue.shift();
        
        if (current === endIdx) return path;
        if (path.length > rows * cols + 1) continue; // safety

        const tile = gameState.grid[current];
        if (!tile || tile.type === TILE_TYPES.EMPTY || !tile.arrows || tile.arrows.length === 0) continue;
        
        const r = Math.floor(current / cols);
        const c = current % cols;
        
        // Try each direction the tile supports
        for (const dir of tile.arrows) {
            const [nr, nc] = getNextPosition(r, c, dir);
            if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
            
            const nextIdx = nr * cols + nc;
            if (visited.has(nextIdx)) continue;
            
            const nextTile = gameState.grid[nextIdx];
            if (!nextTile || nextTile.type === TILE_TYPES.EMPTY) continue;
            
            // Check if the next tile can accept connection from this direction
            const oppositeDir = getOppositeDirection(dir);
            if (!nextTile.arrows || !nextTile.arrows.includes(oppositeDir)) continue;
            
            visited.add(nextIdx);
            const newPath = [...path, nextIdx];
            queue.push({index: nextIdx, path: newPath});
        }
    }
    
    return null; // No path found
}

function getOppositeDirection(direction) {
    switch (direction) {
        case DIRECTIONS.UP: return DIRECTIONS.DOWN;
        case DIRECTIONS.DOWN: return DIRECTIONS.UP;
        case DIRECTIONS.LEFT: return DIRECTIONS.RIGHT;
        case DIRECTIONS.RIGHT: return DIRECTIONS.LEFT;
        default: return direction;
    }
}

function showPath() {
    cleanupDynamicElements(); // Clean up before showing new content
    clearPathHighlights();
    const path = followPathFromStart();
    if (!path) {
        showInvalidPathMessage();
        return;
    }
    
    // Highlight the found path in green
    applyPathToTiles(path, 'path-found');
    
    // Show success message with option to view matrix
    const message = document.createElement('div');
    message.className = 'path-found-message';
    message.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, rgba(0, 255, 136, 0.95), rgba(0, 217, 255, 0.95));
        color: white;
        padding: 30px 50px;
        border-radius: 15px;
        font-size: 20px;
        font-weight: bold;
        z-index: 2000;
        box-shadow: 0 0 30px rgba(0, 255, 136, 0.6);
        text-align: center;
    `;
    message.innerHTML = `
        ✅ Valid Path Found!<br>
        <small>Path length: ${path.length} tiles</small><br>
        <button onclick="showFoundPathMatrix(${JSON.stringify(path).replace(/"/g, '&quot;')}); this.parentElement.remove();" 
                style="margin-top: 10px; padding: 8px 16px; background: rgba(255,255,255,0.2); 
                       border: 2px solid white; border-radius: 5px; color: white; cursor: pointer;">
            View Path Matrix
        </button>
    `;
    document.body.appendChild(message);
    
    setTimeout(() => {
        if (message.parentNode) {
            message.remove();
        }
    }, 5000);
    
    // Check if this path reaches the end - if so, complete the level
    const { cols } = gameState.gridSize;
    const endIdx = gameState.endPos.row * cols + gameState.endPos.col;
    if (path[path.length - 1] === endIdx) {
        setTimeout(() => {
            stopTimer();
            showSuccessModal();
        }, 1500);
    }
}

// Global function for the button click
window.showFoundPathMatrix = function(pathArray) {
    showFoundSolutionMatrix(pathArray);
};

function showFoundSolutionMatrix(foundPath) {
    // Remove any existing solution modals first
    const existingModals = document.querySelectorAll('.modal.active');
    existingModals.forEach(modal => modal.remove());
    
    // Similar to optimal solution matrix but for found paths
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.style.zIndex = '3000';
    
    const { rows, cols } = gameState.gridSize;
    
    // Create visual matrix representation
    let matrixHTML = '<div class="solution-matrix">';
    for (let r = 0; r < rows; r++) {
        matrixHTML += '<div class="matrix-row">';
        for (let c = 0; c < cols; c++) {
            const idx = r * cols + c;
            const tile = gameState.grid[idx];
            const isOnPath = foundPath.includes(idx);
            const isStart = idx === (gameState.startPos.row * cols + gameState.startPos.col);
            const isEnd = idx === (gameState.endPos.row * cols + gameState.endPos.col);
            
            let cellClass = 'matrix-cell';
            let cellContent = '';
            
            if (tile.type === 'empty') {
                cellClass += ' empty-cell';
                cellContent = '⬛';
            } else {
                if (isOnPath) {
                    cellClass += ' found-path-cell';
                    // Show current arrows for found path
                    if (tile.arrows && tile.arrows.length > 0) {
                        const currentArrows = tile.arrows.map(dir => {
                            const arrowMap = { up: '↑', down: '↓', left: '←', right: '→' };
                            return arrowMap[dir] || '';
                        }).join('');
                        cellContent = currentArrows || '●';
                    } else {
                        cellContent = '●';
                    }
                } else {
                    cellClass += ' normal-cell';
                    // Show current tile configuration
                    if (tile.arrows && tile.arrows.length > 0) {
                        const currentArrows = tile.arrows.map(dir => {
                            const arrowMap = { up: '↑', down: '↓', left: '←', right: '→' };
                            return arrowMap[dir] || '';
                        }).join('');
                        cellContent = currentArrows || '○';
                    } else {
                        cellContent = '○';
                    }
                }
                
                if (isStart) {
                    cellContent = '🚀';
                    cellClass += ' start-cell';
                }
                if (isEnd) {
                    cellContent = '🌍';
                    cellClass += ' end-cell';
                }
            }
            
            matrixHTML += `<div class="${cellClass}" title="(${r},${c})">${cellContent}</div>`;
        }
        matrixHTML += '</div>';
    }
    matrixHTML += '</div>';
    
    modal.innerHTML = `
        <div class="modal-content solution-content">
            <button class="modal-close" onclick="this.parentElement.parentElement.remove()">&times;</button>
            <h2>✅ Found Path Matrix</h2>
            <div class="solution-info">
                <div class="info-row">
                    <span class="info-item">📏 <strong>Your Path Length:</strong> ${foundPath.length} tiles</span>
                    <span class="info-item">🎯 <strong>Current Moves:</strong> ${gameState.moves}</span>
                </div>
                <div class="legend">
                    <span class="legend-item"><span class="legend-icon found-path-cell">●</span> Your Path</span>
                    <span class="legend-item"><span class="legend-icon normal-cell">○</span> Other Tiles</span>
                    <span class="legend-item"><span class="legend-icon empty-cell">⬛</span> Empty</span>
                    <span class="legend-item">🚀 Start</span>
                    <span class="legend-item">🌍 End</span>
                </div>
            </div>
            ${matrixHTML}
            <div class="path-sequence">
                <h3>📍 Your Path Steps:</h3>
                <div class="path-steps">
                    ${foundPath.map((idx, step) => {
                        const r = Math.floor(idx / cols);
                        const c = idx % cols;
                        return `<span class="step">${step + 1}. (${r},${c})</span>`;
                    }).join(' → ')}
                </div>
            </div>
            <button class="close-solution-btn" onclick="this.parentElement.parentElement.remove()">Close Path View</button>
            <div class="modal-watermark">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor"/>
                    <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2"/>
                </svg>
                <span>Created by Adi51244</span>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add click outside to close
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// rotation helpers removed in v2.1

function getNextPosition(row, col, direction) {
    switch (direction) {
        case DIRECTIONS.UP: return [row - 1, col];
        case DIRECTIONS.DOWN: return [row + 1, col];
        case DIRECTIONS.LEFT: return [row, col - 1];
        case DIRECTIONS.RIGHT: return [row, col + 1];
        default: return [row, col];
    }
}

function showInvalidPathMessage() {
    cleanupDynamicElements(); // Clean up before showing new message
    // Create temporary message
    const message = document.createElement('div');
    message.className = 'floating-message';
    message.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, rgba(255, 68, 68, 0.95), rgba(255, 165, 0, 0.95));
        color: white;
        padding: 30px 50px;
        border-radius: 15px;
        font-size: 20px;
        font-weight: bold;
        z-index: 2000;
        box-shadow: 0 0 30px rgba(255, 68, 68, 0.6);
        animation: shake 0.5s ease;
    `;
    message.textContent = '❌ Invalid Path! Try Again';
    document.body.appendChild(message);

    setTimeout(() => {
        message.remove();
    }, 2000);
}

// ===== PATH VISUALIZATION (tile-based) =====
function clearPathHighlights() {
    document.querySelectorAll('.tile.path-on').forEach(t => t.classList.remove('path-on'));
    document.querySelectorAll('.tile.path-found').forEach(t => t.classList.remove('path-found'));
    document.querySelectorAll('.tile.optimal-path').forEach(t => t.classList.remove('optimal-path'));
}

function applyPathToTiles(pathIndices, className = 'path-on') {
    const { cols } = gameState.gridSize;
    // Highlight path tiles
    for (let i = 0; i < pathIndices.length; i++) {
        const idx = pathIndices[i];
        const tile = gameState.grid[idx];
        const el = document.querySelector(`[data-index="${idx}"]`);
        if (!tile || !el) continue;
        el.classList.add(className);
        
        // For path visualization, determine required directions
        const requiredDirections = [];
        
        // Direction to previous tile
        if (i > 0) {
            const prevIdx = pathIndices[i - 1];
            const r = Math.floor(idx / cols), c = idx % cols;
            const pr = Math.floor(prevIdx / cols), pc = prevIdx % cols;
            if (pr < r) requiredDirections.push(DIRECTIONS.UP);
            else if (pr > r) requiredDirections.push(DIRECTIONS.DOWN);
            else if (pc < c) requiredDirections.push(DIRECTIONS.LEFT);
            else if (pc > c) requiredDirections.push(DIRECTIONS.RIGHT);
        }
        
        // Direction to next tile
        if (i < pathIndices.length - 1) {
            const nextIdx = pathIndices[i + 1];
            const r = Math.floor(idx / cols), c = idx % cols;
            const nr = Math.floor(nextIdx / cols), nc = nextIdx % cols;
            if (nr < r) requiredDirections.push(DIRECTIONS.UP);
            else if (nr > r) requiredDirections.push(DIRECTIONS.DOWN);
            else if (nc < c) requiredDirections.push(DIRECTIONS.LEFT);
            else if (nc > c) requiredDirections.push(DIRECTIONS.RIGHT);
        }
        
        // Update tile to have the required directions
        if (requiredDirections.length > 0) {
            // Find appropriate path config or create minimal one
            let bestConfig = null;
            for (const [key, config] of Object.entries(PATH_CONFIGS)) {
                if (requiredDirections.every(dir => config.directions.includes(dir))) {
                    if (!bestConfig || config.directions.length < bestConfig.directions.length) {
                        bestConfig = config;
                    }
                }
            }
            
            if (bestConfig) {
                tile.pathType = bestConfig.type;
                tile.arrows = bestConfig.directions.slice();
            } else {
                // Fallback to simple path
                tile.pathType = PATH_TYPES.STRAIGHT;
                tile.arrows = [requiredDirections[0] || DIRECTIONS.RIGHT];
            }
            
            // Re-render the tile
            renderTile(idx);
        }
    }
}

// ===== GAME TIMER =====
function startGame() {
    if (gameState.gameStarted) return;
    
    gameState.gameStarted = true;
    gameState.timeRemaining = gameState.timeLimit;
    gameState.showAnswerAllowed = false;
    
    gameState.timerInterval = setInterval(() => {
        gameState.timeRemaining--;
        updateTimerDisplay();
        
        // Enable "Show Answer" button after half time
        if (gameState.timeRemaining <= Math.floor(gameState.timeLimit / 2) && !gameState.showAnswerAllowed) {
            gameState.showAnswerAllowed = true;
            updateShowAnswerButton();
        }
        
        if (gameState.timeRemaining <= 0) {
            stopTimer();
            showOptimalPathOnTimeout();
            showGameOverModal();
        }
    }, 1000);
}

function stopTimer() {
    if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
        gameState.timerInterval = null;
    }
}

function updateTimerDisplay() {
    const minutes = Math.floor(gameState.timeRemaining / 60);
    const seconds = gameState.timeRemaining % 60;
    document.getElementById('timerDisplay').textContent = 
        `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// ===== SCORING =====
function calculateScore() {
    const baseScore = 1000;
    const moveEfficiency = Math.max(0, 1 - (gameState.moves - gameState.optimalMoves) / gameState.optimalMoves);
    const timeEfficiency = gameState.timeRemaining / gameState.timeLimit;
    
    const moveBonus = Math.floor(baseScore * moveEfficiency * 0.5);
    const timeBonus = Math.floor(baseScore * timeEfficiency * 0.3);
    
    let perfectBonus = 0;
    if (gameState.moves === gameState.optimalMoves) {
        perfectBonus = 500;
    }
    
    const levelScore = baseScore + moveBonus + timeBonus + perfectBonus;
    gameState.score += levelScore;
    
    return levelScore;
}

function getRating() {
    const efficiency = gameState.optimalMoves / gameState.moves;
    
    if (efficiency >= 0.9) return '⭐⭐⭐';
    if (efficiency >= 0.7) return '⭐⭐';
    return '⭐';
}

// ===== LEVEL MANAGEMENT =====
function resetLevel() {
    stopTimer();
    gameState.gameStarted = false;
    loadLevel(gameState.currentLevel);
}

function nextLevel() {
    cleanupDynamicElements(); // Clean up before transition
    hideSuccessModal();
    stopTimer();
    gameState.gameStarted = false;
    
    // Check if already at max level
    if (gameState.currentLevel >= levels.length) {
        showGameCompleteModal();
        return;
    }
    
    gameState.currentLevel++;
    
    if (gameState.currentLevel > levels.length) {
        showGameCompleteModal();
    } else {
        // Show level transition message
        const message = document.createElement('div');
        message.className = 'message-overlay';
        message.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, rgba(0, 255, 136, 0.95), rgba(0, 217, 255, 0.95));
            color: white;
            padding: 30px 50px;
            border-radius: 15px;
            font-size: 24px;
            font-weight: bold;
            z-index: 2000;
            box-shadow: 0 0 30px rgba(0, 255, 136, 0.6);
            text-align: center;
        `;
        message.innerHTML = `🚀 Advancing to Level ${gameState.currentLevel}!`;
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.remove();
        }, 2000);
        
        loadLevel(gameState.currentLevel);
    }
}

// ===== DISPLAY UPDATES =====
function updateDisplay() {
    document.getElementById('levelDisplay').textContent = gameState.currentLevel;
    document.getElementById('movesDisplay').textContent = gameState.moves;
    document.getElementById('optimalMoves').textContent = gameState.optimalMoves;
    document.getElementById('scoreDisplay').textContent = gameState.score;
    updateTimerDisplay();
    
    // Update next level button state
    const nextLevelBtn = document.getElementById('nextLevelBtn');
    if (nextLevelBtn) {
        nextLevelBtn.disabled = gameState.currentLevel >= levels.length;
        if (gameState.currentLevel >= levels.length) {
            nextLevelBtn.querySelector('span').textContent = 'Max Level';
        } else {
            nextLevelBtn.querySelector('span').textContent = 'Next Level';
        }
    }
}

// ===== MODAL FUNCTIONS =====
function showRulesModal() {
    document.getElementById('rulesModal').classList.add('active');
}

function hideRulesModal() {
    document.getElementById('rulesModal').classList.remove('active');
}

function showSuccessModal() {
    const levelScore = calculateScore();
    document.getElementById('finalMoves').textContent = gameState.moves;
    document.getElementById('finalOptimal').textContent = gameState.optimalMoves;
    document.getElementById('levelScore').textContent = levelScore;
    document.getElementById('ratingStars').textContent = getRating();
    document.getElementById('successModal').classList.add('active');
}

function hideSuccessModal() {
    document.getElementById('successModal').classList.remove('active');
}

function showOptimalPathOnTimeout() {
    cleanupDynamicElements(); // Clean up before showing timeout content
    // Clear any existing highlights
    clearPathHighlights();
    
    // Compute and show the optimal path
    const optimalPath = bfsManhattanShortestPath();
    if (optimalPath) {
        // Apply optimal path configuration
        applyPathToTiles(optimalPath, 'optimal-path');
        
        // Show the complete solution matrix after a brief delay
        setTimeout(() => {
            showOptimalSolutionMatrix(optimalPath);
        }, 1500);
        
        // Show brief timeout message
        const message = document.createElement('div');
        message.className = 'success-message';
        message.style.cssText = `
            position: fixed;
            top: 30%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, rgba(255, 215, 0, 0.95), rgba(255, 165, 0, 0.95));
            color: white;
            padding: 30px 50px;
            border-radius: 15px;
            font-size: 20px;
            font-weight: bold;
            z-index: 1500;
            box-shadow: 0 0 40px rgba(255, 215, 0, 0.8);
            text-align: center;
        `;
        message.innerHTML = `⏰ Time's Up!<br>🏆 Opening Solution Matrix...`;
        document.body.appendChild(message);
        
        setTimeout(() => {
            if (message.parentNode) {
                message.remove();
            }
        }, 2000);
    }
}

function showGameOverModal() {
    // Delay showing the modal slightly to let the optimal path display first
    setTimeout(() => {
        document.getElementById('gameOverModal').classList.add('active');
    }, 1000);
}

function hideGameOverModal() {
    document.getElementById('gameOverModal').classList.remove('active');
}

function showGameCompleteModal() {
    // Remove any existing modals first
    const existingModals = document.querySelectorAll('.modal.active');
    existingModals.forEach(modal => modal.remove());
    
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content success-content">
            <div class="success-icon">🏆</div>
            <h2>Game Complete!</h2>
            <p style="color: var(--text-gray); margin: 20px 0;">
                Congratulations! You've completed all levels!
            </p>
            <div class="success-stats">
                <div class="stat-item">
                    <span class="stat-label">Total Score</span>
                    <span class="stat-value score-value">${gameState.score}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Levels Completed</span>
                    <span class="stat-value">${levels.length}</span>
                </div>
            </div>
            <button class="next-level-btn" onclick="location.reload()">Play Again</button>
        </div>
    `;
    document.body.appendChild(modal);
}

// ===== SHOW ANSWER FUNCTIONALITY =====
function updateShowAnswerButton() {
    const showAnswerBtn = document.getElementById('showAnswerBtn');
    if (showAnswerBtn) {
        if (gameState.showAnswerAllowed) {
            showAnswerBtn.disabled = false;
            showAnswerBtn.classList.add('enabled');
        } else {
            showAnswerBtn.disabled = true;
            showAnswerBtn.classList.remove('enabled');
        }
    }
}

function showAnswer() {
    if (!gameState.showAnswerAllowed) return;

    // Compute optimal Manhattan shortest path ignoring current arrows
    const path = bfsManhattanShortestPath();
    clearPathHighlights();
    if (path) {
        applyPathToTiles(path, 'optimal-path'); // color golden per CSS
        showOptimalSolutionMatrix(path);
    }
}

function showOptimalSolutionMatrix(optimalPath) {
    // Remove any existing solution modals first
    const existingModals = document.querySelectorAll('.modal.active');
    existingModals.forEach(modal => modal.remove());
    
    // Create modal with complete solution matrix
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.style.zIndex = '3000';
    
    const { rows, cols } = gameState.gridSize;
    
    // Create visual matrix representation
    let matrixHTML = '<div class="solution-matrix">';
    for (let r = 0; r < rows; r++) {
        matrixHTML += '<div class="matrix-row">';
        for (let c = 0; c < cols; c++) {
            const idx = r * cols + c;
            const tile = gameState.grid[idx];
            const isOnPath = optimalPath.includes(idx);
            const isStart = idx === (gameState.startPos.row * cols + gameState.startPos.col);
            const isEnd = idx === (gameState.endPos.row * cols + gameState.endPos.col);
            
            let cellClass = 'matrix-cell';
            let cellContent = '';
            let pathArrows = '';
            
            if (tile.type === 'empty') {
                cellClass += ' empty-cell';
                cellContent = '⬛';
            } else {
                if (isOnPath) {
                    cellClass += ' path-cell';
                    // Show the arrows that should be on this tile for optimal path
                    const requiredDirections = getRequiredDirectionsForTile(idx, optimalPath, rows, cols);
                    pathArrows = requiredDirections.map(dir => {
                        const arrowMap = { up: '↑', down: '↓', left: '←', right: '→' };
                        return arrowMap[dir] || '';
                    }).join('');
                    cellContent = pathArrows || '●';
                } else {
                    cellClass += ' normal-cell';
                    // Show current tile configuration
                    if (tile.arrows && tile.arrows.length > 0) {
                        const currentArrows = tile.arrows.map(dir => {
                            const arrowMap = { up: '↑', down: '↓', left: '←', right: '→' };
                            return arrowMap[dir] || '';
                        }).join('');
                        cellContent = currentArrows || '○';
                    } else {
                        cellContent = '○';
                    }
                }
                
                if (isStart) {
                    cellContent = '🚀';
                    cellClass += ' start-cell';
                }
                if (isEnd) {
                    cellContent = '🌍';
                    cellClass += ' end-cell';
                }
            }
            
            matrixHTML += `<div class="${cellClass}" title="(${r},${c})">${cellContent}</div>`;
        }
        matrixHTML += '</div>';
    }
    matrixHTML += '</div>';
    
    modal.innerHTML = `
        <div class="modal-content solution-content">
            <button class="modal-close" onclick="this.parentElement.parentElement.remove()">&times;</button>
            <h2>🏆 Optimal Solution Matrix</h2>
            <div class="solution-info">
                <div class="info-row">
                    <span class="info-item">📏 <strong>Path Length:</strong> ${optimalPath.length} tiles</span>
                    <span class="info-item">🎯 <strong>Optimal Moves:</strong> ${gameState.optimalMoves}</span>
                </div>
                <div class="legend">
                    <span class="legend-item"><span class="legend-icon path-cell">●</span> Optimal Path</span>
                    <span class="legend-item"><span class="legend-icon normal-cell">○</span> Current Tiles</span>
                    <span class="legend-item"><span class="legend-icon empty-cell">⬛</span> Empty</span>
                    <span class="legend-item">🚀 Start</span>
                    <span class="legend-item">🌍 End</span>
                </div>
            </div>
            ${matrixHTML}
            <div class="path-sequence">
                <h3>📍 Step-by-Step Path:</h3>
                <div class="path-steps">
                    ${optimalPath.map((idx, step) => {
                        const r = Math.floor(idx / cols);
                        const c = idx % cols;
                        return `<span class="step">${step + 1}. (${r},${c})</span>`;
                    }).join(' → ')}
                </div>
            </div>
            <button class="close-solution-btn" onclick="this.parentElement.parentElement.remove()">Close Solution</button>
            <div class="modal-watermark">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor"/>
                    <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2"/>
                </svg>
                <span>Created by Adi51244</span>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add click outside to close
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

function getRequiredDirectionsForTile(tileIndex, path, rows, cols) {
    const directions = [];
    const pathPos = path.indexOf(tileIndex);
    
    if (pathPos === -1) return directions; // Not on path
    
    const r = Math.floor(tileIndex / cols);
    const c = tileIndex % cols;
    
    // Direction from previous tile
    if (pathPos > 0) {
        const prevIdx = path[pathPos - 1];
        const pr = Math.floor(prevIdx / cols);
        const pc = prevIdx % cols;
        
        if (pr < r) directions.push('down'); // Previous was above, so arrow points down to current
        else if (pr > r) directions.push('up'); // Previous was below, so arrow points up to current
        else if (pc < c) directions.push('right'); // Previous was left, so arrow points right to current
        else if (pc > c) directions.push('left'); // Previous was right, so arrow points left to current
    }
    
    // Direction to next tile
    if (pathPos < path.length - 1) {
        const nextIdx = path[pathPos + 1];
        const nr = Math.floor(nextIdx / cols);
        const nc = nextIdx % cols;
        
        if (nr < r) directions.push('up'); // Next is above, so arrow points up
        else if (nr > r) directions.push('down'); // Next is below, so arrow points down
        else if (nc < c) directions.push('left'); // Next is left, so arrow points left
        else if (nc > c) directions.push('right'); // Next is right, so arrow points right
    }
    
    return [...new Set(directions)]; // Remove duplicates
}

// Manhattan BFS ignoring arrows
function bfsManhattanShortestPath() {
    const { rows, cols } = gameState.gridSize;
    const startIdx = gameState.startPos.row * cols + gameState.startPos.col;
    const endIdx = gameState.endPos.row * cols + gameState.endPos.col;
    const queue = [startIdx];
    const prev = new Map();
    const visited = new Set([startIdx]);
    const deltas = [DIRECTIONS.UP, DIRECTIONS.RIGHT, DIRECTIONS.DOWN, DIRECTIONS.LEFT];

    const within = (r, c) => r >= 0 && r < rows && c >= 0 && c < cols;
    while (queue.length) {
        const cur = queue.shift();
        if (cur === endIdx) break;
        const r = Math.floor(cur / cols), c = cur % cols;
        for (const d of deltas) {
            const [nr, nc] = getNextPosition(r, c, d);
            if (!within(nr, nc)) continue;
            const nIdx = nr * cols + nc;
            if (visited.has(nIdx)) continue;
            const tile = gameState.grid[nIdx];
            if (!tile || tile.type === TILE_TYPES.EMPTY) continue;
            visited.add(nIdx);
            prev.set(nIdx, cur);
            queue.push(nIdx);
        }
    }
    if (startIdx !== endIdx && !prev.has(endIdx)) return null;
    const path = [endIdx];
    let at = endIdx;
    while (at !== startIdx) {
        at = prev.get(at);
        if (at === undefined) return null;
        path.push(at);
    }
    path.reverse();
    return path;
}

// ===== KEYBOARD SHORTCUTS =====
document.addEventListener('keydown', (e) => {
    // Don't interfere with modal inputs or if game hasn't started
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if (!gameState.gameStarted) return;
    
    switch (e.key) {
        case 'r':
        case 'R':
            e.preventDefault();
            if (gameState.selectedTile !== null) rotateTile();
            break;
        case 'a':
        case 'A':
            e.preventDefault();
            if (gameState.selectedTile !== null) changeArrowDirection();
            break;
        case 'Enter':
        case ' ':
            e.preventDefault();
            showPath();
            break;
        case 'n':
        case 'N':
            e.preventDefault();
            // Next level
            stopTimer();
            gameState.gameStarted = false;
            nextLevel();
            break;
        case 'Escape':
            e.preventDefault();
            if (gameState.selectedTile !== null) {
                document.querySelector(`[data-index="${gameState.selectedTile}"]`).classList.remove('selected');
                gameState.selectedTile = null;
                updateControlButtons(false);
            }
            break;
    }
});

// ===== MOBILE TOUCH IMPROVEMENTS =====
function addTouchFeedback(element) {
    element.addEventListener('touchstart', () => {
        element.style.transform = 'scale(0.95)';
    });
    
    element.addEventListener('touchend', () => {
        setTimeout(() => {
            element.style.transform = '';
        }, 100);
    });
    
    element.addEventListener('touchcancel', () => {
        element.style.transform = '';
    });
}

// Apply touch feedback to interactive elements
function initializeTouchFeedback() {
    // Add to control buttons
    document.querySelectorAll('.control-btn').forEach(addTouchFeedback);
    
    // Add to tiles (will be called when tiles are created)
    // This is handled in createTileElement function
}

// ===== MOBILE ORIENTATION HANDLER =====
function handleOrientationChange() {
    // Force layout recalculation after orientation change
    setTimeout(() => {
        renderGrid();
        updateDisplay();
    }, 100);
}

window.addEventListener('orientationchange', handleOrientationChange);
window.addEventListener('resize', handleOrientationChange);
