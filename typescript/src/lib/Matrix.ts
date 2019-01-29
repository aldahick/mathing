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
}
