# 🌅 next-optimized-images [![npm version](https://img.shields.io/npm/v/next-optimized-images.svg)](https://www.npmjs.com/package/next-optimized-images) [![license](https://img.shields.io/github/license/cyrilwanner/next-optimized-images.svg)](https://github.com/cyrilwanner/next-optimized-images/blob/master/LICENSE)

Automatically optimize images used in [next.js](https://github.com/zeit/next.js) projects.

Image sizes can often get reduced between 20-60%, but this is not the only thing `next-optimized-images` does:

* Reduces image size by optimizing images during build
* Improves loading speed by providing progressive images (for formats that support it)
* Adds a content hash to the file name so images can get cached on cdn level and in the browser for a long time
* Same image urls over multiple builds for long time caching
* `Jpeg`, `png`, `gif` and `svg` images are supported and enabled by default but can be particularly disabled

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

## Usage
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

This example uses [next-plugins](https://github.com/cyrilwanner/next-plugins) for a cleaner API when using many plugins, see its readme for a more detailed example. `next-optimized-images` also works with the standard plugin api:

```javascript
// next.config.js
const withOptimizedImages = require('next-optimized-images');

module.exports = withOptimizedImages({
    /* config for next-optimized-images */

    // your config for other plugins or the general next.js here..
});
```

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

```javascript
// next.config.js
// todo
```

## See also

* [next-images](https://github.com/arefaslani/next-images) if you just want images and not optimize them
* [next-plugins](https://github.com/cyrilwanner/next-plugins) for a cleaner plugins API when you have many plugins in your `next.config.js` file

## License

[MIT](https://github.com/cyrilwanner/next-optimized-images/blob/master/LICENSE) © Cyril Wanner
