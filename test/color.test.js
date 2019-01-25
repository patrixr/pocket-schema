const chai    = require("chai");
const Schema  = require("..");
const _       = require('lodash');

chai.should();

describe('COLOR', () => {
  describe("Validation", () => {
    const person = new Schema({
      fields: {
        hairColor: {
          type: 'color'
        }
      }
    });

    it("Should accept hex formatted colors", async () => {
      let { errors } = await person.validate({
        hairColor: "#FF0000"
      });
      console.log(errors);
      errors.should.have.lengthOf(0);
    });

    it("Should accept rgb formatted colors", async () => {
      let { errors } = await person.validate({
        hairColor: "rgb(255,0,0)"
      });
      errors.should.have.lengthOf(0);
    });

    it("Should accept rgba formatted colors", async () => {
      let { errors } = await person.validate({
        hairColor: "rgba(255,0,0, 1)"
      });
      errors.should.have.lengthOf(0);
    });

    it("Should accept color names", async () => {
      let { errors } = await person.validate({
        hairColor: "red"
      });
      errors.should.have.lengthOf(0);
    });

    it("Should not accept non colors", async () => {
      let { errors } = await person.validate({
        hairColor: "not a color"
      });
      errors.should.have.lengthOf(1);
      errors[0].should.equal(
        "Property 'hairColor' should be a correctly formatted color"
      );
    });


  });
});
