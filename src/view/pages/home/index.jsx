import React, { useEffect } from 'react'

export default function Landing({ history }) {
  useEffect(() => {
    const token = localStorage.getItem('@token')
    if (token) {
      history.push('/admin/dashboard')
    } else {
      history.push('/login')
    }
  }, [])

  return <>CRM</>
}
