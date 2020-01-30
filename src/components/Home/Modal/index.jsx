import React from 'react';
import { Modal, Menu, Icon } from 'antd';
import classNames from 'classnames';

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
    this.setState({
      visible: true,
    });
  };

  handleOk(e) {
    this.setState({
      visible: false,
    });
  };

  handleCancel(e) { 
    this.setState({
      visible: false,
    });
  };

  render() {
    const { menuItem } = this.props;
    return (
      <React.Fragment>
        <Menu.Item 
          {...this.props}
          className={classNames(["fade-in", { 'submenu-item-selected': this.state.visible }])}
          onClick={this.showModal}>
          {menuItem.icon && <Icon type={menuItem.icon}/>}
          {menuItem.display}
        </Menu.Item>
        <Modal
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={null}
          width="90%"
        >
          <img 
            className={menuItem.background ? "ant-modal-image" : null}
            src={this.state.width < 740 && menuItem.mobileLink ? menuItem.mobileLink : menuItem.link} 
          />
        </Modal>
      </React.Fragment>
    );
  }
}

export default ImageModal;