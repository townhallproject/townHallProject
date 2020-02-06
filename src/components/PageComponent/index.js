  
import React from 'react';

const PageComponent = (props) => {
  const {
    id,
    active,
    children,
    activeBanner
  } = props;
  const activeClass = active ? "active" : "";
  return (
    <div role="tabpanel" className={["tab-pane", "page", activeClass].join(" ")} id={id}>
      {children}
    </div>
  );
}

export default PageComponent;