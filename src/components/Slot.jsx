import React from 'react';

export function Slot({content = '', msg = null, bg = null, className}) {

  const msgFormatted = msg?.split('\n').map((sentence, index, {length}) => {
    return (
      <React.Fragment key={index}>
        {sentence}
        {index !== length - 1 ? <br /> : null}
      </React.Fragment>
    );
  });
  
  return (
    <td style={bg ? { backgroundColor: bg} : null} className={`mem-sol-slot ${className}`}>
      {content}
      {msg ? <span className="hidden-msg">{msgFormatted}</span> : null}
    </td>
  );
}