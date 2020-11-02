import React from 'react'
import {Modal, Button} from  'antd'
import PropTypes from 'prop-types';

export default class PromptModal extends React.Component{

    render(){

      return(
        <Modal
        closable = {false}
        onOk={()=>this.props.handleOk()}
        onCancel={()=>this.props.handleCancel()}
        title={this.props.title}
        visible={this.props.visible}>
          <p>{this.props.message}</p>
          <input></input>
        </Modal>
      )
    }
}

PromptModal.propTypes = {
  handleOk: PropTypes.func,
  handleCancel: PropTypes.func,
  title: PropTypes.string,
  message: PropTypes.string,
  visible: PropTypes.bool
};
