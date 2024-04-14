"use server";

import { addDoc, collection, doc } from "firebase/firestore";
import { db } from "../app/config";

const addUser = async (formData) => {
  //
  const collectionRef = collection(db, "users");

  addDoc(collectionRef, {
    dataCriado: new Date(),
    nome: formData.get("nome"),
    telefone: formData.get("telefone"),
    pix: formData.get("pix"),
    saldo: formData.get("saldo"),
    tipoUsuario: "apostador",
    username: formData.get("username"),
  });
};

export { addUser };
