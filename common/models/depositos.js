"use strict";
var pubsub = require("../../server/pubsub.js");
module.exports = function (Depositos) {
  // afterInitialize is a model hook which is still used in loopback
  Depositos.afterInitialize = function () {
    // http://docs.strongloop.com/display/public/LB/Model+hooks#Modelhooks-afterInitialize
    //console.log('> afterInitialize triggered');
  };

  // the rest are all operation hooks
  // - http://docs.strongloop.com/display/public/LB/Operation+hooks
  Depositos.observe("before save", function (ctx, next) {
    //console.log('> before save triggered:', ctx.Model.modelName, ctx.instance || ctx.data);
    next();
  });
  Depositos.observe("after save", function (ctx, next) {
    //socket.emit('/Depositos/POST',ctx.instance);
    pubsub.publish("Deposito_Entrante", ctx.instance);
    //console.log('> after save triggered:', ctx.Model.modelName, ctx.instance);
    next();
  });
  Depositos.observe("before delete", function (ctx, next) {
    //console.log('> before delete triggered:', ctx.Model.modelName, ctx.instance);
    next();
  });
  Depositos.observe("after delete", function (ctx, next) {
    pubsub.publish("/Depositos/DELETE", ctx.instance || ctx.where);
    //console.log('> after delete triggered:', ctx.Model.modelName, (ctx.instance || ctx.where));
    next();
  });

  // remote method after hook
  Depositos.afterRemote(
    "revEngine",
    function (context, remoteMethodOutput, next) {
      //console.log('Turning off the engine, removing the key.');
      next();
    }
  );

  // model operation hook
  Depositos.observe("before save", function (ctx, next) {
    if (ctx.instance) {
      //console.log('About to save a Depositos instance:', ctx.instance);
    } else {
      //console.log('About to update Depositoss that match the query %j:', ctx.where);
    }
    next();
  });
};
