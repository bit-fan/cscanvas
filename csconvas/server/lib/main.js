const readline = require('readline');
const drawing = require('./drawing');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'enter command: '
});

function processCommand(cmd, callback) {
  const cmdArr = cmd.split(' ');
  const cmdType = cmdArr.shift().toUpperCase();

  // check validity of command and return function
  const cmdData = cmdArr.map(item => {
    const check = Number(item);
    // not all arguments are number
    return check || item;
  })

  let result = drawing.createResObj(false);
  if (cmdType == 'C') {
    // draw canvas
    if (cmdData.length == 2) {
      result = drawing.drawCanvas(cmdData);
    }
  } else if (cmdType == 'L') {
    // draw line
    if (cmdData.length == 4) {
      result = drawing.drawLine(cmdData);
    }
  } else if (cmdType == 'R') {
    // draw rect
    if (cmdData.length == 4) {
      result = drawing.drawRect(cmdData);
    }
  } else if (cmdType == 'B') {
    // fill
    if (cmdData.length == 3) {
      result = drawing.fill([cmdData[0], cmdData[1]], cmdData[2]);
    }
  } else if (cmdType == 'Q') {
    // clear
    if (cmdData.length == 0) {
      result = drawing.clearRect();
      return callback('quit');
    }
  }
  if (result.ok === true) {
    showCanvas(drawing.getMatrix());
  } else {
    showError(result.message);
  }
  callback('next');
}

function showCanvas(data) {
  data.forEach(rowData => {
    console.log(rowData.join(''));
  })
}

function showError(msg) {
  console.log(msg || 'Invalid command');
}

rl.prompt();

rl.on('line', (line) => {
  processCommand(line, (callback) => {
    if (callback !== 'quit') {
      rl.prompt();
    } else {
      process.exit(0);
    }
  });
})