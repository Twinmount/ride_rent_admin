import { useState } from 'react'
import {
  ChevronUp,
  ChevronDown,
  Type,
  AlignLeft,
  FilePenLine,
} from 'lucide-react'
import { Link } from 'react-router-dom'

// Define props for the SeoData component
interface SeoDataProps {
  item: {
    metaDataId: string
    metaTitle: string
    metaDescription: string
  }
  truncateText: (text: string, limit: number) => string
  link: string
}

export default function SeoData({ item, truncateText, link }: SeoDataProps) {
  // Local state for expanding/collapsing
  const [isExpanded, setIsExpanded] = useState(false)

  // Toggle expand/collapse state
  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <div
      key={item.metaDataId}
      className="flex flex-col items-start p-4 bg-white border border-gray-200 rounded-lg shadow-md md:flex-row"
    >
      <div className="w-full">
        {/* Meta Title Section */}
        <div className="flex items-start justify-start mb-4">
          <div className="w-6">
            <Type className="w-5 h-5 mr-2 text-gray-800" />
          </div>
          <p className="text-gray-800">
            {isExpanded ? item.metaTitle : truncateText(item.metaTitle, 80)}{' '}
          </p>
        </div>

        {/* Meta Description Section */}
        <div className="flex items-start justify-start">
          <div className="w-6">
            <AlignLeft className="w-5 h-5 mr-2 text-gray-800" />
          </div>
          <p className="text-sm text-gray-600">
            {isExpanded
              ? item.metaDescription
              : truncateText(item.metaDescription, 100)}{' '}
          </p>
        </div>
      </div>

      {/* Expand/Collapse Button */}
      <div className="flex flex-col items-center justify-between h-20 p-0 rounded-full max-md:h-7 max-md:flex-row max-md:ml-auto max-md:mt-2 w-7 max-md:w-fit md:ml-4 md:mt-0 ">
        <Link to={`${link}/${item.metaDataId}`}>
          <FilePenLine className="hover:text-yellow" />
        </Link>

        <button
          className="flex items-center px-4 py-2 font-semibold text-black transition bg-yellow-500 rounded-md hover:bg-yellow-600"
          onClick={toggleExpand}
          aria-label={isExpanded ? 'Collapse content' : 'Expand content'}
        >
          {isExpanded ? (
            <ChevronUp className="text-white rounded-full w-7 h-7 bg-slate-800 hover:bg-slate-900" />
          ) : (
            <ChevronDown className="text-white rounded-full w-7 h-7 bg-slate-800 hover:bg-slate-900" />
          )}
        </button>
      </div>
    </div>
  )
}
