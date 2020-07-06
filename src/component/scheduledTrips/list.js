import React from 'react';
import './scheduletrips.scss';
import {Pagination} from 'antd';
import pin from '../../assets/destinationpin.png'
import moment from 'moment';

export const ScheduledTrips = (props)=>{
    return(
        <div className="component-scheduled-trips">
            <div className="details-view-parent-container">
                <div className="list-title">
                    <h2>Select Trip</h2>
                    <span>{moment().format("hh:ss A - MMM DD, YYYY")}</span>
                </div>
                <DetailsView {...props} key={1} onClick={()=>props.onSelect(0)}/>
            </div>
        
            <div className="pagination-container">
                <Pagination 
                    defaultCurrent={0} 
                    current={props.page || 0} 
                    total={props.total || 50} 
                    onChange={ props.onChange || null} />
            </div>
        </div>)
}

const DetailsView = (props) =>{
    return(<div className="details-view-item" onClick={props.onClick || null}>
    
            <div className="content-container">
                <div className="pin-origin-destination">
                    <img className="pin-icon" src={pin} alt="pin-icon"/>
                    <div className="origin-destination">
                        <span style={{flexGrow:1}}>Naga</span>
                        <span>Cubao</span>
                    </div>
                </div>
                <div className="content-text-info">
                    <div className="content-text-info-items">
                        <div className="items">
                            <span className="company-text">Company</span>
                            <span className="bus-model-text">Bus Model</span>
                            <span className="departure-time-title">Departure Time</span>
                            <span className="departure-time">02:52 AM - Jun 30, 2020</span>
                        </div>
                    </div>
                </div>
            </div>
    </div>)
}

// <div style={{display:'flex', flexDirection:'row'}}>
//                 <div style={{display:'flex', height:'100px'}}>
//                     <img style={{height:'100px', position:'absolute'}} src={pin} />
//                     <div 
//                         style={{
//                             marginLeft:'2rem',
//                             display:'flex', 
//                             flexDirection:'column',
//                             justifyContent:'flex-start',
//                             alignItems:'flex-start',
//                             height:'100%',
//                         }}>
//                         <span style={{flexGrow:1}}>Naga</span>
//                         <span>Cubao</span>
//                     </div>
//                 </div>
//                 <div style={{
//                     display:'flex',
//                     flexDirection:'column',
//                     justifyContent:'flex-start',
//                     width:'100%'
//                 }}>
//                     <div style={{marginLeft:'10%', height:'100%', display:'flex', flexDirection:' row'}}>
//                         <div style={{display:'flex', flexDirection:'column', alignSelf:'flex-end'}}>
//                             <span>Company</span>
//                             <span style={{marginBottom:'.5rem'}}>Bus Model</span>
//                             <span>Departure Time</span>
//                             <span>02:52 AM - Jun 30, 2020</span>
//                         </div>
//                     </div>
//                 </div>
//             </div>