import Schema       from '../schema'

export default Schema.registerType('any', {
  validate() {
    return null;
  }
});