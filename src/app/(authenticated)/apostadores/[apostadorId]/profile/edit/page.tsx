// app/(authenticated)/apostadores/[apostadorId]/page.tsx

"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import BilheteTable from "components/bilheteTable/BilheteTable";
import { Bilhete } from "../../../../../../types/roles"; // Ensure you have appropriate TypeScript types
import styles from "./editar.module.scss";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaUserEdit, FaTrash, FaUpload } from "react-icons/fa";
import { updateUserSchema } from "validation/userValidation";
import { z } from "zod";
import PageHeader from "components/pageHeader/PageHeader";
import SimpleButton from "components/(buttons)/simpleButton/SimpleButton";
import Modal from "components/modal/Modal";

interface User {
    id: string;
    username: string;
    name: string | null;
    email: string | null;
    image: string | null;
    phone: string;
    pix: string | null;
    role: string;
    valor_comissao: number | null;
    bancaName: string | null;
    admin_id: string | null;
    seller_id: string | null;
    created_on: string;
    updated_on: string;
    wallet: Wallet | null;
}

interface Wallet {
    id: string;
    balance: number;
    transactions: Transaction[];
}

interface Transaction {
    id: string;
    type: "add" | "subtract";
    amount: number;
    date: string;
    description?: string;
}

// Define Form Inputs based on Zod Schema
type UpdateUserInput = z.infer<typeof updateUserSchema>;

