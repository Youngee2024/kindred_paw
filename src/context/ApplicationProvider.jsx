import { useCallback, useEffect, useState } from 'react'
import { ApplicationContext } from './applicationContext'
import { coveragePlans } from '../utils/quoteCalculator'

const storageKey = 'kindredpaw-application'
const emptyOwner = { name: '', email: '', phone: '', address: '', photo: '' }
const emptyPet = { name: '', type: '', breed: '', birthday: '', weight: '', medication: '', medicationDetails: '', surgery: '', photo: '' }
const emptyQuote = { planId: '', planName: '', billing: 'monthly', monthlyPremium: 0, annualPremium: 0, annualLimit: '', reimbursement: '', deductible: '' }
const defaultPlans = coveragePlans.map((plan) => ({ ...plan, status: 'Active' }))

const emptyApplication = {
  account: { name: '', email: '' },
  owner: emptyOwner,
  pet: emptyPet,
  quote: emptyQuote,
  submitted: false,
  reference: '',
  pets: [],
  applications: [],
  claims: [],
  payments: [],
  plans: defaultPlans,
  customerStatus: 'Active',
  lastPaymentReference: '',
}

const makeId = (prefix) => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`

function loadApplication() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey))
    if (!saved) return emptyApplication

    const restored = {
      ...emptyApplication,
      ...saved,
      account: { ...emptyApplication.account, ...saved.account },
      owner: { ...emptyOwner, ...saved.owner, photo: '' },
      pet: { ...emptyPet, ...saved.pet, photo: '' },
      quote: { ...emptyQuote, ...saved.quote },
      pets: saved.pets || [],
      applications: saved.applications || [],
      claims: saved.claims || [],
      payments: saved.payments || [],
      plans: saved.plans?.length ? saved.plans : defaultPlans,
      customerStatus: saved.customerStatus || 'Active',
    }

    // Migrate applications submitted before the dashboard existed.
    if (restored.submitted && restored.reference && restored.pet.name && !restored.applications.some((item) => item.reference === restored.reference)) {
      const petId = `pet-${restored.reference.toLowerCase()}`
      restored.pets = [{ ...restored.pet, id: petId, createdAt: new Date().toISOString(), photo: '' }, ...restored.pets]
      restored.applications = [{
        id: `app-${restored.reference.toLowerCase()}`,
        reference: restored.reference,
        petId,
        petName: restored.pet.name,
        submittedAt: new Date().toISOString(),
        status: 'Submitted',
        policyStatus: 'Under review',
        plan: 'Complete Care',
      }, ...restored.applications]
    }
    return restored
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
        pets: application.pets.map((pet) => ({ ...pet, photo: '' })),
      }))
    } catch {
      // The journey remains usable if browser storage is unavailable.
    }
  }, [application])

  const updateSection = (section, value) => {
    setApplication((current) => {
      const next = {
        ...current,
        [section]: typeof value === 'function' ? value(current[section]) : value,
        submitted: ['owner', 'pet', 'quote'].includes(section) ? false : current.submitted,
        reference: ['owner', 'pet', 'quote'].includes(section) ? '' : current.reference,
        lastPaymentReference: ['owner', 'pet', 'quote'].includes(section) ? '' : current.lastPaymentReference,
      }
      if (section === 'pet') next.quote = emptyQuote
      return next
    })
  }

  const submitApplication = useCallback(() => {
    setApplication((current) => {
      if (current.submitted && current.reference) return current
      if (!current.quote.planId || !current.lastPaymentReference) return current
      const reference = `KP-${Date.now().toString(36).slice(-6).toUpperCase()}`
      const petId = makeId('pet')
      const now = new Date().toISOString()
      const petRecord = { ...current.pet, id: petId, createdAt: now, photo: '' }
      const applicationRecord = {
        id: makeId('app'),
        reference,
        petId,
        petName: current.pet.name,
        submittedAt: now,
        status: 'Submitted',
        policyStatus: 'Under review',
        plan: current.quote.planName,
        planId: current.quote.planId,
        billing: current.quote.billing,
        monthlyPremium: current.quote.monthlyPremium,
        annualPremium: current.quote.annualPremium,
        annualLimit: current.quote.annualLimit,
        reimbursement: current.quote.reimbursement,
        deductible: current.quote.deductible,
        paymentReference: current.lastPaymentReference,
        paymentStatus: current.lastPaymentReference ? 'Paid' : 'Pending',
      }
      return {
        ...current,
        submitted: true,
        reference,
        pets: [petRecord, ...current.pets],
        applications: [applicationRecord, ...current.applications],
      }
    })
  }, [])

  const resetApplication = () => {
    setApplication((current) => ({
      ...current,
      pet: emptyPet,
      quote: emptyQuote,
      submitted: false,
      reference: '',
      lastPaymentReference: '',
    }))
  }

  const addPet = (pet) => {
    const petRecord = { ...emptyPet, ...pet, id: makeId('pet'), createdAt: new Date().toISOString(), photo: '' }
    setApplication((current) => ({ ...current, pets: [petRecord, ...current.pets] }))
    return petRecord.id
  }

  const updatePet = (id, updates) => {
    setApplication((current) => ({
      ...current,
      pets: current.pets.map((pet) => pet.id === id ? { ...pet, ...updates, photo: '' } : pet),
      applications: current.applications.map((item) => item.petId === id ? { ...item, petName: updates.name || item.petName } : item),
    }))
  }

  const removePet = (id) => {
    setApplication((current) => ({ ...current, pets: current.pets.filter((pet) => pet.id !== id) }))
  }

  const updateProfile = (profile) => {
    setApplication((current) => ({
      ...current,
      owner: { ...current.owner, ...profile },
      account: { ...current.account, name: profile.name, email: profile.email },
    }))
  }

  const submitClaim = (claim) => {
    const claimRecord = {
      ...claim,
      id: makeId('claim'),
      reference: `CLM-${Date.now().toString(36).slice(-6).toUpperCase()}`,
      submittedAt: new Date().toISOString(),
      status: 'Received',
    }
    setApplication((current) => ({ ...current, claims: [claimRecord, ...current.claims] }))
    return claimRecord.reference
  }

  const recordPayment = useCallback((payment) => {
    setApplication((current) => {
      if (current.payments.some((item) => item.reference === payment.reference)) {
        return { ...current, lastPaymentReference: payment.reference }
      }
      return {
        ...current,
        payments: [{ ...payment, recordedAt: new Date().toISOString() }, ...current.payments],
        lastPaymentReference: payment.reference,
      }
    })
  }, [])

  const decideApplication = (id, decision) => {
    const approved = decision === 'approve'
    setApplication((current) => ({
      ...current,
      applications: current.applications.map((item) => item.id === id ? {
        ...item,
        status: approved ? 'Approved' : 'Rejected',
        policyStatus: approved ? 'Active' : 'Declined',
        decisionAt: new Date().toISOString(),
      } : item),
    }))
  }

  const decideClaim = (id, decision) => {
    setApplication((current) => ({
      ...current,
      claims: current.claims.map((item) => item.id === id ? {
        ...item,
        status: decision === 'approve' ? 'Approved' : 'Declined',
        decisionAt: new Date().toISOString(),
      } : item),
    }))
  }

  const updateCustomerStatus = (status) => {
    setApplication((current) => ({ ...current, customerStatus: status }))
  }

  const updatePlan = (id, updates) => {
    setApplication((current) => ({
      ...current,
      plans: current.plans.map((plan) => plan.id === id ? { ...plan, ...updates } : plan),
    }))
  }

  const updatePaymentRecord = (reference, updates) => {
    setApplication((current) => ({
      ...current,
      payments: current.payments.map((payment) => payment.reference === reference ? { ...payment, ...updates } : payment),
    }))
  }

  const value = {
    application,
    updateSection,
    submitApplication,
    resetApplication,
    addPet,
    updatePet,
    removePet,
    updateProfile,
    submitClaim,
    recordPayment,
    decideApplication,
    decideClaim,
    updateCustomerStatus,
    updatePlan,
    updatePaymentRecord,
  }

  return <ApplicationContext.Provider value={value}>{children}</ApplicationContext.Provider>
}
