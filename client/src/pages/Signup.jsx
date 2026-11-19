import signupImg from "../assets/Images/signup.webp"
import Template from "../components/core/Auth/Template"

function Signup() {
  return (
    <Template
      title="Accelerate your learning journey with StudyBuddy AI for free"
      description1="Build deep mastery with adaptive video courses and lecture copilots."
      description2="Knowledge synthesized into memory through active recall."
      image={signupImg}
      formType="signup"
    />
  )
}

export default Signup
