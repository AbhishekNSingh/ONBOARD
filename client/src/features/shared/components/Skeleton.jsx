// Visual placeholder block used during content loading
const Skeleton = ({ className = "", ...rest }) => {
  return (
    <div
      className={`rounded bg-line animate-pulse ${className}`}
      aria-hidden="true"
      {...rest}
    />
  );
};

export default Skeleton;
