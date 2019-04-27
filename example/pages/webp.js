import ImageSize from '../components/ImageSize';
import { getImageSize } from '../helpers/getImageSize';
import { getImageType } from '../helpers/getImageType';

export default class extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {};

    this.urlAutoRef = React.createRef();
    this.urlForcedRef = React.createRef();
    this.inlineAutoRef = React.createRef();
    this.inlineForcedRef = React.createRef();
    this.originalRef = React.createRef();
    this.originalUrlRef = React.createRef();
    this.originalInlineRef = React.createRef();
    this.jpegUrlConvertedRef = React.createRef();
    this.jpegInlineConvertedRef = React.createRef();
    this.pngUrlConvertedRef = React.createRef();
    this.pngInlineConvertedRef = React.createRef();
  }

  componentDidMount() {
    Promise.all([
      getImageSize(this.urlAutoRef.current),
      getImageSize(this.urlForcedRef.current),
      getImageSize(this.inlineAutoRef.current),
      getImageSize(this.inlineForcedRef.current),
      getImageSize(this.originalRef.current),
      getImageSize(this.originalUrlRef.current),
      getImageSize(this.originalInlineRef.current),
      getImageSize(this.jpegUrlConvertedRef.current),
      getImageSize(this.jpegInlineConvertedRef.current),
      getImageSize(this.pngUrlConvertedRef.current),
      getImageSize(this.pngInlineConvertedRef.current),
    ]).then(([
      urlAutoSize,
      urlForcedSize,
      inlineAutoSize,
      inlineForcedSize,
      originalSize,
      originalUrlSize,
      originalInlineSize,
      jpegUrlConvertedSize,
      jpegInlineConvertedSize,
      pngUrlConvertedSize,
      pngInlineConvertedSize,
    ]) => {
      this.setState({
        urlAutoSize,
        urlAutoType: getImageType(this.urlAutoRef.current, true),
        urlForcedSize,
        urlForcedType: getImageType(this.urlForcedRef.current, true),
        inlineAutoSize,
        inlineAutoType: getImageType(this.inlineAutoRef.current, true),
        inlineForcedSize,
        inlineForcedType: getImageType(this.inlineForcedRef.current, true),
        originalSize,
        originalType: getImageType(this.originalRef.current, true),
        originalUrlSize,
        originalUrlType: getImageType(this.originalUrlRef.current, true),
        originalInlineSize,
        originalInlineType: getImageType(this.originalInlineRef.current, true),
        jpegUrlConvertedSize,
        jpegUrlConvertedType: getImageType(this.jpegUrlConvertedRef.current, true),
        jpegInlineConvertedSize,
        jpegInlineConvertedType: getImageType(this.jpegInlineConvertedRef.current, true),
        pngUrlConvertedSize,
        pngUrlConvertedType: getImageType(this.pngUrlConvertedRef.current, true),
        pngInlineConvertedSize,
        pngInlineConvertedType: getImageType(this.pngInlineConvertedRef.current, true),
      });
    });
  }

  render() {
    return (
      <div>
        <style jsx>{`
          img {
            max-width: 600px;
            max-height: 600px;
          }
        `}</style>
        <div>
          <p>URL (auto) <ImageSize original={349.3} optimized={349.3} actual={this.state.urlAutoSize} type="url webp" actualType={this.state.urlAutoType} /></p>
          <img ref={this.urlAutoRef} src={require('../assets/webp-url-auto.webp')} />
        </div>
        <div>
          <p>URL (forced) <ImageSize original={1.1} optimized={1.1} actual={this.state.urlForcedSize} type="url webp" actualType={this.state.urlForcedType} /></p>
          <img ref={this.urlForcedRef} src={require('../assets/webp-url-forced.webp?url')} />
        </div>
        <div>
          <p>Inline (auto) <ImageSize original={1.5} optimized={1.5} actual={this.state.inlineAutoSize} type="inline webp" actualType={this.state.inlineAutoType} /></p>
          <img ref={this.inlineAutoRef} src={require('../assets/webp-inline-auto.webp')} />
        </div>
        <div>
          <p>Inline (forced) <ImageSize original={15.6} optimized={15.6} actual={this.state.inlineForcedSize} type="inline webp" actualType={this.state.inlineForcedType} /></p>
          <img ref={this.inlineForcedRef} src={require('../assets/webp-inline-forced.webp?inline')} />
        </div>
        <div>
          <p>Original <ImageSize original={489.1} optimized={489.1} actual={this.state.originalSize} type="url webp" actualType={this.state.originalType} /></p>
          <img ref={this.originalRef} src={require('../assets/webp-original.webp?original')} />
        </div>
        <div>
          <p>Original URL (forced) <ImageSize original={3.7} optimized={3.7} actual={this.state.originalUrlSize} type="url webp" actualType={this.state.originalUrlType} /></p>
          <img ref={this.originalUrlRef} src={require('../assets/webp-original-url-forced.webp?original&url')} />
        </div>
        <div>
          <p>Original Inline (forced) <ImageSize original={68.2} optimized={68.2} actual={this.state.originalInlineSize} type="inline webp" actualType={this.state.originalInlineType} /></p>
          <img ref={this.originalInlineRef} src={require('../assets/webp-original-inline-forced.webp?original&inline')} />
        </div>
        <div>
          <p>JPEG Url (converted) <ImageSize original={371.2} optimized={371.2} actual={this.state.jpegUrlConvertedSize} type="url webp" actualType={this.state.jpegUrlConvertedType} /></p>
          <img ref={this.jpegUrlConvertedRef} src={require('../assets/webp-jpeg-url-converted.jpg?webp')} />
        </div>
        <div>
          <p>JPEG Inline (converted) <ImageSize original={1.5} optimized={1.5} actual={this.state.jpegInlineConvertedSize} type="inline webp" actualType={this.state.jpegInlineConvertedType} /></p>
          <img ref={this.jpegInlineConvertedRef} src={require('../assets/webp-jpeg-inline-converted.jpg?webp')} />
        </div>
        <div>
          <p>PNG Url (converted) <ImageSize original={41.8} optimized={41.8} actual={this.state.pngUrlConvertedSize} type="url webp" actualType={this.state.pngUrlConvertedType} /></p>
          <img ref={this.pngUrlConvertedRef} src={require('../assets/webp-png-url-converted.png?webp')} />
        </div>
        <div>
          <p>PNG Inline (converted) <ImageSize original={2.4} optimized={2.4} actual={this.state.pngInlineConvertedSize} type="inline webp" actualType={this.state.pngInlineConvertedType} /></p>
          <img ref={this.pngInlineConvertedRef} src={require('../assets/webp-png-inline-converted.png?webp')} />
        </div>
      </div>
    );
  }
}
