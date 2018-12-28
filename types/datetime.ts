import Schema       from '../schema'
import { Field }    from '../definitions'

export default Schema.registerType('datetime', {
  validate(data, field : Field) {
    const timestamp = Date.parse(data);
    if (isNaN(timestamp)) {
      return `Property '${field.path}' should be a valid datetime`;
    }
    return null;
  }
});