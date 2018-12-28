/**
 * Type definitions
 */

export interface Field {
  name:       string,
  type:       string,
  path:       string,
  required?:  true,
  default?:   any,
  validate?(data: any, field: Field): Errors,
}

export interface SchemaProperties {
  fields: Field[],
  additionalProperties: boolean
}

export type Errors = string[] | string | null

export interface ValidationOptions {
  additionalProperties?: boolean,
  ignoreRequired?:       boolean,
  parentKey?:            string
}

export interface ValidationResults {
  valid:    boolean,
  errors:   Errors,
  data:     any
}

export interface Type {
  options?: { [key:string]:string },
  aliases?: string[],
  validate(data: any, field: Field, opts?: ValidationOptions): Errors|Promise<Errors>
}
