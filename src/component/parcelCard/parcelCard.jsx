import React from 'react';
import './parcelCard.scss';

export const ParcelCard = (props) => {
      const{
        qrcode,
        description,
        sender,
        receiver,
        qty,
        travelStatus,
        packageImg
    }=props.value

  return (<div className="component-parcel-card"
    onClick={() => props.onSelect(props.value)}
  >
    <img className="parcel-image" src={packageImg[0]} alt="parcel"/>

    <div className="parcel-card-top-title">
      <div className="my-space my-col-1">
        <span className="description-txt">{description}</span>
        <span className="qr-code-txt">{qrcode}</span>
      </div>

      <div className="my-space my-col-2">
        <div className="my-space-direction-row my-col-2">
          <span className='txt-1 label'>Sender :</span>
          <span className='txt-2'>{sender}</span>
        </div> 
        <div className="my-space-direction-row">
            <span className='txt-1 label'>Recipient :</span>
            <span className='txt-2'>{receiver}</span>
        </div> 
      </div>
      
      <div className="my-space-direction-row my-col-3">
        <span className='txt-1'>{qty}</span>
        <span className='txt-2'>{` package${qty > 1 ? 's' : ''}`}</span>
        <span className='txt-3'> - </span>
        <span className='txt-4'>{travelStatus}</span>
      </div>
    </div>

  </div>)
}