import * as _     from 'lodash'
import Schema     from '../schema'
import { Field }  from '../definitions'

interface EmailField extends Field {
  match? : RegExp
}

const validators = {
  match(data : string, field : Field, regex : RegExp) {
    if (!regex.test(data)) {
      return `Property '${field.name}' should match ${regex.toString()}`;
    }
  }
};

export default Schema.registerType('email', {
  options: {
    'match': 'A regular expression to match the email against'
  },
  validate(data, field : Field) {
    if (!_.isString(data) || !/.+\@.+\..+/.test(data)) {
      return `Property '${field.name}' should be a valid email address`;
    }

    return _.chain(this.options)
      .filter(opt => _.has(field, opt))
      .map(opt => validators[opt](data, field, field[opt]))
      .compact()
      .value();
  }
});