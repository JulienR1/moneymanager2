import { dateFormatter, moneyFormatter } from "@/resources/formatters";
import { useDashboard } from "@modules/dashboards";
import { A, useLocation, useParams } from "@solidjs/router";
import { Accordion, Card, Details, Icon, NoContent, Skeleton, useAccordion } from "@ui";
import { Component, Show, Suspense, createEffect, createResource, createSignal } from "solid-js";
import { fetchTransaction } from "./service";

type DetailedTransactionProps = {};

export const DetailedTransaction: Component<DetailedTransactionProps> = (props) => {
  const location = useLocation();
  const dashboard = useDashboard();
  const params = useParams<{ dashboardKey: string; transactionId: string }>();

  const [transaction] = createResource(
    () => ({
      dashboardId: dashboard.selectedDashboard()?.id ?? -1,
      transactionId: parseInt(params.transactionId),
    }),
    fetchTransaction,
  );

  const generalAccordionControls = useAccordion();
  const receiptAccordionControls = useAccordion(false);

  const [receiptCardRef, setReceiptCardRef] = createSignal<HTMLDivElement>();
  const [receiptWidth, setReceiptWidth] = createSignal(0);

  const observer = new ResizeObserver((entries) => {
    for (const entry of entries) {
      setReceiptWidth(entry.contentRect.width);
    }
  });

  createEffect(() => {
    const ref = receiptCardRef();
    if (ref) {
      observer.observe(ref);
      return () => {
        observer.unobserve(ref);
      };
    }
  });

  createEffect(() => {
    if (!generalAccordionControls.isOpened()) {
      receiptAccordionControls.setIsOpened(true);
    }
  });

  const dashboardLocation = location.pathname.replace(/transactions\/\d+/, "").replace(/\/$/, "");

  const transactionDetails = () => {
    const t = transaction();
    if (!t) {
      return {};
    }

    return {
      Montant: moneyFormatter.format(t.amount),
      Catégorie: () => (
        <span class="flex items-center gap-1">
          {t.category.label}
          <span style={{ color: t.category.color }}>
            <Icon name={t.category.icon} size="base" />
          </span>
        </span>
      ),
      Date: dateFormatter.format(t.timestamp),
      Coupable: t.user.firstname + " " + t.user.lastname,
    };
  };

  const transactionLinks = () => {
    const t = transaction();
    if (!t) {
      return {};
    }

    return {
      Catégorie: `${dashboardLocation}/categories/${t.category.id}`,
      Coupable: `${dashboardLocation}/profiles/${t.user.id}`,
    };
  };

  return (
    <Suspense
      fallback={
        <Card title={<Skeleton type="line" />}>
          <Skeleton type="line" />
        </Card>
      }
    >
      <Show
        when={transaction()}
        fallback={
          <Card title="Erreur">
            <NoContent message="Impossible de trouver cette transaction" />
          </Card>
        }
      >
        <Accordion title={transaction()!.label} leftIcon={{ name: "show_chart" }} controls={generalAccordionControls}>
          <div class="max-w-[430px] overflow-hidden lg:max-w-[800px]">
            <Details data={transactionDetails()} links={transactionLinks()} />
          </div>
        </Accordion>

        <Accordion title="Reçu" leftIcon={{ name: "receipt_long" }} controls={receiptAccordionControls}>
          <Show
            when={transaction()!.receipt}
            fallback={<NoContent message="Aucun reçu n'est associé à cette transaction" />}
          >
            <div
              class="relative mx-auto block max-w-[430px] overflow-hidden md:bg-red-500 lg:max-w-[800px]"
              ref={setReceiptCardRef}
            >
              <A href={transaction()!.receipt!.url!} target="_blank">
                <Show
                  when={transaction()!.receipt!.mime === "application/pdf"}
                  fallback={<img class="mx-auto" src={transaction()!.receipt!.url} alt={transaction()!.label} />}
                >
                  <Show
                    when={navigator.pdfViewerEnabled}
                    fallback={
                      <div class="flex items-center gap-2">
                        <Icon name="open_in_new" size="sm" />
                        <NoContent message="Votre navigateur ne prend pas en charge ce format de fichier." />
                      </div>
                    }
                  >
                    <embed
                      class="block w-full"
                      type={transaction()!.receipt!.mime}
                      src={transaction()!.receipt!.url}
                      width={receiptWidth()}
                      height={1.2 * receiptWidth()}
                    />
                  </Show>
                </Show>
              </A>
            </div>
          </Show>
        </Accordion>

        <A href={dashboardLocation} class="mx-auto mt-2 block w-fit text-xs text-primary underline md:text-sm">
          Retour au tableau de bord
        </A>
      </Show>
    </Suspense>
  );
};
