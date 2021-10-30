var mqtt = require('mqtt')
var mysql = require('mysql');
var pool = mysql.createPool({
  host: "192.168.212.49", //remote mysql database
  user: "#####",
  database: "#####",
  password: "*******",
  connectionLimit: 20,
  supportBigNumbers: true
});

console.log("Server started");

var client  = mqtt.connect('mqtt://localhost')

client.on('connect', function () {
  client.subscribe('location', function (err) {
    if (!err) {
        client.on('message', function (topic, message) {
            console.log("Data received");
            insertData(message);
        })
    }
  })
})

/*
//For Testing code


for(var i= 0; i<500;i++){
 var Data = JSON.stringify({'did':'DMA_v4_1','date':'2021-10-25','time':'22:58:28','lat':23.80496788,'lng':90.35440826,'sat':13,'sg1':0,'sg2':16,'sim':2,'bat':99,'crg':0,'sos':0,'eeprom':'0'});
 insertData(Data);
 console.log(i+" Data send");
}
*/
function insertData(json){

  data=JSON.parse(json);
  var d = new Date();
  d.toLocaleString('en-US', { timeZone: 'Asia/Dhaka' });
  d = new Date(d.toLocaleString('en-US', { timeZone: 'Asia/Dhaka' }));
  var Year = d.getFullYear();
  var Month = parseInt(d.getMonth())+1;
  var Day = d.getDate();
  var Hour = d.getHours();
  var Min = d.getMinutes();
  var Sec = d.getSeconds();

  var FullDate = Year+"-"+Month+"-"+Day+" "+Hour+":"+Min+":"+Sec;
  var sql = `INSERT INTO location_2 (method,protocol,did,date,time,csq1,csq2,sim,crg,bat,sos,sat,lat,lng,data,created_at,updated_at) VALUES ('node','mqtt','`+data.did+`','`+data.date+`','`+data.time+`','`+data.sg1+`','`+data.sg2+`','`+data.sim+`','`+data.crg+`','`+data.bat+`','`+data.sos+`','`+data.sat+`','`+data.lat+`','`+data.lng+`','`+json+`','`+FullDate+`','`+FullDate+`')`;


     pool.query(sql, function(err, results) {
        if(err) { console.log(err); return; }
        console.log("data saved at "+FullDate);
     });
}