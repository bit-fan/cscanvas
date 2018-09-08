$(document).ready(() => {
  let cmdHist = [];
  $('#input').on('keydown', function (evt) {
    if (evt.which == 13) {
      processCommand($(this).val());
      cmdHist.push($(this).val());
      updateCmdHis();
    }
  });

  $('#commandHisDiv').on('click',function(){
    console.log($(this));
    $('#input').val($(this).text());
  })
  function updateCmdHis(){
    $('#commandHisDiv').html('');
    cmdHist.forEach(str=>{
      $('#commandHisDiv').append('<li>'+str+'</li>');
    })
  }
  function processCommand(cmd) {
    updateRemark('clear');
    ajax(cmd).then(result => {
      console.log('data', result)
      if (result.ok === true) {
        showCanvas(result.data);
      } else {
        updateRemark('err', cmd, result.data);
        return;
      }
    });
  }

  function updateRemark(type, cmd, para) {
    if (type == 'clear') {
      $('#remark').html('');
    } else if (type == 'err') {
      $('#remark').html('"' + cmd + '" is not a valid command<br/>' + para);
    }
  };

  function showCanvas(data) {
    if (data.length === 0) {
      data = [
        []
      ]
    };
    let resultStr = '';
    data.forEach(row => {
      resultStr += row.join('');
      resultStr += '\n';
    })
    $('#resultArea')
      .attr('cols', data[0].length + 2)
      .attr('rows', data.length + 2)
      .html(resultStr);
  }

  function ajax(str) {
    return new Promise((res, rej) => {
      $.ajax({
        method: 'post',
        url: '/drawCommand',
        data: {
          cmd: str
        },
        content: 'jsop'
      }).done(function (data) {
        res(data);
      })
    });
  }
})