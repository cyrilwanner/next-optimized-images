/* eslint-disable */
var React = require('react');
var SpriteSymbol = require('$$symbolRequest$$');
var sprite = require('$$spriteRequest$$');

var symbol = new SpriteSymbol($$stringifiedSymbol$$);
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
