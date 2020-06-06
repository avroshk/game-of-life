export class Draw {
  constructor(context) {
    this.context = context;
    // TODO: don't hardcode these
    this.cellSize = 10;
    this.borderRadius = 5;
    this.padding = 2;
  }

  cell({ x, y, size, borderRadius, padding, fill=false }) {
    x = x*(this.cellSize+padding*2)+ padding;
    y = y*(this.cellSize+padding*2)+ padding;
    // const width = size;
    // const height = size;
    //
    // this.context.beginPath();
    //
    // this.context.moveTo(x + borderRadius, y);
    // this.context.lineTo(x + width - borderRadius, y);
    // this.context.quadraticCurveTo(x + width, y, x + width, y + borderRadius);
    // this.context.lineTo(x + width, y + height - borderRadius);
    // this.context.quadraticCurveTo(x + width, y + height, x + width - borderRadius, y + height);
    // this.context.lineTo(x + borderRadius, y + height);
    // this.context.quadraticCurveTo(x, y + height, x, y + height - borderRadius);
    // this.context.lineTo(x, y + borderRadius);
    // this.context.quadraticCurveTo(x, y, x + borderRadius, y);
    // this.context.closePath();


    this.context.beginPath();
    this.context.moveTo(x + borderRadius, y);

    this.context.lineTo(x + size - borderRadius, y);
    this.context.quadraticCurveTo(x + size, y, x + size, y + borderRadius);
    this.context.lineTo(x + size, y + size - borderRadius);
    this.context.quadraticCurveTo(x + size, y + size, x + size - borderRadius, y + size);
    this.context.lineTo(x + borderRadius, y + size);
    this.context.quadraticCurveTo(x, y + size, x, y + size - borderRadius);
    this.context.lineTo(x, y + borderRadius);
    this.context.quadraticCurveTo(x, y, x + borderRadius, y);
    this.context.closePath();
    if (fill) {
      this.context.fillStyle = '#e2c044';
      this.context.strokeStyle = '#BDB76B';
      this.context.stroke();
      this.context.fill();
    } else {
      this.context.fillStyle = '#1e201933';
      this.context.strokeStyle = '#BDB76B33';
      this.context.stroke();
    }
    this.context.fill();
  }

  grid({ cells, M, N }) {
    this.context.clearRect(0, 0, M*(this.cellSize*this.padding*2), M*(this.cellSize*this.padding*2));
    cells.map((state, i) => {
      let row = Math.floor(i/M);
      let col = (i%M);
      this.cell({
        x: col,
        y: row,
        size: this.cellSize,
        borderRadius: this.borderRadius,
        padding: this.padding,
        fill: state
      })
    })
  }
}

export class Grid {
  constructor(cells, generation, {M, N}, {L, R, U, D, LUx, LDx, RUx, RDx}) {
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
    this.draw = null;
  }
  toggleCell(row, col) {
    let index = (row*this.M)+col;
    this.cells[index] = !this.cells[index];
    this.redraw();
  }
  updateContext(context) {
    console.log('Drawing context is set')
    this.draw = new Draw(context);
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
    if (this.draw) {
      this.draw.grid({
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
