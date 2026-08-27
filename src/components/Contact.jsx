import { useState } from "react";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleOnSubmit = async () => {
    // e.preventDefault();
    // setFormData({
    //   name: "",
    //   phone: "",
    //   email: "",
    //   subject: "",
    //   message: "",
    // });
  };

  return (
    <div id="contact" className="max-w-[1040px] m-auto md:pl-20 px-4 py-16 sm:py-20">
      <h1 className="pt-4 text-3xl sm:text-4xl font-display font-bold text-center text-white">
        Contact
      </h1>
      <div className="w-28 mb-8 m-auto h-1 rounded-lg bg-lime-400"></div>
      <form
        action="https://getform.io/f/c2cca6fe-6b25-423a-8360-3f2400dc1ff5"
        method="POST"
        encType="multipart/form-data"
        onSubmit={handleOnSubmit}
      >
        <div className="grid md:grid-cols-2 gap-4 w-full py-2">
          <div className="flex flex-col">
            <label className="uppercase text-xs tracking-wider font-display font-semibold py-2 text-lime-400/80">Name</label>
            <input
              className="rounded-lg p-3 bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-lime-400 transition-colors"
              type="text"
              name="name"
              value={formData?.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="flex flex-col">
            <label className="uppercase text-xs tracking-wider font-display font-semibold py-2 text-lime-400/80">
              Phone Number
            </label>
            <input
              className="rounded-lg p-3 bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-lime-400 transition-colors"
              type="number"
              name="phone"
              value={formData?.phone}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className="flex flex-col py-2">
          <label className="uppercase text-xs tracking-wider font-display font-semibold py-2 text-lime-400/80">Email</label>
          <input
            className="rounded-lg p-3 bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-lime-400 transition-colors"
            type="email"
            name="email"
            value={formData?.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="flex flex-col py-2">
          <label className="uppercase text-xs tracking-wider font-display font-semibold py-2 text-lime-400/80">
            Subject
          </label>
          <input
            className="rounded-lg p-3 bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-lime-400 transition-colors"
            type="text"
            name="subject"
            value={formData?.subject}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="flex flex-col py-2">
          <label className="uppercase text-xs tracking-wider font-display font-semibold py-2 text-lime-400/80">
            Message
          </label>
          <textarea
            className="rounded-lg p-3 bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-lime-400 transition-colors"
            type="text"
            name="message"
            value={formData?.message}
            onChange={handleInputChange}
            rows="10"
            required
          ></textarea>
        </div>

        <button
          type="submit"
          className="bg-lime-400 hover:bg-lime-300 text-black font-display font-bold uppercase tracking-wide mt-4 w-full p-4 rounded-lg transition-colors shadow-[0_0_20px_rgba(163,230,53,0.3)]"
        >
          Send Message
        </button>
      </form>
    </div>
  );
}

export default Contact;
