import boot from '../lib/index';
import {
  expect
}
from 'chai';

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
          'result',
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

  it('phases without pre-phase', done => {
    const test = {
      start: [false, false],
      connection: false,
      middleware: false,
    };

    const b = boot();

    b.phase('start', function*() {
      test.start[0] = true;
    });

    b.phase('connection', function*() {
      test.connection = true;
    });

    b.phase('middleware', function*() {
      test.middleware = true;
    });

    b.phase('start', function*() {
      test.start[1] = true;
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

  it('phases with context', done => {
    const b = boot();

    b.phase('start', function*() {
      expect(this.phase).to.be.equal('start');
      this.ctx.start = 'hello ';
    });

    b.phase('connection', function*() {
      expect(this.phase).to.be.equal('connection');
      this.ctx.start += 'small  ';
    });

    b.phase('middleware', function*() {
      expect(this.phase).to.be.equal('middleware');
      this.ctx.start += 'world !';
    });

    b.phase('start', function*() {
      expect(this.phase).to.be.equal('start');
      this.ctx.start += 'my ';
    });

    b.start(function*() {
      expect(this.ctx.start).to.be.equal('hello my small  world !');
    }).then(() => {
      done();
    }).catch(done);
  });

  it('throw when not valid generator', done => {
    try {
      const b = boot();
      b.phase('start', 'toto');
    } catch (err) {
      done();
    }
    done();
  });
});
