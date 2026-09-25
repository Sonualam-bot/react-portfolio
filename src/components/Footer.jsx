import SocialLinks from "./SocialLinks";

function Footer() {
  return (
    <footer className="container-page">
      <div className="caption flex flex-col-reverse items-start justify-between gap-2 border-t border-separator py-8 text-secondary sm:flex-row sm:items-center">
        <p>© {new Date().getFullYear()} Md Sonu Alam</p>
        <SocialLinks className="-ml-3 sm:-mr-3 sm:ml-0" />
      </div>
    </footer>
  );
}

export default Footer;
