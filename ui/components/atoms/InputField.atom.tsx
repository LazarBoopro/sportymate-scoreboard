import { useState } from "react";

import { Switch } from "@/components/ui/switch";

import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import "@/ui/styles/atoms/inputField.atom.scss";

type InputType = {
  title?: string;
  placeholder?: string;
  value?: string | boolean;
  name?: string;
  type?: "text" | "password" | "date" | "number" | "switch" | "email";
  required?: boolean;
  onChange?: React.Dispatch<React.SetStateAction<any>>;
};

export default function InputField({
  title,
  placeholder,
  value,
  type = "text",
  name,
  required,
  onChange,
}: InputType) {
  const [showPassword, setShowPassword] = useState("password");

  const handleShowPassword = () => {
    setShowPassword(showPassword === "text" ? "password" : "text");
  };

  const checkType = () => {
    switch (type) {
      case "switch":
        return (
          <Switch
            name={name}
            value={value as string}
            onClick={onChange}
            defaultChecked={value as boolean}
          />
        );

      case "date":
        return (
          <input
            name={name}
            type="date"
            data-date-format="DD MMMM YYYY"
            value={value as string}
            onChange={onChange}
            placeholder="MM/DD/YYYY"
            required={required ? true : false}
          />
        );

      default:
        return (
          <>
            <input
              onChange={onChange}
              value={value as string}
              name={name ?? title}
              type={type === "password" ? showPassword : type}
              id={title}
              placeholder={placeholder}
              required={required ? true : false}
            />

            {type === "password" && (
              <button
                type="button"
                onClick={handleShowPassword}
                className="show-password"
              >
                {showPassword !== "text" ? (
                  <IoEyeOutline />
                ) : (
                  <IoEyeOffOutline />
                )}
              </button>
            )}
          </>
        );
    }
  };

  return (
    <div className="input-field">
      <label className="input-field__title" htmlFor={title}>
        {title}
      </label>
      <div className="input-field__input">{checkType()}</div>
    </div>
  );
}
