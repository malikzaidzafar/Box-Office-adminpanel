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
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CButton,
  CImage,
  CFormInput,
  CForm,
  CSpinner,
  CFormSelect,
  CFormLabel,
} from '@coreui/react'
import { api } from 'src/api'
import { urls } from 'src/api/urls'
import CIcon from '@coreui/icons-react'
import { cilPen, cilTrash } from '@coreui/icons'

const AllInspirations = () => {
  const [allInspirations, setAllInspirations] = useState([])
  const [visible, setVisible] = useState(false)
  const [modalData, setModalData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [titles, setTitles] = useState([])
  const [formats, setFormats] = useState([])
  const [refetch, setRefetch] = useState(true)

  useEffect(() => {
    fetchAllTitles()
  }, [])

  useEffect(() => {
    refetch && fetchAllInspirations()
  }, [refetch])

  const handleModalVisible = (item) => {
    setModalData(item)
    setVisible(true)
  }
  const fetchAllTitles = async () => {
    try {
      const res = await api.get(urls.getAllTitlesAndInspiration)
      if (res.status == 200) {
        const titles = res.data.types?.filter((type) => type?.type == 'title')
        setTitles(titles)
        setFormats(res.data.types?.filter((type) => type?.type == 'formatType'))
      }
    } catch (error) {
      console.log({ error })
    }
  }

  const fetchAllInspirations = async () => {
    try {
      setLoading(true)
      const response = await api.get(urls.getAllInspirations)
      if (response.status == 200) {
        setRefetch(false)
        setAllInspirations(response.data?.inspirations)
      }
    } catch (error) {
      setAllInspirations([])
    }
    setLoading(false)
  }

  const handleEditBoost = async (event) => {
    event.preventDefault()
    const headers = {
      'Content-Type': 'multipart/form-data',
    }
    setLoading(true)
    try {
      console.log({ modalData })
      const formData = new FormData()
      formData.append('url', modalData?.url)
      formData.append('title', modalData?.title)
      if (modalData?.thumbnail) {
        formData.append('thumbnail', modalData?.thumbnail)
      }
      if (modalData?.duration) {
        formData.append('duration', modalData?.duration)
      }
      formData.append('formats', JSON.stringify(modalData?.format))
      formData.append('topics', JSON.stringify(modalData?.topics))
      const res = await api.put(`${urls.updateInspiration}/${modalData?._id}`, formData, {
        headers: headers,
      })
      if (res.status === 200) {
        setRefetch(true)
        setVisible(false)
      }
    } catch (error) {}
    setLoading(false)
  }

  const handleDeleteInspiration = async (id) => {
    setLoading(true)
    try {
      const res = await api.delete(`${urls.deleteInspiration}/${id}`)
      if (res.status == 200) {
        setAllInspirations(allInspirations.filter((inspiration) => inspiration._id !== id))
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
          <CCardHeader>All Boosts</CCardHeader>
          <CTable align="middle" className="mb-0 border" hover responsive>
            <CTableHead color="light">
              <CTableRow>
                <CTableHeaderCell>Title</CTableHeaderCell>
                <CTableHeaderCell>Thumbnail</CTableHeaderCell>
                <CTableHeaderCell>Duration</CTableHeaderCell>
                <CTableHeaderCell>Format</CTableHeaderCell>
                <CTableHeaderCell>Topics</CTableHeaderCell>
                <CTableHeaderCell>Actions</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {allInspirations.map((item, index) => (
                <CTableRow v-for="item in tableItems" key={item._id}>
                  <CTableDataCell>
                    <div>{item.title}</div>
                  </CTableDataCell>
                  <CTableDataCell>
                    <img src={item.thumbnail} alt="Boost Pic" width={60} height={60} />
                  </CTableDataCell>
                  <CTableDataCell>
                    <div>{item.duration}</div>
                  </CTableDataCell>
                  <CTableDataCell>
                    <div>{item.formatTypeId[0]?.name}</div>
                  </CTableDataCell>
                  <CTableDataCell>
                    <div>{item.topicTypeId?.map((topic) => topic?.name).join(',')}</div>
                  </CTableDataCell>

                  <CTableDataCell>
                    <CIcon
                      onClick={() => handleDeleteInspiration(item?._id)}
                      icon={cilTrash}
                      color="red"
                    />
                    <CIcon
                      style={{ marginLeft: 20 }}
                      onClick={() =>
                        handleModalVisible({
                          ...item,
                          format: [item?.formatTypeId[0]?._id],
                          topics: [item?.topicTypeId[0]?._id],
                          thumbnail: null,
                        })
                      }
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
      <CModal visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader>
          <CModalTitle>Edit Inspiration</CModalTitle>
        </CModalHeader>
        <CForm className="p-4" onSubmit={handleEditBoost}>
          <div className="mb-3">
            <CFormLabel htmlFor="exampleFormControlInput1">URL:</CFormLabel>
            <CFormInput
              id="exampleFormControlInput1"
              placeholder="Upload your image"
              value={modalData?.url}
              required
              onChange={({ target }) => setModalData((prev) => ({ ...prev, url: target.value }))}
            />
          </div>
          <div className="mb-3">
            <CFormLabel htmlFor="exampleFormControlInput2">Title</CFormLabel>
            <CFormInput
              onChange={({ target: { value } }) =>
                setModalData((prev) => ({ ...prev, title: value }))
              }
              required
              value={modalData?.title}
              id="exampleFormControlInput2"
              placeholder="I celebrate my victories"
            />
          </div>
          <div className="mb-3">
            <CFormLabel htmlFor="exampleFormControlInput3">Duration</CFormLabel>
            <CFormInput
              onChange={({ target: { value } }) =>
                setModalData((prev) => ({ ...prev, duration: value }))
              }
              value={modalData?.duration || ''}
              id="exampleFormControlInput3"
              placeholder="12.48"
            />
          </div>
          <div className="mb-3">
            <CFormSelect
              aria-label="Default select example"
              onChange={({ target: { value } }) =>
                setModalData((prev) => ({ ...prev, format: [value] }))
              }
              required
              value={modalData?.format}
            >
              <option disabled selected>
                Select Format
              </option>
              {formats.map((format) => (
                <option key={format?._id} value={format?._id}>
                  {format?.name}
                </option>
              ))}
            </CFormSelect>
          </div>
          <div className="mb-3">
            <CFormSelect
              aria-label="Default select example"
              onChange={({ target: { value } }) =>
                setModalData((prev) => ({ ...prev, topics: [value] }))
              }
              required
              value={modalData?.topics}
            >
              <option disabled selected>
                Select title
              </option>
              {titles.map((title) => (
                <option key={title?._id} value={title?._id}>
                  {title?.name}
                </option>
              ))}
            </CFormSelect>
          </div>
          <div className="mb-3">
            <CFormLabel htmlFor="exampleFormControlInput3">Add Thumbnail</CFormLabel>
            <CFormInput
              type="file"
              onChange={({ target }) =>
                setModalData((prev) => ({ ...prev, thumbnail: target.files[0] }))
              }
              id="exampleFormControlInput3"
              placeholder="12.48"
            />
          </div>
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

export default AllInspirations
