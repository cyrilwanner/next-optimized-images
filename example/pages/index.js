import React from 'react';

export default () => (
  <div className="container">
    <div className="row">
      <h2>Including an image</h2>

      <h4>Big images get normally referenced in the <code>src</code> attribute</h4>
      {/* Include an image with the normal require function, import does also work */}
      <img src={require('./images/ben-den-engelsen-unsplash.jpg')} alt="Unnamed Road, Cline River, Canada" />

      <h4>Smaller images get automatically inlined for better performance (can be <a href="https://github.com/cyrilwanner/next-optimized-images#inlineimagelimit" target="_blank">disabled</a>)</h4>
      {/* This is a small image, so it will automatically get inlined */}
      <img src={require('./images/stage-7-photography-unsplash.jpg')} alt="Elephants" />
    </div>

    <div className="row">
      <h2>Resource query params</h2>

      <h4>Disable optimization for a single image</h4>
      {/* Do not optimize this image and use the original one */}
      <img src={require('./images/spencer-davis-unsplash.jpg?original')} alt="Dubrovnik, Croatia" />

      <h4>Convert an image to WebP</h4>
      {/* Convert this image to WebP */}
      <img src={require('./images/victor-rodriguez-unsplash.jpg?webp')} alt="NEW YORK, Astoria, United States" />

      <p>To also support browsers without WebP, you can use a <a href="https://github.com/cyrilwanner/next-optimized-images#webp" target="_blank">fallback</a> in the <code>picture</code> tag.</p>

      <h4>More query params</h4>
      <p>Check the documentation for a <a href="https://github.com/cyrilwanner/next-optimized-images#query-params" target="_blank">full list of all available query params</a>.</p>
    </div>

    <style jsx>{`
      .container {
        font-family: system-ui, BlinkMacSystemFont, -apple-system, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
      }

      a,
      a:visited {
        color: #07f;
      }

      .row {
        max-width: 880px;
        margin: 80px auto 40px;
      }

      img {
        max-width: 100%;
      }
    `}</style>
  </div>
);
