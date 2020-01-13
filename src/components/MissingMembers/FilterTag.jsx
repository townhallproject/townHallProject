import React from 'react';
import classNames from 'classnames';

export default (props) => {
  if (!props.filter) {
    return null
  }
  return (
      <button
      onClick={() => props.handleClick(props.category)}
      className="btn-filter btn btn-secondary btn-xs"
      data-filter="" >{props.filter.split('.')[1]}<i class="fa fa-times" aria-hidden="true"></i>
    </button>
    )
}