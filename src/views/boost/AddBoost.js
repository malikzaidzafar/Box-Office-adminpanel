import {
  CButton,
  CCol,
  CForm,
  CFormFeedback,
  CFormInput,
  CFormLabel,
  CSpinner,
} from '@coreui/react'
import React, { useState } from 'react'
import { api } from 'src/api'
import { urls } from 'src/api/urls'

const AddBoost = () => {
  const [fields, setFields] = useState({ bgImage: '', boostText: '' })
  const [boostAudio, setBoostAudio] = useState()
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
      formData.append('bgImage', fields.bgImage)
      formData.append('boostText', fields.boostText)
      const res = await api.post(urls.addBoost, formData, { headers: headers })
      if (res.status == 200) {
        const newFormData = new FormData()
        newFormData.append('boostAudio', boostAudio)
        newFormData.append('boostId', res.data?.boostId)
        newFormData.append('isUpdate', false)
        await api.post(urls.addUpdateBoostAudio, newFormData, { headers: headers })
        alert('Boost added successfully!')
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
          <CFormLabel htmlFor="exampleFormControlInput1">Image URL:</CFormLabel>
          <CFormInput
            name="bgImage"
            id="exampleFormControlInput1"
            placeholder="Upload your image"
            type="file"
            required
            onChange={({ target }) => setFields((prev) => ({ ...prev, bgImage: target.files[0] }))}
          />
        </div>
        <div className="mb-3">
          <CFormLabel htmlFor="exampleFormControlInput1">Boost Audio:</CFormLabel>
          <CFormInput
            name="boostAudio"
            id="exampleFormControlInput1"
            placeholder="Upload boost Audio"
            type="file"
            required
            onChange={({ target }) => setBoostAudio(target.files[0])}
          />
        </div>
        <div className="mb-3">
          <CFormLabel htmlFor="exampleFormControlInput2">Boost Text</CFormLabel>
          <CFormInput
            onChange={({ target: { value } }) => {
              if (value.length > 140) {
                setError(true)
                return
              }
              setError(false)
              setFields((prev) => ({ ...prev, boostText: value }))
            }}
            name="boostText"
            required
            id="exampleFormControlInput2"
            placeholder="I celebrate my victories, using them as motivation to reach even greater heights.I celebrate my victories, using them as motivation to reach even greater heights."
          />
          {error && <p style={{ color: 'red' }}>Limit for Boost Text is 140 characters.</p>}
        </div>
        <CCol xs={12}>
          <CButton color="primary" type="submit" disabled={error}>
            Add Boost
          </CButton>
        </CCol>
      </CForm>
    </div>
  )
}

export default AddBoost
