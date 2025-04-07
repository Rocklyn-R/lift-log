interface LoadingProps {
  size?: string;
  className?: string;
}

export const Loading: React.FC<LoadingProps> = ({className, size = "w-20 h-20"}) => {
    return (
        <div className={`${className} relative ${size}`}>
          <div className="absolute w-full h-full border-4 border-darkestPurple border-b-lightPurple rounded-full animate-spin"></div>
        </div>
    );
  };