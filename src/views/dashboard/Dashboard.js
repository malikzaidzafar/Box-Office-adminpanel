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
  CImage,
} from '@coreui/react'
import { api } from 'src/api'
import { urls } from 'src/api/urls'
import CIcon from '@coreui/icons-react'
import { cilPen, cilTrash } from '@coreui/icons'

const Dashboard = () => {
  const [allUsers, setAllUsers] = useState([])
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    fetchAllUsers()
  }, [])

  const fetchAllUsers = async () => {
    setLoading(true)
    try {
      const res = await api.get(urls.getAllUsers)
      if (res.status === 200) {
        setAllUsers(res.data?.allUsers)
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

  return (
    <>
      {renderSpinnerOverlay()}
      <CRow>
        <CCol xs>
          <CCardHeader>Users</CCardHeader>
          <CTable align="middle" className="mb-0 border" hover responsive>
            <CTableHead color="light">
              <CTableRow>
                <CTableHeaderCell>Full Name</CTableHeaderCell>
                <CTableHeaderCell>Email</CTableHeaderCell>
                <CTableHeaderCell>Profile picture</CTableHeaderCell>
                <CTableHeaderCell>Cover picture</CTableHeaderCell>
                <CTableHeaderCell>Is Active</CTableHeaderCell>
                <CTableHeaderCell>OTP</CTableHeaderCell>
                <CTableHeaderCell>Actions</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {allUsers.map((user, index) => (
                <CTableRow v-for="item in tableItems" key={user?._id}>
                  <CTableDataCell>
                    <div>{user.firstName}</div>
                  </CTableDataCell>
                  <CTableDataCell>
                    <div>{user?.email}</div>
                  </CTableDataCell>
                  <CTableDataCell>
                    <div>
                      <CImage
                        src={
                          user?.userInfo?.avatarUrl ? user?.userInfo?.avatarUrl : '/profile.jfif'
                        }
                        height={100}
                        width={100}
                      />
                    </div>
                  </CTableDataCell>
                  <CTableDataCell>
                    <div>
                      <CImage
                        src={
                          user?.userInfo?.coverImgUrl
                            ? user?.userInfo?.coverImgUrl
                            : '/profile.jfif'
                        }
                        height={100}
                        width={100}
                      />
                    </div>
                  </CTableDataCell>
                  <CTableDataCell>
                    <div>{user?.isActive ? 'True' : 'False'}</div>
                  </CTableDataCell>
                  <CTableDataCell>
                    <div>{user?.otp}</div>
                  </CTableDataCell>
                  <CTableDataCell>
                    <CIcon
                      // onClick={() => handleDeleteMovie(item?._id)}
                      icon={cilTrash}
                      color="red"
                    />
                    <CIcon
                      style={{ marginLeft: 20 }}
                      // onClick={() => handleModalVisible(item)}
                      icon={cilPen}
                      color="red"
                    />
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

export default Dashboard
