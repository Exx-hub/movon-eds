import React from 'react'
import { Modal, Button } from 'antd'
import './modal.scss'

function DefaultMatrixModal(props) {

  return (
    <Modal
      closable={true}
      onCancel={props.onCancel}
      destroyOnClose={true}
      width={props.width || 800}
      title={props.title || "title"}
      visible={props.visible}
      footer={null}>
      { props.children}
      <section className='button-section'>
        <Button
          onClick={props.onNegativeEvent}
          shape="round"
          className="button-cancel">{props.negativeText  || 'Cancel'}</Button>
        <Button
          shape="round"
          onClick={props.onPositiveEvent}
          className="button-update">{ props.positiveText || 'Ok'}</Button>
      </section>
    </Modal>
  )
}

export default DefaultMatrixModal;
