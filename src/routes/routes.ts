export const ROUTES = {
    //HOME
    HOME: `/`,

    //LOGIN
    LOGIN: `/login`,

    //LOGOUT
    LOGOUT: `/logout`,

    //Apostadores
    APOSTADORES: "/apostadores",
    APOSTADOR: (apostadorId: string) => `/apostadores/${apostadorId}`,
    APOSTADOR_APOSTAS: (apostadorId: string) => `/apostadores/${apostadorId}/apostas`,
    APOSTADOR_APOSTA_ID: (apostadorId: string, apostaId: string) =>
        `/apostadores/${apostadorId}/apostas/${apostaId}`,
    APOSTADOR_CARTEIRA: (apostadorId: string) => `/apostadores/${apostadorId}/carteiraApostador`,
    APOSTADOR_BILHETE: (apostadorId: string) => `/apostadores/${apostadorId}/novoBilhete`,
    APOSTADOR_PROFILE: (apostadorId: string) => `/apostadores/${apostadorId}/profile`,
    APOSTADOR_NOVO_APOSTADOR: `/apostadores//novo`,

    //Vendedores
    VENDEDORES: "/vendedores",
    VENDEDOR: (vendedorId: string) => `/vendedores/${vendedorId}`,
    VENDEDOR_CARTEIRAS: (vendedorId: string): string => `/vendedores/${vendedorId}/carteiras`,
    VENDEDOR_CARTEIRA: (vendedorId: string, carteiraId: string): string =>
        `/vendedores/${vendedorId}/carteiras/${carteiraId}`,
    VENDEDORES_NOVO: `/vendedores/novoVendedor`,
    VENDEDOR_VENDAS: (vendedorId: string) => `/vendedores/${vendedorId}/vendas`,
    EDIT_VENDEDOR: (vendedorId: string) => `/vendedores/${vendedorId}/edit`,
    NOVO_VENDEDOR: "/vendedores/novo",

    //USERS
    USERS: "/users", // Added
    USER: (userId: string) => `/users/${userId}`, // Added
    EDIT_USER: (userId: string) => `/users/${userId}/edit`, // Added
} as const;

// Define a type for all routes to enforce type safety
export type Route = (typeof ROUTES)[keyof typeof ROUTES] | ((...args: any[]) => string);
