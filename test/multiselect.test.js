const chai    = require("chai");
const Schema  = require("..");
const _       = require('lodash');

chai.should();

describe("MULTISELECT", () => {
  describe("Validation", () => {
    const person = new Schema({
      fields: {
        favouritePlanets: {
          type: 'multiselect',
          options: [
            'earth',
            'mars',
            'pluto'
          ]
        },
        favouritePlanets2: {
          type: 'multiselect',
          options: () => {
            return new Promise((resolve) => {
              setTimeout(() => {
                resolve([
                  'earth',
                  'mars',
                  'pluto'
                ]);
              }, 10);
            });
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

    it("Should not accept a value which isn't an option", async () => {
      let { errors } = await person.validate({
        favouritePlanets: [ 'earth', 'jupiter', 'venus' ]
      });
      errors.should.have.lengthOf(2);
      errors[0].should.equal(
        "Property 'favouritePlanets' has an invalid value 'jupiter'"
      );
      errors[1].should.equal(
        "Property 'favouritePlanets' has an invalid value 'venus'"
      );
    });

    it("Should accept values from the options", async () => {
      let { errors } = await person.validate({
        favouritePlanets: [ 'earth', 'mars' ]
      });
      errors.should.have.lengthOf(0);
    });

    it("Should accept an empty array", async () => {
      let { errors } = await person.validate({
        favouritePlanets: []
      });
      errors.should.have.lengthOf(0);
    });

    it("Should support options as an asynchronous function", async () => {
      let { errors } = await person.validate({
        favouritePlanets2: [ 'earth', 'mars' ]
      });
      errors.should.have.lengthOf(0);
    });
  });
});
