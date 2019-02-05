var assert = require('assert');
var { filterProperties } = require('../data/utils');

describe('filterProperties', function () {
  var o = {
    name: 'obi',
    password: 'chi',
    secret: 'tell them',
    data: {
      type: 'test',
      content: {
        count: 4,
        password: 'tt',
        secret: 'll'
      }
    }
  }
  it('an object should return object without password and secret', function () {
    assert.deepEqual(
      filterProperties(
        o,
        (d) => d.name === 'obi', ['secret', 'password']
      ),
      {
        name: 'obi',
        data: {
          type: 'test',
          content: {
            count: 4
          }
        }
      }
    );
  });

  var list = [Object.assign({}, o), Object.assign({}, o)];
  it('an array should return array with object without password and secret', function () {
    assert.deepEqual(
      filterProperties(
        list,
        (d) => d.name === 'obi', ['secret', 'password']
      ),
      [
        {
          name: 'obi',
          data: {
            type: 'test',
            content: {
              count: 4
            }
          }
        },
        {
          name: 'obi',
          data: {
            type: 'test',
            content: {
              count: 4
            }
          }
        }
      ]
    );
  });

  it('an empty array should return an empty array', function () {
    assert.deepEqual(
      filterProperties(
        [],
        (d) => d.name === 'obi', ['secret', 'password']
      ),
      []
    );
  });

  it('any data should return same data', function () {
    assert.deepEqual(
      filterProperties(
        undefined,
        (d) => d.name === 'obi', ['secret', 'password']
      ),
      undefined
    );
  });
});