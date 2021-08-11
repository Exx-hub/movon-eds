import React from "react";
import { Modal } from "antd";
import "./modal.scss";

function MatrixModal(props) {
  return (
    <Modal
      closable={true}
      onCancel={props.onCancel}
      destroyOnClose={true}
      width={props.width || 800}
      title={props.title || "title"}
      visible={props.visible}
      maskClosable={false}
      footer={null}
    >
      {props.children}
    </Modal>
  );
}

export default MatrixModal;
