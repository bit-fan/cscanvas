const errorCode = {
  1: 'Invalid command',
  2: 'Invalid range',
  3: 'Invalid color character'
}
const CHAR_LINE = "x";

let drawing = function () {
  let dataMatrix = [];
  let height = 0;
  let width = 0;
}
const proto = drawing.prototype;
// const drawing = {
proto.init = function () {
  this.dataMatrix = [];
  this.width = 0;
  this.height = 0;
};
proto.getMatrix = function () {
  return this.dataMatrix.length == 0 ? [
    [""]
  ] : this.dataMatrix;
};
proto.drawCanvas = function (arr) {
  if (!Array.isArray(arr) ||
    arr.length != 2 ||
    !Number.isInteger(arr[0]) ||
    !Number.isInteger(arr[1]) ||
    arr[0] < 0 ||
    arr[1] < 0
  ) {
    return this.createResObj(false, 1);
  }
  this.init();
  const width = arr[0] + 2,
    height = arr[1] + 2;
  for (let j = 0; j < height; j++) {
    let newRow = [];
    for (let i = 0; i < width; i++) {
      if (j == 0 || j == height - 1) {
        newRow.push("-");
      } else if (i == 0 || i == width - 1) {
        newRow.push("|");
      } else {
        newRow.push(" ");
      }
    }
    this.dataMatrix.push(newRow);
  }
  this.width = arr[0];
  this.height = arr[1];
  return this.createResObj(true);
};
proto.drawLine = function (arr) {
  if (!Array.isArray(arr) ||
    arr.length != 4 ||
    !Number.isInteger(arr[0]) ||
    !Number.isInteger(arr[1]) ||
    !Number.isInteger(arr[2]) ||
    !Number.isInteger(arr[3])
  ) {
    return this.createResObj(false, 1);
  }

  // now only support hor/vert line
  if (arr[1] != arr[3] && arr[0] != arr[2]) {
    return this.createResObj(false, 2);
  }
  let rangeOK =
    this.checkRange(arr[0], arr[1]) && this.checkRange(arr[2], arr[3]);
  if (!rangeOK) {
    return this.createResObj(false, 2);
  }

  if (arr[0] == arr[2]) {
    const min = Math.min(arr[1], arr[3]);
    const max = Math.max(arr[1], arr[3]);
    for (let i = min; i <= max; i++) {
      this.dataMatrix[i][arr[0]] = CHAR_LINE;
    }
  } else if (arr[1] == arr[3]) {
    const min = Math.min(arr[0], arr[2]);
    const max = Math.max(arr[0], arr[2]);
    for (let i = min; i <= max; i++) {
      this.dataMatrix[arr[1]][i] = CHAR_LINE;
    }
  }
  return this.createResObj(true);
};
proto.drawRect = function (arr) {
  if (!Array.isArray(arr) ||
    arr.length != 4 ||
    !Number.isInteger(arr[0]) ||
    !Number.isInteger(arr[1]) ||
    !Number.isInteger(arr[2]) ||
    !Number.isInteger(arr[3])
  ) {
    return this.createResObj(false, 1);
  }
  let rangeOK =
    this.checkRange(arr[0], arr[1]) && this.checkRange(arr[2], arr[3]);
  if (!rangeOK) {
    return this.createResObj(false, 2);
  }

  // upper left and bottom right
  if (arr[0] > arr[2] || arr[1] > arr[3]) {
    // assume very narrow rect, height or width is 1
    return this.createResObj(false, 2);
  }
  for (let j = arr[1]; j <= arr[3]; j++) {
    for (i = arr[0]; i <= arr[2]; i++) {
      if (j == arr[1] || j == arr[3] || i == arr[0] || i == arr[2]) {
        this.dataMatrix[j][i] = CHAR_LINE;
      }
    }
  }
  return this.createResObj(true);;
};
proto.fill = function (arr, char) {
  if (char == CHAR_LINE) {
    return this.createResObj(false, 3);;
  }
  char = char.slice(0, 1);

  if (!Array.isArray(arr) ||
    arr.length != 2 ||
    !Number.isInteger(arr[0]) ||
    !Number.isInteger(arr[1])
  ) {
    return this.createResObj(false, 1);
  }
  let rangeOK = this.checkRange(arr[0], arr[1]);
  if (!rangeOK) {
    return this.createResObj(false, 2);
  }

  let flagMatrix = new Array(this.height + 1)
    .fill(0)
    .map(x => Array(this.width + 1).fill(false));

  const self = this;

  function traverse(x, y) {
    if (!self.checkRange(x, y) || flagMatrix[y][x]) {
      return;
    }
    flagMatrix[y][x] = true;
    if (self.dataMatrix[y][x] != CHAR_LINE) {
      self.dataMatrix[y][x] = char;
      traverse(x - 1, y, flagMatrix);
      traverse(x + 1, y, flagMatrix);
      traverse(x, y - 1, flagMatrix);
      traverse(x, y + 1, flagMatrix);
    }
  }
  traverse(arr[0], arr[1]);
  return this.createResObj(true);
};
proto.clearRect = function () {
  this.init();
  return this.createResObj(true);
};
proto.checkRange = function (x, y) {
  return x > 0 && x <= this.width && y > 0 && y <= this.height;
};
proto.createResObj = function (ok, para) {
  return {
    ok: ok ? true : false,
    message: errorCode[para] || ''
  }
}
// };
module.exports = {
  drawing: drawing
};