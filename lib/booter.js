import co from 'co';
import debug from 'debug';

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

  phase(key, generator) {
    if (!this.map.has(key)) {
      d('phase added: %s', key);
      this.map.set(key, [generator]);
      return this;
    }
    d('generator added to phase[%s]', key);
    this.map.get(key).push(generator);
  }

  start(startGen) {
    const { 
      map
    } = this;
    let results = [];
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
          return yield startGen(res);
        });
      }
      return res;
    })
  }
}
