"use client";

import ReactTable from "@/components/react-table";
import TanStackTable from "@/components/tanstack-table";

export default function Home() {
  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Simple Table Component
        </h1>
        {/*<Table columns={columns} data={data} />*/}
        {/*<ReactTable />*/}
        <div className="mt-8">
          <TanStackTable />
        </div>
      </div>
    </div>
  );
}
