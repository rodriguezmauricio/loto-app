import DashboardPage from "./(pages)/dashboard/page";
import { ToastContainer, toast } from "react-toastify";

export default function Home() {
  return (
    <>
      <DashboardPage />;
      <ToastContainer />
    </>
  );
}
