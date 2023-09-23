import NewCategoryForm from "@modules/categories/new-category-form";
import { useDashboard } from "@modules/dashboards/dashboard-provider";
import { fetchUserDashboardById } from "@modules/dashboards/service";
import Modal from "@modules/modals/modal";
import NewTransactionForm from "@modules/transactions/new-transaction-form";

import { useLocation, useNavigate } from "@solidjs/router";
import { Component, Show } from "solid-js";

type NewTransactionProps = {};

const NewTransaction: Component<NewTransactionProps> = (props) => {
  const d = useDashboard();
  const location = useLocation();
  const navigate = useNavigate();

  const showCategoryForm = () => location.pathname.endsWith("/category");
  const closeLocation = () => location.pathname.replace("/category", "");

  const dashboardId = () => d.selectedDashboard()!.id;

  function onModalClose() {
    navigate(closeLocation());
  }

  async function refreshDashboard() {
    const updatedDashboard = await fetchUserDashboardById(dashboardId());
    d.updateDashboard(dashboardId(), updatedDashboard);
  }

  return (
    <Show when={d.selectedDashboard()} fallback={<p>loading</p>}>
      <NewTransactionForm dashboard={() => d.selectedDashboard()!} />

      <Modal
        onClose={onModalClose}
        visible={showCategoryForm()}
        header={{
          title: "Ajouter une catégorie",
          rightIcon: { name: "close", onClick: onModalClose },
        }}
      >
        <NewCategoryForm
          closeLocation={closeLocation()}
          dashboardId={dashboardId()}
          refreshDashboard={refreshDashboard}
        />
      </Modal>
    </Show>
  );
};

export default NewTransaction;
