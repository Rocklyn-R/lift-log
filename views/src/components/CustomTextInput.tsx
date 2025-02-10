interface CustomTextInput {
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    name: string;
}

export const CustomTextInput: React.FC<CustomTextInput> = ({ name, placeholder, value, onChange }) => {
    return (
      <div className="relative flex items-center w-full">
        {/* Input Field */}
        <input
          type="text"
          placeholder={placeholder}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)} 
          className="mt-2 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-darkPurple"
        />
      </div>
    );
  };
  

  