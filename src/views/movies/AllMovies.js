import React, { useEffect, useState } from 'react'
import {
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CModal,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CButton,
  CImage,
  CFormInput,
  CForm,
  CSpinner,
  CFormLabel,
} from '@coreui/react'
import { api } from 'src/api'
import { urls } from 'src/api/urls'
import CIcon from '@coreui/icons-react'
import { cilPen, cilTrash } from '@coreui/icons'
import { useNavigate } from 'react-router-dom'

const AllMovies = () => {
  const [allMovies, setAllMovies] = useState([])
  const [visible, setVisible] = useState(false)
  const [modalData, setModalData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [firstNumber, setFirstNumber] = useState(0)
  const [secondNumber, setSecondNumber] = useState(15)
  const [showData, setShowData] = useState([])
  const [startDateSortOrder, setStartDateSortOrder] = useState('desc')
  const [endDateSortOrder, setEndDateSortOrder] = useState('desc')
  const [movieTitleOrder, setMovieTitleOrder] = useState('desc')
  const navigate = useNavigate()

  const handlePrevious = (e) => {
    e.preventDefault()
    setFirstNumber(firstNumber - 15)
    setSecondNumber(secondNumber - 15)
  }

  const handleNext = (e) => {
    e.preventDefault()
    setFirstNumber(firstNumber + 15)
    setSecondNumber(secondNumber + 15)
  }

  useEffect(() => {
    fetchallMovies()
  }, [])

  const handleModalVisible = (item) => {
    setModalData(item)
    setVisible(true)
  }

  const fetchallMovies = async () => {
    try {
      setLoading(true)
      const response = await api.get(urls?.getAllMovies)
      if (response.status === 200) {
        setAllMovies(response.data?.response)
      }
    } catch (error) {
      setAllMovies([])
    }
    setLoading(false)
  }

  useEffect(() => {
    if (Array.isArray(allMovies)) {
      setShowData(allMovies?.slice(firstNumber, secondNumber))
    }
  }, [allMovies, firstNumber, secondNumber])

  const handleUpdateMovie = async (event) => {
    event.preventDefault()
    const headers = {
      'Content-Type': 'multipart/form-data',
    }
    try {
      const formData = new FormData()
      formData.append('title', modalData?.title)
      if (modalData?.movieThumbnail?.name) {
        formData.append('movieThumbnail', modalData?.movieThumbnail)
      }
      formData.append(`startFrom`, modalData?.startFrom?.substring(0, 10))
      formData.append(`endTo`, modalData?.endTo?.substring(0, 10))
      if (modalData.grossRevenue) {
        const revenue = parseFloat(modalData.grossRevenue) * 1_000_000
        formData.append('grossRevenue', revenue)
      }
      setLoading(true)
      const res = await api.put(`${urls.editMovie}/${modalData?._id}`, formData, {
        headers: headers,
      })
      if (res.status === 200) {
        setVisible(false)
        fetchallMovies()
      } else {
        alert(res.data.error)
      }
    } catch (error) {
      console.log({ error })
    }
    setLoading(false)
  }

  const handleDeleteMovie = async (movieId) => {
    setLoading(true)
    try {
      const res = await api.delete(`${urls.deleteMovie}/${movieId}`)
      if (res.status === 200) {
        alert(res.data.message)
        fetchallMovies()
      } else {
        alert(res.data.error)
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

  const handleTitleSort = () => {
    const sorted = [...allMovies]
    let newSortOrder

    if (movieTitleOrder === 'asc') {
      newSortOrder = 'desc'
    } else {
      newSortOrder = 'asc'
    }

    sorted.sort((a, b) => {
      return a.title.localeCompare(b.title) * (newSortOrder === 'asc' ? 1 : -1)
    })

    setAllMovies(sorted)
    setMovieTitleOrder(newSortOrder)
  }

  const handleStartDate = () => {
    const sorted = [...showData]

    const currentSortOrder = startDateSortOrder === 'asc' ? 'desc' : 'asc'

    sorted.sort((a, b) => {
      const dateA = new Date(a.startFrom)
      const dateB = new Date(b.startFrom)
      return (dateA - dateB) * (currentSortOrder === 'asc' ? 1 : -1)
    })
    setShowData(sorted)
    setStartDateSortOrder(currentSortOrder)
  }

  const [revenue, setRevenue] = useState({})
  const [updatingId, setUpdatingId] = useState(null)

  const updaterevenue_function = async (movieId, grossRevenue) => {
    try {
      setUpdatingId(movieId)

      const token = localStorage.getItem('token')
      const payload = {
        movieId: movieId,
        actualRevenue: parseFloat(grossRevenue) * 1_000_000,
      }

      const res = await api.post(urls.updaterevenue, payload, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })

      if (res.status === 200) {
        alert('Revenue updated Successfully')
        console.log(res)
        await fetchallMovies()
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert('Your token is expired, please login')
        localStorage.removeItem('token')
        navigate('/login')
      } else {
        console.log('Error updating revenue:', error)
        alert('Something went wrong while updating revenue.')
      }
    } finally {
      setUpdatingId(null)
    }
  }

  function Convertto_Million(number) {
    return number / 1_000_000
  }

  const handleEndtDate = () => {
    const sorted = [...showData]

    const currentSortOrder = endDateSortOrder === 'asc' ? 'desc' : 'asc'
    sorted.sort((a, b) => {
      const dateA = new Date(a.endTo)
      const dateB = new Date(b.endTo)
      return (dateA - dateB) * (currentSortOrder === 'asc' ? 1 : -1)
    })

    setShowData(sorted)
    setEndDateSortOrder(currentSortOrder)
  }
  console.log('modalData', modalData)


  return (
    <>
      {renderSpinnerOverlay()}
      <CRow>
        <CCol xs>
          <CCardHeader>All Movies</CCardHeader>
          <CTable align="middle" className="mb-0 border" hover responsive>
            <CTableHead color="light">
              <CTableRow>
                <CTableHeaderCell onClick={handleTitleSort}>
                  Movie Title {movieTitleOrder === 'asc' ? '↑' : '↓'}
                </CTableHeaderCell>
                <CTableHeaderCell>Image</CTableHeaderCell>
                <CTableHeaderCell>Week Number</CTableHeaderCell>
                <CTableHeaderCell onClick={handleStartDate}>
                  Start Date {startDateSortOrder === 'asc' ? '↑' : '↓'}
                </CTableHeaderCell>
                <CTableHeaderCell onClick={handleEndtDate}>
                  End Date {endDateSortOrder === 'asc' ? '↑' : '↓'}
                </CTableHeaderCell>
                <CTableHeaderCell>Gross Revenue</CTableHeaderCell>
                <CTableHeaderCell>Actions</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              <CButton
                color="primary"
                onClick={() => navigate('/add-movies')}
                style={{ margin: '10px' }}
              >
                Add New Movie
              </CButton>
              {showData?.map((item, index) => (
                <CTableRow v-for="item in tableItems" key={item._id}>
                  <CTableDataCell>
                    <div>{item?.title}</div>
                  </CTableDataCell>
                  <CTableDataCell>
                    <img src={item?.movieThumbnail} alt="movie Pic" width={100} height={100} />
                  </CTableDataCell>
                  <CTableDataCell>
                    <div>{item?.weekId?.weekNumber}</div>
                  </CTableDataCell>
                  <CTableDataCell>
                    <div>{new Date(item?.startFrom).toLocaleDateString()}</div>
                  </CTableDataCell>
                  <CTableDataCell>
                    <div>{new Date(item?.endTo).toLocaleDateString()}</div>
                  </CTableDataCell>
                  <CTableDataCell>
                    {item.grossRevenue != null ? (
                      <p>{Convertto_Million(item.grossRevenue)}M</p>
                    ) : (
                      <form
                        onSubmit={(e) => {
                          e.preventDefault()
                          if (!revenue[item._id] || isNaN(revenue[item._id])) {
                            alert('Please enter a valid number')
                            return
                          }
                          updaterevenue_function(item._id, revenue[item._id])
                        }}
                      >
                        <label style={{display : 'block'}}>Enter Rvenue (In Millions) </label>
                        <input
                          placeholder="enter here"
                          className="w-[60%]"
                          value={revenue[item._id] || ''}
                          onChange={(e) =>
                            setRevenue((prev) => ({
                              ...prev,
                              [item._id]: e.target.value,
                            }))
                          }
                          disabled={updatingId === item._id}
                        />
                        <button
                          type="submit"
                          className="w-[25%] btn btn-primary"
                          disabled={updatingId === item._id}
                        >
                          {updatingId === item._id ? 'Updating...' : 'Submit'}
                        </button>
                      </form>
                    )}
                  </CTableDataCell>



                  <CTableDataCell>
                    <CIcon
                      onClick={() => handleDeleteMovie(item?._id)}
                      icon={cilTrash}
                      color="red"
                    />
                    <CIcon
                      style={{ marginLeft: 20 }}
                      onClick={() => handleModalVisible(item)}
                      icon={cilPen}
                      color="red"
                    />
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: '30px',
              marginBottom: '50px',
            }}
          >
            <CButton disabled={firstNumber <= 0} color="primary" onClick={handlePrevious}>
              Previous
            </CButton>
            <CButton
              disabled={secondNumber > allMovies.length}
              color="primary"
              onClick={handleNext}
            >
              Next
            </CButton>
          </div>
        </CCol>
      </CRow>
      <CModal visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader>
          <CModalTitle>Edit Movies</CModalTitle>
        </CModalHeader>
        <CForm onSubmit={handleUpdateMovie}>
          <div className="m-3">
            <CFormInput
              required
              value={modalData?.title}
              onChange={({ target: { value } }) => {
                setModalData((prev) => ({ ...prev, title: value }))
              }}
            />
          </div>
          <div className="m-3">
            <CFormLabel htmlFor="exampleFormControlInput1"> Movie Image</CFormLabel>
            <CFormInput
              type="file"
              accept=".png,.jpg,.jpeg"
              onChange={({ target }) =>
                setModalData((prev) => ({ ...prev, movieThumbnail: target.files[0] }))
              }
            />
          </div>
          <div className="m-3">
            <CFormLabel htmlFor="exampleFormControlInput2"> Gross Revenue (in Millions)</CFormLabel>
            <CFormInput
              name="boostAudio"
              id="exampleFormControlInput1"
              value={
                modalData?.grossRevenue
                  // ? Convertto_Million(modalData.grossRevenue)
                  
              } type="Number"
              step="0.1"
              min="0"
              onChange={({ target }) =>
                setModalData((prev) => ({ ...prev, grossRevenue: target.value }))
              }
            />
          </div>
          <div className="m-3">
            <CFormInput
              required
              value={modalData?.startFrom.substring(0, 10)}
              type="Date"
              onChange={({ target: { value } }) => {
                setModalData((prev) => ({ ...prev, startFrom: value }))
              }}
            />
          </div>
          <div className="m-3">
            <CFormInput
              required
              value={modalData?.endTo.substring(0, 10)}
              type="Date"
              onChange={({ target: { value } }) => {
                setModalData((prev) => ({ ...prev, endTo: value }))
              }}
            />
          </div>
          <CImage
            align="center"
            src={
              modalData?.movieThumbnail
                ? typeof modalData.movieThumbnail === 'string'
                  ? modalData.movieThumbnail
                  : URL.createObjectURL(modalData.movieThumbnail)
                : '/fallback.png'
            }
            height={150}
            width={150}
          />

          <CModalFooter>
            <CButton color="secondary" onClick={() => setVisible(false)}>
              Close
            </CButton>

            <CButton color="primary" type="submit" disabled={loading}>
              Save changes{' '}
            </CButton>
          </CModalFooter>
        </CForm>
      </CModal>
    </>
  )
}

export default AllMovies
