"use client";
import { useTheme } from "@table-library/react-table-library/theme";
import { getTheme } from "@table-library/react-table-library/baseline";
import { Badge } from "@/components/ui/badge";

interface UserNode {
  id: number;
  name: string;
  email: string;
  age: number;
  city: string;
  address: string;
}

import {
  Table,
  Header,
  HeaderRow,
  Body,
  Row,
  Cell,
} from "@table-library/react-table-library/table";

import {
  useSort,
  HeaderCellSort,
  SortToggleType,
  SortIconPositions,
} from "@table-library/react-table-library/sort";
import { nodes } from "@/app/sample-data";
import { ChevronDown, ChevronsUpDown, ChevronUp } from "lucide-react";

const ReactTable = () => {
  const data = { nodes };

  function onSortChange(action: unknown, state: unknown) {
    console.log(action, state);
  }

  const sort = useSort(
    data,
    {
      onChange: onSortChange,
    },

    {
      sortToggleType: SortToggleType.AlternateWithReset,
      sortFns: {
        ID: (array: unknown) =>
          (array as UserNode[]).sort((a, b) => a.id - b.id),
        NAME: (array: unknown) =>
          (array as UserNode[]).sort((a, b) => a.name.localeCompare(b.name)),
        EMAIL: (array: unknown) =>
          (array as UserNode[]).sort((a, b) => a.email.localeCompare(b.email)),
        AGE: (array: unknown) =>
          (array as UserNode[]).sort((a, b) => a.age - b.age),
        CITY: (array: unknown) =>
          (array as UserNode[]).sort((a, b) => a.city.localeCompare(b.city)),
        ADDRESS: (array: unknown) =>
          (array as UserNode[]).sort((a, b) =>
            a.address.localeCompare(b.address),
          ),
      },

      sortIcon: {
        size: "16",
        margin: "4px",
        position: SortIconPositions.Prefix,
        iconDefault: <ChevronsUpDown />,
        iconUp: <ChevronUp />,
        iconDown: <ChevronDown />,
      },
    },
  );

  const theme = useTheme([
    getTheme(),
    {
      HeaderRow: `
      background-color: #f4f4fb;
      `,
      HeaderCell: `
      color: gray;
      font-weight: semibold;
      font-size: 14px;
      padding: 12px 24px;
      `,

      Row: `
        &:hover {
          background-color: #f9fafb;
          transition: background-color 0.2s ease-in-out;
        }
        padding: 12px 24px;
      `,
      Cell: `
        padding: 16px 24px;
        color: #364153;
        font-size: 14px;
      `,
      Table: `
      --data-table-library_grid-template-columns:  25% 25% 25% 25% minmax(150px, 1fr);
      overflow: auto;
      scrollbar-width: none;
      scrollbar-color: transparent transparent;
      `,
    },
  ]);

  return (
    <div className="max-w-6xl mx-auto min-h-screen ">
      <div className=" my-6 w-full bg-white border border-gray-200 rounded-2xl">
        <div className="flex space-x-2 items-center">
          <h2 className="text-xl pl-6 py-6 font-semibold text-gray-800">
            User Details
          </h2>
          <Badge variant="secondary">100</Badge>
        </div>
        <div className="h-146 rounded-b-2xl overflow-y-hidden">
          <Table
            layout={{
              fixedHeader: true,
              custom: true,
              horizontalScroll: true,
            }}
            data={data}
            theme={theme}
            sort={sort}
          >
            {(tableList: UserNode[]) => (
              <>
                <Header>
                  <HeaderRow>
                    <HeaderCellSort resize sortKey="ID">
                      ID
                    </HeaderCellSort>
                    <HeaderCellSort resize sortKey="NAME">
                      Name
                    </HeaderCellSort>
                    <HeaderCellSort resize sortKey="EMAIL">
                      Email
                    </HeaderCellSort>
                    <HeaderCellSort resize sortKey="AGE">
                      Age
                    </HeaderCellSort>
                    <HeaderCellSort resize sortKey="CITY">
                      City
                    </HeaderCellSort>
                    <HeaderCellSort resize sortKey="ADDRESS">
                      Address
                    </HeaderCellSort>
                  </HeaderRow>
                </Header>

                <Body>
                  {tableList.map((item: UserNode) => (
                    <Row key={item.id} item={item}>
                      <Cell>{item.id}</Cell>
                      <Cell>{item.name}</Cell>
                      <Cell>{item.email}</Cell>
                      <Cell>{item.age}</Cell>
                      <Cell>{item.city}</Cell>
                      <Cell>{item.address}</Cell>
                    </Row>
                  ))}
                </Body>
              </>
            )}
          </Table>
        </div>
      </div>
    </div>
  );
};

export default ReactTable;
