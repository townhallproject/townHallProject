import React from 'react'
import { Select, Checkbox, Row, Col, Radio, Divider } from 'antd'
import { searchFilters, defaultSearchFilters } from './eventsConstants'
import states from '../../../data/states'

const sortOn = {
  'Date': 'dateObj',
  'Name': 'displayName',
  'State': 'stateName'
}

const EventsTableHeader = (props) => {

  const radioOptions = (optionsArray) => {
    return optionsArray.map(option => <Radio.Button key={option} value={option}>{option}</Radio.Button>)
  }

  const stateOptions = () => {
    return states.map(state => <Select.Option key={state.Name}>{state.Name}</Select.Option>)
  }

  const eventOptions = () => {
    return searchFilters.meetingType.map(event => <Select.Option key={event.type}>{event.type}</Select.Option>)
  }

  const eventDescriptions = () => {
    return searchFilters.meetingType.map(event => {
      if (event.description) {
        return (
          <div key={event.type}>
            <span className="text-secondary">{event.type} </span>
            <span> - {event.description}</span>
          </div>
        )
      }
    })
  }

  return (
    <div>
      <h2 className="text-primary table-title text-center">
        Upcoming Events
      </h2>
      {eventDescriptions()}
      <Divider />
      <Row 
        type="flex" 
        justify="space-between" 
        align="middle"
        className="header-item"
        gutter={[,10]}
      >
        <Col>
          <label className='sort-lable'>Party Affiliation:</label>
          <Checkbox.Group
            options={searchFilters.party}
            defaultValue={defaultSearchFilters.party}
            onChange={party => props.updateSearchFilters(party, 'party')}
          />
        </Col>
        <Col>
          <label className='sort-lable'>Sort By:</label>
          <Radio.Group 
            defaultValue={defaultSearchFilters.sortOn} 
            onChange={(e) => props.updateSortOn(sortOn[e.target.value])}
          > 
            {radioOptions(searchFilters.sortOn)}
          </Radio.Group>
        </Col>
      </Row>
      <Select
        className="header-item"
        mode="multiple"
        style={{ width: '100%' }}
        placeholder="Select State(s)"
        onChange={state => props.updateSearchFilters(state, 'stateName')}
      >
        {stateOptions()}
      </Select>
      <Select
        className="header-item"
        mode="multiple"
        style={{ width: '100%' }}
        placeholder="Select Event Type(s)"
        defaultValue={defaultSearchFilters.meetingType}
        onChange={event => props.updateSearchFilters(event, 'meetingType')}
      >
        {eventOptions()}
      </Select>
    </div>
  )
}

export default EventsTableHeader
