var mqtt = require('mqtt');
var ac = require('./action_sql.js');

var client = mqtt.connect('http://113.161.211.45')
//var client = mqtt.connect('http://192.168.0.102')

var trangthai_goitin;
var kichthuoc_goitin;
var ping_time;
var ping_ttl;
var str_ping;

client.on('connect', function() {
    console.log('Client A connected')
    client.subscribe('ping/goitin');
    client.subscribe('ping/hoanthanh');
    client.subscribe('ping/connect');
    client.subscribe('ping/setting1');
    client.subscribe('ping/test');
    client.subscribe('ping/stop1');
    client.subscribe('ping/thietbi');
})

client.on('message', (topic, message) => {
  switch (topic) {
    case 'ping/goitin':
      messageFromArduino(message);
      console.log(message.toString());
      break;
    case 'ping/hoanthanh':
      console.log("hoang thanh " + message.toString());
      UpdateTrangthaiMotLanPing(message);
      break;
  	case 'ping/connect':
  		Update_trangthai_TB(message);
      console.log("connect " + message.toString());
      break;
    case 'ping/setting1':
      console.log(message.toString());
      break;
  	case 'ping/test':
  		Update_trangthai_DL_tb(message);
  		console.log("test : " + message.toString());
  		break;
  	case 'ping/stop1':
  		console.log(message.toString());
  		break;
  	case 'ping/thietbi':
	    Reset_setting(message);
	    console.log("thiet bi" + message.toString());
      	break;
  }
  })

function messageFromArduino(message){
	var str = message.toString();
	var s_str = str.split(":");
	console.log('id du lieu %s : kich thuoc %s : thoi gian %s : tll  %s : trang thai %s', s_str[0], s_str[1], s_str[2], s_str[3], s_str[4] );
	ac.Insert_server(s_str[0], s_str[1], s_str[2], s_str[3], s_str[4]);
}

function UpdateTrangthaiMotLanPing(message){
	var str = message.toString();
	var s_str = str.split(":");
	//console.log('hoan thanh %s : trang thai %s', s_str[0],s_str[1]);
	ac.Update_trangthai_hoanthanh(s_str[0],s_str[1]);
}

function Update_trangthai_DL_tb(message){
	var str = message.toString();
	var s_str = str.split(":");
	ac.read_trangthai_DL_TB_ById(s_str[0], s_str[1]);
}
function V1_Update_trangthai_DL_tb(message, str0, str1){
	if ((message == 0 || message == 1) && str1 == 1) {
		ac.Update_trangthai_DL_TB(str0, 1); // csdl tttb == 1 => binh thuong
	}
}
module.exports.V1_Update_trangthai_DL_tb=V1_Update_trangthai_DL_tb;

function Update_trangthai_TB(message){
	var str = message.toString();
	ac.Read_trangthaiTB_byID(str);
}
function V1_Update_trangthai_TB(message, str) {
	if (message == 0) {
		ac.Update_trangthaiTB(str,1); 
	}
}
module.exports.V1_Update_trangthai_TB=V1_Update_trangthai_TB;

function Reset_setting(message){
	var str = message.toString();
	ac.Update_trangthaiHD_TB(str,"1");
	ac.Update_trangthaiHD_TB1(str,"1");
	ac.Reset_setting_byID_TB(str);
}
function V1_Reset_setting(message, str){
	if (message != -1) {
		var topic = "ping/setting" + str;
		client.publish(topic, message);
	}
}
module.exports.V1_Reset_setting=V1_Reset_setting;

setInterval(function() {
	ac.Update_trangthai_toanbo_TB(1,0);
	client.publish('ping/connected', "1");
	}, 60000);

console.log('Client A started')