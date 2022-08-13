
#include <Wire.h>
#include <Servo.h>
#define HOVER_SERIAL_BAUD   115200   
#define SERIAL_BAUD         115200      // [-] Baud rate for built-in Serial (used for the Serial Monitor)
#define START_FRAME         0xABCD       // [-] Start frme definition for reliable serial communication
#define TIME_SEND           100  
#define gasPin A0
#define breakPin A2
#define MASTER_ADRESS 0x18

int gasRefMin = 0;
int gasRefMax = 790;

int breakRefMin = 0;
int breakRefMax = 0;
typedef struct __message_type
{
  byte cmd;
  byte address;
  bool payload;
} message_t;

typedef struct __msg_type
{
 int16_t  gMin;
 int16_t  gMax;
 int16_t  bMin;
 int16_t  bMax;
} receive_msg_t;


typedef struct __send_message_type
{
 uint16_t start;
 int16_t  cmd1;
 int16_t  cmd2;
 int16_t  speedR_meas;
 int16_t  speedL_meas;
 int16_t  batVoltage;
 int16_t  boardTemp;
 uint16_t cmdLed;
 uint16_t checksum;
 int gas_value;
 int break_value;
 uint16_t  gasMax;
 uint16_t gasMin;
 uint16_t  breakMax;
 uint16_t breakMin; 
 uint8_t  sensor1;
 uint8_t sensor2;
 
 
} send_message_t;

send_message_t current_values = {1,0,0,0,0,0,0,0,0,0,327,0,790,0,500,30,40};

float start_time, finished_time;
float elapsed;
Servo myservo; 
int val;
//const byte gasPin = A0;
volatile boolean l;
int gasRawValue = 0;
int gasValue = 0;
int breakRawValue = 0;
int breakValue = 0;
int pwmValue = 0;
unsigned long iTimeSend = 0;
unsigned long bTimeSend = 0;
unsigned long cTimeSend = 0;

// Global variables
uint8_t idx = 0;                        // Index for new data pointer
uint16_t bufStartFrame;                 // Buffer Start Frame
byte *p;                                // Pointer declaration for the new received data
byte incomingByte;
byte incomingBytePrev;

typedef struct{
   uint16_t start;
   int16_t  steer;
   int16_t  speed;
   uint16_t checksum;
} SerialCommand;
SerialCommand Command;


typedef struct{
   uint16_t start;
   int16_t  cmd1;
   int16_t  cmd2;
   int16_t  speedR_meas;
   int16_t  speedL_meas;
   int16_t  batVoltage;
   int16_t  boardTemp;
   uint16_t cmdLed;
   uint16_t checksum;
} SerialFeedback;
SerialFeedback Feedback;
SerialFeedback NewFeedback;

