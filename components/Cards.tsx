import { Models } from 'node-appwrite'
import React from 'react'

const Cards = ({file}:{file: Models.Document}) => {
  return (
    <div>
      {file.name}
    </div>
  )
}

export default Cards
