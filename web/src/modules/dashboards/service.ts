import request from "@modules/fetch/utils";
import { cookToast } from "@modules/toasts/toast-factory";

import { array } from "valibot";
import { Dashboard } from "../../resources/schema";

export async function fetchUserDashboards(
  userId: number,
): Promise<Dashboard[]> {
  const data = await request(`/dashboards`).get(array(Dashboard));

  if (!data.success) {
    cookToast("Aucun tableau de bord", {
      description:
        "Aucun tableau de bord ne vous a été associé. Consulter un développeur",
    }).burnt();
    return [];
  }

  return data.output;
}

export async function fetchUserDashboardById(dashboardId: number) {
  const data = await request(`/dashboards/${dashboardId}`).get(Dashboard);

  if (!data.success) {
    cookToast("Erreur de téléchargement", {
      description: "Impossible d'obtenir le détail du tableau de bord",
    }).burnt();
    return null;
  }

  return data.output;
}
