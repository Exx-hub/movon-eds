import React from 'react';
import './scheduletrips.scss';
import {Pagination, Row, Col, Card} from 'antd';
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
                <DetailsView key={1} onClick={()=>props.onSelect(0)}/>
                <DetailsView key={2} onClick={()=>props.onSelect(1)}/>
                <DetailsView key={3} onClick={()=>props.onSelect(2)}/>
                <DetailsView key={4} onClick={()=>props.onSelect(3)}/>
                <DetailsView key={5} onClick={()=>props.onSelect(4)}/>
                <DetailsView key={6} onClick={()=>props.onSelect(5)}/>
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
        <Row>
            <Col span={1} style={{height:'100px'}}>
                <img style={{height:'100px'}} src={pin} />
            </Col>
            <Col span={4} style={{height:'100px'}}>
                <div className="list-content">
                    <span style={{fontSize:'20px', fontWeight:'400', color:'#fff'}}> Naga</span>   
                    <span style={{fontSize:'20px', fontWeight:'400', color:'#fff'}}> Cubao</span>   
                </div>
            </Col>
            <Col offset={2} span={4} style={{height:'100px'}}>
                <div className="list-content">
                    <span style={{fontSize:'20px', fontWeight:'100', color:'#fff'}} > Bus Model</span>   
                    <span style={{fontSize:'20px', fontWeight:'100', color:'#fff'}}> Company</span>   
                </div>
            </Col>
            <Col offset={2} style={{height:'100px'}}>
                <div className="list-content">
                    <span style={{fontSize:'20px', fontWeight:'100', color:'#fff'}}> Departure Time</span>   
                    <span style={{fontSize:'30px', fontWeight:'100', color:'#fff'}}> 02:52 AM - Jun 30, 2020</span>   
                </div>
            </Col>
        </Row>
       

    </div>)
}