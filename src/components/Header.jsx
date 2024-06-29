import React from 'react'

const Header = () => {
  return (
    <div className='d-flex px-3 py-3 bg-primary text-white'>
        <div>Todo App</div>
        <div className='d-flex ms-auto'>
            <div className='mx-3'>Home</div>
            <div className='mx-3'>My Tasks</div>
        </div>
    </div>
  )
}

export default Header