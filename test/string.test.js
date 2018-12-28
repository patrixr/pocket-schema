const chai    = require("chai");
const Schema  = require("..");
const _       = require('lodash');

chai.should();

_.each([
  'string',
  'text'
], (STRING_TYPE) => {

  describe(STRING_TYPE.toUpperCase(), () => {
    describe("Validation", () => {
      const person = new Schema({
        fields: {
          name: {
            type: STRING_TYPE
          },
          shortName: {
            type: STRING_TYPE,
            maxLength: "4"
          },
          longName: {
            type: STRING_TYPE,
            minLength: "8"
          },
          band: {
            type: STRING_TYPE,
            match: /Que+n/i
          }
        }
      });

      it("Should accept string values", async () => {
        let { errors } = await person.validate({
          name: "freddie"
        });
        errors.should.have.lengthOf(0);
      });

      it("Should accept empty string values", async () => {
        let { errors } = await person.validate({
          name: ""
        });
        errors.should.have.lengthOf(0);
      });

      it("Should reject non string values", async () => {
        let { errors } = await person.validate({
          name: 28
        });
        errors.should.have.lengthOf(1);
        errors[0].should.equal(
          "Property 'name' should be a string"
        );
      });

      it("Should support minLength options", async () => {
        let { errors } = await person.validate({
          longName: "freddie"
        });
        errors.should.have.lengthOf(1);
        errors[0].should.equal(
          "Property 'longName' should have 8 or more characters"
        );

        (
          await person.validate({
            longName: "freddie mercury"
          })
        )
        .errors
        .should.have.lengthOf(0);
      });

      it("Should support maxLength options", async () => {
        let { errors } = await person.validate({
          shortName: "freddie"
        });
        errors.should.have.lengthOf(1);
        errors[0].should.equal(
          "Property 'shortName' should have no more than 4 characters"
        );

        (
          await person.validate({
            shortName: "fred"
          })
        )
        .errors
        .should.have.lengthOf(0);
      });

      it("Should be match-able against a regular expression", async () => {
        let { errors } = await person.validate({
          band: "qwin"
        });
        errors.should.have.lengthOf(1);
        errors[0].should.equal(
          "Property 'band' should match /Que+n/i"
        );

        (
          await person.validate({
            band: "queen"
          })
        )
        .errors
        .should.have.lengthOf(0);
      });
    });
  });
});
