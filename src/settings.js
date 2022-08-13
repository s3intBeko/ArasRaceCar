let $ = require('jquery')
const { ipcRenderer } = require('electron')

const saveButton  = document.getElementById('saveButton')
const cancelButton  = document.getElementById('cancelButton')

ipcRenderer.on('sendRangeData',function(event,args){
    console.log('Handle Range Data')
    console.log(args)
    //showDiv.innerHTML = args.example
    $('#rangeBreakMin').val(args.breakMin)
    $('#rangeBreakMax').val(args.breakMax)
    $('#rangeGasMin').val(args.gasMin)
    $('#rangeGasMax').val(args.gasMax)
    $('#rangeBreakMinValue').text(args.breakMin)
    $('#rangeBreakMaxValue').text(args.breakMax)
    $('#rangeGasMinValue').text(args.gasMin)
    $('#rangeGasMaxValue').text(args.gasMax)
})
saveButton.addEventListener('click',function(){
    $('input[type=range]').each(function() {
        console.log(this.name ,this.value)
    })
    ipcRenderer.send('settingSaveClicked',{
        values:{
            breakMin:$('#rangeBreakMin').val(),
            breakMax:$('#rangeBreakMax').val(),
            gasMin:$('#rangeGasMin').val(),
            gasMax:$('#rangeGasMax').val()
        }
    })
})
cancelButton.addEventListener('click',function(){
    ipcRenderer.send('settingCancelClicked',{
    })
})