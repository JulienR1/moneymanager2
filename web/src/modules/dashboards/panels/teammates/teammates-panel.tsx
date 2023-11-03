import { useAuth } from "@modules/auth";
import { useDashboard } from "@modules/dashboards";
import {
  Component,
  ResourceSource,
  createEffect,
  createResource,
} from "solid-js";
import { fetchTeammates } from "./service";

type TeammatesPanelProps = {};

export const TeammatesPanel: Component<TeammatesPanelProps> = (props) => {
  const auth = useAuth();
  const dashboard = useDashboard();

  const params: ResourceSource<[number, number]> = () => [
    auth.user()?.id ?? -1,
    dashboard.selectedDashboard()?.id ?? -1,
  ];
  const [teammates] = createResource(params, fetchTeammates, {
    initialValue: [],
  });

  createEffect(() => console.log(teammates()));

  return <>teammates</>;
};
