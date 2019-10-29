import React from 'react';

// import './style.scss';

const NoEventsComponent = (props) => {
  return (
    <section className="background-light-blue" id="no-events">
      <div className="container container-fluid">
        <div className="col-md-12">
          <h2 className="weight-heavy">There are no events with your representatives right now &mdash; but you can still
                make your voice heard!</h2>
          <h3>
            <a href=" https://5calls.org" target="_blank">Call</a>, write, or email your Senators or Representative.
            Write a letter to the editor in your local newspaper.
            Join an
                <a href="https://indivisible.org/groups" target="_blank">Indivisible group</a> or other local activist
                organization to create change in your community.</h3>
          <h3>If you hear of town halls or other events with your member of Congress, don’t hesitate to
                <a className="hash-link" data-toggle="tab" href="#submit">submit them</a> to us so we can spread the word.
              </h3>
          <h3 className="weight-heavy">Show Up. Speak Out.</h3>
        </div>
      </div>
    </section>
  )
};

export default NoEventsComponent;