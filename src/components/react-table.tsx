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
    },
  ]);

  return (
    <div className="max-w-6xl mx-auto min-h-screen ">
      <div className="overflow-x-auto my-6 w-full bg-white border border-gray-200 rounded-2xl">
        <div className="flex space-x-2 items-center">
          <h2 className="text-xl pl-6 py-6 font-semibold text-gray-800">
            User Details
          </h2>
          <Badge variant="secondary">100</Badge>
        </div>
        <Table data={data} theme={theme} sort={sort}>
          {(tableList: UserNode[]) => (
            <>
              <Header>
                <HeaderRow>
                  <HeaderCellSort sortKey="ID">ID</HeaderCellSort>
                  <HeaderCellSort sortKey="NAME">Name</HeaderCellSort>
                  <HeaderCellSort sortKey="EMAIL">Email</HeaderCellSort>
                  <HeaderCellSort sortKey="AGE">Age</HeaderCellSort>
                  <HeaderCellSort sortKey="CITY">City</HeaderCellSort>
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
                  </Row>
                ))}
              </Body>
            </>
          )}
        </Table>
      </div>
    </div>
  );
};

export default ReactTable;
