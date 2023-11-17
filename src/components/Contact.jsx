function Contact() {
  return (
    <div id="contact" className="max-w-[1040px] m-auto md:pl-20 p-4 py-16 ">
      <h1 className="pt-4 text-4xl font-bold text-center text-[#001b5e]">
        Contact
      </h1>
      <div className="w-28 mb-4 m-auto h-1 rounded-lg bg-[#facc15]"></div>
      <form
        action="https://getform.io/f/c2cca6fe-6b25-423a-8360-3f2400dc1ff5"
        method="POST"
        encType="multipart/form-data"
      >
        <div className="grid md:grid-cols-2 gap-4 w-full py-2">
          <div className="flex flex-col">
            <label className="uppercase text-sm py-2">Name</label>
            <input
              className="border-2 rounded-lg p-3 flex border-gray-300"
              type="text"
              name="name"
              required
            />
          </div>
          <div className="flex flex-col">
            <label className="uppercase text-sm py-2">Phone Number</label>
            <input
              className="border-2 rounded-lg p-3 flex border-gray-300"
              type="number"
              name="phone"
            />
          </div>
        </div>
        <div className="flex flex-col py-2 ">
          <label className="uppercase text-sm py-2">Email</label>
          <input
            className="border-2 rounded-lg p-3 flex border-gray-300"
            type="email"
            name="email"
            required
          />
        </div>
        <div className="flex flex-col py-2 ">
          <label className="uppercase text-sm py-2">Subject</label>
          <input
            className="border-2 rounded-lg p-3 flex border-gray-300"
            type="text"
            name="subject"
            required
          />
        </div>
        <div className="flex flex-col py-2 ">
          <label className="uppercase text-sm py-2">Message</label>
          <textarea
            className="border-2 rounded-lg p-3 border-gray-300"
            type="text"
            name="message"
            rows="10"
            required
          ></textarea>
        </div>

        <button className="bg-[#001b5e] text-gray-100 mt-4 w-full p-4 rounded-lg">
          Send Message
        </button>
      </form>
    </div>
  );
}

export default Contact;
