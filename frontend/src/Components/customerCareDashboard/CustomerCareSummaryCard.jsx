import React from 'react'

const CustomerCareSummaryCard = ({icon, text, number, color}) => {
  return (
    <div className=' rounded flex bg-white'>
      <div className={` text-3xl flex justify-center items-center ${color} text-white px-4 rounded-2xl`}>
        {icon}
      </div>
      <div className=' pl-4 py-1'>
        <p className=' text-lg font-semibold'>{text}</p>
        <p className=' text-xl font-bold'>{number}</p>
      </div>
    </div>
  )
}

export default CustomerCareSummaryCard