const EditUserPage = () => {
    const router = useRouter(); // For navigation purposes
    const params = useParams(); // To access route parameters
    const { apostadorId } = params;

    const { data: session, status } = useSession();

    const [userData, setUserData] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState<boolean>(false);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);

    // Initialize React Hook Form
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<UpdateUserInput>({
        resolver: zodResolver(updateUserSchema),
        defaultValues: {
            username: "",
            name: "",
            email: "",
            phone: "",
            pix: "",
            role: "usuario",
            valor_comissao: 0,
            bancaName: "",
            password: "",
        },
    });

    // Fetch User Data
    useEffect(() => {
        if (!apostadorId || status !== "authenticated") return;

        const fetchUser = async () => {
            try {
                const response = await fetch(`/api/users/${apostadorId}`, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                });
                const data = await response.json();

                if (response.ok) {
                    setUserData(data);
                    reset({
                        username: data.username,
                        name: data.name || "",
                        email: data.email || "",
                        phone: data.phone,
                        pix: data.pix || "",
                        role: data.role,
                        valor_comissao: data.valor_comissao || 0,
                        bancaName: data.bancaName || "",
                        password: "",
                    });
                } else {
                    setError(data.error || "Erro ao buscar apostador.");
                }
            } catch (err) {
                console.error("Error fetching user:", err);
                setError("Erro ao buscar apostador.");
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [apostadorId, status, reset]);

    const onSubmit = async (data: UpdateUserInput) => {
        try {
            const response = await fetch(`/api/users/${apostadorId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(data),
            });

            const responseData = await response.json();

            if (response.ok) {
                setUserData(responseData);
                alert("Perfil atualizado com sucesso!");
                router.push(`/apostadores/${apostadorId}/profile`);
            } else {
                alert(`Erro: ${responseData.error}`);
            }
        } catch (err) {
            console.error("Error updating user:", err);
            alert("Erro ao atualizar perfil.");
        }
    };

    // Handle Delete User
    const handleDelete = async () => {
        const confirmDelete = confirm("Tem certeza de que deseja excluir este apostador?");
        if (!confirmDelete) return;

        setIsDeleting(true);

        try {
            const response = await fetch(`/api/users/${apostadorId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });

            if (response.ok) {
                alert("Apostador excluído com sucesso!");
                router.push("/apostadores");
            } else {
                const data = await response.json();
                alert(`Erro: ${data.error}`);
            }
        } catch (err) {
            console.error("Error deleting user:", err);
            alert("Erro ao excluir apostador.");
        } finally {
            setIsDeleting(false);
        }
    };

    // Handle Avatar Upload (Optional)
    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("image", file);

        try {
            const response = await fetch(`/api/users/${apostadorId}/upload-avatar`, {
                method: "POST",
                body: formData,
                credentials: "include",
            });

            const data = await response.json();

            if (response.ok) {
                setUserData((prev) =>
                    prev
                        ? {
                              ...prev,
                              image: data.imageUrl,
                          }
                        : prev
                );
                alert("Avatar atualizado com sucesso!");
            } else {
                alert(`Erro: ${data.error}`);
            }
        } catch (err) {
            console.error("Error uploading avatar:", err);
            alert("Erro ao fazer upload do avatar.");
        }
    };

    // Loading State
    if (loading || status === "loading") {
        return (
            <>
                <PageHeader title="Editar Apostador" subpage linkTo={`/apostadores`} />
                <main className="main">
                    <p>Carregando...</p>
                </main>
            </>
        );
    }

    // Authentication Check
    if (status === "unauthenticated") {
        return (
            <>
                <PageHeader title="Editar Apostador" subpage linkTo={`/apostadores`} />
                <main className="main">
                    <p>Você precisa estar logado para ver esta página.</p>
                </main>
            </>
        );
    }

    // Error State
    if (error) {
        return (
            <>
                <PageHeader title="Editar Apostador" subpage linkTo={`/apostadores`} />
                <main className="main">
                    <p>Erro: {error}</p>
                </main>
            </>
        );
    }

    // No User Found
    if (!userData) {
        return (
            <>
                <PageHeader title="Editar Apostador" subpage linkTo={`/apostadores`} />
                <main className="main">
                    <p>Apostador não encontrado.</p>
                </main>
            </>
        );
    }

    return (
        <>
            <PageHeader title={`Editar: ${userData.username}`} subpage linkTo={`/apostadores`} />
            <main className="main p-6">
                <div className="max-w-4xl mx-auto bg-white shadow-md rounded px-8 py-6">
                    <h2 className="text-2xl font-semibold mb-4">Informações do Apostador</h2>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {/* Username */}
                        <div>
                            <label htmlFor="username" className="block text-gray-700">
                                Username<span className="text-red-500">*</span>
                            </label>
                            <input
                                id="username"
                                type="text"
                                {...register("username")}
                                className={`mt-1 block w-full border ${
                                    errors.username ? "border-red-500" : "border-gray-300"
                                } rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500`}
                            />
                            {errors.username && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.username.message}
                                </p>
                            )}
                        </div>

                        {/* Name */}
                        <div>
                            <label htmlFor="name" className="block text-gray-700">
                                Nome
                            </label>
                            <input
                                id="name"
                                type="text"
                                {...register("name")}
                                className={`mt-1 block w-full border ${
                                    errors.name ? "border-red-500" : "border-gray-300"
                                } rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500`}
                            />
                            {errors.name && (
                                <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-gray-700">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                {...register("email")}
                                className={`mt-1 block w-full border ${
                                    errors.email ? "border-red-500" : "border-gray-300"
                                } rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500`}
                            />
                            {errors.email && (
                                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                            )}
                        </div>

                        {/* Phone */}
                        <div>
                            <label htmlFor="phone" className="block text-gray-700">
                                Telefone<span className="text-red-500">*</span>
                            </label>
                            <input
                                id="phone"
                                type="tel"
                                {...register("phone")}
                                className={`mt-1 block w-full border ${
                                    errors.phone ? "border-red-500" : "border-gray-300"
                                } rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500`}
                            />
                            {errors.phone && (
                                <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                            )}
                        </div>

                        {/* PIX */}
                        <div>
                            <label htmlFor="pix" className="block text-gray-700">
                                PIX
                            </label>
                            <input
                                id="pix"
                                type="text"
                                {...register("pix")}
                                className={`mt-1 block w-full border ${
                                    errors.pix ? "border-red-500" : "border-gray-300"
                                } rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500`}
                            />
                            {errors.pix && (
                                <p className="text-red-500 text-sm mt-1">{errors.pix.message}</p>
                            )}
                        </div>

                        {/* Role (Admin Only) */}
                        {session?.user.role === "admin" && (
                            <div>
                                <label htmlFor="role" className="block text-gray-700">
                                    Função<span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="role"
                                    {...register("role")}
                                    className={`mt-1 block w-full border ${
                                        errors.role ? "border-red-500" : "border-gray-300"
                                    } bg-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500`}
                                >
                                    <option value="usuario">Usuário</option>
                                    <option value="vendedor">Vendedor</option>
                                    <option value="admin">Admin</option>
                                </select>
                                {errors.role && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.role.message}
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Valor Comissão (Vendedor Only) */}
                        {((session?.user.role === "admin" && userData.role === "vendedor") ||
                            userData.role === "vendedor") && (
                            <div>
                                <label htmlFor="valor_comissao" className="block text-gray-700">
                                    Comissão (%)<span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="valor_comissao"
                                    type="number"
                                    step="0.01"
                                    {...register("valor_comissao", { valueAsNumber: true })}
                                    className={`mt-1 block w-full border ${
                                        errors.valor_comissao ? "border-red-500" : "border-gray-300"
                                    } rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500`}
                                />
                                {errors.valor_comissao && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.valor_comissao.message}
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Banca Name (Optional) */}
                        <div>
                            <label htmlFor="bancaName" className="block text-gray-700">
                                Nome da Banca
                            </label>
                            <input
                                id="bancaName"
                                type="text"
                                {...register("bancaName")}
                                className={`mt-1 block w-full border ${
                                    errors.bancaName ? "border-red-500" : "border-gray-300"
                                } rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500`}
                            />
                            {errors.bancaName && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.bancaName.message}
                                </p>
                            )}
                        </div>

                        {/* Profile Image Upload */}
                        <div>
                            <label htmlFor="image" className="block text-gray-700">
                                Avatar
                            </label>
                            <div className="flex items-center mt-1">
                                {userData.image ? (
                                    <img
                                        src={userData.image}
                                        alt="Avatar"
                                        className="w-16 h-16 rounded-full mr-4 object-cover"
                                    />
                                ) : (
                                    <FaUserEdit className="w-16 h-16 text-gray-400 mr-4" />
                                )}
                                <input
                                    id="image"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleAvatarUpload}
                                    className="hidden"
                                />
                                <label
                                    htmlFor="image"
                                    className="flex items-center px-3 py-2 bg-indigo-600 text-white rounded-md cursor-pointer hover:bg-indigo-700 transition-colors"
                                >
                                    <FaUpload className="mr-2" />
                                    Upload Avatar
                                </label>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end">
                            <SimpleButton
                                btnTitle={isSubmitting ? "Atualizando..." : "Salvar Alterações"}
                                type="submit"
                                isSelected={false}
                                disabled={isSubmitting}
                                className="bg-indigo-600 text-white hover:bg-indigo-700"
                                func={() => {}}
                            />
                        </div>
                    </form>

                    {/* Delete Button */}
                    <div className="mt-6 flex justify-end">
                        <SimpleButton
                            btnTitle={isDeleting ? "Excluindo..." : "Excluir Apostador"}
                            type="button"
                            func={handleDelete}
                            isSelected={false}
                            danger // Assuming 'danger' prop applies red styling
                            disabled={isDeleting}
                        />
                    </div>

                    {/* Optional: Password Update Modal */}
                    {/* You can implement a separate modal for password updates if desired */}
                </div>
            </main>
        </>
    );
};

export default EditUserPage;
