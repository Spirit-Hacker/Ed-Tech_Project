import toast from "react-hot-toast";
import { studentEndpoints } from "../apis";
import { apiConnector } from "../apiConnector";
import razorpay from "../../assets/Images/razorpay.png";
import { setPaymentLoading } from "../../slice/courseSlice";
import { resetCart } from "../../slice/cartSlice";

const {
    COURSE_PAYMENT_API,
    COURSE_VERIFY_API,
    SEND_PAYMENT_SUCCESS_EMAIL_API
} = studentEndpoints;

const loadScript = (src) => {
    return new Promise((resolve) => {
        const script = document.createElement("script")
        script.src = src
        script.onload = () => {
          resolve(true)
        }
        script.onerror = () => {
          resolve(false)
        }
        document.body.appendChild(script)
    })
}

export const buyCourse = async(courses, token, userDetails, navigate, dispatch) => {
    const toast_id = toast.loading("Loading...");
    try {
        const response = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
        console.log("RESPONSE : ", response);
        if(!response){
            toast.error("Razorpay SDK failed to load");
            return;
        }

        const orderResponse = await apiConnector("POST", COURSE_PAYMENT_API, {courses},
            {
                Authorisation: `Bearer ${token}`
            }
        );
        console.log("ORDER RESPONSE : ", orderResponse);
        console.log("ORDER RESPONSE USER : ", userDetails);

        if(!orderResponse.data.success){
            throw new Error(orderResponse.data.message);
        }

        const options = {
            key: process.env.RAZORPAY_KEY,
            currency: orderResponse.data.data.currency,
            amount: orderResponse.data.data.amount,
            order_id: orderResponse.data.data.id,
            name: "StudyNotion",
            description: "Thank You for purchasing the course",
            image: razorpay,
            prefill: {
                name: userDetails.firstName,
                email: userDetails.email
            },
            handler: (response) => {
                console.log("RESPONSE : ", response);
                sendPaymentSuccessEmail(response, orderResponse.data.data.amount, token);
                verifyPayment({...response, courses}, token, navigate, dispatch);
            }
        }

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
        paymentObject.on("payment.failed", function (response) {
            toast.error("Oops! Payment Failed.");
            console.log(response.error);
        });
    }
    catch (error) {
        console.log("Payment API Error....", error);
        toast.error("Could not make payment");
    }

    toast.dismiss(toast_id);
}

const sendPaymentSuccessEmail = async(response, amount, token) => {
    try {
        await apiConnector("POST", SEND_PAYMENT_SUCCESS_EMAIL_API, 
            {
                order_id: response.razorpay_order_id,
                payment_id: response.razorpay_payment_id,
                amount: amount
            },
            {
                Authorisation: `Bearer ${token}`
            }
        );
    }
    catch(error) {
        console.log("Payment Success Email Error", error);
    }
}

const verifyPayment = async(bodyData, token, navigate, dispatch) => {
    const toast_id = toast.loading("Loading...");
    dispatch(setPaymentLoading(true));

    try {
        const response = await apiConnector("POST", COURSE_VERIFY_API, bodyData, 
            {
                Authorisation: `Bearer ${token}`
            }
        );

        if(!response.data.success){
            throw new Error("Payment verification failed");
        }

        toast.success("Payment Successfull, we added you to the course");
        navigate("/dashboard/enrolled-courses");
        dispatch(resetCart());
    }
    catch(error) {
        console.log("payment verification Error", error);
        toast.error("Could not verify payment");
    }

    toast.dismiss(toast_id);
    dispatch(setPaymentLoading(false));
}