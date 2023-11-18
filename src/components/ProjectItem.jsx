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
    techStack:
      "Figure Frenzy is an e-commerce app for anime figurine lovers built using React, Mockbee backend, Context API.",
  },
  {
    id: 2,
    img: SocialImg,
    title: "Socio Wave",
    liveLink: "https://socio-buzz.vercel.app/",
    github: "https://github.com/Sonualam-bot/socioBuzz",
    tag: "frontend",
    techStack:
      "A social media for travellers built using React, Mockbee backend, Context API.",
  },
  {
    id: 3,
    img: CssLibImg,
    title: "Css Library",
    liveLink: "https://component-library-beige.vercel.app/",
    github: "https://github.com/Sonualam-bot/Component-Library",
    tag: "frontend",
    techStack:
      "A component libaray built using React, Vanilla CSS, which has components like Avatar, Badge, Headings, Card, Image etc.",
  },
  {
    id: 4,
    img: "https://images.pexels.com/photos/1121482/pexels-photo-1121482.jpeg?auto=compress&cs=tinysrgb&w=600",
    title: "Zomato Api",
    liveLink: "https://documenter.getpostman.com/view/17452120/2s9YC4WZBN",
    github: "",
    tag: "api",
    techStack:
      "The MongoDB Express Restaurant API offers a comprehensive range of endpoints to optimize and streamline restaurant operations.",
  },
  {
    id: 5,
    img: "https://images.pexels.com/photos/614117/pexels-photo-614117.jpeg?auto=compress&cs=tinysrgb&w=600",
    title: "User Auth",
    liveLink: "https://documenter.getpostman.com/view/17452120/2s9YJZ4Qcx",
    github: "",
    tag: "api",
    techStack:
      "User authentication is a crucial aspect of web development, providing secure and seamless access for users. It involves verifying the identity of individuals, ensuring data privacy, and enabling personalized experiences within applications.",
  },
  {
    id: 6,
    img: "https://images.pexels.com/photos/163185/old-retro-antique-vintage-163185.jpeg?auto=compress&cs=tinysrgb&w=600",
    title: "Trip Advisor",
    liveLink: "https://documenter.getpostman.com/view/17452120/2s9YJZ454T",
    github: "",
    tag: "api",
    techStack:
      "The MongoDB Express Node.js Trip API is a powerful tool for managing travel-related data, offering a set of endpoints to facilitate seamless interactions with trip details. This API enables developers to create, retrieve, update, and delete trip information, providing a solid foundation for building feature-rich travel applications.",
  },
  {
    id: 7,
    img: "https://images.pexels.com/photos/3945317/pexels-photo-3945317.jpeg?auto=compress&cs=tinysrgb&w=600",
    title: "Movie API",
    liveLink: "https://documenter.getpostman.com/view/17452120/2s9YBxaGRJ",
    github: "",
    tag: "api",
    techStack:
      "The MongoDB Express Node.js Movie API simplifies movie-related tasks, offering endpoints for CRUD operations, enhancing efficiency in application development.",
  },
  {
    id: 8,
    img: "https://images.pexels.com/photos/1172019/pexels-photo-1172019.jpeg?auto=compress&cs=tinysrgb&w=600",
    title: "Fitness Tracker",
    liveLink: "https://documenter.getpostman.com/view/17452120/2s9YXo1ef7",
    github: "",
    tag: "api",
    techStack:
      "The Fitness Tracker APIs, built with MongoDB and Express, empower developers to create robust applications, seamlessly tracking and managing fitness data",
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
