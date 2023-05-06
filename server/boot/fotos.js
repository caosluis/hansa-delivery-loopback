var fb = require("firebase");
var cnf = require("./configFotos/config");
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
/* fb.initializeApp(cnf.fbConfig); */
logger.debug("Iniciando");

/*path de escritura */
var ref = fb.database().ref("Fotos");

/*Escuchador de nuevos registros*/
ref.on("child_added", function (res) {
  var datos = res.val();
  var array = new Array();
  for (var key in datos) {
    if (datos.hasOwnProperty(key)) {
      array.push(datos[key]);
    }
  }
  var fotos = new Object();
  /*Insertando el objeto DatosTareas del JSON con el valor de array*/
  fotos.datos = array;
  logger.debug("Nuevo registro ", res.key);
  envioPOST(fotos);
});

/*Escuchador de cambio*/
ref.on("child_changed", function (res) {
  var datos = res.val();
  var array = new Array();
  for (var key in datos) {
    if (datos.hasOwnProperty(key)) {
      array.push(datos[key]);
    }
  }
  var fotos = new Object();
  /*Insertando el objeto DatosTareas del JSON con el valor de array*/
  fotos.datos = array;
  logger.debug("Modificacion registro ", res.key);
  envioPOST(fotos);
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
      console.log(res);
      logger.debug("Envio exitoso.");
    })
    .catch((error) => {
      logger.debug("Error volviendo a enviar datos");
      envioPOST(datos);
    }, 2000);
}
