import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Compass, Layers } from "lucide-react";
import FoundingStory from "../assets/Images/FoundingStory.png";
import LearningImage from "../assets/Images/aboutus1.webp";
import Footer from "../components/Common/Footer";
import ContactUsForm from "../components/core/ContactUsPage/ContactUsForm";

const principles = [
  {
    number: "01",
    icon: Compass,
    title: "Curiosity comes first.",
    copy: "Start with the question you cannot stop thinking about. Follow a structured course or bring your own notes. There is more than one way into a subject.",
  },
  {
    number: "02",
    icon: BookOpen,
    title: "Understanding takes practice.",
    copy: "Watching is a beginning. Working through an explanation, testing your recall, and returning to a difficult idea are how knowledge becomes your own.",
  },
  {
    number: "03",
    icon: Layers,
    title: "Your tools should work together.",
    copy: "Keep lectures, questions, flashcards, and study plans close at hand. Spend less energy switching between tools and more time making sense of what matters.",
  },
];

export default function About() {
  return (
    <div className="about-page">
      <main>
        <section className="about-opening page-shell">
          <div className="eyebrow">OUR REASON FOR BEING</div>
          <div className="about-title-row">
            <h1>
              Good learning.
              <br />
              <span className="editorial-serif">A lasting difference.</span>
            </h1>
            <p>
              We believe the most useful thing a learning platform can give you
              is the space to think, the tools to practise, and the confidence
              to keep going.
            </p>
          </div>
          <figure className="about-cover">
            <img
              src={FoundingStory}
              alt="People sharing ideas around a table in a collaborative learning space"
            />
            <figcaption>
              <span>BUILT AROUND THE WAY YOU LEARN</span>
              <span>STUDYBUDDY AI / OUR STORY</span>
            </figcaption>
          </figure>
        </section>
        <section className="about-story page-shell">
          <div className="eyebrow">01 / THE IDEA</div>
          <div>
            <h2>
              More than another
              <br />
              <span className="editorial-serif">open browser tab.</span>
            </h2>
            <p>
              Learning online can feel scattered. A lecture in one place, notes
              in another, and a growing list of questions with nowhere to go.
              StudyBuddy brings these pieces into a more considered workspace.
            </p>
            <p>
              Our approach is simple: give a good explanation room to land.
              Connect video lessons with an AI study companion, turn your notes
              into practice, and revisit what you are still working to
              understand.
            </p>
            <p>
              Whether you are exploring your first technical subject or teaching
              something you know well, this is a place to move forward with
              intention.
            </p>
          </div>
        </section>
        <section className="about-principles">
          <div className="page-shell">
            <div className="about-section-heading">
              <div className="eyebrow">02 / WHAT GUIDES US</div>
              <h2>
                A few things
                <br />
                <span className="editorial-serif">we believe in.</span>
              </h2>
            </div>
            <div className="principle-grid">
              {principles.map(({ number, icon: Icon, title, copy }) => (
                <article key={number} className="principle-card">
                  <div className="principle-top">
                    <span>{number}</span>
                    <Icon size={22} strokeWidth={1.4} />
                  </div>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
        <section className="about-method page-shell">
          <div className="about-method-image">
            <img
              src={LearningImage}
              alt="Learners working together on a hands-on robotics project"
              loading="lazy"
            />
            <span>IDEAS BECOME CLEARER WHEN YOU PUT THEM TO WORK.</span>
          </div>
          <div>
            <div className="eyebrow">03 / A BETTER RHYTHM</div>
            <h2>
              Learn a little.
              <br />
              Try it out.
              <br />
              <span className="editorial-serif">Make it yours.</span>
            </h2>
            <p>
              Choose a course that interests you. Ask questions as you watch.
              Bring a document into the study studio and turn it into
              flashcards, quizzes, or a manageable plan.
            </p>
            <p>
              Progress does not need to be loud. Sometimes it is simply
              understanding an idea that did not make sense yesterday.
            </p>
            <Link to="/studio" className="text-link">
              Find your study rhythm <ArrowRight size={17} />
            </Link>
          </div>
        </section>
        <section className="about-invitation page-shell">
          <div className="eyebrow">THERE IS ALWAYS SOMETHING NEXT</div>
          <h2>
            Stay curious.
            <br />
            <span className="editorial-serif">We will meet you there.</span>
          </h2>
          <p>
            Your next subject, your next question, your next small breakthrough.
          </p>
          <Link to="/signup" className="premium-button">
            Start your next chapter <ArrowRight size={17} />
          </Link>
        </section>
        <section className="about-contact page-shell">
          <div>
            <div className="eyebrow">LET’S TALK</div>
            <h2>
              A question?
              <br />
              <span className="editorial-serif">We are listening.</span>
            </h2>
            <p>
              Tell us what you are learning, what could work better, or what you
              would like to see next.
            </p>
          </div>
          <div className="about-contact-form">
            <ContactUsForm />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
