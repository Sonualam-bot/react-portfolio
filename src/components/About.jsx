import RenonImg from "../assets/Renon.jpeg";

function About() {
  return (
    <div id="about" className="max-full  mx-auto md:pl-8 p-4 py-16  ">
      <h1 className="text-4xl font-bold text-center text-[#001b5e] mb-1">
        About
      </h1>
      <div className="w-20 m-auto h-1 rounded-lg bg-[#facc15] mb-8"></div>

      <div className="max-w-3xl pb-16  mx-auto grid grid-cols-1 md:grid-cols-2">
        <div className="rounded-xl md:w-[280px] mx-auto md:mx-0  md:mb-0 overflow-hidden shadow-lg ring-stone-100 ">
          <img
            src={RenonImg}
            alt="/dev"
            className="w-full h-full rounded-xl  "
          />
        </div>
        <div className="flex flex-col ">
          <p className="text-lg md:text-lg text-left mb-4 ">
            I am Md. Sonu Alam, a skillful front-end web developer with a strong
            passion for creating dynamic and user-friendly websites. I thrive on
            collaborating effectively to drive projects forward.
          </p>
          <p className="text-lg md:text-lg text-left mb-2 ">
            I find development to be a canvas where I turn innovative ideas into
            engaging online experiences. Beyond coding, I bring a keen eye for
            design, ensuring not just functionality but also a seamless and
            visually appealing user interface. I am driven by the belief that
            excellent software has the power to positively impact and improve
            the lives of those around me.
          </p>
          <a
            href="https://drive.google.com/file/d/1CubCYlXv_fIH-AN5n6MtTWdYPbZ_3fKh/view?usp=sharing"
            className=" w-[170px] mx-auto p-2 cursor-pointer hover:scale-110 duration-500 text-white px-2 font-bold rounded-full 
          bg-gradient-to-r from-green-400 to-blue-500 hover:from-indigo-500 hover:to-blue-500"
            target="_blank"
            rel="noreferrer"
          >
            Download Resume
          </a>
        </div>
      </div>
    </div>
  );
}

export default About;
