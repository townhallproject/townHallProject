import React from 'react';
import EventCard from '../../EventCard';
import './style.less';

export default class EventSidebar extends React.Component {

  render() {
    const { eventsToDisplay } = this.props;
    return (
      <section className="results multipleResults">
        {eventsToDisplay.map(event =>
          (<EventCard
            key={event.eventId}
            townhall={event}
          />)
        )}


      </section>
    )
  }
}