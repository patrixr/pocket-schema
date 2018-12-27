const chai    = require("chai");
const Schema  = require("..");
const _       = require('lodash');

chai.should();

describe('TIME', () => {
  describe("Validation", () => {
    const schema = new Schema({
      fields: {
        appointmentTime: {
          type: 'time'
        }
      }
    });

    it("Should accept properly formatted times", () => {
      schema.validate({
        appointmentTime: "23:30"
      }).errors.should.have.lengthOf(0);

      schema.validate({
        appointmentTime: "11:30 PM"
      }).errors.should.have.lengthOf(0);
    });

    it("Should not accept badly formatted times", () => {
      const { errors } = schema.validate({
        appointmentTime: "25:30"
      });
      errors.should.have.lengthOf(1);
      errors[0].should.equal("Property 'appointmentTime' should be a valid time (HH:mm or hh:mm a)")
    });
  });
});
