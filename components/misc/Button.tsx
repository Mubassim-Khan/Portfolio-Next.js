import Link from "next/link";
import { BsArrowRightCircle } from "react-icons/bs";

interface ButtonProps {
  Url: string;
  text: string;
  containerClass?: string;
  icon?: React.ReactNode; // Make optional
}

const CustomButton = ({ Url, text, containerClass, icon }: ButtonProps) => {
  return (
    <button
      className={`group relative z-10 w-fit cursor-pointer overflow-hidden rounded-full bg-indigo-600 hover:bg-indigo-700 px-3 py-1 text-black ${containerClass}`}
    >
      <Link
        href={Url}
        className="group inline-flex items-center text-white text-sm font-medium py-2 px-4 rounded transition-colors duration-300 ease-in-out no-underline gap-2"
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <span className="relative inline-flex overflow-hidden font-general text-xs uppercase">
          <div className="translate-y-0 skew-y-0 transition duration-500 group-hover:translate-y-[-160%] group-hover:skew-y-12">
            {text}
          </div>

          <div className="absolute translate-y-[164%] skew-y-12 transition duration-500 group-hover:translate-y-0 group-hover:skew-y-0">
            {text}
          </div>
        </span>

        {/* Use the passed icon or default to BsArrowRightCircle */}
        {icon || (
          <BsArrowRightCircle
            className="text-lg transition-transform duration-300 ease-in-out group-hover:translate-x-1"
            size={20}
          />
        )}
      </Link>
    </button>
  );
};

export default CustomButton;
