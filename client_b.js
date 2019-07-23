// tạo biến mqtt sử dụng các chức năng của module mqtt
var mqtt = require('mqtt')
// tạo biến client sử dụng thuộc tính connect để kết nối đến broket MQTT với hostname mqtt://iot.eclipse.org
//var client = mqtt.connect('http://113.161.211.45')
var client = mqtt.connect('http://113.161.211.45')

var id_dulieu = 6 ;
var ip_server = "8.8.8.8";
var chuky_ping = 600000;
var sotingui = 1000
var ad_server = ip_server.split(".");
var str_send = "{'id_dulieu' : " + id_dulieu + ", 'ad1' : " + ad_server[0] + ", 'ad2' : " + ad_server[1] + ", 'ad3' : " + ad_server[2] + ", 'ad4' : " + ad_server[3] + ", 'chuky_ping' : " + chuky_ping + ", 'sogoitingui' : " + sotingui + "}";
client.on('connect', function() {
    console.log('Client B connected')
    client.subscribe('ping/connected');
    client.subscribe('ping/trangthai');
    client.publish('ping/setting1', str_send);
    //client.publish('ping/stop', "kkk");
    //client.publish('ping/connected', "1");
})


console.log('Client B started')


//var jsonToArduino = JSON.parse(str_send);
//client.publish('ping/setting', jsonToArduino);

client.on('message', function(topic, message) {
	// in ra màn hình console 1 message ở định dạng string
    console.log(message.toString())
    //client.publish('inTopic/sub', 'Hello from client B')
    //console.log(str_send);
    //client.publish('ping/setting', str_send);
    // đóng kết nối của client
    //client.end()
})