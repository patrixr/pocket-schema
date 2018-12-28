import * as _     from 'lodash'
import Schema     from '../schema'
import { Field }  from '../definitions'

export default Schema.registerType('timestamp', {
  validate(val, field : Field) {
    if (!_.isFinite(val)) {
      return `Property '${field.path}' should be a valid timestamp (number)`;
    }
    return null;
  }
});