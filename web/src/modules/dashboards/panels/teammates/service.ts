import { request } from "@modules/fetch";
import { cookToast } from "@modules/toasts";
import { z } from "zod";
import { TeammateSchema } from "./schema";

export async function fetchTeammates([userId, dashboardId]: [
  number,
  number,
]): Promise<TeammateSchema[]> {
  if (userId < 0 || dashboardId < 0) {
    return [];
  }

  const teammates = await request(`/dashboards/${dashboardId}/users`).get(
    z.array(TeammateSchema),
  );

  if (!teammates.success) {
    cookToast("Erreur", {
      description: "Personne n'est associé à ce tableau de bord",
    }).burnt();
    return [];
  }

  return teammates.data.filter((teammate) => teammate.id !== userId);
}
