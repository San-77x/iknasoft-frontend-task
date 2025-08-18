"use client";

import ReactTable from "./react-table";

// Example of different table configurations
const TableExamples = () => {
  // Custom column configuration example
  const customColumns = [
    {
      key: "ID",
      label: "User ID",
      width: "80px",
      minWidth: "60px",
      sortable: true,
      resizable: true,
    },
    {
      key: "NAME",
      label: "Full Name",
      width: "250px",
      minWidth: "200px",
      sortable: true,
      resizable: true,
    },
    {
      key: "EMAIL",
      label: "Email Address",
      width: "300px",
      minWidth: "250px",
      sortable: true,
      resizable: true,
    },
    {
      key: "CITY",
      label: "Location",
      width: "200px",
      minWidth: "150px",
      sortable: true,
      resizable: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Enhanced React Table Examples
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore different configurations of our advanced table component
            with features like horizontal scrolling, column resizing, search,
            and customizable layouts.
          </p>
        </div>

        {/* Example 1: Default Configuration */}
        <section>
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              1. Default Table
            </h2>
            <p className="text-gray-600">
              Standard table with all features enabled, including search,
              sorting, and column resizing.
            </p>
          </div>
          <ReactTable />
        </section>

        {/* Example 2: Compact Mode */}
        <section>
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              2. Compact Table
            </h2>
            <p className="text-gray-600">
              Space-efficient version with reduced padding and smaller text.
            </p>
          </div>
          <ReactTable
            compactMode={true}
            maxHeight="400px"
            showBorders={true}
            stripedRows={false}
          />
        </section>

        {/* Example 3: Striped Rows */}
        <section>
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              3. Striped Rows Table
            </h2>
            <p className="text-gray-600">
              Table with alternating row colors for better readability.
            </p>
          </div>
          <ReactTable
            stripedRows={true}
            showBorders={false}
            maxHeight="500px"
          />
        </section>

        {/* Example 4: Custom Columns */}
        <section>
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              4. Custom Column Configuration
            </h2>
            <p className="text-gray-600">
              Table with custom column widths and selective column display.
            </p>
          </div>
          <ReactTable
            customColumns={customColumns}
            showSearch={true}
            showExport={true}
            maxHeight="600px"
          />
        </section>

        {/* Example 5: Minimal Table */}
        <section>
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              5. Minimal Table
            </h2>
            <p className="text-gray-600">
              Clean table without borders, search disabled for simple display.
            </p>
          </div>
          <ReactTable
            showBorders={false}
            showSearch={false}
            showExport={false}
            compactMode={true}
            maxHeight="400px"
          />
        </section>

        {/* Example 6: Full Height Table */}
        <section>
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              6. Full Height Table
            </h2>
            <p className="text-gray-600">
              Table that takes up the full viewport height with all features.
            </p>
          </div>
          <ReactTable
            maxHeight="100vh"
            showSearch={true}
            showExport={true}
            stripedRows={true}
            showBorders={true}
          />
        </section>

        {/* Configuration Options */}
        <section className="bg-white rounded-lg p-8 shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Available Configuration Options
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Basic Props
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <code className="bg-gray-100 px-2 py-1 rounded">
                    maxHeight
                  </code>{" "}
                  - Set table container height
                </li>
                <li>
                  <code className="bg-gray-100 px-2 py-1 rounded">
                    showBorders
                  </code>{" "}
                  - Toggle cell borders
                </li>
                <li>
                  <code className="bg-gray-100 px-2 py-1 rounded">
                    stripedRows
                  </code>{" "}
                  - Enable alternating row colors
                </li>
                <li>
                  <code className="bg-gray-100 px-2 py-1 rounded">
                    compactMode
                  </code>{" "}
                  - Reduce padding and text size
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Feature Props
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <code className="bg-gray-100 px-2 py-1 rounded">
                    showSearch
                  </code>{" "}
                  - Enable search functionality
                </li>
                <li>
                  <code className="bg-gray-100 px-2 py-1 rounded">
                    showExport
                  </code>{" "}
                  - Show export button
                </li>
                <li>
                  <code className="bg-gray-100 px-2 py-1 rounded">
                    customColumns
                  </code>{" "}
                  - Define custom column configuration
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Column Configuration
            </h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <pre className="text-sm text-gray-800 overflow-x-auto">
                {`interface ColumnConfig {
  key: string;           // Column identifier (ID, NAME, EMAIL, etc.)
  label: string;         // Display label
  width?: string;        // Default width (e.g., "200px")
  minWidth?: string;     // Minimum width for resizing
  maxWidth?: string;     // Maximum width for resizing
  sortable?: boolean;    // Enable/disable sorting
  resizable?: boolean;   // Enable/disable resizing
}`}
              </pre>
            </div>
          </div>
        </section>

        {/* Features List */}
        <section className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Key Features
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex items-start space-x-3">
              <span className="text-2xl">🔄</span>
              <div>
                <h3 className="font-semibold text-gray-700">Column Resizing</h3>
                <p className="text-sm text-gray-600">
                  Drag column borders to resize with visual indicators
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <span className="text-2xl">↔️</span>
              <div>
                <h3 className="font-semibold text-gray-700">
                  Horizontal Scroll
                </h3>
                <p className="text-sm text-gray-600">
                  Smooth horizontal scrolling with custom scrollbars
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <span className="text-2xl">🔍</span>
              <div>
                <h3 className="font-semibold text-gray-700">Search & Filter</h3>
                <p className="text-sm text-gray-600">
                  Real-time search across all columns
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <span className="text-2xl">⬆️</span>
              <div>
                <h3 className="font-semibold text-gray-700">Sorting</h3>
                <p className="text-sm text-gray-600">
                  Click headers to sort with visual indicators
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <span className="text-2xl">📱</span>
              <div>
                <h3 className="font-semibold text-gray-700">Responsive</h3>
                <p className="text-sm text-gray-600">
                  Adapts to different screen sizes
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <span className="text-2xl">🎨</span>
              <div>
                <h3 className="font-semibold text-gray-700">Customizable</h3>
                <p className="text-sm text-gray-600">
                  Multiple styling and behavior options
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default TableExamples;
