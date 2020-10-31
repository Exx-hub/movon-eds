import React from 'react';
import { Input, Row, Col } from 'antd';
import './changePassword.scss'

const initState = {

}

export default class ChangePassword extends React.Component {

  constructor(props) {
    super(props)
    this.state = { ...initState }
  }

  componentDidMount() {

  }

  componentDidUpdate(preProps, prevState) {

  }

  componentWillUnmount() {

  }

  render() {
    return <div>
      <Row>
        <Col offset={12}>
          <div className="input-wrapper">
            <span>User Name</span>
            <Input />
          </div>
        </Col>
      </Row>

      <Row>
      <Col offset={12}>
          <div className="input-wrapper">
            <span>Password</span>
            <Input />
          </div>
        </Col>
      </Row>

      <Row>
      <Col offset={12}>
          <div className="input-wrapper">
            <span>New Password</span>
            <Input />
          </div>
        </Col>
      </Row>

      <Row>
      <Col offset={12}>
          <div className="input-wrapper">
            <span>Confirm Password</span>
            <Input />
          </div>
        </Col>
      </Row>

    </div>
  }

}