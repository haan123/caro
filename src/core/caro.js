class Caro {
  constructor (options) {
    this.cells = {}

    this.createGrid(options)
  }

  createGrid ({ rowNo, colNo }) {
    for (let row = 0; row < rowNo; row++) {
      for (let col = 0; col < colNo; col++) {
        this.cells[`${row}:${col}`] = ''
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

  createId(row, col) {
    return `${row}:${col}`
  }

  getCell (cellId) {
    const { row, col } = this.parseId(cellId)
    return this.cells[`${row}:${col}`]
  }

  setCell (tick, cellId) {
    const { row, col } = this.parseId(cellId)
    this.cells[`${row}:${col}`] = tick
  }

  setTick (tick, cellId) {
    this.setCell(tick, cellId)
    return this.isWinner(cellId)
  }

  getLeftPath (path, row, col) {
    row--
    col--

    const cellId = this.createId(row, col)
    let cell = this.getCell(cellId)

    if (!cell) return path

    path.push(`${row}:${col}`)

    this.getLeftPath(path, `${row--}:${col--}`)
  }

  getRightPath (path, row, col) {
    row++
    col++

    const cellId = this.createId(row, col)
    let cell = this.getCell(cellId)

    if (!cell) return path

    path.push(`${row}:${col}`)

    this.getRightPath(path, `${row++}:${col++}`)
  }

  getPath (cellId) {
    const { row, col } = this.parseId(cellId)

    const path = [`${row}:${col}`]

    this.getLeftPath(path, cellId)

    this.getRightPath(path, cellId)

    return path.sort((a, b) => {
      a = +a.replace(':', '')
      b = +b.replace(':', '')

      return a - b
    })
  }

  isWinner (cellId) {
    const path = this.getPath(cellId)
    const isWin = false

    path.map((p) => {

    })

    console.log(path)
  }
}

export default Caro
