import * as _     from 'lodash'
import Schema     from '../schema'
import { Field }  from '../definitions'

interface TextField extends Field {
  minLength?: number,
  maxLength?: number,
  match? : RegExp
}

const validators = {
  minLength(data : string, field : Field, min : Number) {
    if (data.length < min) {
      return `Property '${field.path}' should have ${min} or more characters`;
    }
  },
  maxLength(data : string, field : Field, max : Number) {
    if (data.length > max) {
      return `Property '${field.path}' should have no more than ${max} characters`;
    }
  },
  match(data : string, field : Field, regex : RegExp) {
    if (!regex.test(data)) {
      return `Property '${field.path}' should match ${regex.toString()}`;
    }
  }
};

Schema.registerType('text', {
  options: {
    'minLength?': 'The minimum length of the string',
    'maxLength?': 'The maximum length of the string',
    'match?': 'A regular expression to match the string against'
  },
  aliases: [
    'string'
  ],
  validate(data, field : TextField) {
    if (!_.isString(data)) {
      return `Property '${field.path}' should be a string`;
    }
    return _.chain(this.options)
      .keys()
      .map(k => k.replace(/\?$/, ''))
      .filter(opt => _.has(field, opt))
      .map(opt => validators[opt](data, field, field[opt]))
      .compact()
      .value();
  }
});