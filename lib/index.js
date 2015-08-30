import Booter from './booter';

export default function(phases) {
  const boot = new Booter(phases);
  return boot;
}
