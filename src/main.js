const { app, BrowserWindow ,ipcMain } = require('electron')
const path = require('path')
const config = require('./config')
const os = require("os")
const {currentLoad, manufacturer,  cpu } = require("systeminformation")

let mainWindow
let prop = {
    showFrame:true,
    show:false,
    webDev:false,
    maximize:false
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
    if(prop.maximize)
        mainWindow.maximize();
    mainWindow.loadFile(path.join(__dirname,'index.html'))
    if(prop.webDev)
        mainWindow.webContents.openDevTools()
    mainWindow.show()
    const name = await cpu()
    console.log(name)
})

 
ipcMain.on("settingsClicked",function (event, arg) {
    event.sender.send('sendData',{
        example:"this is example"
    })
       
});