import React from 'react'
import { Outlet } from 'react-router-dom'
import Topbar from '../global/Topbar'
import Sidebar from '../global/Sidebar'

const Employee = () => {
  return (
      <div className="App">
          <Sidebar/>
          <main className='content'>
            <Topbar/>
            <Outlet/>
          </main>
        </div>
  )
}

export default Employee
