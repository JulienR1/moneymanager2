import { request } from "@modules/fetch";
import { cookToast } from "@modules/toasts";
import { z } from "zod";
import { CategorySchema, NewCategorySchema } from "./schemas";

export async function createCategory(
  data: CategorySchema,
  dashboardId: number,
  refreshDashboard: Function,
  onSuccess: Function,
) {
  const payload = {
    label: data.label,
    color: data.color,
    icon: data.icon,
  };

  const result = await request(`/dashboards/${dashboardId}/categories`, {
    body: payload,
  }).post(NewCategorySchema);

  if (!result.success) {
    cookToast("Erreur", { description: "La catégorie n'a pas été créée" });
    return;
  }

  refreshDashboard();
  onSuccess();
}

export async function findAvailableIcons(): Promise<string[]> {
  const result = await request(`/icons`).get(z.array(z.string()));
  if (!result.success) {
    cookToast("Erreur", { description: "Impossible de charger les icônes" }).burnt();
    return [];
  }

  return result.data;
}
