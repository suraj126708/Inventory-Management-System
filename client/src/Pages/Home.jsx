import Navbar from "../components/NavBar";

const Home = () => {
  return (
    <>
      <Navbar />
      <div className="">
        <div className="w-full h-screen flex justify-center items-center flex-col space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">Brand</h1>
          <p className="text-gray-900">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus,
            quae.
          </p>
        </div>
      </div>
    </>
  );
};

export default Home;
