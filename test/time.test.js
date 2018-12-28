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

    it("Should accept properly formatted times", async () => {
      for (let appointmentTime of ['23:30', '11:30 PM']) {
        const { errors } = await schema.validate({ appointmentTime });
        errors.should.have.lengthOf(0);
      }
    });

    it("Should not accept badly formatted times", async () => {
      const { errors } = await schema.validate({
        appointmentTime: "25:30"
      });
      errors.should.have.lengthOf(1);
      errors[0].should.equal("Property 'appointmentTime' should be a valid time (HH:mm or hh:mm a)")
    });
  });
});
