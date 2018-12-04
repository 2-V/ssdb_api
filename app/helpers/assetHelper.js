// assetHelper.js

var util     = require("util");
var settings = require('../../settings');


exports.isEmptyObject = function(obj) {
  return !Object.keys(obj).length;
}
