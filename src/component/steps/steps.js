import React from 'react';
import { Steps } from 'antd';
import './steps.scss'

const { Step } = Steps;

function StepsView (props){
  const disabled = props.disabled || false;
    return (
    <div className="component-steps">
      <Steps
        status={props.status || ''}
        onChange={props.onchange}
        progressDot={props.progressDot} 
        direction={props.direction || 'vertical'} 
        size="small" 
        current={props.current || 0}>
        {
          props.stepList.map((e,i)=>{
            return  <Step disabled={disabled} className="steps-item-content" key={e.title+i} title={e.title} description={e.description}/>
          })
        }
      </Steps>
    </div>)
  }

  export default StepsView;