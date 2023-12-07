import React from 'react'
import Sidebar from '../global/Sidebar'
import Topbar from '../global/Topbar'
import { Outlet } from 'react-router-dom'

const Manager = () => {
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

export default Manager
