# Upgrading

## From version `2.x` to `canary`

This is a complete rewrite and so introduced a few breaking changes. Please check out the [readme](https://github.com/cyrilwanner/next-optimized-images/blob/canary/README.md) for an overview of all newly available features. Also, not all features previously available in version 2 are already implemented in the canary version. A list of currently missing features is also located at the top of the [readme](https://github.com/cyrilwanner/next-optimized-images/blob/canary/README.md).

### Breaking changes

#### Optional optimization packages

There are no more optional optimization packages. Because images are now optimized through node or WebAssembly, the packages are a lot smaller and run on every system and so get shipped by default.

You can uninstall all previously installed packages (e.g. `imagemin-mozjpeg`, `imagemin-optipng`, `imagemin-pngquant`, `imagemin-gifsicle`, `imagemin-svgo`, `svg-sprite-loader`, `webp-loader`, `lqip-loader`, `responsive-loader`, `image-trace-loader`).

#### Query params

It is now suggested to use the provided JSX components instead of writing the query params manually. An advantage is that the components have full typescript support.

However, it is still possible to use query params.
There is one breaking change with the query params:

`?resize` has been removed in favor of `?width=` and `?height=`. As a result, it is no longer possible to specify multiple sizes within the same query. This decision was made to follow the concepts of webpack closer where every import should target one image. That also makes it possible to chain loaders and forward the output to other loaders. Again, it is suggested to use the [Img](https://github.com/cyrilwanner/next-optimized-images/blob/canary/README.md#img) component which will handle that for you.

Please read the [readme](https://github.com/cyrilwanner/next-optimized-images/blob/canary/README.md#configuration) for more information about how to use the `width` and `height` query param (not both are required to be set, e.g. only `width` would be enough).

#### Configuration

The configuration with the `next.config.js` has changed a lot. For example, all options for this plugin have to be specified within the `images` property and so many options have been renamed (to a shorter name). Please read the section within the [readme](https://github.com/cyrilwanner/next-optimized-images/blob/canary/README.md#configuration) and adapt your config manually.

The default output paths have also been changed from `/_next/static/images/` to `/_next/static/chunks/images/` so next automatically sets the correct caching headers.

#### Babel configuration

To use the image components, a babel plugin is now required.

Add the `react-optimized-image/plugin` babel plugin to your `.babelrc` file.
If you don't yet have a `.babelrc` file, create one with the following content:

```json
{
  "presets": ["next/babel"],
  "plugins": ["react-optimized-image/plugin"]
}
```

## From version `1.x` to `2.x`

From version 1 to 2, some breaking changes were introduced. Please read this document carefully and update your configuration if needed.

### Optional optimization packages

In version 1, we installed all possible optimization packages (JPEG, PNG, GIF, SVG, SVG Sprites, WebP) even if you didn't need them. Some of them also caused troubles in specific environments even though they weren't used.

With version 2, we also updated the underlying [`img-loader`](https://www.npmjs.com/package/img-loader) which now enables us to have all optimization packages optional.

This now enables you to only install the ones you really need and in the build step you need them (e.g. only as a devDependency).
**But you have to install them manually in addition to next-optimized-images.**

To have the same behavior as in *v1* (all optimization packages installed), run the following command *after* upgrading to next-optimized-images:
```bash
npm install imagemin-mozjpeg imagemin-optipng imagemin-gifsicle imagemin-svgo svg-sprite-loader webp-loader
```

If you don't need all these optimization packages, please read the [optimization packages section in the readme](https://github.com/cyrilwanner/next-optimized-images#optimization-packages).

### Node version

To keep up with the newest next.js version, we now also require **Node.js >= 8**.

If you need to support older node versions, you can still use [version 1](https://github.com/cyrilwanner/next-optimized-images/tree/v1#readme) of next-optimized-images.

### Configuration changes

#### `assetPrefix` and `imagesPublicPath`

next-optimized-images now uses the [`assetPrefix` config of next.js](https://nextjs.org/docs/#cdn-support-with-asset-prefix) by default.
So if your images are located at the same place as your other assets, you don't have to set the `imagesPublicPath` anymore.

But this config still exists and if specified, overwrites the `assetPrefix` setting for images.

#### Don't optimize an image type

Previously, if you didn't want, for example, jpeg images to be optimized, you could set `mozjpeg` to `null` (same for `optipng`, `pngquant`, `gifsicle`, `svgo` or `webp`).

From now on, simply uninstall (if you had it installed) the `imagemin-mozjpeg` package (or the optimization package for the respective image type).

#### Don't handle an image type

Previously, if you didn't want, for example, jpeg images to be handled by next-optimized-images because you had another plugin or a custom loader definition for it, you could set `mozjpeg` to `false` (same for `optipng`, `pngquant`, `gifsicle`, `svgo` or `webp`).

Now, this setting is in a single configuration key, the [`handleImages`](https://github.com/cyrilwanner/next-optimized-images#handleimages).
You can define the image types which next-optimized-images should handle within this array:
```javascript
{
  // default value:
  handleImages: ['jpeg', 'png', 'svg', 'webp', 'gif'],
}
```

## Having questions?

Please do not hesitate to open a [new issue](https://github.com/cyrilwanner/next-optimized-images/issues/new) if you have a question or problem while updating `next-optimized-images`.
