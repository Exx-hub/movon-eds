import React from 'react';
import './reviewdetails.scss';
import {Row, Col, Input, Space, Divider} from 'antd'
import {InputView} from '../input'
import defaultImage from '../../assets/movoncargo.png'
import { UserProfile } from '../../utility';

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

const sReviewDetails = (props) =>{

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
                            !props.viewMode && billOfLading ?
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

export function ReviewDetails(props){
    return(<div className="preview-details">
        <Container title="Package Information">
            <div className="horizontal-layout">
                <PackageInformationSection {...props} className="horizontal-layout" style={{width:'60%', marginLeft:'2rem'}} />
                <div className="horizontal-layout image-section" style={{width:'40%'}}>
                    <img className="parcel-image" src={props.value.packageImages[0] || defaultImage} alt="parcel-image"/>
                </div>
            </div>
        </Container>

        <Container title="Price Details">
            <div className="horizontal-layout">
                <FeeSection {...props} className="horizontal-layout" style={{width:'100%', marginLeft:'2rem' }} />
            </div>
        </Container>
    </div>)
}

function PackageInformationSection(props){
    const data = props.value;
    const destination = data.startStationName ? data.startStationName : data.destination;
    return(<div className="vertical-layout" style={{...props.style}}>
        <div className="text-list-container">
            <TextContainer label="Destination" value={destination} />
            <TextContainer label="Description" value={props.value.packageName || ''}/>
            <TextContainer label="Bill of Lading" value={props.value.billOfLading || ''}/>
            <div className="header-layout">
                <span>Sender:</span> 
                <TextContainer label="Sender Name" value={props.value.senderName || 'senderName'} />
                <TextContainer label="Sender Phone No" value={props.value.senderPhone || 'senderPhone'} />
                {props.value.senderEmail && <TextContainer label="Sender Email" value={props.value.senderEmail || ''} />}
            </div>
            
            <br/>
            <div className="header-layout">
                <span>Reciever:</span> 
                <TextContainer label="Receiver Name" value={props.value.recipientName || 'recipientName'} />
                <TextContainer label="Receiver Phone No" value={props.value.recipientPhone || 'recipientPhone'} />
                { props.value.recipientEmail && <TextContainer label="Receiver Email" value={props.value.recipientEmail || ''} />}
            </div>
            <br/>
        </div>
    </div>)
}

function FeeSection(props){

    let inputSection=undefined;
    let feesSection=undefined;

    const data = props.value;
    const length = (data.length && data.lengthFee + "m") || "0 m";
    const lengthFee = data.lengthFee ? "Php "+Number(data.lengthFee).toFixed(2) : 'Php 0.00';
    const weight = data.packageWeight ? Number(data.packageWeight) + " kg" : 0 + " kg"
    const stickerCount = (data.subParcels ? data.subParcels.length : data.stickerCount) || 0;
    const packageQty = (data.packageQty && Number(data.packageQty)) || 1;
    const weightFee = (data.weightFee && "Php "+Number(data.weightFee).toFixed(2)) || 'Php 0.00';
    const insuranceFee = (data.insuranceFee && "Php "+Number(data.insuranceFee || 0).toFixed(2)) || "Php 0.00"
    const portersFee = (data.portersFee && "Php "+Number(data.portersFee).toFixed(2)) || 'Php 0.00';
    const convenienceFee = (data.convenienceFee && "Php "+Number(data.convenienceFee).toFixed(2)) || 'Php 0.00';
    const totalPrice = (data.totalPrice && "Php "+Number(data.totalPrice).toFixed(2)) || 'Php 0.00';
    const declaredValue = (data.declaredValue && "Php "+Number(data.declaredValue).toFixed(2)) || 'Php 0.00';
    
    switch (UserProfile.getBusCompanyTag()) {
        case "dltb":
            feesSection = (<NumberContainer label="Additional Fee" value={Number(data.additionalFee).toFixed(2)} />)
            break;

        case "five-star":
            inputSection = (<NumberContainer label="Length" value={length} />)
            feesSection = (<NumberContainer label="Length Fee" value={lengthFee} />)
            break;

        case 'isarog-liner':
            inputSection = (<TextContainer label="Length" value={length} />)
            feesSection = (<>
                <NumberContainer label="Length Fee" value={lengthFee}/>
                <NumberContainer label="Porter's Fee" value={portersFee} />
            </>)
            break;
    
        default:
            break;
    }

    return(<div className="vertical-layout" style={{...props.style}}>
        <div className="horizontal-layout" style={{padding:'1rem'}}>
            
            <div className="header-layout" style={{width:'50%'}}>
                <span>Inputs:</span> 
                <TextContainer label="Declared Value" value={declaredValue} />
                <TextContainer label="Package Count" value={stickerCount}/>
                <TextContainer label="Quantity" value={packageQty } />
                <TextContainer label="Weight" value={weight} />
                {inputSection}
            </div>
            <div className="header-layout" style={{width:'50%'}}>
                <span>Fees:</span>
                <NumberContainer label="Declared Value Fee" value={insuranceFee} />
                <NumberContainer label="Weight Fee" value={weightFee} />
                {feesSection}
                <NumberContainer label="System Fee" value={convenienceFee} />
                <NumberContainer label="Total Shipping Cost" value={totalPrice} />
            </div>
        </div>
    </div>)
}

function TextContainer(props){
    return(<div className="text-section">
        <div className="label"><label>{props.label}</label></div>
        :<div className="label-value"><label>{props.value}</label></div>
    </div>)
}

function NumberContainer(props){
    return(<div className="number-section">
        <div className="label"><label>{props.label}</label></div>
        :<div className="label-value"><label>{props.value}</label></div>
    </div>)
}

function Container(props){
    return <div className="box-container">
        <div className="box-title">{props.title}
        </div>

        <div className="box-body">
            {props.children}
        </div>
        
    </div>
}

export default ReviewDetails;
