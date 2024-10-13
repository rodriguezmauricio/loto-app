"use client";
import { useState } from "react";
// import styles from "./adicionarUsuario.modules.scss";
import AddAdminForm, { UserType } from "../../components/addUserForms/AddAdminForm";
import PageHeader from "@/app/components/pageHeader/PageHeader";
import SimpleButton from "@/app/components/(buttons)/simpleButton/SimpleButton";
import AddVendedorForm from "@/app/components/addUserForms/AddVendedorForm";
import AddUsuarioForm from "@/app/components/addUserForms/AddUsuarioForm";
import { hashPassword } from "@/app/utils/utils";
import { db } from "@vercel/postgres"; // Adjust for your setup
import Title from "@/app/components/title/Title";

export interface IRadioOptions {
  value: string;
  label: string;
}

function AdicionarUsuario() {
  const [userToAdd, setUserToAdd] = useState<UserType>();
  const [selectedRadioButton, setSelectedRadioButton] = useState("");

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
    sellerId: string,
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
      INSERT INTO admins (username, password_hash)
      VALUES ($1, $2)
      RETURNING id, username, password_hash;
      `;
      values = [username, passwordHash];
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
      INSERT INTO admins (username, password_hash, admin_id, seller_id, saldo, phone, pix)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, username, password_hash, admin_id, seller_id, saldo, phone, pix;
      `;
      values = [username, passwordHash, adminId, sellerId, saldo, phone, pix];
    }

    const result = await db.query(query, values);
    console.log("Admin added:", result.rows[0]);
  }
  return (
    <>
      <PageHeader title="Adicionar Usuário" subpage linkTo={`/`} />
      <main className="main">
        <Title h={2}>Selecione o tipo de usuário para adicionar</Title>
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
        {userToAdd && (
          <AddAdminForm
            userType={userToAdd}
            radioOptions={radioOptions}
            selectedRadioOption={selectedRadioButton}
            radioHandler={handleRadioChange}
          />
        )}
      </main>
    </>
  );
}

export default AdicionarUsuario;
