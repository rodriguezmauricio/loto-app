"use client";
import PageHeader from "@/app/components/pageHeader/PageHeader";
import styles from "./dashboard.module.css";
import Title from "@/app/components/title/Title";
import Card from "@/app/components/card/Card";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import useFetchData from "@/app/utils/useFetchData";
import { useEffect, useState } from "react";
import { updateAdmin } from "@/app/redux/adminSlice";
import { db } from "@/app/config";
import { collection, getDocs } from "firebase/firestore";

const DashboardPage = () => {
  //gets info from / to redux.
  const admin = useSelector((state: RootState) => state.admin);
  const dispatch = useDispatch();

  //fetch data from server
  const URL = "http://localhost:3500/admins";
  const { data } = useFetchData(URL);

  useEffect(() => {
    if (data && data.length > 0) {
      dispatch(updateAdmin(data[0]));
    }
  }, [data, dispatch]);

  // // NOTE: implementing firebase.
  // //states for the users data
  // //TODO: Add Type to the states
  // const [admins, setAdmins] = useState<any>([]);
  // const [vendedores, setVendedores] = useState([]);
  // const [users, setUsers] = useState([]);

  // const adminsCollectionsRef = collection(db, "admins");
  // const vendedoresCollectionsRef = collection(db, "vendedores");
  // const usersCollectionsRef = collection(db, "users");

  // useEffect(() => {
  //   const getUsers = async () => {
  //     //
  //     const adminsData = await getDocs(adminsCollectionsRef);
  //     const vendedoresData = await getDocs(vendedoresCollectionsRef);
  //     const usersData = await getDocs(usersCollectionsRef);

  //     const normalizeAdmin = adminsData.docs.map((admin) => ({ ...admin.data(), id: admin.id }));

  //     setAdmins(normalizeAdmin);
  //   };

  //   getUsers();
  // }, [adminsCollectionsRef, vendedoresCollectionsRef, usersCollectionsRef]);

  // // NOTE: finishing implementing firebase.

  return (
    <>
      <PageHeader title="Dashboard" subpage={false} linkTo={""} />
      <main className="main">
        <section>
          <Title h={2}>Banca</Title>
          <div className={styles.row}>
            <div className={styles.fullWidth}>
              {/* <Card title="Saldo da Banca Hoje" value={admin.wallet} big={true} color="green" /> */}
            </div>
            <Card title="Vendas" value={150.0} big={false} color="green" />
            <Card title="Comissões" value={150.0} big={false} color="red" />
            <Card title="Premiações" value={150.0} big={false} color="yellow" />
          </div>
        </section>

        <section>
          <Title h={2}>Vendedores & Apostadores</Title>
          <div className={styles.row}>
            <Card title="Créditos vendedores" value={150.0} big={false} color="yellow" />
            <Card title="Créditos apostadores" value={150.0} big={false} color="yellow" />
          </div>
        </section>
      </main>
    </>
  );
};

export default DashboardPage;
