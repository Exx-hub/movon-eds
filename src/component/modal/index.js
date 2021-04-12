import React from 'react';

import PromptModal from './promptmodal';
import MatrixModal from './matrixModal'
import CustomModal from './matrixModal'
import DefaultMatrixModal from './defaultModal'
import User from "../../service/User";
import { UserProfile } from '../../utility';

function LogoutModal(props){
    return <PromptModal
        visible={props.visible}
        title="Are you sure you want to log out?"
        message="Changes you made may not be saved."
        buttonType="danger"
        action="Logout"
        handleCancel={() => {
          props.handleCancel()
        }}
        handleOk={() => { 
          UserProfile.logout(User);
          props.history.push("/");
        }}
      />
}

export {
    PromptModal, MatrixModal, CustomModal, DefaultMatrixModal, LogoutModal
}
