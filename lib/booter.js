import co from 'co';
import debug from 'debug';
import assert from 'assert';

const d = debug('boot-phase');

export default class Booter {
  constructor(options) {
    this.map = new Map();
    if (options) {
      for (const k of options) {
        d('phase added %s', k);
        this.map.set(k, []);
      }
    }
  }

  createContext() {
    return {
      phase: null,
      ctx: {},
    };
  }

  phase(key, generator) {
    if (!generator) {
      // es7 async functions are allowed
      assert(fn && 'GeneratorFunction' == fn.constructor.name, 'app.use() requires a generator function');
    }
    if (!this.map.has(key)) {
      d('phase added: %s', key);
      this.map.set(key, [generator]);
      return this;
    }
    d('generator added to phase[%s]', key);
    this.map.get(key).push(generator);
  }

  start(startGen) {
    const self = this;
    const { map } = this;
    return co(function*() {
      const results = [];
      const ctx = self.createContext();
      for (let [phase, generators] of map) {
        ctx.phase = phase;
        for (let gen of generators) {
          results.push({
            phase: phase,
            result: yield gen.call(ctx),
          });
        }
      }
      if (!startGen) {
        startGen = function* noop() {
          return results; 
        };
      }
      return yield startGen.call(ctx);
    });
  }
}




/*
    return co(function*() {
      for (let [k, generators] of map) {
        d('start phase[%s]', k);
        results.push({
          phase: k,
          results: yield generators,
        });
      }
      return results;
    }).then(res => {
      if (startGen) {
        return co(function*() {
          return yield startGen.bind(self)(res);
        });
      }
      return res;
    })
*/
