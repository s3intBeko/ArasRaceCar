const { config } = require('dotenv');
const { app, BrowserWindow } = require('electron');
const { ipcMain , dialog } = require('electron')
const path = require('path')
let mainWindow
let prop = {
    showFrame:true,
    show:false,
    webDev:false,
    maximize:false
}
app.on('ready', function() {
    mainWindow = new BrowserWindow({ 
        width: 1024,
        height: 768,
        frame: prop.showFrame,
        show:prop.show,
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
    mainWindow.show();
})

 
ipcMain.on("settingsClicked",function (event, arg) {
    event.sender.send('sendData',{
        example:"this is example"
    })
       
});