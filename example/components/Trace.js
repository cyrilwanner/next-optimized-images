import { useState } from 'react';

export default ({ trace, src, traceRef, srcRef }) => {
  const [showImage, setShowImage] = useState(false);

  return (
    <div onClick={() => setShowImage(!showImage)}>
      <style jsx>{`
        div {
          position: relative;
        }

        img {
          cursor: pointer;
        }

        img:nth-child(2) {
          position absolute;
          top: 0;
          left: 0;
          opacity: 0;
          transition: opacity .5s;
        }
      `}</style>
      <img ref={traceRef} src={trace} />
      <img ref={srcRef} src={src} style={{opacity: showImage ? '1' : '0'}} />
    </div>
  );
};
