import React from 'react'
import {Modal, Button} from 'antd'
import './modal.scss'

function MatrixModal(props){
  
  return(
    <Modal 
      closable={false}
      destroyOnClose={true}
      width={800}
      title={props.title || "title"} 
      visible={props.visible} 
      footer={null}>
      { props.children }
    </Modal>
  )
}

export default MatrixModal;
