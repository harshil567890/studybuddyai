import { toast } from "react-hot-toast"

import rzpLogo from "../../assets/Logo/rzp_logo.png"
import { resetCart } from "../../slices/cartSlice"
import { setPaymentLoading } from "../../slices/courseSlice"
import { apiConnector } from "../apiConnector"
import { studentEndpoints } from "../apis"

const {
  COURSE_PAYMENT_API,
  COURSE_VERIFY_API,
  SEND_PAYMENT_SUCCESS_EMAIL_API,
} = studentEndpoints

// Load the Razorpay SDK from the CDN
function loadScript(src) {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true)
      return
    }
    const existingScript = document.querySelector(`script[src="${src}"]`)
    if (existingScript) {
      if (window.Razorpay) {
        resolve(true)
      } else {
        existingScript.addEventListener("load", () => resolve(true))
        existingScript.addEventListener("error", () => resolve(false))
      }
      return
    }
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

// Buy the Course
export async function BuyCourse(
  token,
  courses,
  user_details,
  navigate,
  dispatch
) {
  const toastId = toast.loading("Connecting to payment gateway...")
  try {
    // Ensure Razorpay SDK is loaded
    const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js")

    if (!res || !window.Razorpay) {
      toast.error(
        "Razorpay SDK failed to load. Please disable ad-blockers and check your connection."
      )
      toast.dismiss(toastId)
      return
    }

    // Initiating the Order in Backend
    const orderResponse = await apiConnector(
      "POST",
      COURSE_PAYMENT_API,
      {
        courses,
      },
      {
        Authorization: `Bearer ${token}`,
      }
    )

    if (!orderResponse.data.success) {
      throw new Error(orderResponse.data.message || "Failed to initiate order")
    }
    const orderData = orderResponse.data.data
    if (!orderData || !orderData.id) {
      throw new Error("Invalid order response from gateway")
    }

    const rzpKey = orderData.keyId || process.env.REACT_APP_RAZORPAY_KEY
    if (!rzpKey) {
      throw new Error("Razorpay Key ID is not configured")
    }

    // Only fallback if server explicitly returned mock order (no API keys configured on backend)
    if (orderData.isFallback) {
      await verifyPayment(
        {
          courses,
          razorpay_order_id: orderData.id,
          razorpay_payment_id: "pay_mock_" + Date.now(),
          razorpay_signature: "free_sandbox_enrollment",
        },
        token,
        navigate,
        dispatch
      )
      toast.dismiss(toastId)
      return
    }

    // Opening the Razorpay SDK
    const fullName = `${user_details?.firstName || ""} ${user_details?.lastName || ""}`.trim() || "Student"
    const options = {
      key: rzpKey,
      currency: orderData.currency || "INR",
      amount: `${orderData.amount}`,
      order_id: orderData.id,
      name: "StudyBuddy AI",
      description: "Thank you for Purchasing the Course.",
      image: rzpLogo,
      prefill: {
        name: fullName,
        email: user_details?.email || "",
        contact: user_details?.additionalDetails?.contactNumber || "9999999999",
      },
      modal: {
        ondismiss: function () {
          toast.dismiss(toastId)
          toast("Payment modal closed", { icon: "ℹ️" })
        },
      },
      handler: function (response) {
        toast.loading("Payment received! Verifying enrollment...", { id: toastId })
        sendPaymentSuccessEmail(response, orderData.amount, token)
        verifyPayment({ ...response, courses }, token, navigate, dispatch, toastId)
      },
    }

    const paymentObject = new window.Razorpay(options)

    paymentObject.on("payment.failed", function (response) {
      toast.error("Oops! Payment Failed: " + (response.error?.description || "Declined"), { id: toastId })
      console.log("Razorpay payment failure:", response.error)
    })

    toast.dismiss(toastId)
    paymentObject.open()
  } catch (error) {
    console.log("PAYMENT API ERROR............", error)
    toast.error(error.message || "Could Not make Payment.", { id: toastId })
  }
}

// Verify the Payment
async function verifyPayment(bodyData, token, navigate, dispatch, activeToastId) {
  const toastId = activeToastId || toast.loading("Verifying Payment...")
  dispatch(setPaymentLoading(true))
  try {
    const response = await apiConnector("POST", COURSE_VERIFY_API, bodyData, {
      Authorization: `Bearer ${token}`,
    })

    console.log("VERIFY PAYMENT RESPONSE FROM BACKEND............", response)

    if (!response.data.success) {
      throw new Error(response.data.message)
    }

    toast.success("Payment Successful! You are Added to the course.", { id: toastId })
    navigate("/dashboard/enrolled-courses")
    dispatch(resetCart())
  } catch (error) {
    console.log("PAYMENT VERIFY ERROR............", error)
    toast.error("Could Not Verify Payment.", { id: toastId })
  } finally {
    dispatch(setPaymentLoading(false))
  }
}

// Send the Payment Success Email
async function sendPaymentSuccessEmail(response, amount, token) {
  try {
    await apiConnector(
      "POST",
      SEND_PAYMENT_SUCCESS_EMAIL_API,
      {
        orderId: response.razorpay_order_id,
        paymentId: response.razorpay_payment_id,
        amount,
      },
      {
        Authorization: `Bearer ${token}`,
      }
    )
  } catch (error) {
    console.log("PAYMENT SUCCESS EMAIL ERROR............", error)
  }
}
