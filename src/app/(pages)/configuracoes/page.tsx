"use client";
import { useEffect, useState } from "react";
import Title from "@/app/components/title/Title";
import styles from "./configuracoes.module.css";
import PageHeader from "@/app/components/pageHeader/PageHeader";
import ConfigOptionsCard from "@/app/components/configOptionsCard/ConfigOptionsCard";
import {
  BsBan,
  BsClock,
  BsCurrencyDollar,
  BsTicketPerforated,
  BsStack,
  BsCheck,
  BsPersonDash,
  BsExclamationOctagon,
  BsEye,
  BsBell,
} from "react-icons/bs";
import { FaRegSave } from "react-icons/fa";
import { date } from "yup";

interface IGeneralSettings {
  bilhetes_horarioLimiteApostas: number;
  bilhetes_valorMaximoPorBilhete: number;
  bilhetes_quantidadeMaximaDeBilhetesPorCliente: number;
  bilhetes_quantidadeMaximaDeBilhetesDuplicadosPorSorteio: number;
  bilhetes_quantidadeMaximaDeBilhetesDuplicadosPorAposta: number;
  bilhetes_bloquearCadastroDeBilhetesDuplicados: boolean;
  surpresinha_permitirCadastroIlimitadoDeBilhetes: boolean;
  surpresinha_permitirCadastroIlimitadoDeBilhetesDuplicados: boolean;
  app_exibirAlertaDeApostasDuplicadasNaHoraDaCriacao: boolean;
  app_iniciarFiltroDeApostasExibindoTodasAsApostas: boolean;
  app_exibirTodosOsClientesParaTodosOsVendedores: boolean;
  app_exibirListaDeGanhadoresParaOsVendedores: boolean;
  app_exibirListaDeGanhadoresParaOsClientes: boolean;
  app_exibirListaDeGanhadoresParaTodosOsUsuarios: boolean;
  app_exibirVendedoresInativos: boolean;
  permissoesAdm_ativarValidacaoDeQuantidadeMaxDeBilhetesParaOsAdmins: boolean;
  permissoesAdm_ativarValidacaoDoValorMaxPorBilhetesParaOsAdmins: boolean;
  permissoesAdm_ativarValidacaoDoBloqueioDeBilhetesDuplicadosParaOsAdmins: boolean;
  permissoesAdm_ativarValidacaoDoHorarioDeBloqueioParaOsAdmins: boolean;
  permissoesAdm_ativarValidacaoDoHorarioDeInicioDasVendasParaOsAdmins: boolean;
}

