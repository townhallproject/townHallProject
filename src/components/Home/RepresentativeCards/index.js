import React, { Component } from 'react';
import MoC from '../../../scripts/models/MemberOfCongress';
import { RepCard } from '../../../templates/representativeCard';
import TownHall from '../../../scripts/models/TownHall';

// import './style.scss';

class RepresentativeCards extends Component {
  constructor(props) {
    super(props)
    this.lookupReps = this.lookupReps.bind(this);
    this.state = {
      reps: []
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.zip !== this.props.zip) {
      this.lookupReps();
    }
    if (!this.props.zip) {
      this.setState({
        reps: []
      })
    }
  }

  lookupReps() {
    TownHall.lookupReps('zip', this.props.zip).then((reps) => {
      this.setState({
        reps
      })
    })
  }

  render() {
    const {
      reps
    } = this.state;
    return (
      <div id="representativeCards">
        <section className="container container-fluid">
          {
            reps.map((rep) => {
              if (!rep) { return null }
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