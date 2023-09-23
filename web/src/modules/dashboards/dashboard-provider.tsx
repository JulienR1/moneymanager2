import { Dashboard } from "@/resources/schema";
import { useAuth } from "@modules/auth/components/auth-provider";

import { useBeforeLeave } from "@solidjs/router";
import {
  Accessor,
  Component,
  JSX,
  createContext,
  createEffect,
  createResource,
  createSignal,
  useContext,
} from "solid-js";
import { fetchUserDashboards } from "./service";

type DashboardContext = {
  dashboards: Accessor<Dashboard[]>;
  selectedDashboard: Accessor<Dashboard | null>;
  updateDashboard: (dashboardId: number, dashboard: Dashboard | null) => void;
};

const DashboardContext = createContext<DashboardContext>({
  dashboards: () => [],
  selectedDashboard: () => null,
  updateDashboard: (id: number, dashboard: Dashboard | null) => {},
} as DashboardContext);

type DashboardProviderProps = {
  children: JSX.Element;
};

const DashboardProvider: Component<DashboardProviderProps> = (props) => {
  const auth = useAuth();
  const [selectedDashboardId, setSelectedDashboardId] = createSignal<
    number | null
  >(null);

  const [dashboards, { mutate }] = createResource(
    () => auth.user()?.id,
    fetchUserDashboards,
    { initialValue: [] },
  );

  function updateDashboard(dashboardId: number, dashboard: Dashboard | null) {
    mutate((previousDashboards) => {
      const filteredDashboards = previousDashboards.filter(
        (d) => d.id !== dashboardId,
      );
      if (dashboard !== null) {
        filteredDashboards.push(dashboard);
      }
      return filteredDashboards;
    });
  }

  createEffect(() => {
    if (!auth.user()) {
      mutate([]);
      setSelectedDashboardId(null);
    }
  });

  createEffect(() => {
    if (selectedDashboardId() === null) {
      const selection = dashboards().find((d) => d.key === "personal");
      setSelectedDashboardId(selection?.id ?? null);
    }
  });

  useBeforeLeave((e) => {
    if (typeof e.to === "string") {
      const [_, dashboardKey] = e.to.split("/");
      const selection = dashboards().find((d) => d.key === dashboardKey);
      if (selection) {
        setSelectedDashboardId(selection.id);
      }
    }
  });

  const selectedDashboard = () =>
    dashboards().find((d) => d.id === selectedDashboardId()) ?? null;

  return (
    <DashboardContext.Provider
      value={{ dashboards, selectedDashboard, updateDashboard }}
    >
      {props.children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => useContext(DashboardContext);

export default DashboardProvider;
