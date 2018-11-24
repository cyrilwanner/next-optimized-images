# :sunrise: next-optimized-images [![npm version](https://img.shields.io/npm/v/next-optimized-images.svg)](https://www.npmjs.com/package/next-optimized-images) [![license](https://img.shields.io/github/license/cyrilwanner/next-optimized-images.svg)](https://github.com/cyrilwanner/next-optimized-images/blob/master/LICENSE) [![dependencies](https://david-dm.org/cyrilwanner/next-optimized-images/status.svg)](https://david-dm.org/cyrilwanner/next-optimized-images)

**This is the readme for version 1 of next-optimized-images. For the current version, please checkout the [master branch](https://github.com/cyrilwanner/next-optimized-images).**

Automatically optimize images used in [next.js](https://github.com/zeit/next.js) projects (`jpeg`, `png`, `svg`, `webp` and `gif`).

Image sizes can often get reduced between 20-60%, but this is not the only thing `next-optimized-images` does:

* Reduces image size by optimizing images during build
* Improves loading speed by providing progressive images (for formats that support it)
* Inlines small images to save HTTP requests and additional roundtrips
* Adds a content hash to the file name so images can get cached on CDN level and in the browser for a long time
* Same image urls over multiple builds for long time caching
* `jpeg`, `png`, `svg`, `webp` and `gif` images are supported and enabled by default but can be particularly disabled
* Provides [options](#query-params) to force inlining a single file or include the raw optimized image directly in your html (e.g. for svgs)
* Converts jpeg/png images to [`webp` if wanted](#webp) for an even smaller size
* Provides the possibility to use [`svg sprites` if wanted](#sprite) for a better performance when using the same icons multiple times (e.g. in a list)

## Table of contents

- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [Example](#example)
- [See also](#see-also)
- [License](#license)

## Installation

```
npm install --save next-optimized-images@1
```

Enable the plugin in your Next.js configuration file:

```javascript
// next.config.js
const withPlugins = require('next-compose-plugins');
const optimizedImages = require('next-optimized-images');

module.exports = withPlugins([
  [optimizedImages, {
    /* config for next-optimized-images */
  }],

  // your other plugins here

]);
```

See the [configuration](#configuration) section for all available options.

This example uses [next-compose-plugins](https://github.com/cyrilwanner/next-compose-plugins) for a cleaner API when using many plugins, see its readme for a more detailed example. `next-optimized-images` also works with the standard plugin api:

```javascript
// next.config.js
const withOptimizedImages = require('next-optimized-images');

module.exports = withOptimizedImages({
  /* config for next-optimized-images */

  // your config for other plugins or the general next.js here..
});
```

## Usage

You can now import or require your images directly in your react components:

```javascript
import React from 'react';

export default () => (
  <div>
    <img src={require('./images/my-image.jpg')} />
    <img src={require('./images/my-small-image.png')} />
    <img src={require('./images/my-icon.svg')} />
  </div>
);

/**
 * Results in:
 *
 * <div>
 *   <img src="/_next/static/images/my-image-5216de428a8e8bd01a4aa3673d2d1391.jpg" />
 *   <img src="data:image/png;base64,..." />
 *   <img src="/_next/static/images/my-icon-572812a2b04ed76f93f05bf57563c35d.svg" />
 * </div>
 */
```

Please be aware that images only get optimized [in production by default](#optimizeimagesindev) to reduce the build time in your development environment.

If you are using css modules, this package also detects images and optimized them in `url()` values in your css/sass/less files:

```scss
.Header {
  background-image: url('./images/my-image.jpg');
}

/**
 * Results in:
 *
 * .Header {
 *   background-image: url('/_next/static/images/my-image-5216de428a8e8bd01a4aa3673d2d1391.jpg');
 * }
 */
```

If the file is below the [limit for inlining images](#inlineimagelimit), the `require(...)` will return a base64 data-uri (`data:image/jpeg;base64,...`).

Otherwise, `next-optimized-images` will copy your image into the static folder of next.js and the `require(...)` returns the path to your image in this case (`/_next/static/images/my-image-5216de428a8e8bd01a4aa3673d2d1391.jpg`).

You can use both variants directly on an image in the `src` attribute or in your css file inside an `url()` value.

### Query params

> *If you are using flow or eslint-plugin-import and are experiencing some issues with query params, check out the [solution posted by @eleith](https://github.com/cyrilwanner/next-optimized-images/issues/23).*

There are some cases where you don't want to reference a file or get a base64 data-uri but you actually want to include the raw file directly into your html.
Especially for svgs because you can't style them with css if they are in an `src` attribute on an image.

So there are additional options you can specify as query params when you import the images:

#### ?include

The image will now directly be included in your html without a data-uri or a reference to your file.

As described above, this is useful for svgs so you can style them with css.

```javascript
import React from 'react';

export default () => (
  <div dangerouslySetInnerHTML={{__html: require('./images/my-icon.svg?include')}} />
);

/**
 * Results in:
 *
 * <div>
 *   <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg">
 *     <path d="M8 0C3.589 0 0 3.589 0 8s3.589 ..." style="filled-opacity:1" fill-rule="evenodd">
 *     </path>
 *   </svg>
 * </div>
 */
```

The image will still get optimized, even if it is directly included in your content (but by [default only in production](#optimizeimagesindev)).

#### ?webp

WebP is an even better and smaller image format but it is still not that common yet and developers often only receive jpeg/png images.

If this `?webp` query parameter is specified, `next-optimized-images` automatically converts a jpeg/png image to the new WebP format.

For browsers that don't yet support WebP, you can also provide a fallback using the `<picture>` tag:

```javascript
import React from 'react';

export default () => (
  <picture>
    <source srcSet={require('./images/my-image.jpg?webp')} type="image/webp" />
    <source srcSet={require('./images/my-image.jpg')} type="image/jpeg" />
    <img src={require('./images/my-image.jpg')} />
  </picture>
);

/**
 * Results in:
 * <picture>
 *   <source srcset="/_next/static/images/my-image-d6816ecc28862cf6f725b29b1d6aab5e.jpg.webp" type="image/webp" />
 *   <source srcset="/_next/static/images/my-image-5216de428a8e8bd01a4aa3673d2d1391.jpg" type="image/jpeg" />
 *   <img src="/_next/static/images/my-image-5216de428a8e8bd01a4aa3673d2d1391.jpg" />
 * </picture>
 */
```

#### ?inline

You can specify a [limit for inlining](#inlineimagelimit) images which will include it as a data-uri directly in your content instead of referencing a file if the file size is below that limit.

You usually don't want to specify a too high limit but there may be cases where you still want to inline larger images.

In this case, you don't have to set the global limit to a higher value but you can add an exception for a single image using the `?inline` query options.

```javascript
import React from 'react';

export default () => (
  <img src={require('./images/my-image.jpg?inline')} />
);

/**
 * Results in:
 *
 * <img src="data:image/png;base64,..." />
 *
 * Even if the image size is above the defined limit.
 */
```

The inlining will only get applied to exactly this import, so if you import the image a second time without the `?inline` option, it will then get normally referenced as a file if it is above your limit.

#### ?url

When you have an image smaller than your defined [limit for inlining](#inlineimagelimit), it normally gets inlined automatically.
If you don't want a specific small file to get inlined, you can use the `?url` query param to always get back an image url, regardless of the inline limit.

If you are using this option a lot, it could also make sense to [disable the inlining](#inlineimagelimit) completely and use the [`?inline`](#inline) param for single files.

```javascript
import React from 'react';

export default () => (
  <img src={require('./images/my-image.jpg?url')} />
);

/**
 * Results in:
 *
 * <img src="/_next/static/images/my-image-5216de428a8e8bd01a4aa3673d2d1391.jpg" />
 *
 * Even if the image size is below the defined inlining limit.
 */
```

The inlining will only get disabled for exactly this import, so if you import the image a second time without the `?url` option, it will then get inlined again if it is below your limit.

#### ?sprite

If you need to style or animate your SVGs [?include](#?include) might be the wrong option, because that ends up in a lot of DOM elements, especially when using the SVG in list-items etc.
In that case, you can use `?sprite` which uses [svg-sprite-loader](https://github.com/kisenka/svg-sprite-loader) to render and inject an SVG sprite in the page automatically.

```javascript
import React from 'react';
import MyIcon from './icons/my-icon.svg?sprite';

export default () => (
  <div>
    my page..
    <MyIcon />
  </div>
);
```

All props passed to the imported sprite will get applied to the `<svg>` element, so you can add a class normally with `<MyIcon className="icon-class" />`.

The `svg-sprite-loader` object also gets exposed if you want to build your own component:

```javascript
import React from 'react';
import icon from './icons/icon.svg?sprite';

export default () => (
  <div>
    my page..
    <svg viewBox={icon.viewBox}>
      <use xlinkHref={`#${icon.id}`} />
    </svg>
  </div>
);
```

To also make this work for server-side rendering, you need to add these changes to your `_document.jsx` file (read [here](https://github.com/zeit/next.js#custom-document) if you don't have this file yet):

```javascript
// ./pages/_document.js
import Document, { Head, Main, NextScript } from 'next/document';
import sprite from 'svg-sprite-loader/runtime/sprite.build';

export default class MyDocument extends Document {
  static getInitialProps({ renderPage }) {
    const pageProps = renderPage();
    const spriteContent = sprite.stringify();

    return {
      spriteContent,
      ...pageProps,
    };
  }

  render() {
    return (
      <html>
        <Head>{/* your head if needed */}</Head>
        <body>
          <div dangerouslySetInnerHTML={{ __html: this.props.spriteContent }} />
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
```

#### ?original

The image won't get optimized and used as it is.
It makes sense to use this query param if you know an image already got optimized (e.g. during export) so it doesn't get optimized again a second time.

```javascript
import React from 'react';

export default () => (
  <img src={require('./images/my-image.jpg?original')} />
);
```

## Configuration

This plugin uses [img-loader](https://www.npmjs.com/package/img-loader) under the hood which is based on [mozjpeg](https://github.com/imagemin/imagemin-mozjpeg), [optipng](https://github.com/imagemin/imagemin-optipng), [gifsicle](https://github.com/imagemin/imagemin-gifsicle) and [svgo](https://github.com/imagemin/imagemin-svgo).

The default options for these optimizers should be enough in most cases, but you can overwrite every available option if you want to.

#### inlineImageLimit

Type: `number`<br>
Default: `8192`

Smaller files will get inlined with a data-uri by [url-loader](https://www.npmjs.com/package/url-loader).
This number defines the maximum file size (in bytes) for images to get inlined.
If an image is bigger, it will get copied to the static folder of next.

Images will get optimized in both cases.

To completely disable image inlining, set this value to `-1`. You will then always get back an image url.

#### imagesFolder

Type: `string`<br>
Default: `'images'`

Folder name inside `/static/` in which the images will get copied to during build.

#### imagesPublicPath

Type: `string`<br>
Default: ``` `/_next/static/${imagesFolder}/` ```

The public path that should be used for image urls. This can be used to serve
the optimized image from a cloud storage service like S3.

#### imagesOutputPath

Type: `string`<br>
Default: ``` `static/${imagesFolder}/` ```

The output path that should be used for images. This can be used to have a custom output folder.

#### imagesName

Type: `string`<br>
Default: `'[name]-[hash].[ext]'`

The filename of the optimized images.
Make sure you keep the `[hash]` part so they receive a new filename if the content changes.

#### optimizeImagesInDev

Type: `boolean`<br>
Default: `false`

For faster development builds and HMR, images will not get optimized by default when running in development mode.
In production, images will always get optimized, regardless of this setting.

#### mozjpeg

Type: `object|boolean`<br>
Default: `{}`

[mozjpeg](https://github.com/imagemin/imagemin-mozjpeg) is used for optimizing jpeg images.
You can specify the options for it here.
The default options of `mozjpeg` are used if you omit this option.

If you don't want next-optimized-images to handle jpeg images (because you have another one), you can set this value to `false`.

If you want jpeg images to be handled but _not_ optimized, you can set this value to `null`.

#### optipng

Type: `object|boolean`<br>
Default: `{}`

[optipng](https://github.com/imagemin/imagemin-optipng) is used for optimizing png images by default.
You can specify the options for it here.
The default options of `optipng` are used if you omit this option.

If you don't want next-optimized-images to handle png images (because you have another one), you can set this value to `false`.

If you want png images to be handled but _not_ optimized, you can set this value to `null`.

#### pngquant

Type: `object|boolean`<br>
Default: `false`

[pngquant](https://github.com/imagemin/imagemin-pngquant) is an alternative way for optimizing png images.
If you want to use `pngquant` instead of `optiping`, you have to set the value for `optipng` to `false` and the value for `pngquant` at least to `{}` or to specific options if you want to overwrite the default ones.

If you don't want next-optimized-images to handle png images (because you have another one), you can set this value to `false`.

If you want png images to be handled but _not_ optimized, you can set this value to `null`.

#### gifsicle

Type: `object|boolean`<br>
Default:
```javascript
{
    interlaced: true,
    optimizationLevel: 3,
}
```

[gifsicle](https://github.com/imagemin/imagemin-gifsicle) is used for optimizing gif images.
You can specify the options for it here.
The default options of `gifsicle` are used if you omit this option.

If you don't want next-optimized-images to handle gif images (because you have another one), you can set this value to `false`.

If you want gif images to be handled but _not_ optimized, you can set this value to `null`.

#### svgo

Type: `object|boolean`<br>
Default: `{}`

[svgo](https://github.com/imagemin/imagemin-svgo) is used for optimizing svg images and icons.
You can specify the options for it here.
The default options of `svgo` are used if you omit this option.

If you don't want next-optimized-images to handle svg images and icons (because you have another one), you can set this value to `false`.

If you want svg images and icons to be handled but _not_ optimized, you can set this value to `null`.

#### svgSpriteLoader

Type: `object`<br>
Default:
```javascript
{
    runtimeGenerator: require.resolve(path.resolve('node_modules', 'next-optimized-images', 'svg-runtime-generator.js')),
}
```

When using the [svg sprite option](#sprite), [`svg-sprite-loader`](https://github.com/kisenka/svg-sprite-loader) gets used internally.
You can overwrite the configuration passed to this loader here.

#### webp

Type: `object`<br>
Default: `{}`

[imagemin-webp](https://github.com/imagemin/imagemin-webp) is used for optimizing webp images and converting other formats to webp.
You can specify the options for it here.
The default options of `imagemin-webp` are used if you omit this option.

If you don't want next-optimized-images to handle webp images (because you have another one), you can set this value to `false`.

If you want webp images to be handled but _not_ optimized, you can set this value to `null`.

## Example

The options specified here are the **default** values.

So if they are good enough for your use-case, you don't have to specify them to have a shorter and cleaner `next.config.js` file.

```javascript
// next.config.js
const withPlugins = require('next-compose-plugins');
const optimizedImages = require('next-optimized-images');

module.exports = withPlugins([
    [optimizedImages, {
        // these are the default values so you don't have to provide them if they are good enough for your use-case.
        // but you can overwrite them here with any valid value you want.
        inlineImageLimit: 8192,
        imagesFolder: 'images',
        imagesName: '[name]-[hash].[ext]',
        optimizeImagesInDev: false,
        mozjpeg: {
            quality: 80,
        },
        optipng: {
            optimizationLevel: 3,
        },
        pngquant: false,
        gifsicle: {
            interlaced: true,
            optimizationLevel: 3,
        },
        svgo: {
            // enable/disable svgo plugins here
        },
        webp: {
            preset: 'default',
            quality: 75,
        },
    }],
]);
```

## See also

* [next-images](https://github.com/arefaslani/next-images) if you just want images and not optimize them
* [next-compose-plugins](https://github.com/cyrilwanner/next-compose-plugins) for a cleaner plugins API when you have many plugins in your `next.config.js` file
* [next-plugins](https://github.com/zeit/next-plugins) for a list of official and community made plugins

## License

[MIT](https://github.com/cyrilwanner/next-optimized-images/blob/master/LICENSE) © Cyril Wanner
