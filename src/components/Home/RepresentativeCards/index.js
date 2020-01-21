import React, { Component } from 'react';
import classNames from 'classnames';
import {
  isEqual
} from 'lodash';

import MoC from '../../../scripts/models/MemberOfCongress';
import RepCard from '../../RepCard';
import TownHall from '../../../scripts/models/TownHall';

// import './style.scss';

class RepresentativeCards extends Component {
  defaultProps = {
    currentDistrict: {
      federal : {}
    }
  }
  
  constructor(props) {
    super(props)
    this.lookupReps = this.lookupReps.bind(this);
    this.setReps = this.setReps.bind(this);
    this.state = {
      reps: []
    }
  }

  componentDidUpdate(prevProps) {
    const { currentDistrict } = this.props; 

    if (!currentDistrict && !this.state.reps.length) {
      return;
    }

    if (this.state.reps.length && !currentDistrict) {
      return this.setReps([])
    }

    const federalSelections = currentDistrict.federal;
    const prevSelections = prevProps.currentDistrict ? prevProps.currentDistrict.federal : null;

    if (federalSelections && !prevSelections) {
      MoC.getMembersByDistrict(currentDistrict.federal.state, currentDistrict.federal.districts)
        .then((reps) => {

          this.setReps(reps)
        })

    } else if (currentDistrict.federal && 
      prevSelections &&
      this.isNewState(prevSelections.state) &&
      this.isNewDistrict(prevSelections.districts)
      ) {
      MoC.getMembersByDistrict(currentDistrict.federal.state, currentDistrict.federal.districts)
       .then((reps) => {
         this.setReps(reps)
       })
    }

  }

  isNewState(prevSelectedState) {
    const {
      currentDistrict
    } = this.props;
    return currentDistrict.federal.state && currentDistrict.federal.state !== prevSelectedState;
  }

  isNewDistrict(prevDistricts) {
        const {
          currentDistrict
        } = this.props;
        return currentDistrict.federal.districts && !isEqual(currentDistrict.federal.districts, prevDistricts);
  }

  setReps(reps) {
    this.setState({
      reps,
    })
  }

  lookupReps() {
    TownHall.lookupReps('zip', this.props.currentZip).then((reps) => {
      this.setState({
        reps
      })
    })
  }

  render() {
    const {
      reps,
    } = this.state;

    return (
      <div id="representativeCards">
          {
            reps.map((rep) => {
              if (!rep) { return null }
              const newRep = new MoC(rep);
              newRep.format();
              return (
                <RepCard key={newRep.id} rep={newRep} />
              );
            })
          }
      </div>
    );
  }
}

export default RepresentativeCards;