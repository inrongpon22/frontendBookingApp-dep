import { useParams } from "react-router-dom";

const BusinessProfile = () => {
  const { id } = useParams();

  return (
    <div className="flex flex-col text-center h-dvh">
      <div className="h-1/2 flex justify-center items-center bg-gray-200">
        <span className="">profile + stats + overview</span>
      </div>
      <div className="h-1/2 flex justify-center items-center">
        <span className="">service list + create new</span>
      </div>
    </div>
  );
};

export default BusinessProfile;
