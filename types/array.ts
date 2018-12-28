import * as _     from 'lodash'
import Schema     from '../schema'
import {
  Field, ValidationOptions
} from '../definitions'

interface ArrayField extends Field {
  items : Field
}

export default Schema.registerType('array', {
  options: {
    'items?': 'A field definition of the expected array items'
  },
  aliases: [
    'list'
  ],
  async validate(data : any[], field : ArrayField, opts : ValidationOptions) {
    let options = [] as any[];

    if (!_.isArray(data)) {
      return  `Property '${field.path}' should be an array`;
    }

    if (field.items) {
      const itemField = field.items;
      const type      = Schema.getType(itemField.type);

      if (!type) {
        return `Property '${field.path}' has an unknown item type '${itemField.type}'`
      }

      for (let i in data) {
        let val   = data[i];
        let path  = `${field.path}[${i}]`;
        let err = await type.validate(data[i], _.extend({}, itemField, { path }), opts);

        if (err && err.length) {
          return err;
        }
      }
    }
    return null;
  }
});