import React from 'react';
import EventCard from '../../EventCard';

export default class EventSidebar extends React.Component {

    render() {
        const { eventsToDisplay } = this.props;
        return (
                    <section className="results multipleResults">
                            {eventsToDisplay.map(event => 
                                (<EventCard 
                                    townhall={event}
                                />)
                            )}


                    </section>
        )
    }
}