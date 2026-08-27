const $ = id => document.getElementById(id);

async function locateIP() {

    const ip = $("ipInput").value.trim();

    if (!ip) {
        $("status").textContent = "ENTER AN IP ADDRESS";
        return;
    }

    $("status").textContent = "LOCATING...";
    $("locateBtn").disabled = true;

    try {

        const response = await fetch(
            `https://ipwho.is/${encodeURIComponent(ip)}`
        );

        const data = await response.json();

        if (!data.success) {
            throw new Error(data.message);
        }

        $("ip").textContent = data.ip || "-";
        $("country").textContent = data.country || "-";
        $("region").textContent = data.region || "-";
        $("city").textContent = data.city || "-";
        $("postal").textContent = data.postal || "-";

        $("isp").textContent =
            data.connection?.isp || "-";

        $("org").textContent =
            data.connection?.org || "-";

        $("timezone").textContent =
            data.timezone?.id || "-";

        $("latitude").textContent =
            data.latitude ?? "-";

        $("longitude").textContent =
            data.longitude ?? "-";

        $("continent").textContent =
            data.continent || "-";

        $("currency").textContent =
            data.currency?.name || "-";

        $("network").textContent =
            data.connection?.domain || "-";


        if (
            data.latitude != null &&
            data.longitude != null
        ) {

            const lat = Number(data.latitude);
            const lon = Number(data.longitude);
            const d = 0.08;

            $("map").src =
                "https://www.openstreetmap.org/export/embed.html" +
                `?bbox=${lon-d}%2C${lat-d}%2C${lon+d}%2C${lat+d}` +
                "&layer=mapnik" +
                `&marker=${lat}%2C${lon}`;
        }

        $("status").textContent =
            "LOCATION FOUND";

        $("results").scrollIntoView({
            behavior: "smooth"
        });

    } catch (error) {

        console.error(error);

        $("status").textContent =
            "COULD NOT LOCATE THIS IP";

    } finally {

        $("locateBtn").disabled = false;

    }
}


$("locateBtn").addEventListener(
    "click",
    locateIP
);


$("ipInput").addEventListener(
    "keydown",
    event => {

        if (event.key === "Enter") {
            locateIP();
        }

    }
);


$("copyBtn").addEventListener(
    "click",
    async () => {

        const ip = $("ip").textContent;

        if (!ip || ip === "-") return;

        try {

            await navigator.clipboard.writeText(ip);

            showToast("IP COPIED");

        } catch {

            showToast("COPY FAILED");

        }

    }
);


function showToast(text) {

    const toast = $("toast");

    toast.textContent = text;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 1500);

}


/* Connection Overview */

$("protocol").textContent =
    location.protocol.replace(":", "").toUpperCase();

$("platform").textContent =
    navigator.platform || "Unknown";

$("language").textContent =
    navigator.language || "Unknown";

$("screen").textContent =
    `${screen.width} × ${screen.height}`;

$("online").textContent =
    navigator.onLine ? "ONLINE" : "OFFLINE";


const ua = navigator.userAgent;

if (/Edg/i.test(ua)) {

    $("browser").textContent = "Edge";

} else if (/Chrome/i.test(ua)) {

    $("browser").textContent = "Chrome";

} else if (/Firefox/i.test(ua)) {

    $("browser").textContent = "Firefox";

} else if (/Safari/i.test(ua)) {

    $("browser").textContent = "Safari";

} else {

    $("browser").textContent = "Unknown";

}


/* Online status */

window.addEventListener(
    "online",
    () => {
        $("online").textContent = "ONLINE";
    }
);

window.addEventListener(
    "offline",
    () => {
        $("online").textContent = "OFFLINE";
    }
);


/* Click animation */

document.addEventListener(
    "click",
    event => {

        const ripple =
            document.createElement("span");

        ripple.className = "ripple";

        ripple.style.left =
            event.clientX + "px";

        ripple.style.top =
            event.clientY + "px";

        ripple.style.width = "8px";
        ripple.style.height = "8px";

        document.body.appendChild(ripple);

        ripple.animate(
            [
                {
                    transform:
                        "translate(-50%,-50%) scale(1)",
                    opacity: 1
                },
                {
                    transform:
                        "translate(-50%,-50%) scale(12)",
                    opacity: 0
                }
            ],
            {
                duration: 450,
                easing: "ease-out"
            }
        ).onfinish = () => ripple.remove();

    }
);
