export default ({ original, optimized, actual, type, actualType }) => (
  <span>
    [original <b>{original}KB</b>, optimized <b>{optimized}KB</b>
    {actual ? <span>, actual <b style={{color: actual === optimized ? 'green' : 'red'}}>{actual}KB</b></span> : null}
    {type && actualType ? <span>, <b style={{ color: actualType === type ? 'green' : 'red' }}>{actualType.toUpperCase()}</b></span> : null}
    ]
  </span>
);
