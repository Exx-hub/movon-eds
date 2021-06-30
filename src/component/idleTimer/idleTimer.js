import React, { useRef } from "react";
import IdleTimer from "react-idle-timer";

import { UserProfile } from "../../utility";
import User from "../../service/User";
import { notification } from "antd";

function IdleTimerContainer() {
  const idleTimerRef = useRef(null);

  const logOut = () => {
    // alert("You have been logged out.");
    UserProfile.logout(User);
    window.location.reload();
  };

  const onIdle = () => {
    // THIS IS FOR FEATURE TO KEEP USER LOGGED IN WHEN PRESSED. FOR NOW AUTOMATICALLY LOGS OUT USER.
    // const key = `open${Date.now()}`;

    // const btn = (
    //   <Button
    //     type="primary"
    //     size="small"
    //     onClick={() => notification.close(key)}
    //   >
    //     Keep me logged in
    //   </Button>
    // );

    notification.warning({
      message: "Session Time-Out",
      description: "You will be automatically logged out due to inactivity.",
      duration: 5,
      onClose: logOut,
      // btn,
      // key,
    });
  };

  return <IdleTimer ref={idleTimerRef} timeout={300 * 1000} onIdle={onIdle} />;
}

export default IdleTimerContainer;
