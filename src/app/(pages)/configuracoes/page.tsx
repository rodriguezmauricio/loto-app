import Title from "@/app/components/title/Title";
import styles from "./configuracoes.module.css";
import PageHeader from "@/app/components/pageHeader/PageHeader";
import ConfigOptionsCard from "@/app/components/configOptionsCard/ConfigOptionsCard";
import {
  BsBan,
  BsClock,
  BsCurrencyDollar,
  BsStop,
  BsStopBtn,
  BsTicketPerforated,
  BsStack,
  BsCheck,
  BsPersonDash,
  BsExclamation,
  BsExclamationOctagon,
  BsEye,
  BsBell,
} from "react-icons/bs";

const ConfiguracoesPage = () => {
  //TODO: Fetch data from the winners

  return (
    <>
      <PageHeader title="Configurações" subpage={false} linkTo={""} />
      <section className="main">
        <section className={styles.section}>
          <Title h={2}>Modalidades</Title>
          <div className={styles.container}>
            <ConfigOptionsCard
              type="button"
              icon={<BsCurrencyDollar size={20} />}
              text="Modalidades da Caixa"
            />
            <ConfigOptionsCard
              type="button"
              icon={<BsCurrencyDollar size={20} />}
              text="Modalidades com Sabedoria"
            />

            <ConfigOptionsCard
              type="button"
              icon={<BsCurrencyDollar size={20} />}
              text="Modalidades Personalizadas"
            />
            <ConfigOptionsCard
              type="time"
              icon={<BsCurrencyDollar size={20} />}
              text="Modalidades switch"
            />
          </div>
        </section>
        <section className={styles.section}>
          <Title h={2}>Bilhetes</Title>
          <div className={styles.container}>
            <ConfigOptionsCard
              type="time"
              icon={<BsClock size={20} />}
              text="Horário limite de apostas"
            />
            <ConfigOptionsCard
              type="number"
              icon={<BsCurrencyDollar size={20} />}
              text="Valor máximo por bilhete"
            />
            <ConfigOptionsCard
              type="number"
              icon={<BsTicketPerforated size={20} />}
              text="Quantidade máxima de bilhetes por cliente"
            />
            <ConfigOptionsCard
              type="number"
              icon={<BsStack size={20} />}
              text="Quantidade máxima de bilhetes duplicados por sorteio"
            />
            <ConfigOptionsCard
              type="number"
              icon={<BsStack size={20} />}
              text="Quantidade máxima de bilhetes duplicados por aposta"
            />
            <ConfigOptionsCard
              type="switch"
              icon={<BsBan size={20} />}
              text="Bloquear cadastro de bilhetes duplicados"
            />
          </div>
        </section>
        <section className={styles.section}>
          <Title h={2}>Bilhetes Surpresinha</Title>
          <div className={styles.container}>
            <ConfigOptionsCard
              type="switch"
              icon={<BsCheck size={20} />}
              text="Permitir cadastro ilimitado de bilhetes do tipo surpresinha"
            />

            <ConfigOptionsCard
              type="switch"
              icon={<BsCheck size={20} />}
              text="Permitir cadastro ilimitado de bilhetes duplicados do tipo surpresinha"
            />
          </div>
        </section>
        <section className={styles.section}>
          <Title h={2}>Aplicativo</Title>
          <div className={styles.container}>
            <ConfigOptionsCard
              type="switch"
              icon={<BsExclamationOctagon size={20} />}
              text="Exibir alerta de apostas duplicadas na hora da criação"
            />
            <ConfigOptionsCard
              type="switch"
              icon={<BsCheck size={20} />}
              text="Iniciar o filtro de apostas exibindo todas as apostas"
            />
            <ConfigOptionsCard
              type="switch"
              icon={<BsEye size={20} />}
              text="Exibir todos os clientes para todos os vendedores"
            />
            <ConfigOptionsCard
              type="switch"
              icon={<BsEye size={20} />}
              text="Exibir lista de ganhadores para os vendedores"
            />
            <ConfigOptionsCard
              type="switch"
              icon={<BsEye size={20} />}
              text="Exibir lista de ganhadores para os clientes"
            />
            <ConfigOptionsCard
              type="switch"
              icon={<BsEye size={20} />}
              text="Exibir lista de ganhadores para todos os usuários"
            />
            <ConfigOptionsCard
              type="switch"
              icon={<BsPersonDash size={20} />}
              text="Exibir vendedores inativos"
            />
          </div>
        </section>
        <section className={styles.section}>
          <Title h={2}>Permissões de Administradores</Title>
          <div className={styles.container}>
            <ConfigOptionsCard
              type="switch"
              icon={<BsBell size={20} />}
              text="Ativar a validação de quantidade máxima de bilhetes para os admins"
            />
            <ConfigOptionsCard
              type="switch"
              icon={<BsBell size={20} />}
              text="Ativar a validação do valor máximo por bilhetes para os admins"
            />
            <ConfigOptionsCard
              type="switch"
              icon={<BsBell size={20} />}
              text="Ativar a validação do bloqueio de bilhetes duplicados para os admins"
            />
            <ConfigOptionsCard
              type="switch"
              icon={<BsBell size={20} />}
              text="Ativar a validação do horário de bloqueio para os admins"
            />
            <ConfigOptionsCard
              type="switch"
              icon={<BsBell size={20} />}
              text="Ativar a validação do horário de início das vendas para os admins"
            />
          </div>
        </section>
      </section>
    </>
  );
};

export default ConfiguracoesPage;
