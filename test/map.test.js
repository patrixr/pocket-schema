const chai    = require("chai");
const Schema  = require("..");
const _       = require('lodash');

chai.should();

describe("MAP", () => {
  describe("Validation", () => {
    const person = new Schema({
      fields: {
        traits: {
          type: 'map'
        },
        traits2: {
          type: 'map',
          items: {
            type: 'string'
          }
        }
      }
    });

    it("Should not accept non-object values", async () => {
      let { errors } = await person.validate({
        traits: 'hello'
      });
      errors.should.have.lengthOf(1);
      errors[0].should.equal(
        "Property 'traits' should be a map"
      );
    });

    it("Should not accept map values", async () => {
      let { errors } = await person.validate({
        traits: {
          eyeColor: 'red',
          noOfEyes: 2
        }
      });
      errors.should.have.lengthOf(0);
    });

    it("Should not accept maps with items that don't match the specified 'items' type", async () => {
      let { errors } = await person.validate({
        traits2: {
          eyeColor: 'red',
          noOfEyes: 2
        }
      });
      errors.should.have.lengthOf(1);
      errors[0].should.equal(
        "Property 'traits2[noOfEyes]' should be a string"
      );
    });

    it("Should accept maps with items that match the specified 'items' type", async () => {
      let { errors } = await person.validate({
        traits2: {
          eyeColor: 'red',
          hairColor: 'blue'
        }
      });
      errors.should.have.lengthOf(0);
    });
  });
});
