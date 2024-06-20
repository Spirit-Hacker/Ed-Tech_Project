import React from 'react'
import IconBtn from '../../../common/IconBtn'
import { useDispatch, useSelector } from 'react-redux'
import { buyCourse } from '../../../../services/operations/studentFeaturesAPI'
import { useNavigate } from 'react-router-dom'

const RenderTotalAmount = () => {

    const { total, cart } = useSelector((state) => state.cart);
    const { token } = useSelector((state) => state.auth);
    const { user } = useSelector((state) => state.profile);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleBuyCourse = async() => {
        const courses = cart.map((course) => course._id)
        console.log("Bought these courses - ", courses)

        // TODO: API Integrate -> Payment gateway implementation ✅
        await buyCourse([courses], token, user, navigate, dispatch);
    }

  return (
    <div className="min-w-[280px] rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6">
      <p className="mb-1 text-sm font-medium text-richblack-300">Total:</p>
      <p className="mb-6 text-3xl font-medium text-yellow-100">₹ {total}</p>
      <IconBtn
        text="Buy Now"
        onClick={handleBuyCourse}
        customClasses="w-full justify-center"
      />
    </div>
  )
}

export default RenderTotalAmount
