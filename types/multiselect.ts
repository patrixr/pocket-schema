import * as _     from 'lodash'
import Schema     from '../schema'
import {
  Field
} from '../definitions'

interface MultiSelectField extends Field {
  options : any[]|Function
}

export default Schema.registerType('multiselect', {
  options: {
    'options': 'List or options to select from. An async function can also be passed'
  },
  async validate(data : any[], field : MultiSelectField) {
    let options = [] as any[];

    if (!_.isArray(data)) {
      return  `Property '${field.path}' should be an array`;
    }

    if (field.options) {
      if (_.isArray(field.options)) {
        options = field.options;
      }
      if (_.isFunction(field.options)) {
        options = await field.options();
      }
    }

    return _.chain(data)
      .map((selection) => {
        if (!_.includes(options, selection)) {
          return `Property '${field.path}' has an invalid value '${selection}'`;
        }
      })
      .compact()
      .value();
  }
});