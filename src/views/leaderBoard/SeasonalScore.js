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
  CFormSelect,
} from '@coreui/react'
import { api } from 'src/api'
import { urls } from 'src/api/urls'

const SeasonalScore = () => {
  const [seasonalScore, setSeasonalScore] = useState([])
  const [loading, setLoading] = useState(false)
  const currentYear = new Date().getFullYear()
  const quarters = ['Quarter-1', 'Quarter-2', 'Quarter-3', 'Quarter-4']
  const [selectedQuarter, setSelectedQuarter] = useState(2)
  const [selectedYear, setSelectedYear] = useState(currentYear)

  // Handle quarter selection
  const handleQuarterChange = (e) => {
    setSelectedQuarter(parseInt(e.target.value, 10))
  }

  useEffect(() => {
    fetchSeasonalScore()
  }, [selectedQuarter, selectedYear])

  const fetchSeasonalScore = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const payload = {
        quarter: selectedQuarter,
        year: selectedYear,
      }
      const res = await api.post(urls.getSeasonalScore, payload, token)
      if (res.status === 200) {
        setSeasonalScore(res.data?.response)
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
                <CTableHeaderCell>Seasonal Score</CTableHeaderCell>
                <CTableHeaderCell>Total Score</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              <div
                style={{
                  display: 'flex',
                  margin: '5px',
                  borderRadius: '5px',
                  background: 'white',
                  width: '400px',
                }}
              >
                <div>
                  <label>Select Quarter:</label>
                  <CFormSelect
                    name="quarter"
                    value={selectedQuarter}
                    onChange={handleQuarterChange}
                  >
                    {quarters.map((quarter, index) => (
                      <option key={index} value={index + 1}>
                        {quarter}
                      </option>
                    ))}
                  </CFormSelect>
                </div>
                <div>
                  <label>Select Year:</label>
                  <CFormInput
                    type="Number"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                  />
                </div>
              </div>
              {seasonalScore.length > 0 ? (
                seasonalScore.map((score, index) => (
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
                      <div>{score?.score}</div>
                    </CTableDataCell>
                    <CTableDataCell>
                      <div>{score?.totalScore}</div>
                    </CTableDataCell>
                  </CTableRow>
                ))
              ) : (
                <h3 style={{ textAlign: 'center' }}>No score available for this quarter</h3>
              )}
            </CTableBody>
          </CTable>
        </CCol>
      </CRow>
    </>
  )
}

export default SeasonalScore
