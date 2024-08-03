import React from "react";

const Footer = () => {
  return (
    <footer className="bg-secondary-100 text-center dark:bg-secondary-600 w-auto bg-gray-800 text-white shadow-md">
      <div className="bg-secondary-200 p-4 text-center text-secondary-700 dark:bg-secondary-700 dark:text-secondary-200">
        © 2023 Copyright:
        <a
          className="text-secondary-800 dark:text-secondary-400"
          href="https://tw-elements.com/"
        >
          TW Elements
        </a>
      </div>
    </footer>
  );
};

export default Footer;
