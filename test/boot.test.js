import boot from '../lib/index';
import { expect } from 'chai';

describe('boot phase', () => {

  it('constructor phases', done => {
    const test = {
      start: [false, false],
      connection: false,
      middleware: false,
    };

    const b = boot([
      'start',
      'connection',
      'middleware',
    ]);

    b.phase('start', function*() {
      test.start[0] = true;
    });

    b.phase('connection', function*() {
      test.connection = true;
    });

    b.phase('start', function*() {
      test.start[1] = true;
    });

    b.phase('middleware', function*() {
      test.middleware = true;
    });

    b.start().then(() => {
      expect(test).to.be.deep.equal({
        start: [true, true],
        connection: true,
        middleware: true
      });
      done();
    }).catch(done);
  });
});
