"use client";
import PageHeader from "@/app/components/pageHeader/PageHeader";
import IconCard from "@/app/components/iconCard/IconCard";
import styles from "./apostadores.module.css";
import useFetchData from "@/app/utils/useFetchData";
import { IReduxUsers } from "@/app/redux/usersSlice";

interface ApostadoresParams {
  params: { apostador: string };
}

const ApostadoresPage = ({ params }: ApostadoresParams) => {
  const URLADMIN = "http://localhost:3500/sellers";
  const dataAdmin = useFetchData(URLADMIN).data;

  const URLSELLERS = "http://localhost:3500/sellers";
  const dataSellers = useFetchData(URLSELLERS).data;

  const URLUSERS = "http://localhost:3500/users";
  const dataUsers = useFetchData(URLUSERS).data;

  const usersFromSellers =
    dataUsers &&
    dataUsers.filter(
      (users: IReduxUsers) =>
        users.superId === dataSellers?.id || users.superId === dataAdmin[0]?.id
    );

  console.log("users:", dataSellers);
  console.log("sellers:", dataUsers);
  console.log("users From Sellers:", usersFromSellers);

  return (
    <>
      <PageHeader
        title="Apostadores"
        subpage={false}
        linkTo={""}
        hasSubMenu
        submenuType="add"
        submenuLink="/adicionarApostador"
      />
      <main className="main">
        <section>
          {/* //TODO: MAP OVER THE USERS */}
          {usersFromSellers?.map((user: IReduxUsers) => {
            return (
              <IconCard
                key={user.id}
                title={user.name}
                description={user.phone}
                icon="user"
                fullWidth={true}
                inIcon
                // linkTo={`/apostadores/${params.apostador}`}
                linkTo={`/apostadores/${user.name}`}
                hasCheckbox={false}
              />
            );
          })}
        </section>
      </main>
    </>
  );
};

export default ApostadoresPage;
