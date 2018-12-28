import * as _     from 'lodash'
import Schema     from '../schema'
import {
  Field, ValidationOptions
} from '../definitions'

interface MapField extends Field {
  items : Field
}

export default Schema.registerType('map', {
  options: {
    'items?': 'A field definition of the expected map items'
  },
  async validate(data : any[], field : MapField, opts : ValidationOptions) {
    let options = [] as any[];

    if (!_.isPlainObject(data)) {
      return  `Property '${field.path}' should be a map`;
    }

    if (field.items) {
      const itemField = field.items;
      const type      = Schema.getType(itemField.type);

      if (!type) {
        return `Property '${field.path}' has an unknown item type '${itemField.type}'`
      }

      for (let key in data) {
        let val   = data[key];
        let path  = `${field.path}[${key}]`;
        let err = await type.validate(data[key], _.extend({}, itemField, { path }), opts);

        if (err && err.length) {
          return err;
        }
      }
    }
    return null;
  }
});