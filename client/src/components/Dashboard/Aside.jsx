import React from 'react'
import './Aside.css'

const Aside = ({aside ,isActive, onClick}) => {
  return (
    <div className={`aside-container ${isActive ? "active" : ""}`} onClick={onClick}>
      <img src={aside.img} alt={aside.title} />
      <span>{aside.title}</span> 
    </div>
  )
}

export default Aside
