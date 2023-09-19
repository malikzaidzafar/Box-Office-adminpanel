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
  CFormLabel,
} from '@coreui/react'
import { api } from 'src/api'
import { urls } from 'src/api/urls'
import CIcon from '@coreui/icons-react'
import { cilPen, cilTrash } from '@coreui/icons'

const AllBoost = () => {
  const [allBoosts, setAllBoosts] = useState([])
  const [visible, setVisible] = useState(false)
  const [modalData, setModalData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetchAllBoosts()
  }, [])

  const handleModalVisible = (item) => {
    setModalData(item)
    setVisible(true)
  }

  const fetchAllBoosts = async () => {
    try {
      setLoading(true)
      const response = await api.get(urls.getAllBoostForAdmin)
      if (response.status == 200) {
        setAllBoosts(response.data?.boosts)
      }
    } catch (error) {
      setAllBoosts([])
    }
    setLoading(false)
  }

  const handleEditBoost = async (event) => {
    event.preventDefault()
    const headers = {
      'Content-Type': 'multipart/form-data',
    }
    try {
      const formData = new FormData()
      formData.append('boostText', modalData?.text)
      if (modalData?.bgImage) {
        formData.append('bgImage', modalData?.bgImage)
      }
      setLoading(true)
      const res = await api.put(`${urls.editBoost}/${modalData?._id}`, formData, {
        headers: headers,
      })
      if (res.status === 200) {
        const newBoosts = allBoosts
        const index = newBoosts.findIndex((boost) => boost._id === modalData?._id)
        newBoosts[index] = modalData
        newBoosts[index].imageUrl = res.data?.boostImageUrl
        if (modalData?.boostAudio) {
          const newFormData = new FormData()
          newFormData.append('boostAudio', modalData?.boostAudio)
          newFormData.append('boostId', res.data?.boostId)
          newFormData.append('isUpdate', true)
          await api.post(urls.addUpdateBoostAudio, newFormData, { headers: headers })
        }
        alert('Boost added successfully!')
        setAllBoosts(newBoosts)
        setVisible(false)
      }
    } catch (error) {}
    setLoading(false)
  }

  const handleDeleteBoost = async (boostId) => {
    setLoading(true)
    try {
      const res = await api.delete(`${urls.deleteBoost}/${boostId}`)
      if (res.status == 200) {
        setAllBoosts(allBoosts.filter((boost) => boost._id !== boostId))
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
                <CTableHeaderCell>Boosts</CTableHeaderCell>
                <CTableHeaderCell>Boost Image</CTableHeaderCell>
                <CTableHeaderCell>Boost Count</CTableHeaderCell>
                <CTableHeaderCell>Actions</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {allBoosts.map((item, index) => (
                <CTableRow v-for="item in tableItems" key={item._id}>
                  <CTableDataCell>
                    <div>{item?.text}</div>
                  </CTableDataCell>
                  <CTableDataCell>
                    <img src={item?.imageUrl} alt="Boost Pic" width={100} height={100} />
                  </CTableDataCell>
                  <CTableDataCell>
                    <div>{item?.boostCount}</div>
                  </CTableDataCell>
                  <CTableDataCell>
                    <CIcon
                      onClick={() => handleDeleteBoost(item?._id)}
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
        </CCol>
      </CRow>
      <CModal visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader>
          <CModalTitle>Edit Boost</CModalTitle>
        </CModalHeader>
        <CForm onSubmit={handleEditBoost}>
          <div className="m-3">
            <CFormInput
              required
              value={modalData?.text}
              onChange={({ target: { value } }) => {
                if (value.length > 140) {
                  setError(true)
                  return
                }
                setError(false)
                setModalData((prev) => ({ ...prev, text: value }))
              }}
            />
            {error && <p style={{ color: 'red' }}>Limit for Boost Text is 140 characters.</p>}
          </div>
          <div className="m-3">
            <CFormLabel htmlFor="exampleFormControlInput1">Boost Image</CFormLabel>
            <CFormInput
              type="file"
              onChange={({ target }) =>
                setModalData((prev) => ({ ...prev, bgImage: target.files[0] }))
              }
            />
          </div>
          <div className="m-3">
            <CFormLabel htmlFor="exampleFormControlInput2">Boost Audio</CFormLabel>
            <CFormInput
              name="boostAudio"
              id="exampleFormControlInput1"
              placeholder="Upload boost Audio"
              type="file"
              onChange={({ target }) =>
                setModalData((prev) => ({ ...prev, boostAudio: target.files[0] }))
              }
            />
          </div>
          <CImage align="center" src={modalData?.imageUrl} height={200} width={200} />
          <CModalFooter>
            <CButton color="secondary" onClick={() => setVisible(false)}>
              Close
            </CButton>

            <CButton color="primary" type="submit" disabled={loading || error}>
              Save changes{' '}
            </CButton>
          </CModalFooter>
        </CForm>
      </CModal>
    </>
  )
}

export default AllBoost
