import React from 'react'
import { useLocation } from 'react-router-dom'

const PdfGeneration = () => {
    const data = useLocation()
    
    console.log(data)
  return (
    <div className='pdf'>
        <p>xxxxxxxxxxx</p>
      <h1>dddddddddsdddd</h1>
    </div>
  )
}

export default PdfGeneration
