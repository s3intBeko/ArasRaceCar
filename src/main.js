const { app, BrowserWindow ,ipcMain } = require('electron')
const path = require('path')
const config = require('./config')
const os = require("os")
const {currentLoad, manufacturer,  cpu } = require("systeminformation")
const { DeviceObject } = require('./deviceObject')
const { event } = require('jquery')

let mainWindow
let device
let status = 'idle'
let prop = {
    showFrame:true,
    show:false,
    webDev:false,
    maximize:false
}
let rangeData = {
    breakMin:0,
    breakMax:0,
    gasMin:0,
    gasMax:0
}
app.on('ready', async function() {
    mainWindow = new BrowserWindow({ 
        width: config.width ,
        height: config.height,
        frame: config.showFrame,
        show:config.show,
        webPreferences:{
            nodeIntegration:true,
            contextIsolation: false,
        }
    });
    mainWindow.menuBarVisible = false
    if(config.maximize)
        mainWindow.maximize();
    mainWindow.loadFile(path.join(__dirname,'disconnected.html'))
    if(config.webDevKit)
        mainWindow.webContents.openDevTools()
    mainWindow.show()
    const name = await cpu()
    if(name.vendor == 'ARM'){
        console.log("Arm Loading...")
        const { Device } = require('./device')
        device = new  Device(deviceCallback,config.deviceRate)
        device.start()
    }else{
        const { FakeDevice } = require('./fakei2c/device')
        device = new FakeDevice(deviceCallback,4000)
        device.start()
    }
    
    //console.log(name)
})
 
function deviceCallback(obj) {
    let devObj = new DeviceObject()
    Object.assign(devObj,obj)
    if(!devObj.connected){
        
        mainWindow.loadFile(path.join(__dirname,'disconnected.html'))
    }else{
        
        if(status == 'settings') return
        rangeData.breakMax = devObj.breakMax
        rangeData.breakMin = devObj.breakMin
        rangeData.gasMax = devObj.gasMax
        rangeData.gasMin = devObj.gasMin
        let currentUrl = mainWindow.webContents.getURL()
        if(!currentUrl.endsWith('index.html')){
            mainWindow.loadFile(path.join(__dirname,'index.html'))
        }else{
            mainWindow.webContents.send('objHandle',devObj)
        }
    }
    
    
}
ipcMain.on("settingSaveClicked",function (event, arg) {
    status ='idle'
    mainWindow.loadFile(path.join(__dirname,'disconnected.html'))
   console.log(arg)
});
ipcMain.on("settingCancelClicked",function (event, arg) {
    status ='idle'
    mainWindow.loadFile(path.join(__dirname,'disconnected.html'))
});
ipcMain.on("settingsClicked",function (event, arg) {
    status = 'settings'
    mainWindow.loadFile(path.join(__dirname,'settings.html'))
    mainWindow.webContents.on('did-finish-load', function() {
        mainWindow.webContents.send('sendRangeData',rangeData)
    });
    
   /* event.sender.send('sendData',{
        example:"this is example"
    })*/
       
});