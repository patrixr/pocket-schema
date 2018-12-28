const chai    = require("chai");
const Schema  = require("..");
const _       = require('lodash');

chai.should();

describe("ARRAY", () => {
  describe("Validation", () => {
    const person = new Schema({
      fields: {
        traits: {
          type: 'array'
        },
        favouritePlanets: {
          type: 'array',
          items: {
            type: 'string'
          }
        }
      }
    });

    it("Should not accept non-array values", async () => {
      let { errors } = await person.validate({
        favouritePlanets: 'jupiter'
      });
      errors.should.have.lengthOf(1);
      errors[0].should.equal(
        "Property 'favouritePlanets' should be an array"
      );
    });

    it("Should accept arrays with any type if the 'items' property hasn't been set", async () => {
      let { errors } = await person.validate({
        traits: [ 'tall', 32 ]
      });
      errors.should.have.lengthOf(0);
    });

    it("Should not accept arrays with items that don't match the specified 'items' type", async () => {
      let { errors } = await person.validate({
        favouritePlanets: [ 'earth', 2 ]
      });
      errors.should.have.lengthOf(1);
      errors[0].should.equal(
        "Property 'favouritePlanets[1]' should be a string"
      );
    });

    it("Should accept arrays with items that match the specified 'items' type", async () => {
      let { errors } = await person.validate({
        favouritePlanets: [ 'earth', 'jupiter' ]
      });
      errors.should.have.lengthOf(0);
    });
  });
});
