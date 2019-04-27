import Link from 'next/link';

export default () => (
  <div>
    <Link href="/jpeg">
      <a>JPEG</a>
    </Link>
    {' '}
    <Link href="/png">
      <a>PNG</a>
    </Link>
    {' '}
    <Link href="/gif">
      <a>GIF</a>
    </Link>
    {' '}
    <Link href="/svg">
      <a>SVG</a>
    </Link>
    {' '}
    <Link href="/webp">
      <a>WEBP</a>
    </Link>
    {' '}
    <Link href="/lqip">
      <a>LQIP</a>
    </Link>
    {' '}
    <Link href="/resize">
      <a>Resize</a>
    </Link>
    {' '}
    <Link href="/image-trace">
      <a>Image Trace</a>
    </Link>
  </div>
);
