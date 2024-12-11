// src/app/(authenticated)/apostadores/[apostadorId]/profile/edit/page.tsx

"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaUserEdit, FaTrash, FaUpload } from "react-icons/fa";
import { updateUserSchema } from "../../../../../../validation/userValidation";
import { z } from "zod";
import PageHeader from "components/pageHeader/PageHeader";
import SimpleButton from "components/(buttons)/simpleButton/SimpleButton";
import Modal from "components/modal/Modal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./editar.module.scss";

// Define User Interface
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

    // Handle Form Submission
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
                toast.success("Perfil atualizado com sucesso!");
                router.push(`/apostadores/${apostadorId}/profile`);
            } else {
                toast.error(`Erro: ${responseData.error}`);
            }
        } catch (err) {
            console.error("Error updating user:", err);
            toast.error("Erro ao atualizar perfil.");
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
                toast.success("Apostador excluído com sucesso!");
                router.push("/apostadores");
            } else {
                const data = await response.json();
                toast.error(`Erro: ${data.error}`);
            }
        } catch (err) {
            console.error("Error deleting user:", err);
            toast.error("Erro ao excluir apostador.");
        } finally {
            setIsDeleting(false);
        }
    };

    // Handle Avatar Upload
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
                toast.success("Avatar atualizado com sucesso!");
            } else {
                toast.error(`Erro: ${data.error}`);
            }
        } catch (err) {
            console.error("Error uploading avatar:", err);
            toast.error("Erro ao fazer upload do avatar.");
        }
    };

    // Loading State
    if (loading || status === "loading") {
        return (
            <>
                <PageHeader title="Editar Apostador" subpage linkTo={`/apostadores`} />
                <main className={styles.main}>
                    <div className={styles.container}>
                        <p>Carregando...</p>
                    </div>
                </main>
                <ToastContainer />
            </>
        );
    }

    // Authentication Check
    if (status === "unauthenticated") {
        return (
            <>
                <PageHeader title="Editar Apostador" subpage linkTo={`/apostadores`} />
                <main className={styles.main}>
                    <div className={styles.container}>
                        <p>Você precisa estar logado para ver esta página.</p>
                    </div>
                </main>
                <ToastContainer />
            </>
        );
    }

    // Error State
    if (error) {
        return (
            <>
                <PageHeader title="Editar Apostador" subpage linkTo={`/apostadores`} />
                <main className={styles.main}>
                    <div className={styles.container}>
                        <p>Erro: {error}</p>
                    </div>
                </main>
                <ToastContainer />
            </>
        );
    }

    // No User Found
    if (!userData) {
        return (
            <>
                <PageHeader title="Editar Apostador" subpage linkTo={`/apostadores`} />
                <main className={styles.main}>
                    <div className={styles.container}>
                        <p>Apostador não encontrado.</p>
                    </div>
                </main>
                <ToastContainer />
            </>
        );
    }

    return (
        <>
            <PageHeader title={`Editar: ${userData.username}`} subpage linkTo={`/apostadores`} />
            <main className={styles.main}>
                <div className={styles.container}>
                    <h2 className={styles.title}>Editar Informações do Apostador</h2>
                    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                        {/* Avatar Upload */}
                        <div className={styles.avatarSection}>
                            {userData.image ? (
                                <img src={userData.image} alt="Avatar" className={styles.avatar} />
                            ) : (
                                <FaUserEdit className={styles.placeholderAvatar} />
                            )}
                            <div className={styles.uploadButtonContainer}>
                                <label htmlFor="image" className={styles.uploadLabel}>
                                    <FaUpload />
                                    Alterar Avatar
                                </label>
                                <input
                                    id="image"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleAvatarUpload}
                                    className={styles.uploadInput}
                                />
                            </div>
                        </div>

                        {/* Username */}
                        <div className={styles.formGroup}>
                            <label htmlFor="username" className={styles.label}>
                                Username<span className={styles.required}>*</span>
                            </label>
                            <input
                                id="username"
                                type="text"
                                {...register("username")}
                                className={`${styles.input} ${
                                    errors.username ? styles.inputError : ""
                                }`}
                            />
                            {errors.username && (
                                <p className={styles.errorMessage}>{errors.username.message}</p>
                            )}
                        </div>

                        {/* Name */}
                        <div className={styles.formGroup}>
                            <label htmlFor="name" className={styles.label}>
                                Nome
                            </label>
                            <input
                                id="name"
                                type="text"
                                {...register("name")}
                                className={`${styles.input} ${
                                    errors.name ? styles.inputError : ""
                                }`}
                            />
                            {errors.name && (
                                <p className={styles.errorMessage}>{errors.name.message}</p>
                            )}
                        </div>

                        {/* Email */}
                        <div className={styles.formGroup}>
                            <label htmlFor="email" className={styles.label}>
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                {...register("email")}
                                className={`${styles.input} ${
                                    errors.email ? styles.inputError : ""
                                }`}
                            />
                            {errors.email && (
                                <p className={styles.errorMessage}>{errors.email.message}</p>
                            )}
                        </div>

                        {/* Phone */}
                        <div className={styles.formGroup}>
                            <label htmlFor="phone" className={styles.label}>
                                Telefone<span className={styles.required}>*</span>
                            </label>
                            <input
                                id="phone"
                                type="tel"
                                {...register("phone")}
                                className={`${styles.input} ${
                                    errors.phone ? styles.inputError : ""
                                }`}
                            />
                            {errors.phone && (
                                <p className={styles.errorMessage}>{errors.phone.message}</p>
                            )}
                        </div>

                        {/* PIX */}
                        <div className={styles.formGroup}>
                            <label htmlFor="pix" className={styles.label}>
                                PIX
                            </label>
                            <input
                                id="pix"
                                type="text"
                                {...register("pix")}
                                className={`${styles.input} ${errors.pix ? styles.inputError : ""}`}
                            />
                            {errors.pix && (
                                <p className={styles.errorMessage}>{errors.pix.message}</p>
                            )}
                        </div>

                        {/* Role (Admin Only) */}
                        {session?.user.role === "admin" && (
                            <div className={styles.formGroup}>
                                <label htmlFor="role" className={styles.label}>
                                    Função<span className={styles.required}>*</span>
                                </label>
                                <select
                                    id="role"
                                    {...register("role")}
                                    className={`${styles.select} ${
                                        errors.role ? styles.selectError : ""
                                    }`}
                                >
                                    <option value="usuario">Usuário</option>
                                    <option value="vendedor">Vendedor</option>
                                    {/* <option value="admin">Admin</option> */}
                                </select>
                                {errors.role && (
                                    <p className={styles.errorMessage}>{errors.role.message}</p>
                                )}
                            </div>
                        )}

                        {/* Valor Comissão (Vendedor Only) */}
                        {((session?.user.role === "admin" && userData.role === "vendedor") ||
                            userData.role === "vendedor") && (
                            <div className={styles.formGroup}>
                                <label htmlFor="valor_comissao" className={styles.label}>
                                    Comissão (%)<span className={styles.required}>*</span>
                                </label>
                                <input
                                    id="valor_comissao"
                                    type="number"
                                    step="0.01"
                                    {...register("valor_comissao", { valueAsNumber: true })}
                                    className={`${styles.input} ${
                                        errors.valor_comissao ? styles.inputError : ""
                                    }`}
                                />
                                {errors.valor_comissao && (
                                    <p className={styles.errorMessage}>
                                        {errors.valor_comissao.message}
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Banca Name (Optional) */}
                        <div className={styles.formGroup}>
                            <label htmlFor="bancaName" className={styles.label}>
                                Nome da Banca
                            </label>
                            <input
                                id="bancaName"
                                type="text"
                                {...register("bancaName")}
                                className={`${styles.input} ${
                                    errors.bancaName ? styles.inputError : ""
                                }`}
                            />
                            {errors.bancaName && (
                                <p className={styles.errorMessage}>{errors.bancaName.message}</p>
                            )}
                        </div>

                        {/* Password (Optional) */}
                        <div className={styles.formGroup}>
                            <label htmlFor="password" className={styles.label}>
                                Senha
                            </label>
                            <input
                                id="password"
                                type="password"
                                {...register("password")}
                                placeholder="Deixe em branco para não alterar"
                                className={`${styles.input} ${
                                    errors.password ? styles.inputError : ""
                                }`}
                            />
                            {errors.password && (
                                <p className={styles.errorMessage}>{errors.password.message}</p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <div className={styles.formGroup}>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`${styles.submitButton} ${
                                    isSubmitting ? styles.disabledButton : ""
                                }`}
                            >
                                {isSubmitting ? "Atualizando..." : "Salvar Alterações"}
                            </button>
                        </div>
                    </form>

                    {/* Delete Button */}
                    <div className={styles.deleteSection}>
                        <button
                            className={styles.deleteButton}
                            onClick={handleDelete}
                            disabled={isDeleting}
                        >
                            {isDeleting ? "Excluindo..." : "Excluir Apostador"}
                        </button>
                    </div>
                </div>
            </main>
            <ToastContainer />
        </>
    );
};

export default EditUserPage;
