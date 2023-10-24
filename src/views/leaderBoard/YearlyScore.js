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
} from '@coreui/react'
import { api } from 'src/api'
import { urls } from 'src/api/urls'

const YearlyScore = () => {
  const [weeklyScore, setWeeklyScore] = useState([])
  const [loading, setLoading] = useState(false)
  const currentYear = new Date().getFullYear()
  const [selectedYear, setSelectedYear] = useState(currentYear)

  useEffect(() => {
    const fetchYearlyScore = async () => {
      setLoading(true)
      try {
        const token = localStorage.getItem('token')
        const payload = {
          year: selectedYear,
        }
        const res = await api.post(urls.getYearlyScore, payload, token)
        if (res.status === 200) {
          setWeeklyScore(res.data?.response)
        }
      } catch (error) {
        console.log({ error })
      }
      setLoading(false)
    }

    fetchYearlyScore()
  }, [selectedYear])

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
                <CTableHeaderCell>Yearly Score</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              <div
                style={{
                  margin: '5px',
                  width: '200px',
                  background: 'white',
                  borderRadius: '5px',
                  padding: '3px',
                }}
              >
                <label>Select Year:</label>
                <CFormInput
                  type="Number"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
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
                <h3 style={{ textAlign: 'center' }}>No score available for this year</h3>
              )}
            </CTableBody>
          </CTable>
        </CCol>
      </CRow>
    </>
  )
}

export default YearlyScore
