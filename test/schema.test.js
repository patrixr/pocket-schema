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
      errors[0].should.equal("Property 'name' is missing");
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
            validate(data, field) {
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

  it("Should support computed fields", async () => {
    const schema = new Schema({
      additionalProperties: true,
      fields: {
        firstname: {
          type: 'string',
          default: 'john'
        },
        lastname: {
          type: 'string'
        },
        fullname: {
          type: 'string',
          computed: true,
          compute(data) {
            return data.firstname + ' ' + data.lastname;
          }
        }
      }
    });

    const { errors, data, computed } = await schema.validate({
      lastname: 'smith',
    });
    errors.should.have.lengthOf(0);
    computed.fullname.should.equal('john smith');
    expect(data).to.not.have.property('fullname');
  });

  it("Should not computed fields if there is an error in non-computed fields", async () => {
    const ran = false;
    const schema = new Schema({
      additionalProperties: true,
      fields: {
        firstname: {
          type: 'string'
        },
        lastname: {
          type: 'string',
          required: true
        },
        fullname: {
          type: 'string',
          computed: true,
          compute(data) {
            ran = true;
            return data.firstname + ' ' + data.lastname;
          }
        }
      }
    });

    const { errors } = await schema.validate({
      firstname: 'smith'
    });
    expect(ran).to.be.false;
    errors.should.have.lengthOf(1);
    errors[0].should.equal("Property \'lastname\' is missing");
  });
});