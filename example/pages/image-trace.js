import ImageSize from '../components/ImageSize';
import { getImageSize } from '../helpers/getImageSize';
import { getImageType } from '../helpers/getImageType';
import Trace from '../components/Trace';

export default class extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {};

    this.normalTrace = React.createRef();
    this.normalImage = React.createRef();
    this.originalTrace = React.createRef();
    this.originalImage = React.createRef();
  }

  componentDidMount() {
    Promise.all([
      getImageSize(this.normalTrace.current),
      getImageSize(this.normalImage.current),
      getImageSize(this.originalTrace.current),
      getImageSize(this.originalImage.current),
    ]).then(([
      normalTraceSize,
      normalImageSize,
      originalTraceSize,
      originalImageSize,
    ]) => {
      this.setState({
        normalTraceSize,
        normalTraceType: getImageType(this.normalTrace.current),
        normalImageSize,
        normalImageType: getImageType(this.normalImage.current),
        originalTraceSize,
        originalTraceType: getImageType(this.originalTrace.current),
        originalImageSize,
        originalImageType: getImageType(this.originalImage.current),
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
        <p>
          Click on the image to toggle the original one
        </p>
        <div>
          <p>
            Normal<br />
            Trace: <ImageSize original={7.9} optimized={7.9} actual={this.state.normalTraceSize} type="inline" actualType={this.state.normalTraceType} /><br />
            Original: <ImageSize original={106.9} optimized={23.3} actual={this.state.normalImageSize} type="url" actualType={this.state.normalImageType} />
          </p>
          <Trace
            traceRef={this.normalTrace}
            srcRef={this.normalImage}
            {...require('../assets/image-trace.jpg?trace')}
          />
        </div>
        <div>
          <p>
            Original<br />
            Trace: <ImageSize original={5.3} optimized={5.3} actual={this.state.originalTraceSize} type="inline" actualType={this.state.originalTraceType} /><br />
            Original: <ImageSize original={166} optimized={166} actual={this.state.originalImageSize} type="url" actualType={this.state.originalImageType} />
          </p>
          <Trace
            traceRef={this.originalTrace}
            srcRef={this.originalImage}
            {...require('../assets/image-trace-original.png?trace&original')}
          />
        </div>
      </div>
    );
  }
}
