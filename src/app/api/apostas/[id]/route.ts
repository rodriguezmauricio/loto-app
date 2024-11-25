import { NextResponse } from "next/server";
import prisma from "../../../../../prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "app/api/auth/[...nextauth]/route";

// DELETE method handler
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        // Authenticate the user
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 });
        }

        const { id } = params;

        if (!id) {
            return NextResponse.json({ error: "Ticket ID is required." }, { status: 400 });
        }

        // Fetch the ticket to verify ownership
        const aposta = await prisma.bet.findUnique({
            where: { id },
            include: { user: true }, // Include user data
        });

        if (!aposta) {
            return NextResponse.json({ error: "Ticket not found." }, { status: 404 });
        }

        // Fetch the authenticated user
        const authenticatedUser = await prisma.user.findUnique({
            where: { id: session.user.id },
        });

        if (!authenticatedUser) {
            return NextResponse.json({ error: "Authenticated user not found." }, { status: 401 });
        }

        // Check if the authenticated user is an admin
        const isAdmin = authenticatedUser.role === "admin";

        // If not admin, check if the user is a seller managing the ticket's owner
        let isSeller = false;

        if (!isAdmin) {
            // Fetch the owner of the ticket
            const ticketOwner = aposta.user;

            if (!ticketOwner) {
                return NextResponse.json({ error: "Ticket owner not found." }, { status: 404 });
            }

            // Check if the authenticated user is the seller of the ticket owner
            isSeller = authenticatedUser.id === ticketOwner.seller_id;
        }

        if (!isAdmin && !isSeller) {
            return NextResponse.json(
                { error: "Forbidden. You do not have permission to delete this ticket." },
                { status: 403 }
            );
        }

        // Optionally, handle wallet refund if deleting a ticket should refund the valorBilhete
        // Uncomment and adjust the following code if needed
        /*
      await prisma.wallet.update({
        where: { id: aposta.userId }, // Ensure this matches your Wallet's identifier
        data: {
          balance: {
            increment: aposta.valorBilhete,
          },
        },
      });
      */

        // Delete the ticket
        await prisma.bet.delete({
            where: { id },
        });

        return NextResponse.json({ message: "Ticket deleted successfully." }, { status: 200 });
    } catch (error: any) {
        console.error("Error deleting ticket:", error);
        return NextResponse.json({ error: "Internal Server Error." }, { status: 500 });
    }
}
