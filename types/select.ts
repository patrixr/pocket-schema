import * as _     from 'lodash'
import Schema     from '../schema'
import {
  Errors,
  Field
} from '../definitions'

interface SelectField extends Field {
  options : any[]|Function
}

export default Schema.registerType('select', {
  options: {
    'options': 'List or options to select from. An async function can also be passed'
  },
  aliases: [
    'enum'
  ],
  async validate(data, field : SelectField) {
    let options = [] as any[];

    if (field.options) {
      if (_.isArray(field.options)) {
        options = field.options;
      }
      if (_.isFunction(field.options)) {
        options = await field.options();
      }
    }

    if (!_.includes(options, data)) {
      return `Property '${field.path}' is not a valid selection`;
    }

    return null;
  }
});