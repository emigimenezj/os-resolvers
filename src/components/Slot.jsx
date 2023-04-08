import React from 'react';

export function Slot({content = '', msg = null, bg = null}) {

  const msgFormatted = msg?.split('\n').map((sentence, index, {length}) => {
    return (
      <React.Fragment key={index}>
        {sentence}
        {index !== length - 1 ? <br /> : null}
      </React.Fragment>
    );
  });
  
  return (
    <td style={bg ? { backgroundColor: bg} : null}>
      {content}
      {msg ? <span>{msgFormatted}</span> : null}
    </td>
  );
}