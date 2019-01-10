# Upgrading

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
