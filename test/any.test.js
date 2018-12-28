const chai    = require("chai");
const Schema  = require("..");
const _       = require('lodash');

chai.should();

describe('ANY', () => {
  describe("Validation", () => {
    const person = new Schema({
      fields: {
        mood: {
          type: 'any'
        }
      }
    });

    it("Should accept any type of data", async () => {
      const samples = [
        'happy',
        { very: 'happy' },
        [ 'happy' ],
        23,
        null
      ];

      for (var data of samples) {
        let { errors } = await person.validate({
          mood: data
        });
        errors.should.have.lengthOf(0);
      }
    });
  });
});
