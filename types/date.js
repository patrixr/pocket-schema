"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var moment = require("moment");
var schema_1 = require("../schema");
exports.default = schema_1.default.registerType('date', {
    options: {
        'format': 'The expected date format (defaults to YYYY-MM-DD)'
    },
    validate: function (data, field) {
        var format = field.format || 'YYYY-MM-DD';
        if (!moment(data, format, true).isValid()) {
            return "Property '" + field.name + "' should be a valid date (" + format + ")";
        }
        return null;
    }
});
