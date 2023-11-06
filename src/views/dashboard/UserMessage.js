import React, { useEffect, useState } from 'react'
import {
  CCardHeader,
  CCol,
  CRow,
  CSpinner,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { api } from 'src/api'
import { urls } from 'src/api/urls'

const UserMessage = () => {
  const [allUsers, setAllUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [nameSortOrder, setNameSortOrder] = useState('desc')
  const [emailSortOrder, setEmailSortOrder] = useState('desc')

  useEffect(() => {
    fetAllUserMessage()
  }, [])

  const fetAllUserMessage = async () => {
    setLoading(true)
    try {
      const res = await api.get(urls.getAllUserMessage)
      if (res.status === 200) {
        setAllUsers(res.data?.response)
      }
    } catch (error) {
      console.log({ error })
    }
    setLoading(false)
  }

  const renderSpinnerOverlay = () => {
    if (loading) {
      return (
        <div className="spinner-overlay">
          <div className="d-flex align-items-center justify-content-center h-100">
            <CSpinner color="primary" size="xl" />
          </div>
        </div>
      )
    }
    return null
  }

  const handleSortName = () => {
    const sorted = [...allUsers]
    const currentSortOrder = nameSortOrder === 'asc' ? 'desc' : 'asc'

    sorted.sort(
      (a, b) =>
        a.userId.firstName.localeCompare(b.userId.firstName) *
        (currentSortOrder === 'asc' ? 1 : -1),
    )

    setAllUsers(sorted)
    setNameSortOrder(currentSortOrder)
  }

  const handleSortEmail = () => {
    const sorted = [...allUsers]
    const currentSortOrder = emailSortOrder === 'asc' ? 'desc' : 'asc'

    sorted.sort(
      (a, b) =>
        a.userId.email.localeCompare(b.userId.email) * (currentSortOrder === 'asc' ? 1 : -1),
    )

    setAllUsers(sorted)
    setEmailSortOrder(currentSortOrder)
  }

  return (
    <>
      {renderSpinnerOverlay()}
      <CRow>
        <CCol xs>
          <CCardHeader>Users</CCardHeader>
          <CTable align="middle" className="mb-0 border" hover responsive>
            <CTableHead color="light">
              <CTableRow>
                <CTableHeaderCell onClick={handleSortName}>
                  Full Name {nameSortOrder === 'asc' ? '↑' : '↓'}
                </CTableHeaderCell>
                <CTableHeaderCell onClick={handleSortEmail}>
                  Email {emailSortOrder === 'asc' ? '↑' : '↓'}
                </CTableHeaderCell>
                <CTableHeaderCell>User Message</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {allUsers?.map((user, index) => (
                <CTableRow v-for="item in tableItems" key={user?._id}>
                  <CTableDataCell>
                    <div>{user?.userId?.firstName}</div>
                  </CTableDataCell>
                  <CTableDataCell>
                    <div>{user?.userId?.email}</div>
                  </CTableDataCell>
                  <CTableDataCell>
                    <div>{user?.message}</div>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </CCol>
      </CRow>
    </>
  )
}

export default UserMessage
