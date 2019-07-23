#include <SPI.h>         
#include <Ethernet.h>
#include <ICMPPing.h>
#include <PubSubClient.h>
#include <SimpleTimer.h>
#include <ArduinoJson.h>

SimpleTimer timer;

byte mac[] = {0xDE, 0xAD, 0xBE, 0xEF, 0xFE, 0xED}; // max address for ethernet shield
//byte ip_client[] = {192,168,20,120}; // ip address for ethernet shield
IPAddress pingAddr(8,8,8,8); // ip address to ping
const char* mqttServer = "113.161.211.45";
const int mqttPort = 1883;

SOCKET pingSocket = 0;
ICMPPing ping(pingSocket, (uint16_t)random(0, 255));
EthernetClient ethClient;
PubSubClient client(ethClient);

const char* chuky_ping = "10000";
const char* sogoitingui = "100";
const char* id_dulieu = "1";
const char* ad1 = "8";
const char* ad2 = "8";
const char* ad3 = "8";
const char* ad4 = "8";
const char* id_tb = "1";

int a1 = 8;
int a2 = 8;
int a3 = 8;
int a4 = 8;
int id_DL = 1;
int index = 0;
int chuky = 10000;
int sogoitin = 100;
int timer_sl = 0;
void callback(char* topic, byte* payload, unsigned int length)
{
  StaticJsonBuffer<200> jsonBuffer;
  //char inData[256];
  if (strcmp(topic,"ping/setting1")==0){
        char inData[length];
        for(int i =0; i<length; i++){
          inData[i] = (char)payload[i];
        }
         JsonObject& root = jsonBuffer.parseObject(inData);  
         id_dulieu = root["id_dulieu"];
         ad1 = root["ad1"];
         ad2 = root["ad2"];
         ad3 = root["ad3"];
         ad4 = root["ad4"];
         chuky_ping = root["chuky_ping"];
         sogoitingui = root["sogoitingui"];

         sogoitin = atoi(sogoitingui);
         chuky = atoi(chuky_ping);
         id_DL = atoi(id_dulieu);
         a1 = atoi(ad1);
         a2 = atoi(ad2);
         a3 = atoi(ad3);
         a4 = atoi(ad4);
         
         index = 1;
         timer_sl = timer.setInterval(chuky, ping_init);
     }

     if (strcmp(topic,"ping/stop1")== 0 && index == 1){
      //client.publish("ping/test", "reset1");
          timer.disable(timer_sl);
     }
     if (strcmp(topic,"ping/restart1")== 0 && index == 1){
      //client.publish("ping/test", "reset1");
          timer.enable(timer_sl);
     }

     if (strcmp(topic,"ping/connected")== 0 && index == 1){
          char coKetNoi [10];
          sprintf(coKetNoi, "%d:%d",
            id_DL,
            id_tb);
          client.publish("ping/test", coKetNoi);
     }
}
int led_power = 10;
int led_conneted = 8;
int led_notConnect = 9;
int reset_m = 12;
int trangthai_goitin = 0;
char tt [256];

void reconnect() {
  digitalWrite(led_conneted, LOW);
  while (!client.connected()) {
    if (client.connect("VNPT-001")) {
      client.publish("ping/connect", id_tb);
      client.subscribe("ping/setting1");
      client.subscribe("ping/connected");
      client.subscribe("ping/stop1");
      client.subscribe("ping/restart1");
      digitalWrite(led_conneted, HIGH);
    }
  }
}

void ping_data(int soLuongGoiTin)
{
  for (int i = 0; i < soLuongGoiTin; i++)
  {
  ICMPEchoReply echoReply = ping(pingAddr, 4);
  if (echoReply.status == SUCCESS)
  {
    trangthai_goitin = 1;
    sprintf(tt, "%d:%d:%ld:%d:%d", 
                id_DL,
                REQ_DATASIZE, 
                millis() - echoReply.data.time, 
                echoReply.ttl, 
                trangthai_goitin);
  }
  else
  {
    trangthai_goitin = 0;
    sprintf(tt, "%d:%d:%ld:%d:%d", 
                id_DL,
                trangthai_goitin, 
                trangthai_goitin, 
                trangthai_goitin, 
                trangthai_goitin);
  }
  while (!client.connected()) {
    reconnect();
  }
  client.publish("ping/goitin", tt);
  //delay(100);
  }
  char hoanthanh [10];
  sprintf(hoanthanh, "%d:%d",
          id_DL,
          1);
  client.publish("ping/hoanthanh", hoanthanh);
}
void ping_init()
{
  IPAddress pingAddr(a1,a2,a3,a4); 
   ping_data(sogoitin);
   
}
void setup() 
{
  pinMode(led_power, OUTPUT);
  pinMode(led_conneted, OUTPUT);
  pinMode(led_notConnect, OUTPUT);
  Serial.begin(9600);
  while(Ethernet.begin(mac) == 0)
  {
    digitalWrite(led_notConnect, LOW);
  }
  digitalWrite(led_notConnect, HIGH);
  client.setServer(mqttServer, mqttPort);
  client.setCallback(callback);
  while (!client.connected()) {
    reconnect();
    client.publish("ping/thietbi", id_tb);
  }
}
  
void loop()
{
  timer.run();
  digitalWrite(led_power, HIGH);
  client.loop();
}


