import React from 'react'
import { Users, Car, Box, Tag, Eye } from 'lucide-react'

const Dashboard: React.FC = () => {
  return (
    <section className="relative h-auto min-h-screen p-6 py-10 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <h2 className="mb-6 text-2xl font-bold">Admin Dashboard</h2>

        <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="p-4 text-center bg-white rounded-lg shadow">
            <Users className="w-10 h-10 mx-auto text-[#FFB347]" />
            <p className="mt-4 text-lg font-semibold">Total Agents</p>
            <p className="text-4xl font-bold text-[#FFB347] mt-2">{999}</p>
          </div>
          <div className="p-4 text-center bg-white rounded-lg shadow">
            <Car className="w-10 h-10 mx-auto text-[#FFB347]" />
            <p className="mt-4 text-lg font-semibold">Total Vehicles</p>
            <p className="text-4xl font-bold text-[#FFB347] mt-2">{999}</p>
          </div>
          <div className="p-4 text-center bg-white rounded-lg shadow">
            <Box className="w-10 h-10 mx-auto text-[#FFB347]" />
            <p className="mt-4 text-lg font-semibold">Total Brands</p>
            <p className="text-4xl font-bold text-[#FFB347] mt-2">{999}</p>
          </div>
          <div className="p-4 text-center bg-white rounded-lg shadow">
            <Tag className="w-10 h-10 mx-auto text-[#FFB347]" />
            <p className="mt-4 text-lg font-semibold">Total Categories</p>
            <p className="text-4xl font-bold text-[#FFB347] mt-2">{999}</p>
          </div>
          <div className="p-4 text-center bg-white rounded-lg shadow">
            <Eye className="w-10 h-10 mx-auto text-[#FFB347]" />
            <p className="mt-4 text-lg font-semibold">Total Visits Today</p>
            <p className="text-4xl font-bold text-[#FFB347] mt-2">{999}</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Dashboard
