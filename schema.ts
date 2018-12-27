import * as _ from 'lodash'
import {
  SchemaProperties,
  Field,
  Type,
  ValidationOptions,
  ValidationResults
} from './definitions'

let REGISTERED_TYPES = new Object() as {
  [key:string]:Type
};

/**
 * Schema implementation
 *
 * @class Schema
 */
class Schema {

  // ---- Static members

  static registerType(name : string, type : Type) : Type {
    REGISTERED_TYPES[name] = type;
    return type;
  }

  static hasType(name : string) : boolean {
    return !!Schema.getType(name);
  }

  static getType(name : string) : Type|undefined {
    if (REGISTERED_TYPES[name]) {
      return REGISTERED_TYPES[name];
    }
    return _.find(REGISTERED_TYPES, (type : Type) => {
      return _.includes(type.aliases, name);
    });
  }

  static clearTypes() {
    REGISTERED_TYPES = {};
  }

  // Instance members

  private fields : Field[]

  constructor(private properties : SchemaProperties) {
    if (!_.has(properties, 'fields')) {
      console.warn("[Schema] Warning : missing 'fields' property");
    }

    this.fields = properties.fields = this.normalize(properties.fields);
  }

  normalize(fields : any) : Field[] {
    fields = _.isArray(fields) ? fields : _.map(fields, (f, name) => _.extend(f, { name }));
    return _.map(fields, (f) => {
      return _.isString(f) ? { type: f } : f;
    });
  }

  validate(payload : object, opts : ValidationOptions = {}) : ValidationResults {
    const errors  = [] as string[];
    const data    = _.cloneDeep(payload);
    const {
      additionalProperties,
      ignoreRequired
    } = _.extend({}, this.properties, opts);

    if (!additionalProperties) {
      // console.log("TODO");
    }

    _.each(this.fields, (field) => {
      const type = Schema.getType(field.type);

      if (!type) {
        return errors.push(`Property '${field.name}' has an unknown type '${field.type}'`);
      }

      if (!_.has(data, field.name)) {
        if (field.default) {
          data[field.name] = field.default;
        } else if (field.required && !ignoreRequired) {
          errors.push(`Property '${field.name}' is missing'`);
          return;
        } else {
          return;
        }
      }

      let errs = type.validate(data[field.name], field);
      if (errs) {
        errs = _.isArray(errs) ? errs : [ errs ];
        Array.prototype.push.apply(errors, errs);
      }
    });

    return {
      valid: errors.length === 0,
      errors,
      data
    };

  }
}

export default Schema;

// ---- Load default types
const requireDir = require('require-dir');
requireDir('./types');
