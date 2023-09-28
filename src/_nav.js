import React from 'react'
import { cilNotes } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { CNavGroup, CNavItem } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Users',
    to: '/users',
  },
  {
    component: CNavGroup,
    name: 'Movies',
    icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Add Movies',
        to: '/add-movies',
      },
      {
        component: CNavItem,
        name: 'All Movies',
        to: '/all-movies',
      },
    ],
  },
]

export default _nav
