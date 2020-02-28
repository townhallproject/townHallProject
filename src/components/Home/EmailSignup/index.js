import React, { Component } from 'react';
import { Form, Row, Col, Icon, Input, Button, Select } from 'antd';
import { isUndefined } from 'lodash';
const { Option } = Select;
import TownHall from '../../../scripts/models/TownHall';

import '../../../vendor/scripts/bootstrap-tagsinput';
const zipcodeRegEx = /^(\d{5}-\d{4}|\d{5}|\d{9})$|^([a-zA-Z]\d[a-zA-Z] \d[a-zA-Z]\d)$/g;
const emailRegEx = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;


import './style.less';

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class EmailForm extends Component {
  constructor(props) {
    super(props)
    this.addDistrict = this.addDistrict.bind(this);
    this.clearDistricts = this.clearDistricts.bind(this);
    this.closeEmailForm = this.closeEmailForm.bind(this);
    this.formatDistrictArray = this.formatDistrictArray.bind(this);
    this.openEmailForm = this.openEmailForm.bind(this);
    this.renderEmailUpdateButton = this.renderEmailUpdateButton.bind(this);
    this.renderLocationInput = this.renderLocationInput.bind(this);
    this.renderForm = this.renderForm.bind(this);
    this.setDistricts = this.setDistricts.bind(this);
    this.submitSignup = this.submitSignup.bind(this);
    this.validateSignup = this.validateSignup.bind(this);
    this.state = {
      showForm: true
    }
  };

  componentDidMount() {
    this.props.form.validateFields();
    this.setState({ showForm: localStorage.getItem('signedUp') ? false : true })
  };

  setSignedUpInLocalStorage(val) {
    localStorage.setItem("signedUp", val)
  };

  updateFormVisible(showForm) {
    this.setState(showForm)
  }

  validateSignup = function (e) {
    e.preventDefault();
    // TODO: handle form ant design way
    let first = $('#email-signup-form input[name=first]');
    let last = $('#email-signup-form input[name=last]');
    let email = $('#email-signup-form input[name=email]');
    let zipcode = $('#email-signup-form input[name=zipcode]');
    let partner = $('#email-signup-form input[name=partner]');
    let districts = $('#email-signup-form input[name=districts]').tagsinput('items');
    let errors = 0;

    [first, email, zipcode].forEach(function (field) {
      let name = field[0].name;
      if (field[0].value.length === 0 && !$(field[0]).hasClass('hidden')) {
        field.addClass('has-error');
        errors++;
      } else if ((name === 'email' && !emailRegEx.test(field[0].value))) {
        field.addClass('has-error');
        errors++;
      } else if (name === 'zipcode' && !zipcode.hasClass('hidden') && !zipcodeRegEx.test(field[0].value)) {
        field.addClass('has-error');
        errors++;
      } else {
        field.removeClass('has-error');
      }
    });
    if (errors !== 0) {
      return;
    }

    let zipClean = zipcode.val().split('-')[0];
    if (districts.length === 0) {
      TownHall.lookupZip(zipClean)
        .then(function (zipToDistricts) {
          let districts = zipToDistricts.map(function (ele) {
            return ele.abr + '-' + ele.dis;
          });
          submitSignup(first, last, zipClean, email, districts, partner);
        });
    } else {

      submitSignup(first, last, zipClean, email, districts, partner);
    }
  };

  submitSignup() {
    let person = {
      'person': {
        'family_name': last.val(),
        'given_name': first.val(),
        'postal_addresses': [{ 'postal_code': zipcode }],
        'email_addresses': [{ 'address': email.val() }],
        'custom_fields': {
          'districts': districts,
          'partner': partner.prop('checked')
        }
      }
    };
    $.ajax({
      url: 'https://actionnetwork.org/api/v2/forms/eafd3b2a-8c6b-42da-bec8-962da91b128c/submissions',
      method: 'POST',
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify(person),
      success: function () {
        setSignedUpInLocalStorage(true)
        // localStorage.setItem('signedUp', true);
        this.closeEmailForm();
      },
      error: function () {
        $('#email-signup-form button').before('<span class="error">An error has occured, please try again later.</span>');
      }
    });
    return false;
  };

  openEmailForm() {
    this.setState({
      showForm: true
    })
  };

  closeEmailForm() {
    this.setState({
      showForm: false
    })
  };

  clearDistricts() {
    $('#email-signup-form input[name=districts]').tagsinput('removeAll');
  };

  addDistrict(district) {
    $('#email-signup-form input[name=districts]').tagsinput('add', district);
  };

  setDistricts(districts) {
    districts.forEach(function (district) {
      emailHandler.addDistrict(district);
    });
  };

  renderForm() {
    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
    return (
      <section className="email-signup--inline" id="email-signup">
        <button type="button" className="close" data-dismiss="modal" aria-label="Close" id="close-email" onClick={this.closeEmailForm}>
          <span aria-hidden="true">&times;</span>
        </button>
        <div className="container container-fluid">
          <h1 id="email-title" className="text-center extra-large">Sign up to receive updates on local events.</h1>
          <Form id="email-signup-form" onSubmit={this.validateSignup}>
            <Row gutter={24}>
              <Col span={8}>
                <Form.Item>
                  {getFieldDecorator('first', {
                    rules: [{ required: true, message: 'Please input your first name' }],
                  })(
                    <Input
                      prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                      placeholder="First Name"
                    />,
                  )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item>
                  {getFieldDecorator('last', {
                    rules: [{ required: true, message: 'Please input your last name' }],
                  })(
                    <Input
                      prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                      placeholder="Last Name"
                    />,
                  )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item>
                  {getFieldDecorator('email', {
                    rules: [{ required: true, message: 'Please input your email' }],
                  })(
                    <Input
                      prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                      placeholder="Email"
                    />,
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={8}>
                {this.renderLocationInput()}
              </Col>
              <Col span={8}>
                <Button block type="submit" htmlType="submit" name="button" id="submit-email-button" icon="check-square" disabled={hasErrors(getFieldsError())}>Sign up</Button>
              </Col>
            </Row>
          </Form>
        </div>
      </section>
    )
  }

  formatDistrictArray() {
    const { currentDistrict } = this.props;
    let currentDistricts = [];
    if (currentDistrict && currentDistrict.federal) {
      currentDistricts = currentDistrict.federal.districts.filter(dis => dis).map(district => {
        return `${currentDistrict.federal.state}-${district}`
      })
    }
    if (currentDistrict && currentDistrict.upper) {
      currentDistricts = [...currentDistricts, ...currentDistrict.upper.districts.map((district => `SD-${district}`))]
    }
    if (currentDistrict && currentDistrict.lower) {
      currentDistricts = [...currentDistricts, ...currentDistrict.lower.districts.map((district => `HD-${district}`))]
    }
    return currentDistricts;
  }

  renderLocationInput() {
    const { getFieldDecorator } = this.props.form;
    const districtArray = this.formatDistrictArray();
    if (districtArray.length) {
      return (
        <Form.Item>
          {getFieldDecorator('districts', {
            rules: [{ type: 'array' }],
            initialValue: districtArray
          })(
            <Select mode="multiple" placeholder="Subscribe to districts:">
              {
                districtArray.map((district) => {
                  return (
                    <Option key={district} value={district}>
                      {district}
                    </Option>
                  )
                })
              }
            </Select>
          )}
        </Form.Item>
      )
    }
    // no district - render zip input
    return (
      <Form.Item>
        {getFieldDecorator('zipcode', {
          rules: [{ required: true, message: 'Please input your zip code' }],
        })(
          <Input
            prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
            placeholder="Zip Code"
          />,
        )}
      </Form.Item>
    )

  }

  renderEmailUpdateButton() {
    return (
      <div id="email-update" className="container-fluid">
        <Button id="open-email-form-btn" onClick={this.openEmailForm}>Update your email subscription</Button>
      </div>
    )
  }

  render() {
    const { showForm } = this.state;
    return (
      <div>
        {showForm ? this.renderForm() : this.renderEmailUpdateButton()}
      </div>
    )
  };

}

const EmailSignup = Form.create({})(EmailForm);

export default EmailSignup;