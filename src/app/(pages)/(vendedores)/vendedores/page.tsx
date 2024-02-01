"use client";
import PageHeader from "@/app/components/pageHeader/PageHeader";
import styles from "./vendedores.module.css";
import IconCard from "@/app/components/iconCard/IconCard";
import Link from "next/link";

interface VendedoresParams {
  params: { vendedor: string; carteiraVendedor: string };
}

const VendedoresPage = ({ params }: VendedoresParams) => {
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
        <section>
          {/* TODO: map over the users */}
          <IconCard
            title="Vendedor exemplo"
            description="(21)99999-9999"
            icon="vendor"
            fullWidth={true}
            inIcon={false}
            linkTo={`/vendedores/${params.vendedor}`}
            hasCheckbox={false}
          />
        </section>
      </main>
    </>
  );
};

export default VendedoresPage;
