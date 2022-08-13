const dotenv = require('dotenv')
const path = require('path')
dotenv.config({ path: path.join(__dirname, '../.env') })

let envVars = process.env

module.exports = {
   showFrame:envVars.SHOWFRAME == 'true'?true:false,
   show:envVars.SHOW== 'true'?true:false,
   webDevKit:envVars.WEB_DEV== 'true'?true:false,
   maximize:envVars.MAXIMIZE== 'true'?true:false,
   width:Number(envVars.WIDTH),
   height:Number(envVars.HEIGHT),
   deviceRate:Number(envVars.DEVICE_RATE)
  }