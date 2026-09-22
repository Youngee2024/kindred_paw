import { useEffect, useState } from 'react'
import { ApplicationContext } from './applicationContext'

const storageKey = 'maya-insurance-application'

const emptyApplication = {
  account: { name: '', email: '' },
  owner: { name: '', email: '', phone: '', address: '', photo: '' },
  pet: { name: '', type: '', breed: '', birthday: '', weight: '', medication: '', medicationDetails: '', surgery: '', photo: '' },
  submitted: false,
  reference: '',
}

function loadApplication() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey))
    return saved ? {
      ...emptyApplication,
      ...saved,
      account: { ...emptyApplication.account, ...saved.account },
      owner: { ...emptyApplication.owner, ...saved.owner, photo: '' },
      pet: { ...emptyApplication.pet, ...saved.pet, photo: '' },
    } : emptyApplication
  } catch {
    return emptyApplication
  }
}

export default function ApplicationProvider({ children }) {
  const [application, setApplication] = useState(loadApplication)

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify({
        ...application,
        owner: { ...application.owner, photo: '' },
        pet: { ...application.pet, photo: '' },
      }))
    } catch {
      // The journey remains usable if browser storage is unavailable.
    }
  }, [application])

  const updateSection = (section, value) => {
    setApplication((current) => ({
      ...current,
      [section]: typeof value === 'function' ? value(current[section]) : value,
      submitted: false,
      reference: '',
    }))
  }

  const submitApplication = () => {
    const reference = `MI-${Date.now().toString(36).slice(-6).toUpperCase()}`
    setApplication((current) => ({ ...current, submitted: true, reference }))
  }

  const resetApplication = () => {
    localStorage.removeItem(storageKey)
    setApplication(emptyApplication)
  }

  return (
    <ApplicationContext.Provider value={{ application, updateSection, submitApplication, resetApplication }}>
      {children}
    </ApplicationContext.Provider>
  )
}
