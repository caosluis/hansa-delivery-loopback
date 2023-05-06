"use strict";
var pubsub = require("../../server/pubsub.js");
var global = require("../../global/global")
module.exports = function (Entregas) {
  Entregas.EnviarEntregaFirebase = function (Entrega, cb) {
    var url = global.FirebaseURL +
      "/Entregas/" +
      Entrega.IdEntrega +
      ".json";
    pubsub.serviceConsumer_put(url, Entrega, function (data, err) {
      if (data != null) {
        var json = JSON.parse(data);
        cb(null, json);
      }
      if (err != null) {
        cb(null, err);
      }
    });
  };
  Entregas.remoteMethod("EnviarEntregaFirebase", {
    http: {
      path: "/EnviarEntregaFirebase",
      verb: "put",
    },
    accepts: [{ arg: "Entrega", type: "object", http: { source: "body" } }],
    returns: { arg: "Respuesta", type: "array" },
  });
  ///////////////////////////////////////////////////////////////////
  Entregas.EnviarCabeceraFirebase = function (Cabecera, cb) {
    console.log(Cabecera)
    var url =
      "https://hansa-business-mobile-qas.firebaseio.com/:80/Recibo/" +
      Cabecera.ReciboID +
      ".json";
    pubsub.serviceConsumer_put(url, Cabecera, function (data, err) {
      if (data != null) {
        var json = JSON.parse(data);
        cb(null, json);
      }
      if (err != null) {
        cb(null, err);
      }
    });
  };
  Entregas.remoteMethod("EnviarCabeceraFirebase", {
    http: {
      path: "/EnviarCabeceraFirebase",
      verb: "put",
    },
    accepts: [{ arg: "Cabecera", type: "object", http: { source: "body" } }],
    returns: { arg: "Respuesta", type: "array" },
  });
  ///////////////////////////////////////////////////////////////////
  Entregas.EnviarDetalleFirebase = function (Detalle, cb) {
    var url =
      "https://hansa-business-mobile-qas.firebaseio.com/:80/Abono/" +
      Detalle.AbonoID +
      ".json";
    pubsub.serviceConsumer_put(url, Detalle, function (data, err) {
      if (data != null) {
        var json = JSON.parse(data);
        cb(null, json);
      }
      if (err != null) {
        cb(null, err);
      }
    });
  };
  Entregas.remoteMethod("EnviarDetalleFirebase", {
    http: {
      path: "/EnviarDetalleFirebase",
      verb: "put",
    },
    accepts: [{ arg: "Detalle", type: "object", http: { source: "body" } }],
    returns: { arg: "Respuesta", type: "array" },
  });
  ///////////////////////////////////////////////////////////////////
  Entregas.EnviarEstadoMagento = function (Entrega, cb) {
    var url = global.Magento;
    pubsub.serviceConsumer_post(url, Entrega, function (data, err) {
      if (data != null) {
        var json = JSON.parse(data);
        cb(null, json);
      }
      if (err != null) {
        cb(null, err);
      }
    });
  };
  Entregas.remoteMethod("EnviarEstadoMagento", {
    http: {
      path: "/EnviarEstadoMagento",
      verb: "post",
    },
    accepts: [{ arg: "Entrega", type: "object", http: { source: "body" } }],
    returns: { arg: "Respuesta", type: "array" },
  });
  ///////////////////////////////////////////////////////////////////

  Entregas.DeleteEntregaFirebase = (Entrega, cb) => {
    var url =
      global.FirebaseURL +
      "/Entregas/" +
      Entrega.IdEntrega +
      ".json";
    pubsub.serviceConsumer_delete(url, function (data, err) {
      if (data != null) {
        var json = JSON.parse(data);
        cb(null, json);
      }
      if (err != null) {
        cb(null, err);
      }
    });
  };
  Entregas.remoteMethod("DeleteEntregaFirebase", {
    http: { verb: "put" },
    accepts: [{ arg: "Entrega", type: "object", http: { source: "body" } }],
    returns: { arg: "data", type: ["string"], root: true },
  });
  ///////////////////////////////////////////////////////////////////
  // afterInitialize is a model hook which is still used in loopback
  Entregas.afterInitialize = function () {
    // http://docs.strongloop.com/display/public/LB/Model+hooks#Modelhooks-afterInitialize
    //console.log('> afterInitialize triggered');
  };

  // the rest are all operation hooks
  // - http://docs.strongloop.com/display/public/LB/Operation+hooks
  Entregas.observe("before save", function (ctx, next) {
    //console.log('> before save triggered:', ctx.Model.modelName, ctx.instance || ctx.data);
    next();
  });
  Entregas.observe("after save", function (ctx, next) {
    //socket.emit('/Entregas/POST',ctx.instance);
    pubsub.publish("Entrega_Progreso", ctx.instance);
    //console.log('> after save triggered:', ctx.Model.modelName, ctx.instance);
    next();
  });
  Entregas.observe("before delete", function (ctx, next) {
    //console.log('> before delete triggered:', ctx.Model.modelName, ctx.instance);
    next();
  });
  Entregas.observe("after delete", function (ctx, next) {
    pubsub.publish("/Entregas/DELETE", ctx.instance || ctx.where);
    //console.log('> after delete triggered:', ctx.Model.modelName, (ctx.instance || ctx.where));
    next();
  });

  // remote method after hook
  Entregas.afterRemote(
    "revEngine",
    function (context, remoteMethodOutput, next) {
      //console.log('Turning off the engine, removing the key.');
      next();
    }
  );

  // model operation hook
  Entregas.observe("before save", function (ctx, next) {
    if (ctx.instance) {
      //console.log('About to save a Entregas instance:', ctx.instance);
    } else {
      //console.log('About to update Entregass that match the query %j:', ctx.where);
    }
    next();
  });
};
