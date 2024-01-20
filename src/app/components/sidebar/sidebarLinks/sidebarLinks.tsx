import {
  FaArrowRightFromBracket,
  FaBell,
  FaChartSimple,
  FaCircleDollarToSlot,
  FaDeleteLeft,
  FaGear,
  FaListUl,
  FaTableList,
  FaUser,
  FaUserCheck,
  FaUserTie,
  FaWallet,
} from "react-icons/fa6";

export const sidebarLinksHome = [
  {
    linkName: "Home",
    href: "/",
    icon: <FaChartSimple />,
  },
  {
    linkName: "Carteira",
    href: "/carteira",
    icon: <FaWallet />,
  },
];

export const sidebarLinksSorteios = [
  {
    linkName: "Sorteios",
    href: "/sorteios",
    icon: <FaListUl />,
  },
  {
    linkName: "Apostadores",
    href: "/apostadores",
    icon: <FaUser />,
  },
  {
    linkName: "Vendedores",
    href: "/vendedores",
    icon: <FaUserTie />,
  },
  {
    linkName: "Gerenciador de exclusão",
    href: "/gerenciador-de-exclusao",
    icon: <FaDeleteLeft />,
  },
];

export const sidebarLinksPremios = [
  {
    linkName: "Tabela de Premiações",
    href: "/tabela-de-premiacoes",
    icon: <FaTableList />,
  },
  {
    linkName: "Resultados",
    href: "/resultados",
    icon: <FaCircleDollarToSlot />,
  },
  {
    linkName: "Ganhadores",
    href: "/ganhadores",
    icon: <FaUserCheck />,
  },
  {
    linkName: "Novidades",
    href: "/novidades",
    icon: <FaBell />,
  },
];

export const sidebarLinksSettings = [
  {
    linkName: "Configurações",
    href: "/configuracoes",
    icon: <FaGear />,
  },
  {
    linkName: "Logout",
    href: "/logout",
    icon: <FaArrowRightFromBracket />,
  },
];
