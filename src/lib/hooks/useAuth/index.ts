import { useContext } from 'react'
import { AuthContext } from './AuthProvider'

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === null) {
    throw new Error('useAuth can only be used inside an AuthProvider')
  }

  return context
}
