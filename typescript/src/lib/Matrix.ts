import * as _ from "lodash";

export class Matrix {
  constructor(
    private readonly rows: number[][]
  ) {
    if (_.uniq(this.rows.map(r => r.length)).length > 1) {
      throw new RangeError("row lengths are not uniform");
    }
  }

  get height() { return this.rows.length; }
  get width() {
    if (this.height === 0) return 0;
    return this.rows[0].length;
  }

  col(x: number): number[] {
    if (this.width <= x) {
      throw new RangeError("x is greater than matrix width");
    }
    return this.rows.map(r => r[x]);
  }

  scaleRow(i: number, scalar: number): void {
    this.rows[i] = this.rows[i].map(v => v * scalar);
  }

  addScaledRow(to: number, from: number, scalar = 1): void {
    this.rows[to] = this.rows[to].map((v, j) => v + (this.rows[from][j] * scalar));
  }

  swap(a: number, b: number): void {
    const temp = this.rows[b];
    this.rows[b] = this.rows[a];
    this.rows[a] = temp;
  }

  exclude(row: number, col: number): Matrix {
    return new Matrix(this.rows.map(r =>
      r.filter((_, x) => x !== col)
    ).filter((_, y) => y !== row));
  }

  determinant(): number {
    if (this.width === 0 || this.height === 0) {
      return 0;
    }
    if (this.width === 2 && this.height === 2) {
      return (this.rows[0][0] * this.rows[1][1]) - (this.rows[0][1] * this.rows[1][0]);
    }
    return _.range(this.width).map(x => {
      const modifier = x % 2 === 0 ? 1 : -1;
      const subDeterminant = this.exclude(0, x).determinant();
      return modifier * this.rows[0][x] * subDeterminant;
    }).reduce((p, v) => p + v, 0);
  }

  /**
   * reduced row echelon form
   * currently naive implementation of algorithm, might be optimizable
   */
  rref(): Matrix {
    const m = new Matrix(this.rows.map(r => r.map(c => c)));
    let y = 0;
    let x = 0;
    while (true) {
      if (y === m.height || x === m.width) break;
      if (m.rows[y][x] === 0) {
        const toSwap = m.col(x).slice(y + 1).findIndex(v => v !== 0);
        if (toSwap === -1) {
          x++;
        } else {
          m.swap(y, y + toSwap);
        }
        continue;
      }
      m.scaleRow(y, 1 / m.rows[y][x]);
      for (let i = 0; i < m.height; i++) {
        if (i === y) continue;
        m.addScaledRow(i, y, -m.rows[i][x]);
      }
      x++;
      y++;
    }
    return m;
  }

  toString() {
    return this.rows.map(r => r.join(" ")).join("\n");
  }
}
