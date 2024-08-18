"use client";
import PageHeader from "@/app/components/pageHeader/PageHeader";
import styles from "./vendedores.module.css";
import IconCard from "@/app/components/iconCard/IconCard";
import Link from "next/link";
import useFetchData from "@/app/utils/useFetchData";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import { IReduxSellers, updateSellers } from "@/app/redux/sellersSlice";

interface VendedoresParams {
  params: { vendedor: string; carteiraVendedor: string };
}

const VendedoresPage = ({ params }: VendedoresParams) => {
  const admin = useSelector((state: RootState) => state.admin);
  const sellers = useSelector((state: RootState) => state.sellers);
  const dispatch = useDispatch();

  const URLADMIN = "http://localhost:3500/admins";
  const dataAdmin = useFetchData(URLADMIN)?.data;

  const URLSELLERS = "http://localhost:3500/sellers";
  const dataSellers = useFetchData(URLSELLERS)?.data;

  const sellersFromAdmin =
    dataSellers &&
    dataSellers.filter((sellers: IReduxSellers) => sellers?.adminId === dataAdmin[0]?.id);

  console.log(dataAdmin);

  return (
    <>
      <PageHeader
        title="Vendedores"
        subpage={false}
        linkTo={""}
        hasSearch
        hasSubMenu
        submenuType="add"
        submenuLink="/adicionarVendedor"
      />
      <main className="main">
        <section className={styles.usersList}>
          {/* TODO: map over the users */}
          {sellersFromAdmin?.map((seller: IReduxSellers) => {
            return (
              <IconCard
                key={seller.id}
                title={seller.nome}
                description={seller.telefone}
                icon="vendor"
                fullWidth={true}
                inIcon={false}
                linkTo={`/vendedores/${seller.nome}`}
                hasCheckbox={false}
              />
            );
          })}
        </section>
      </main>
    </>
  );
};

export default VendedoresPage;
