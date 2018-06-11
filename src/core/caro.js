/* eslint no-plusplus: 0 */
/* eslint comma-dangle: 0 */
/* eslint class-methods-use-this: 0 */
/* eslint consistent-return: 0 */
/* eslint array-callback-return: 0 */

const DIR = [
  {
    name: 'leftCross',
    leftRow: row => --row,
    rightRow: row => ++row,
    leftCol: col => --col,
    rightCol: col => ++col
  },
  {
    name: 'rightCross',
    leftRow: row => ++row,
    rightRow: row => --row,
    leftCol: col => --col,
    rightCol: col => ++col
  },
  {
    name: 'horizontal',
    leftRow: row => row,
    rightRow: row => row,
    leftCol: col => --col,
    rightCol: col => ++col
  },
  {
    name: 'vertical',
    leftRow: row => --row,
    rightRow: row => ++row,
    leftCol: col => col,
    rightCol: col => col
  }
];

class Caro {
  constructor(options) {
    this.cells = {};
    this.ticker = '';
    this.otherTicker = '';
    this.myTurn = true;
    this.isPlaying = false;
    this.isOtherHasWinningPath = false;

    this.createGrid(options);
  }

  setup({ ticker, isMyTurn, gameId }) {
    this.reset();

    this.ticker = ticker;
    this.otherTicker = ticker === 'x' ? 'o' : 'x';
    this.isPlaying = true;
    this.myTurn = isMyTurn;
    this.turn = isMyTurn ? this.ticker : this.otherTicker;
    this.gameId = gameId;
    this.isOtherHasWinningPath = false;
  }

  isGamePlaying() {
    return this.isPlaying;
  }

  reset() {
    Object.keys(this.cells).map((id) => {
      const cell = this.cells[id];
      cell.type = '';
      cell.isWin = false;
    });

    this.gameId = '';
    this.isPlaying = false;
    this.isOver = false;
  }

  createGrid({ rowNo, colNo }) {
    for (let row = 0; row < rowNo; row++) {
      for (let col = 0; col < colNo; col++) {
        this.cells[`${row}:${col}`] = {
          type: '',
          isWin: false,
          isCurrent: false
        };
      }
    }
  }

  parseId(cellId) {
    let [row, col] = cellId.split(':');

    row = +row;
    col = +col;

    return {
      row,
      col
    };
  }

  createId(row, col) {
    return `${row}:${col}`;
  }

  getCell(cellId) {
    if (!cellId) return;

    const { row, col } = this.parseId(cellId);
    return this.cells[`${row}:${col}`];
  }

  setCell(tick, cellId) {
    const { row, col } = this.parseId(cellId);
    this.cells[`${row}:${col}`].type = tick;
  }

  setTick(tick, cellId, isTheirTurn) {
    this.setCell(tick, cellId);
    this.myTurn = isTheirTurn;
    this.turn = this.myTurn ? this.ticker : this.otherTicker;

    this.setCurrent(cellId);
    return this.isWinner(tick, cellId);
  }

  setCurrent(cellId) {
    const cell = this.getCell(this.currentCell);

    if (cell) {
      cell.isCurrent = false;
    }

    const currentCell = this.getCell(cellId) || {};
    currentCell.isCurrent = true;

    this.currentCell = cellId;
  }

  setOtherWinningPath() {
    this.isOtherHasWinningPath = true;
  }

  getLeftPath(dir, path, row, col) {
    row = dir.leftRow(row);
    col = dir.leftCol(col);

    const cellId = this.createId(row, col);
    const cell = this.getCell(cellId);

    if (!cell) return path;

    path.unshift(`${row}:${col}`);

    this.getLeftPath(dir, path, row, col);
  }

  getRightPath(dir, path, row, col) {
    row = dir.rightRow(row);
    col = dir.rightCol(col);

    const cellId = this.createId(row, col);
    const cell = this.getCell(cellId);

    if (!cell) return path;

    path.push(`${row}:${col}`);

    this.getRightPath(dir, path, row, col);
  }

  getPath(cellId) {
    const { row, col } = this.parseId(cellId);
    const paths = [];

    DIR.map((dir) => {
      let path = [`${row}:${col}`];

      this.getLeftPath(dir, path, row, col);

      this.getRightPath(dir, path, row, col);

      path = this.clearBound(path);

      paths.push(path.sort((a, b) => {
        a = +a.replace(':', '');
        b = +b.replace(':', '');

        return a - b;
      }));
    });

    return paths;
  }

  clearBound(path) {
    const { length } = path;
    let start = -1;
    let end;

    for (let i = 0; i < length; i++) {
      const id = path[i];

      if (!id) return;

      const cell = this.getCell(id);

      if (cell && cell.type) {
        if (start === -1) {
          start = i;
        }

        end = i;
      }
    }

    path = path.slice(start, end + 1);

    return path;
  }

  getPathCount(path, candidatePath, minCount) {
    let count = 0;

    for (let i = 0; i < candidatePath.length; i++) {
      const cell = this.getCell(path[candidatePath[i]]) || {};

      if (cell.type) {
        count += 1;

        if (count >= minCount) break;
      } else {
        count = 0;
      }
    }

    return count;
  }

  isWinner(tick, cellId) {
    const paths = this.getPath(cellId);
    let isWin = false;
    const winPath = [];

    for (let i = 0; i < paths.length; i++) {
      const path = paths[i];
      const candidatePaths = [];
      let temp = [];
      let prevTick;

      path.map((id, index) => {
        const cell = this.getCell(id) || {};

        if (cell.type === tick || (!cell.type && prevTick === tick)) {
          temp.push(index);
        } else {
          if (temp.length >= 3) {
            candidatePaths.push([...temp]);
          }

          temp = [];
        }

        prevTick = cell.type;
      });

      if (!candidatePaths.length && temp.length >= 3) {
        candidatePaths.push([...temp]);
      }

      for (let c = 0; c < candidatePaths.length; c++) {
        const candidatePath = candidatePaths[c];
        const { length } = candidatePath;

        if (length >= 4) {
          const prevCell = this.getCell(path[candidatePath[0] - 1]) || {};
          const nextCell = this.getCell(path[candidatePath[length - 1] + 1]) || {};

          if (length === 4) {
            const pathCount = this.getPathCount(path, candidatePath, 4);

            if (!this.isOtherHasWinningPath
              && !prevCell.type && !nextCell.type
              && pathCount >= 4) {
              isWin = true;
            } else if (pathCount >= 4 && (!prevCell.type || !nextCell.type)) {
              this.isOtherHasWinningPath = true;
            }
          } else if (length > 4) {
            const pathCount = this.getPathCount(path, candidatePath, 5);

            if (pathCount >= 5) {
              if ((!prevCell.type && !nextCell.type)
                || (prevCell.type && !nextCell.type)
                || (!prevCell.type && nextCell.type)) {
                isWin = true;
              }
            } else {
              this.isOtherHasWinningPath = true;
            }
          }

          if (isWin) {
            candidatePath.map(() => winPath.push(path[candidatePath[i]]));
            break;
          }
        }
      }

      if (isWin) break;
    }

    if (isWin) {
      this.isOver = true;
      this.isPlaying = false;
    }

    return {
      isWin,
      winPath,
    };
  }
}

export default Caro;
