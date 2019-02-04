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
   */
  rref(): Matrix {
    const m = new Matrix(this.rows.map(r => r.map(c => c)));
    let y = 0;
    let x = 0;
    do {
      if (m.rows[y][x] === 0) {
        if (m.col(x).every(i => i === 0)) {
          x++;
          console.log("zeroes", m, y, x);
          continue;
        } else if (y !== m.height - 1) {
          m.swap(y, y + 1);
          console.log("swap", m, y, x);
          continue;
        }
      }
      m.rows[y] = m.rows[y].map(i => i / m.rows[y][x]);
      for (let y2 = 0; y2 < m.height; y2++) {
        if (y2 === y) continue;
        m.rows[y2] = m.rows[y2].map((i, x2) =>
          i - (m.rows[y2][x2] * m.rows[y][x])
        );
      }
      y++;
      x++;
      console.log(y, x);
    } while (y < m.height && x < m.width);
    return m;
  }
}
