import React from 'react'
import { cilNotes, cilSoccer, cilUser } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { CNavGroup, CNavItem } from '@coreui/react'

const _nav = [
  {
    component: CNavGroup,
    name: 'Users',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'User Information',
        to: '/users',
      },
      {
        component: CNavItem,
        name: 'Users Message',
        to: '/user-message',
      },
    ],
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
  {
    component: CNavGroup,
    name: 'Leaderboard',
    icon: <CIcon icon={cilSoccer} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Week',
        to: '/weekly-score',
      },
      {
        component: CNavItem,
        name: 'Quarter',
        to: '/seasonal-score',
      },
      {
        component: CNavItem,
        name: 'Year',
        to: '/yearly-score',
      },
    ],
  },
]

export default _nav
