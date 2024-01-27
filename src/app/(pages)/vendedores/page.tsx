import PageHeader from "@/app/components/pageHeader/PageHeader";
import styles from "./vendedores.module.css";
import IconCard from "@/app/components/iconCard/IconCard";

interface VendedoresParams {
  params: { vendedor: string; carteiraVendedor: string };
}

const VendedoresPage = ({ params }: VendedoresParams) => {
  return (
    <section className="main">
      <PageHeader title="Vendedores" subpage={false} linkTo={""} />

      <section>
        <IconCard
          title="Vendedor exemplo"
          description="(21)99999-9999"
          icon="vendor"
          fullWidth={false}
          inIcon={false}
          linkTo={`/vendedores/${params.vendedor}`}
        />
      </section>
    </section>
  );
};

export default VendedoresPage;
