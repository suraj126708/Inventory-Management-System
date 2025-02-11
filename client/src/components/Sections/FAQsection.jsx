import React, { useState } from "react";

const FAQSection = () => {
  const [activeQuestion, setActiveQuestion] = useState(null);

  const toggleQuestion = (index) => {
    setActiveQuestion(activeQuestion === index ? null : index);
  };

  return (
    <section className="py-10 bg-gray-200 sm:py-16 lg:py-10">
      <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
        <div className="relative inline-block  flex justify-center items-center">
          <div className="absolute inset-0 bg-yellow-400 rounded-full blur-3xl opacity-40 z-30 animate-bounce"></div>
          <h2 className="text-3xl text-center mb-10 font-bold leading-tight text-black sm:text-4xl lg:text-5xl">
            Explore Common Questions
          </h2>
        </div>
        <div className="max-w-3xl mx-auto mt-8 space-y-4 md:mt-16">
          {[
            {
              question: "How can I get started?",
              answer:
                "Getting started is easy! Sign up for an account, and you'll have access to our platform's features. No credit card required for the initial signup.",
            },
            {
              question: "What is the pricing structure?",
              answer:
                "Our pricing structure is flexible. We offer both free and paid plans. You can choose the one that suits your needs and budget.",
            },
            {
              question: "What kind of support do you provide?",
              answer:
                "We offer comprehensive customer support. You can reach out to our support team through various channels, including email, chat, and a knowledge base.",
            },
            {
              question: "Can I cancel my subscription anytime?",
              answer:
                "Yes, you can cancel your subscription at any time without any hidden fees. We believe in providing a hassle-free experience for our users.",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="transition-all duration-200 rounded bg-white border border-gray-200 shadow-lg cursor-pointer hover:bg-gray-50"
            >
              <button
                type="button"
                className="flex items-center justify-between w-full px-4  sm:p-6"
                onClick={() => toggleQuestion(index)}
              >
                <span className="flex text-lg font-semibold text-black">
                  {item.question}
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className={`w-6 h-6 text-gray-400 transform transition-transform duration-200 ${
                    activeQuestion === index ? "rotate-0" : "rotate-180"
                  }`}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </button>
              <div
                className={`px-4 pb-5 sm:px-6 sm:pb-6 transition-all duration-200 ${
                  activeQuestion === index ? "block" : "hidden"
                }`}
              >
                <p>{item.answer}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-center text-gray-600 text-base mt-9">
          Still have questions?{" "}
          <span className="cursor-pointer font-medium text-blue-600 transition-all duration-200 hover:underline">
            Contact our support
          </span>
        </p>
      </div>
    </section>
  );
};

export default FAQSection;
