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
    ]).then(([
      urlAutoSize,
      urlForcedSize,
      inlineAutoSize,
      inlineForcedSize,
      originalSize,
      originalUrlSize,
      originalInlineSize,
    ]) => {
      this.setState({
        urlAutoSize,
        urlAutoType: getImageType(this.urlAutoRef.current),
        urlForcedSize,
        urlForcedType: getImageType(this.urlForcedRef.current),
        inlineAutoSize,
        inlineAutoType: getImageType(this.inlineAutoRef.current),
        inlineForcedSize,
        inlineForcedType: getImageType(this.inlineForcedRef.current),
        originalSize,
        originalType: getImageType(this.originalRef.current),
        originalUrlSize,
        originalUrlType: getImageType(this.originalUrlRef.current),
        originalInlineSize,
        originalInlineType: getImageType(this.originalInlineRef.current),
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
          <p>URL (auto) <ImageSize original={30.3} optimized={29.6} actual={this.state.urlAutoSize} type="url" actualType={this.state.urlAutoType} /></p>
          <img ref={this.urlAutoRef} src={require('../assets/gif-url-auto.gif')} />
        </div>
        <div>
          <p>URL (forced) <ImageSize original={6.3} optimized={5.1} actual={this.state.urlForcedSize} type="url" actualType={this.state.urlForcedType} /></p>
          <img ref={this.urlForcedRef} src={require('../assets/gif-url-forced.gif?url')} />
        </div>
        <div>
          <p>Inline (auto) <ImageSize original={8.1} optimized={6.5} actual={this.state.inlineAutoSize} type="inline" actualType={this.state.inlineAutoType} /></p>
          <img ref={this.inlineAutoRef} src={require('../assets/gif-inline-auto.gif')} />
        </div>
        <div>
          <p>Inline (forced) <ImageSize original={77.1} optimized={69} actual={this.state.inlineForcedSize} type="inline" actualType={this.state.inlineForcedType} /></p>
          <img ref={this.inlineForcedRef} src={require('../assets/gif-inline-forced.gif?inline')} />
        </div>
        <div>
          <p>Original <ImageSize original={331.6} optimized={331.6} actual={this.state.originalSize} type="url" actualType={this.state.originalType} /></p>
          <img ref={this.originalRef} src={require('../assets/gif-original.gif?original')} />
        </div>
        <div>
          <p>Original URL (forced) <ImageSize original={5.5} optimized={5.5} actual={this.state.originalUrlSize} type="url" actualType={this.state.originalUrlType} /></p>
          <img ref={this.originalUrlRef} src={require('../assets/gif-original-url-forced.gif?original&url')} />
        </div>
        <div>
          <p>Original Inline (forced) <ImageSize original={77.1} optimized={77.1} actual={this.state.originalInlineSize} type="inline" actualType={this.state.originalInlineType} /></p>
          <img ref={this.originalInlineRef} src={require('../assets/gif-original-inline-forced.gif?original&inline')} />
        </div>
      </div>
    );
  }
}
