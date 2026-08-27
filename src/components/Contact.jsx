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
      <h1 className="pt-4 text-3xl sm:text-4xl font-display font-bold text-center text-stone-900">
        Contact
      </h1>
      <div className="w-28 mb-8 m-auto h-1 rounded-lg bg-teal-600"></div>
      <form
        action="https://getform.io/f/c2cca6fe-6b25-423a-8360-3f2400dc1ff5"
        method="POST"
        encType="multipart/form-data"
        onSubmit={handleOnSubmit}
      >
        <div className="grid md:grid-cols-2 gap-4 w-full py-2">
          <div className="flex flex-col">
            <label className="uppercase text-sm py-2 text-stone-500">Name</label>
            <input
              className="rounded-lg p-3 bg-white border border-stone-300 text-stone-900 focus:outline-none focus:border-teal-600 transition-colors"
              type="text"
              name="name"
              value={formData?.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="flex flex-col">
            <label className="uppercase text-sm py-2 text-stone-500">
              Phone Number
            </label>
            <input
              className="rounded-lg p-3 bg-white border border-stone-300 text-stone-900 focus:outline-none focus:border-teal-600 transition-colors"
              type="number"
              name="phone"
              value={formData?.phone}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className="flex flex-col py-2">
          <label className="uppercase text-sm py-2 text-stone-500">Email</label>
          <input
            className="rounded-lg p-3 bg-white border border-stone-300 text-stone-900 focus:outline-none focus:border-teal-600 transition-colors"
            type="email"
            name="email"
            value={formData?.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="flex flex-col py-2">
          <label className="uppercase text-sm py-2 text-stone-500">
            Subject
          </label>
          <input
            className="rounded-lg p-3 bg-white border border-stone-300 text-stone-900 focus:outline-none focus:border-teal-600 transition-colors"
            type="text"
            name="subject"
            value={formData?.subject}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="flex flex-col py-2">
          <label className="uppercase text-sm py-2 text-stone-500">
            Message
          </label>
          <textarea
            className="rounded-lg p-3 bg-white border border-stone-300 text-stone-900 focus:outline-none focus:border-teal-600 transition-colors"
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
          className="bg-stone-900 hover:bg-teal-600 text-white font-semibold mt-4 w-full p-4 rounded-lg transition-colors"
        >
          Send Message
        </button>
      </form>
    </div>
  );
}

export default Contact;
