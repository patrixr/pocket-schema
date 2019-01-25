import * as _           from 'lodash'
import Schema           from '../schema'
import { Field }        from '../definitions'
import * as isCSSColor  from 'is-css-color';

export default Schema.registerType('color', {
  validate(data, field : Field) {
    if (!isCSSColor(data)) {
      return `Property '${field.path}' should be a correctly formatted color`;
    }
    return null;
  }
});