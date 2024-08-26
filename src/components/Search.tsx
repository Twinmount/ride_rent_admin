import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Input } from './ui/input'

function SearchComponent() {
  const [searchValue, setSearchValue] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [searchParams, setSearchParams] = useSearchParams()

  // Debounce function to delay search parameter update
  const debounce = (callback: () => void, delay: number) => {
    let timeoutId: NodeJS.Timeout
    return () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(callback, delay)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchValue(value)

    const regex = /^[a-zA-Z_]*$/
    if (!regex.test(value)) {
      setError('Search term contains invalid characters.')
    } else {
      setError(null)
      if (!value) {
        searchParams.delete('search')
        setSearchParams(searchParams)
      }
    }
  }

  // Debounced search parameter update
  const debouncedUpdateSearchParams = debounce(() => {
    const regex = /^[a-zA-Z_]*$/
    if (regex.test(searchValue)) {
      if (searchValue) {
        setSearchParams({ search: searchValue })
      } else {
        searchParams.delete('search')
        setSearchParams(searchParams)
      }
    } else {
      searchParams.delete('search')
    }
  }, 1000)

  useEffect(() => {
    debouncedUpdateSearchParams()
  }, [searchValue])

  return (
    <div className="flex flex-col justify-start w-full mt-1 mb-8 max-w-[500px] gap-y-2">
      <div className="flex items-center justify-start gap-x-1 ">
        <Input
          type="search"
          value={searchValue}
          onChange={handleInputChange}
          placeholder="Search brands..."
          className="bg-white w-full  h-[40px] focus-visible:ring-offset-0 placeholder:text-gray-500 rounded-2xl p-regular-16 px-4 py-3 border focus-visible:ring-transparent"
        />
      </div>
      {error && <p className="ml-5 text-sm text-red-500">{error}</p>}
    </div>
  )
}

export default SearchComponent
