interface LoadingProps {
  size?: string;
}

export const Loading: React.FC<LoadingProps> = ({size = "w-20 h-20"}) => {
    return (
        <div className={`relative ${size}`}>
          <div className="absolute w-full h-full border-4 border-darkestPurple/80 border-b-lightPurple rounded-full animate-spin"></div>
        </div>
    );
  };