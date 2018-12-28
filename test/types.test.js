const _       = require("lodash");
const chai    = require("chai");
const Schema  = require("..");

const { expect } = chai;
chai.should();

function good(fields) {
  expect(() => {
    new Schema({ fields });
  }).not.to.throw;
}

function bad(fields) {
  expect(() => {
    new Schema({ fields });
  }).to.throw;
}

const SUPPORTED_TYPES = [
  'text',
  'email',
  'password',
  'number',
  'date',
  'time',
  'datetime',
  'timestamp',
  'object',
  'select',
  'multiselect',
  'array',
  'map',
  'any'
];

const ALIASES = {
  "string": "text",
  "json": "object",
  "enum": "select",
  "list": "array"
};

const ALL_TYPES = _.concat(SUPPORTED_TYPES, _.keys(ALIASES));

describe("Supported types", () => {
  function schemaWithType(type) {
    return new Schema({
      fields: {
        myProp: {
          type
        }
      }
    });
  }

  it("Should not support unknown types", () => {
    bad({
      myProp: {
        type: "meteorite"
      }
    });
  });

  _.each(ALL_TYPES, type => {
    it(`Should support the ${type} type`, () => {
      expect(Schema.hasType(type)).to.be.true
      good({
        myProp: {
          type
        }
      });
    });
  });

  it("Should support fields both as an array and as map", () => {
    good({
      myProp: {
        type: "string"
      }
    });

    good([
      {
        name: "myProp",
        type: "string"
      }
    ]);
  });

  it("Should support a single type string shorthand", () => {
    good({
      myProp: "string"
    });
  });
});