void setup() {
  Serial.begin (115200);
  myservo.attach(9);
  Serial.println("HoverBoard Car V0.1");
  Serial1.begin(HOVER_SERIAL_BAUD);
  Wire.begin(MASTER_ADRESS);
  Wire.onReceive(receiveEvent);
  Wire.onRequest(sendData);
}
void Send(int16_t uSteer, int16_t uSpeed)
{
  // Create command
  Command.start    = (uint16_t)START_FRAME;
  Command.steer    = (int16_t)uSteer;
  Command.speed    = (int16_t)uSpeed;
  Command.checksum = (uint16_t)(Command.start ^ Command.steer ^ Command.speed);
  //Serial.println(uSpeed);
  // Write to Serial
  Serial1.write((uint8_t *) &Command, sizeof(Command)); 
}
void sendGasValue(){
  unsigned long timeNow = millis();
  if (iTimeSend > timeNow) return;
  iTimeSend = timeNow + TIME_SEND;
  Send(0, pwmValue);

}
void calculateBreake(){
  breakRawValue = analogRead(breakPin);
  breakValue = map(breakRawValue, 0, 1023, 0, 180);     // scale it to use it with the servo (value between 0 and 180)
  unsigned long bTimeSend = 0;
  unsigned long timeNow = millis();
  if (bTimeSend > timeNow) return;
  //Serial.print("Break:");
  //Serial.println(breakValue);
  myservo.write(breakValue);   
}
void calculateGas(){
  //Serial.println(gasRawValue); 
   gasRawValue = analogRead(gasPin);
  if(gasRawValue != gasValue){
        gasValue = gasRawValue;
      }
     
   if(gasValue < gasRefMin) gasValue = gasRefMin;
   if(gasValue > gasRefMax) gasValue = gasRefMax;
   pwmValue = map(gasValue,gasRefMin,gasRefMax,0,1000);
   if(pwmValue != 0){
    //Serial.println(pwmValue); 
    
   }
   //Serial.println(pwmValue);
   sendGasValue();
   
}
void Receive()
{
    // Check for new data availability in the Serial buffer
    if (Serial1.available()) {
        incomingByte    = Serial1.read();                                   // Read the incoming byte
        bufStartFrame = ((uint16_t)(incomingByte) << 8) | incomingBytePrev;       // Construct the start frame
    }
    else {
        return;
    }

  // If DEBUG_RX is defined print all incoming bytes
  #ifdef DEBUG_RX
        Serial.print(incomingByte);
        return;
    #endif

    // Copy received data
    if (bufStartFrame == START_FRAME) {                     // Initialize if new data is detected
        p       = (byte *)&NewFeedback;
        *p++    = incomingBytePrev;
        *p++    = incomingByte;
        idx     = 2;  
    } else if (idx >= 2 && idx < sizeof(SerialFeedback)) {  // Save the new received data
        *p++    = incomingByte; 
        idx++;
    } 
    
    // Check if we reached the end of the package
    if (idx == sizeof(SerialFeedback)) {
        uint16_t checksum;
        checksum = (uint16_t)(NewFeedback.start ^ NewFeedback.cmd1 ^ NewFeedback.cmd2 ^ NewFeedback.speedR_meas ^ NewFeedback.speedL_meas
                            ^ NewFeedback.batVoltage ^ NewFeedback.boardTemp ^ NewFeedback.cmdLed);

        // Check validity of the new data
        if (NewFeedback.start == START_FRAME && checksum == NewFeedback.checksum) {
            // Copy the new data
            memcpy(&Feedback, &NewFeedback, sizeof(SerialFeedback));

            // Print data to built-in Serial
            Serial.print("1: ");   Serial.print(Feedback.cmd1);
            Serial.print(" 2: ");  Serial.print(Feedback.cmd2);
            Serial.print(" 3: ");  Serial.print(Feedback.speedR_meas);
            Serial.print(" 4: ");  Serial.print(Feedback.speedL_meas);
            Serial.print(" 5: ");  Serial.print(Feedback.batVoltage);
            Serial.print(" 6: ");  Serial.print(Feedback.boardTemp);
            Serial.print(" 7: ");  Serial.println(Feedback.cmdLed);
        } else {
          Serial.println("Non-valid data skipped");
        }
        idx = 0;    // Reset the index (it prevents to enter in this if condition in the next cycle)
    }

    // Update previous states
    incomingBytePrev = incomingByte;
}
void receiveEvent(int byteCount){
  Serial.println("Success Receiver Event");
  //digitalWrite(LED1,LOW);
  int numOfBytes = Wire.available();
  Serial.print("Byte Count:");
  Serial.println(numOfBytes);
  //byte c = Wire.read();
  //if(c == 48)
  //{
   // if(numOfBytes == 4)
   // {
      /*message_t message;
      message.cmd = Wire.read();
      message.address = Wire.read();
      message.payload = (int)Wire.read();
      if(message.cmd == 0xa0)
      {
        for(int i=0;i<7;i++)
        {
         
          
        }
        Serial.println("Success Readed 1");
      }else if(message.cmd == 0x2)
      {
        Serial.println("Success Readed 2");
      }
      
    }
    else{
      for(int i=0;i<numOfBytes-1;i++)
      {
        byte b = Wire.read();
        Serial.print("Normal : ");
        Serial.println(b);
        Serial.print("Hex : ");
        Serial.println(b,HEX);
        Serial.print("Dec ");
        Serial.println(b,DEC);
     }*/
   // }
  //}
 // else if(c == 10){
    
    //receive_msg_t rec;
    /*rec.gMin = Wire.read();
    rec.gMin |=  Wire.read() << 8;
    rec.gMax =  Wire.read();
    rec.gMax |= Wire.read() << 8;*/
    /*
    (( result[0] | result[1]<<8)>>2);
    */
    /*while(Wire.available())
    { 
      
      d.buffer[i++] = Wire.read(); 
      Serial.print("Normal : ");
      Serial.println(d.buffer[i-1]);
      Serial.print("Hex : ");
      Serial.println(d.buffer[i-1],HEX);
      Serial.print("Dec ");
      Serial.println(d.buffer[i-1],DEC);
    }*/
    
   
    /*rec.gMin[0] = data[0];
    rec.gMin[1] = data[1];
    rec.gMax[0] = data[2];
    rec.gMax[1] = data[3];
    rec.bMin[0] = data[4];
    rec.bMin[1] = data[5];
    rec.bMax[0] = data[6];
    rec.bMax[1] = data[7];*/
    /*Serial.print("Gmax : ");
    Serial.print(rec.gMax);
    Serial.print(" Gmin : ");
    Serial.println(rec.gMin);*/
    /*Serial.print("Bmax : ");
    Serial.print(rec.bMax);
    Serial.print(" Bmin : ");
    Serial.println(rec.bMin);*/
    
    
  //}else{
  //}  
  
}
void sendData()
{
    Wire.write((byte*) &current_values, sizeof(send_message_t));   
}
void loop() {
  calculateGas();
  calculateBreake();
  Receive();
}