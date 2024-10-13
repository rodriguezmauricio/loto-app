"use client";
import { useState } from "react";
// import styles from "./adicionarUsuario.modules.scss";
import AddAdminForm from "../../components/addUserForms/AddAdminForm";
import PageHeader from "@/app/components/pageHeader/PageHeader";
import SimpleButton from "@/app/components/(buttons)/simpleButton/SimpleButton";
import AddVendedorForm from "@/app/components/addUserForms/AddVendedorForm";
import AddUsuarioForm from "@/app/components/addUserForms/AddUsuarioForm";
import { hashPassword } from "@/app/utils/utils";
import { db } from "@vercel/postgres"; // Adjust for your setup

export interface IRadioOptions {
  value: string;
  label: string;
}

function AdicionarUsuario() {
  const [userToAdd, setUserToAdd] = useState("");
  const [selectedRadioButton, setSelectedRadioButton] = useState("");

  // TOFIX: WTF IS GOING ON WITH THE USE STATE?
  const radioOptions = [
    { value: "percent", label: "Porcentagem" },
    { value: "absolute", label: "Valor em R$" },
  ];

  const handleRadioChange = (e: any) => {
    setSelectedRadioButton(e.target.value);
  };

  const handleUserToAdd = (e: any) => {
    setUserToAdd(e);
    console.log(e);
  };

  async function addAdmin(
    userType: string,
    username: string,
    email: string,
    password: string,
    phone: string,
    adminId: string,
    pix: string,
    saldo: number,
    tipoComissao: string,
    valorComissao: number
  ) {
    const passwordHash = await hashPassword(password);
    let query;
    let values: any[] = [];

    // if user is admin, add it to the admins table
    if (userType === "admin") {
      query = `
      INSERT INTO admins (username, email, password_hash)
      VALUES ($1, $2, $3)
      RETURNING id, username, email;
      `;
      values = [username, email, passwordHash, phone];
    }

    // if user is vendedor, add it to the sellers table
    if (userType === "vendedor") {
      query = `
      INSERT INTO sellers (username, password_hash, phone, saldo, tipo_comissao, valor_comissao)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, username, password_hash, phone, saldo, tipo_comissao, valor_comissao;
      `;
      values = [username, passwordHash, phone, saldo, tipoComissao, valorComissao];
    }

    // if user is usuario, add it to the users table
    if (userType === "usuario") {
      query = `
      INSERT INTO admins (username, password_hash, admin_id, saldo, phone, pix)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, username, password_hash, admin_id, saldo, phone, pix;
      `;
      values = [username, passwordHash, adminId, saldo, phone, pix];
    }

    const result = await db.query(query, values);
    console.log("Admin added:", result.rows[0]);
  }
  return (
    <>
      <PageHeader title="Adicionar Usuário" subpage linkTo={`/`} />
      <main className="main">
        <SimpleButton btnTitle="Admin" func={() => handleUserToAdd("admin")} isSelected={false} />
        <SimpleButton
          btnTitle="Vendedor"
          func={() => handleUserToAdd("vendedor")}
          isSelected={false}
        />
        <SimpleButton
          btnTitle="Usuário"
          func={() => handleUserToAdd("usuario")}
          isSelected={false}
        />

        {/* Render user form besd on the type of user */}
        {userToAdd && AddAdminForm(userToAdd, radioOptions, selectedRadioButton, handleRadioChange)}

        {userToAdd !== "" && (
          <SimpleButton
            btnTitle={`Criar novo ${userToAdd}`}
            func={() => console.log(`Novo ${userToAdd} adicionado`)}
            isSelected={false}
          />
        )}
      </main>
    </>
  );
}

export default AdicionarUsuario;
