import React from 'react'
import { Menu, Select, Checkbox } from 'antd'
import { searchFilters } from './searchConstants'
import states from '../../../data/states'

const sortOn = {
  'By Date': 'dateObj',
  'By Name': 'displayName',
  'By State': 'stateName'
}

const SearchHeader = (props) => {

  const dropdownOptions = (optionsArray) => {
    return optionsArray.map(option => <Select.Option value={option}>{option}</Select.Option>)
  }

  const stateOptions = () => {
    return states.map(state => <Select.Option key={state.Name}>{state.Name} </Select.Option>)
  }

  const eventOptions = () => {
    return searchFilters.meetingType.map(event => <Select.Option key={event}>{event} </Select.Option>)
  }

  return (
    <Menu>
      <Menu.Item>
        <Checkbox.Group
          options={searchFilters.party}
          defaultValue={searchFilters.party}
          onChange={party => props.handleUpdateSearchFilters(party, 'party')}
        />
      </Menu.Item>
      <Menu.Item>
        <Select
          mode="multiple"
          style={{ width: '100%' }}
          placeholder="Select State(s)"
          onChange={state => props.handleUpdateSearchFilters(state, 'stateName')}
        >
          {stateOptions()}
        </Select>
      </Menu.Item>
      <Menu.Item>
        <Select 
          mode="multiple"
          style={{ width: '100%' }}
          placeholder="Select Event Type(s)"
          onChange={event => props.handleUpdateSearchFilters(event, 'meetingType')}
        >
          {eventOptions()}
        </Select>
      </Menu.Item>
      <Menu.Item>
        <Select defaultValue="By Date" onChange={(e) => props.handleUpdateSortOn(sortOn[e])} style={{ width: 220 }}>
          {dropdownOptions(searchFilters.sortOn)}
        </Select> 
      </Menu.Item>
    </Menu>
  )
}

export default SearchHeader
