import Image from "next/image";
import styles from "./page.module.css";
import DashboardPage from "./dashboard/page";
import Sidebar from "./components/sidebar/Sidebar";

export default function Home() {
  return <DashboardPage />;
}
