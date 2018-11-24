/* eslint-disable */
import React from 'react';
import SpriteSymbol from '$$symbolRequest$$';
import sprite from '$$spriteRequest$$';

const symbol = new SpriteSymbol($$stringifiedSymbol$$);
sprite.add(symbol);

const SvgSpriteIcon = function SvgSpriteIcon(props) {
  return React.createElement(
    'svg',
    Object.assign({
      viewBox: symbol.viewBox,
    }, props),
    React.createElement(
      'use',
      {
        xlinkHref: '#' + symbol.id,
      }
    )
  );
};

SvgSpriteIcon.viewBox = symbol.viewBox;
SvgSpriteIcon.id = symbol.id;
SvgSpriteIcon.content = symbol.content;
SvgSpriteIcon.url = symbol.url;
SvgSpriteIcon.toString = symbol.toString;

export default SvgSpriteIcon;
