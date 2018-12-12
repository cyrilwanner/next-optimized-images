module.exports = (content) => { // eslint-disable-line arrow-body-style
  return `${content.toString('utf-8').replace('module.exports', 'var lqip')} module.exports = lqip.preSrc; module.exports = Object.assign(module.exports, lqip);`;
};
