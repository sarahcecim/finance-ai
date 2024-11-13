"use server";

import {
  TransactionCategory,
  TransactionPaymentMethod,
  TransactionType,
} from "@prisma/client";
import { db } from "../../_lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { upsertTransactionSchema } from "./schema";
import { revalidatePath } from "next/cache";

interface UpsertTransactionParams {
  id?: string;
  name: string;
  amount: number;
  type: TransactionType;
  category: TransactionCategory;
  paymentMethod: TransactionPaymentMethod;
  date: Date;
}

export const upsertTransaction = async (params: UpsertTransactionParams) => {
  upsertTransactionSchema.parse(params);  // Validando os dados

  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const transactionData = { ...params, userId };

  if (params.id) {
    // Se o ID estiver presente, faz o upsert (atualiza ou cria)
    await db.transaction.upsert({
      where: {
        id: params.id,  // Verifique se o ID está presente antes de usar no where
      },
      update: transactionData,  // Atualiza a transação existente
      create: transactionData,  // Cria uma nova transação se não existir
    });
  } else {
    // Se o ID não estiver presente, cria uma nova transação
    await db.transaction.create({
      data: transactionData,  // Cria uma nova transação
    });
  }

  // Revalida a rota para refletir as mudanças
  revalidatePath("/transactions");
};