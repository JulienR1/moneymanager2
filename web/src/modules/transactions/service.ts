import request from "@modules/fetch/utils";
import { compressImage, encodeImage } from "@modules/images/service";
import { cookToast } from "@modules/toasts/toast-factory";
import { NewTransactionResultSchema, NewTransactionSchema } from "./schema";

export async function createTransaction(
  data: NewTransactionSchema,
  dashboardId: number,
) {
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
      const compressedReceipt = await compressImage(data.receipt, 1_000_000);
      payload.receipt = await encodeImage(compressedReceipt);
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
}
