"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var schema_1 = require("../schema");
schema_1.default.registerType('password', {
    options: {
        'minLength': 'The minimum length of the password'
    },
    validate: function (data, field) {
        if (!_.isString(data)) {
            return "Property '" + field.name + "' should be a string";
        }
        var minLength = field.minLength || 1;
        if (data.length < minLength) {
            return "Property '" + field.name + "' should be of at least " + minLength + " character(s)";
        }
        return null;
    }
});
