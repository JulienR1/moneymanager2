import request from "@modules/fetch/utils";
import { cookToast } from "@modules/toasts/toast-factory";
import z from "zod";
import { Dashboard } from "../../resources/schema";

export async function fetchUserDashboards(
  userId: number,
): Promise<Dashboard[]> {
  const result = await request(`/dashboards`).get(z.array(Dashboard));

  if (!result.success) {
    cookToast("Aucun tableau de bord", {
      description:
        "Aucun tableau de bord ne vous a été associé. Consulter un développeur",
    }).burnt();
    return [];
  }

  return result.data;
}

export async function fetchUserDashboardById(dashboardId: number) {
  const result = await request(`/dashboards/${dashboardId}`).get(Dashboard);

  if (!result.success) {
    cookToast("Erreur de téléchargement", {
      description: "Impossible d'obtenir le détail du tableau de bord",
    }).burnt();
    return null;
  }

  return result.data;
}
