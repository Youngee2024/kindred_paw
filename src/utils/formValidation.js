export const acceptedImageTypes = ['image/jpeg', 'image/png', 'image/webp']
export const maxImageSize = 5 * 1024 * 1024

function toDateInputValue(date) {
  const pad = (value) => String(value).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

export const today = () => toDateInputValue(new Date())

export function yearsAgo(years) {
  const date = new Date()
  date.setFullYear(date.getFullYear() - years)
  return toDateInputValue(date)
}

export function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}

export function isValidNigerianPhone(value) {
  const compact = value.replace(/[\s().-]/g, '')
  return /^(?:\+234|234)[789]\d{9}$/.test(compact) || /^0[789]\d{9}$/.test(compact)
}

export function validateOwnerField(field, value) {
  const text = String(value || '').trim()
  if (field === 'name' && text.length < 2) return 'Enter the owner’s full name.'
  if (field === 'email' && !isValidEmail(text)) return 'Enter a valid email address.'
  if (field === 'phone' && !isValidNigerianPhone(text)) return 'Use a Nigerian number such as 08012345678 or +2348012345678.'
  if (field === 'address' && text.length < 10) return 'Enter a complete home address of at least 10 characters.'
  return ''
}

export function validateOwner(owner) {
  return ['name', 'email', 'phone', 'address'].reduce((errors, field) => {
    const error = validateOwnerField(field, owner[field])
    if (error) errors[field] = error
    return errors
  }, {})
}

export function validatePetField(field, value, pet) {
  const text = String(value || '').trim()
  if (field === 'name' && text.length < 2) return 'Enter a pet name with at least 2 characters.'
  if (field === 'type' && !text) return 'Choose a pet type.'
  if (field === 'breed' && !text) return 'Choose a breed for this pet type.'
  if (field === 'birthday') {
    if (!text) return 'Enter your pet’s birthday.'
    if (!/^\d{4}-\d{2}-\d{2}$/.test(text) || Number.isNaN(new Date(`${text}T00:00:00`).getTime())) return 'Enter a valid birthday.'
    if (text > today()) return 'Birthday cannot be in the future.'
    if (text < yearsAgo(40)) return 'Check the birthday; it cannot be more than 40 years ago.'
  }
  if (field === 'weight' && !text) return 'Choose a weight range.'
  if (field === 'medication' && !text) return 'Tell us whether your pet currently takes medication.'
  if (field === 'medicationDetails' && pet.medication === 'yes' && text.length < 3) return 'Add the medication name and dosage.'
  return ''
}

export function validatePet(pet) {
  return ['name', 'type', 'breed', 'birthday', 'weight', 'medication', 'medicationDetails'].reduce((errors, field) => {
    const error = validatePetField(field, pet[field], pet)
    if (error) errors[field] = error
    return errors
  }, {})
}

export function validateImage(file) {
  if (!acceptedImageTypes.includes(file.type)) return 'Choose a JPG, PNG, or WebP image.'
  if (file.size > maxImageSize) return 'Image must be 5 MB or smaller.'
  return ''
}
