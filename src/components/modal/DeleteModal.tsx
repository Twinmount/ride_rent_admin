import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '../ui/button'
import { useState } from 'react'
import Spinner from '../general/Spinner'
import { useNavigate } from 'react-router-dom'

type DeleteModalProps = {
  onDelete: () => void
  label?: string
  title?: string
  description?: string
  confirmText?: string
  cancelText?: string
  navigateTo?: string
  children?: React.ReactNode
  isLoading?: boolean
}

export default function DeleteModal({
  onDelete,
  label = 'Delete',
  title = 'Confirm Delete',
  description = 'Are you sure you want to delete this item?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isLoading = false,
  navigateTo = '/',
  children,
}: DeleteModalProps) {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const handleClose = () => {
    setOpen(false)
  }

  const handleConfirmDelete = async () => {
    await onDelete()
    setOpen(false)
    navigate(navigateTo)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className="w-full flex-center col-span-2 !text-lg !font-semibold button border border-red-500/70 bg-transparent text-red-500 hover:bg-red-500 hover:text-white transition-all cursor-pointer"
        asChild
      >
        <Button>{label}</Button>
      </DialogTrigger>
      <DialogContent className="w-fit max-sm:w-[95%] mx-auto !rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center">
            {title}
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
          <div>
            {children}
            <div className="flex justify-center gap-3 mt-4">
              <Button
                onClick={handleConfirmDelete}
                className="bg-red-500 hover:bg-red-600 !text-white !font-semibold"
                disabled={isLoading}
              >
                {confirmText} {isLoading && <Spinner />}
              </Button>
              <Button
                onClick={handleClose}
                className="bg-gray-400 hover:bg-gray-500 !text-white"
              >
                {cancelText}
              </Button>
            </div>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
