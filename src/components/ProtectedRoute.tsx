import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth, hasRole } from '../contexts/AuthContext'
import type { UserRole } from '../contexts/AuthContext'
import { Loading } from './ds/Loading'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles: UserRole[]
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { profile, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center">
        <Loading />
      </div>
    )
  }

  if (!profile) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (!hasRole(profile, ...allowedRoles)) {
    return <Navigate to="/login" state={{ from: location, unauthorised: true }} replace />
  }

  return <>{children}</>
}
