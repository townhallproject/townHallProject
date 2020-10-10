import React, { Component } from 'react';
import moment from 'moment';
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
        actions={rep.next_election ? [<p>Next election: {moment(rep.next_election).format('YYYY')}</p>] : []}
      >
      <Meta
        avatar={<Avatar src={`https://www.govtrack.us/static/legislator-photos/${rep.govtrack_id}-100px.jpeg`} />}
        title={rep.displayName}
        description={rep.title.split(',')[0]}
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
        rep.missing_member &&
        <div className="missing-member">Missing</div>
      }
      <div className="rep-card-content">
        <p><span className='label'>DC office phone: </span>{rep.phone}</p>
        {rep.address && <p><span className='label'>Office address: </span>{rep.address}</p>}
        {/* TODO: add date of last town hall & local phone # */}
        {/* <p>Date of Last Town Hall: </p> */}
        {/* <p>Local Office Phone: </p> */}
        {
          rep.fax &&
          <p><span className='label'>Fax: </span>{rep.fax}</p>
        }
      </div>
      
      </Card>
    )
  }
}

export default RepCard;