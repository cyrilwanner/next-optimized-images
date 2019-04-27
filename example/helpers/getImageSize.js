export const getImageSize = (imgEl, precision = 1) => {
  const p = Math.pow(10, precision);

  if (!imgEl.src && imgEl.innerHTML) {
    return Promise.resolve(Math.round(imgEl.innerHTML.length / 1024 * p) / p);
  }

  if (imgEl.src.startsWith('data:')) {
    return Promise.resolve(Math.round(imgEl.src.length / 1024 * p) / p);
  }

  if (performance.getEntriesByName(imgEl.src)[0]) {
    return Promise.resolve(Math.round(performance.getEntriesByName(imgEl.src)[0].transferSize / 1024 * p) / p);
  }

  return new Promise((resolve) => {
    const interval = setInterval(() => {
      if (performance.getEntriesByName(imgEl.src)[0]) {
        clearInterval(interval);
        resolve(Math.round(performance.getEntriesByName(imgEl.src)[0].transferSize / 1024 * p) / p);
      }
    }, 500);
  });
};
