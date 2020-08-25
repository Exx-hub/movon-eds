import React from 'react';
import './scheduletrips.scss';
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
                <DetailsView data={props.selectedDestination} {...props} onClick={()=>props.onSelect(props.selectedDestination)}/>
                {/* {
                    props.tripOption.map((e,i)=>(<DetailsView data={e} {...props} key={i} onClick={()=>props.onSelect(e)}/>))
                } */}
            </div>
        </div>)
}

const DetailsView = (props) =>{
    // const{
    //     bus,
    //     busCompanyId,
    //     endStation,
    //     startStation,
    //     tripStartDateTime
    // }=props.data;

    const {
        name,
        startStationName,
        companyName,
        tripStartDateTime,
        busModel,
    }=props.data;

    return(<div className="details-view-item" onClick={props.onClick}>
            <div className="content-container">
                <div className="pin-origin-destination">
                    <img className="pin-icon" src={pin} alt="pin-icon"/>
                    <div className="origin-destination">
                        <span style={{flexGrow:1}}>{startStationName}</span>
                        <span>{name}</span>
                    </div>
                </div>
                <div className="content-text-info">
                    <div className="content-text-info-items">
                        <div className="items">
                            <span className="company-text">{companyName}</span>
                            <span className="bus-model-text">{busModel}</span>
                            <span className="departure-time-title">Departure Time</span>
                            <span className="departure-time">{moment(tripStartDateTime).format("MMM DD, YYYY hh:mm A")}</span>
                        </div>
                    </div>
                </div>
            </div>
    </div>)
}
