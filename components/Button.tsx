import Link from "next/link";
import { BsArrowRightCircle } from "react-icons/bs";

interface ButtonProps {
  Url: string;
  text: string;
}

const CustomButton = ({ Url, text }: ButtonProps) => {
  return (
    <Link
      href={Url}
      className="group inline-flex items-center bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2 px-4 rounded transition-colors duration-300 ease-in-out no-underline gap-2"
      target="_blank"
      rel="noopener noreferrer"
    >
      <BsArrowRightCircle className="text-lg transition-transform duration-300 ease-in-out group-hover:translate-x-1" size={20} />
      {text}
    </Link>
  )
}

export default CustomButton