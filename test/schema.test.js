const _       = require("lodash");
const chai    = require("chai");
const Schema  = require("..");

const { expect } = chai;
chai.should();

describe("Schema", () => {

  describe("Options", () => {

    it("Should support 'additionalProperties: false' to prevent extra fields on the records", async () => {
      const schema = new Schema({
        additionalProperties: false,
        fields: {
          name: 'string'
        }
      });

      const { errors } = await schema.validate({
        name: 'jimmy',
        age: 45
      });
      errors.should.have.lengthOf(1);
      errors[0].should.equal("Property 'age' is not allowed");

      (
        await schema.validate({
          name: 'jimmy'
        })
      ).errors.should.have.lengthOf(0);
    });

    it("Should support 'additionalProperties: true' to allow extra fields on the records", async () => {
      const schema = new Schema({
        additionalProperties: true,
        fields: {
          name: 'string'
        }
      });

      const { errors } = await schema.validate({
        name: 'jimmy',
        age: 45
      });
      errors.should.have.lengthOf(0);
    });

    it("Should raise an error if a field marked as required is missing", async () => {
      const schema = new Schema({
        additionalProperties: true,
        fields: {
          name: {
            type: 'string',
            required: true
          }
        }
      });

      const { errors } = await schema.validate({
        age: 45
      });
      errors.should.have.lengthOf(1);
      errors[0].should.equal("Property 'name' is missing'");
    });

    it("Should use the specified default value if a field is missing ", async () => {
      const schema = new Schema({
        additionalProperties: true,
        fields: {
          name: {
            type: 'string',
            default: 'oscar'
          }
        }
      });

      const { data, errors } = await schema.validate({
        age: 45
      });
      errors.should.have.lengthOf(0);
      data.name.should.equal("oscar");
    });

    it("Should use the specified default value if a field is null ", async () => {
      const schema = new Schema({
        additionalProperties: true,
        fields: {
          name: {
            type: 'string',
            default: 'oscar'
          }
        }
      });

      const { data, errors } = await schema.validate({
        age: 45,
        name: null
      });
      errors.should.have.lengthOf(0);
      data.name.should.equal("oscar");
    });

    it("Should use the specified default value even if fields is marked as required ", async () => {
      const schema = new Schema({
        additionalProperties: true,
        fields: {
          name: {
            type: 'string',
            default: 'oscar',
            required: true
          }
        }
      });

      const { data, errors } = await schema.validate({
        age: 45,
        name: null
      });
      errors.should.have.lengthOf(0);
      data.name.should.equal("oscar");
    });

    it("Should support custom validators on fields", async () => {
      const schema = new Schema({
        additionalProperties: true,
        fields: {
          name: {
            type: 'any',
            validator(data, field) {
              return data === "foo" ? null : "it isn't foo";
            }
          }
        }
      });

      const { errors } = await schema.validate({
        name: 'jimmy',
      });
      errors.should.have.lengthOf(1);
      errors[0].should.equal("it isn't foo");

      (
        await schema.validate({
          name: 'foo',
        })
      ).errors.should.have.lengthOf(0);
    });
  });
});