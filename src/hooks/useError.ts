import { useState, useCallback } from 'react'

type Error = {
  name: string
  message: string
}

export type Errors = Record<string, Error>

import { ErrorMessage } from '@/components/Error'

export const useError = () => {
  const [errors, setErrorState] = useState<Errors>({})

  const setError = useCallback(
    ({ name, message }: { name: string; message: string }) => {
      setErrorState((prevState) => ({
        ...prevState,
        [name]: { name, message },
      }))
    },
    []
  )

  const removeError = useCallback((name: string) => {
    setErrorState((prevState) => {
      const { [name]: removed, ...rest } = prevState
      return rest
    })
  }, [])

  return {
    errors,
    setError,
    removeError,
    ErrorMessage,
  }
}
