import React from 'react'
import { Button } from './ui/button'

function PurchaseCourseButton({handleEsewa}) {
  return (
      <Button onClick={()=>handleEsewa()} className={"w-full cursor-pointer"}>Purchase Course</Button>
  )
}

export default PurchaseCourseButton
