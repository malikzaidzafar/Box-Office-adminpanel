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
  CFormInput,
  CModalFooter,
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CForm,
  CFormLabel,
} from '@coreui/react'
import { api } from 'src/api'
import { urls } from 'src/api/urls'
import CIcon from '@coreui/icons-react'
import { cilPen, cilTrash } from '@coreui/icons'

const Dashboard = () => {
  const [allUsers, setAllUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedUserIds, setSelectedUserIds] = useState([])
  const [visible, setVisible] = useState(false)
  const [sendMessage, setSendMessage] = useState({})
  const [userInfoVisible, setUserInfoVisible] = useState(false)
  const [userDetails, setUserDetails] = useState({})
  const [nameSortOrder, setNameSortOrder] = useState('desc')
  const [emailSortOrder, setEmailSortOrder] = useState('desc')
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

  const deleteProfileByAdmin = async (id) => {
    setLoading(true)
    try {
      const payload = {
        isDelete: true,
        userId: id,
      }
      const res = await api.put(urls.deleteProfileByAdmin, payload)
      if (res.status === 200) {
        alert('Profile is successfully deleted')
        fetchAllUsers()
      }
    } catch (error) {
      console.log({ error })
    }
    setLoading(false)
  }

  const deleteCoverByAdmin = async (id) => {
    setLoading(true)
    try {
      const payload = {
        isDelete: true,
        userId: id,
      }
      const res = await api.put(urls.deleteCoverByAdmin, payload)
      if (res.status === 200) {
        alert('Cover is successfully deleted')
        fetchAllUsers()
      }
    } catch (error) {
      console.log({ error })
    }
    setLoading(false)
  }

  const inActiveUser = async (id, isActive) => {
    setLoading(true)
    try {
      const payload = {
        isActive: isActive,
        userId: id,
      }
      const res = await api.put(urls.accountSetting, payload)
      if (res.status === 200) {
        alert('User account updated')
        fetchAllUsers()
      } else {
        alert(res.data.error)
      }
    } catch (error) {
      console.log({ error })
    }
    setLoading(false)
  }

  const handleCheckboxChange = (userId) => {
    const isSelected = selectedUserIds.includes(userId)
    if (!isSelected) {
      setSelectedUserIds([...selectedUserIds, userId])
    } else {
      setSelectedUserIds(selectedUserIds.filter((id) => id !== userId))
    }
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

  const handleSendMessage = async (event) => {
    event.preventDefault()
    setLoading(true)
    try {
      const payload = {
        message: sendMessage,
        userIds: selectedUserIds,
      }
      const res = await api.post(urls.sendMessageToUser, payload)
      if (res.status === 200) {
        alert(res.data.message)
        window.location.reload()
        fetchAllUsers()
        setVisible(false)
        selectedUserIds([])
      } else {
        alert(res.data.error)
      }
    } catch (error) {
      console.log({ error })
    }
    setLoading(false)
  }

  const handleUserDetail = async (id) => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const res = await api.get(`${urls.getUserProfileById}/${id}`, `Bearer ${token}`)
      if (res.status === 200) {
        setUserDetails(res.data.response)
        setUserInfoVisible(true)
      } else {
        alert('Your token is expire please login')
      }
    } catch (error) {
      console.log({ error })
    }
    setLoading(false)
  }

  const handleSortName = () => {
    const sorted = [...allUsers]
    const currentSortOrder = nameSortOrder === 'asc' ? 'desc' : 'asc'
    sorted.sort((a, b) => {
      return a.firstName.localeCompare(b.firstName) * (currentSortOrder === 'asc' ? 1 : -1)
    })

    setAllUsers(sorted)
    setNameSortOrder(currentSortOrder)
  }

  const handleSortEmail = () => {
    const sorted = [...allUsers]
    const currentSortOrder = emailSortOrder === 'asc' ? 'desc' : 'asc'
    sorted.sort((a, b) => {
      return a.email.localeCompare(b.email) * (currentSortOrder === 'asc' ? 1 : -1)
    })

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
                <CTableHeaderCell>Send Message</CTableHeaderCell>
                <CTableHeaderCell onClick={handleSortName}>
                  Full Name {nameSortOrder === 'asc' ? '↑' : '↓'}
                </CTableHeaderCell>
                <CTableHeaderCell onClick={handleSortEmail}>
                  Email {emailSortOrder === 'asc' ? '↑' : '↓'}
                </CTableHeaderCell>
                <CTableHeaderCell>Profile picture</CTableHeaderCell>
                <CTableHeaderCell>Cover picture</CTableHeaderCell>
                <CTableHeaderCell>Is-Active</CTableHeaderCell>
                <CTableHeaderCell>Activate/Deactivate</CTableHeaderCell>
                <CTableHeaderCell>View Details</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              <CButton
                color="primary"
                onClick={() => setVisible(true)}
                disabled={selectedUserIds?.length === 0}
                style={{ margin: '10px' }}
              >
                Send Message
              </CButton>

              {allUsers?.map((user, index) => (
                <CTableRow v-for="item in tableItems" key={user?._id}>
                  <CTableDataCell>
                    <input
                      type="checkbox"
                      checked={selectedUserIds?.includes(user?._id)}
                      onChange={() => handleCheckboxChange(user?._id)}
                    />
                  </CTableDataCell>
                  <CTableDataCell>
                    <div>{user?.firstName}</div>
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
                      <button
                        style={{ border: 'none', background: 'none' }}
                        disabled={!user?.userInfo?.avatarUrl}
                      >
                        <CIcon
                          onClick={() => deleteProfileByAdmin(user?._id)}
                          icon={cilTrash}
                          color="red"
                        />
                      </button>
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
                      <button
                        style={{ border: 'none', background: 'none' }}
                        disabled={!user?.userInfo?.coverImgUrl}
                      >
                        <CIcon
                          onClick={() => deleteCoverByAdmin(user?._id)}
                          icon={cilTrash}
                          color="red"
                        />
                      </button>
                    </div>
                  </CTableDataCell>
                  <CTableDataCell>
                    <div>{user?.isActive ? 'True' : 'False'}</div>
                  </CTableDataCell>
                  <CTableDataCell>
                    <button disabled={user.isActive} style={{ border: 'none', background: 'none' }}>
                      <CIcon
                        style={{ marginLeft: 20 }}
                        onClick={() => inActiveUser(user?._id, true)}
                        icon={cilPen}
                        color="red"
                      />
                    </button>
                    <button
                      disabled={!user.isActive}
                      style={{ border: 'none', background: 'none' }}
                    >
                      <CIcon
                        onClick={() => inActiveUser(user?._id, false)}
                        icon={cilTrash}
                        color="red"
                      />
                    </button>
                  </CTableDataCell>
                  <CTableDataCell>
                    <button
                      onClick={() => handleUserDetail(user?._id)}
                      style={{
                        border: 'none',
                        background: 'none',
                        textDecoration: 'underLine',
                        color: 'blue',
                      }}
                    >
                      View
                    </button>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </CCol>
      </CRow>
      <CModal visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader>
          <CModalTitle>Send Message</CModalTitle>
        </CModalHeader>
        <CForm onSubmit={handleSendMessage}>
          <div className="m-3">
            <CFormLabel htmlFor="exampleFormControlInput2">Enter Title</CFormLabel>
            <CFormInput
              required
              value={sendMessage?.title}
              onChange={(e) => {
                setSendMessage({ ...sendMessage, title: e.target.value })
              }}
            />
          </div>
          <div className="m-3">
            <CFormLabel htmlFor="exampleFormControlInput2">Enter Description</CFormLabel>
            <CFormInput
              required
              value={sendMessage?.description}
              onChange={(e) => {
                setSendMessage({ ...sendMessage, description: e.target.value })
              }}
            />
          </div>
          <CModalFooter>
            <CButton color="secondary" onClick={() => setVisible(false)}>
              Close
            </CButton>

            <CButton color="primary" type="submit" disabled={loading}>
              Send Message{' '}
            </CButton>
          </CModalFooter>
        </CForm>
      </CModal>
      <CModal visible={userInfoVisible} onClose={() => setUserInfoVisible(false)}>
        <CModalHeader>
          <CModalTitle>User Details</CModalTitle>
        </CModalHeader>
        <CForm>
          <div className="m-3">
            <CTable>
              <CTableHead>
                <CTableHeaderCell> Total Trophies </CTableHeaderCell>
                <CTableDataCell>
                  {userDetails?.silverTrophies +
                    userDetails?.goldenTrophies +
                    userDetails?.bronzeTrophies}
                </CTableDataCell>
              </CTableHead>
              <CTableHead>
                <CTableHeaderCell> Earn Badges </CTableHeaderCell>
                <CTableDataCell>{userDetails?.badges?.length}</CTableDataCell>
              </CTableHead>
              <CTableHead>
                <CTableHeaderCell> Highest Rank </CTableHeaderCell>
                <CTableDataCell>{userDetails?.highestRank}</CTableDataCell>
              </CTableHead>
            </CTable>
          </div>
          <CModalFooter>
            <CButton color="secondary" onClick={() => setUserInfoVisible(false)}>
              Close
            </CButton>
          </CModalFooter>
        </CForm>
      </CModal>
    </>
  )
}

export default Dashboard
