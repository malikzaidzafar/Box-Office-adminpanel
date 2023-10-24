import React, { Suspense, useLayoutEffect } from 'react'
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import { CContainer, CSpinner } from '@coreui/react'

// routes config
import routes from '../routes'

const AppContent = () => {
  const token = localStorage.getItem('token')
  const nav = useNavigate()
  useLayoutEffect(() => {
    if (!token) {
      nav('/login')
    }
  }, [token, nav])

  return (
    <CContainer lg>
      <Suspense fallback={<CSpinner color="primary" />}>
        <Routes>
          {routes.map((route, idx) => {
            return (
              route.element && (
                <Route
                  key={idx}
                  path={route.path}
                  exact={route.exact}
                  name={route.name}
                  element={<route.element />}
                />
              )
            )
          })}
          {token && <Route path="/" element={<Navigate to="users" replace />} />}
        </Routes>
      </Suspense>
    </CContainer>
  )
}

export default React.memo(AppContent)
