import { cilPen, cilTrash } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import {
  CButton,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
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
  CSpinner,
  CImage,
} from '@coreui/react'
import React, { useEffect, useState } from 'react'
import { api } from 'src/api'
import { urls } from 'src/api/urls'

const Formats = () => {
  const [fields, setFields] = useState({ formatName: '', bgImage: null, icon: null })
  const [formats, setFormats] = useState([])
  const [visible, setVisible] = useState(false)
  const [modalData, setModalData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [refetch, setRefetch] = useState(true)

  useEffect(() => {
    refetch && fetchAllFormats()
  }, [refetch])

  const fetchAllFormats = async () => {
    try {
      const res = await api.get(urls.getAllTitlesAndInspiration)
      console.log(res.data)
      if (res.status == 200) {
        const formats = res.data.types?.filter((type) => type?.type == 'formatType')
        setFormats(formats)
        setRefetch(false)
      }
    } catch (error) {
      console.log({ error })
    }
  }

  const handleAddTitle = async (event) => {
    event.preventDefault()
    const headers = {
      'Content-Type': 'multipart/form-data',
    }
    try {
      setLoading(true)
      const formData = new FormData()
      formData.append('bgImage', fields.bgImage)
      formData.append('icon', fields.icon)
      formData.append('formatName', fields.formatName)
      const res = await api.post(urls.addFormat, formData, { headers: headers })
      if (res.status == 200) {
        setFormats((prev) => [
          {
            name: fields.formatName,
            icon: res?.data?.iconUrl,
            bgImage: res?.data?.imageUrl,
            _id: res.data?.id,
          },
          ...prev,
        ])
        setFields({ formatName: '', bgImage: null, icon: null })
      }
    } catch (error) {
      setLoading(false)
      console.log({ error })
    }
    setLoading(false)
  }
  const handleDeleteFormat = async (id) => {
    try {
      setLoading(true)
      const res = await api.delete(`${urls.deleteFormat}/${id}`)
      if (res.status == 200) {
        setFormats(formats.filter((title) => title._id !== id))
      }
    } catch (error) {
      console.log({ error })
    }
    setLoading(false)
  }
  const handleModalVisible = (item) => {
    setModalData(item)
    setVisible(true)
  }

  const handleEditTitle = async (event) => {
    event.preventDefault()
    const headers = {
      'Content-Type': 'multipart/form-data',
    }
    console.log({ modalData })
    try {
      setLoading(true)
      const formData = new FormData()
      if (modalData?.bgImage) {
        formData.append('bgImage', modalData.bgImage)
      }
      if (modalData?.icon) {
        formData.append('icon', modalData.icon)
      }
      formData.append('formatName', modalData?.name)
      const res = await api.put(`${urls.updateFormat}/${modalData?._id}`, formData, {
        headers: headers,
      })
      if (res.status == 200) {
        setRefetch(true)
        setVisible(false)
        setModalData(null)
      }
    } catch (error) {}
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
    <div>
      {renderSpinnerOverlay()}
      <CForm className="mb-3" onSubmit={handleAddTitle}>
        <div className="mb-3">
          <CFormLabel htmlFor="exampleFormControlInput1">Add format:</CFormLabel>
          <CFormInput
            name="formatName"
            id="exampleFormControlInput1"
            placeholder="New Format"
            value={fields.formatName}
            required
            onChange={({ target: { value } }) =>
              setFields((prev) => ({ ...prev, formatName: value }))
            }
          />
          <CFormLabel htmlFor="exampleFormControlInput2">Add Background image:</CFormLabel>
          <CFormInput
            name="bgImage"
            id="exampleFormControlInput2"
            required
            type="file"
            onChange={({ target }) => setFields((prev) => ({ ...prev, bgImage: target.files[0] }))}
          />
          <CFormLabel htmlFor="exampleFormControlInput3">Add Icon:</CFormLabel>
          <CFormInput
            name="icon"
            id="exampleFormControlInput3"
            required
            type="file"
            onChange={({ target }) => setFields((prev) => ({ ...prev, icon: target.files[0] }))}
          />
        </div>
        <CCol xs={12}>
          <CButton color="primary" type="submit">
            Add Title{' '}
          </CButton>
        </CCol>
      </CForm>
      <CTable align="middle" className="mb-0 border" hover responsive>
        <CTableHead color="light">
          <CTableRow>
            <CTableHeaderCell>Name</CTableHeaderCell>
            <CTableHeaderCell>Icon</CTableHeaderCell>
            <CTableHeaderCell>Image</CTableHeaderCell>
            <CTableHeaderCell>Actions</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {formats.map((item, index) => (
            <CTableRow v-for="item in tableItems" key={item._id}>
              <CTableDataCell>
                <div>{item.name}</div>
              </CTableDataCell>
              <CTableDataCell>
                <CImage src={item.icon} width={60} height={60} />
              </CTableDataCell>
              <CTableDataCell>
                <CImage src={item.bgImage} fluid />
              </CTableDataCell>

              <CTableDataCell>
                <CIcon onClick={() => handleDeleteFormat(item?._id)} icon={cilTrash} color="red" />
                <CIcon
                  style={{ marginLeft: 20 }}
                  onClick={() => handleModalVisible({ ...item, bgImage: null, icon: null })}
                  icon={cilPen}
                  color="red"
                />
              </CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>
      <CModal visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader>
          <CModalTitle>Edit Title</CModalTitle>
        </CModalHeader>
        <CForm className="p-4" onSubmit={handleEditTitle}>
          <CFormInput
            value={modalData?.name}
            required
            onChange={({ target: { value } }) => setModalData((prev) => ({ ...prev, name: value }))}
          />
          <CFormLabel htmlFor="exampleFormControlInput2">Add Background image:</CFormLabel>
          <CFormInput
            name="bgImage"
            id="exampleFormControlInput2"
            type="file"
            onChange={({ target }) =>
              setModalData((prev) => ({ ...prev, bgImage: target.files[0] }))
            }
          />
          <CFormLabel htmlFor="exampleFormControlInput3">Add Icon:</CFormLabel>
          <CFormInput
            name="icon"
            id="exampleFormControlInput3"
            type="file"
            onChange={({ target }) => setModalData((prev) => ({ ...prev, icon: target.files[0] }))}
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
    </div>
  )
}

export default Formats
