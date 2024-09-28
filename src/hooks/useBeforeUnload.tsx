import { useEffect } from 'react'

const useBeforeUnload = (
  message: string,
  cleanUpUnsubmittedImages: () => Promise<void>
) => {
  useEffect(() => {
    const handleBeforeUnload = async (event: BeforeUnloadEvent) => {
      // Trigger cleanup logic
      await cleanUpUnsubmittedImages()

      // Display a confirmation dialog
      event.preventDefault()
      event.returnValue = message // Show warning to user in modern browsers
    }

    const handleUnload = async () => {
      // Ensure cleanup happens during unload
      await cleanUpUnsubmittedImages()
    }

    // Add both `beforeunload` and `unload` event listeners
    window.addEventListener('beforeunload', handleBeforeUnload)
    window.addEventListener('unload', handleUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      window.removeEventListener('unload', handleUnload)
    }
  }, [message, cleanUpUnsubmittedImages])
}

export default useBeforeUnload
