const Footer = () => {
  return (
    <footer className="text-center py-8 bg-gradient-to-t from-amber-100 to-orange-50 text-gray-800 shadow-md">
      <h2 className="text-3xl font-semibold text-amber-700">Stay Connected</h2>
      <div className="w-16 h-1 bg-amber-500 mx-auto mt-2"></div>

      <p className="mt-3 text-lg text-gray-700">Once an Alumni, Always a Family! 💛</p>

      <div className="flex justify-center items-center gap-8 mt-6 text-gray-700">
        <div className="flex items-center gap-2">
          <span className="text-2xl">📞</span>
          <p className="text-lg">9429388639</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-2xl">✉️</span>
          <p className="text-lg text-amber-700">jaynagar3110@gmail.com</p>
        </div>
      </div>

      <p className="mt-6 text-sm text-gray-600">
        © 2024 - Alumni Connect | Crafted with ❤️ by Jay Nagar
      </p>
    </footer>
  );
};

export default Footer;
