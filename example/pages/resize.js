import ImageSize from '../components/ImageSize';
import { getImageSize } from '../helpers/getImageSize';
import { getImageType } from '../helpers/getImageType';

export default class extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {};

    this.jpegResize1Ref = React.createRef();
    this.jpegResize2Ref = React.createRef();
    this.pngResize1Ref = React.createRef();
    this.pngResize2Ref = React.createRef();
  }

  componentDidMount() {
    Promise.all([
      getImageSize(this.jpegResize1Ref.current),
      getImageSize(this.jpegResize2Ref.current),
      getImageSize(this.pngResize1Ref.current),
      getImageSize(this.pngResize2Ref.current),
    ]).then(([
      jpegResize1Size,
      jpegResize2Size,
      pngResize1Size,
      pngResize2Size,
    ]) => {
      this.setState({
        jpegResize1Size,
        jpegResize1Type: getImageType(this.jpegResize1Ref.current),
        jpegResize2Size,
        jpegResize2Type: getImageType(this.jpegResize2Ref.current),
        pngResize1Size,
        pngResize1Type: getImageType(this.pngResize1Ref.current),
        pngResize2Size,
        pngResize2Type: getImageType(this.pngResize2Ref.current),
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
          <p>JPEG Resize (x100) <ImageSize original={2.9} optimized={2.9} actual={this.state.jpegResize1Size} type="url" actualType={this.state.jpegResize1Type} /></p>
          <img ref={this.jpegResize1Ref} src={require('../assets/resize-jpeg.jpg?resize&sizes[]=100&sizes[]=200').images[0].path} />
        </div>
        <div>
          <p>JPEG Resize (x200) <ImageSize original={6.9} optimized={6.9} actual={this.state.jpegResize2Size} type="url" actualType={this.state.jpegResize2Type} /></p>
          <img ref={this.jpegResize2Ref} src={require('../assets/resize-jpeg.jpg?resize&sizes[]=100&sizes[]=200').images[1].path} />
        </div>
        <div>
          <p>PNG Resize (x100) <ImageSize original={18.1} optimized={18.1} actual={this.state.pngResize1Size} type="url" actualType={this.state.pngResize1Type} /></p>
          <img ref={this.pngResize1Ref} src={require('../assets/resize-png.png?size=100').src} />
        </div>
        <div>
          <p>PNG Resize (x200) <ImageSize original={50.2} optimized={50.2} actual={this.state.pngResize2Size} type="url" actualType={this.state.pngResize2Type} /></p>
          <img ref={this.pngResize2Ref} src={require('../assets/resize-png.png?sizes[]=100&sizes[]=200').images[1].path} />
        </div>
        <div>
          <p>SRCSET</p>
          <img src={require('../assets/resize-srcset.jpg?resize&sizes[]=300&sizes[]=600').src} srcSet={require('../assets/resize-srcset.jpg?resize&sizes[]=300&sizes[]=600').srcSet} />
        </div>
        <div>
          <p>Sizes from config</p>
          <img src={require('../assets/resize-config.jpg?resize').src} srcSet={require('../assets/resize-config.jpg?resize').srcSet} />
        </div>
      </div>
    );
  }
}
