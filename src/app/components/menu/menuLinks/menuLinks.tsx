import {
  BsBell,
  BsWallet2,
  BsPerson,
  BsPersonBadge,
  BsListUl,
  BsTable,
  BsGear,
  BsBoxArrowRight,
  BsTrophy,
  BsColumnsGap,
  BsPeople,
  BsPersonDash,
} from "react-icons/bs";

const iconSize = 20;

export const menuLinksHome = [
  {
    linkName: "Home",
    href: "/",
    icon: <BsColumnsGap size={iconSize} />,
  },
  {
    linkName: "Carteira",
    href: "/carteira",
    icon: <BsWallet2 size={iconSize} />,
  },
];

export const menuLinksSorteios = [
  {
    linkName: "Sorteios",
    href: "/sorteios",
    icon: <BsListUl size={iconSize} />,
  },
  {
    linkName: "Apostadores",
    href: "/apostadores",
    icon: <BsPerson size={iconSize} />,
  },
  {
    linkName: "Vendedores",
    href: "/vendedores",
    icon: <BsPersonBadge size={iconSize} />,
  },
  {
    linkName: "Gerenciador de exclusão",
    href: "/gerenciador-de-exclusao",
    icon: <BsPersonDash size={iconSize} />,
  },
];

export const menuLinksPremios = [
  {
    linkName: "Tabela de Premiações",
    href: "/tabela-de-premiacoes",
    icon: <BsTable size={iconSize} />,
  },
  {
    linkName: "Resultados",
    href: "/resultados",
    icon: <BsTrophy size={iconSize} />,
  },
  {
    linkName: "Ganhadores",
    href: "/ganhadores",
    icon: <BsPeople size={iconSize} />,
  },
  {
    linkName: "Novidades",
    href: "/novidades",
    icon: <BsBell size={iconSize} />,
  },
];

export const menuLinksSettings = [
  {
    linkName: "Configurações",
    href: "/configuracoes",
    icon: <BsGear size={iconSize} />,
  },
  {
    linkName: "Logout",
    href: "/logout",
    icon: <BsBoxArrowRight size={iconSize} />,
  },
];
