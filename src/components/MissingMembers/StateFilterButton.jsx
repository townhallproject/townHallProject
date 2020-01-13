import React from 'react';
import classNames from 'classnames';

export default (buttonSettings) => {
  return (
      <div key={buttonSettings.category} className={classNames("btn-filter", "state-button", `background-color-${buttonSettings.count}`)} 
        data-filter={`.${buttonSettings.categoryID}`}>
      <a data-filter={`.${buttonSettings.categoryID}`}>{buttonSettings.category}</a>
  </div>)
}