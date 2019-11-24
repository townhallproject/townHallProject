import React, { Component } from 'react';
import MoC from '../models/MemberOfCongress';
import RepCard from '../../templates/representativeCard.jsx'

// import './style.scss';

class RepresentativeCards extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    const {
      reps
    } = this.props;
    return (
      <div id="representativeCards">
        <section className="container container-fluid">
          {
            reps.map((rep) => {
              const newRep = new MoC(rep);
              newRep.format();
              return (
                <RepCard rep={newRep} />
              );
            })
          }
        </section>
      </div>
    );
  }
}

export default RepresentativeCards;