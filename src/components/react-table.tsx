"use client";
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

interface TableColumn {
  key: string;
  header: string;
}

interface TableRow {
  id: number;
  name: string;
  email: string;
  age: number;
  city: string;
}

interface TableProps {
  columns: TableColumn[];
  data: TableRow[];
}

const ReactTable: React.FC<TableProps> = ({ columns, data }: TableProps) => {
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
        <Table data={{ nodes: data }} theme={theme}>
          {(tableList: TableRow[]) => (
            <>
              <Header>
                <HeaderRow>
                  {columns.map((item) => (
                    <HeaderCell key={item.key}>{item.header}</HeaderCell>
                  ))}
                </HeaderRow>
              </Header>

              <Body>
                {tableList.map((item: TableRow) => (
                  <Row key={item.id} item={item}>
                    <Cell>{item.id}</Cell>
                    <Cell>{item.name}</Cell>
                    <Cell>{item.email.toString()}</Cell>
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
