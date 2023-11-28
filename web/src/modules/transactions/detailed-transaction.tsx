import { A, useLocation, useParams } from "@solidjs/router";
import { Accordion, Card, Icon, NoContent, Skeleton } from "@ui";
import {
  Component,
  Show,
  Suspense,
  createEffect,
  createResource,
  createSignal,
} from "solid-js";
import { fetchTransaction } from "./service";

type DetailedTransactionProps = {};

export const DetailedTransaction: Component<DetailedTransactionProps> = (
  props,
) => {
  const location = useLocation();
  const params = useParams<{ dashboardKey: string; transactionId: string }>();

  const [transaction] = createResource(
    () => parseInt(params.transactionId),
    fetchTransaction,
  );

  // let receiptCardRef: HTMLDivElement | undefined = undefined;
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

  const dashboardLocation = location.pathname.replace(/transactions\/\d+/, "");

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
        <Accordion
          title={transaction()!.label}
          leftIcon={{ name: "show_chart" }}
        >
          <pre class="text-xs">{JSON.stringify(transaction(), null, 2)}</pre>
        </Accordion>

        <Accordion
          title="Reçu"
          ref={setReceiptCardRef}
          leftIcon={{ name: "receipt_long" }}
        >
          <Show
            when={transaction()!.receipt}
            fallback={
              <NoContent message="Aucun reçu n'est associé à cette transaction" />
            }
          >
            <A href={transaction()!.receipt!.url!} target="_blank">
              <Show
                when={transaction()!.receipt!.mime === "application/pdf"}
                fallback={
                  <img
                    class="mx-auto"
                    src={transaction()!.receipt!.url}
                    alt={transaction()!.label}
                  />
                }
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
                    class="block"
                    type={transaction()!.receipt!.mime}
                    src={transaction()!.receipt!.url}
                    width={receiptWidth()}
                    height={receiptWidth()}
                  />
                </Show>
              </Show>
            </A>
          </Show>
        </Accordion>

        <A
          href={dashboardLocation}
          class="mx-auto mt-2 block w-fit text-xs text-primary underline md:text-sm"
        >
          Retour au tableau de bord
        </A>
      </Show>
    </Suspense>
  );
};
