import React, { Component } from 'react';
import classNames from 'classnames';
import {
  Avatar,
  Card,
  Icon
} from 'antd';
const { Meta } = Card;

import './style.less';

class RepCard extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const {
      rep
    } = this.props;
    return (
      <Card
        bordered={false}
        style={{ width: 325 }}
        title={rep.party}
        className={classNames("rep-card", rep.party)}
        actions={[
          <Icon type="setting" key="setting" />,
          <Icon type="edit" key="edit" />,
          <Icon type="ellipsis" key="ellipsis" />,
        ]}
      >
      <Meta
        avatar={<Avatar src={`https://www.govtrack.us/static/legislator-photos/${rep.govtrack_id}-100px.jpeg`} />}
        title={rep.displayName}
        description={rep.title}
      />
      <div className="rep-card-content">
        <p>Date of Last Town Hall: </p>
        <p>Local Office Phone: </p>
        <p>DC Office Phone: {rep.phone}</p>
        <br />
        <p>Terms Ends:  {rep.next_election}</p>
      </div>
      </Card>
    )
  }
}

export default RepCard;