const chai    = require("chai");
const Schema  = require("..");
const _       = require('lodash');

chai.should();

_.each(['checkbox', 'boolean'], (BOOL_TYPE) => {
  describe(BOOL_TYPE.toUpperCase(), () => {
    describe("Validation", () => {
      const person = new Schema({
        fields: {
          isTall: {
            type: BOOL_TYPE
          }
        }
      });

      it("Should accept the true value", async () => {
        let { errors } = await person.validate({
          isTall: true
        });
        errors.should.have.lengthOf(0);
      });

      it("Should accept the false value", async () => {
        let { errors } = await person.validate({
          isTall: false
        });
        errors.should.have.lengthOf(0);
      });

      it("Should not accept strings", async () => {
        let { errors } = await person.validate({
          isTall: "false"
        });
        errors.should.have.lengthOf(1);
        errors[0].should.equal(
          "Property 'isTall' should be a true|false value"
        );
      });
    });
  });
});