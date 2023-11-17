import HTML from "../assets/html.png";
import CSS from "../assets/css.png";
import Github from "../assets/github2.png";
import Javascript from "../assets/javascript.png";
import React from "../assets/react.png";
import Mongo from "../assets/mongo.png";
import Node from "../assets/node.png";
import Tailwind from "../assets/tailwind.png";

const skillsSet = [
  { icon: HTML, tag: "HTML" },
  { icon: CSS, tag: "CSS" },
  { icon: Javascript, tag: "Javascript" },
  { icon: React, tag: "React" },
  { icon: Github, tag: "Github" },
  { icon: Mongo, tag: "Mongo" },
  { icon: Node, tag: "Node" },
  { icon: Tailwind, tag: "Tailwind" },
];

function Skills() {
  return (
    <div id="skills" className="max-w-[1040px] m-auto md:pl-20 p-4 py-16  ">
      <h1 className="text-4xl font-bold text-center text-[#001b5e]">Skills</h1>
      <div className="w-20 m-auto h-1 rounded-lg bg-[#facc15]"></div>
      {/* <p className=" py-8 text-center text-lg  ">
        This are the technologies that I work with.
      </p> */}

      <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-4 text-center py-8 ">
        {skillsSet?.map((skills, index) => {
          return (
            <div
              key={index}
              className="shadow-md hover:scale-110 duration-500 p-2 rounded-lg "
            >
              <img
                className="w-20 mx-auto "
                src={skills.icon}
                alt={skills.icon}
              />
              <p className="mt-4">{skills.tag}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Skills;
