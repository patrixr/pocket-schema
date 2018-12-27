import * as _     from 'lodash'
import Schema     from '../schema'
import { Field }  from '../definitions'

interface PasswordField extends Field {
  minLength?: number
}

Schema.registerType('password', {
  options: {
    'minLength': 'The minimum length of the password'
  },
  validate(data, field : PasswordField) {
    if (!_.isString(data)) {
      return `Property '${field.name}' should be a string`;
    }
    const minLength = field.minLength || 1;
    if (data.length < minLength) {
      return `Property '${field.name}' should be of at least ${minLength} character(s)`;
    }
    return null;
  }
});