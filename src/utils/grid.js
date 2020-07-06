const drawCell = (c, x, y, size, borderRadius, padding, fill=false, highlight=false) => {
  x = x*(size+padding*2)+ padding;
  y = y*(size+padding*2)+ padding;

  c.beginPath();
  c.moveTo(x + borderRadius, y);

  c.lineTo(x + size - borderRadius, y);
  c.quadraticCurveTo(x + size, y, x + size, y + borderRadius);
  c.lineTo(x + size, y + size - borderRadius);
  c.quadraticCurveTo(x + size, y + size, x + size - borderRadius, y + size);
  c.lineTo(x + borderRadius, y + size);
  c.quadraticCurveTo(x, y + size, x, y + size - borderRadius);
  c.lineTo(x, y + borderRadius);
  c.quadraticCurveTo(x, y, x + borderRadius, y);
  c.closePath();

  if (fill) {
    c.fillStyle = '#e2c044';
    c.strokeStyle = '#BDB76B';
  } else if (highlight) {
    c.fillStyle = '#1e201933';
    // c.fillStyle = '#d3d0cb';
    c.strokeStyle = '#F5DEB333';
  } else {
    c.fillStyle = '#1e201933';
    c.strokeStyle = '#BDB76B33';
  }

  c.stroke();
  c.fill();
}

export class HighlightCells {
  constructor({ context, cellSize, borderRadius, padding } ) {
    this.context = context;

    this.cellSize = cellSize;
    this.borderRadius = borderRadius;
    this.padding = padding;
  }

  draw({cells, M, N}) {
    this.context.clearRect(0, 0, M*(this.cellSize*this.padding*2), M*(this.cellSize*this.padding*2));
    cells.map((state, i) => {
      if (state) {
        let row = Math.floor(i/M);
        let col = (i%M);
        drawCell(this.context, col, row, this.cellSize, this.borderRadius, this.padding, false, true);
      }
    });
  }
}

export class DrawCells {
  constructor({ context, cellSize, borderRadius, padding } ) {
    this.context = context;

    this.cellSize = cellSize;
    this.borderRadius = borderRadius;
    this.padding = padding;
  }

  draw({cells, M, N}) {
    this.context.clearRect(0, 0, M*(this.cellSize*this.padding*2), M*(this.cellSize*this.padding*2));
    cells.map((state, i) => {
      if (state) {
        let row = Math.floor(i/M);
        let col = (i%M);
        drawCell(this.context, col, row, this.cellSize, this.borderRadius, this.padding, true);
      }
    });
  }
}

export class DrawGrid {
  constructor({ context, M, N, cellSize, borderRadius, padding }) {
    this.context = context;

    // TODO: don't use defaults in the constructor
    this.cellSize = cellSize;
    this.borderRadius = borderRadius;
    this.padding = padding;

    this.draw(M, N);
  }

  draw(M, N) {
    this.context.clearRect(0, 0, M*(this.cellSize*this.padding*2), M*(this.cellSize*this.padding*2));
    for (let m=0; m<M; ++m) {
      for (let n=0; n<N; ++n) {
        drawCell(this.context, m, n, this.cellSize, this.borderRadius, this.padding)
      }
    }
  }
}

