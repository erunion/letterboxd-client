import caseless from 'caseless';
import chai from 'chai';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Chai {
    interface Assertion {
      /**
       * Assert that a `Headers` object contains a given header matching a specific value.
       */
      header: (header: string, expected: string | RegExp) => void;
    }
  }
}

export default function chaiPlugins(_chai, utils) {
  /**
   *
   * Determine if a `Headers` object contains a given header matching a specific value.
   *
   * @example <caption>should match a value</caption>
   * expect(request.headers).to.have.header('connection', 'close');
   *
   * @example <caption>should match a regex</caption>
   * expect(response.headers).to.have.header('content-type', /application\/json(;\s?charset=utf-8)?/);
   *
   * @example <caption>should match one of many values</caption>
   * expect(request.headers).to.have.header('connection', ['close', 'keep-alive']);
   *
   * @param {array} headers
   * @param {string} header
   * @param {string|RegExp} expected
   */
  utils.addMethod(chai.Assertion.prototype, 'header', function (header, expected) {
    const obj = utils.flag(this, 'object');
    const headers = caseless(obj);

    if (expected.constructor.name === 'RegExp') {
      new chai.Assertion(headers.get(header)).to.match(expected);
    } else if (Array.isArray(expected)) {
      new chai.Assertion(headers.get(header)).to.oneOf(expected.map(e => e.toString()));
    } else {
      new chai.Assertion(headers.get(header)).to.equal(expected.toString());
    }
  });
}
