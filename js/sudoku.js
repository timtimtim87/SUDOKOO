/**
 * SUDOKOO Game Engine
 * Core Sudoku logic, validation, and solving algorithms
 */

class SudokuEngine {
    constructor() {
        this.grid = Array(9).fill().map(() => Array(9).fill(0));
        this.solution = Array(9).fill().map(() => Array(9).fill(0));
        this.initialGrid = Array(9).fill().map(() => Array(9).fill(0));
        this.pencilMarks = Array(9).fill().map(() => Array(9).fill().map(() => new Set()));
    }

    /**
     * Initialize the game with a puzzle
     */
    init(puzzle, solution = null) {
        this.grid = this.deepCopy(puzzle);
        this.initialGrid = this.deepCopy(puzzle);
        this.solution = solution ? this.deepCopy(solution) : this.solvePuzzle(this.deepCopy(puzzle));
        this.clearPencilMarks();
        return true;
    }

    /**
     * Create a deep copy of a 2D array
     */
    deepCopy(grid) {
        return grid.map(row => [...row]);
    }

    /**
     * Check if a number is valid at the given position
     */
    isValidMove(row, col, num) {
        // Check if cell is already filled with a given number
        if (this.initialGrid[row][col] !== 0) {
            return false;
        }

        // Check row
        for (let x = 0; x < 9; x++) {
            if (x !== col && this.grid[row][x] === num) {
                return false;
            }
        }

        // Check column
        for (let x = 0; x < 9; x++) {
            if (x !== row && this.grid[x][col] === num) {
                return false;
            }
        }

        // Check 3x3 box
        const boxRow = Math.floor(row / 3) * 3;
        const boxCol = Math.floor(col / 3) * 3;
        
        for (let i = boxRow; i < boxRow + 3; i++) {
            for (let j = boxCol; j < boxCol + 3; j++) {
                if ((i !== row || j !== col) && this.grid[i][j] === num) {
                    return false;
                }
            }
        }

        return true;
    }

    /**
     * Place a number on the grid
     */
    placeNumber(row, col, num) {
        if (this.initialGrid[row][col] !== 0) {
            return { success: false, error: 'Cannot modify given numbers' };
        }

        if (num === 0) {
            // Clear the cell
            this.grid[row][col] = 0;
            return { success: true, error: null };
        }

        if (this.isValidMove(row, col, num)) {
            this.grid[row][col] = num;
            this.clearPencilMarksForCell(row, col);
            this.updatePencilMarks(row, col, num);
            return { success: true, error: null };
        } else {
            return { success: false, error: 'Invalid move' };
        }
    }

    /**
     * Get all cells that conflict with the current placement
     */
    getConflictingCells(row, col, num) {
        const conflicts = [];
        
        if (this.grid[row][col] === 0 || this.grid[row][col] !== num) {
            return conflicts;
        }

        // Check row conflicts
        for (let x = 0; x < 9; x++) {
            if (x !== col && this.grid[row][x] === num) {
                conflicts.push({ row, col: x });
            }
        }

        // Check column conflicts
        for (let x = 0; x < 9; x++) {
            if (x !== row && this.grid[x][col] === num) {
                conflicts.push({ row: x, col });
            }
        }

        // Check 3x3 box conflicts
        const boxRow = Math.floor(row / 3) * 3;
        const boxCol = Math.floor(col / 3) * 3;
        
        for (let i = boxRow; i < boxRow + 3; i++) {
            for (let j = boxCol; j < boxCol + 3; j++) {
                if ((i !== row || j !== col) && this.grid[i][j] === num) {
                    conflicts.push({ row: i, col: j });
                }
            }
        }

        return conflicts;
    }

