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

export const ReviewDetails = (props) =>{

    console.log('ReviewDetails props',props)


    const{
        packageName,
        packageWeight,
        packageQty,
        packageImages,
        recipientName,
        recipientEmail,
        recipientPhone,
        senderName,
        senderEmail,
        senderPhone,
        convenienceFee,
        insuranceFee,
        price,
        totalPrice,
        additionalNote,
        billOfLading
    }=props.value


    return <div className="component-review-details">
         <div className="parcel-image-container">
             {
                 packageImages.map((e,i)=>(<img key={i} className="img-parcel" src={e} alt="img-parcel"/>))
             }
        </div>

        <div className="container-border-box">
            <Row>
                <Col span={12}>
                    <div style={{marginRight:'.5rem'}}>
                        <InputBox title="Package Name:" value={packageName}/>
                        <InputBox title="Parcel Count:" value={packageQty}/>
                        <InputBox title="Weight" value={packageWeight}/>
                        <InputBox title="System Fee" value={convenienceFee}/>
                    </div>
                </Col>
                <Col span={12}>
                    <div style={{marginLeft:'.5rem'}}>
                        <InputBox title="Insurance Fee" value={insuranceFee}/>
                        <InputBox title="Total Shipping Cost" value={totalPrice} />
                        <InputBox title="Additional Note:" value={additionalNote}/>
                        {
                            !props.viewMode ?
                            <>
                                <span>Bill of Lading*</span>
                                <InputView 
                                    onChange={props.onChange}
                                    value={billOfLading.value}
                                    name={billOfLading.name}
                                    accepted={billOfLading.accepted}
                                    isRequired={billOfLading.isRequired}
                                    errorMessage="Bill of Lading is required!"
                                />
                            </> :
                            <InputBox title="Bill of Lading:" value={billOfLading}/>
                        }
                    </div>
                </Col>
            </Row>
        </div>

        <Row>
            <Col span={12}>
                <div className="container-border-box sender">
                    <InputBox title="Sender Name:" value={senderName}/>
                    <InputBox title="Sender Number:" value={senderPhone}/>
                    <InputBox title="Sender Email" value={senderEmail}/>
                </div>
            </Col>
            <Col span={12}>
                <div className="container-border-box receiver">
                    <InputBox title="Receiver Name:" value={recipientName}/>
                    <InputBox title="Receiver Number:" value={recipientPhone}/>
                    <InputBox title="Receiver Email" value={recipientEmail}/>
                </div>
            </Col>
        </Row>

    </div>
}