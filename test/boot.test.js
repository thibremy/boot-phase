import boot from '../lib/index';
import { expect } from 'chai';

describe('boot phase', () => {

  it('default phases', done => {
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
      expect(test).to.be.deep.equal({
        start: [true, false],
        connection: false,
        middleware: false
      });
    });

    b.phase('connection', function*() {
      test.connection = true;
      expect(test).to.be.deep.equal({
        start: [true, true],
        connection: true,
        middleware: false
      });
    });

    b.phase('start', function*() {
      test.start[1] = true;
      expect(test).to.be.deep.equal({
        start: [true, true],
        connection: false,
        middleware: false
      });
    });

    b.phase('middleware', function*() {
      test.middleware = true;
      expect(test).to.be.deep.equal({
        start: [true, true],
        connection: true,
        middleware: true
      });
    });

    b.start().then((res) => {
      expect(res).to.be.an('array');
      res.forEach(r => {
        expect(r).to.have.all.keys([
          'phase',
          'results',
        ]);
      });
      expect(test).to.be.deep.equal({
        start: [true, true],
        connection: true,
        middleware: true
      });
      done();
    }).catch(done);
  });

  it('phases with start generator', done => {
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

    b.start(function*() {
      return {
        address: '127.0.0.1',
        port: 3000,
      }
    }).then(server => {
      expect(server).to.be.deep.equal({
        address: '127.0.0.1',
        port: 3000,
      });
      expect(test).to.be.deep.equal({
        start: [true, true],
        connection: true,
        middleware: true
      });
      done();
    }).catch(done);
  });
});
