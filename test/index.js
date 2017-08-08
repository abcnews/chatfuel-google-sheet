const assert = require('assert');
const createRow = require('../lib/createRows');

describe('createRows', () => {
  it('should return default response with no data', () => {
    const result = createRow({}, {});
    assert.deepEqual(result, ['No attributes sent']);
  });
  it('should send some rows', () => {
    const result = createRow({}, { key: 'value1', key2: 'value2' });
    assert.deepEqual(result, ['value1', 'value2']);
  });
  it('should send some rows & append the custom from the url', () => {
    const result = createRow({ customvalues: 'a,b,c' }, { key: 'value1', key2: 'value2' });
    assert.deepEqual(result, ['a', 'b', 'c', 'value1', 'value2']);
  });
  it('should prepend a timestamp', () => {
    const result = createRow({ customvalues: 'a,b,c', timestamp: 'true' }, { key: 'value1', key2: 'value2' });
    assert.deepEqual(result.slice(1), ['a', 'b', 'c', 'value1', 'value2']);
    const date = new Date(result[0]);
    assert(String(date) !== 'Invalid Date', 'First column is not a date');
  });
});
