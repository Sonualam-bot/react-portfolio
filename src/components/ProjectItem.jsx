import EcomImg from "../assets/ecom.jpg";
import SocialImg from "../assets/social.png";
import CssLibImg from "../assets/csslib.png";

export const ProjectItem = [
  {
    id: 1,
    img: EcomImg,
    title: "E-commerce",
    liveLink: "https://figurefrenzy.vercel.app/",
    github: "https://github.com/Sonualam-bot/figurefrenzy",
    tag: "frontend",
    techStack: ["ReactJs", "Css"],
  },
  {
    id: 2,
    img: SocialImg,
    title: "Socio Wave",
    liveLink: "https://socio-buzz.vercel.app/",
    github: "https://github.com/Sonualam-bot/socioBuzz",
    tag: "frontend",
    techStack: ["ReactJs", "Css"],
  },
  {
    id: 3,
    img: CssLibImg,
    title: "Css Library",
    liveLink: "https://component-library-beige.vercel.app/",
    github: "https://github.com/Sonualam-bot/Component-Library",
    tag: "frontend",
    techStack: ["ReactJs", "Css"],
  },
  {
    id: 4,
    img: "https://images.pexels.com/photos/1121482/pexels-photo-1121482.jpeg?auto=compress&cs=tinysrgb&w=600",
    title: "Zomato Api",
    liveLink: "https://documenter.getpostman.com/view/17452120/2s9YC4WZBN",
    github: "",
    tag: "api",
    techStack: ["MongoDb", "ExpressJS"],
  },
  {
    id: 5,
    img: "https://images.pexels.com/photos/614117/pexels-photo-614117.jpeg?auto=compress&cs=tinysrgb&w=600",
    title: "User Auth",
    liveLink: "https://documenter.getpostman.com/view/17452120/2s9YJZ4Qcx",
    github: "",
    tag: "api",
    techStack: ["MongoDb", "ExpressJS"],
  },
  {
    id: 6,
    img: "https://images.pexels.com/photos/163185/old-retro-antique-vintage-163185.jpeg?auto=compress&cs=tinysrgb&w=600",
    title: "Trip Advisor",
    liveLink: "https://documenter.getpostman.com/view/17452120/2s9YJZ454T",
    github: "",
    tag: "api",
    techStack: ["MongoDb", "ExpressJS"],
  },
  {
    id: 7,
    img: "https://images.pexels.com/photos/3945317/pexels-photo-3945317.jpeg?auto=compress&cs=tinysrgb&w=600",
    title: "Movie API",
    liveLink: "https://documenter.getpostman.com/view/17452120/2s9YBxaGRJ",
    github: "",
    tag: "api",
    techStack: ["MongoDb", "ExpressJS"],
  },
  {
    id: 8,
    img: "https://images.pexels.com/photos/1172019/pexels-photo-1172019.jpeg?auto=compress&cs=tinysrgb&w=600",
    title: "Fitness Tracker",
    liveLink: "https://documenter.getpostman.com/view/17452120/2s9YXo1ef7",
    github: "",
    tag: "api",
    techStack: ["MongoDb", "ExpressJS"],
  },
  // {
  //   id: 9,
  //   img: "https://images.pexels.com/photos/1172019/pexels-photo-1172019.jpeg?auto=compress&cs=tinysrgb&w=600",
  //   title: "Fitness Tracker",
  //   liveLink: "https://fitness-tracker-orpin.vercel.app/user",
  //   github: "https://github.com/Sonualam-bot/fitness-tracker",
  //   tag: "frontend",
  // },
];

export const FrontEndProjects = [...ProjectItem]?.filter(
  (item) => item.tag === "frontend"
);

export const BackendApi = [...ProjectItem]?.filter(
  (item) => item.tag === "api"
);
