import React, { Component } from 'react';
import { find } from 'lodash';
import {
  Button,
  Menu,
  Icon
} from 'antd';
import classNames from 'classnames';
import { MENU_MAP, STATE_LEGISLATURES_MENU, MISSING_MEMBER_LINK } from './menuConstants';
import DeskTopMenu from './DeskTopMenu';
import MobileMenu from './MobileMenu';

const { SubMenu } = Menu;

import './style.less';
import ImageModal from './Modal';
const BREAKPOINT = 768;
class Header extends Component {
  constructor(props) {
   super(props);
   let mobile = false;
   if (window.innerWidth <= BREAKPOINT) {
     mobile = true;
   }

   this.state = { mobile }
   window.addEventListener('resize', () => {
        if (window.innerWidth < BREAKPOINT && !this.state.mobile) {
          this.setState({
            mobile: true
          })
        } else if (this.state.mobile) {
          this.setState({
            mobile: false
          })
        }
   });

  }



  render() {
    const arrowClasses = ['arrow', 'fade-in'];
    const { activeKey } = this.state;
    const {
      setLocation,
      setHash,
      hash
    } = this.props;
    return this.state.mobile ? <MobileMenu     
        setLocation={setLocation}
        setHash={setHash}
        hash={hash}
      /> : <DeskTopMenu
      setLocation={setLocation}
      setHash={setHash}
      hash={hash}
    /> 
  }
}

export default Header;
