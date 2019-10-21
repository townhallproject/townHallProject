import React from 'react';
import Banner from '../Banner';

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
    {
      activeBanner && (
        <Banner />
      )
    }
      {children}
    </div>
  );
}

export default PageComponent;