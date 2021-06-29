import React, { useRef } from "react";
import IdleTimer from "react-idle-timer";

import { UserProfile } from "../../utility";
import User from "../../service/User";

function IdleTimerContainer() {
  const idleTimerRef = useRef(null);

  const onIdle = () => {
    alert("YOU HAVE BEEN IDLE"); // instead of alert use a notification
    // UserProfile.clearData();
    // window.location.replace("/login");
    UserProfile.logout(User);
    window.location.reload();
  };

  return <IdleTimer ref={idleTimerRef} timeout={5 * 1000} onIdle={onIdle} />;
}

export default IdleTimerContainer;
