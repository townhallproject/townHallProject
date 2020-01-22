import React from 'react';
import { Modal, Menu, Icon } from 'antd';
import classNames from 'classnames';

class ImageModal extends React.Component {
  state = { visible: false };

  constructor(props) {
    super(props);

    this.showModal = this.showModal.bind(this);
    this.handleOk = this.handleOk.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
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
    const { hash, menuItem } = this.props;
    return (
      <React.Fragment>
        <Menu.Item 
          {...this.props}
          className={classNames(["fade-in", { 'ant-menu-item-selected': hash === menuItem.link && !menuItem.external }])}
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
          <img src={menuItem.link} />
        </Modal>
      </React.Fragment>
    );
  }
}

export default ImageModal;