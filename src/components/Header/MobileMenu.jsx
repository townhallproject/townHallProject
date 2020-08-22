import React from 'react';
import { Menu, Spin, Button } from "antd";
import classNames from "classnames";
import { find } from "lodash";

import ImageModal from "./Modal";

import {
  MENU_MAP,
  TOP_LEVEL_MENU,
  MISSING_MEMBER_LINK,
  STATE_LEGISLATURES_MENU,
} from "./menuConstants";
const { SubMenu } = Menu;


const data = TOP_LEVEL_MENU.map((menuItem) => {
  const subMenu = MENU_MAP.get(menuItem.value);
  if (subMenu) {
    return {
      ...menuItem,
      children: subMenu.map((obj) => ({
        ...obj,
        label: obj.display,
        value: obj.link,
      })),
    };
  }
  return subMenu
});

const tabs = TOP_LEVEL_MENU.map((tabItem) => {
  return {
    title: tabItem.label,
    key: tabItem.value
  }
});
// MENU_MAP.forEach((subMenu, key) => {
//   data.push({
//     value: key,
//     label: key,
//     children: subMenu.length ? subMenu.map((obj) => ({...obj, label: obj.display, value: obj.link})) : null
//   })
// })
class MobileMenu extends React.Component {
  constructor(...args) {
    super(...args);
    this.state = {
      initData: "",
      show: false,
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

  handleClick = (e) => {
    // e.preventDefault(); // Fix event propagation on Android
    this.setState({
      show: !this.state.show,
    });
    // mock for async data loading
    if (!this.state.initData) {
      setTimeout(() => {
        this.setState({
          initData: data,
        });
      }, 500);
    }
  };

  onMaskClick = () => {
    this.setState({
      show: false,
    });
  };

  renderLink = (menuItem) => {
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
        onClick={() => (location.hash = `#${menuItem.link}`)}
      >
        {menuItem.display}
      </a>
    );
  };

  renderSubMenuItem = (subMenuItem) => {
    const { activeKey } = this.state;
    const { setLocation, hash } = this.props;

    if (subMenuItem.display === "State Legislatures") {
      return (
        <SubMenu
          className="state-legislatures-menu fade-in"
          key={subMenuItem.display}
          title={
            <span className="state-legislatures-title">
              {subMenuItem.display}
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
    if (subMenuItem.type === "modal") {
      return (
        <ImageModal
          hash={hash}
          menuItem={subMenuItem}
          setHash={this.props.setHash}
          key={subMenuItem.display}
        />
      );
    }
    return (
      <Menu.Item
        className={classNames([
          "fade-in",
          {
            "submenu-item-selected":
              hash === subMenuItem.link && !subMenuItem.external,
          },
        ])}
        key={subMenuItem.display}
        onClick={() =>
          !subMenuItem.external
            ? this.props.setHash(subMenuItem.link)
            : undefined
        }
      >
        {this.renderLink(subMenuItem)}
      </Menu.Item>
    );
  };

  hasSubMenu = (key) => {
    const keyToCheck = key || this.state.activeKey;
    const subMenu = MENU_MAP.get(keyToCheck);
    return subMenu && subMenu.length;
  }

  handleMenuSelect = (refObj) => {
    const { key } = refObj;
    if (this.hasSubMenu(key) && key !== this.state.activeKey) {
      this.setState({ activeKey: key });
    } else {
      this.setState({ activeKey: "" });
    }
  };

  render() {
    const { initData, show } = this.state;
    const { hash, setLocation, setHash } = this.props;
    const menuEl = (
      <Menu
        onClick={this.handleClick}
        style={{ width: 256 }}
        defaultSelectedKeys={["1"]}
        defaultOpenKeys={["sub1"]}
        mode="inline"
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
        {TOP_LEVEL_MENU.map((topLevelMenuItem) => {
          if (topLevelMenuItem.hash) {
            return (
              <Menu.Item key={topLevelMenuItem.value}>
                <a
                  href={topLevelMenuItem.hash}
                  style={{ textDecoration: "none" }}
                  data-toggle="tab"
                  className="hash-link"
                >
                  {topLevelMenuItem.label}
                </a>
              </Menu.Item>
            );
          }
          if (topLevelMenuItem.href) {
            return (
              <div key="donate" className="donate-btn">
                <Button
                  type="danger"
                  shape="round"
                  size="large"
                  href={topLevelMenuItem.href}
                  target="_blank"
                >
                  {topLevelMenuItem.label}
                </Button>
              </div>
            );
          }
          const children = MENU_MAP.get(topLevelMenuItem.value);
          return (
            <SubMenu
              key={topLevelMenuItem.value}
              title={topLevelMenuItem.label}
              onTitleClick={this.handleMenuSelect}
            >
              {children.map(this.renderSubMenuItem)}
            </SubMenu>
          );
        })}
      </Menu>
    );
    const loadingEl = (
      <div
        style={{
          width: "100%",
          height: document.documentElement.clientHeight * 0.6,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Spin size="large" />
      </div>
    );
    return (
      <div className={show ? "menu-active" : ""}>
        <div>
          <Button
            leftContent="Menu"
            mode="light"
            icon={
              <img
                src="https://gw.alipayobjects.com/zos/rmsportal/iXVHARNNlmdCGnwWxQPH.svg"
                className="am-icon am-icon-md"
                alt=""
              />
            }
            onClick={this.handleClick}
            className="top-nav-bar"
          >
            {this.state.title}
          </Button>
        </div>
        {show ? (initData ? menuEl : loadingEl) : null}
        {show ? <div className="menu-mask" onClick={this.onMaskClick} /> : null}
      </div>
    );
  }
}

export default MobileMenu;