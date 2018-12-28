const chai    = require("chai");
const Schema  = require("..");
const _       = require('lodash');

chai.should();

describe('DATETIME', () => {
  describe("Validation", () => {
    const person = new Schema({
      fields: {
        birthDay: {
          type: 'datetime'
        }
      }
    });

    it("Should accept date objects", async () => {
      let { errors } = await person.validate({
        birthDay: new Date()
      });
      errors.should.have.lengthOf(0);
    });

    it("Should accept properly formatted datetime strings", async () => {
      let { errors } = await person.validate({
        birthDay: "Fri Dec 28 2018 09:03:19 GMT+0300 (GMT+03:00)"
      });
      errors.should.have.lengthOf(0);
    });

    it("Should not accept badly formatted datetime strings", async () => {
      let { errors } = await person.validate({
        birthDay: "Fri Dec 28 222222018 09:03:19 GMT+0300 (GMT+03:00)"
      });
      errors.should.have.lengthOf(1);
      errors[0].should.equal(
        "Property 'birthDay' should be a valid datetime"
      );
    });
  });
});
