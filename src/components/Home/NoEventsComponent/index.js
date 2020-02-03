import React from 'react';
import { Typography, Divider } from 'antd';
const { Title, Paragraph, Text } = Typography;

import './style.less';

const NoEventsComponent = (props) => {
  return (
    <section id="no-events" style={{ backgroundColor: '#f0f2f5' }}>
      <div className="container container-fluid">
        <div className="col-md-12">
          <Typography>
            <Title level={3} className="no-event-title">
              There are no events with your representatives right now &mdash; but you can still make your voice heard!
            </Title>
            <Divider style={{ margin: 'none' }} />
            <Title level={4} className="no-event-text">
              <a href=" https://5calls.org" target="_blank">Call</a>, write, or email your Senators or Representative.
              Write a letter to the editor in your local newspaper. Join an <a href="https://indivisible.org/groups" target="_blank">Indivisible group</a> or other local activist
              organization to create change in your community.
            </Title>

            <Title level={4} className="no-event-text">
              If you hear of town halls or other events with your member of Congress, don’t hesitate to
              <a className="hash-link" data-toggle="tab" href="#submit"> submit them</a> to us so we can spread the word.
            </Title>

            <Title level={3} className="show-up-speak-out">
              Show Up. Speak Out.
            </Title>
          </Typography>
        </div>
      </div>
    </section>
  )
};

export default NoEventsComponent;