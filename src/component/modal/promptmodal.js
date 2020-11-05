import React from 'react'
import {Modal, Button} from 'antd'
import PropTypes from 'prop-types';
import './modal.scss'

let x = document.getElementsByClassName("ant-modal-header");
  if (x.length > 0) {
  x[0].style.backgroundColor = "red";
  }

export default class PromptModal extends React.Component{

    render(){
      return(
        <Modal
          closable = {false}
          title={this.props.title}
          visible={this.props.visible}
          footer={[
            <Button
              key="back"
              onClick={()=>this.props.handleCancel()}
            >
              Cancel
            </Button>,
            <Button
              id="voidSubmit"
              key="submit"
              type={this.props.buttonType}
              onClick={()=>this.props.handleOk()}
              disabled={this.props.disabled}
            >
            <p>{this.props.action}</p>
            </Button>
          ]}
        >
        <p class="message">{this.props.message}</p>
        <p class="reason-text"> {this.props.reason} </p>
        { (this.props.action === "Send Request") ? <textarea class="remarks" onChange={this.props.onRemarksChange}/> : ''}
        </Modal>
      )
    }
}

PromptModal.propTypes = {
  handleOk: PropTypes.func,
  handleCancel: PropTypes.func,
  title: PropTypes.string,
  message: PropTypes.string,
  buttonType: PropTypes.string,
  _action: PropTypes.string,
  visible: PropTypes.bool
};
