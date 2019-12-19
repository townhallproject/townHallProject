/* eslint-disable no-undef */
import React, { Component } from 'react';
import { MENU_MAP, STATE_LEGISLATURES_MENU } from './menuConstants';
import {
  Button,
  Menu,
  Icon
} from 'antd';
import classNames from 'classnames';

const { SubMenu } = Menu;

import './style.less';

class Header extends Component {
  constructor(props) {
    super(props)
    this.handleMenuSelect = this.handleMenuSelect.bind(this);
    this.hasSubMenu = this.hasSubMenu.bind(this);
    this.closeMenu = this.closeMenu.bind(this);
    this.state = {
      activeKey: "",
    }
  }

  hasSubMenu(key) {
    const keyToCheck = key || this.state.activeKey;
    const subMenu = MENU_MAP.get(keyToCheck);
    return subMenu && subMenu.length;
  }

  closeMenu() {
    this.setState({activeKey: ''})
  }

  handleMenuSelect(refObj) {
    const { key } = refObj;
    if (this.hasSubMenu(key) && key !== this.state.activeKey) {
      this.setState({activeKey: key })
    } else {
      this.setState({activeKey: ''})
    }
  }

  renderDropdown() {
    const { activeKey } = this.state;
    const subMenu = MENU_MAP.get(activeKey);

    if (this.hasSubMenu()) {
      return subMenu.map((menuItem) => {
         if (menuItem.display === 'State Legislatures') {
           return (
             <SubMenu
               className="state-legislatures-menu fade-in"
               title={
                 <span className="state-legislatures-title">
                   {menuItem.display}
                 </span>
               }
             >
               {
                 STATE_LEGISLATURES_MENU.map((stateName) => {
                   const linkName = stateName.toLowerCase()
                   return (
                     <Menu.Item key={stateName}>
                       <a href={`/${linkName}`} style={{ textDecoration: 'none' }}>{stateName}</a>
                     </Menu.Item>
                   )
                 })
               }
             </SubMenu>
           )
         } 
        return (
          <Menu.Item className="fade-in" key={menuItem.display}>
            {menuItem.link ? <a 
            className="hash-link"
            onClick={this.closeMenu}
            data-toggle="tab"
            target={menuItem.external ? "_blank" : ""}
            href={menuItem.external ? menuItem.link : `#${menuItem.link}`}
          >{menuItem.display}</a> : menuItem.display}
          </Menu.Item>
        )
         
     })
    } 
  }

  render() {
    const arrowClasses = ['arrow', 'fade-in'];
    const { activeKey } = this.state;
    return (
      <div className="menu-container">
        <Menu
          className="main-nav-menu"
          mode="horizontal"
          style={{ lineHeight: '60px' }}
          onClick={this.handleMenuSelect}
        >
          <Menu.Item key="home">
            <a data-toggle="tab" href="#home" className={classNames("navbar-brand","hash-link","brand-icon")}>
              <img src="/Images/THP_logo_horizontal_simple.png" alt=""></img>
            </a>
          </Menu.Item>
          <Menu.Item key="submit-event">
            <a href={`#submit`} style={{ textDecoration: 'none' }} data-toggle="tab" className="hash-link">Submit an Event</a>
          </Menu.Item>
          <Menu.Item key="take-action">
            Take Action
            <div className={classNames(arrowClasses, {active : activeKey === 'take-action'})}></div>
          </Menu.Item>
          <Menu.Item key="our-projects">
            Our Projects
            <div className={classNames(arrowClasses, {active : activeKey === 'our-projects'})}></div>
          </Menu.Item>
          <Menu.Item key="learn-more">
            Learn More
            <div className={classNames(arrowClasses, {active : activeKey === 'learn-more'})}></div>
          </Menu.Item>
          {/* <Button 
            className="accessibility-report-btn"
            href="https://docs.google.com/document/u/1/d/e/2PACX-1vTWD9u5IF08YH6tt76Q_S6dTwQYmm7g_2jQbZ4JaXJpEBJV0srbUfS_MseuKudHeo6YDLdyk-x1A58Z/pub"
            target="_blank"
            type="primary"
          >
            Accessibility Report
            <Icon type="file-done" />
          </Button> */}
          <Menu.Item key="donate" className="donate-btn">
            <Icon type="mail" />
            Donate
          </Menu.Item>
        </Menu>
        <Menu className={`submenu-${this.hasSubMenu() ? 'active' : 'hidden'}`} mode="horizontal">
          {this.renderDropdown()}
        </Menu>
      </div>
    )
  }
}

export default Header;
