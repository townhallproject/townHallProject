/* eslint-disable no-undef */
import React, { Component } from 'react';
import { MENU_MAP } from './menuConstants';
import {
  Button,
  Menu,
  Icon
} from 'antd';

import './style.less';

class Header extends Component {
  constructor(props) {
    super(props)
    this.handleMenuSelect = this.handleMenuSelect.bind(this);
    this.state = {
      submenu: [],
      submenuClass: 'hidden'
    }
  }
  handleMenuSelect(refObj) {
    const { key } = refObj;
    this.renderDropdown(MENU_MAP.get(key))
  }
  renderDropdown(submenu) {
    if (subment && submenu.length) {
      this.setState({
        submenu,
        submenuClass: 'active'
      })
    } else {
      this.setState({
        submenu: [],
        submenuClass: 'hidden'
      })
    }
  }
  render() {
    return (
      <div className="menu-container">
        <Menu
          className="main-nav-menu"
          mode="horizontal"
          style={{ lineHeight: '60px' }}
          onClick={this.handleMenuSelect}
        >
          <Menu.Item key="home">
            <a data-toggle="tab" href="#home" className="navbar-brand hash-link brand-icon">
              <img src="/Images/THP_logo_horizontal_simple.png" alt=""></img>
            </a>
          </Menu.Item>
          <Menu.Item key="submit-event">
            Submit an Event
          </Menu.Item>
          <Menu.Item key="take-action">
            Share Your Experience
            <div className={`arrow fade-in`}></div>
          </Menu.Item>
          <Menu.Item key="our-projects">
            Learn about Congress
            <div className={`arrow fade-in`}></div>
          </Menu.Item>
          <Menu.Item key="learn-more">
            In the News
            <div className={`arrow fade-in`}></div>
          </Menu.Item>
          <Button 
            className="current-event-btn"
            href="https://docs.google.com/document/u/1/d/e/2PACX-1vTWD9u5IF08YH6tt76Q_S6dTwQYmm7g_2jQbZ4JaXJpEBJV0srbUfS_MseuKudHeo6YDLdyk-x1A58Z/pub"
            target="_blank"
            type="danger"
          >
            Accessibility Report
            <Icon type="file-done" />
          </Button>
          <Menu.Item key="donate" className="donate-btn">
            <Icon type="mail" />
            Donate
          </Menu.Item>
        </Menu>
        <Menu className={`submenu-${this.state.submenuClass}`} mode="horizontal">
          {
            this.state.submenu &&
            this.state.submenu.map((menuName) => {
              const menuClass = menuName.toLowerCase().split(" ").join("-");
              return (
                <Menu.Item className="fade-in" key={menuClass}>
                  {menuName}
                </Menu.Item>
              )
            })
          }
        </Menu>
      </div>
    )
  }
}

export default Header;
