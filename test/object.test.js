const chai    = require("chai");
const Schema  = require("..");
const _       = require('lodash');

chai.should();

describe("OBJECT", () => {
  describe("Validation", () => {
    const person = new Schema({
      fields: {
        userData: {
          type: 'object'
        },
        userData2: {
          type: 'object',
          schema: new Schema({
            fields: {
              dogName: {
                type: 'string'
              }
            }
          })
        },
        userData3: {
          type: 'object',
          schema: new Schema({
            fields: {
              dog: {
                type: 'object',
                schema: new Schema({
                  fields: {
                    name: 'string'
                  }
                })
              }
            }
          })
        }
      }
    });

    it("Should not accept non-objects", async () => {
      let { errors } = await person.validate({
        userData: [ 'data' ]
      });
      errors.should.have.lengthOf(1);
      errors[0].should.equal(
        "Property 'userData' should be an object"
      );
    });

    it("Should accept objects", async () => {
      let { errors } = await person.validate({
        userData: {
          dogName: 'roger'
        }
      });
      errors.should.have.lengthOf(0);
    });

    it("Should support defining the object's schema via the 'schema' property" , async () => {
      let { errors } = await person.validate({
        userData2: {
          dogName: 123
        }
      });
      errors.should.have.lengthOf(1);
      errors[0].should.equal(
        "Property 'userData2.dogName' should be a string"
      );

      (
        await person.validate({
          userData2: {
            dogName: 'roger'
          }
        })
      )
      .errors
      .should.have.lengthOf(0);
    });

    it("Should support multiple nested objects with schemas" , async () => {
      let { errors } = await person.validate({
        userData3: {
          dog: {
            name: 123
          }
        }
      });
      errors.should.have.lengthOf(1);
      errors[0].should.equal(
        "Property 'userData3.dog.name' should be a string"
      );

      (
        await person.validate({
          userData2: {
            dog: {
              name: 'roger'
            }
          }
        })
      )
      .errors
      .should.have.lengthOf(0);
    });
  });
});
