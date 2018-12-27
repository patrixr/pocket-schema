"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var schema_1 = require("../schema");
var validators = {
    minLength: function (data, field, min) {
        if (data.length < min) {
            return "Property '" + field.name + "' should have " + min + " or more characters";
        }
    },
    maxLength: function (data, field, max) {
        if (data.length > max) {
            return "Property '" + field.name + "' should have no more than " + max + " characters";
        }
    },
    match: function (data, field, regex) {
        if (!regex.test(data)) {
            return "Property '" + field.name + "' should match " + regex.toString();
        }
    }
};
schema_1.default.registerType('text', {
    options: {
        'minLength': 'The minimum length of the string',
        'maxLength': 'The maximum length of the string',
        'match': 'A regular expression to match the string against'
    },
    aliases: [
        'string'
    ],
    validate: function (data, field) {
        if (!_.isString(data)) {
            return "Property '" + field.name + "' should be a string";
        }
        return _.chain(this.options)
            .keys()
            .filter(function (opt) { return _.has(field, opt); })
            .map(function (opt) { return validators[opt](data, field, field[opt]); })
            .compact()
            .value();
    }
});
