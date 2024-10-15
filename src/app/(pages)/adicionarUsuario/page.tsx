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

  async function addUser(
    userType: string,
    username: string,
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
    let query: string;
    let values: any[] = [];

    // if user is admin, add it to the admins table
    if (userType === "admin") {
      query = `
      INSERT INTO admins (username, password_hash, saldo)
      VALUES ($1, $2, $3)
      RETURNING id, username, saldo
      `;
      values = [username, passwordHash, (saldo = 0)];
    }

    // if user is vendedor, add it to the sellers table
    else if (userType === "vendedor") {
      query = `
        INSERT INTO sellers (username, password_hash, phone, saldo, tipo_comissao, valor_comissao, admin_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id, username, saldo; 
      `;
      values = [username, passwordHash, phone, saldo, tipoComissao, valorComissao];
    }

    // if user is usuario, add it to the users table
    else if (userType === "usuario") {
      query = `
      INSERT INTO admins (username, password_hash, admin_id, seller_id, saldo, phone, pix)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, username, saldo; 
    `;
      values = [username, passwordHash, adminId, sellerId, saldo, phone, pix];
    } else {
      // Handle unexpected userType
      throw new Error(`Invalid user type: ${userType}`);
    }

    try {
      const result = await db.query(query, values);
      console.log(`User added in ${userToAdd} table:`, result.rows[0]);
    } catch (error) {
      console.error("Error adding user:", error);
    }
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
            submitInfo={addUser}
          />
        )}
      </main>
    </>
  );
}

export default AdicionarUsuario;
