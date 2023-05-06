module.exports = function (app) {
  delete app.models.Conductores.validations.email;
  app.models.Conductores.settings.acls = require("../../common/acl/conductores-acls.json");
};
