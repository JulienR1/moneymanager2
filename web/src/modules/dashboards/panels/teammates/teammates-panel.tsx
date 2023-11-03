import { useAuth } from "@modules/auth";
import { useDashboard } from "@modules/dashboards";
import { Profile } from "@modules/layout";
import { Card } from "@ui";
import { Component, Index, Show, Suspense, createResource } from "solid-js";
import { fetchTeammates } from "./service";

type TeammatesPanelProps = {};

export const TeammatesPanel: Component<TeammatesPanelProps> = (props) => {
  const auth = useAuth();
  const dashboard = useDashboard();

  const [teammates] = createResource(
    () =>
      [
        auth.user()?.id ?? -1,
        dashboard.selectedDashboard()?.id ?? -1,
      ] satisfies [number, number],
    fetchTeammates,
  );

  const isPersonalDashboard = () =>
    dashboard.selectedDashboard()?.key === "personal";

  return (
    <Card title="Équipe">
      <Suspense fallback={<p>loading</p>}>
        <Show
          when={!isPersonalDashboard()}
          fallback={
            <p class="text-xs opacity-75 md:text-sm">
              Ce tableau de bord est seulement le vôtre.
            </p>
          }
        >
          <Show
            when={(teammates() ?? []).length > 0}
            fallback={
              <p class="text-xs opacity-75 md:text-sm">
                Aucune autre personne ayant accès à ce tableau de bord
              </p>
            }
          >
            <ul>
              <Index each={teammates()}>
                {(teammate) => (
                  <li class="flex items-center gap-2">
                    <Profile user={teammate} />
                    <p class="text-sm capitalize md:text-sm">
                      {teammate().firstname} {teammate().lastname}
                    </p>
                  </li>
                )}
              </Index>
            </ul>
          </Show>
        </Show>
      </Suspense>
    </Card>
  );
};
