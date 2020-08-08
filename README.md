# :sunrise: next-optimized-images [![npm version](https://badgen.net/npm/v/next-optimized-images)](https://www.npmjs.com/package/next-optimized-images) [![license](https://badgen.net/github/license/cyrilwanner/next-optimized-images)](https://github.com/cyrilwanner/next-optimized-images/blob/master/LICENSE) [![downloads](https://badgen.net/npm/dt/next-optimized-images)](https://www.npmjs.com/package/next-optimized-images)

:heavy_exclamation_mark: **Canary disclaimer** :heavy_exclamation_mark:

> Any **feedback, ideas, bugs**, or anything else about this new version is very much appreciated, either in the [RFC issue](https://github.com/cyrilwanner/next-optimized-images/issues/120) or in a separate issue.

This is a canary version of `next-optimized-images`. If you want to use a non-canary version, please switch to the [master branch](https://github.com/cyrilwanner/next-optimized-images/tree/master).

This version is a complete rewrite and so has introduced breaking changes. If you want to update `next-optimized-images` in an existing project from version 2 to this canary version, please read the [upgrading guide](https://github.com/cyrilwanner/next-optimized-images/blob/canary/UPGRADING.md).

Compared to version 2, the following features are *currently missing* in the canary version:

- `?trace` query param
- `?sprite` query param

If your project depends on them, you have to wait a little more, but those features will get added again soon.

New features compared to the current version which are already in the canary version:

- **Image optimization is performed either in node or WebAssembly** - there is no need for imagemin plugins anymore and so no native binaries are required
- **Build cache for images** - results in way faster builds and images are also optimized in the dev environment by default
- **Image components** are provided for even easier use - there shouldn't be a need to use query params anymore normally (a babel plugin does that now for you)
- [**images.config.js**](#imagesconfigjs) for global configuration and definition and re-use of image types and their options
- **Full typescript support** thanks to the provided image components
- Query params can be **chained** now - for example `?webp&width=400`
- ...and more. Read this readme file for an overview of all features.

---
## Table of contents

- [Installation](#installation)
- [Usage](#usage)
  - [Image components](#image-components)
  - [Query params](#query-params)
- [Configuration](#configuration)
  - [next.config.js](#nextconfigjs)
  - [images.config.js](#imagesconfigjs)
- [License](#license)

## Installation

```
npm install next-optimized-images@canary
```

Requirements:

- Node >= 10
- Next.js >= 9

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

And add the `react-optimized-image/plugin` babel plugin to your `.babelrc` file.
If you don't yet have a `.babelrc` file, create one with the following content:

```json
{
  "presets": ["next/babel"],
  "plugins": ["react-optimized-image/plugin"]
}
```

If you are using typescript, add the following line to your `next-env.d.ts` file:

```typescript
/// <reference types="optimized-images-loader" />
```

See the [configuration](#configuration) section for all available options.

The example above uses [next-compose-plugins](https://github.com/cyrilwanner/next-compose-plugins) for a cleaner API when using many plugins, see its readme for a more detailed example. `next-optimized-images` also works with the standard plugin api:

```javascript
// next.config.js
const withOptimizedImages = require('next-optimized-images');

module.exports = withOptimizedImages({
  /* config for next-optimized-images */

  // your config for other plugins or the general next.js here...
});
```

## Usage

You can now import or require your images directly in your react components:

```javascript
import React from 'react';
import Img from 'react-optimized-image';
import MyImage from './images/my-image.jpg';

export default () => (
  <div>
    {/* with import statement ..*/}
    <Img src={MyImage} />

    {/* ..or an inline require */}
    <Img src={require('./images/my-small-image.png')} />
  </div>
);

/**
 * Results in:
 *
 * <div>
 *   <img src="/_next/static/chunks/images/my-image-5216de428a8e8bd01a4aa3673d2d1391.jpg" />
 *   <img src="data:image/png;base64,..." />
 * </div>
 */
```

If you are using CSS modules, this package also detects images and optimized them in `url()` values in your css/sass/less files:

```scss
.Header {
  background-image: url('./images/my-image.jpg');
}
```

If the file is below the [limit for inlining images](#nextconfigjs), the `require(...)` will return a base64 data-uri (`data:image/jpeg;base64,...`).

Otherwise, `next-optimized-images` will copy your image into the static folder of next.js and the `require(...)` returns the path to your image in this case (`/_next/static/chunks/images/my-image-5216de428a8e8bd01a4aa3673d2d1391.jpg`).

### Image components

For easier use and full typescript support, this plugin provides some image components.

*Please note that all components need to be imported from the `react-optimized-image` package instead of `next-optimized-images`.*

* [`Img`](#img)
* [`Svg`](#svg)

#### Img

The `Img` component can be used to include a normal image. Additionally, it can create a WebP fallback and provide different sizes for different viewports.

##### Usage

```javascript
import Img from 'react-optimized-image';
import MyImage from './images/my-image.jpg';

export default () => (
  <>
    <h1>Normal optimized image</h1>
    <Img src={MyImage} />

    <h1>Image will be resized to 400px width</h1>
    <Img src={MyImage} sizes={[400]} />

    <h1>A WebP image will be served in two sizes: 400px and 800px</h1>
    <h2>As a fallback, a jpeg image will be provided (also in both sizes)</h2>
    <Img src={MyImage} webp sizes={[400, 800]} />
  </>
);

/**
 * Results in:
 *
 * <h1>Normal optimized image</h1>
 * <img src="/_next/static/chunks/images/my-image-5216de428a8e8bd01a4aa3673d2d1391.jpg" />
 *
 * <h1>Image will be resized to 400px width</h1>
 * <img src="/_next/static/chunks/images/my-image-572812a2b04ed76f93f05bf57563c35d.jpg" />
 *
 * <h1>A WebP image will be served in two sizes: 400px and 800px</h1>
 * <h2>As a fallback, a jpeg image will be provided (also in both sizes)</h2>
 * <picture>
 *  <source type="image/webp" srcset="/_next/static/chunks/images/image-0cc3dc9faff2e36867d4db3de15a7b32.webp" media="(max-width: 400px)">
 *  <source type="image/webp" srcset="/_next/static/chunks/images/image-08ce4cc7914a4d75ca48e9ba0d5c65da.webp" media="(min-width: 401px)">
 *  <source type="image/jpeg" srcset="/_next/static/chunks/images/image-132d7f8860bcb758e97e54686fa0e240.jpg" media="(max-width: 400px)">
 *  <source type="image/jpeg" srcset="/_next/static/chunks/images/image-9df4a476716a33461114a459e64301df.jpg" media="(min-width: 401px)">
 *  <img src="/_next/static/chunks/images/image-0f5726efb3915365a877921f93f004cd.jpg"></picture>
 * </picture>
 */
```

##### Properties

| Prop | Required | Type | Description |
| :--- | :------: | :--: | :---------- |
| src | **yes** | `string` | Source image. |
| webp | | `boolean` | If true, the image will get converted to WebP. For browsers which don't support WebP, an image in the original format will be served. |
| sizes | | `number[]` | Resize the image to the given width. If only one size is present, an `<img>` tag will get generated, otherwise a `<picture>` tag for multiple sizes. |
| densities | | `number[]` | **Default:** `[1]`<br>Specifies the supported pixel densities. For example, to generate images for retina displays, set this value to `[1, 2]`. |
| breakpoints | | `number[]` | Specifies the breakpoints used to decide which image size to use (when the `size` property is present). If no breakpoints are specified, they will automatically be set to match the image sizes which is good for full-width images but result in too big images in other cases.<br>The breakpoints should have the same order as the image sizes.<br>Example for this query: ```sizes={[400, 800, 1200]} breakpoints={[600, 1000]}```<br>For widths 0px-600px the 400px image will be used, for 601px-1000px the 800px image will be used and for everything larger than 1001px, the 1200px image will be used. |
| inline | | `boolean` | If true, the image will get forced to an inline data-uri (e.g. `data:image/png;base64,...`). |
| url | | `boolean` | If true, the image will get forced to be referenced with an url, even if it is a small image and would get inlined by default. |
| original | | `boolean` | If true, the image will not get optimized (but still resized if the `sizes` property is present). |
| type | | `string` | So you don't have to repeat yourself by setting the same sizes or other properties on many images, specify the image type which equals to one in your [global image config](#imagesconfigjs). |
| *anything else* | | `ImgHTMLAttributes` | All other properties will be directly passed to the `<img>` tag. So it would for example be possible to use native lazy-loading with `loading="lazy"`. |

#### Svg

The `Svg` includes an svg file directly into the HTML so it can be styled by CSS. If you don't want to include them directly in the HTML, you can also use svg images together with the [`Img`](#img) component which will reference it by the URL.

##### Usage

```javascript
import { Svg } from 'react-optimized-image';
import Icon from './icons/my-icon.svg';

export default () => (
  <>
    <h1>SVG will be directly included in the HTML</h1>
    <Svg src={Icon} className="fill-red" />
  </>
);

/**
 * Results in:
 *
 * <span><svg class="fill-red" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="280" height="330"><g><path>...</path></g></svg></span>
 */
```

##### Properties

| Prop | Required | Type | Description |
| :--- | :------: | :--: | :---------- |
| src | **yes** | `string` | Source image. |
| className | | `string` | Class to apply to the `<svg>` tag. |

### Query params

Although it is suggested to use [image components](#image-components), query params directly within the import or require statement are also possible.

* [`?include`](#include): Include the raw file directly (useful for SVG icons)
* [`?webp`](#webp): Convert an image to WebP on the fly
* [`?inline`](#inline): Force inlining an image (data-uri)
* [`?url`](#url): Force an URL for a small image (instead of data-uri)
* [`?original`](#original): Use the original image and do not optimize it
* [`?lqip`](#lqip): Generate a low quality image placeholder
* [`?colors`](#colors): Extract the dominant colors of an image
* [`?width`](#width): Resize an image to the given width
* [`?height`](#height): Resize an image to the given height
* [`?trace`](#trace): Use traced outlines as loading placeholder *(currently not supported)*
* [`?sprite`](#sprite): Use SVG sprites *(currently not supported)*

#### ?include

The image will now directly be included in your HTML without a data-uri or a reference to your file.

#### ?webp

If this `?webp` query parameter is specified, `next-optimized-images` automatically converts the image to the new WebP format.

For browsers that don't yet support WebP, you may want to also provide a fallback using the `<picture>` tag or use the [`Img`](#img) component which does this out of the box:

#### ?inline

You can specify a [limit for inlining](#inlineimagelimit) images which will include it as a data-uri directly in your content instead of referencing a file if the file size is below that limit.

You usually don't want to specify a too high limit but there may be cases where you still want to inline larger images.

In this case, you don't have to set the global limit to a higher value but you can add an exception for a single image using the `?inline` query options.

#### ?url

When you have an image smaller than your defined [limit for inlining](#inlineimagelimit), it normally gets inlined automatically.
If you don't want a specific small file to get inlined, you can use the `?url` query param to always get back an image URL, regardless of the inline limit.

#### ?original

The image won't get optimized and used as it is.
It makes sense to use this query param if you know an image already got optimized (e.g. during export) so it doesn't get optimized again a second time.

#### ?lqip

When using this resource query, a very small (about 10x10 pixel) image gets created.
You can then display this image as a placeholder until the real (big) image has loaded.

#### ?colors

This resource query returns you an **array with hex values** of the dominant colors of an image.
You can also use this as a placeholder until the real image has loaded (e.g. as a background) like the *Google Picture Search* does.

The number of colors returned can vary and depends on how many different colors your image has.

```javascript
import React from 'react';

export default () => (
  <div style={{ backgroundColor: require('./images/my-image.jpg?colors')[0] }}>...</div>
);

/**
 * require('./images/my-image.jpg?colors')
 *
 * returns for example
 *
 * ['#0e648d', '#5f94b5', '#a7bbcb', '#223240', '#a4c3dc', '#1b6c9c']
 */
```

#### ?trace

> Currently not supported

With the `?trace` resource query, you can generate [SVG image outlines](https://twitter.com/mikaelainalem/status/918213244954861569) which can be used as a placeholder while loading the original image.

#### ?width

Resizes the source image to the given width. If a height is additionally specified, it ensures the image covers both sizes and crops the remaining parts. If no height is specified, it will be automatically calculated to preserve the image aspect ratio.

```javascript
import React from 'react';
import Image from './images/my-image.jpg?width=800';
import Thumbnail from './images/my-image.jpg?width=300&height=300';

export default () => (
  <div>
    <img src={Image} />
    <img src={Thumbnail} />
  </div>
);
```

#### ?height

Resizes the source image to the given height. If a width is additionally specified, it ensures the image covers both sizes and crops the remaining parts. If no width is specified, it will be automatically calculated to preserve the image aspect ratio.

```javascript
import React from 'react';
import Image from './images/my-image.jpg?height=800';
import Thumbnail from './images/my-image.jpg?width=300&height=300';

export default () => (
  <div>
    <img src={Image} />
    <img src={Thumbnail} />
  </div>
);
```

#### ?sprite

> Currently not supported

If you need to style or animate your SVGs [?include](#?include) might be the wrong option, because that ends up in a lot of DOM elements, especially when using the SVG in list-items etc.

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

This plugin uses [optimized-images-loader](https://www.npmjs.com/package/optimized-images-loader) under the hood which is based on mozjpeg, oxipng, svgo, gifsicle and sharp.

The default options for these optimizers should be enough in most cases, but you can overwrite every available option if you want to.

### `next.config.js`

All options listed above must be provided within the `images` object in your config file:

```javascript
// next.config.js
const withPlugins = require('next-compose-plugins');
const optimizedImages = require('next-optimized-images');

module.exports = withPlugins([
  [optimizedImages, {
    images: {
      // for example
      handleImages: ['jpeg', 'png', 'svg', 'webp', 'gif', 'ico']
    }
  }],
]);
```

Available options:
| Option | Default | Type | Description |
| :--- | :------: | :--: | :---------- |
| handleImages | `['jpeg', 'png', 'svg', 'webp', 'gif']` | `string[]` | `next-optimized-images` registers the webpack loader for all these file types. If you don't want one of these handled by next-optimized-images simply remove it from the array. |
| limit | `8192` | `number` | Images smaller than this number (in bytes) will get inlined with a data-uri. |
| optimize | `true` | `boolean` | If this plugin should not optimized images, set this to `false`. You can still resize images, convert them to WebP and use other features in that case. |
| cacheFolder | `'node_modules/optimized-images-loader/.cache'` | `string` | Images will be cached in this folder to avoid long build times. |
| name | `'[name]-[contenthash].[ext]'` | `string` | File name of the images after they got processed. Additionally to the [default placeholders](https://github.com/webpack-contrib/file-loader#placeholders), `[width]` and `[height]` are also available. |
| outputPath | `'static/chunks/images/'` | `string` | Images will be saved in this directory within the `.next` folder. |
| publicPath | `'/_next/static/chunks/images/'` | `string` | The public path that should be used for image URLs. This can be used to serve the optimized image from a cloud storage service like S3. From version 2 on, next-optimized-images uses the [`assetPrefx` config of next.js](https://nextjs.org/docs/#cdn-support-with-asset-prefix) by default, but you can overwrite it with `publicPath` specially for images. |
| mozjpeg | | `MozjpegOptions` | Specifies the options used to optimize jpeg images. All available options can be seen [here](https://www.npmjs.com/package/@wasm-codecs/mozjpeg#encodeoptions-encodeoptions). |
| oxipng | | `OxipngOptions` | Specifies the options used to optimize png images. All available options can be seen [here](https://www.npmjs.com/package/@wasm-codecs/oxipng#encodeoptions-encodeoptions). |
| gifsicle | | `GifsicleOptions` | Specifies the options used to optimize png images. All available options can be seen [here](https://www.npmjs.com/package/@wasm-codecs/gifsicle#encodeoptions-encodeoptions). |
| webp | | `WebpOptions` | Specifies the options used to optimize webp images. All available options can be seen [here](https://sharp.pixelplumbing.com/api-output#webp). |
| svgo | | `SvgoOptions` | Specifies the options used to optimize svg images. All available options can be seen [here](https://github.com/svg/svgo#what-it-can-do). |

### `images.config.js`

This file contains default image optimization options and is located in the **root** of your project, next to the `next.config.js` file.

Available options:
| Option | Type | Description |
| :--- | :------: | :---------- |
| default | `ImgProps` | Properties specified within the `default` key will get applied to **all** usages of the [`Img`](#img) components.<br>All properties of the [`Img`](#img) component can be set. For example, to convert **all** your images to WebP, set `{ webp: true }`. |
| types | `Record<string, ImgProps>` | Instead of specifying options for **all** images with the `default` key, you can create as many image `types` as you want. Those can also contain all properties of the [`Img`](#img) component. The options specified in the `default` key will also get applied here if they are not overwritten. |

#### Example

```javascript
module.exports = {
  default: {
    webp: true,
  },
  types: {
    thumbnail: {
      sizes: [200, 400],
      breakpoints: [800],
      webp: false,
    },
  },
};
```

> **Important**: When you make changes on this config file, you have to manually remove the `.next/cache` folder and restart next in order to see the changes. This issue will get resolved in the next canary version.

This will convert **all images** to WebP. The images with the `thumbnail` type will be generated in two sizes (200, 400) but not converted to WebP. If `webp: false` would not be present, it would get inherited from the `default` key.

```javascript
import React from 'react';
import Img from 'react-optimized-image';
import MyImage from './images/my-image.jpg';

export default () => (
  <div>
    {/* This will get converted into a WebP image (while still providing a fallback image). */}
    <Img src={MyImage} />

    {/* This will be provided in to sizes (200, 400) but not get converted to WebP. */}
    <Img src={MyImage} type="thumbnail" />
  </div>
);
```

## License

Licensed under the [MIT](https://github.com/cyrilwanner/next-optimized-images/blob/master/LICENSE) license.

© Copyright Cyril Wanner
