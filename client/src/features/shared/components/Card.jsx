// Base container card with rounded corners and border
const Card = ({
  children,
  className = "",
  padding = true,
  ...rest
}) => {
  return (
    <div
      className={`rounded-xl border border-line bg-card ${padding ? "p-5 sm:p-6" : ""} ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
};

export default Card;
