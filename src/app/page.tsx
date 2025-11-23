import { SidebarFilters } from "@/app/leis/_components/sidebar-filters";
import { MobileFilters } from "@/app/leis/_components/mobile-filters";
import { getAllBills } from "@/app/actions/bills";
import { BillsList } from "@/app/_components/bills-list";


export default async function Home() {
  const bills = await getAllBills({ limit: 5 });

  return (
    <div className="relative min-h-screen">
      <div className="relative mx-auto grid max-w-6xl gap-6 px-4 py-6 sm:grid-cols-[240px_1fr] lg:px-6">
        <aside className="hidden gap-6 sm:flex sm:flex-col">
          <SidebarFilters defaultTheme="all" />
        </aside>

        <section className="space-y-4">
          {/* Mobile Theme Pills - Only visible on small screens */}
          <div className="sm:hidden">
            <MobileFilters defaultTheme="all" />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.08em] text-muted-foreground">
                Lista de leis
              </p>
              <h1 className="text-3xl font-semibold sm:text-[34px]">
                Descubra, compare, reaja
              </h1>
            </div>
          </div>

          <BillsList initialBills={bills} />
        </section>
      </div>
    </div>
  );
}
