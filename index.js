var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mqtt = require('mqtt')
var moment = require('moment');
var client  = mqtt.connect('<username>:<password>@eu.thethings.network:1883')

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

io.on('connection', function(socket){
  console.log('emit');
});

client.on('connect', function () {
  client.subscribe('+/devices/+/up', function (err) {
    if (err) {
      console.log('subscribe error');
    }
  })
})
 
client.on('message', function (topic, message) {
  var mess = JSON.parse(message.toString());
  var position = {
    id: mess.dev_id,
    time: moment(mess.metadata.time).format('YYYY-MM-DD HH:mm:ss'),
    lat: mess.payload_fields.lat,
    lng: mess.payload_fields.lng,
  }
  io.emit('position', position);
})