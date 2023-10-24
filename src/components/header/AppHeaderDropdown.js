import React from 'react'
import { CAvatar, CDropdown, CDropdownItem, CDropdownMenu, CDropdownToggle } from '@coreui/react'
import { cilLockLocked } from '@coreui/icons'
import CIcon from '@coreui/icons-react'

import { useNavigate } from 'react-router-dom'

const AppHeaderDropdown = () => {
  const nav = useNavigate()
  const handleLogout = () => {
    localStorage.removeItem('token')
    nav('/login')
  }
  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0" caret={false}>
        <CAvatar src={'https://cvbay.com/wp-content/uploads/2017/03/dummy-image.jpg'} size="md" />
      </CDropdownToggle>
      <CDropdownMenu>
        <CDropdownItem onClick={handleLogout} href="#">
          <CIcon icon={cilLockLocked} className="me-2" />
          Logout
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown
