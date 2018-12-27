"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var schema_1 = require("../schema");
function value(val, defaultVal) {
    return (val !== undefined && _.isFinite(val)) ? val : defaultVal;
}
exports.default = schema_1.default.registerType('number', {
    options: {
        'min': 'Minimum allowed value',
        'max': 'Maximum allowed value'
    },
    validate: function (val, field) {
        if (!_.isFinite(val)) {
            return "Property '" + field.name + "' should be a number";
        }
        var minimum = value(field.min, -Infinity);
        var maximum = value(field.max, Infinity);
        var errors = [];
        if (val < minimum) {
            errors.push("Property '" + field.name + "' should be equal or greater than " + field.min);
        }
        if (val > maximum) {
            errors.push("Property '" + field.name + "' should equal or lower than " + field.max);
        }
        return errors;
    }
});
