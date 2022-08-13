const { ipcRenderer } = require('electron')
let $ = require('jquery')

const settingsButton  = document.getElementById('settingsButton')
const showDiv = document.getElementById('show')
var speedoMeter1 = new speedometer(      {
    "maxVal": 26,
    "divFact": 1,
    "dangerLevel": 10,
    "gagueLabel": ""
  })
document.getElementById('speedometer-1').append(speedoMeter1.elm);

var speedoMeterInputRange = document.getElementById('speedoMeterInputRange-1');
var speedoMeterInputRangeVal = document.getElementById('speedoMeterInputRange-value-1')

const chargeLevel = document.getElementById("charge-level");
const charge = document.getElementById("charge");
const chargingTimeRef = document.getElementById("charging-time");
updateLevelInfo(100)

function updateChargingInfo() {
    if (battery.charging) {
      charge.classList.add("active");
      chargingTimeRef.innerText = "";
    } else {
      charge.classList.remove("active");

      //Display time left to discharge only when it is a integer value i.e not infinity
      if (parseInt(battery.dischargingTime)) {
        let hr = parseInt(battery.dischargingTime / 3600);
        let min = parseInt(battery.dischargingTime / 60 - hr * 60);
        chargingTimeRef.innerText = `${hr}hr ${min}mins remaining`;
      }
    }
  }

  //Updating battery level
  function updateLevelInfo(level) {
    let batteryLevel = `${parseInt(level * 1)}%`;
    charge.style.width = batteryLevel;
    chargeLevel.textContent = batteryLevel;
  }



settingsButton.addEventListener('click',function(){
    ipcRenderer.send('settingsClicked',{
        example:"this is example"
    })
})
ipcRenderer.on('sendData',function(event,args){
    //showDiv.innerHTML = args.example
    $('#show').text(args.example)
})
ipcRenderer.on('objHandle',function(event,args){
    //showDiv.innerHTML = args.example
    let speed = args.speedR
    let gasValue = args.gasValue
    let breakValue = args.breakValue
    let batteryVoltage = args.batteryVoltage
    let boardTemp = args.boardTemp
    speedoMeter1.setPosition(parseInt(speed));
    updateGas(gasValue)
    updateBreake(breakValue)
    updateLevelInfo(batteryVoltage)
    $('#tempeture').text(`${boardTemp} C`)
    console.log(args)
    $('#show').text(args.example)
})
function bar_wobble(element, height, speed, random) {
    //set the color
    $(element).css('-webkit-filter','hue-rotate('+ 140*(250/height) +'deg)'); //red = 0 deg, green = 140deg
    $(element).stop()
    //wibbly wobbly timey wimey stuff
    height = height/100*250;
    var number_of_wobbles = 3;
    for(var i=1; i<=number_of_wobbles; i++)
    {    $(element).animate({ height: (height + random/i )+'px'}, speed/(number_of_wobbles*2 + 1));
         $(element).animate({ height: (height - random/i )+'px'}, speed/(number_of_wobbles*2 + 1));
        console.log( {i: i, random_i: random/i, random:random, height:height } );
    }
    $(element).animate({ height: height+'px'}, speed/(number_of_wobbles*2 + 1));
}
function updateGas(value) { //Allows for multiple containers. Make sure input[name] = div.bar[id]
    var element = $('.attendance-level-gas');
    console.log('GAS VALUE : ' + value)
    var height = parseInt( value); // %
    var speed = 1000;  //ms
    var random = 50; //px
    bar_wobble( element, height, speed, random );
}
function updateBreake(value) { //Allows for multiple containers. Make sure input[name] = div.bar[id]
    console.log('BREAK VALUE : ' + value)
    var element = $('.attendance-level');
    var height = parseInt( value); // %
    var speed = 1000;  //ms
    var random = 50; //px
    bar_wobble( element, height, speed, random );
}
