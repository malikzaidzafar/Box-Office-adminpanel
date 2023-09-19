import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CRow,
  CSpinner,
} from '@coreui/react'
import React, { useEffect, useState } from 'react'
import { api } from 'src/api'
import { urls } from 'src/api/urls'

const AddGoalImage = () => {
  const [fields, setFields] = useState({ goalImage: '' })
  const [selectedImages, setSelectedImages] = useState([])
  const [loading, setLoading] = useState(false)
  const [refetch, setRefetch] = useState(true)

  useEffect(() => {
    refetch && getAllImages()
  }, [refetch])

  const getAllImages = async () => {
    try {
      const res = await api.get(urls.getAllGoalsImages)
      if (res.status == 200) {
        console.log(res?.data)
        setRefetch(false)
        setSelectedImages(res.data?.allImages)
      }
    } catch (error) {
      console.log({ error })
    }
  }

  const handleAddImage = async (event) => {
    event.preventDefault()
    const headers = {
      'Content-Type': 'multipart/form-data',
    }
    try {
      setLoading(true)
      const formData = new FormData()
      formData.append('goalImage', fields.goalImage)
      const res = await api.post(urls.addGoalImage, formData, { headers: headers })
      setLoading(false)
      if (res.status == 200) {
        console.log(res.data)
        setRefetch(true)
        alert('Goal image added successfully!')
      }
    } catch (error) {
      console.log({ error })
    }
    setLoading(false)
  }

  const handleImageRemove = async (imageId) => {
    const updatedImages = selectedImages.filter((selectedImage) => selectedImage?._id !== imageId)
    try {
      setLoading(true)
      const res = await api.delete(`${urls.deleteGoalImage}/${imageId}`)
      if (res.status == 200) {
        setSelectedImages(updatedImages)
        setLoading(false)
      }
    } catch (error) {
      console.log({ error })
    }
    setLoading(false)
  }

  const renderImages = () => {
    return selectedImages.map((image, index) => (
      <CCol xs="6" sm="4" md="3" key={image?._id}>
        <CCard>
          <CButton
            color="link"
            className="close d-flex justify-content-end"
            onClick={() => handleImageRemove(image?._id)}
          >
            <span aria-hidden="true">&times;</span>
          </CButton>
          <CCardBody>
            <img src={image?.url} alt="Goal" style={{ width: '100%', height: '200px' }} />
          </CCardBody>
        </CCard>
      </CCol>
    ))
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
      <CForm onSubmit={handleAddImage}>
        <div className="mb-3">
          <CFormLabel htmlFor="imageUrl">Add Goal Image</CFormLabel>
          <CFormInput
            name="imageUrl"
            type="file"
            id="imageUrl"
            placeholder="https://salesmindapp.s3.amazonaws.com/m"
            required
            onChange={({ target }) =>
              setFields((prev) => ({ ...prev, goalImage: target.files[0] }))
            }
          />
        </div>
        <CCol xs={12}>
          <CButton color="primary" type="submit">
            Add Image
          </CButton>
        </CCol>
      </CForm>
      <CFormLabel htmlFor="imageUrl">Goal Images</CFormLabel>
      <CRow>{renderImages()}</CRow>
    </div>
  )
}

export default AddGoalImage
