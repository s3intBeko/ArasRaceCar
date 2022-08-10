const dotenv = require('dotenv')
const path = require('path')
dotenv.config({ path: path.join(__dirname, '.env') })

let envVars = process.env

module.exports = {
   showFrame:envVars.SHOWFRAME,
   show:envVars.SHOW,
   webDevKit:envVars.WEB_DEV,
   maximize:envVars.MAXIMIZE,
   width:envVars.WIDTH,
   height:envVars.HEIGHT
  }