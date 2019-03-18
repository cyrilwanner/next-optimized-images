export default ({ colors }) => (
  <div className="palette">
    <style jsx>{`
      .palette {
        display: flex;
      }
      .palette > div {
        flex: 1;
        height: 50px;
      }
    `}</style>
    {
      colors.map((color) => (
        <div key={color.replace('#', '')} style={{ backgroundColor: color }} />
      ))
    }
  </div>
);
