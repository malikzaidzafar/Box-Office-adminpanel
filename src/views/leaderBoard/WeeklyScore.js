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
  CFormLabel,
} from '@coreui/react'
import { api } from 'src/api'
import { urls } from 'src/api/urls'
import moment from 'moment'

const WeeklyScore = () => {
  const currentDate = new Date()
  currentDate.setDate(currentDate.getDate() - 7)
  const [weeklyScore, setWeeklyScore] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedDate, setSelectedDate] = useState(currentDate)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const getPreviousFridayDate = (selectedDate) => {
    const date = new Date(selectedDate)
    const dayOfWeek = date.getDay()
    const daysToFriday = (dayOfWeek + 7 - 5) % 7
    date.setDate(date.getDate() - daysToFriday)
    setStartDate(moment(date).format('YYYY-MM-DD'))
  }

  const getNextThursdayDate = (selectedDate) => {
    const date = new Date(selectedDate)
    const dayOfWeek = date.getDay()
    const daysToAdd = dayOfWeek <= 4 ? 4 - dayOfWeek : 11 - dayOfWeek
    date.setDate(date.getDate() + daysToAdd)
    setEndDate(moment(date).format('YYYY-MM-DD'))
  }

  useEffect(() => {
    getPreviousFridayDate(selectedDate)
    getNextThursdayDate(selectedDate)
  }, [])

  console.log('seleted Year:', selectedDate)

  useEffect(() => {
    fetchWeeklyScore()
  }, [selectedDate, startDate, endDate])

  const fetchWeeklyScore = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const payload = {
        startDate: startDate,
        endDate: endDate,
      }
      const res = await api.post(urls.getWeeklyScore, payload, token)
      if (res.status === 200) {
        setWeeklyScore(res.data?.response)
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
                <CTableHeaderCell>User profile</CTableHeaderCell>
                <CTableHeaderCell>Weekly Score</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              <div>
                <CFormInput
                  onChange={(e) => {
                    setSelectedDate(e.target.value)
                    getPreviousFridayDate(e.target.value)
                    getNextThursdayDate(e.target.value)
                  }}
                  style={{ margin: '10px' }}
                  type="Date"
                  value={moment(selectedDate).format('YYYY-MM-DD')}
                />
              </div>
              {weeklyScore.length > 0 ? (
                weeklyScore.map((score, index) => (
                  <CTableRow key={score?._id}>
                    <CTableDataCell>
                      <div>{score?.name}</div>
                    </CTableDataCell>
                    <CTableDataCell>
                      <div>
                        <CImage
                          src={score?.avatarUrl ? score?.avatarUrl : '/profile.jfif'}
                          height={100}
                          width={100}
                        />
                      </div>
                    </CTableDataCell>
                    <CTableDataCell>
                      <div>
                        {score?.score} / {score?.totalScore}
                      </div>
                    </CTableDataCell>
                  </CTableRow>
                ))
              ) : (
                <h3 style={{ textAlign: 'center' }}>No score available for this week</h3>
              )}
            </CTableBody>
          </CTable>
        </CCol>
      </CRow>
    </>
  )
}

export default WeeklyScore
