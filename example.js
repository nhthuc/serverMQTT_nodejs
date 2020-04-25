
// usage: node ./example.js [IP] [timeout in seconds]

var Ping = require('./ping');
let idData;
let id = 1;
let downloadSpeed;
let uploadSpeed;
let ping;
let avgPing;
let success;
let fail;
let total;
let packagePing = 10;
let ip = '8.8.8.8';
function init(){
	downloadSpeed = 0;
	uploadSpeed = 0;
	ping = 0;
	avgPing = 0;
	success = 0;
	fail = 0;
	total = 0;
	packagePing = 5;
  }
//   setInterval(pingSpeed, 10000)
pingSpeed();
function pingSpeed(){
	init();
	Ping.configure();
	var ping = new Ping(ip);
	ping.on('ping', function(data){
	  total = total + parseInt(data.time);
	  success++;
	  console.log(data.time)
	  if (success + fail == packagePing){
		avgPing = Math.round((total / success) * 100) / 100;
		ping.stop();
		// test();
		// testDownload();
		console.log(avgPing)
		setTimeout(pingSpeed, 2000)
	  }
	});
  
	ping.on('fail', function(data){
	  fail++;
	  if (success + fail == packagePing){
		ping.stop();
		console.log(avgPing)
		setTimeout(pingSpeed, 2000)
		// test();
		// testDownload();
	  }
	  console.log('Fail', data);
	});
  }

function pingSpeed1(){
	Ping.configure();

var ping = new Ping('8.8.8.8');
var success = 0;
var fail = 0;
ping.on('ping', function(data){
	success++;
	console.log('Ping %s: time: %d ms', data.host, data.time);
	if (success + fail == 10){
		ping.stop();
	}
});

ping.on('fail', function(data){
	fail++;
	if (success + fail == 10){
		ping.stop();
	}
	console.log('Fail', data);
});
}
// load configuration from file 'config-default-' + process.platform
// Only linux is supported at the moment



