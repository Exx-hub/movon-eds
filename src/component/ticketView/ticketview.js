import React from 'react';
import './ticketview.scss';
import { QRCode } from "react-qr-svg";
import {Space} from 'antd';
import movon from '../../assets/movon3.png';
import {config} from '../../config'
import moment from 'moment'
import {getUser} from '../../utility'

const TicketDetails = (props) =>{

    const{
        billOfLading,
        packageQty,
        packageWeight,
        recipientName,
        recipientPhone,
        senderName,
        senderPhone,
        busCompanyLogo,
        endStationName,
        startStationName,
        tripCode,
        createdAt,
        totalPrice,
    }= props.value;

    const code = props.code

    const Populate = () =>{
        // const list = {
        //     billOfLading:{ value:billOfLading, name:'Bill Of Lading'},
        //     tripCode:{ value:tripCode, name:'Trip Code'},
        //     senderName:{ value:senderName, name:'Sender'},
        //     senderPhone:{ value:senderPhone, name:'Mobile Number'},
        //     recipientName:{ value:recipientName, name:'Receiver'},
        //     recipientPhone:{ value:recipientPhone, name:'Mobile Number'}
        // };
        // const packageInfo= {
        //     packageName:{ value:packageName, name:'Package Name'},
        //     quantity:{ value: packageQty, name:'Quantity'},
        //     origin:{ value:startStationName, name:'Origin'},
        //     destination:{ value:endStationName, name:'destination'},
        //     packageWeight:{ value:packageWeight, name:'Chargeable wt.'},
        // }
    
        // const iterate = (param) =>{
        //     const view = Object.keys(param).map((e,i)=>{
        //         return(<Space className="details-txt">
        //                     <h4 style={{width:'120px'}}>{param[e].name}</h4>
        //                     <h4>:</h4>
        //                     <h4>{param[e].value}</h4>
        //                 </Space>)
        //     });  
        //     return view;
        // }
        //const packageInfoLabel = [<> <h5 style={{fontSize:'15px', paddingTop:'.5rem', paddingBottom:'.2rem'}}>Package Info:</h5> </>]
        
        const View = (<>
        <Space className="details-txt">
            <h4 className="span-description" style={{width:'120px'}}>Way Bill</h4>
            <h4>:</h4>
                <h4>{billOfLading}</h4>
        </Space>
        <Space className="details-txt">
            <h4 className="span-description" style={{width:'120px'}}>Trip Code</h4>
            <h4>:</h4>
                <h4>{tripCode}</h4>
        </Space>
        <Space className="details-txt">
            <h4 className="span-description" style={{width:'120px'}}>Sender</h4>
            <h4>:</h4>
                <h4>{senderName}</h4>
        </Space>
        <Space className="details-txt">
            <h4 className="span-description" style={{width:'120px'}}>Mobile Number</h4>
            <h4>:</h4>
                <h4>{senderPhone}</h4>
        </Space>
        <Space className="details-txt">
            <h4 className="span-description" style={{width:'120px'}}>Receiver</h4>
            <h4>:</h4>
                <h4>{recipientName}</h4>
        </Space>
        <Space className="details-txt" style={{margin:0}}>
            <h4 className="span-description" style={{width:'120px'}}>Mobile Number</h4>
            <h4>:</h4>
                <h4>{recipientPhone}</h4>
        </Space>
        <br />
        <Space className="details-txt">
            <h4 className="span-description" style={{width:'120px'}}>Origin</h4>
            <h4>:</h4>
                <h4>{startStationName}</h4>
        </Space>
        <Space className="details-txt">
            <h4 className="span-description" style={{width:'120px'}}>Price</h4>
            <h4>:</h4>
            <h4>₱{parseFloat(totalPrice).toFixed(2)}</h4>
        </Space>
        <Space direction="horizontal"  className="details-txt">
        <h4 className="span-description">Quantity | Weight</h4>
        <h4>: &nbsp; {packageQty} {packageQty.length > 1 ? "pkgs." : "pkg"} &nbsp; - &nbsp; {packageWeight} {packageWeight.length > 1 ? "kgs." : "kg"}</h4>
        </Space>
        </>)
        return View
    }

    return (
        <div className="ticket-details">
            <div style={{display:'flex', flexDirection:'row', marginRight:'1rem', height:'100%'}}>
                <div className="qr-section">
                    <div className="qr-container">
                        <div className="qr-code-img">
                            <QRCode
                                bgColor="#FFFFFF"
                                fgColor="#000000"
                                level="Q"
                                style={{ width: 150 }}
                                value={code}
                            />
                            <h4 className="code-date-container-item2">{code}</h4>
                        </div>
                    </div>
                    <div className="code-date-container">
                        <h4 className="code-date-container-item1">{moment(createdAt).format('MMM DD, YYYY')}</h4>
                        <h4 className="code-date-container-destination">{endStationName}</h4>
                    </div>
                    <div className="parcel-count"> {props.children} </div>
                </div>
                <div style={{
                    display:'flex', 
                    flexDirection:'column', 
                    justifyContent:'flex-start',
                    alignItems:'flex-start'
                    }}>
                    <div className="image-logo-container">
                        <img src={movon} className="movon-logo" alt="movon"/>
                        <img src={busCompanyLogo} className="partner-logo" alt="partner"/>
                    </div>
                    <div className="ticket-view-populate-section"><Populate /></div>
                </div>
            </div>
        </div>
    )
}

const PCopy = (props) =>{
    if(props){
        const quantity = props.value.packageQty;
        const scanCode = props.value.scanCode;

        let _view=[]
        for(let i=0; i < quantity; i++){
            _view.push(<TicketDetails key={i} {...props} code={scanCode} /> )
        }
        return _view;
    }
    return null;
}

const SpCopy = (props) =>{
    if(props){
        
        let _view=[]
        for(let i=0; i<props.value.subParcels.length; i++){
            const scanCode = props.value.subParcels[i].subParcelCode
            _view.push(<TicketDetails key={i} {...props} code={scanCode} >  <span>{i+1} of {props.value.subParcels.length}</span> </TicketDetails>)
        }
        return _view;
    }
    return null;
}

const CompanyCopy = (props) =>{
    if(props){
        const USER = getUser();
        let noOfStickerCopy = config.ticket.totalCopy;
        if(USER){
            noOfStickerCopy = USER.busCompanyId && USER.busCompanyId.config && USER.busCompanyId.config.parcel.noOfStickerCopy;
        }
        const quantity = noOfStickerCopy || config.ticket.totalCopy;
        const scanCode = props.value.subParcels[0].subParcelCode;
        
        let _view=[]
        for(let i=0; i<quantity; i++){
            _view.push(<TicketDetails key={i} {...props} code={scanCode} />)  
        }
        return _view;
    }
    return null;
}

export const TicketView = (props) =>{
    return (
    <div className="component-ticketview-container">
        {props.value && <PCopy {...props} />}
        {props.value && <SpCopy {...props}/>} 
        {props.value && <CompanyCopy {...props}/>} 
    </div>);
}