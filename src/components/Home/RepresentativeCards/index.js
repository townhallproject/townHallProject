import React, { Component } from 'react';
import classNames from 'classnames';
import MoC from '../../../scripts/models/MemberOfCongress';
import RepCard from '../../RepCard';
import TownHall from '../../../scripts/models/TownHall';
import { Typography, Divider } from 'antd';

const { Title, Text } = Typography;

import './style.less';

class RepresentativeCards extends Component {
  constructor(props) {
    super(props)
    this.lookupReps = this.lookupReps.bind(this);
    this.state = {
      reps: []
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.currentZip !== this.props.currentZip && this.props.currentZip !== '') {
      this.lookupReps();
    }

    if(this.state.reps.length && !this.props.currentZip && !this.props.currentDistrict) {
      this.setState({
        reps: []
      })
    }
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
      reps
    } = this.state;
    return (
      <div className="representative-section">
        {
          reps.length > 0 &&
            <Title level={2} className="your-rep-title">Your Representatives</Title>
        }
          <div id="representative-cards">
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
          {
            reps.length > 3 && 
            <Text className="multiple-district-message">
              Your zip code encompasses more than one district.
              <Text strong><a href="http://www.house.gov/representatives/find/">Learn More</a></Text>
            </Text>
          }
          {
          reps.length > 0 &&
            <Divider />
          }
      </div>
    );
  }
}

export default RepresentativeCards;