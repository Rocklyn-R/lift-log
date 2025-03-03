interface CustomTextInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    name: string;
    className?: string
    required?: boolean
}

export const CustomTextInput: React.FC<CustomTextInputProps> = ({ required, className = "w-full", name, placeholder, value, onChange }) => {
    return (
      <div className="relative flex items-center justify-center w-full">
        {/* Input Field */}
        <input
          type="text"
          placeholder={placeholder}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)} 
          className={`${className} dark:bg-darkPurple dark:text-lightestPurple font-semibold mt-2 p-3 border-2 border-mediumPurple focus:outline-none rounded-md`}
          required={required}
        />
      </div>
    );
  };
  

  