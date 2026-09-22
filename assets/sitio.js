/* ==========================================================================
   Marina Santor — comportamiento del sitio
   --------------------------------------------------------------------------
   CONFIGURACIÓN DEL FORMULARIO
   El formulario de contacto envía el mail a través de Web3Forms, un servicio
   gratuito. Para activarlo hay que pegar abajo la clave que Web3Forms envía
   por mail al registrar la casilla de Marina. Mientras la clave diga
   "PEGAR-CLAVE-AQUI", el formulario avisa que todavía no está configurado y
   no se pierde ninguna consulta.
   ========================================================================== */

var CLAVE_FORMULARIO = "PEGAR-CLAVE-AQUI";

var WHATSAPP = "5491161943289";

/* ---------- Utilidades ---------- */

function cada(selector, fn) {
  Array.prototype.forEach.call(document.querySelectorAll(selector), fn);
}

/* ---------- Menú de escritorio: desplegable de servicios ---------- */

cada(".desplegable", function (caja) {
  var boton = caja.querySelector(".nav__link");
  var cerrar = function () {
    caja.setAttribute("data-abierto", "no");
    boton.setAttribute("aria-expanded", "false");
  };
  var abrir = function () {
    caja.setAttribute("data-abierto", "si");
    boton.setAttribute("aria-expanded", "true");
  };

  caja.addEventListener("mouseenter", abrir);
  caja.addEventListener("mouseleave", cerrar);

  boton.addEventListener("click", function (e) {
    e.preventDefault();
    if (caja.getAttribute("data-abierto") === "si") { cerrar(); } else { abrir(); }
  });

  caja.addEventListener("focusout", function (e) {
    if (!caja.contains(e.relatedTarget)) { cerrar(); }
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") { cerrar(); }
  });
});

/* ---------- Menú móvil ---------- */

var botonHamburguesa = document.querySelector(".hamburguesa");
var menuMovil = document.querySelector(".menu-movil");

if (botonHamburguesa && menuMovil) {
  botonHamburguesa.addEventListener("click", function () {
    var abierto = menuMovil.getAttribute("data-abierto") === "si";
    menuMovil.setAttribute("data-abierto", abierto ? "no" : "si");
    botonHamburguesa.setAttribute("aria-expanded", abierto ? "false" : "true");
    botonHamburguesa.querySelector(".ico").textContent = abierto ? "menu" : "close";
  });
}

cada(".menu-movil__toggle", function (boton) {
  boton.addEventListener("click", function () {
    var grupo = document.getElementById(boton.getAttribute("aria-controls"));
    var abierto = grupo.getAttribute("data-abierto") === "si";
    grupo.setAttribute("data-abierto", abierto ? "no" : "si");
    boton.setAttribute("aria-expanded", abierto ? "false" : "true");
    boton.querySelector(".ico").style.transform = abierto ? "" : "rotate(180deg)";
  });
});

/* ---------- Carrusel de testimonios ---------- */

cada(".carrusel", function (carrusel) {
  var pista = carrusel.querySelector(".carrusel__pista");
  var anterior = carrusel.querySelector("[data-mando='anterior']");
  var siguiente = carrusel.querySelector("[data-mando='siguiente']");
  if (!pista) { return; }

  var salto = function () {
    var tarjeta = pista.querySelector(".testimonio");
    return tarjeta ? tarjeta.offsetWidth + 18 : 340;
  };

  if (anterior) {
    anterior.addEventListener("click", function () {
      pista.scrollBy({ left: -salto(), behavior: "smooth" });
    });
  }
  if (siguiente) {
    siguiente.addEventListener("click", function () {
      pista.scrollBy({ left: salto(), behavior: "smooth" });
    });
  }
});

/* ---------- Preguntas frecuentes ---------- */

cada(".faq__boton", function (boton) {
  boton.addEventListener("click", function () {
    var resp = document.getElementById(boton.getAttribute("aria-controls"));
    var abierto = boton.getAttribute("aria-expanded") === "true";
    boton.setAttribute("aria-expanded", abierto ? "false" : "true");
    resp.setAttribute("data-abierto", abierto ? "no" : "si");
  });
});

/* ---------- Contador de caracteres ---------- */

cada("[data-contador]", function (campo) {
  var salida = document.getElementById(campo.getAttribute("data-contador"));
  var tope = campo.getAttribute("maxlength") || 500;
  var refrescar = function () {
    salida.textContent = campo.value.length + " / " + tope + " caracteres";
  };
  campo.addEventListener("input", refrescar);
  refrescar();
});

/* ---------- Formulario de contacto ---------- */

var formulario = document.getElementById("form-consulta");

if (formulario) {
  var cajaOk = document.getElementById("form-ok");
  var cajaError = document.getElementById("form-error");
  var botonEnviar = document.getElementById("form-enviar");
  var botonWa = document.getElementById("form-whatsapp");

  var leerDatos = function () {
    var datos = new FormData(formulario);
    return {
      motivo: datos.get("motivo") || "Sin especificar",
      nombre: (datos.get("nombre") || "").trim(),
      localidad: (datos.get("localidad") || "").trim(),
      celular: (datos.get("celular") || "").trim(),
      detalle: (datos.get("detalle") || "").trim()
    };
  };

  var mostrar = function (caja, texto) {
    cajaOk.setAttribute("data-visible", "no");
    cajaError.setAttribute("data-visible", "no");
    caja.textContent = texto;
    caja.setAttribute("data-visible", "si");
    caja.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  /* Botón de WhatsApp: arma el mensaje con lo que haya cargado */
  if (botonWa) {
    botonWa.addEventListener("click", function () {
      var d = leerDatos();
      var texto =
        "Hola Marina, quiero hacer una consulta." +
        "\n\nMotivo: " + d.motivo +
        (d.nombre ? "\nNombre: " + d.nombre : "") +
        (d.localidad ? "\nLocalidad: " + d.localidad : "") +
        (d.detalle ? "\n\n" + d.detalle : "");
      window.open("https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(texto), "_blank");
    });
  }

  formulario.addEventListener("submit", function (e) {
    e.preventDefault();
    var d = leerDatos();

    if (!d.nombre || !d.celular) {
      mostrar(cajaError, "Faltan completar el nombre y el número de celular.");
      return;
    }

    if (CLAVE_FORMULARIO === "PEGAR-CLAVE-AQUI") {
      mostrar(cajaError,
        "El envío por mail todavía no está configurado en esta maqueta. " +
        "Mientras tanto podés usar el botón de WhatsApp de aquí abajo.");
      return;
    }

    botonEnviar.disabled = true;
    botonEnviar.textContent = "Enviando…";

    fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        access_key: CLAVE_FORMULARIO,
        subject: "Nueva consulta desde marinasantor.com.ar",
        from_name: "Sitio de Marina Santor",
        Motivo: d.motivo,
        Nombre: d.nombre,
        Localidad: d.localidad,
        Celular: d.celular,
        Consulta: d.detalle
      })
    })
      .then(function (r) { return r.json(); })
      .then(function (r) {
        if (r.success) {
          formulario.reset();
          mostrar(cajaOk, "Listo. Tu consulta fue enviada. Marina te va a responder a la brevedad.");
        } else {
          mostrar(cajaError, "No se pudo enviar la consulta. Probá de nuevo o escribinos por WhatsApp.");
        }
      })
      .catch(function () {
        mostrar(cajaError, "No se pudo enviar la consulta. Probá de nuevo o escribinos por WhatsApp.");
      })
      .finally(function () {
        botonEnviar.disabled = false;
        botonEnviar.textContent = "Enviar solicitud";
      });
  });
}
