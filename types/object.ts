import * as _     from 'lodash'
import Schema     from '../schema'
import {
  ValidationOptions,
  Field
} from '../definitions'

interface ObjectField extends Field {
  schema?: Schema
}

export default Schema.registerType('object', {
  options: {
    'schema?': 'Schema used to validate the object against',
  },
  aliases: [
    'json'
  ],
  async validate(val, field : ObjectField, opts : ValidationOptions = {}) {
    if (!_.isPlainObject(val)) {
      return `Property '${field.name}' should be an object`;
    }
    if (field.schema && field.schema instanceof Schema) {
      let { errors } = await field.schema.validate(val, { ...opts, ...{ parentKey: field.path } })
      return errors;
    }
    return null;
  }
});