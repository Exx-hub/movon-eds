import React from 'react';
import './titleHolder.css'
import { Row } from 'antd';

function TitleHolder (props){
    return (<Row>
    <div className="create-parcel-details">
      {props.title || 'title'}
    </div>
  </Row>)
  }

  export default TitleHolder;