const chai    = require("chai");
const Schema  = require("..");
const _       = require('lodash');

chai.should();

describe('PASSWORD', () => {
  describe("Validation", () => {
    const person = new Schema({
      fields: {
        password: {
          type: 'password'
        },
        password2: {
          type: 'password',
          minLength: 10
        }
      }
    });

    it("Should accept strings", () => {
      let { errors } = person.validate({
        password: "myP@ssword"
      });
      errors.should.have.lengthOf(0);
    });

    it("Should not accept empty string values", () => {
      let { errors } = person.validate({
        password: ""
      });
      errors.should.have.lengthOf(1);
      errors[0].should.equal(
        "Property 'password' should be of at least 1 character(s)"
      );
    });

    it("Should support the minLength option", () => {
      let { errors } = person.validate({
        password2: "qwe"
      });
      errors.should.have.lengthOf(1);
      errors[0].should.equal(
        "Property 'password2' should be of at least 10 character(s)"
      );
    });

    it("Should reject non string values", () => {
      let { errors } = person.validate({
        password: 28
      });
      errors.should.have.lengthOf(1);
      errors[0].should.equal(
        "Property 'password' should be a string"
      );
    });
  });
});
