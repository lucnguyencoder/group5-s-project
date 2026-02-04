const VerticalProperties = ({ icon, title, value }) => {
  if (!value) return null;
  return (
    <div className="flex flex-col align-center items-center space-y-1 p-0 m-0">
      {icon} <span>{title}</span>
      <span>{value}</span>
    </div>
  );
};

export default VerticalProperties;
