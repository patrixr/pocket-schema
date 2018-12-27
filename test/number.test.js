const chai    = require("chai");
const Schema  = require("..");
const _       = require('lodash');

chai.should();

describe("NUMBER", () => {
  describe("Validation", () => {
    const person = new Schema({
      fields: {
        age: {
          type: 'number',
          min: 0
        },
        pinCode: {
          type: 'number',
          max: 9999,
          min: 0
        }
      }
    });

    it("Should accept number values", () => {
      let { errors } = person.validate({
        age: 28
      });
      errors.should.have.lengthOf(0);
    });

    it("Should reject non numeric values", () => {
      let { errors } = person.validate({
        age: '28'
      });
      errors.should.have.lengthOf(1);
      errors[0].should.equal(
        "Property 'age' should be a number"
      );
    });

    it("Should support 'min' option", () => {
      let { errors } = person.validate({
        age: -30
      });
      errors.should.have.lengthOf(1);
      errors[0].should.equal(
        "Property 'age' should be equal or greater than 0"
      );

      person
        .validate({
          longName: "freddie mercury"
        })
        .errors.should.have.lengthOf(0);
    });

    it("Should support the 'max' option", () => {
      let { errors } = person.validate({
        pinCode: 10890
      });
      errors.should.have.lengthOf(1);
      errors[0].should.equal(
        "Property 'pinCode' should equal or lower than 9999"
      );

      person
        .validate({
          pinCode: 986
        })
        .errors.should.have.lengthOf(0);
    });
  });
});
