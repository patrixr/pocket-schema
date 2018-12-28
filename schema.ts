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
    if (_.isArray(fields)) {
      return fields;
    }
    return _.map(fields, (f, name) => {
      let field = _.isString(f) ? { type : f } : f;
      return _.extend(field, { name });
    });
  }

  async validate(payload : object, opts : ValidationOptions = {}) : Promise<ValidationResults> {
    const errors  = [] as string[];
    const data    = _.cloneDeep(payload);
    const {
      additionalProperties,
      ignoreRequired
    } = _.extend({}, this.properties, opts);

    if (!additionalProperties) {
      // console.log("TODO");
    }

    for (let idx in this.fields) {
      const field = this.fields[idx];
      const type  = Schema.getType(field.type);

      field.path = opts.parentKey ? `${opts.parentKey}.${field.name}` : field.name;

      if (!type) {
        errors.push(`Property '${field.path}' has an unknown type '${field.type}'`);
        break;
      }

      if (!_.has(data, field.name)) {
        if (field.default) {
          data[field.name] = field.default;
        } else if (field.required && !ignoreRequired) {
          errors.push(`Property '${field.path}' is missing'`);
          continue;
        } else {
          continue;
        }
      }

      let errs = await type.validate(data[field.name], field, opts);
      if (errs) {
        errs = _.isArray(errs) ? errs : [ errs ];
        Array.prototype.push.apply(errors, errs);
      }
    }

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
