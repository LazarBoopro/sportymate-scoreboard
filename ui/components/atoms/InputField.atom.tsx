import "@/ui/styles/atoms/inputField.atom.scss";
import { ChangeEventHandler, useState } from "react";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";

type InputType = {
  title: string;
  placeholder: string;
  value: string;
  type?: "text" | "password" | "date" | "number";
  onChange: ChangeEventHandler<HTMLInputElement>;
};

export default function InputField({
  title,
  placeholder,
  value,
  type = "text",
  onChange,
}: InputType) {
  const [showPassword, setShowPassword] = useState("password");

  const handleShowPassword = () => {
    setShowPassword(showPassword === "text" ? "password" : "text");
  };

  return (
    <div className="input-field">
      <label className="input-field__title" htmlFor={title}>
        {title}
      </label>
      <div className="input-field__input">
        <input
          data-date-format="DD MMMM YYYY"
          onChange={onChange}
          value={value}
          name={title}
          type={type === "password" ? showPassword : type}
          id={title}
          placeholder={placeholder}
        />
        {type === "password" && (
          <button
            type="button"
            onClick={handleShowPassword}
            className="show-password"
          >
            {showPassword !== "text" ? <IoEyeOutline /> : <IoEyeOffOutline />}
          </button>
        )}
      </div>
    </div>
  );
}
