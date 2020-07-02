import React from 'react';
import './reviewdetails.scss';
import {Row, Col, Input} from 'antd'
import {InputView} from '../input'

const InputBox = (props) =>{
    return <div style={{
        display:"flex",
        flexDirection:"column",
        marginBottom:'.5rem'
        }}>
        <span>{props.title}</span>
        <Input value={props.value} disabled/>
    </div>
}

export const ReviewDetails = () =>{

    return <div className="component-review-details">
         <div className="parcel-image-container">
            <img className="img-parcel" src={'https://parceljs.org/assets/parcel-og.png'} />
        </div>

        <div className="container-border-box">
            <Row>
                <Col span={12}>
                    <div style={{marginRight:'.5rem'}}>
                        <InputBox title="Package Name:" value="Lorem Ipsum"/>
                        <InputBox title="Parcel Count:" value="1"/>
                        <InputBox title="Weight" value="1 kg"/>
                        <InputBox title="System Fee" value="100"/>
                    </div>
                </Col>
                <Col span={12}>
                    <div style={{marginLeft:'.5rem'}}>
                        <InputBox title="Insurance Fee" value="100"/>
                        <InputBox title="Total Shipping Cost" value="100"/>
                        <InputBox title="Additional Note:" value="is simply dummy text of the printing and typesetting"/>
                        <>
                            <span>Bill of Lading*</span>
                            <InputView />
                        </>
                    </div>
                </Col>
            </Row>
        </div>

        <Row>
            <Col span={12}>
                <div className="container-border-box sender">
                    <InputBox title="Sender Name:" value="test"/>
                    <InputBox title="Sender Number:" value="123456"/>
                    <InputBox title="Sender Email" value="@fake-mailer.com"/>
                </div>
            </Col>
            <Col span={12}>
                <div className="container-border-box receiver">
                    <InputBox title="Receiver Name:" value="test"/>
                    <InputBox title="Receiver Number:" value="123456"/>
                    <InputBox title="Receiver Email" value="@fake-mailer.com"/>
                </div>
            </Col>
        </Row>

    </div>
}