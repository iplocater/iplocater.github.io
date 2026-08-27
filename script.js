const $ = id =>
document.getElementById(id);


/* =========================
   IP LOOKUP
========================= */

async function locateIP(){

const input =
$("ipInput");

const ip =
input.value.trim();

if(!ip){

setStatus(
"ENTER A PUBLIC IP ADDRESS"
);

input.focus();

return;
}

setStatus(
"LOOKING UP IP..."
);

$("locateBtn").disabled =
true;

try{

const url =
"https://ipapi.co/" +
encodeURIComponent(ip) +
"/json/";

const response =
await fetch(url);

if(!response.ok){

throw new Error(
"API ERROR"
);

}

const data =
await response.json();

if(
data.error ||
!data.ip
){

throw new Error(
"INVALID IP"
);

}

fillData(data);

setStatus(
"LOCATION DATA FOUND"
);

$("results").scrollIntoView({
behavior:"smooth",
block:"start"
});

}catch(error){

console.error(error);

setStatus(
"COULD NOT LOCATE THIS IP"
);

clearData();

}finally{

$("locateBtn").disabled =
false;

}

}


/* =========================
   FILL INFORMATION
========================= */

function fillData(data){

$("ip").textContent =
data.ip || "-";

$("country").textContent =
data.country_name || "-";

$("region").textContent =
data.region || "-";

$("city").textContent =
data.city || "-";

$("postal").textContent =
data.postal || "-";

$("isp").textContent =
data.org || "-";

$("org").textContent =
data.org || "-";

$("timezone").textContent =
data.timezone || "-";

$("latitude").textContent =
data.latitude ?? "-";

$("longitude").textContent =
data.longitude ?? "-";

$("continent").textContent =
data.continent_code || "-";

$("currency").textContent =
data.currency_name || "-";

$("network").textContent =
data.network || "-";


if(
data.latitude != null &&
data.longitude != null
){

createMap(
Number(data.latitude),
Number(data.longitude)
);

}

}


/* =========================
   CLEAR
========================= */

function clearData(){

const fields=[
"ip",
"country",
"region",
"city",
"postal",
"isp",
"org",
"timezone",
"latitude",
"longitude",
"continent",
"currency",
"network"
];

fields.forEach(
id =>
$(id).textContent="-"
);

$("map").src="";

}


/* =========================
   MAP
========================= */

function createMap(lat,lon){

if(
Number.isNaN(lat) ||
Number.isNaN(lon)
)
return;

const delta=.08;

const bbox =
`${lon-delta}%2C`+
`${lat-delta}%2C`+
`${lon+delta}%2C`+
`${lat+delta}`;

$("map").src =
"https://www.openstreetmap.org/export/embed.html"+
`?bbox=${bbox}`+
"&layer=mapnik"+
`&marker=${lat}%2C${lon}`;

}


/* =========================
   STATUS
========================= */

function setStatus(text){

$("status").textContent =
text;

}


/* =========================
   COPY
========================= */

$("copyBtn").addEventListener(
"click",
async function(){

const value =
$("ip").textContent;

if(
!value ||
value === "-"
)
return;

try{

await navigator.clipboard.writeText(
value
);

showToast(
"IP COPIED"
);

}catch{

showToast(
"COPY FAILED"
);

}

});


function showToast(text){

const toast =
$("toast");

toast.textContent =
text;

toast.classList.add(
"show"
);

setTimeout(
() =>
toast.classList.remove("show"),
1500
);

}


/* =========================
   ENTER KEY
========================= */

$("ipInput").addEventListener(
"keydown",
function(event){

if(
event.key === "Enter"
){

locateIP();

}

});


/* =========================
   CLICK ANIMATION
========================= */

document.addEventListener(
"click",
function(event){

const ripple =
document.createElement(
"span"
);

ripple.className =
"ripple";

ripple.style.left =
event.clientX+"px";

ripple.style.top =
event.clientY+"px";

ripple.style.width="8px";
ripple.style.height="8px";

document.body.appendChild(
ripple
);

ripple.animate(
[
{
transform:
"translate(-50%,-50%) scale(1)",
opacity:1
},
{
transform:
"translate(-50%,-50%) scale(12)",
opacity:0
}
],
{
duration:450,
easing:"ease-out"
}
).onfinish =
() =>
ripple.remove();

});


/* =========================
   CONNECTION OVERVIEW
========================= */

function connectionInfo(){

$("protocol").textContent =
location.protocol
.replace(":","")
.toUpperCase();

$("platform").textContent =
navigator.platform ||
"Unknown";

$("language").textContent =
navigator.language ||
"Unknown";

$("screen").textContent =
screen.width+
" × "+
screen.height;

$("online").textContent =
navigator.onLine
? "ONLINE"
: "OFFLINE";

const ua =
navigator.userAgent;

if(/Edg/i.test(ua)){

$("browser").textContent =
"Microsoft Edge";

}

else if(/Chrome/i.test(ua)){

$("browser").textContent =
"Chrome";

}

else if(/Firefox/i.test(ua)){

$("browser").textContent =
"Firefox";

}

else if(/Safari/i.test(ua)){

$("browser").textContent =
"Safari";

}

else{

$("browser").textContent =
"Unknown";

}

}


window.addEventListener(
"online",
() =>
$("online").textContent="ONLINE"
);

window.addEventListener(
"offline",
() =>
$("online").textContent="OFFLINE"
);


/* START */

connectionInfo();

