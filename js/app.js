let ipCarrito = localStorage.getItem("ipCarrito") || "";

const ipInput = document.getElementById("ipCarrito");
const guardarIpBtn = document.getElementById("guardarIp");
const ipActualTxt = document.getElementById("ipActual");
const statusText = document.getElementById("statusText");
const buttons = document.querySelectorAll("[data-cmd]");

if (ipCarrito) {
  ipInput.value = ipCarrito;
  ipActualTxt.textContent = "IP actual: " + ipCarrito;
}

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

buttons.forEach(btn => {
  btn.addEventListener("click", () => {
    const cmd = btn.getAttribute("data-cmd");
    enviarComando(cmd);
  });
});

function enviarComando(cmd) {
  if (!ipCarrito) {
    statusText.textContent = "Configura primero la IP del carrito.";
    return;
  }

  const url = `http://${ipCarrito}/${cmd}`;

  statusText.textContent = `Enviando comando: ${cmd} ...`;

  fetch(url, { method: "GET" })
    .then(response => {
      if (!response.ok) {
        throw new Error("HTTP " + response.status);
      }
      return response.text();
    })
    .then(text => {
      statusText.textContent = `Carrito respondió: ${text || "OK"}`;
    })
    .catch(err => {
      statusText.textContent = `Error al enviar comando (${cmd}): ${err.message}. Verifica IP, red y encendido del carrito.`;
    });
}
