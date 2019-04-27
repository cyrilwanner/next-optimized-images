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
          <p>URL (auto) <ImageSize original={453.6} optimized={368.7} actual={this.state.urlAutoSize} type="url" actualType={this.state.urlAutoType} /></p>
          <img ref={this.urlAutoRef} src={require('../assets/png-url-auto.png')} />
        </div>
        <div>
          <p>URL (forced) <ImageSize original={3.3} optimized={2} actual={this.state.urlForcedSize} type="url" actualType={this.state.urlForcedType} /></p>
          <img ref={this.urlForcedRef} src={require('../assets/png-url-forced.png?url')} />
        </div>
        <div>
          <p>Inline (auto) <ImageSize original={7.6} optimized={6.4} actual={this.state.inlineAutoSize} type="inline" actualType={this.state.inlineAutoType} /></p>
          <img ref={this.inlineAutoRef} src={require('../assets/png-inline-auto.png')} />
        </div>
        <div>
          <p>Inline (forced) <ImageSize original={62.7} optimized={57.3} actual={this.state.inlineForcedSize} type="inline" actualType={this.state.inlineForcedType} /></p>
          <img ref={this.inlineForcedRef} src={require('../assets/png-inline-forced.png?inline')} />
        </div>
        <div>
          <p>Original <ImageSize original={513.3} optimized={513.3} actual={this.state.originalSize} type="url" actualType={this.state.originalType} /></p>
          <img ref={this.originalRef} src={require('../assets/png-original.png?original')} />
        </div>
        <div>
          <p>Original URL (forced) <ImageSize original={3.3} optimized={3.3} actual={this.state.originalUrlSize} type="url" actualType={this.state.originalUrlType} /></p>
          <img ref={this.originalUrlRef} src={require('../assets/png-original-url-forced.png?original&url')} />
        </div>
        <div>
          <p>Original Inline (forced) <ImageSize original={62.7} optimized={62.7} actual={this.state.originalInlineSize} type="inline" actualType={this.state.originalInlineType} /></p>
          <img ref={this.originalInlineRef} src={require('../assets/png-original-inline-forced.png?original&inline')} />
        </div>
      </div>
    );
  }
}
