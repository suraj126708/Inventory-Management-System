// import Navbar from "../components/NavBar";

import LandingPage from "../components/Sections/AboutHome";
import HeroSection from "../components/Sections/HeroSection";
import FAQSection from "../components/Sections/FAQsection";
import ContactUs from "../components/Sections/ContactUs";

const Home = () => {
  return (
    <>
      {/* <Navbar /> */}
      <div className="">
        <HeroSection />
        <LandingPage />
        <ContactUs />
        <FAQSection />
      </div>
    </>
  );
};

export default Home;
