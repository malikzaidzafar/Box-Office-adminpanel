import { CButton, CCol, CForm, CFormInput, CFormLabel, CFormSelect, CSpinner } from '@coreui/react'
import React, { useEffect, useState } from 'react'
import { api } from 'src/api'
import { urls } from 'src/api/urls'

const AddInspiration = () => {
  const [fields, setFields] = useState({})
  const [loading, setLoading] = useState(false)
  const [titles, setTitles] = useState([])
  const [formats, setFormats] = useState([])

  useEffect(() => {
    fetchAllTitles()
  }, [])

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

  const handleAddInspiration = async (event) => {
    event.preventDefault()
    const headers = {
      'Content-Type': 'multipart/form-data',
    }
    try {
      setLoading(true)
      const formData = new FormData()
      formData.append('url', fields?.url)
      formData.append('title', fields?.title)
      formData.append('thumbnail', fields?.thumbnail)
      if (fields?.duration) {
        formData.append('duration', fields?.duration)
      }
      formData.append('formats', JSON.stringify(fields?.format))
      formData.append('topics', JSON.stringify(fields?.topics))
      const res = await api.post(urls.addInspiration, formData, { headers: headers })
      if (res.status == 200) {
        alert('Inspiration added successfully!')
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
    <div>
      {renderSpinnerOverlay()}
      <CForm onSubmit={handleAddInspiration}>
        <div className="mb-3">
          <CFormLabel htmlFor="exampleFormControlInput1">URL:</CFormLabel>
          <CFormInput
            id="exampleFormControlInput1"
            placeholder="Upload your image"
            required
            onChange={({ target }) => setFields((prev) => ({ ...prev, url: target.value }))}
          />
        </div>
        <div className="mb-3">
          <CFormLabel htmlFor="exampleFormControlInput2">Title</CFormLabel>
          <CFormInput
            onChange={({ target: { value } }) => setFields((prev) => ({ ...prev, title: value }))}
            required
            id="exampleFormControlInput2"
            placeholder="I celebrate my victories"
          />
        </div>
        <div className="mb-3">
          <CFormLabel htmlFor="exampleFormControlInput3">Duration</CFormLabel>
          <CFormInput
            onChange={({ target: { value } }) =>
              setFields((prev) => ({ ...prev, duration: value }))
            }
            id="exampleFormControlInput3"
            placeholder="12.48"
          />
        </div>
        <div className="mb-3">
          <CFormSelect
            required
            aria-label="Default select example"
            onChange={({ target: { value } }) =>
              setFields((prev) => ({ ...prev, format: [value] }))
            }
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
            required
            aria-label="Default select example"
            onChange={({ target: { value } }) =>
              setFields((prev) => ({ ...prev, topics: [value] }))
            }
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
            required
            type="file"
            onChange={({ target }) =>
              setFields((prev) => ({ ...prev, thumbnail: target.files[0] }))
            }
            id="exampleFormControlInput3"
            placeholder="12.48"
          />
        </div>
        <CCol xs={12}>
          <CButton color="primary" type="submit">
            Add Inspiration
          </CButton>
        </CCol>
      </CForm>
    </div>
  )
}

export default AddInspiration
