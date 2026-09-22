import { useContext } from 'react'
import { ApplicationContext } from './applicationContext'

export default function useApplication() {
  const context = useContext(ApplicationContext)
  if (!context) throw new Error('useApplication must be used inside ApplicationProvider')
  return context
}
