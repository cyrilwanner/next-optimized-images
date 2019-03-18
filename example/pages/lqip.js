import ImageSize from '../components/ImageSize';
import { getImageSize } from '../helpers/getImageSize';
import { getImageType } from '../helpers/getImageType';
import Palette from '../components/Palette';

export default class extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {};

    this.jpegInlineAutoRef = React.createRef();
    this.jpegUrlForcedRef = React.createRef();
    this.pngInlineAutoRef = React.createRef();
    this.pngUrlForcedRef = React.createRef();
  }

  componentDidMount() {
    Promise.all([
      getImageSize(this.jpegInlineAutoRef.current),
      getImageSize(this.jpegUrlForcedRef.current),
      getImageSize(this.pngInlineAutoRef.current),
      getImageSize(this.pngUrlForcedRef.current),
    ]).then(([
      jpegInlineAutoSize,
      jpegUrlForcedSize,
      pngInlineAutoSize,
      pngUrlForcedSize,
    ]) => {
      this.setState({
        jpegInlineAutoSize,
        jpegInlineAutoType: getImageType(this.jpegInlineAutoRef.current),
        jpegUrlForcedSize,
        jpegUrlForcedType: getImageType(this.jpegUrlForcedRef.current),
        pngInlineAutoSize,
        pngInlineAutoType: getImageType(this.pngInlineAutoRef.current),
        pngUrlForcedSize,
        pngUrlForcedType: getImageType(this.pngUrlForcedRef.current),
      });
    });
  }

  render() {
    return (
      <div>
        <style jsx>{`
          img {
            width: 600px;
            max-height: 600px;
          }
        `}</style>
        <div>
          <p>JPEG Inline (auto) <ImageSize original={1.1} optimized={1.1} actual={this.state.jpegInlineAutoSize} type="inline" actualType={this.state.jpegInlineAutoType} /></p>
          <img ref={this.jpegInlineAutoRef} src={require('../assets/lqip-jpeg-inline-auto.jpg?lqip')} />
        </div>
        <div>
          <p>JPEG Inline (auto) Color Palette</p>
          <Palette colors={require('../assets/lqip-jpeg-inline-auto.jpg?lqip-colors')} />
        </div>
        <div>
          <p>JPEG URL (auto) <ImageSize original={1.1} optimized={1.1} actual={this.state.jpegUrlForcedSize} type="inline" actualType={this.state.jpegUrlForcedType} /></p>
          <img ref={this.jpegUrlForcedRef} src={require('../assets/lqip-jpeg-url-forced.jpg?lqip')} />
        </div>
        <div>
          <p>JPEG URL (auto) Color Palette</p>
          <Palette colors={require('../assets/lqip-jpeg-url-forced.jpg?lqip-colors')} />
        </div>
        <div>
          <p>PNG Inline (auto) <ImageSize original={0.6} optimized={0.6} actual={this.state.pngInlineAutoSize} type="inline" actualType={this.state.pngInlineAutoType} /></p>
          <img ref={this.pngInlineAutoRef} src={require('../assets/lqip-png-inline-auto.png?lqip')} />
        </div>
        <div>
          <p>PNG Inline (auto) Color Palette</p>
          <Palette colors={require('../assets/lqip-png-inline-auto.png?lqip-colors')} />
        </div>
        <div>
          <p>PNG URL (auto) <ImageSize original={0.4} optimized={0.4} actual={this.state.pngUrlForcedSize} type="inline" actualType={this.state.pngUrlForcedType} /></p>
          <img ref={this.pngUrlForcedRef} src={require('../assets/lqip-png-url-forced.png?lqip')} />
        </div>
        <div>
          <p>PNG URL (auto) Color Palette</p>
          <Palette colors={require('../assets/lqip-png-url-forced.png?lqip-colors')} />
        </div>
      </div>
    );
  }
}
