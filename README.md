# Pocket schema

![](https://travis-ci.org/patrixr/pocket-cms.svg?branch=master)

Validates records against a schema. 

Intended to be used within [Pocket CMS](https://github.com/patrixr/pocket-cms)

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Getting started](#getting-started)
  - [Installation](#installation)
  - [Usage](#usage)
- [Options](#options)
- [Supported types](#supported-types)
- [Custom validators](#custom-validators)
- [Adding custom types](#adding-custom-types)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Getting started

### Installation
Install `pocket-schema` as dependency of your project

```
npm install --save pocket-schema
```

### Usage


```javascript
const Schema = require('pocket-schema');

// Create a schema
const personSchema = new Schema({
  additionalProperties: false,
  fields: {
    name: {
      type: 'string',
      required: true
    },
    origin: {
      type: 'select',
      options: [
        'earth',
        'mars',
        'pluto'	
      ]
    }
  }
});

// Validate data against the schema
const { errors, valid, data } = await personSchema.validate({
  name: 'john',
  origin: 'earth'
});

```

## Options

The validate method has the following signature :

`validate(payload : object, opts : ValidationOptions = {})`

The following validation options are available :

* `additionalProperties` Whether extra properties are allowed in the schema. Defaults to `true`
* `ignoreRequired` If set to true, no error will be raised for missing properties marked as `required:true`

## Supported types

<!--PocketTypes:start-->
* `any` 

* `array|list`  - options:
	* `items?` A field definition of the expected array items

* `checkbox|boolean` 

* `date`  - options:
	* `format?` The expected date format (defaults to YYYY-MM-DD)

* `datetime` 

* `email`  - options:
	* `match?` A regular expression to match the email against

* `map`  - options:
	* `items?` A field definition of the expected map items

* `multiselect`  - options:
	* `options` List or options to select from. An async function can also be passed

* `number`  - options:
	* `min?` Minimum allowed value
	* `max?` Maximum allowed value

* `object|json`  - options:
	* `schema?` Schema used to validate the object against

* `password`  - options:
	* `minLength?` The minimum length of the password

* `select|enum`  - options:
	* `options` List or options to select from. An async function can also be passed

* `text|string`  - options:
	* `minLength?` The minimum length of the string
	* `maxLength?` The maximum length of the string
	* `match?` A regular expression to match the string against

* `time` 

* `timestamp` 

<!--PocketTypes:end-->














## Custom validators

Additional validation can be performed if required by adding a `validator` method to a field.  
The expected signature is the following :

```typescript
validate(data: any, field: Field): Errors|Promise<Errors>
```

The validate method takes the data and the field as arguments, and returns a list or errors

e.g

```javascript
const Schema = require('pocket-schema');

// Create a schema
const personSchema = new Schema({
  additionalProperties: false,
  fields: {
  email: {
    type: 'email',
    required: true,
    validate(email, field) {
      if (!/@mycompany.com/.test(email)) {
        return ['Invalid email domain'];
      }
      return null;
    }
  }
 }
});
```



## Adding custom types

It is possible to register custom types with their custom validation.

Registering a pre-defined type will **override** the existing one.

```javascript
const Schema = require('pocket-schema');

Schema.registerType('model', {
  aliases: [
    'record'
  ],
  async validate(data, field) {
    const recordId = data; 
    const record = await db.find({ id: recordId });
    
    if (!record) {
      return `Invalid id ${recordId}`;
    }
    return null;
  }
});
```
