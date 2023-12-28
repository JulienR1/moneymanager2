import { request } from "@modules/fetch";
import { compressImage, encodeFile } from "@modules/files";
import { cookToast } from "@modules/toasts";
import { z } from "zod";
import { NewTransactionResultSchema, NewTransactionSchema, TransactionSchema } from "./schema";

export async function createTransaction(data: NewTransactionSchema, dashboardId: number, onClose: Function) {
  const payload = {
    type: data.isIncome ? "income" : "expense",
    label: data.description,
    amount: data.amount,
    receipt: null as string | null,
    date: data.date.toISOString(),
    categoryId: data.category,
  };

  if (data.receipt) {
    try {
      if (data.receipt.type === "application/pdf") {
        payload.receipt = await encodeFile(data.receipt);
      } else {
        const compressedReceipt = await compressImage(data.receipt, 1_000_000);
        payload.receipt = await encodeFile(compressedReceipt);
      }
    } catch {
      cookToast("Échec de traitement", {
        description: "La facture n'a pas pu être traitée correctement",
      }).burnt();
      return;
    }
  }

  const response = await request(`/dashboards/${dashboardId}/transactions`, {
    body: payload,
  }).post(NewTransactionResultSchema);

  if (!response.success) {
    cookToast("Échec de l'enregistrement", {
      description: "La transaction n'a pas pu être sauvegardée",
    }).burnt();
    return;
  }

  cookToast("Transaction sauvegardée").golden();
  onClose();
}

export type Period = { start: Date; end: Date };
export async function fetchTransactions(params: {
  dashboardId: number;
  period?: Period;
}): Promise<TransactionSchema[]> {
  if (params.dashboardId < 0) {
    return [];
  }

  const response = await request(`/dashboards/${params.dashboardId}/transactions`).get(z.array(TransactionSchema));
  if (!response.success) {
    cookToast("Impossible de charger les transactions").burnt();
    return [];
  }

  if (response.data.length === 0) {
    cookToast("Aucune transaction", {
      description: "Ce tableau de bord ne contient pas de transactions",
    }).dry();
  }

  return response.data;
}

export async function fetchTransaction(params: {
  dashboardId: number;
  transactionId: number;
}): Promise<TransactionSchema | null> {
  if (params.transactionId < 0) {
    return null;
  }

  const response = await request(`/dashboards/${params.dashboardId}/transactions/${params.transactionId}`).get(
    TransactionSchema,
  );
  if (!response.success) {
    cookToast("Transaction invalide").burnt();
    return null;
  }

  return response.data;
}
