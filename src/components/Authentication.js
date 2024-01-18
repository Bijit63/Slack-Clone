import React, { useContext } from 'react'
import { Context } from '../Context/NoteContext'

const Authentication = () => {

    const context = useContext(Context)
    const {user,setUser }= context
  return (
    <div></div>
  )
}

export default Authentication