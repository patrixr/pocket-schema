import Schema       from '../schema'
import { Field }    from '../definitions'

export default Schema.registerType('checkbox', {
  aliases: [
    'boolean'
  ],
  validate(data, field : Field) {
    if (data !== false && data !== true) {
      return `Property '${field.path}' should be a true|false value`
    }
    return null;
  }
});