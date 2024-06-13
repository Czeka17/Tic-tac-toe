export const EMPTY = '';
export const PLAYER = 'X';
export const BOT = 'O';

export interface Move {
  row: number;
  col: number;
}

export function click(
  row: number,
  col: number,
  turn: boolean,
  board: string[][],
  setBoard: React.Dispatch<React.SetStateAction<string[][]>>,
  setXturn: React.Dispatch<React.SetStateAction<boolean>>,
  winner: string
) {
  if (board[row][col] === '' && winner === '') {
    const newBoard = [...board];
    if (turn) {
      newBoard[row][col] = 'X';
      setXturn(false);
    } else {
      newBoard[row][col] = 'O';
      setXturn(true);
    }
    setBoard(newBoard);
  } else if (winner !== '') {
    console.log('Game is ended');
  } else {
    console.log('you can\'t do that');
  }
}

export function checkWinner(player: string, board: string[][]): number {
  let points = 0;

  const checkLine = (a: string, b: string, c: string): boolean => {
    return a === player && b === player && c === player;
  };
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col <= board[row].length - 3; col++) {
      if (checkLine(board[row][col], board[row][col + 1], board[row][col + 2])) {
        points++;
      }
    }
  }

  for (let col = 0; col < board[0].length; col++) {
    for (let row = 0; row <= board.length - 3; row++) {
      if (checkLine(board[row][col], board[row + 1][col], board[row + 2][col])) {
        points++;
      }
    }
  }

  for (let row = 0; row <= board.length - 3; row++) {
    for (let col = 0; col <= board[row].length - 3; col++) {
      if (checkLine(board[row][col], board[row + 1][col + 1], board[row + 2][col + 2])) {
        points++;
      }
      if (checkLine(board[row][col + 2], board[row + 1][col + 1], board[row + 2][col])) {
        points++;
      }
    }
  }

  return points;
}


export function isBoardFull(board: string[][]): boolean {
  for (let row of board) {
    for (let cell of row) {
      if (cell === '') {
        return false;
      }
    }
  }
  return true;
}
export function expandBoard(oldBoard: string[][]): string[][] {
  const oldSize = oldBoard.length;
  const newSize = oldSize + 2;
  const newBoard = Array(newSize).fill('').map(() => Array(newSize).fill(''));

  for (let i = 0; i < oldSize; i++) {
    for (let j = 0; j < oldSize; j++) {
      newBoard[i + 1][j + 1] = oldBoard[i][j];
    }
  }

  console.log('expand!');
  return newBoard;
}


export function makeBestMove(board: string[][]): Move | null {
  let bestMove: Move | null = null;
  let bestScore = -Infinity;

  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      if (board[i][j] === EMPTY) {
        board[i][j] = BOT;
        let score = minimax(board, 0, false);
        board[i][j] = EMPTY;

        if (score > bestScore) {
          bestScore = score;
          bestMove = { row: i, col: j };
        }
      }
    }
  }
  return bestMove;
}

function minimax(board: string[][], depth: number, isMaximizing: boolean): number {
  if (checkWinner(BOT, board)) {
    return 10 - depth;
  } else if (checkWinner(PLAYER, board)) {
    return depth - 10;
  } else if (isBoardFull(board)) {
    return 0;
  }

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        if (board[i][j] === EMPTY) {
          board[i][j] = BOT;
          bestScore = Math.max(bestScore, minimax(board, depth + 1, false));
          board[i][j] = EMPTY;
        }
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        if (board[i][j] === EMPTY) {
          board[i][j] = PLAYER;
          bestScore = Math.min(bestScore, minimax(board, depth + 1, true));
          board[i][j] = EMPTY;
        }
      }
    }
    return bestScore;
  }
}

export function makeEasyMove(board: string[][]): Move | null {
  const emptyCells: Move[] = [];
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      if (board[i][j] === EMPTY) {
        emptyCells.push({ row: i, col: j });
      }
    }
  }
  if (emptyCells.length > 0) {
    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    return emptyCells[randomIndex];
  } else {
    return null;
  }
}

export function makeMediumMove(board: string[][], player: string): Move | null {
  const opponent = (player === BOT) ? PLAYER : BOT;
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      if (board[i][j] === EMPTY) {
        board[i][j] = player;
        if (checkWinner(player, board)) {
          board[i][j] = EMPTY;
          return { row: i, col: j };
        }
        board[i][j] = EMPTY;
      }
    }
  }
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      if (board[i][j] === EMPTY) {
        board[i][j] = opponent;
        if (checkWinner(opponent, board)) {
          board[i][j] = EMPTY;
          return { row: i, col: j };
        }
        board[i][j] = EMPTY;
      }
    }
  }
  return makeEasyMove(board);
}
