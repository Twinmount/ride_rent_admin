import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Link } from 'react-router-dom'

interface PromotionType {
  promotionId: string
  promotionImage: any
  promotionLink: string
}

type ModalProps = {
  selectedPromotion: PromotionType
  setSelectedPromotion: (value: null) => void
}

export default function PromotionPreviewModal({
  selectedPromotion,
  setSelectedPromotion,
}: ModalProps) {
  return (
    <Dialog
      open={!!selectedPromotion}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          setSelectedPromotion(null)
        }
      }}
    >
      <DialogContent className="max-w-[700px] w-full max-sm:w-[95%] mx-auto !rounded-3xl">
        <DialogTitle className="text-lg font-semibold text-center">
          Promotion Preview
        </DialogTitle>
        <DialogDescription aria-label="Preview of the selected promotion" />
        <DialogHeader className="w-full max-w-full overflow-hidden">
          <div className="w-full h-auto max-h-[400px] rounded-lg flex-center overflow-hidden">
            <img
              src={selectedPromotion.promotionImage}
              alt="promotion preview"
              loading="lazy"
              className="object-contain w-full h-auto max-w-full max-h-full"
            />
          </div>
          <Link
            to={selectedPromotion.promotionLink}
            className="max-w-full mx-auto text-center text-blue-500"
            target="_blank"
          >
            {selectedPromotion.promotionLink}
          </Link>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
