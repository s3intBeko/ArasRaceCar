const i2c = require('i2c-bus');
const ADDR = 0x18;
const {Buffer} = require('node:buffer')
const CMD = 0x10;
class Device {
    constructor(cb,timeDelay=1000){
        this.callback = cb  
        this.delay = timeDelay
        this.i2cDevice 
        this.state = 'init' 
        this.connected = false  
    }
    open(){
        this.i2cDevice = i2c.open(1,function(err){
            if(err){
                console.log('error openinig bus',err)
                this.connected = false
            }else{
                this.connected = true
            }
        })
    }
    start(){
        let that = this
        setInterval(function(){
            if(!that.connected){
                that.open()
                return
            }
            const arr = new Uint16Array(32);
            const buffer = Buffer.from(arr)
            try {
                that.i2cDevice.readI2cBlockSync(ADDR, 2, 32, buffer)
            } catch (error) {
                that.connected = false
                let readedObj = {
                    connected :false
                }
                that.callback(readedObj)
            }
            
            let all2ByteData = []
            for(let i=0;i < 30;i=i+2){
                all2ByteData.push((buffer.slice(i,i+2)).readUInt16LE())
            }
            let all1ByteData = []
            for(let i=30;i< 32;i++){
                all1ByteData.push(buffer.slice(i,i+1).readUInt8())
            }
            let readedObj ={
                connected:that.connected,
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
            that.callback(readedObj)

        },this.delay)
        
    }
    sendData(data){
        if(!this.connected){
            return
        }
        const arr = new Uint16Array(4);
        arr[0] = data.gasMin
        arr[1] = data.gasMax
        arr[2] = data.breakMin
        arr[3] = data.breakMax
        let buf = Buffer.from(arr.buffer)
        this.i2cDevice.writeI2cBlockSync(ADDR,CMD,8,buf)        
    }

}
exports.Device = Device