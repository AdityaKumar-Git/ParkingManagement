import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="flex flex-col justify-center items-center min-h-[calc(100vh-18.75vh)] bg-white p-6">
      <div className="max-w-3xl text-center">
        <h1 className="text-4xl font-bold mb-6 flex flex-row justify-center">Parking<p className=' text-red-500'>Companion</p></h1>
        <p className="text-lg mb-4">
          Welcome to your Parking Companion
        </p>
        <p className="text-lg mb-8">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ducimus pariatur unde excepturi ullam commodi, quam, maiores quo natus tenetur repellendus adipisci explicabo labore corrupti quisquam fugiat cupiditate? Itaque iste nam culpa iure molestias debitis? Velit amet veritatis nesciunt eaque molestias inventore impedit culpa nobis dolor, corporis, quos delectus saepe eius.
        </p>
        <div className="flex justify-center space-x-4">
          <Link to="/analyzer">
            <button className="bg-mblue text-white py-2 px-6 rounded hover:bg-gray-900 transition duration-300">
              Reserve Your Slot
            </button>
          </Link>
          <Link to="/about">
            <button className="bg-mblue text-white py-2 px-6 rounded hover:bg-gray-900 transition duration-300">
              About Us
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;