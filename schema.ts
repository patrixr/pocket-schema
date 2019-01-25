import * as _ from 'lodash'
import {
  SchemaProperties,
  Field,
  Type,
  ValidationOptions,
  ValidationResults,
  Errors
} from './definitions'


function merge(arr, value) {
  if (value) {
    const values = _.isArray(value) ? value : [ value ];
    Array.prototype.push.apply(arr, values);
  }
}

let REGISTERED_TYPES = new Object() as {
  [key:string]:Type
};

/**
 * Schema implementation
 *
 * @class Schema
 */
class Schema {

  //
  // ---- Static members
  //
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

  static allTypes() {
    return REGISTERED_TYPES;
  }

  //
  // ---- Instance members
  //

  private fields : Field[]
  private properties : SchemaProperties

  constructor(properties : SchemaProperties) {
    if (!_.has(properties, 'fields')) {
      console.warn("[Schema] Warning : missing 'fields' property");
    }

    this.properties = { additionalProperties: true, ...properties };
    this.fields = properties.fields = this._normalize(properties.fields);
  }

  /**
   * Transforms the schema into a normalized format
   * Map schemas are transformed into arrays
   *
   * @param {*} fields
   * @returns {Field[]}
   * @memberof Schema
   */
  _normalize(fields : any) : Field[] {
    if (_.isArray(fields)) {
      return fields;
    }
    return _.map(fields, (f, name) => {
      let field = _.isString(f) ? { type : f } : f;
      return _.extend(field, { name });
    });
  }

  /**
   * Check for any key that has not been defined
   *
   * @param record
   * @param opts
   */
  findInvalidFields(record, opts : ValidationOptions = {}) : Errors {
    const errors = [] as string[];
    _.each(_.keys(record), (key) => {
      if (!_.find(this.fields, ['name', key])) {
        let path = opts.parentKey ? `${opts.parentKey}.${key}` : key;
        errors.push(`Property '${path}' is not allowed`)
      }
    });
    return errors;
  }

  /**
   * Sets values for computed and default properties
   *
   * @param data
   * @param fields
   */
  async compute(data, fields = this.fields) {
    for (let field of fields) {
      if (field.computed) {
        if (!field.compute) {
          throw `Computed field '${field.name}' is missing the compute(data) method`;
        }
        data[field.name] = await field.compute(data);
      } else if ((_.isUndefined(data[field.name]) || data[field.name] === null) && !_.isUndefined(field.default)) {
          data[field.name] = field.default;
      }
    }
  }

  /**
   * Data validation method
   *
   * @param payload
   * @param opts
   */
  async validate(payload : object, opts : ValidationOptions = {}) : Promise<ValidationResults> {
    const errors  = [] as string[];
    const record  = _.cloneDeep(payload);
    const {
      additionalProperties = true,
      ignoreRequired = false
    } = {
      ...this.properties,
      ...opts
    };

    if (!additionalProperties) {
      // --> check for keys that are not specified by the schema
      merge(errors, this.findInvalidFields(record, opts));
    }

    const nonComputedFields = _.filter(this.fields, (f) => !f.computed);
    const computedFields    = _.filter(this.fields, ['computed', true]);
    const fieldSets         = [ nonComputedFields, computedFields ];

    for (let fields of fieldSets) {

      if (errors.length) {
        break;
      }

      await this.compute(record, fields);

      for (let field of fields) {
        const type  = Schema.getType(field.type);

        field.path = opts.parentKey ? `${opts.parentKey}.${field.name}` : field.name;

        if (!type) {
          // ---> This type hasn't been registered
          errors.push(`Property '${field.path}' has an unknown type '${field.type}'`);
          break;
        }

        if (!_.has(record, field.name) || record[field.name] === null) {
          // ---> The field is missing
          if (field.required && !ignoreRequired) {
            errors.push(`Property '${field.path}' is missing`);
          }
          continue;
        }

        // --> run type validation
        let errs = await type.validate(record[field.name], field, opts);
        let noErrors = !errs || !errs.length;

        if (noErrors && _.isFunction(field.validate)) {
          // ---> use custom validator
          errs = field.validate(record[field.name], field);
        }

        merge(errors, errs);
      }
    }

    const valid = errors.length === 0;
    if (!valid) {
      return {
        valid, errors,
        data: {},
        computed: {}
      };
    }

    const data = _.omit(_.cloneDeep(record), _.map(computedFields, 'name'));

    return {
      valid,
      errors,
      data: data,
      computed: record
    };
  }
}

export default Schema;

// ---- Load default types
const requireDir = require('require-dir');
requireDir('./types');
