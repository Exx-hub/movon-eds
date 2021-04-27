import React from 'react';
import './scheduletrips.scss';
import pin from '../../assets/destinationpin.png'
import moment from 'moment';
import ParcelService from '../../service/Parcel'

 class ScheduledTrips extends React.Component{
    // <DetailsView data={props.selectedDestination} {...props} onClick={()=>props.onSelect(props.selectedDestination)}/>
  

    state={
        tripOption:[],
        trips:undefined, 
    }

    componentDidMount(){
    ParcelService.getTrips("stationId")
    .then(e=>{
         const{data, success, errorCode}= e.data;
          if(success){
            if(data.trips){
              let _myOption =[] 
    
              data.trips.data.forEach(e=>{
                  if(this.props.endStation === e.endStation._id){
                    _myOption.push({
                        name:e.endStation.name,
                        value:e.endStation._id,
                        startStationId:e.startStation._id,
                        startStationName: e.startStation.name,
                        companyId:e.busCompanyId._id,
                        companyName: e.busCompanyId.name,
                        tripStartDateTime: e.tripStartDateTime,
                        busModel:e.bus.busModel,
                        busId:e.bus.busId,
                        tripsId:e._id,
                        endStation:e.endStation._id
                      })
                  }
              })
             
            //   let clean=[]
            //   _myOption = _myOption.filter(e=>{
            //     if(!clean.includes(e.value)){
            //       clean.push(e.value)
            //       return true
            //     }
            //     return false;
            //   })
    
              this.setState({
                tripOption:_myOption,
                trips:data.trips.data, 
              })
              
           }
          }
          else{
            this.handleErrorNotification(errorCode)
          }
        })
    }

    render(){
        return(
            <div className="component-scheduled-trips">
                <div className="details-view-parent-container">
                    <div className="list-title">
                        <h2>Select Trip</h2>
                        <span>{moment().format("hh:ss A - MMM DD, YYYY")}</span>
                    </div>
                    {
                        this.state.tripOption.map((e,i)=>(<DetailsView data={e}  key={i} onClick={()=>this.props.onSelect(e)}/>))
                    }
                </div>
            </div>)
    }

    
}

const DetailsView = (props) =>{

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
                        <span style={{flexGrow:1}}>{startStationName === "DLTB Cubao" ? "DLTB GMA" : startStationName}</span>
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

export default ScheduledTrips;
