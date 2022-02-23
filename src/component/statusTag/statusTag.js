import React from "react";
import { Tag } from "antd";

export const getTag = (props) => {
  let color = "";
  let caption = "";
  switch (props) {
    case "created":
      color = "success";
      caption = "Active";
      break;
    case "in-transit":
      color = "success";
      caption = "Active";
      break;
    case "received":
      color = "default";
      caption = "Closed";
      break;
    case "void":
      color = "default";
      caption = "Closed";
      break;
    case "modified":
      color = "default";
      caption = "Closed";
      break;
    case "accompanied":
      color = "default";
      caption = "Closed";
      break;
    default:
      break;
  }
  return <Tag color={color}>{caption}</Tag>;
};
