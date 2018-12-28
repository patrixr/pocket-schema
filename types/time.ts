import Schema       from '../schema'
import { Field }    from '../definitions'

export default Schema.registerType('time', {
  validate(time, field : Field) {
    const rexp12 = /((1[0-2]|0?[1-9]):([0-5][0-9]) ?([AaPp][Mm]))/;
    const rexp24 = /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!rexp12.test(time) && !rexp24.test(time)) {
      return `Property '${field.path}' should be a valid time (HH:mm or hh:mm a)`;
    }
    return null;
  }
});