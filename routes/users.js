var express = require('express');
var router = express.Router();
const lib = require('../server/lib/drawing');

/* GET users listing. */

let allObj = {};
router.post('/', function (req, res, next) {
  var cookie = req.cookies.userId;
  // console.log('req', req, cookie);
  if (!allObj[cookie]) {
    allObj[cookie] = new lib.drawing();
  }

  processCommand(allObj[cookie], req.body.cmd, (type, data) => {
    if (type === 'data') {
      res.send({
        ok: true,
        data: data
      });
    } else if (type === 'quit') {
      delete allObj[cookie];
      res.send({
        ok: true,
        data: []
      });
    }else if (type === 'err') {
      res.send({
        ok: false,
        err: data
      });
    }
  });
  // res.send('respond with a resource');
});

function processCommand(drawingObj, cmd, callback) {
  const cmdArr = cmd.split(' ');
  const cmdType = cmdArr.shift().toUpperCase();

  // check validity of command and return function
  const cmdData = cmdArr.map(item => {
    const check = Number(item);
    // not all arguments are number
    return check || item;
  })

  // let result = drawingObj.createResObj(false);
  if (cmdType == 'C') {
    // draw canvas
    if (cmdData.length == 2) {
      result = drawingObj.drawCanvas(cmdData);
    }
  } else if (cmdType == 'L') {
    // draw line
    if (cmdData.length == 4) {
      result = drawingObj.drawLine(cmdData);
    }
  } else if (cmdType == 'R') {
    // draw rect
    if (cmdData.length == 4) {
      result = drawingObj.drawRect(cmdData);
    }
  } else if (cmdType == 'B') {
    // fill
    if (cmdData.length == 3) {
      result = drawingObj.fill([cmdData[0], cmdData[1]], cmdData[2]);
    }
  } else if (cmdType == 'Q') {
    // clear
    if (cmdData.length == 0) {
      result = drawingObj.clearRect();
      return callback('quit', result);
    }
  }
  if (result.ok === true) {
    const str = getCanvasStr(drawingObj.getMatrix());
    callback('data', str);
  } else {
    // console.log(msg || 'Invalid command');
    callback('err', result.message);
  }
  // callback('next');
}

function getCanvasStr(data) {
  // return data.map(rowData => {
  //   return rowData.join('');
  // }).join('\n');
  return data;
}
module.exports = router;