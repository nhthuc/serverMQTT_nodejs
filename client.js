const crypto = require('crypto');
const http = require('http');
var Ping = require('./ping');
var mqtt = require('mqtt')
const randomData = crypto.randomBytes(1024 * 1024 * 10);

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
let timeRepeat = 1000;
var client = mqtt.connect('ws://146.148.59.18:8000',{clientId:id.toString()})
var repeatTest;

client.on('connect', function() {
    console.log('Client B connected')
    client.subscribe('dv1');
    client.subscribe('setting');
    client.subscribe('dv1status');
})

client.on('message', (topic, message) => {
  switch (topic) {
    case 'dv1':
      setting(message.toString())
      console.log(message.toString());
      break;
    case 'setting':
      console.log(message.toString());
      break;
    case 'dv1status':
      console.log(message.toString());
      stopRepeat(message.toString());
      break;
  }
})
function setting(message){
  var control = JSON.parse(message);
  idData =parseInt(control.idData);
  console.log("ip "+control.ipServer)
  console.log("timeRepeat"+control.timeRepeat)
  if (control.ipServer != null) {
    ip = control.ipServer;
  }
  timeRepeat = parseInt(control.timeRepeat)*60*1000;
  pingSpeed();
}

function stopRepeat(message){
  clearInterval(repeatTest);
}

function init(){
  downloadSpeed = 0;
  uploadSpeed = 0;
  ping = 0;
  avgPing = 0;
  success = 0;
  fail = 0;
  total = 0;
  packagePing = 10;
}
function pingSpeed(){
  init();
  Ping.configure();
  var ping = new Ping(ip);
  ping.on('ping', function(data){
    total = total + parseInt(data.time);
    success++;
    if (success + fail == packagePing){
      avgPing = Math.round((total / success) * 100) / 100;
      ping.stop();
      console.log(avgPing)
      setTimeout(() => {
        testDownload();
      }, 2000);
    }
  });

  ping.on('fail', function(data){
    fail++;
    if (success + fail == packagePing){
      ping.stop();
      setTimeout(() => {
        testDownload();
      }, 2000);
    }
    console.log('Fail', data);
  });
}
// Set the host and port if supplied
let host = '146.148.59.18';
let path = '/';
// Set request options
let options = {
  hostname: host,
  path: path,
  port: 3000
};
let optionsUp = {
  hostname: host,
  path: path,
  port: 3001
};

function testDownload() {
  http.get(options, (res) => {
    let oldSize = 0;
    let newSize = 0;
    let baseTime = new Date().getTime();
    res.on('error', () => {
      // console.log('Error downloading! Please check your connection information.');
    });

    res.on('data', (data) => {
      newSize += data.length;
      let currentTime = new Date().getTime();
      if (currentTime - baseTime > 1000) {
        baseTime = currentTime;
        let sizeDiff = newSize - oldSize;
        oldSize = newSize;
      }
    });

    res.on('end', () => {
      let currentTime = new Date().getTime();
      let finalTime = currentTime - baseTime;
      let finalSize = newSize - oldSize;
      let finalSpeed = (finalSize) / (finalTime / 1000);
      downloadSpeed = (Math.round(finalSpeed * 8))/1000000;
      setTimeout(() => {
        testUpload()
      }, 2000);
    });
  });
}

function testUpload() {
  let baseTime = new Date().getTime();

  // console.log('Testing upload speed...');
  optionsUp.method = 'POST';

  let req = http.request(optionsUp);

  req.on('error', () => {
    // console.log('Error uploading! Please check your connection information.');
  });

  req.end(randomData, () => {
    let currentTime = new Date().getTime();
    let finalTime = currentTime - baseTime;
    let finalSpeed = (1024 * 1024 * 10) / (finalTime / 1000);
    uploadSpeed = (Math.round(finalSpeed * 8)) / 10000000;

    console.log("ping: "+ avgPing + "; dowload speed: " + downloadSpeed + "; upload: " + uploadSpeed);
    publicData();
    repeatTest = setTimeout(() => {
      pingSpeed()
    }, timeRepeat);
    
  });
  
}
function publicData(){
  var data = {idData: idData, idDevice: id, ping : avgPing, download : downloadSpeed, upload : uploadSpeed}
  client.publish('data',JSON.stringify(data));
}