const ConfiguracoesPage = () => {
  const [setting, setSettings] = useState<IGeneralSettings>({
    bilhetes_horarioLimiteApostas: new Date().setHours(20, 0, 0, 0),
    bilhetes_valorMaximoPorBilhete: 10,
    bilhetes_quantidadeMaximaDeBilhetesPorCliente: 10,
    bilhetes_quantidadeMaximaDeBilhetesDuplicadosPorSorteio: 10,
    bilhetes_quantidadeMaximaDeBilhetesDuplicadosPorAposta: 10,
    bilhetes_bloquearCadastroDeBilhetesDuplicados: false,
    surpresinha_permitirCadastroIlimitadoDeBilhetes: false,
    surpresinha_permitirCadastroIlimitadoDeBilhetesDuplicados: false,
    app_exibirAlertaDeApostasDuplicadasNaHoraDaCriacao: false,
    app_iniciarFiltroDeApostasExibindoTodasAsApostas: false,
    app_exibirTodosOsClientesParaTodosOsVendedores: false,
    app_exibirListaDeGanhadoresParaOsVendedores: false,
    app_exibirListaDeGanhadoresParaOsClientes: false,
    app_exibirListaDeGanhadoresParaTodosOsUsuarios: false,
    app_exibirVendedoresInativos: false,
    permissoesAdm_ativarValidacaoDeQuantidadeMaxDeBilhetesParaOsAdmins: false,
    permissoesAdm_ativarValidacaoDoValorMaxPorBilhetesParaOsAdmins: false,
    permissoesAdm_ativarValidacaoDoBloqueioDeBilhetesDuplicadosParaOsAdmins: false,
    permissoesAdm_ativarValidacaoDoHorarioDeBloqueioParaOsAdmins: false,
    permissoesAdm_ativarValidacaoDoHorarioDeInicioDasVendasParaOsAdmins: false,
  });

  const URL = "http://localhost:3500/modalidadesCaixa";

  const fetchData = async () => {
    fetch(URL)
      .then((res) => res.json())
      .then((data) => setSettings(data));
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <PageHeader title="Configurações" subpage={false} linkTo={""} />
      <main className="main">
        <section className={styles.section}>
          <Title h={2}>Modalidades</Title>
          <div className={styles.container}>
            <ConfigOptionsCard
              type="button"
              icon={<BsCurrencyDollar size={20} />}
              text="Modalidades da Caixa"
              linkTo={`/configuracoes/Lottery-name`}
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
              value={setting.bilhetes_bloquearCadastroDeBilhetesDuplicados}
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
              value={setting.surpresinha_permitirCadastroIlimitadoDeBilhetes}
            />

            <ConfigOptionsCard
              type="switch"
              icon={<BsCheck size={20} />}
              text="Permitir cadastro ilimitado de bilhetes duplicados do tipo surpresinha"
              value={setting.surpresinha_permitirCadastroIlimitadoDeBilhetesDuplicados}
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
              value={setting.app_exibirAlertaDeApostasDuplicadasNaHoraDaCriacao}
            />
            <ConfigOptionsCard
              type="switch"
              icon={<BsCheck size={20} />}
              text="Iniciar o filtro de apostas exibindo todas as apostas"
              value={setting.app_iniciarFiltroDeApostasExibindoTodasAsApostas}
            />
            <ConfigOptionsCard
              type="switch"
              icon={<BsEye size={20} />}
              text="Exibir todos os clientes para todos os vendedores"
              value={setting.app_exibirTodosOsClientesParaTodosOsVendedores}
            />
            <ConfigOptionsCard
              type="switch"
              icon={<BsEye size={20} />}
              text="Exibir lista de ganhadores para os vendedores"
              value={setting.app_exibirListaDeGanhadoresParaOsVendedores}
            />
            <ConfigOptionsCard
              type="switch"
              icon={<BsEye size={20} />}
              text="Exibir lista de ganhadores para os clientes"
              value={setting.app_exibirListaDeGanhadoresParaOsClientes}
            />
            <ConfigOptionsCard
              type="switch"
              icon={<BsEye size={20} />}
              text="Exibir lista de ganhadores para todos os usuários"
              value={setting.app_exibirListaDeGanhadoresParaTodosOsUsuarios}
            />
            <ConfigOptionsCard
              type="switch"
              icon={<BsPersonDash size={20} />}
              text="Exibir vendedores inativos"
              value={setting.app_exibirVendedoresInativos}
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
              value={setting.permissoesAdm_ativarValidacaoDeQuantidadeMaxDeBilhetesParaOsAdmins}
            />
            <ConfigOptionsCard
              type="switch"
              icon={<BsBell size={20} />}
              text="Ativar a validação do valor máximo por bilhetes para os admins"
              value={setting.permissoesAdm_ativarValidacaoDoValorMaxPorBilhetesParaOsAdmins}
            />
            <ConfigOptionsCard
              type="switch"
              icon={<BsBell size={20} />}
              text="Ativar a validação do bloqueio de bilhetes duplicados para os admins"
              value={
                setting.permissoesAdm_ativarValidacaoDoBloqueioDeBilhetesDuplicadosParaOsAdmins
              }
            />
            <ConfigOptionsCard
              type="switch"
              icon={<BsBell size={20} />}
              text="Ativar a validação do horário de bloqueio para os admins"
              value={setting.permissoesAdm_ativarValidacaoDoHorarioDeBloqueioParaOsAdmins}
            />
            <ConfigOptionsCard
              type="switch"
              icon={<BsBell size={20} />}
              text="Ativar a validação do horário de início das vendas para os admins"
              value={setting.permissoesAdm_ativarValidacaoDoHorarioDeInicioDasVendasParaOsAdmins}
            />
          </div>
        </section>
        <button className={styles.saveButton} type="button">
          <FaRegSave size={30} />
          Salvar alterações
        </button>
        <div className={styles.space}></div>
      </main>
    </>
  );
};

export default ConfiguracoesPage;
