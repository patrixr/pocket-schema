/**
 * Type definitions
 */

export interface Field {
  name:       string,
  type:       string,
  required?:  true,
  default?:   any
}

export interface SchemaProperties {
  fields: Field[],
  additionalProperties: boolean
}

export type Errors = string[] | string | null

export interface Type {
  options?: { [key:string]:string },
  aliases?: string[],
  validateField?(field : Field): Errors,
  validate(data : any, field : Field): Errors
}

export interface ValidationOptions {
  additionalProperties?: boolean,
  ignoreRequired?:       boolean
}

export interface ValidationResults {
  valid:    boolean,
  errors:   Errors,
  data:     any
}