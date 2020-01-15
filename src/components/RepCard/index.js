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
        actions={[]}
      >
      <Meta
        avatar={<Avatar src={`https://www.govtrack.us/static/legislator-photos/${rep.govtrack_id}-100px.jpeg`} />}
        title={rep.displayName}
        description={rep.title}
      />
      <div className="social-icons">
        { rep.url &&
          <a href={rep.url} target="_blank">
            <Icon type="select" style={{ color: '#607d8b'}} />
          </a>
        }
        { rep.facebook_canon &&
          <a href={`https://www.facebook.com/${rep.facebook_canon}`} target="_blank">
            <Icon type="facebook" theme="filled" style={{ color: '#3b5998'}} />
          </a>
        }
        { rep.twitter_canon &&
          <a href={`https://twitter.com/${rep.twitter_canon}`} target="_blank">
            <Icon type="twitter" style={{ color: '#00acee'}} />
          </a>
        }
      </div>
      {
        rep.missingMember &&
        <div className="missing-member">Missing</div>
      }
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