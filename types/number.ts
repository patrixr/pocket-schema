import * as _     from 'lodash'
import Schema     from '../schema'
import { Field }  from '../definitions'

interface NumberField extends Field {
  min?: number,
  max?: number
}

function value(val : number|undefined, defaultVal : number) : Number{
  return (val !== undefined && _.isFinite(val)) ? val : defaultVal;
}

export default Schema.registerType('number', {
  options: {
    'min?': 'Minimum allowed value',
    'max?': 'Maximum allowed value'
  },
  validate(val, field : NumberField) {
    if (!_.isFinite(val)) {
      return `Property '${field.path}' should be a number`;
    }

    const minimum = value(field.min, -Infinity);
    const maximum = value(field.max, Infinity);
    const errors = [] as string[];
    if (val < minimum) {
      errors.push(`Property '${field.path}' should be equal or greater than ${field.min}`);
    }
    if (val > maximum) {
      errors.push(`Property '${field.path}' should equal or lower than ${field.max}`);
    }
    return errors;
  }
});