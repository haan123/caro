type Options = {
  rowNo?: number;
  colNo?: number;
}

type Cell = {
  type: string;
  isWin: boolean;
  isCurrent: boolean;
}

type Dir = {
  name: string,
  leftRow: (row: number) => number;
  rightRow: (row: number) => number;
  leftCol: (col: number) => number;
  rightCol: (col: number) => number;
}

const DIR: Dir[] = [
  {
    name: 'leftCross',
    leftRow: (row: number) => --row,
    rightRow: (row: number) => ++row,
    leftCol: (col: number) => --col,
    rightCol: (col: number) => ++col
  },
  {
    name: 'rightCross',
    leftRow: (row: number) => ++row,
    rightRow: (row: number) => --row,
    leftCol: (col: number) => --col,
    rightCol: (col: number) => ++col
  },
  {
    name: 'horizontal',
    leftRow: (row: number) => row,
    rightRow: (row: number) => row,
    leftCol: (col: number) => --col,
    rightCol: (col: number) => ++col
  },
  {
    name: 'vertical',
    leftRow: (row: number) => --row,
    rightRow: (row: number) => ++row,
    leftCol: (col: number) => col,
    rightCol: (col: number) => col
  }
];

class Caro {
  cells: Record<string, Cell> = {};
  ticker!: string;
  otherTicker = '';
  myTurn = true;
  turn!: string;
  isPlaying = false;
  isOtherHasWinningPath = false;
  gameId!: number | string;
  isOver: boolean = false;
  currentCellId!: string;

  constructor(options: Options) {
    this.createGrid(options);
  }

  setup({ ticker, isMyTurn = false, gameId = '' }: { ticker: string; isMyTurn?: boolean; gameId?: number | string }) {
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

  createGrid({ rowNo = 0, colNo = 0 }: Options = {}) {
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

  parseId(cellId: string) {
    const [row, col] = cellId.split(':');

    return {
      row: +row,
      col: +col
    };
  }

  createId(row: number, col: number) {
    return `${row}:${col}`;
  }

  getCell(cellId: string) {
    if (!cellId) {
      return undefined
    }

    const { row, col } = this.parseId(cellId);

    return this.cells[`${row}:${col}`];
  }

  setCell(tick: string, cellId: string) {
    const { row, col } = this.parseId(cellId);
    this.cells[`${row}:${col}`].type = tick;
  }

  setTick(tick: string, cellId: string, isTheirTurn: boolean) {
    this.setCell(tick, cellId);
    this.myTurn = isTheirTurn;
    this.turn = this.myTurn ? this.ticker : this.otherTicker;

    this.setCurrent(cellId);
    return this.isWinner(tick, cellId);
  }

  setCurrent(cellId: string) {
    const cell = this.getCell(this.currentCellId);

    if (cell) {
      cell.isCurrent = false;
    }

    const currentCell = this.getCell(cellId);

    if (currentCell) {
      currentCell.isCurrent = true;

      this.currentCellId = cellId;
    }
  }

  setOtherWinningPath() {
    this.isOtherHasWinningPath = true;
  }

  getLeftPath(dir: Dir, path: string[], row: number, col: number) {
    row = dir.leftRow(row);
    col = dir.leftCol(col);

    const cellId = this.createId(row, col);
    const cell = this.getCell(cellId);

    if (!cell) return path;

    path.unshift(`${row}:${col}`);

    this.getLeftPath(dir, path, row, col);
  }

  getRightPath(dir: Dir, path: string[], row: number, col: number) {
    row = dir.rightRow(row);
    col = dir.rightCol(col);

    const cellId = this.createId(row, col);
    const cell = this.getCell(cellId);

    if (!cell) return path;

    path.push(`${row}:${col}`);

    this.getRightPath(dir, path, row, col);
  }

  getPath(cellId: string) {
    const { row, col } = this.parseId(cellId);
    const paths: string[][] = [];

    DIR.map((dir) => {
      let path = [`${row}:${col}`];

      this.getLeftPath(dir, path, row, col);

      this.getRightPath(dir, path, row, col);

      path = this.clearBound(path);

      paths.push(path.sort((a, b) => {
        return +a.replace(':', '') - +b.replace(':', '');;
      }));
    });

    return paths;
  }

  clearBound(path: string[]) {
    const { length } = path;
    let start = -1;
    let end;

    for (let i = 0; i < length; i++) {
      const id = path[i];

      const cell = this.getCell(id);

      if (cell && cell.type) {
        if (start === -1) {
          start = i;
        }

        end = i;
      }
    }

    if (end) {
      path = path.slice(start, end + 1);
    }

    return path;
  }

  getPathCount(path: string[], candidatePath: number[], minCount: number) {
    let count = 0;

    for (let i = 0; i < candidatePath.length; i++) {
      const cell = this.getCell(path[candidatePath[i]]);

      if (cell && cell.type) {
        count += 1;

        if (count >= minCount) break;
      } else {
        count = 0;
      }
    }

    return count;
  }

  isWinner(tick: string, cellId: string) {
    const paths = this.getPath(cellId);
    let isWin = false;
    const winPath: string[] = [];

    for (let i = 0; i < paths.length; i++) {
      const path = paths[i];
      const candidatePaths = [];
      let temp: number[] = [];
      let prevTick: string;

      path.map((id, index) => {
        const cell = this.getCell(id) as Cell;

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
          const prevCell = this.getCell(path[candidatePath[0] - 1]);
          const nextCell = this.getCell(path[candidatePath[length - 1] + 1]);

          if (length === 4) {
            const pathCount = this.getPathCount(path, candidatePath, 4);

            if (!this.isOtherHasWinningPath
              && (!prevCell || !prevCell.type) && (!nextCell || !nextCell.type)
              && pathCount >= 4) {
              isWin = true;
            } else if (pathCount >= 4 && ((!prevCell || !prevCell.type) || (!nextCell || !nextCell.type))) {
              this.isOtherHasWinningPath = true;
            }
          } else if (length > 4) {
            const pathCount = this.getPathCount(path, candidatePath, 5);

            if (pathCount >= 5) {
              if (((!prevCell || !prevCell.type) && (!nextCell || !nextCell.type))
                || ((prevCell && prevCell.type) && (!nextCell || !nextCell.type))
                || ((!prevCell || !prevCell.type) && (nextCell && nextCell.type))) {
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
