import { request } from "@modules/fetch";
import { cookToast } from "@modules/toasts";
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
