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

speedoMeterInputRange.onchange = function(e){
    speedoMeter1.setPosition(e.target.value);
    updateLevelInfo(e.target.value)
    speedoMeterInputRangeVal.innerText = e.target.value;
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
