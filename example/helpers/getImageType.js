export const getImageType = (imgEl, withExtension = false) => {
  if (!imgEl.src) {
    return 'included';
  }

  if (imgEl.src.startsWith('data:')) {
    return `inline${withExtension ? ' ' + imgEl.src.replace('data:image/', '').split(';')[0] : ''}`;
  }

  if (withExtension) {
    const parts = imgEl.src.split('.');
    return `url ${parts[parts.length - 1]}`;
  }

  return 'url';
};
