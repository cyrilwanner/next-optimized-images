# 🌅 next-optimized-images [![npm version](https://img.shields.io/npm/v/next-optimized-images.svg)](https://www.npmjs.com/package/next-optimized-images) [![license](https://img.shields.io/github/license/cyrilwanner/next-optimized-images.svg)](https://github.com/cyrilwanner/next-optimized-images/blob/master/LICENSE)

Automatically optimize images used in [next.js](https://github.com/zeit/next.js) projects (`jpeg`, `png`, `svg` and `gif`).

Image sizes can often get reduced between 20-60%, but this is not the only thing `next-optimized-images` does:

* Reduces image size by optimizing images during build
* Improves loading speed by providing progressive images (for formats that support it)
* Inlines small images to save HTTP requests and additional roundtrips
* Adds a content hash to the file name so images can get cached on CDN level and in the browser for a long time
* Same image urls over multiple builds for long time caching
* `jpeg`, `png`, `svg` and `gif` images are supported and enabled by default but can be particularly disabled
* Provides [options](#query-params) to force inlining a single file or include the raw optimized image directly in your html (e.g. for svgs)

## Table of contents

- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [Example](#example)
- [See also](#see-also)
- [License](#license)

## Installation

```
npm install --save next-optimized-images
```

Enable the plugin in your Next.js configuration file:

```javascript
// next.config.js
const withPlugins = require('next-plugins');
const optimizedImages = require('next-optimized-images');

module.exports = withPlugins([
    [optimizedImages, {
        /* config for next-optimized-images */
    }],

    // your other plugins here

]);
```

See the [configuration](#configuration) section for all available options.

This example uses [next-plugins](https://github.com/cyrilwanner/next-plugins) for a cleaner API when using many plugins, see its readme for a more detailed example. `next-optimized-images` also works with the standard plugin api:

```javascript
// next.config.js
const withOptimizedImages = require('next-optimized-images');

module.exports = withOptimizedImages({
    /* config for next-optimized-images */

    // your config for other plugins or the general next.js here..
});
```

## Usage

You can now import or require your images directly in your react component:

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

If the file is below the [limit for inlining images](#inlineimagelimit), the `require(...)` will return a data uri (`data:image/jpeg;base64,...`).

If it is above the limit, `next-optimized-images` will copy your image into the static folder of next and the `require(...)` returns the path to your image in this case (`/_next/static/images/my-image-5216de428a8e8bd01a4aa3673d2d1391.jpg`).

You can use both variants directly on an image in the `src` attribute or in your css file inside an `url()` value.

### Query params

There are cases where you don't want to reference a file but you actually want to include the file directly into your html.
Specially for svgs because you can't style them with css if they are in a `src` attribute on an image.

So there are additional options you can specify as query params when you import the images:

#### ?include

The image will now directly be included in your html without a data uri or a reference to your file.

This is most useful for svgs as described above so you can style them with css.

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

#### ?inline

You can specify a [limit for inlining](#inlineimagelimit) images which will include it as a data uri directly in your content instead of referencing a file if the file size is below that limit.

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

The inlining will only get applied to exactly this import, if you import the image a second time without the `?inline` options, it will then get referenced as a file normally if it is above your limit.

## Configuration

This plugin uses [img-loader](https://www.npmjs.com/package/img-loader) under the hood which is based on [mozjpeg](https://github.com/imagemin/imagemin-mozjpeg), [optipng](https://github.com/imagemin/imagemin-optipng), [gifsicle](https://github.com/imagemin/imagemin-gifsicle) and [svgo](https://github.com/imagemin/imagemin-svgo).

The default options for these optimizers should be enough in most cases, but you can overwrite every available option if you want to.

#### inlineImageLimit

Type: `number`<br>
Default: `8192`

Smaller files will get inlined with a data uri by [url-loader](https://www.npmjs.com/package/url-loader).
This number defines the maximum file size for images to get inlined.
If an image is bigger, it will get copied to the static folder of next.

Images will get optimized in both cases.

#### imagesFolder

Type: `string`<br>
Default: `'images'`

Folder name inside `/static/` in which the images will get copied to during build.

#### imagesName

Type: `string`<br>
Default: `'[name]-[hash].[ext]'`

Filename of the optimized images.
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


## Example

The options specified here are the **default** values.

So if the are good enough for your use-case, you don't have to specify them to have a shorter and cleaner `next.config.js` file.

```javascript
// next.config.js
const withPlugins = require('next-plugins');
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
    }],
]);
```

## See also

* [next-images](https://github.com/arefaslani/next-images) if you just want images and not optimize them
* [next-plugins](https://github.com/cyrilwanner/next-plugins) for a cleaner plugins API when you have many plugins in your `next.config.js` file

## License

[MIT](https://github.com/cyrilwanner/next-optimized-images/blob/master/LICENSE) © Cyril Wanner
