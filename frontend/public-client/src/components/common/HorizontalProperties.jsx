const HorizontalProperties = ({ icon, value }) => {
  if (!value) return null;
  return (
    <div className="flex items-center space-x-1 p-0 m-0">
      {icon}
      <span>{value}</span>
    </div>
  );
};

export default HorizontalProperties;
