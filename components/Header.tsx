import Image from 'next/image'
import React from 'react'
import FileUpload from './FileUpload'
import Search from './Search'

const Header = () => {
  return (
    <header className='header'>
      <Search/>
      <div className='header-wrapper'>
        <FileUpload/>
        <form>
          <button type='submit' className='sign-out-button'>
            <Image src="assets/icons/logout.svg" width={24} height={24} alt='logout' className='w-6' />
          </button>
        </form>
      </div>
    </header>
  )
}

export default Header