    /**
     * Get all cells with the same number as the selected cell
     */
    getHighlightedCells(row, col) {
        const highlighted = [];
        const num = this.grid[row][col];
        
        if (num === 0) return highlighted;

        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (this.grid[i][j] === num) {
                    highlighted.push({ row: i, col: j });
                }
            }
        }

        return highlighted;
    }

    /**
     * Check if the puzzle is completely solved
     */
    isSolved() {
        // Check if all cells are filled
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (this.grid[row][col] === 0) {
                    return false;
                }
            }
        }

        // Check if the solution is valid
        return this.isValidSolution();
    }

    /**
     * Validate the current grid state
     */
    isValidSolution() {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                const num = this.grid[row][col];
                if (num !== 0) {
                    // Temporarily clear the cell to check if placement is valid
                    this.grid[row][col] = 0;
                    const isValid = this.isValidMove(row, col, num);
                    this.grid[row][col] = num;
                    
                    if (!isValid) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    /**
     * Get the progress of the current game (filled cells)
     */
    getProgress() {
        let filledCells = 0;
        let totalCells = 81;
        
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (this.grid[row][col] !== 0) {
                    filledCells++;
                }
            }
        }
        
        return { filled: filledCells, total: totalCells, percentage: Math.round((filledCells / totalCells) * 100) };
    }

    /**
     * Get a hint for the current state
     */
    getHint() {
        const emptyCells = [];
        
        // Find all empty cells
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (this.grid[row][col] === 0) {
                    emptyCells.push({ row, col });
                }
            }
        }
        
        if (emptyCells.length === 0) {
            return null; // No empty cells
        }
        
        // Find a cell with only one possible value
        for (const cell of emptyCells) {
            const possibleValues = this.getPossibleValues(cell.row, cell.col);
            if (possibleValues.length === 1) {
                return {
                    row: cell.row,
                    col: cell.col,
                    value: possibleValues[0],
                    reason: 'Only one possible value'
                };
            }
        }
        
        // Return a random empty cell with its correct value
        const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        return {
            row: randomCell.row,
            col: randomCell.col,
            value: this.solution[randomCell.row][randomCell.col],
            reason: 'Random hint'
        };
    }

    /**
     * Get all possible values for a cell
     */
    getPossibleValues(row, col) {
        if (this.grid[row][col] !== 0) {
            return [];
        }
        
        const possible = [];
        for (let num = 1; num <= 9; num++) {
            if (this.isValidMove(row, col, num)) {
                possible.push(num);
            }
        }
        return possible;
    }

    /**
     * Pencil marks management
     */
    addPencilMark(row, col, num) {
        if (this.grid[row][col] === 0) {
            this.pencilMarks[row][col].add(num);
            return true;
        }
        return false;
    }

    removePencilMark(row, col, num) {
        this.pencilMarks[row][col].delete(num);
        return true;
    }

    togglePencilMark(row, col, num) {
        if (this.pencilMarks[row][col].has(num)) {
            this.removePencilMark(row, col, num);
            return false;
        } else {
            this.addPencilMark(row, col, num);
            return true;
        }
    }

    getPencilMarks(row, col) {
        return Array.from(this.pencilMarks[row][col]).sort();
    }

    clearPencilMarksForCell(row, col) {
        this.pencilMarks[row][col].clear();
    }

    clearPencilMarks() {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                this.pencilMarks[row][col].clear();
            }
        }
    }

    /**
     * Update pencil marks when a number is placed
     */
    updatePencilMarks(row, col, num) {
        // Remove the number from pencil marks in the same row
        for (let x = 0; x < 9; x++) {
            this.removePencilMark(row, x, num);
        }

        // Remove the number from pencil marks in the same column
        for (let x = 0; x < 9; x++) {
            this.removePencilMark(x, col, num);
        }

        // Remove the number from pencil marks in the same 3x3 box
        const boxRow = Math.floor(row / 3) * 3;
        const boxCol = Math.floor(col / 3) * 3;
        
        for (let i = boxRow; i < boxRow + 3; i++) {
            for (let j = boxCol; j < boxCol + 3; j++) {
                this.removePencilMark(i, j, num);
            }
        }
    }

    /**
     * Auto-fill obvious pencil marks
     */
    autoFillPencilMarks() {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (this.grid[row][col] === 0) {
                    this.pencilMarks[row][col].clear();
                    const possible = this.getPossibleValues(row, col);
                    for (const num of possible) {
                        this.pencilMarks[row][col].add(num);
                    }
                }
            }
        }
    }

    /**
     * Reset the grid to the initial state
     */
    reset() {
        this.grid = this.deepCopy(this.initialGrid);
        this.clearPencilMarks();
    }

    /**
     * Solve the puzzle using backtracking algorithm
     */
    solvePuzzle(grid) {
        const solution = this.deepCopy(grid);
        
        if (this.solveRecursive(solution)) {
            return solution;
        }
        
        return null;
    }

    /**
     * Recursive backtracking solver
     */
    solveRecursive(grid) {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (grid[row][col] === 0) {
                    for (let num = 1; num <= 9; num++) {
                        if (this.isValidMoveForGrid(grid, row, col, num)) {
                            grid[row][col] = num;
                            
                            if (this.solveRecursive(grid)) {
                                return true;
                            }
                            
                            grid[row][col] = 0;
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    }

    /**
     * Check if a move is valid on a specific grid (for solving)
     */
    isValidMoveForGrid(grid, row, col, num) {
        // Check row
        for (let x = 0; x < 9; x++) {
            if (grid[row][x] === num) {
                return false;
            }
        }

        // Check column
        for (let x = 0; x < 9; x++) {
            if (grid[x][col] === num) {
                return false;
            }
        }

        // Check 3x3 box
        const boxRow = Math.floor(row / 3) * 3;
        const boxCol = Math.floor(col / 3) * 3;
        
        for (let i = boxRow; i < boxRow + 3; i++) {
            for (let j = boxCol; j < boxCol + 3; j++) {
                if (grid[i][j] === num) {
                    return false;
                }
            }
        }

        return true;
    }

    /**
     * Check if a move matches the solution
     */
    isCorrectMove(row, col, num) {
        return this.solution && this.solution[row][col] === num;
    }

    /**
     * Get the current grid state
     */
    getGrid() {
        return this.deepCopy(this.grid);
    }

    /**
     * Get the solution grid
     */
    getSolution() {
        return this.deepCopy(this.solution);
    }

    /**
     * Get the initial grid state
     */
    getInitialGrid() {
        return this.deepCopy(this.initialGrid);
    }

    /**
     * Check if a cell was given in the original puzzle
     */
    isGivenCell(row, col) {
        return this.initialGrid[row][col] !== 0;
    }

    /**
     * Get game statistics
     */
    getStats() {
        const progress = this.getProgress();
        const emptyCells = [];
        const userMoves = [];
        
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (this.grid[row][col] === 0) {
                    emptyCells.push({ row, col });
                } else if (!this.isGivenCell(row, col)) {
                    userMoves.push({ row, col, value: this.grid[row][col] });
                }
            }
        }
        
        return {
            progress,
            emptyCells: emptyCells.length,
            userMoves: userMoves.length,
            totalPencilMarks: this.getTotalPencilMarks(),
            isValid: this.isValidSolution()
        };
    }

    /**
     * Get total number of pencil marks
     */
    getTotalPencilMarks() {
        let total = 0;
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                total += this.pencilMarks[row][col].size;
            }
        }
        return total;
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SudokuEngine;
} else {
    // Make available globally in browser
    window.SudokuEngine = SudokuEngine;
}