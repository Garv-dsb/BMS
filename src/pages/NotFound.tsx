import Card from "../Components/Card";
import Button from "../Components/Button";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/");
  };
  return (
    <div className='bg-[url("https://images.unsplash.com/photo-1472173148041-00294f0814a2?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")] bg-cover h-screen flex items-center justify-center bg-opacity-50'>
      <Card className="p-15 rounded-lg shadow-lg text-center space-y-3">
        <h3 className="font-bold text-xl">Not found</h3>
        <p className="font-[400]">
          The page you are looking for does not exist.
        </p>
        <Button
          onClick={handleClick}
          text="Home"
        />
      </Card>
    </div>
  );
};

export default NotFound;
