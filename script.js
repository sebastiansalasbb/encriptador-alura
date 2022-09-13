(function () {
  var entradaDeDatos = document.querySelector("#entradaDeDatos");
  var salidaDeDatos = document.querySelector("#salidaDeDatos");
  var botonEncriptar = document.querySelector("#botonEncriptar");
  var botonDesencriptar = document.querySelector("#botonDesencriptar");
  var contenedorSinResultado = document.querySelector(
    "#contenedorSinResultado"
  );
  var contenedorConResultado = document.querySelector(
    "#contenedorConResultado"
  );
  var botonCopiar = document.querySelector("#botonCopiar");
  var modalErrorSinDatos = document.querySelector("#modalErrorSinDatos");
  var botonCerrarModal = document.querySelector("#botonCerrarModal");
  var mensajeTextoCopiado = document.querySelector("#mensajeTextoCopiado");
  var textoModal = document.querySelector("#textoModal");

  var letrasPorEncriptar = [
    ["e", "enter"],
    ["i", "imes"],
    ["a", "ai"],
    ["o", "ober"],
    ["u", "ufat"],
  ];

  var textoEncriptado = "";
  var textoDesencriptado = "";

  function normalizarTexto(textoPorNormalizar) {
    var textoEnMinusculas = textoPorNormalizar.toLowerCase();
    var textoNormalizado = textoEnMinusculas
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    return textoNormalizado;
  }

  function reemplazarLetras(textoPorEncriptar) {
    for (var i = 0; i < letrasPorEncriptar.length; i++) {
      var letra = letrasPorEncriptar[i][0];
      var encriptacion = letrasPorEncriptar[i][1];
      if (textoEncriptado.length > textoPorEncriptar.length) {
        textoEncriptado = textoEncriptado.replaceAll(letra, encriptacion);
      } else {
        textoEncriptado = textoPorEncriptar.replaceAll(letra, encriptacion);
      }
    }
  }

  function reemplazarLetrasReverso(textoPorDesencriptar) {
    for (var i = 0; i < letrasPorEncriptar.length; i++) {
      var letra = letrasPorEncriptar[i][0];
      var encriptacion = letrasPorEncriptar[i][1];

      if (textoDesencriptado) {
        textoDesencriptado = textoDesencriptado.replaceAll(encriptacion, letra);
      } else {
        textoDesencriptado = textoPorDesencriptar.replaceAll(
          encriptacion,
          letra
        );
      }
    }
  }

  function descifrar() {
    var textoPorDesencriptar = entradaDeDatos.value;

    if (textoPorDesencriptar) {
      entradaDeDatos.value = "";
      reemplazarLetrasReverso(textoPorDesencriptar);
      if (textoPorDesencriptar !== textoDesencriptado) {
        contenedorSinResultado.classList.add("oculto");
        contenedorConResultado.classList.remove("oculto");
        contenedorConResultado.value = textoDesencriptado;
        botonCopiar.classList.remove("oculto");
      } else {
        textoModal.textContent =
          "El texto ingresado no está encriptado. Para desencriptar, primero encripta el texto.";
        modalErrorSinDatos.showModal();
      }
    } else {
      textoModal.textContent =
        "Para poder encriptar/desencriptar debes agregar un texto. Por favor, intenta de nuevo.";

      modalErrorSinDatos.showModal();
    }
  }

  function cifrar() {
    var textoPorEncriptar = entradaDeDatos.value;
    if (textoPorEncriptar) {
      entradaDeDatos.value = "";
      textoPorEncriptar = normalizarTexto(textoPorEncriptar);
      reemplazarLetras(textoPorEncriptar);
      contenedorSinResultado.classList.add("oculto");
      contenedorConResultado.classList.remove("oculto");
      contenedorConResultado.value = textoEncriptado;
      botonCopiar.classList.remove("oculto");
    } else {
      modalErrorSinDatos.showModal();
    }
  }

  botonEncriptar.addEventListener("click", function (e) {
    e.preventDefault();
    cifrar();
    textoEncriptado = "";
  });

  botonDesencriptar.addEventListener("click", function (e) {
    e.preventDefault();
    descifrar();
    textoDesencriptado = "";
  });

  botonCopiar.addEventListener("click", function (e) {
    e.preventDefault();
    contenedorConResultado.select();
    navigator.clipboard.writeText(contenedorConResultado.value).then(() => {
      mensajeTextoCopiado.classList.remove("oculto");
      setTimeout(() => {
        mensajeTextoCopiado.classList.add("oculto");
      }, 1000);
    });
  });

  function pegarTexto() {
    entradaDeDatos.value = navigator.clipboard.readText().then((text) => {
      entradaDeDatos.value = text;
      if (contenedorConResultado.value !== "") {
        contenedorConResultado.value = "";
        botonCopiar.classList.add("oculto");
        setTimeout(() => {
          contenedorSinResultado.classList.remove("oculto");
          contenedorConResultado.classList.add("oculto");
        }, 500);
      }
    });
    return false;
  }

  entradaDeDatos.oncontextmenu = pegarTexto;

  //si barra de scroll de contendorConREsultado esta abajo, no se ve el boton de copiar
  contenedorConResultado.addEventListener("scroll", function (e) {
    if (contenedorConResultado.scrollTop > 390) {
      contenedorConResultado.style.borderRadius = "24px 24px 0.5rem 24px";
    }
    if (contenedorConResultado.scrollTop < 390) {
      contenedorConResultado.style.borderRadius = "24px";
    }

    if (
      contenedorConResultado.scrollTop >= 0 &&
      contenedorConResultado.scrollTop < 51
    ) {
      contenedorConResultado.style.borderRadius = "24px 0.5rem  24px 24px";
    }
  });

  botonCerrarModal.onclick = function () {
    modalErrorSinDatos.close();
  };
})();
