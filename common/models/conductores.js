"use strict";
var pubsub = require("../../server/pubsub.js");
module.exports = function (Conductores) {
     ///////////////////////////////////////////////////////////////////
  // afterInitialize is a model hook which is still used in loopback
  Conductores.afterInitialize = function () {
    // http://docs.strongloop.com/display/public/LB/Model+hooks#Modelhooks-afterInitialize
    //console.log('> afterInitialize triggered');
  };

  // the rest are all operation hooks
  // - http://docs.strongloop.com/display/public/LB/Operation+hooks
  Conductores.observe("before save", function (ctx, next) {
    //console.log('> before save triggered:', ctx.Model.modelName, ctx.instance || ctx.data);
    next();
  });
  Conductores.observe("after save", function (ctx, next) {
    //socket.emit('/Conductores/POST',ctx.instance);
    pubsub.publish("Conductor_Ingresa_Modificado", ctx.instance);
    //console.log('> after save triggered:', ctx.Model.modelName, ctx.instance);
    next();
  });
  Conductores.observe("before delete", function (ctx, next) {
    //console.log('> before delete triggered:', ctx.Model.modelName, ctx.instance);
    next();
  });
  Conductores.observe("after delete", function (ctx, next) {
    pubsub.publish("/Conductores/DELETE", ctx.instance || ctx.where);
    //console.log('> after delete triggered:', ctx.Model.modelName, (ctx.instance || ctx.where));
    next();
  });

  // remote method after hook
  Conductores.afterRemote(
    "revEngine",
    function (context, remoteMethodOutput, next) {
      //console.log('Turning off the engine, removing the key.');
      next();
    }
  );

  // model operation hook
  Conductores.observe("before save", function (ctx, next) {
    if (ctx.instance) {
      //console.log('About to save a Conductores instance:', ctx.instance);
    } else {
      //console.log('About to update Conductoress that match the query %j:', ctx.where);
    }
    next();
  });
};
