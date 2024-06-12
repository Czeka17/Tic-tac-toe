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

export function checkWinner(player: string, board: string[][]): boolean {
  for (let i = 0; i < 3; i++) {
    if (board[i][0] === player && board[i][1] === player && board[i][2] === player) return true;
    if (board[0][i] === player && board[1][i] === player && board[2][i] === player) return true;
  }
  if (board[0][0] === player && board[1][1] === player && board[2][2] === player) return true;
  if (board[0][2] === player && board[1][1] === player && board[2][0] === player) return true;
  return false;
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

export function makeBestMove(board: string[][]): Move | null {
  let bestMove: Move | null = null;
  let bestScore = -Infinity;

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
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
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
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
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
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
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
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
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
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
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
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
