# Pocket schema

Validates records against a schema. 

Intended to be used within [Pocket CMS](https://github.com/patrixr/pocket-cms)

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
  async validate(data, field : EmailField) {
    const recordId = data; 
    const record = await db.find({ id: recordId });
    
    if (!record) {
      return `Invalid id ${recordId}`;
    }
    return null;
  }
});
```
