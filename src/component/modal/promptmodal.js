import React from "react";
import { Modal, Button } from "antd";
import PropTypes from "prop-types";
import "./modal.scss";

export default class PromptModal extends React.Component {
  render() {
    return (
      <Modal
        closable={false}
        title={this.props.title}
        visible={this.props.visible}
        footer={[
          <Button key="back" onClick={() => this.props.handleCancel()}>
            Cancel
          </Button>,
          <Button
            id="voidSubmit"
            key="submit"
            type={this.props.buttonType}
            onClick={() => this.props.handleOk()}
            disabled={this.props.disabled}
          >
            <p>{this.props.action}</p>
          </Button>,
        ]}
      >
        <p className="message">{this.props.message}</p>
        <p className="reason-text"> {this.props.reason} </p>
        {this.props.action === "Send Request" ? (
          <textarea
            value={this.props.remarks || ""}
            class="remarks"
            onChange={this.props.onRemarksChange}
          />
        ) : (
          ""
        )}
      </Modal>
    );
  }
}

PromptModal.propTypes = {
  handleOk: PropTypes.func,
  handleCancel: PropTypes.func,
  title: PropTypes.string,
  message: PropTypes.string,
  buttonType: PropTypes.string,
  _action: PropTypes.string,
  visible: PropTypes.bool,
};