export class Grid {
  constructor(
    cells,
    {cellSize, borderRadius, padding},
    generation,
    {M, N},
    {L, R, U, D, LUx, LDx, RUx, RDx},
    {gridContext, cellsContext, highlightCellsContext}
  ) {

    this.cellSize = cellSize;
    this.borderRadius = borderRadius;
    this.padding = padding;

    // M x N
    this.M = M;
    this.N = N;
    this.cells = cells;
    this.generation = generation;
    this.L = L;
    this.R = R;
    this.U = U;
    this.D = D;
    this.LUx = LUx;
    this.LDx = LDx;
    this.RUx = RUx;
    this.RDx = RDx;

    this.drawGrid = null;
    this.drawCells = null;
    this.highlightCells = null;
    this.start = undefined;
    this.elapsed = 0.0;
    this.request = null;
    this.animate = null;

    if (gridContext) {
      this.drawGrid = new DrawGrid({
        context: gridContext,
        M: this.M,
        N: this.N,
        cellSize, borderRadius, padding
      });
    }
    if (cellsContext) {
      this.drawCells = new DrawCells({
        context: cellsContext,
        cellSize, borderRadius, padding
      });
    }
    if (highlightCellsContext) {
      this.highlightCells = new HighlightCells({
        context: highlightCellsContext,
        cellSize, borderRadius, padding
      })

      this.animate = (ts) => {
        if (this.start === undefined) {
          this.start = ts;
        }
        this.elapsed = ts - this.start;

        this.highlightCells.draw({cells: this.cells, M: this.M, N: this.N});
        this.request = window.requestAnimationFrame(this.animate);
      }

      this.animate = this.animate.bind(this);
      window.requestAnimationFrame(this.animate);
    }
  }
  clear() {
    this.cells = this.cells.map(() => false)
    this.redraw();
  }
  turnOnCell(row, col) {
    let index = (row*this.M)+col;
    this.cells[index] = true;
    this.redraw();
  }
  turnOffCell(row, col) {
    let index = (row*this.M)+col;
    this.cells[index] = false;
    this.redraw();
  }
  toggleCell(row, col) {
    let index = (row*this.M)+col;
    this.cells[index] = !this.cells[index];
    this.redraw();
  }
  getLCells() {
    return this.cells.filter((cell, i) => i%this.M === 0);
  }
  getRCells() {
    return this.cells.filter((cell, i) => (i+1)%this.M === 0);
  }
  getUCells() {
    return this.cells.filter((cell, i) => i<this.M);
  }
  getDCells() {
    return this.cells.filter((cell, i) => i>=(this.M*this.N)-this.N);
  }
  getLUCornerCell() {
    return this.cells[0];
  }
  getLDCornerCell() {
    return this.cells[this.M*(this.N-1)];
  }
  getRUCornerCell() {
    return this.cells[this.M-1];
  }
  getRDCornerCell() {
    return this.cells[(this.M*this.N)-1];
  }
  getNextCellState(state, vicinity) {
    if (state) { // alive
      if (vicinity === 2 || vicinity === 3) {
        // stay alive
      } else {
        return false; // kill
      }
    } else { // dead
      if (vicinity === 3) {
        return true; // come alive
      }
    }
    return state;
  }
  redraw() {
    if (this.drawCells) {
      this.drawCells.draw({
        cells: this.cells,
        M: this.M,
        N: this.N
      })
    }
  }
  getNextState() {
    let L = this.L();
    let R = this.R();
    let U = this.U();
    let D = this.D();
    let LUx = this.LUx();
    let LDx = this.LDx();
    let RUx = this.RUx();
    let RDx = this.RDx();
    this.cells = this.cells.map((cell, i) => {
      let M = this.M;
      let N = this.N;
      let row = Math.floor(i/M);
      let col = (i%M);
      let vicinity = 0;
      if (i === 0) { // LUx
        vicinity = (LUx + U[0] + U[1] + L[0] + L[1] + this.cells[i+1] + this.cells[i+M] + this.cells[i+M+1]);
      } else if (i === M*(N-1)) { // LDx
        vicinity = (LDx + D[0] + D[1] + L[N-1] + L[N-2] + this.cells[i+1] + this.cells[i-M] + this.cells[i-M+1]);
      } else if (i === M-1) { // RUx
        vicinity = (RUx + R[0] + R[1] + U[M-1] + U[M-2] + this.cells[i-1] + this.cells[i+M] + this.cells[i+M-1]);
      } else if (i === (M*N)-1) { // RDx
        vicinity = (RDx + R[N-1] + R[N-2] + D[M-1] + D[M-2] + this.cells[i-1] + this.cells[i-M] + this.cells[i-M-1]);
      } else if (col === 0) { // L
        vicinity = (L[row-1] + L[row] + L[row+1] + this.cells[i+1] + this.cells[i-M] + this.cells[i-M+1] + this.cells[i+M] + this.cells[i+M+1]);
      } else if (col === M-1) { // R
        vicinity = (R[row-1] + R[row] + R[row+1] + this.cells[i-1] + this.cells[i-M] + this.cells[i-M-1] + this.cells[i+M] + this.cells[i+M-1]);
      } else if (row === 0) { // U
        vicinity = (U[col-1] + U[col] + U[col+1] + this.cells[i-1] + this.cells[i+1] + this.cells[i+M] + this.cells[i+M-1] + this.cells[i+M+1]);
      } else if (row === N-1) { // D
        vicinity = (D[col-1] + D[col] + D[col+1] + this.cells[i-1] + this.cells[i+1] + this.cells[i-M] + this.cells[i-M-1] + this.cells[i-M+1]);
      } else {
        vicinity = (this.cells[i-1] + this.cells[i+1] + this.cells[i-M] + this.cells[i-M-1] + this.cells[i-M+1] + this.cells[i+M] + this.cells[i+M-1] + this.cells[i+M+1]);
      }
      return this.getNextCellState(cell, vicinity);
    });
    let data = {
      generation: ++this.generation,
      cells: this.cells,
      M: this.M,
      N: this.N
    }

    this.redraw();

    return data;
  }
}

// export default Grid;
