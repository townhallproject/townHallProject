import React from 'react';
import { Modal, Menu, Icon } from 'antd';
import classNames from 'classnames';
import indexView from '../../../scripts/views/indexView';

class ImageModal extends React.Component {
  state = {
    visible: false,
    width: 0
  };

  constructor(props) {
    super(props);

    this.showModal = this.showModal.bind(this);
    this.handleOk = this.handleOk.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.state ={
      visible: false,
    }
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }
  
  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }
  
  updateWindowDimensions = () => {
    this.setState({ width: window.innerWidth });
  }

  showModal() {
    const { setHash, menuItem } = this.props;
    setHash(menuItem.link);
    this.setState({
      visible: true,
    })
  };

  handleOk(e) {
    this.props.setHash('');
    this.setState({visible: false})
  };

  handleCancel(e) { 
    this.handleOk();
  };

  afterClose = () => {
    // TODO: handle this at a higher level
    // doing this so the map gets reset 
    indexView.resetHome();
  }

  getIsVisible = () => {
    const { menuItem, hash } = this.props;

    if (hash && menuItem.link) {
      return hash === menuItem.link
    }
    return this.state.visible;
  }

  render() {
    const { menuItem, hash } = this.props;
    return (
      <React.Fragment>
        <Menu.Item 
          {...this.props}
          className={classNames(["fade-in", { 'submenu-item-selected': hash === menuItem.link }])}
          onClick={this.showModal}>
            {menuItem.link ? (
              <a
                className={classNames(["menu-link"])}
                href={`#${menuItem.link}`}
              >
              {menuItem.icon && <Icon key={menuItem.icon} type={menuItem.icon}/>}
              {menuItem.display}
            </a>) : 
              [menuItem.icon && <Icon key={menuItem.icon} type={menuItem.icon} />,
              menuItem.display]
            }
        </Menu.Item>
        <Modal
          visible={this.getIsVisible()}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={null}
          style={{ maxWidth: 1440 }}
          width="90%"
          afterClose={this.afterClose}
        >
          <img 
            className={menuItem.background ? "ant-modal-image" : null}
            src={this.state.width < 740 && menuItem.mobileSrc ? menuItem.mobileSrc : menuItem.src} 
          />
        </Modal>
      </React.Fragment>
    );
  }
}

export default ImageModal;