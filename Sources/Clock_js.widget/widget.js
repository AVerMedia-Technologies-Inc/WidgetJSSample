
AVT_CREATOR_CENTRAL.on('connected', (conn) => connected(conn));
const sendToProperty = AVT_CREATOR_CENTRAL_API.sendToProperty;
const setSetting = AVT_CREATOR_CENTRAL_API.setSetting;
const getSetting = AVT_CREATOR_CENTRAL_API.getSetting;
const setImage = AVT_CREATOR_CENTRAL_API.setImage;

const propertyEvents = new EventEmitter();
let language = 'en_US';
let city_name;
let type_name;
let time_zone;
let output;
let analog_start;
let digi_start;
let analog_clear;
let digi_clear;

let toPropertyData = {
    action : 'init',
    collections : [],
    currentCollection : {},
    audioList : []
};



function connected(jsn) {
    getSetting();
    AVT_CREATOR_CENTRAL.on('ax.set.current.language', (data) => {
      language = (data.params.language).toLowerCase();
      setTimeout(()=>{
        sendToProperty({
          action: 'setLanguage',
          data : language
      });
    },1000);
  });

  //   // ---------
    AVT_CREATOR_CENTRAL.on('ax.update.payload', data => {
      if(data.params.payload.city == undefined){
        city_name = 'taipei'
      }else{
        city_name = data.params.payload.city
      }
      if(data.params.payload.type == undefined){
        type_name = 'digital'
      }else{
        type_name = data.params.payload.type
      }
      setTimeout(()=>{
        sendToProperty({
          'action' : 'send_type_val',
          'type':  type_name
        });  
        sendToProperty({
          'action' : 'send_city_val',
          'city':  city_name
        });  
    },2000);
      if(type_name == 'digital'){ 
        clearInterval(analog_start);
        clearInterval(analog_clear);
        digi_start = setInterval(drawClock, 1000);
        digi_clear = setInterval(digitalclear, 1000);

      }else if(type_name == 'analog'){
        clearInterval(digi_start);
        clearInterval(digi_clear);
        analog_start = setInterval(drawAnalogClock, 1000);
        analog_clear = setInterval(analogclear, 1000)
      }
    });
    AVT_CREATOR_CENTRAL.on('ax.send.to.widget', (data) => {
      let action = '';
      action = data.params.payload.action;
      switch(action) {
        case 'set_city_val':
          city_name = data.params.payload.city;
          // break;
        case 'set_type_val':
          type_name = data.params.payload.type;
          setSetting({
            'city': city_name,
            'type': type_name
          })   
          if(type_name == 'digital'){
            clearInterval(analog_start);
            clearInterval(analog_clear);
            digi_start = setInterval(drawClock, 1000);
            digi_clear = setInterval(digitalclear, 1000);
          }else if(type_name == 'analog'){
            clearInterval(digi_start);
            clearInterval(digi_clear);
            analog_start = setInterval(drawAnalogClock, 1000);
            analog_clear = setInterval(analogclear, 1000)
          }
          break;
      }
    })
} 

// ----------------
let canvas_digital = document.getElementById('canvas_digital');
ctx = canvas_digital.getContext("2d");
function drawClock() {
  drawDigitalTime(ctx,time_zone);
	let lowQuality = canvas_digital.toDataURL('image/png', 1);
  setImage(lowQuality)
}

// // -----DigitalClock-------
function drawDigitalTime(ctx) {
  let now = new Date();  
  let str;
  if(city_name == 'taipei'){
    time_zone = 'Asia/Taipei'
  }else if(city_name == 'new_york'){
    time_zone = 'America/New_York'
  }else if(city_name == 'california'){
    time_zone = 'America/Tijuana'
  }   
  let hour_options = {hour: '2-digit', hour12: false, timeZone: time_zone};
  let min_options = {minute: '2-digit', hour12: false, timeZone: time_zone};
  let sec_options = {second: '2-digit', hour12: false, timeZone: time_zone};
  let hour = now.toLocaleString('en-US', hour_options);
  let minute = now.toLocaleString('en-US', min_options);
  let second = now.toLocaleString('en-US', sec_options);
  let ampm = hour <= 11 ? "AM" : "PM";
  str = Calculate(hour, minute, second, ampm);

  // ---------
  ctx.beginPath();
  ctx.fillStyle = "#FF0000";
  ctx.font = "20px Arial";
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, 150, 108);
  ctx.fillStyle = "#000";
  ctx.fillText(str, 20, 62, 150, 108);

}
function Calculate(hour, min, sec, ampm){
  let curTime;
  curTime = hour.toString();
  if(min < 10){
    curTime += ":0"+min.toString();
  }else{
    curTime += ":"+min.toString();
  }
  
  if(sec < 10){
    curTime += ":0"+sec.toString();
  }else{
    curTime += ":"+sec.toString();
  }
  
  return curTime + ampm;
}

