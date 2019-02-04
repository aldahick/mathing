import { strict as assert } from "assert";
import { Matrix } from "./Matrix";

describe("Matrix", () => {
  const empty = () => new Matrix([]);
  const matrix1x2 = () => new Matrix([
    [1, 2]
  ]);
  const matrix2x2 = () => new Matrix([
    [1, 2],
    [3, 4]
  ]);
  const matrix3x3 = () => new Matrix([
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
  ]);
  describe("#constructor()", () => {
    it("should not allow inconsistent row lengths", () => {
      assert.throws(() => new Matrix([
        [1, 2, 3],
        [4, 5]
      ]), new RangeError("row lengths are not uniform"));
    });
  });
  describe("#height()", () => {
    it("should return number of rows", () => {
      assert.equal(matrix1x2().height, 1);
    });
  });
  describe("#width()", () => {
    it("should return 0 for an empty matrix", () => {
      assert.equal(empty().width, 0);
    });
    it("should return number of columns", () => {
      assert.equal(matrix1x2().width, 2);
    });
  });
  describe("#exclude()", () => {
    it("should return a matrix without the provided row/col", () => {
      assert.deepEqual(matrix3x3().exclude(0, 1), new Matrix([
        [4, 6],
        [7, 9]
      ]));
    });
  });
  describe("#determinant()", () => {
    it("should return 0 for an empty matrix", () => {
      assert.equal(empty().determinant(), 0);
    });
    it("should return the correct determinant", () => {
      assert.equal(matrix2x2().determinant(), -2);
      assert.equal(matrix3x3().determinant(), 0);
    });
  });
  describe("#rref()", () => {
    it("should return the correct reduced row echelon form", () => {
      assert.deepEqual(matrix3x3().rref(), new Matrix([
        [1, 0, -1],
        [0, 1, 2],
        [0, 0, 0]
      ]));
    });
  });
});
