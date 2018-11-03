import * as React from 'react';

export const renderText = (text: string) => {
  if (!text.includes('\n')) {
    return text;
  }
  return text.split('\n').map((value, index) => {
    return (
      <React.Fragment key={index}>
        <span>{value.trim()}</span>
        {index !== text.length - 1 && value.match(new RegExp('.+ {2,}')) && <br />}
      </React.Fragment>
    )
  });
}