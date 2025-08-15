import Table from "@/components/Table";
import { data } from "./sample-data";

export default function Home() {
  // Sample data for the table
  const columns = [
    { key: "id", header: "ID" },
    { key: "name", header: "Name" },
    { key: "email", header: "Email" },
    { key: "age", header: "Age" },
    { key: "city", header: "City" },
  ];
  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Simple Table Component
        </h1>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            User Data
          </h2>
          <Table columns={columns} data={data} />
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            How to Use This Table
          </h2>
          <div className="prose text-gray-600">
            <p className="mb-4">This table component accepts two main props:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>columns:</strong> An array of objects defining the table
                structure
              </li>
              <li>
                <strong>data:</strong> An array of objects containing the actual
                data
              </li>
            </ul>
            <p className="mt-4">
              The table includes features like alternating row colors, hover
              effects, responsive design, and automatic empty state handling.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
