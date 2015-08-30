import co from 'co';
import debug from 'debug';

const d = debug('boot-phase');

export default class Booter {
  constructor(options) {
    this.map = new Map();
    for (const k of options) {
      d('phase added %s', k);
      this.map.set(k, []);
    }
  }

  phase(key, generator) {
    if (!this.map.has(key)) {
      d('phase added: %s', key);
      this.set(key, [generator]);
      return this;
    }
    d('generator added to phase[%s]', key);
    this.map.get(key).push(generator);
  }

  start(startGen) {
    const { map } = this;
    return co(function*() {
      for (let [k, generators] of map) {
        d('start phase[%s]', k);
        yield generators;
      }
    }).then(res => {
      if (startGen) {
        return co(function*() {
          yield startGen(res);
        });
      }
      return res;
    });
  }
}
