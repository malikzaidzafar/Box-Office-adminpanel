import { CButton, CCol, CForm, CFormInput, CFormLabel, CSpinner } from '@coreui/react'
import React, { useState } from 'react'
import { api } from 'src/api'
import { urls } from 'src/api/urls'

const AddMovies = () => {
  const [values, setValues] = useState({
    title: '',
    description: '',
    startFrom: '',
    endTo: '',
    movieThumbnail: '',
    releaseDate: '',
    grossRevenue: '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  const handleAddBoost = async (event) => {
    event.preventDefault()
    const headers = {
      'Content-Type': 'multipart/form-data',
    }
    try {
      setLoading(true)
      const formData = new FormData()
      formData.append('title', values.title)
      formData.append('description', values.description)
      formData.append('startFrom', values.startFrom)
      formData.append('endTo', values.endTo)
      formData.append('releaseDate', values.releaseDate)
      formData.append('movieThumbnail', values.movieThumbnail)
      formData.append('grossRevenue', values.grossRevenue)
      const res = await api.post(urls.addMovie, formData, { headers: headers })
      if (res.status === 200) {
        alert('Movie details successfully saved')
        setValues({
          title: '',
          description: '',
          startFrom: '',
          endTo: '',
          movieThumbnail: '',
          releaseDate: '',
          grossRevenue: '',
        })
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
  return (
    <div>
      {renderSpinnerOverlay()}
      <CForm onSubmit={handleAddBoost}>
        <div className="mb-3">
          <CFormLabel htmlFor="exampleFormControlInput2">Title of Movie*</CFormLabel>
          <CFormInput
            onChange={({ target: { value } }) => {
              setError(false)
              setValues((prev) => ({ ...prev, title: !value.startsWith(' ') ? value : '' }))
            }}
            value={values?.title}
            name="boostText"
            required
            id="exampleFormControlInput2"
            placeholder="Enter Title of Movie"
          />
        </div>
        <div className="mb-3">
          <CFormLabel htmlFor="exampleFormControlInput2">Description*</CFormLabel>
          <CFormInput
            onChange={({ target: { value } }) => {
              setError(false)
              setValues((prev) => ({ ...prev, description: !value.startsWith(' ') ? value : '' }))
            }}
            value={values?.description}
            name="description"
            required
            id="exampleFormControlInp"
            placeholder="Enter Description of Movie"
          />
        </div>
        <div className="mb-3">
          <CFormLabel htmlFor="exampleFormControlInput2">Enter the Start Date of Week*</CFormLabel>
          <CFormInput
            type="date"
            onChange={({ target: { value } }) => {
              setError(false)
              setValues((prev) => ({ ...prev, startFrom: !value.startsWith(' ') ? value : '' }))
            }}
            value={values?.startFrom?.substring(0, 10)}
            name="description"
            required
            id="exampleFoControlInp"
            placeholder="Enter the Start Date of Week"
          />
        </div>
        <div className="mb-3">
          <CFormLabel htmlFor="exampleFormControlInput2">Enter the End Date of Week*</CFormLabel>
          <CFormInput
            type="date"
            onChange={({ target: { value } }) => {
              setError(false)
              setValues((prev) => ({ ...prev, endTo: !value.startsWith(' ') ? value : '' }))
            }}
            value={values?.endTo?.substring(0, 10)}
            name="description"
            required
            id="exampleFoControlInp"
            placeholder="Enter the End Date of Week"
          />
        </div>
        <div className="mb-3">
          <CFormLabel htmlFor="exampleFormControlInput2">
            Enter the Release Date of Movie*
          </CFormLabel>
          <CFormInput
            type="date"
            onChange={({ target: { value } }) => {
              setError(false)
              setValues((prev) => ({ ...prev, releaseDate: !value.startsWith(' ') ? value : '' }))
            }}
            name="description"
            value={values?.releaseDate?.substring(0, 10)}
            required
            id="exampleFoControlInp"
            placeholder="Enter the Release Date of Movie"
          />
        </div>
        <div className="mb-3">
          <CFormLabel htmlFor="exampleFormControlInput2">Gross Revenue</CFormLabel>
          <CFormInput
            onChange={({ target: { value } }) => {
              setError(false)
              setValues((prev) => ({ ...prev, grossRevenue: !value.startsWith(' ') ? value : '' }))
            }}
            value={values?.grossRevenue}
            type="Number"
            name="description"
            id="exampleFormControlInp"
            placeholder="Enter the Gross Revenue"
          />
        </div>
        <div className="mb-3">
          <CFormLabel htmlFor="exampleFormControlInput1">Movie Thumbnail*</CFormLabel>
          <CFormInput
            name="bgImag"
            id="exampleFormContro"
            placeholder="Upload the Movie Thumbnail"
            type="file"
            required
            onChange={(event) => {
              setError(false)
              setValues((prev) => ({ ...prev, movieThumbnail: event.target.files[0] }))
            }}
          />
        </div>
        <CCol xs={12}>
          <CButton color="primary" type="submit" disabled={error}>
            Add Movie
          </CButton>
        </CCol>
      </CForm>
    </div>
  )
}

export default AddMovies
