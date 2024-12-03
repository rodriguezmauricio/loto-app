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
        roles: ["admin", "vendedor", "usuario"],
    },
    {
        linkName: "Carteira",
        href: "/carteira",
        icon: <BsWallet2 size={iconSize} />,
        roles: ["admin", "vendedor", "usuario"],
    },
];

export const menuLinksSorteios = [
    {
        linkName: "Sorteios",
        href: "/sorteios",
        icon: <BsListUl size={iconSize} />,
        roles: ["admin", "vendedor", "usuario"],
    },
    {
        linkName: "Apostadores",
        href: "/apostadores",
        icon: <BsPerson size={iconSize} />,
        roles: ["admin", "vendedor"],
    },
    {
        linkName: "Vendedores",
        href: "/vendedores",
        icon: <BsPersonBadge size={iconSize} />,
        roles: ["admin"],
    },
    {
        linkName: "Gerenciador de exclusão",
        href: "/gerenciadorDeExclusao",
        icon: <BsPersonDash size={iconSize} />,
        roles: ["admin", "vendedor"],
    },
];

export const menuLinksPremios = [
    {
        linkName: "Cadastrar Resultados",
        href: "/verificarResultados",
        icon: <BsTable size={iconSize} />,
        roles: ["admin", "vendedor", "usuario"],
    },
    {
        linkName: "Tabela de Premiações",
        href: "/tabelaDePremiacoes",
        icon: <BsTable size={iconSize} />,
        roles: ["admin", "vendedor", "usuario"],
    },
    {
        linkName: "Resultados",
        href: "/resultados",
        icon: <BsTrophy size={iconSize} />,
        roles: ["admin", "vendedor", "usuario"],
    },
    {
        linkName: "Ganhadores",
        href: "/ganhadores",
        icon: <BsPeople size={iconSize} />,
        roles: ["admin", "vendedor", "usuario"],
    },
    {
        linkName: "Novidades",
        href: "/novidades",
        icon: <BsBell size={iconSize} />,
        roles: ["admin", "vendedor"],
    },
];

export const menuLinksSettings = [
    {
        linkName: "Configurações",
        href: "/configuracoes",
        icon: <BsGear size={iconSize} />,
        roles: ["admin", "vendedor", "usuario"],
    },
    {
        linkName: "Logout",
        href: "/logout",
        icon: <BsBoxArrowRight size={iconSize} />,
        roles: ["admin", "vendedor"],
    },
];
