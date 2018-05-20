const DIR = [
  {
    name: 'leftCross',
    leftRow: (row) => --row,
    rightRow: (row) => ++row,
    leftCol: (col) => --col,
    rightCol: (col) => ++col
  },
  {
    name: 'rightCross',
    leftRow: (row) => ++row,
    rightRow: (row) => --row,
    leftCol: (col) => --col,
    rightCol: (col) => ++col
  },
  {
    name: 'horizontal',
    leftRow: (row) => row,
    rightRow: (row) => row,
    leftCol: (col) => --col,
    rightCol: (col) => ++col
  },
  {
    name: 'vertical',
    leftRow: (row) => --row,
    rightRow: (row) => ++row,
    leftCol: (col) => col,
    rightCol: (col) => col
  }
]

class Caro {
  constructor (options) {
    this.cells = {}

    this.createGrid(options)
  }

  createGrid ({ rowNo, colNo }) {
    for (let row = 0; row < rowNo; row++) {
      for (let col = 0; col < colNo; col++) {
        this.cells[`${row}:${col}`] = {
          type: '',
          isWin: false
        }
      }
    }
  }

  parseId (cellId) {
    let [row, col] = cellId.split(':')

    row = +row
    col = +col

    return {
      row,
      col
    }
  }

  createId (row, col) {
    return `${row}:${col}`
  }

  getCell (cellId) {
    if (!cellId) return

    const { row, col } = this.parseId(cellId)
    return this.cells[`${row}:${col}`]
  }

  setCell (tick, cellId) {
    const { row, col } = this.parseId(cellId)
    this.cells[`${row}:${col}`].type = tick
  }

  setTick (tick, cellId) {
    this.setCell(tick, cellId)
    return this.isWinner(tick, cellId)
  }

  getLeftPath (dir, path, row, col) {
    row = dir.leftRow(row)
    col = dir.leftCol(col)

    const cellId = this.createId(row, col)
    let cell = this.getCell(cellId)

    if (!cell.type) return path

    path.push(`${row}:${col}`)

    this.getLeftPath(dir, path, row--, col--)
  }

  getRightPath (dir, path, row, col) {
    row = dir.rightRow(row)
    col = dir.rightCol(col)

    const cellId = this.createId(row, col)
    let cell = this.getCell(cellId)

    if (!cell.type) return path

    path.push(`${row}:${col}`)

    this.getRightPath(dir, path, row++, col++)
  }

  getPath (cellId) {
    const { row, col } = this.parseId(cellId)
    let paths = []

    DIR.map((dir) => {
      const path = [`${row}:${col}`]

      this.getLeftPath(dir, path, row, col)

      this.getRightPath(dir, path, row, col)

      paths.push(path.sort((a, b) => {
        a = +a.replace(':', '')
        b = +b.replace(':', '')

        return a - b
      }))
    })

    return paths
  }

  isWinner (tick, cellId) {
    const paths = this.getPath(cellId)
    let isWin = false
    let winPath = []

    for (const path of paths) {
      let candidatePaths = []
      let temp = []

      path.map((id, index) => {
        const cell = this.getCell(id)

        if (cell.type === tick) {
          temp.push(index)
        } else {
          if (temp.length >= 3) {
            candidatePaths.push([...temp])
          }

          temp = []
        }
      })

      if (!candidatePaths.length && temp.length >= 3) {
        candidatePaths.push([...temp])
      }

      for (const candidatePath of candidatePaths) {
        const length = candidatePath.length

        if (length >= 3) {
          const prevCell = this.getCell(path[candidatePath[0] - 1]) || {}
          const nextCell = this.getCell(path[candidatePath[length - 1] + 1]) || {}

          if (length === 3) {
            if (!prevCell.type && !nextCell.type) {
              isWin = true
            }
          } else if (length > 4) {
            if ((prevCell.type && !nextCell.type) || (!prevCell.type && nextCell.type)) {
              isWin = true
            }
          }

          if (isWin) {
            candidatePath.map((_, i) => {
              winPath.push(path[candidatePath[i]])
            })

            console.log(`${tick} is Win`)
            break
          }
        }
      }

      if (isWin) break
    }

    return {
      isWin,
      winPath
    }
  }
}

export default Caro
