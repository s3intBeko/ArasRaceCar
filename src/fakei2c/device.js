class FakeDevice{
    constructor(cb,timeDelay){
        this.callback = cb
        this.delay = timeDelay
    }
    start(){
        let that = this
        setInterval(function(){
            let randomSpeed = that.getRandomArbitrary(0,35)
            let randomBattery = that.getRandomArbitrary(0,100)
            let randomGas = that.getRandomArbitrary(0,100)
            let randomBreak = that.getRandomArbitrary(0,100)
            let readedObj ={
                connected:true,
                start:Math.random(),
                cmd1:12,
                cmd2:13,
                speedR:randomSpeed,
                speedL:randomSpeed,
                batteryVoltage:randomBattery,
                boardTemp:21,
                chargeStatus:0,
                checkSum:0,
                gasValue:randomGas,
                breakValue:randomBreak,
                gasMin:1,
                gasMax:790,
                breakMin:5,
                breakMax:500,
                sensors:{
                    sensor1:0,
                    sensor2:0,
                }
            }
            that.callback(readedObj)
        },this.delay)
    }
    sendMessage(args){
        console.log(args)
    }
    getRandomArbitrary(min, max) {
        return Math.random() * (max - min) + min;
    }
}
exports.FakeDevice = FakeDevice