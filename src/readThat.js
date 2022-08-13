
const raspi = require('raspi');
const I2C = require('raspi-i2c').I2C;
const { Buffer } = require('node:buffer')
raspi.init(() => {
  const i2c = new I2C();
  setInterval(function(){
	  try{
		let rawData = i2c.readSync(0x18,2,27)
		console.log(rawData);
		let all2ByteData= []
		for(let i=0;i < 22;i=i+2){
		  all2ByteData.push((rawData.slice(i,i+2)).readUInt16LE())
		}
		all1ByteData = []
		for(let i=22;i< 27;i++){
		  all1ByteData.push(rawData.slice(i,i+1).readUInt8())
		}		
		console.log(all2ByteData)
		console.log(all1ByteData)
	}
	catch(err){
		console.log('error : ' + err)
	}
  },1000)
  
   // Read one byte from the device at address 18
});
