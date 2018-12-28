import * as _     from 'lodash'
import Schema     from '../schema'
import { Field }  from '../definitions'

interface EmailField extends Field {
  match? : RegExp
}

export default Schema.registerType('email', {
  options: {
    'match?': 'A regular expression to match the email against'
  },
  validate(data, field : EmailField) {
    if (!_.isString(data) || !/.+\@.+\..+/.test(data)) {
      return `Property '${field.path}' should be a valid email address`;
    }

    const regex = field.match;
    if (regex && regex.test && !regex.test(data)) {
      return `Property '${field.path}' should match ${regex.toString()}`;
    }

    return null;
  }
});