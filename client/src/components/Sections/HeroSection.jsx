function HeroSection() {
  return (
    <>
      <div className="flex z-50 h-screen container-heropage justify-center items-center dark:bg-gray-200">
        {/* Hero Content */}
        <div className="text-center max-w-6xl mx-10">
          <p className="my-3 text-sm tracking-widest text-yellow-500 uppercase">
            Efficient &amp; Reliable
          </p>
          <h1 className="my-3 text-3xl font-bold tracking-tight text-gray-800 md:text-5xl dark:text-black">
            Manage Your Inventory Seamlessly
          </h1>
          <div>
            <p className="max-w-2xl mx-auto my-2 text-base text-gray-500 md:leading-relaxed md:text-xl dark:text-gray-400">
              Our inventory management system helps you keep track of your stock
              levels, orders, sales, and deliveries efficiently. Streamline your
              operations and improve your business performance with our advanced
              tools and features.
            </p>
          </div>
          <div className="flex flex-col items-center justify-center gap-5 mt-6 md:flex-row">
            <a
              className="inline-block w-auto text-center min-w-[200px] px-6 py-4 text-black transition-all rounded-md shadow-xl sm:w-auto bg-gradient-to-r from-yellow-600 to-yellow-500 hover:bg-gradient-to-b dark:shadow-yellow-900 shadow-yellow-200 hover:shadow-2xl hover:shadow-yellow-400 hover:-translate-y-px"
              href="/features"
            >
              Explore Features
            </a>
            <a
              className="inline-block w-auto text-center min-w-[200px] px-6 py-4 text-black transition-all bg-gray-700 dark:bg-white dark:text-gray-800 rounded-md shadow-xl sm:w-auto hover:bg-gray-900 hover:text-white shadow-neutral-300 dark:shadow-neutral-700 hover:shadow-2xl hover:shadow-neutral-400 hover:-translate-y-px"
              href="/contact"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

export default HeroSection;
