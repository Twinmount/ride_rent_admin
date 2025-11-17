import { Button } from "@/components/ui/button";
import Spinner from "@/components/general/Spinner";
import React, { ButtonHTMLAttributes } from "react";

type ButtonVariant = "default" | "delete" | "secondary" | "outline" | "ghost";

type Props = {
  text: React.ReactNode;
  isLoading: boolean;
  variant?: ButtonVariant;
  type?: ButtonHTMLAttributes<HTMLButtonElement>["type"];
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  size?: "sm" | "default" | "lg";
};

export const FormSubmitButton = ({
  text,
  isLoading,
  variant = "default",
  type = "submit",
  onClick,
  disabled = false,
  className = "",
  size = "lg",
}: Props) => {
  const variantStyles = {
    default:
      "hover:bg-darkYellow bg-yellow !text-lg !font-semibold text-primary-foreground",
    delete: "bg-red-600 hover:bg-red-700 text-white !text-lg !font-semibold",
    secondary:
      "bg-gray-200 hover:bg-gray-300 text-gray-800 !text-lg !font-semibold",
    outline:
      "border-2 border-gray-300 bg-transparent hover:bg-gray-100 text-gray-700 !text-lg !font-semibold",
    ghost:
      "bg-transparent hover:bg-gray-100 text-gray-700 !text-lg !font-semibold",
  };

  return (
    <Button
      type={type}
      size={size}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`button flex-center col-span-2 mx-auto mt-3 w-full md:w-10/12 lg:w-8/12 ${variantStyles[variant]} ${className}`}
    >
      {text}
      {isLoading && <Spinner />}
    </Button>
  );
};
