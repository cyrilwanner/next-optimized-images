const { stringifyRequest } = require('loader-utils');
const { stringifySymbol, stringify } = require('svg-sprite-loader/lib/utils');

module.exports = ({ symbol, config, context, loaderContext }) => {
  const { spriteModule, symbolModule } = config;

  const spriteRequest = stringifyRequest({ context }, spriteModule);
  const symbolRequest = stringifyRequest({ context }, symbolModule);

  return `
    var React = require('react');
    var SpriteSymbol = require(${symbolRequest});
    var sprite = require(${spriteRequest});

    var symbol = new SpriteSymbol(${stringifySymbol(symbol)});
    sprite.add(symbol);

    var SvgSpriteIcon = function SvgSpriteIcon(props) {
      return React.createElement(
        'svg',
        Object.assign({
          viewBox: symbol.viewBox
        }, props),
        React.createElement(
          'use',
          {
            xlinkHref: '#' + symbol.id
          }
        )
      );
    };

    SvgSpriteIcon.viewBox = symbol.viewBox;
    SvgSpriteIcon.id = symbol.id;
    SvgSpriteIcon.content = symbol.content;
    SvgSpriteIcon.url = symbol.url;
    SvgSpriteIcon.toString = symbol.toString;

    module.exports = SvgSpriteIcon;
    module.exports.default = SvgSpriteIcon;
  `;
};
