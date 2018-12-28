import * as moment  from 'moment'
import Schema       from '../schema'
import { Field }    from '../definitions'

interface DateField extends Field {
  format? : string
}

export default Schema.registerType('date', {
  options: {
    'format?': 'The expected date format (defaults to YYYY-MM-DD)'
  },
  validate(data, field : DateField) {
    const format = field.format || 'YYYY-MM-DD';
    if (!moment(data, format, true).isValid()) {
      return `Property '${field.path}' should be a valid date (${format})`;
    }
    return null;
  }
});