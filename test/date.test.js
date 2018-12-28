const chai    = require("chai");
const Schema  = require("..");
const _       = require('lodash');

chai.should();

describe('DATE', () => {
  describe("Validation", () => {
    const person = new Schema({
      fields: {
        birthDate: {
          type: 'date'
        },
        birthDate2: {
          type: 'date',
          format: 'DD/YYYY-MM'
        }
      }
    });

    it("Should accept properly formatted dates", async () => {
      let { errors } = await person.validate({
        birthDate: "1972-10-02"
      });
      errors.should.have.lengthOf(0);
    });

    it("Should not accept badly formatted dates", async () => {
      let { errors } = await person.validate({
        birthDate: "10/1927-13"
      });
      errors.should.have.lengthOf(1);
      errors[0].should.equal(
        "Property 'birthDate' should be a valid date (YYYY-MM-DD)"
      );
    });

    it("Should support the format option to specify the expected date format", async () => {
      let { errors } = await person.validate({
        birthDate2: "10/1927-11"
      });
      errors.should.have.lengthOf(0);
    });
  });
});
