import React, { Component } from "react";
import { find } from "lodash";
import { Button, Menu, Icon } from "antd";
import classNames from "classnames";
import {
  MENU_MAP,
  STATE_LEGISLATURES_MENU,
  TOP_LEVEL_MENU,
} from "./menuConstants";

const { SubMenu } = Menu;

import "./style.less";
import ImageModal from "./Modal";

class Header extends Component {
  constructor(props) {
    super(props);
    this.handleMenuSelect = this.handleMenuSelect.bind(this);
    this.hasSubMenu = this.hasSubMenu.bind(this);
    this.closeMenu = this.closeMenu.bind(this);
    this.state = {
      activeKey: "",
    };
  }

  componentDidUpdate(prevProps) {
    const { hash } = this.props;
    if (hash && hash !== prevProps.hash) {
      MENU_MAP.forEach((subMenu, key) => {
        const menu = find(subMenu, {
          link: hash,
        });
        if (menu) {
          this.setState({ activeKey: key });
        }
      });
    }
  }

  hasSubMenu(key) {
    const keyToCheck = key || this.state.activeKey;
    const subMenu = MENU_MAP.get(keyToCheck);
    return subMenu && subMenu.length;
  }

  closeMenu() {
    this.setState({ activeKey: "" });
  }

  handleMenuSelect(refObj) {
    const { key } = refObj;
    if (this.hasSubMenu(key) && key !== this.state.activeKey) {
      this.setState({ activeKey: key });
    } else {
      this.setState({ activeKey: "" });
    }
  }

  renderLink(menuItem) {
    if (!menuItem.link) {
      return menuItem.display;
    }
    if (menuItem.external) {
      return (
        <a
          className={classNames(["menu-link"])}
          target="_blank"
          href={menuItem.link}
        >
          {menuItem.display}
        </a>
      );
    }
    return (
      <a
        className={classNames(["menu-link", "hash-link"])}
        data-toggle="tab"
        href={`#${menuItem.link}`}
      >
        {menuItem.display}
      </a>
    );
  }

  renderDropdown = () => {
    const { activeKey } = this.state;
    const { setLocation, hash } = this.props;
    const subMenu = MENU_MAP.get(activeKey);
    if (this.hasSubMenu()) {
      return subMenu.map((menuItem) => {
        if (menuItem.display === "State Legislatures") {
          return (
            <SubMenu
              className="state-legislatures-menu fade-in"
              key={menuItem.display}
              title={
                <span className="state-legislatures-title">
                  {menuItem.display}
                </span>
              }
            >
              {STATE_LEGISLATURES_MENU.map((stateName) => {
                const linkName = stateName.toLowerCase().replace(" ", "-");
                return (
                  <Menu.Item
                    key={stateName}
                    onClick={() => setLocation(stateName.toLowerCase())}
                  >
                    <a href={`/${linkName}`} style={{ textDecoration: "none" }}>
                      {stateName}
                    </a>
                  </Menu.Item>
                );
              })}
            </SubMenu>
          );
        }
        if (menuItem.type === "modal") {
          return (
            <ImageModal
              hash={hash}
              menuItem={menuItem}
              setHash={this.props.setHash}
              key={menuItem.display}
            />
          );
        }
        return (
          <Menu.Item
            className={classNames([
              "fade-in",
              {
                "submenu-item-selected":
                  hash === menuItem.link && !menuItem.external,
              },
            ])}
            key={menuItem.display}
            onClick={() =>
              !menuItem.external ? this.props.setHash(menuItem.link) : undefined
            }
          >
            {this.renderLink(menuItem)}
          </Menu.Item>
        );
      });
    }
  }

  render() {
    const arrowClasses = ["arrow", "fade-in"];
    const { activeKey } = this.state;
    const { setLocation } = this.props;
    return (
      <div className="menu-container">
        <Menu
          className="main-nav-menu"
          mode="horizontal"
          overflowedIndicator={<Button icon="menu" type="primary" />}
          style={{ lineHeight: "60px" }}
          onClick={this.handleMenuSelect}
        >
          <Menu.Item key="home" onClick={() => setLocation("")}>
            <a
              data-toggle="tab"
              href="#home"
              className={classNames("navbar-brand", "hash-link", "brand-icon")}
            >
              <img src="/Images/THP_logo_horizontal_simple.png" alt=""></img>
            </a>
          </Menu.Item>
          {TOP_LEVEL_MENU.map((menuItem) => {
            if (menuItem.hash) {
              return (
                <Menu.Item key={menuItem.value}>
                  <a
                    href={`#${menuItem.hash}`}
                    style={{ textDecoration: "none" }}
                    data-toggle="tab"
                    className="hash-link"
                  >
                    {menuItem.label}
                  </a>
                </Menu.Item>
              );
            }
            if (menuItem.href) {
              return (
                <div key="donate" className="donate-btn">
                  <Button
                    type="danger"
                    shape="round"
                    size="large"
                    href={menuItem.href}
                    target="_blank"
                  >
                    {menuItem.label}
                  </Button>
                </div>
              );
            }
            return (
              <Menu.Item key={menuItem.value}>
                {menuItem.label}
                <div
                  className={classNames(arrowClasses, {
                    active: activeKey === menuItem.value,
                  })}
                ></div>
              </Menu.Item>
            );
          })}
        </Menu>
        <Menu
          className={`submenu-${this.hasSubMenu() ? "active" : "hidden"}`}
          mode="horizontal"
          overflowedIndicator={
            <Button type="ghost">
              More
              <Icon type="down" />
            </Button>
          }
        >
          {this.renderDropdown()}
        </Menu>
      </div>
    );
  }
}

export default Header;
