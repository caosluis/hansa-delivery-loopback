"use strict";
var pubsub = require("../../server/pubsub.js");
var global = require("../../global/global")
module.exports = function (Tareas) {
  Tareas.EnviarTareaFirebase = function (Tarea, cb) {
    var url = global.FirebaseURL + "/Entregas/" +
      Tarea.IdEntrega +
      "/DatosTareas/" +
      Tarea.IdTarea +
      ".json";
    pubsub.serviceConsumer_put(url, Tarea, function (data, err) {
      if (data != null) {
        var json = JSON.parse(data);
        cb(null, json);
      }
      if (err != null) {
        cb(null, err);
      }
    });
  };
  Tareas.remoteMethod("EnviarTareaFirebase", {
    http: {
      path: "/EnviarTareaFirebase",
      verb: "put",
    },
    accepts: [{ arg: "Tarea", type: "object", http: { source: "body" } }],
    returns: { arg: "Respuesta", type: "array" },
  });
  ///////////////////////////////////////////////////////////////////

  Tareas.DeleteTareasSql = (IdEntrega, cb) => {
    var ds = Tareas.dataSource;
    /* DELETE FROM HansaDelivery.Tareas WHERE IdEntrega='15'; */
    var sql =
      "DELETE FROM HansaDelivery.Tareas WHERE IdEntrega='" + IdEntrega + "';";

    ds.connector.query(sql, (err, instance) => {
      if (err) console.error(err);
      // pubsub.publish('/SiferangoscontingenciasEntrante/get', instance);
      cb(err, instance);
    });
  };
  Tareas.remoteMethod("DeleteTareasSql", {
    http: { verb: "delete" },
    accepts: [{ arg: "IdEntrega", type: ["string"] }],
    returns: { arg: "data", type: ["a"], root: true },
  });
  /////////////////////////////////////////////////////////////////////////////////////////////////
  // afterInitialize is a model hook which is still used in loopback
  Tareas.afterInitialize = function () {
    // http://docs.strongloop.com/display/public/LB/Model+hooks#Modelhooks-afterInitialize
    //console.log('> afterInitialize triggered');
  };

  // the rest are all operation hooks
  // - http://docs.strongloop.com/display/public/LB/Operation+hooks
  Tareas.observe("before save", function (ctx, next) {
    //console.log('> before save triggered:', ctx.Model.modelName, ctx.instance || ctx.data);
    next();
  });
  Tareas.observe("after save", function (ctx, next) {
    //socket.emit('/Tareas/POST',ctx.instance);
    pubsub.publish("Tarea_Ingresa_Modificado", ctx.instance);
    //console.log('> after save triggered:', ctx.Model.modelName, ctx.instance);
    next();
  });
  Tareas.observe("before delete", function (ctx, next) {
    //console.log('> before delete triggered:', ctx.Model.modelName, ctx.instance);
    next();
  });
  Tareas.observe("after delete", function (ctx, next) {
    pubsub.publish("/Tareas/DELETE", ctx.instance || ctx.where);
    //console.log('> after delete triggered:', ctx.Model.modelName, (ctx.instance || ctx.where));
    next();
  });

  // remote method after hook
  Tareas.afterRemote("revEngine", function (context, remoteMethodOutput, next) {
    //console.log('Turning off the engine, removing the key.');
    next();
  });

  // model operation hook
  Tareas.observe("before save", function (ctx, next) {
    if (ctx.instance) {
      //console.log('About to save a Tareas instance:', ctx.instance);
    } else {
      //console.log('About to update Tareass that match the query %j:', ctx.where);
    }
    next();
  });
};
