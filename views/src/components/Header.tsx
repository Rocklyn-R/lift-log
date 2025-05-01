interface HeaderProps {
  text: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({ text }) => {
  return (
    <div className="sticky top-0 z-40 w-full bg-darkestPurple text-lightestPurple dark:border-b-2 dark:border-mediumPurple">
      <h1 className="text-xl font-semibold text-center p-5">{text}</h1>
    </div>
  );
};
