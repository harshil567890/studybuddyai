import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, BookOpen } from "lucide-react";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

function Template({ image, formType }) {
  const { loading } = useSelector((state) => state.auth);
  const isLogin = formType === "login";
  return (
    <main className={`auth-page ${isLogin ? "auth-login" : "auth-signup"}`}>
      {loading ? (
        <div className="auth-loading">
          <div className="spinner" />
        </div>
      ) : (
        <div className="auth-layout">
          <aside className="auth-editorial">
            <div className="auth-editorial-top">
              <span className="eyebrow">A SPACE FOR YOUR NEXT CHAPTER</span>
              <ArrowUpRight size={20} />
            </div>
            <div className="auth-editorial-heading">
              <h2>
                {isLogin ? (
                  <>
                    A familiar place.
                    <br />
                    <span className="editorial-serif">
                      A fresh perspective.
                    </span>
                  </>
                ) : (
                  <>
                    Big ideas begin
                    <br />
                    <span className="editorial-serif">with a small step.</span>
                  </>
                )}
              </h2>
              <p>
                {isLogin
                  ? "Pick up where you left off. Your next moment of understanding is waiting."
                  : "Build a learning routine that feels like yours. Bring your curiosity; we will bring the tools."}
              </p>
            </div>
            <div className="auth-image">
              <img
                src={image}
                alt={
                  isLogin
                    ? "A focused learner at a softly lit study desk"
                    : "Two students exploring a library together"
                }
              />
              <div className="auth-image-caption">
                <BookOpen size={16} />
                <span>Less noise. More understanding.</span>
              </div>
            </div>
            <div className="auth-editorial-bottom">
              <span>LEARN AT YOUR OWN PACE.</span>
              <span>STUDYBUDDY AI</span>
            </div>
          </aside>
          <section className="auth-form-panel">
            <Link to="/" className="auth-back">
              <ArrowLeft size={15} /> Back to home
            </Link>
            <div className="auth-form-content">
              <div className="eyebrow">
                {isLogin ? "YOUR LEARNING CONTINUES" : "MAKE YOURSELF AT HOME"}
              </div>
              <h1>{isLogin ? "Welcome back." : "Start something good."}</h1>
              <p className="auth-description">
                {isLogin
                  ? "Sign in to your own corner of StudyBuddy."
                  : "Create your account. Make space for what comes next."}
              </p>
              {isLogin ? <LoginForm /> : <SignupForm />}
              <p className="auth-switch">
                {isLogin ? "New around here?" : "Already part of StudyBuddy?"}{" "}
                <Link to={isLogin ? "/signup" : "/login"}>
                  {isLogin ? "Create an account" : "Sign in"}{" "}
                  <ArrowUpRight size={13} />
                </Link>
              </p>
              <div className="auth-fineprint">
                A thoughtful place to learn, one day at a time.
              </div>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
export default Template;
