"use client";
import { CompactTable } from "@table-library/react-table-library/compact";
import { useTheme } from "@table-library/react-table-library/theme";
import { getTheme } from "@table-library/react-table-library/baseline";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  Header,
  HeaderRow,
  Body,
  Row,
  HeaderCell,
  Cell,
} from "@table-library/react-table-library/table";

const nodes = [
  {
    id: "0",
    name: "Shopping List",
    deadline: new Date(2020, 1, 15),
    type: "TASK",
    isComplete: true,
    nodes: 3,
  },
  {
    id: "1",
    name: "Shopping List",
    deadline: new Date(2020, 1, 15),
    type: "TASK",
    isComplete: true,
    nodes: 3,
  },
  {
    id: "2",
    name: "Shopping List",
    deadline: new Date(2020, 1, 15),
    type: "TASK",
    isComplete: true,
    nodes: 3,
  },
];

type Node = {
  id: string;
  name: string;
  deadline: Date;
  type: string;
  isComplete: boolean;
  nodes: number;
};

const COLUMNS = [
  { label: "Task", renderCell: (item: Node) => item?.name },
  {
    label: "Deadline",
    renderCell: (item: Node) =>
      item.deadline.toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }),
  },
  { label: "Type", renderCell: (item: Node) => item.type },
  {
    label: "Complete",
    renderCell: (item: Node) => item.isComplete.toString(),
  },
  { label: "Tasks", renderCell: (item: Node) => item.nodes },
];

export default function ReactTablePage() {
  const data = { nodes };

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
          transition: background-color 0.1s ease-in-out;
        }
      `,
      BaseRow: `
      color: green;
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
        <Table data={data} theme={theme}>
          {(tableList: Node[]) => (
            <>
              <Header>
                <HeaderRow>
                  <HeaderCell>Task</HeaderCell>
                  <HeaderCell>Deadline</HeaderCell>
                  <HeaderCell>Type</HeaderCell>
                  <HeaderCell>Complete</HeaderCell>
                  <HeaderCell>Tasks</HeaderCell>
                </HeaderRow>
              </Header>

              <Body>
                {tableList.map((item) => (
                  <Row key={item.id} item={item}>
                    <Cell>{item.name}</Cell>
                    <Cell>
                      {item.deadline.toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      })}
                    </Cell>
                    <Cell>{item.type}</Cell>
                    <Cell>{item.isComplete.toString()}</Cell>
                    <Cell>{item.nodes?.length}</Cell>
                  </Row>
                ))}
              </Body>
            </>
          )}
        </Table>
      </div>
    </div>
  );
}
