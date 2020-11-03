import React from 'react'
import {Modal, Button} from 'antd'
import PropTypes from 'prop-types';

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
            type="danger"
            onClick={()=>this.props.handleOk()}
            disabled={this.props.disabled}
          >
            Void
          </Button>,
        ]}>
          <p>{this.props.message}</p>
          <input onChange={this.props.onRemarksChange}/>
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
