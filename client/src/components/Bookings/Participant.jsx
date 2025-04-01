import React from 'react'
import "./BookingStatusCard.css"
import Delete from '../../assets/delete.png'

const Participant = ({emails}) => {
  return (
     <div className="modal-overlay">
         <div className="modal-content">
           {/* Header Section */}
           <div className="card-header">
             <h3>Participants <span style={{ color: "#B6B6B6" }}>({emails.length})</span></h3>
                <img src={Delete} alt="delete" />
           </div>
   
           {/* Participants List */}
           <ul className="participants-list">
             {emails.map((emailObj, index) => (
               <li key={index} className="participant">
                 <div className="participant-info">
                   <div className="participant-circle"></div>
                   <span style={{ color: "#808080" }}>{`${emailObj?.firstName}${emailObj?.lastName}` || emailObj?.email}</span>
                   <input type="checkbox"
                     checked={emailObj.status === "accepted"} 
                     disabled={emailObj.status === "accepted"} 
                   />
                 </div>
               </li>
             ))}
           </ul>
         </div>
       </div>
  )
}

export default Participant
