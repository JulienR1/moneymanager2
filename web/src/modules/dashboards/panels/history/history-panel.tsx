import { useDashboard } from "@modules/dashboards/dashboard-provider";
import { fetchTransactions } from "@modules/transactions";
import { useLocation } from "@solidjs/router";
import { Card, Icon, NoContent, Skeleton, Table, TableRow } from "@ui";
import { Component, For, Show, Suspense, createResource } from "solid-js";

type HistoryPanelProps = {};

const dateFormatter = new Intl.DateTimeFormat("fr-CA", {});
const moneyFormatter = new Intl.NumberFormat("fr-CA", {
  style: "currency",
  currency: "CAD",
});

export const HistoryPanel: Component<HistoryPanelProps> = (props) => {
  const location = useLocation();
  const dashboard = useDashboard();

  const [transactions] = createResource(
    () => ({
      dashboardId: dashboard.selectedDashboard()?.id ?? -1,
    }),
    fetchTransactions,
    { initialValue: [] },
  );

  return (
    <Card title="Transactions">
      <Suspense fallback={<Skeleton type="line" />}>
        <Show
          when={(transactions() ?? []).length > 0}
          fallback={<NoContent message="Aucune transaction sauvegardée" />}
        >
          <Table
            header={["Date", "Description", "Montant", "Catégorie"] as const}
            widths={["2fr", "3fr", "2fr", "1fr"]}
          >
            <For each={transactions()}>
              {(transaction, index) => (
                <TableRow
                  index={index}
                  anchor={{
                    href: `${location.pathname}/transactions/${transaction.id}`,
                  }}
                >
                  <p>{dateFormatter.format(transaction.timestamp)}</p>
                  <p>{transaction.label}</p>
                  <p>{moneyFormatter.format(transaction.amount)}</p>
                  <Icon
                    size="base"
                    name={transaction.category.icon}
                    style={{ color: transaction.category.color }}
                  />
                </TableRow>
              )}
            </For>
          </Table>
        </Show>
      </Suspense>
    </Card>
  );
};
