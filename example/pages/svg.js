import ImageSize from '../components/ImageSize';
import { getImageSize } from '../helpers/getImageSize';
import { getImageType } from '../helpers/getImageType';
import Sprite from '../assets/svg-sprite.svg?sprite';
import SpriteSmall from '../assets/svg-sprite-small.svg?sprite';

export default class extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {};

    this.urlAutoRef = React.createRef();
    this.urlForcedRef = React.createRef();
    this.inlineAutoRef = React.createRef();
    this.inlineForcedRef = React.createRef();
    this.includeRef = React.createRef();
    this.originalRef = React.createRef();
    this.originalUrlRef = React.createRef();
    this.originalInlineRef = React.createRef();
    this.originalIncludeRef = React.createRef();
  }

  componentDidMount() {
    Promise.all([
      getImageSize(this.urlAutoRef.current),
      getImageSize(this.urlForcedRef.current, 3),
      getImageSize(this.inlineAutoRef.current, 3),
      getImageSize(this.inlineForcedRef.current),
      getImageSize(this.includeRef.current),
      getImageSize(this.originalRef.current),
      getImageSize(this.originalUrlRef.current, 3),
      getImageSize(this.originalInlineRef.current),
      getImageSize(this.originalIncludeRef.current),
    ]).then(([
      urlAutoSize,
      urlForcedSize,
      inlineAutoSize,
      inlineForcedSize,
      includeSize,
      originalSize,
      originalUrlSize,
      originalInlineSize,
      originalIncludeSize,
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
        includeSize,
        includeType: getImageType(this.includeRef.current),
        originalSize,
        originalType: getImageType(this.originalRef.current),
        originalUrlSize,
        originalUrlType: getImageType(this.originalUrlRef.current),
        originalInlineSize,
        originalInlineType: getImageType(this.originalInlineRef.current),
        originalIncludeSize,
        originalIncludeType: getImageType(this.originalIncludeRef.current),
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
          <p>URL (auto) <ImageSize original={18.1} optimized={16.3} actual={this.state.urlAutoSize} type="url" actualType={this.state.urlAutoType} /></p>
          <img ref={this.urlAutoRef} src={require('../assets/svg-url-auto.svg')} />
        </div>
        <div>
          <p>URL (forced) <ImageSize original={0.745} optimized={0.71} actual={this.state.urlForcedSize} type="url" actualType={this.state.urlForcedType} /></p>
          <img ref={this.urlForcedRef} src={require('../assets/svg-url-forced.svg?url')} />
        </div>
        <div>
          <p>Inline (auto) <ImageSize original={0.639} optimized={0.584} actual={this.state.inlineAutoSize} type="inline" actualType={this.state.inlineAutoType} /></p>
          <img ref={this.inlineAutoRef} src={require('../assets/svg-inline-auto.svg')} />
        </div>
        <div>
          <p>Inline (forced) <ImageSize original={17.3} optimized={5.1} actual={this.state.inlineForcedSize} type="inline" actualType={this.state.inlineForcedType} /></p>
          <img ref={this.inlineForcedRef} src={require('../assets/svg-inline-forced.svg?inline')} />
        </div>
        <div>
          <p>Included <ImageSize original={68.7} optimized={34} actual={this.state.includeSize} type="included" actualType={this.state.includeType} /></p>
          <div ref={this.includeRef} dangerouslySetInnerHTML={{ __html: require('../assets/svg-include.svg?include') }} />
        </div>
        <div>
          <p>Sprite</p>
          <Sprite />
        </div>
        <div>
          <p>Sprite Small</p>
          <SpriteSmall />
        </div>
        <div>
          <p>Original <ImageSize original={155.2} optimized={155.2} actual={this.state.originalSize} type="url" actualType={this.state.originalType} /></p>
          <img ref={this.originalRef} src={require('../assets/svg-original.svg?original')} />
        </div>
        <div>
          <p>Original URL (forced) <ImageSize original={0.745} optimized={0.745} actual={this.state.originalUrlSize} type="url" actualType={this.state.originalUrlType} /></p>
          <img ref={this.originalUrlRef} src={require('../assets/svg-original-url-forced.svg?original&url')} />
        </div>
        <div>
          <p>Original Inline (forced) <ImageSize original={17.3} optimized={17.3} actual={this.state.originalInlineSize} type="inline" actualType={this.state.originalInlineType} /></p>
          <img ref={this.originalInlineRef} src={require('../assets/svg-original-inline-forced.svg?original&inline')} />
        </div>
        <div>
          <p>Original Included <ImageSize original={68.7} optimized={68.7} actual={this.state.originalIncludeSize} type="included" actualType={this.state.originalIncludeType} /></p>
          <div ref={this.originalIncludeRef} dangerouslySetInnerHTML={{ __html: require('../assets/svg-original-include.svg?original&include') }} />
        </div>
      </div>
    );
  }
}
