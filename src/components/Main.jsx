import { TypeAnimation } from "react-type-animation";
import GraphemeSplitter from "grapheme-splitter";
import { FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

const splitter = new GraphemeSplitter();

function Main() {
  return (
    <div id="main">
      <img
        className="w-full h-screen object-cover object-left scale-x-[-1]"
        src="https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=1931&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt="/"
      />
      <div className="w-full h-screen absolute top-0 left-0 bg-white/50">
        <div className=" a-auto h-full w-full flex flex-col justify-center lg:items-center items-center ">
          <h2 className="sm:text-5xl text-6xl font-bold text-gray-800">
            <TypeAnimation
              splitter={(str) => splitter.splitGraphemes(str)}
              sequence={[
                "Hello",
                2000,
                "Ciao",
                2000,
                "你好",
                2000,
                "Здравейте",
                2000,
                "Hola",
                2000,
                "Bonjour",
                2000,
                "नमस्ते",
                2000,
              ]}
              wrapper="span"
              cursor={true}
              speed={50}
              style={{ fontSize: "1em", paddingLeft: "5px" }}
              repeat={Infinity}
            />
          </h2>
          <h1 className="sm:text-5xl text-4xl font-semibold text-gray-800">
            I&apos;m Md Sonu Alam
          </h1>
          <h2 className="flex sm:text-3xl text-2xl pt-4 text-gray-800 ">
            I&apos;m a
            <TypeAnimation
              sequence={[
                "Developer",
                2000,
                "Coder",
                2000,
                "Tech Enthusiast",
                2000,
              ]}
              wrapper="span"
              cursor={true}
              speed={50}
              style={{ fontSize: "1em", paddingLeft: "5px" }}
              repeat={Infinity}
            />
          </h2>
          <div className="flex justify-between pt-6 max-w-[200px] w-full">
            <FaTwitter className="cursor-pointer" size={20} />
            <FaInstagram className="cursor-pointer" size={20} />
            <FaLinkedin className="cursor-pointer" size={20} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Main;
