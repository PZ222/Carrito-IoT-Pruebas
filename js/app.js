let ipCarrito = localStorage.getItem("ipCarrito") || "";

const ipInput = document.getElementById("ipCarrito");
const guardarIpBtn = document.getElementById("guardarIp");
const ipActualTxt = document.getElementById("ipActual");
const statusText = document.getElementById("statusText");
const buttons = document.querySelectorAll("[data-cmd]");

// Cargar IP guardada
if (ipCarrito) {
  ipInput.value = ipCarrito;
  ipActualTxt.textContent = "IP actual: " + ipCarrito;
} else {
  ipActualTxt.textContent = "IP actual: -";
}

// Guardar IP
guardarIpBtn.addEventListener("click", () => {
  const ip = ipInput.value.trim();
  if (!ip) {
    statusText.textContent = "Ingresa una IP válida del carrito.";
    return;
  }
  ipCarrito = ip;
  localStorage.setItem("ipCarrito", ipCarrito);
  ipActualTxt.textContent = "IP actual: " + ipCarrito;
  statusText.textContent = "IP guardada correctamente.";
});

// Enviar comando al carrito
function enviarComando(cmd) {
  if (!ipCarrito) {
    statusText.textContent = "Configura primero la IP del carrito.";
    return;
  }

  const url = `http://${ipCarrito}/${cmd}`;
  statusText.textContent = `Enviando comando: ${cmd}...`;

  fetch(url, { method: "GET" })
    .then((res) => {
      if (!res.ok) throw new Error("HTTP " + res.status);
      return res.text();
    })
    .then((text) => {
      statusText.textContent = `Carrito respondió: ${text || "OK"}`;
    })
    .catch((err) => {
      statusText.textContent = `Error al enviar comando (${cmd}): ${err.message}. Verifica IP, red y encendido del carrito.`;
    });
}

// Comandos que deben mantenerse mientras el botón está presionado
const continuousCmds = new Set([
  "adelante",
  "atras",
  "vueltadelantederecha",
  "vueltadelanteizquierda",
  "vueltaatrasderecha",
  "vueltaatrasizquierda",
  "giro90derecha",
  "giro90izquierda",
  "giro360derecha",
  "giro360izquierda"
]);

// Bandera para saber si hay comando activo
let comandoActivo = null;

// Configurar botones
buttons.forEach((btn) => {
  const cmd = btn.getAttribute("data-cmd");

  if (cmd === "detener") {
    // Botón detener manual
    btn.addEventListener("click", () => {
      comandoActivo = null;
      enviarComando("detener");
    });
    return;
  }

  if (continuousCmds.has(cmd)) {
    // Mantener presionado con mouse
    btn.addEventListener("mousedown", () => {
      comandoActivo = cmd;
      enviarComando(cmd);
    });

    // Mantener presionado con touch (móvil)
    btn.addEventListener("touchstart", (e) => {
      e.preventDefault();
      comandoActivo = cmd;
      enviarComando(cmd);
    });
  } else {
    // Por si se usan comandos de disparo único
    btn.addEventListener("click", () => {
      enviarComando(cmd);
    });
  }
});

// Cuando se suelta el mouse en cualquier parte, se detiene
["mouseup", "mouseleave"].forEach((evt) => {
  window.addEventListener(evt, () => {
    if (comandoActivo) {
      comandoActivo = null;
      enviarComando("detener");
    }
  });
});

// Cuando termina el toque en pantalla, también se detiene
["touchend", "touchcancel"].forEach((evt) => {
  window.addEventListener(evt, (e) => {
    e.preventDefault();
    if (comandoActivo) {
      comandoActivo = null;
      enviarComando("detener");
    }
  });
});
