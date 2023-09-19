import React from 'react'
import { cilNotes, cilPuzzle } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { CNavGroup, CNavItem } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Users',
    to: '/users',
  },
  {
    component: CNavItem,
    name: 'Goal Images',
    to: '/goal-images',
  },
  {
    component: CNavGroup,
    name: 'Boosts',
    icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Add Boost',
        to: '/add-boost',
      },
      {
        component: CNavItem,
        name: 'All Boosts',
        to: '/all-boosts',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Inspiration',
    icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Sort Titles',
        to: '/titles',
      },
      {
        component: CNavItem,
        name: 'Format',
        to: '/formats',
      },
      {
        component: CNavItem,
        name: 'Add Inspiration',
        to: '/add-inspiration',
      },
      {
        component: CNavItem,
        name: 'All Inspirations',
        to: '/all-inspirations',
      },
    ],
  },
]

export default _nav
