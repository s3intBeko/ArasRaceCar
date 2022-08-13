
const raspi = require('raspi')
const I2C = require('raspi-i2c').I2C
class Device {
    constructor(cb,timeDelay=1000){
        this.callback = cb  
        this.delay = timeDelay      
    }
    start(){
        raspi.init(()=>{
            const i2c = new I2C()
            setInterval(function(){
                try{
                    let rawData = i2c.readSync(0x18,2,32)
                    let all2ByteData= []
                    for(let i=0;i < 30;i=i+2){
                        all2ByteData.push((rawData.slice(i,i+2)).readUInt16LE())
                    }
                    let all1ByteData = []
                    for(let i=30;i< 32;i++){
                        all1ByteData.push(rawData.slice(i,i+1).readUInt8())
                    }
                    let readedObj ={
                        connected:true,
                        start:all2ByteData[0],
                        cmd1:all2ByteData[1],
                        cmd2:all2ByteData[2],
                        speedR:all2ByteData[3],
                        speedL:all2ByteData[4],
                        batteryVoltage:all2ByteData[5],
                        boardTemp:all2ByteData[6],
                        chargeStatus:all2ByteData[7],
                        checkSum:all2ByteData[8],
                        gasValue:all2ByteData[9],
                        breakValue:all2ByteData[10],
                        gasMin:all2ByteData[11],
                        gasMax:all2ByteData[12],
                        breakMin:all2ByteData[13],
                        breakMax:all2ByteData[14],
                        sensors:{
                            sensor1:all2ByteData[0],
                            sensor2:all2ByteData[1]
                        }
                    }
                    this.callback(readedObj)

                }catch(err){
                    this.callback({
                        connected:false
                    })
                }
            },this.delay)
        })
    }

}

exports.Device = Device