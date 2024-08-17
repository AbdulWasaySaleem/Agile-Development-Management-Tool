import React from 'react'
import SearchInput from './SearchInput'
import Conversations from './Conversations'

const SidebarMessage = () => {
  return (
    <div className='border-r border-slate-900 p-4 flex flex-col'>
      <SearchInput/>
      <div className='border-b-2 '></div>
      <div className=''>

      <Conversations/>
      </div>
    </div>
  )
}

export default SidebarMessage