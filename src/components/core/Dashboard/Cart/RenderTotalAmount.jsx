import React from 'react'
import IconBtn from '../../../common/IconBtn'
import { useSelector } from 'react-redux'

const RenderTotalAmount = () => {

    const { total, cart } = useSelector((state) => state.cart)
    const handleBuyCourse = () => {
        const courses = cart.map((course) => course._id)
        console.log("Bought these courses - ", courses)

        // TODO: API Integrate -> Payment gateway implementation
    }

  return (
    <div>
      <p>Total:</p>
      <p>Rs. {total}</p>

      <IconBtn
          text={"Buy Now"}
          onClick={handleBuyCourse}
          customClasses={"w-full justify-center"}
      />
    </div>
  )
}

export default RenderTotalAmount
