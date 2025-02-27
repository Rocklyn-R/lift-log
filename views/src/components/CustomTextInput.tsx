interface CustomTextInput {
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    name: string;
    className?: string
    required?: boolean
}

export const CustomTextInput: React.FC<CustomTextInput> = ({ required, className = "w-full", name, placeholder, value, onChange }) => {
    return (
      <div className="relative flex items-center justify-center w-full">
        {/* Input Field */}
        <input
          type="text"
          placeholder={placeholder}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)} 
          className={`${className} dark:bg-darkPurple dark:text-lightestPurple font-semibold mt-2 p-3 border-2 border-mediumPurple rounded-md focus:outline-none focus:ring-2 focus:ring-darkPurple`}
          required={required}
        />
      </div>
    );
  };
  

  