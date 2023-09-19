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
} from '@coreui/react'
import React, { useEffect, useState } from 'react'
import { api } from 'src/api'
import { urls } from 'src/api/urls'

const Titles = () => {
  const [fields, setFields] = useState({ titleName: '' })
  const [titles, setTitles] = useState([])
  const [visible, setVisible] = useState(false)
  const [modalData, setModalData] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchAllTitles()
  }, [])

  const fetchAllTitles = async () => {
    try {
      const res = await api.get(urls.getAllTitlesAndInspiration)
      if (res.status == 200) {
        const titles = res.data.types?.filter((type) => type?.type == 'title')
        setTitles(titles)
      }
    } catch (error) {
      console.log({ error })
    }
  }

  const handleAddTitle = async (event) => {
    event.preventDefault()
    try {
      setLoading(true)
      const res = await api.post(urls.addTitle, fields)
      setLoading(false)
      if (res.status == 200) {
        setTitles((prev) => [{ name: fields.titleName, _id: res.data?.Id }, ...prev])
        setFields({ titleName: '' })
      }
    } catch (error) {
      setLoading(false)
      console.log({ error })
    }
  }
  const handleDeleteTitle = async (titleId) => {
    try {
      const res = await api.delete(`${urls.deleteTitle}/${titleId}`)
      if (res.status == 200) {
        setTitles(titles.filter((title) => title._id !== titleId))
      }
    } catch (error) {
      console.log({ error })
    }
  }
  const handleModalVisible = (item) => {
    setModalData(item)
    setVisible(true)
  }

  const handleEditTitle = async (event) => {
    event.preventDefault()
    try {
      setLoading(true)
      const res = await api.put(`${urls.updateTitle}/${modalData?._id}`, {
        titleName: modalData?.name,
      })
      if (res.status === 200) {
        const newTitles = titles
        const index = newTitles.findIndex((boost) => boost._id === modalData?._id)
        newTitles[index] = modalData
        setTitles(newTitles)
        setVisible(false)
        setModalData(null)
      }
    } catch (error) {}
    setLoading(false)
  }

  return (
    <div>
      <CForm className="mb-3" onSubmit={handleAddTitle}>
        <div className="mb-3">
          <CFormLabel htmlFor="exampleFormControlInput1">Add title:</CFormLabel>
          <CFormInput
            name="titleName"
            id="exampleFormControlInput1"
            placeholder="New title"
            required
            onChange={({ target: { value } }) =>
              setFields((prev) => ({ ...prev, titleName: value }))
            }
          />
        </div>
        <CCol xs={12}>
          <CButton color="primary" type="submit">
            Add Title{' '}
            {loading && !modalData && (
              <CSpinner component="span" size="sm" variant="grow" aria-hidden="true" />
            )}
          </CButton>
        </CCol>
      </CForm>
      <CTable align="middle" className="mb-0 border" hover responsive>
        <CTableHead color="light">
          <CTableRow>
            <CTableHeaderCell>Title</CTableHeaderCell>
            <CTableHeaderCell>Actions</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {titles.map((item, index) => (
            <CTableRow v-for="item in tableItems" key={item._id}>
              <CTableDataCell>
                <div>{item.name}</div>
              </CTableDataCell>

              <CTableDataCell>
                <CIcon onClick={() => handleDeleteTitle(item?._id)} icon={cilTrash} color="red" />
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
      <CModal visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader>
          <CModalTitle>Edit Title</CModalTitle>
        </CModalHeader>
        <CForm onSubmit={handleEditTitle}>
          <CFormInput
            value={modalData?.name}
            onChange={({ target: { value } }) => setModalData((prev) => ({ ...prev, name: value }))}
          />
          <CModalFooter>
            <CButton color="secondary" onClick={() => setVisible(false)}>
              Close
            </CButton>

            <CButton color="primary" type="submit" disabled={loading}>
              Save changes{' '}
              {loading && <CSpinner component="span" size="sm" variant="grow" aria-hidden="true" />}
            </CButton>
          </CModalFooter>
        </CForm>
      </CModal>
    </div>
  )
}

export default Titles
