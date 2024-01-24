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

const iconSize = 22;

export const sidebarLinksHome = [
  {
    linkName: "Home",
    href: "/",
    icon: <FaChartSimple size={iconSize} />,
  },
  {
    linkName: "Carteira",
    href: "/carteira",
    icon: <FaWallet size={iconSize} />,
  },
];

export const sidebarLinksSorteios = [
  {
    linkName: "Sorteios",
    href: "/sorteios",
    icon: <FaListUl size={iconSize} />,
  },
  {
    linkName: "Apostadores",
    href: "/apostadores",
    icon: <FaUser size={iconSize} />,
  },
  {
    linkName: "Vendedores",
    href: "/vendedores",
    icon: <FaUserTie size={iconSize} />,
  },
  {
    linkName: "Gerenciador de exclusão",
    href: "/gerenciador-de-exclusao",
    icon: <FaDeleteLeft size={iconSize} />,
  },
];

export const sidebarLinksPremios = [
  {
    linkName: "Tabela de Premiações",
    href: "/tabela-de-premiacoes",
    icon: <FaTableList size={iconSize} />,
  },
  {
    linkName: "Resultados",
    href: "/resultados",
    icon: <FaCircleDollarToSlot size={iconSize} />,
  },
  {
    linkName: "Ganhadores",
    href: "/ganhadores",
    icon: <FaUserCheck size={iconSize} />,
  },
  {
    linkName: "Novidades",
    href: "/novidades",
    icon: <FaBell size={iconSize} />,
  },
];

export const sidebarLinksSettings = [
  {
    linkName: "Configurações",
    href: "/configuracoes",
    icon: <FaGear size={iconSize} />,
  },
  {
    linkName: "Logout",
    href: "/logout",
    icon: <FaArrowRightFromBracket size={iconSize} />,
  },
];
