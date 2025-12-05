import React from "react";
import { motion } from "framer-motion"; 
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const About = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-100 via-gray-50 to-gray-100 pt-20">
      <Navbar />

      {/* Hero Section */}
      <div
        className="relative w-full h-[60vh] bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage: "url('/images/acadamic.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative text-center text-white">
          <motion.h1
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-5xl font-bold"
          >
            About Me
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-lg mt-2"
          >
            Final Year IT Student | Web Developer
          </motion.p>
        </div>
      </div>

      {/* About Section - Combined Card for Image and Info */}
      <div className="flex justify-center items-center py-12 px-6 gap-10">
        {/* Combined Card with Photo and Info */}
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="bg-white rounded-2xl shadow-lg p-10 w-full md:w-2/3 max-w-4xl flex items-center"
        >
          {/* Left Side - Image (Square) */}
          <div className="flex-shrink-0 w-48 h-68">
            <img
              src="/images/jayz.jpeg" // Replace with your photo
              alt="Jay Nagar"
              className="rounded-lg w-full h-full object-cover shadow-lg"
            />
          </div>

          {/* Right Side - Merged Info */}
          <div className="flex flex-col justify-start ml-8">
            <p className="text-gray-600 text-lg">
              Hi, I’m Jay Nagar, a passionate Information Technology student at SAL College of Engineering, currently pursuing my Bachelor of Engineering (B.E.) in my final year. Over the course of my academic journey, I've developed a keen interest in web development and technology. I’m working on a Student-Alumni Connection Platform as part of my final year project. This platform is designed to foster stronger connections between students and alumni, allowing them to network, share career opportunities, and collaborate. The platform is being developed using the MERN stack (MongoDB, Express.js, React.js, Node.js) to create a user-friendly, efficient, and interactive system.
            </p>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default About;
