"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var schema_1 = require("../schema");
var validators = {
    match: function (data, field, regex) {
        if (!regex.test(data)) {
            return "Property '" + field.name + "' should match " + regex.toString();
        }
    }
};
exports.default = schema_1.default.registerType('email', {
    options: {
        'match': 'A regular expression to match the email against'
    },
    validate: function (data, field) {
        if (!_.isString(data) || !/.+\@.+\..+/.test(data)) {
            return "Property '" + field.name + "' should be a valid email address";
        }
        return _.chain(this.options)
            .filter(function (opt) { return _.has(field, opt); })
            .map(function (opt) { return validators[opt](data, field, field[opt]); })
            .compact()
            .value();
    }
});
