const $ = id => document.getElementById(id);

async function loadIP(){

    $("status").innerHTML = "DETECTING PUBLIC IP...";

    try{

        const ipResponse =
            await fetch(
                "https://api64.ipify.org?format=json"
            );

        if(!ipResponse.ok)
            throw new Error();

        const ipData =
            await ipResponse.json();

        const ip = ipData.ip;

        $("ip").textContent = ip;

        const response =
            await fetch(
                `https://ipapi.co/${encodeURIComponent(ip)}/json/`
            );

        if(!response.ok)
            throw new Error();

        const data =
            await response.json();

        if(data.error)
            throw new Error();

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

        $("continent").textContent =
            data.continent_code || "-";

        $("latitude").textContent =
            data.latitude ?? "-";

        $("longitude").textContent =
            data.longitude ?? "-";

        $("currency").textContent =
            data.currency_name || "-";

        $("network").textContent =
            data.network || "-";

        if(
            data.latitude != null &&
            data.longitude != null
        ){

            const lat =
                Number(data.latitude);

            const lon =
                Number(data.longitude);

            const d = .08;

            const bbox =
                `${lon-d}%2C${lat-d}%2C${lon+d}%2C${lat+d}`;

            $("map").src =
                "https://www.openstreetmap.org/export/embed.html" +
                `?bbox=${bbox}` +
                "&layer=mapnik" +
                `&marker=${lat}%2C${lon}`;

        }

        $("status").textContent =
            "LOCATION DATA LOADED";

    }catch(error){

        console.error(error);

        $("ip").textContent =
            "Unavailable";

        $("status").textContent =
            "LOOKUP FAILED";

    }

}


$("copyIP").addEventListener(
    "click",
    async () => {

        const ip =
            $("ip").textContent;

        if(
            !ip ||
            ip === "Detecting..." ||
            ip === "Unavailable"
        )
            return;

        try{

            await navigator.clipboard.writeText(ip);

            showToast("IP COPIED");

        }catch{

            showToast("COPY FAILED");

        }

    }
);


function showToast(text){

    const toast =
        $("toast");

    toast.textContent =
        text;

    toast.classList.add("show");

    setTimeout(
        () => {
            toast.classList.remove("show");
        },
        1500
    );

}


/* cursor effect */

document.addEventListener(
    "mousemove",
    event => {

        const glow =
            document.querySelector(
                ".cursor-glow"
            );

        glow.style.left =
            event.clientX + "px";

        glow.style.top =
            event.clientY + "px";

    }
);


/* click animation */

document.addEventListener(
    "click",
    event => {

        const ripple =
            document.createElement(
                "span"
            );

        ripple.style.position =
            "fixed";

        ripple.style.left =
            event.clientX + "px";

        ripple.style.top =
            event.clientY + "px";

        ripple.style.width =
            "10px";

        ripple.style.height =
            "10px";

        ripple.style.border =
            "2px solid white";

        ripple.style.borderRadius =
            "50%";

        ripple.style.pointerEvents =
            "none";

        ripple.style.zIndex =
            "99999";

        ripple.style.transform =
            "translate(-50%,-50%)";

        document.body.appendChild(
            ripple
        );

        ripple.animate(
            [
                {
                    width:"10px",
                    height:"10px",
                    opacity:1
                },
                {
                    width:"100px",
                    height:"100px",
                    opacity:0
                }
            ],
            {
                duration:500,
                easing:"ease-out"
            }
        ).onfinish =
            () => ripple.remove();

    }
);


/* connection overview */

function loadConnection(){

    $("protocol").textContent =
        location.protocol
        .replace(":","")
        .toUpperCase();

    $("platform").textContent =
        navigator.platform || "Unknown";

    $("language").textContent =
        navigator.language || "Unknown";

    $("screen").textContent =
        `${screen.width} × ${screen.height}`;

    $("online").textContent =
        navigator.onLine
        ? "ONLINE"
        : "OFFLINE";

    const ua =
        navigator.userAgent;

    if(/Edg/i.test(ua))
        $("browser").textContent =
            "Microsoft Edge";

    else if(/Chrome/i.test(ua))
        $("browser").textContent =
            "Chrome";

    else if(/Firefox/i.test(ua))
        $("browser").textContent =
            "Firefox";

    else if(/Safari/i.test(ua))
        $("browser").textContent =
            "Safari";

    else
        $("browser").textContent =
            "Unknown";

}


window.addEventListener(
    "online",
    () => $("online").textContent = "ONLINE"
);

window.addEventListener(
    "offline",
    () => $("online").textContent = "OFFLINE"
);


loadConnection();
loadIP();
