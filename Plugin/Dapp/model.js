// 简化
(function (global) {

    var factoryMap = {};

    define = function (id, factory) { }

    require = function (id) { }

    global.define = define

    global.require = require

})(window)