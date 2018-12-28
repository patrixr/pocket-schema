const chai    = require("chai");
const Schema  = require("..");
const _       = require('lodash');

chai.should();

describe("SELECT", () => {
  describe("Validation", () => {
    const person = new Schema({
      fields: {
        origin: {
          type: 'select',
          options: [
            'earth',
            'mars',
            'pluto'
          ]
        },
        origin2: {
          type: 'select',
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

    it("Should not accept a value which isn't an option", async () => {
      let { errors } = await person.validate({
        origin: 'jupiter'
      });
      errors.should.have.lengthOf(1);
      errors[0].should.equal(
        "Property 'origin' is not a valid selection"
      );
    });

    it("Should accept values from the options", async () => {
      let { errors } = await person.validate({
        origin: 'earth'
      });
      errors.should.have.lengthOf(0);
    });

    it("Should support options as an asynchronous function", async () => {
      let { errors } = await person.validate({
        origin2: 'earth'
      });
      errors.should.have.lengthOf(0);
    });
  });
});
