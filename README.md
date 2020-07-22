# :sunrise: next-optimized-images [![npm version](https://badgen.net/npm/v/next-optimized-images)](https://www.npmjs.com/package/next-optimized-images) [![license](https://badgen.net/github/license/cyrilwanner/next-optimized-images)](https://github.com/cyrilwanner/next-optimized-images/blob/master/LICENSE) [![downloads](https://badgen.net/npm/dt/next-optimized-images)](https://www.npmjs.com/package/next-optimized-images)

**:bulb: Version 3 is coming!**
It introduces a complete rewrite with many new features and bugfixes. If you want to help developing and testing the upcoming major version, please check out the [canary branch](https://github.com/cyrilwanner/next-optimized-images/tree/canary) for installation instructions and more information about the new features. ([RFC issue](https://github.com/cyrilwanner/next-optimized-images/issues/120))

---

Automatically optimize images used in [next.js](https://github.com/zeit/next.js) projects (`jpeg`, `png`, `svg`, `webp` and `gif`).

Image sizes can often get reduced between 20-60%, but this is not the only thing `next-optimized-images` does:

* **Reduces image size** by optimizing images during build
* Improves loading speed by providing **progressive images** (for formats that support it)
* **Inlines small images** to save HTTP requests and additional roundtrips
* Adds a content hash to the file name so images can get cached on CDN level and in the browser for a long time
* Same image URLs over multiple builds for long time caching
* Provides **[query params](#query-params)** for file-specific handling/settings
* jpeg/png images can be **converted to [`webp` on the fly](#webp)** for an even smaller size
* Provides the possibility to use **[`SVG sprites`](#sprite)** for a better performance when using the same icons multiple times (e.g. in a list)
* Can **[resize](#resize)** images or generate different **placeholders while lazy loading** images: [low quality images](#lqip), [dominant colors](#lqip-colors) or [image outlines](#trace)

## Table of contents

- [Installation](#installation)
- [Optimization Packages](#optimization-packages)
- [Usage](#usage)
  - [Query Params](#query-params)
- [Configuration](#configuration)
- [Example](#example)
- [See also](#see-also)
- [License](#license)

## Installation

```
npm install next-optimized-images
```

*Node >= 8 is required for version 2. If you need to support older node versions, you can still use [version 1](https://github.com/cyrilwanner/next-optimized-images/tree/v1#readme) of next-optimized-images.*

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

:warning: **From version 2 on, images won't get optimized out of the box anymore. You have to install the optimization packages you really need in addition to this plugin.**
This doesn't force you to download big optimization libraries you don't even use.
Please check out the table of all [optional optimization packages](#optimization-packages).

The example above uses [next-compose-plugins](https://github.com/cyrilwanner/next-compose-plugins) for a cleaner API when using many plugins, see its readme for a more detailed example. `next-optimized-images` also works with the standard plugin api:

```javascript
// next.config.js
const withOptimizedImages = require('next-optimized-images');

module.exports = withOptimizedImages({
  /* config for next-optimized-images */

  // your config for other plugins or the general next.js here...
});
```

## Optimization Packages

Starting from version 2, you have to install the optimization packages you need in your project in addition to this plugin. `next-optimized-images` then detects all the supported packages and uses them.

**So you only have to install these packages with npm, there is no additional step needed after that.**

The following optimization packages are available and supported:

| Optimization Package | Description | Project Link |
| -------------------- | ----------- | ------------ |
| `imagemin-mozjpeg`   | Optimizes JPEG images. | [Link](https://www.npmjs.com/package/imagemin-mozjpeg)
| `imagemin-optipng`   | Optimizes PNG images. | [Link](https://www.npmjs.com/package/imagemin-optipng)
| `imagemin-pngquant`  | Alternative for optimizing PNG images. | [Link](https://www.npmjs.com/package/imagemin-pngquant)
| `imagemin-gifsicle`  | Optimizes GIF images. | [Link](https://www.npmjs.com/package/imagemin-gifsicle)
| `imagemin-svgo`      | Optimizes SVG images and icons. | [Link](https://www.npmjs.com/package/imagemin-svgo)
| `svg-sprite-loader`  | Adds the possibility to use svg sprites for a better performance. Read the [sprite](#sprite) section for more information. | [Link](https://www.npmjs.com/package/svg-sprite-loader)
| `webp-loader`        | Optimizes WebP images and can convert JPEG/PNG images to WebP on the fly ([webp resource query](#webp)). | [Link](https://www.npmjs.com/package/webp-loader)
| `lqip-loader`        | Generates low quality image placeholders and can extract the dominant colors of an image ([lqip resource query](#lqip)) | [Link](https://www.npmjs.com/package/lqip-loader)
| `responsive-loader`  | Can resize images on the fly and create multiple versions of it for a `srcset`.<br>**Important**: You need to additionally install either `jimp` (node implementation, slower) or `sharp` (binary, faster) | [Link](https://www.npmjs.com/package/responsive-loader)
| `image-trace-loader` | Generates SVG image [outlines](https://twitter.com/mikaelainalem/status/918213244954861569) which can be used as a placeholder while loading the original image ([trace resource query](#trace)). | [Link](https://www.npmjs.com/package/image-trace-loader)

> Example: If you have JPG, PNG, and SVG images in your project, you would then need to run
> ```bash
> npm install imagemin-mozjpeg imagemin-optipng imagemin-svgo
> ```

To install *all* optional packages, run:
```bash
npm install imagemin-mozjpeg imagemin-optipng imagemin-gifsicle imagemin-svgo svg-sprite-loader webp-loader lqip-loader responsive-loader jimp image-trace-loader
```

:warning: Please note that by default, images are only optimized for **production builds, not development builds**. However, this can get changed with the [`optimizeImagesInDev` config](#optimizeimagesindev).

:bulb: Depending on your build/deployment setup, it is also possibile to install these as devDependencies. Just make sure that the packages are available when you build your project.

:information_source: Since version 2.5, `ico` files are also optionally supported but need to be enabled in the [`handleImages` config](#handleimages).

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

If you are using CSS modules, this package also detects images and optimized them in `url()` values in your css/sass/less files:

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

You can use both variants directly on an image in the `src` attribute or in your CSS file inside an `url()` value.

### Query params

> *If you are using flow or eslint-plugin-import and are experiencing some issues with query params, check out the [solution posted by @eleith](https://github.com/cyrilwanner/next-optimized-images/issues/23).*

There are some cases where you don't want to reference a file or get a base64 data-uri but you actually want to include the raw file directly into your HTML.
Especially for SVGs because you can't style them with CSS if they are in an `src` attribute on an image.

So there are additional options you can specify as query params when you import the images.

* [`?include`](#include): Include the raw file directly (useful for SVG icons)
* [`?webp`](#webp): Convert a JPEG/PNG image to WebP on the fly
* [`?inline`](#inline): Force inlining an image (data-uri)
* [`?url`](#url): Force an URL for a small image (instead of data-uri)
* [`?original`](#original): Use the original image and do not optimize it
* [`?lqip`](#lqip): Generate a low quality image placeholder
* [`?lqip-colors`](#lqip-colors): Extract the dominant colors of an image
* [`?trace`](#trace): Use traced outlines as loading placeholder
* [`?resize`](#resize): Resize an image
* [`?sprite`](#sprite): Use SVG sprites

#### ?include

The image will now directly be included in your HTML without a data-uri or a reference to your file.

As described above, this is useful for SVGs so you can style them with CSS.

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

> Requires the optional optimization package `webp-loader` (`npm install webp-loader`)

WebP is an even better and smaller image format but it is still not that common yet and developers often only receive jpeg/png images.

If this `?webp` query parameter is specified, `next-optimized-images` automatically converts a JPEG/PNG image to the new WebP format.

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
If you don't want a specific small file to get inlined, you can use the `?url` query param to always get back an image URL, regardless of the inline limit.

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

#### ?original

The image won't get optimized and used as it is.
It makes sense to use this query param if you know an image already got optimized (e.g. during export) so it doesn't get optimized again a second time.

```javascript
import React from 'react';

export default () => (
  <img src={require('./images/my-image.jpg?original')} />
);
```

This can also be combined with the `?url` or `?inline` resource query (e.g. `?original&inline`).

#### ?lqip

> Requires the optional package `lqip-loader` (`npm install lqip-loader`)

When using this resource query, a very small (about 10x7 pixel) image gets created.
You can then display this image as a placeholder until the real (big) image has loaded.

You will normally stretch this tiny image to the same size as the real image is, like *medium.com* does.
To make the stretched image look better in chrome, check out [this solution](https://github.com/zouhir/lqip-loader/issues/5) and add a blur filter to your image.

```javascript
import React from 'react';

export default () => (
  <img src={require('./images/my-image.jpg?lqip')} />
);

/**
 * Replaces the src with a tiny image in base64.
 */
```

#### ?lqip-colors

> Requires the optional package `lqip-loader` (`npm install lqip-loader`)

This resource query returns you an **array with hex values** of the dominant colors of an image.
You can also use this as a placeholder until the real image has loaded (e.g. as a background) like the *Google Picture Search* does.

The number of colors returned can vary and depends on how many different colors your image has.

```javascript
import React from 'react';

export default () => (
  <div style={{ backgroundColor: require('./images/my-image.jpg?lqip-colors')[0] }}>...</div>
);

/**
 * require('./images/my-image.jpg?lqip-colors')
 *
 * returns for example
 *
 * ['#0e648d', '#5f94b5', '#a7bbcb', '#223240', '#a4c3dc', '#1b6c9c']
 */
```

#### ?trace

> Requires the optional package `image-trace-loader` (`npm install image-trace-loader`)

With the `?trace` resource query, you can generate [SVG image outlines](https://twitter.com/mikaelainalem/status/918213244954861569) which can be used as a placeholder while loading the original image.

```javascript
import React from 'react';
import MyImage from './images/my-image.jpg?trace';

export default () => (
  <div>
    <img src={MyImage.trace} />   {/* <-- SVG trace */}
    <img src={MyImage.src} />     {/* <-- Normal image which you want to lazy load */}
  </div>
);

/**
 * Results in:
 *
 * <div>
 *  <img src="data:image/svg+xml,...">
 *  <img src="/_next/static/images/image-trace-85bf5c58ce3d91fbbf54aa03c44ab747.jpg">
 * </div>
 */
```

`require('./images/my-image.jpg?trace')` returns an object containing the trace (`trace`) as an inlined SVG and the normal image (`src`) which also gets optimized.

The trace will have exactly the same width and height as your normal image.

Options for the loader can be set in the [plugin configuration](#imagetrace).

#### ?resize

> Requires the optional package `responsive-loader` (`npm install responsive-loader`)
> and either `jimp` (node implementation, slower) or `sharp` (binary, faster)

After the `?resize` resource query, you can add any other query of the [`responsive-loader`](https://www.npmjs.com/package/responsive-loader) which allows you to resize images and create whole source sets.

```javascript
import React from 'react';

const oneSize = require('./images/my-image.jpg?resize&size=300');
const multipleSizes = require('./images/my-image.jpg?resize&sizes[]=300&sizes[]=600&sizes[]=1000');

export default () => (
  <div>
    {/* Single image: */}
    <img src={oneSize.src} />

    {/* Source set with multiple sizes: */}
    <img srcSet={multipleSizes.srcSet} src={multipleSizes.src} />
  </div>
);
```

If only the `size` or `sizes` param is used, the `?resize` param can also be omitted (e.g. `my-image.jpg?size=300`). But it is required for all other parameters of `responsive-loader`.

You can also set global configs in the [`responsive`](#responsive) property (in the `next.config.js` file) and define, for example, default sizes which will get generated when you don't specify one for an image (e.g. only `my-image.jpg?resize`).

#### ?sprite

> Requires the optional optimization packages `imagemin-svgo` and `svg-sprite-loader` (`npm install imagemin-svgo svg-sprite-loader`)

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

To also make this work for server-side rendering, you need to add these changes to your `_document.jsx` file (read [here](https://nextjs.org/docs/#custom-document) if you don't have this file yet):

```javascript
// ./pages/_document.js
import Document, { Head, Main, NextScript } from 'next/document';
import sprite from 'svg-sprite-loader/runtime/sprite.build';

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    const spriteContent = sprite.stringify();

    return {
      spriteContent,
      ...initialProps,
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

## Configuration

This plugin uses [img-loader](https://www.npmjs.com/package/img-loader) under the hood which is based on [mozjpeg](https://github.com/imagemin/imagemin-mozjpeg), [optipng](https://github.com/imagemin/imagemin-optipng), [gifsicle](https://github.com/imagemin/imagemin-gifsicle) and [svgo](https://github.com/imagemin/imagemin-svgo).

The default options for these optimizers should be enough in most cases, but you can overwrite every available option if you want to.

#### handleImages

Type: `string[]`<br>
Default: `['jpeg', 'png', 'svg', 'webp', 'gif']`

`next-optimized-images` registers the webpack loader for all these file types.
If you don't want one of these handled by next-optimized-images because you, for example, have another plugin or custom loader rule, simply remove it from the array.

Please note that an image being handled does not mean it also gets automatically optimized. The required optimization package for that image also has to be installed. Please read the [optimization packages](#optimization-packages) section for more information.

If an image gets handled but not optimized, it means that the original image will get used and copied for the build.

:information_source: Since version 2.5, `ico` files are also supported but for backwards compatibility, they need to be manually enabled.
By adding `'ico'` to the `handleImages` array, the plugin will also handle `ico` files.

#### inlineImageLimit

Type: `number`<br>
Default: `8192`

Smaller files will get inlined with a data-uri by [url-loader](https://www.npmjs.com/package/url-loader).
This number defines the maximum file size (in bytes) for images to get inlined.
If an image is bigger, it will get copied to the static folder of next.

Images will get optimized in both cases.

To completely disable image inlining, set this value to `-1`. You will then always get back an image URL.

#### imagesFolder

Type: `string`<br>
Default: `'images'`

Folder name inside `/static/` in which the images will get copied to during build.

#### imagesPublicPath

Type: `string`<br>
Default: ``` `/_next/static/${imagesFolder}/` ```

The public path that should be used for image URLs. This can be used to serve
the optimized image from a cloud storage service like S3.

From version 2 on, next-optimized-images uses the [`assetPrefx` config of next.js](https://nextjs.org/docs/#cdn-support-with-asset-prefix) by default, but you can overwrite it with `imagesPublicPath` specially for images.

#### imagesOutputPath

Type: `string`<br>
Default: ``` `static/${imagesFolder}/` ```

The output path that should be used for images. This can be used to have a custom output folder.

#### imagesName

Type: `string`<br>
Default: `'[name]-[hash].[ext]'`

The filename of the optimized images.
Make sure you keep the `[hash]` part so they receive a new filename if the content changes.

#### removeOriginalExtension

Type: `boolean`<br>
Default: `false`

When images converted to WebP on the fly, `.webp` was append to the filename. For example, `test.png` became `test.png.webp`. If you want to have only one filename extension like `test.webp`, you can set this option to `true`.

#### optimizeImagesInDev

Type: `boolean`<br>
Default: `false`

For faster development builds and HMR, images will not get optimized by default when running in development mode.
In production, images will always get optimized, regardless of this setting.

#### mozjpeg

> Requires the optional optimization package `imagemin-mozjpeg` (`npm install imagemin-mozjpeg`)

Type: `object`<br>
Default: `{}`

[mozjpeg](https://github.com/imagemin/imagemin-mozjpeg) is used for optimizing jpeg images.
You can specify the options for it here.
The default options of `mozjpeg` are used if you omit this option.

#### optipng

> Requires the optional optimization package `imagemin-optipng` (`npm install imagemin-optipng`)

Type: `object`<br>
Default: `{}`

[optipng](https://github.com/imagemin/imagemin-optipng) is used for optimizing png images by default.
You can specify the options for it here.
The default options of `optipng` are used if you omit this option.

#### pngquant

> Requires the optional optimization package `imagemin-pngquant` (`npm install imagemin-pngquant`)

Type: `object`<br>
Default: `{}`

[pngquant](https://github.com/imagemin/imagemin-pngquant) is an alternative way for optimizing png images.
The default options of `pngquant` are used if you omit this option.

#### gifsicle

> Requires the optional optimization package `imagemin-gifsicle` (`npm install imagemin-gifsicle`)

Type: `object`<br>
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

#### svgo

> Requires the optional optimization package `imagemin-svgo` (`npm install imagemin-svgo`)

Type: `object`<br>
Default: `{}`

[svgo](https://github.com/imagemin/imagemin-svgo) is used for optimizing svg images and icons.
You can specify the options for it here.
The default options of `svgo` are used if you omit this option.

Single svgo plugins can get disabled/enabled in the plugins array:
```javascript
{
  svgo: {
    plugins: [
      { removeComments: false }
    ]
  }
}
```

#### svgSpriteLoader

> Requires the optional optimization packages `imagemin-svgo` and `svg-sprite-loader` (`npm install imagemin-svgo svg-sprite-loader`)

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

> Requires the optional optimization package `webp-loader` (`npm install webp-loader`)

Type: `object`<br>
Default: `{}`

[imagemin-webp](https://github.com/imagemin/imagemin-webp) is used for optimizing webp images and converting other formats to webp.
You can specify the options for it here.
The default options of `imagemin-webp` are used if you omit this option.

#### imageTrace

> Requires the optional package `image-trace-loader` (`npm install image-trace-loader`)

Type: `object`<br>
Default: `{}`

When using [`image-trace-loader`](https://github.com/EmilTholin/image-trace-loader) for the `?trace` resource query, you can define all options for the image trace loader in this object.
The default options of `image-trace-loader` are used if you omit this option.

#### responsive

> Requires the optional optimization package `responsive-loader` (`npm install responsive-loader`)

Type: `object`<br>
Default: `{}`

The configuration for the [`responsive-loader`](https://github.com/herrstucki/responsive-loader) can be defined here.

#### defaultImageLoader

> Requires the optional optimization package `responsive-loader` (`npm install responsive-loader`)

Type: `string`<br>
Default: `'img-loader'`

By default, img-loader handles most of the requests.
However, if you use the `responsive-loader` a lot and don't want to add the [`?resize`](#resize) query param to every require, you can set this value to `'responsive-loader'`.

After that, `responsive-loader` will handle *all* JPEG and PNG images per default, even without an additional query param.
Just be aware that you can't use any of the query params `next-optimized-images` provides anymore on these images because the request just gets forwarded and not modified anymore.
All other formats (SVG, WEBP and GIF) still work as before with the `img-loader` and so have all query params available.

#### optimizeImages

Type: `boolean`<br>
Default: `true`

If you don't have any optimization package installed, no image will get optimized.
In this case, a warning gets written to the console during build to inform you about a possible misconfiguration.
If this config is intended and you indeed don't want the images to be optimized, you can set this value to `false` and you won't get the warning anymore.

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
    handleImages: ['jpeg', 'png', 'svg', 'webp', 'gif'],
    removeOriginalExtension: false,
    optimizeImages: true,
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
