const chai    = require("chai");
const Schema  = require("..");
const _       = require('lodash');

chai.should();

describe("TIMESTAMP", () => {
  describe("Validation", () => {
    const person = new Schema({
      fields: {
        lastLogin: {
          type: 'timestamp'
        }
      }
    });

    it("Should accept number values", async () => {
      let { errors } = await person.validate({
        lastLogin: Date.now()
      });
      errors.should.have.lengthOf(0);
    });

    it("Should reject non numeric values", async () => {
      let { errors } = await person.validate({
        lastLogin: '28'
      });
      errors.should.have.lengthOf(1);
      errors[0].should.equal(
        "Property 'lastLogin' should be a valid timestamp (number)"
      );
    });
  });
});
