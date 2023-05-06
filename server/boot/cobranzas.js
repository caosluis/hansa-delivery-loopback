var fb = require("firebase");
var cnf = require("./configCobranza/config");
const axios = require("axios");
var https = require("https");
var log4js = require("log4js");

log4js.configure({
  appenders: {
    backfb: {
      type: "file",
      filename: "logs.log",
      maxLogSize: 1000000,
      backups: 1,
    },
  },
  categories: {
    default: { appenders: ["backfb"], level: "debug" },
  },
});

const logger = log4js.getLogger("backfb");
fb.initializeApp(cnf.fbConfig);
logger.debug("Iniciando");

var ref = fb.database().ref("Entregas");

ref.on("child_added", function (res) {
  var datosTareas = res.val().DatosTareas;
  var array = new Array();
  for (var key in datosTareas) {
    if (datosTareas.hasOwnProperty(key)) {
      array.push(datosTareas[key]);
    }
  }
  var datos = res.val();
  /*Elimina el dato DatosTareas del JSON*/
  delete datos.DatosTareas;
  /*Insertando el objeto DatosTareas del JSON con el valor de array*/
  datos.DatosTareas = array;
  logger.debug("Nuevo registro ", res.key, datos);
  envioPOST(datos);
});

ref.on("child_changed", function (res) {
  var datosTareas = res.val().DatosTareas;
  var array = new Array();
  for (var key in datosTareas) {
    if (datosTareas.hasOwnProperty(key)) {
      array.push(datosTareas[key]);
    }
  }
  var datos = res.val();
  /*Elimina el dato DatosTareas del JSON*/
  delete datos.DatosTareas;
  /*Insertando el objeto DatosTareas del JSON con el valor de array*/
  datos.DatosTareas = array;
  logger.debug("Modificado registro ", res.key, datos);
  envioPOST(datos);
});
/*Envio de datos al servicio*/
function envioPOST(datos) {
  const instance = axios.create({
    httpsAgent: new https.Agent({
      rejectUnauthorized: false,
    }),
  });
  instance
    .post(cnf.urlWS, datos)
    .then((res) => {
      logger.debug("Envio exitoso.");
    })
    .catch((error) => {
      logger.debug("Error volviendo a enviar datos");
      envioPOST(datos);
    }, 2000);
}
