import React from "react";
import { motion } from "framer-motion";

const FeatureCard = ({ image, title, description, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
    className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 transform hover:scale-105"
  >
    <div className="aspect-w-16 aspect-h-9 ">
      <img src={image} alt={title} className="object-cover w-full h-64" />
    </div>
    <div className="p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  </motion.div>
);

const LandingPage = () => {
  const features = [
    {
      title: "For Employees",
      description:
        "Enhance productivity with our integrated platform designed for seamless collaboration and real-time communication.",
      delay: 0.2,
      image:
        "https://tse4.mm.bing.net/th?id=OIP.gNGIN8cmONWkSm1t4ctz5QHaGU&pid=Api&P=0&h=180",
    },
    {
      title: "For Shop Owners",
      description:
        "Manage your inventory efficiently with tools and practices that promote effective stock management and continuous improvement.",
      delay: 0.4,
      image:
        "https://tse4.mm.bing.net/th?id=OIP.LrYsDR61OeV_nerW4Nxw_wHaE8&pid=Api&P=0&h=180",
    },
    {
      title: "For Customers",
      description:
        "Enjoy a seamless shopping experience with real-time updates and easy access to product information.",
      delay: 0.6,
      image:
        "https://tse1.mm.bing.net/th?id=OIP.cplh1Maoct_3ckJe9mGpkAHaE8&pid=Api&P=0&h=180",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="relative inline-block mb-4">
            <div className="absolute inset-0 bg-yellow-400 rounded-full blur-3xl opacity-50 animate-bounce"></div>
            <h1 className="relative text-4xl md:text-5xl font-bold text-gray-900">
              Empower Your Team's Innovation
            </h1>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <a
              href="#learn-more"
              className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center"
            >
              Discover our platform
              <svg
                className="w-5 h-5 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </a>
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              title={feature.title}
              description={feature.description}
              delay={feature.delay}
              image={feature.image}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
