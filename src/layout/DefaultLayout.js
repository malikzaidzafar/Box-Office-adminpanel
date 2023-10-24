import React from 'react'
import { AppContent, AppSidebar, AppHeader } from '../components/index'

const DefaultLayout = () => {
  const token = localStorage.getItem('token')
  return (
    <div>
      {token && <AppSidebar />}
      <div className="wrapper d-flex flex-column min-vh-100 bg-light">
        {token && <AppHeader />}
        <div className="body flex-grow-1 px-3">
          <AppContent />
        </div>
        {/* <AppFooter /> */}
      </div>
    </div>
  )
}

export default DefaultLayout
