const chai    = require("chai");
const Schema  = require("..");
const _       = require('lodash');

chai.should();

describe('EMAIL', () => {
  describe("Validation", () => {
    const person = new Schema({
      fields: {
        email: {
          type: 'email'
        }
      }
    });

    it("Should accept properly formatted emails", async () => {
      let { errors } = await person.validate({
        email: "my@email.com"
      });
      errors.should.have.lengthOf(0);
    });

    it("Should not accept empty string values", async () => {
      let { errors } = await person.validate({
        email: ""
      });
      errors.should.have.lengthOf(1);
      errors[0].should.equal(
        "Property 'email' should be a valid email address"
      );
    });

    it("Should reject non string values", async () => {
      let { errors } = await person.validate({
        email: 28
      });
      errors.should.have.lengthOf(1);
      errors[0].should.equal(
        "Property 'email' should be a valid email address"
      );
    });

    it("Should not accept badly formatted emails", async () => {
      let { errors } = await person.validate({
        email: "helloworld"
      });
      errors.should.have.lengthOf(1);
      errors[0].should.equal(
        "Property 'email' should be a valid email address"
      );
    });
  });
});