function digitalclear(){
  ctx.clearRect(0, 0, canvas_digital.width, canvas_digital.height);
}



// // -----AnalogClock------
let canvas_analog = document.getElementById("canvas_analog");
ctx2 = canvas_analog.getContext("2d");
radius = canvas_analog.height / 2;
ctx2.translate(75, 54);
radius = radius * 0.90

function drawAnalogClock() {
  drawFace(ctx2, radius);
  drawNumbers(ctx2, radius);
  drawTime(ctx2, radius, city_name, time_zone);
	let lowQuality = canvas_analog.toDataURL('image/png', 1);
  setImage(lowQuality)
}

function drawFace(ctx2, radius) {
  let grad;
  ctx2.beginPath();
  ctx2.fillRect(-75,-54,150,108);
  ctx2.arc(0, 0, radius, 0, 2*Math.PI);
  ctx2.fillStyle = 'white';
  ctx2.fill();
  grad = ctx2.createRadialGradient(0,0,radius*0.95, 0,0,radius*1.05);
  grad.addColorStop(0, '#333');
  grad.addColorStop(0.5, 'white');
  grad.addColorStop(1, '#333');
  ctx2.strokeStyle = grad;
  ctx2.lineWidth = radius*0.1;
  ctx2.stroke();
  ctx2.beginPath();
  ctx2.arc(0, 0, radius*0.1, 0, 2*Math.PI);
  ctx2.fillStyle = '#333';
  ctx2.fill();
}

function drawNumbers(ctx2, radius) {
  let ang;
  let num;
  ctx2.font = radius*0.15 + "px arial";
  ctx2.textBaseline="middle";
  ctx2.textAlign="center";
  for(num = 1; num < 13; num++){
    ang = num * Math.PI / 6;
    ctx2.rotate(ang);
    ctx2.translate(0, -radius*0.85);
    ctx2.rotate(-ang);
    ctx2.fillText(num.toString(), 0, 0);
    ctx2.rotate(ang);
    ctx2.translate(0, radius*0.85);
    ctx2.rotate(-ang);
  }
}

function drawTime(ctx2, radius, city_name){
    let now = new Date();
		if(city_name == 'taipei'){
			time_zone = 'Asia/Taipei'
		}else if(city_name == 'new_york'){
			time_zone = 'America/New_York'
		}else if(city_name == 'california'){
			time_zone = 'America/Tijuana'
		}
		
		let hour_options = {hour: '2-digit', hour12: false,timeZone: time_zone};
		let min_options = {minute: '2-digit', hour12: false, timeZone: time_zone};
		let sec_options = {second: '2-digit', hour12: false, timeZone: time_zone};
		let hour= now.toLocaleString('en-US', hour_options);
		let minute= now.toLocaleString('en-US', min_options);
		let second = now.toLocaleString('en-US', sec_options);		
    //hour
    hour=hour%12;
    hour=(hour*Math.PI/6)+
    (minute*Math.PI/(6*60))+
    (second*Math.PI/(360*60));
    drawHand(ctx2, hour, radius*0.5, radius*0.07);
    //minute
    minute=(minute*Math.PI/30)+(second*Math.PI/(30*60));
    drawHand(ctx2, minute, radius*0.8, radius*0.07);
    // second
    second=(second*Math.PI/30);
    drawHand(ctx2, second, radius*0.9, radius*0.02);
}

function drawHand(ctx2, pos, length, width) {
    ctx2.beginPath();
    ctx2.lineWidth = width;
    ctx2.lineCap = "round";
    ctx2.moveTo(0,0);
    ctx2.rotate(pos);
    ctx2.lineTo(0, -length);
    ctx2.stroke();
    ctx2.rotate(-pos);
}

function analogclear(){
  ctx2.clearRect(75, 54, canvas_analog.width, canvas_analog.height);
}


AVT_CREATOR_CENTRAL.on('ax.widget.triggered', actionkeyup)
function actionkeyup(){
  if(type_name == 'digital'){
    type_name = 'analog'
  }else if(type_name == 'analog'){
    type_name = 'digital'
  }
  setSetting({
    'city': city_name,
    'type': type_name
  })  
  getSetting()
}


