export type Status =
  | "New"
  | "Qualified"
  | "Proposal"
  | "Negotiation"
  | "Won"
  | "Lost";
export type Stage = "Lead" | "Opportunity" | "Quote" | "Contract" | "Closed";
export type Priority = "Low" | "Medium" | "High" | "Critical";

export interface ContactInfo {
  email: string;
  phone: string;
  company: string;
  title: string;
}

export interface Activity {
  id: string;
  type: "call" | "email" | "meeting" | "note";
  description: string;
  date: string;
  user: string;
}

export interface Deal {
  id: string;
  name: string;
  owner: string;
  status: Status;
  stage: Stage;
  priority: Priority;
  amount: number;
  probability: number;
  expectedCloseDate: string;
  createdDate: string;
  lastActivity: string;
  contact: ContactInfo;
  activities: Activity[];
  tags: string[];
  notes: string;
}

export interface ColumnVisibility {
  [key: string]: boolean;
}

export interface TableState {
  columnVisibility: ColumnVisibility;
  columnOrder: string[];
  sorting: Array<{ id: string; desc: boolean }>;
  filters: Array<{ id: string; value: unknown }>;
  columnWidths: { [key: string]: number };
}

export interface ContextMenuPosition {
  x: number;
  y: number;
}

export interface ContextMenuData {
  type: "column" | "row";
  columnId?: string;
  rowId?: string;
  data?: unknown;
}

// Sample data generator
export const generateSampleDeals = (): Deal[] => [
  {
    id: "1",
    name: "Acme Corp Enterprise License",
    owner: "John Smith",
    status: "Qualified",
    stage: "Opportunity",
    priority: "High",
    amount: 150000,
    probability: 75,
    expectedCloseDate: "2024-03-15",
    createdDate: "2024-01-10",
    lastActivity: "2024-01-25",
    contact: {
      email: "sarah@acme.com",
      phone: "+1-555-0123",
      company: "Acme Corp",
      title: "CTO",
    },
    activities: [
      {
        id: "a1",
        type: "call",
        description: "Initial discovery call - discussed requirements",
        date: "2024-01-25",
        user: "John Smith",
      },
      {
        id: "a2",
        type: "email",
        description: "Sent proposal document",
        date: "2024-01-24",
        user: "John Smith",
      },
    ],
    tags: ["Enterprise", "SaaS", "Priority"],
    notes: "Large enterprise deal with potential for expansion",
  },
  {
    id: "2",
    name: "TechStart Software Implementation",
    owner: "Jane Doe",
    status: "Proposal",
    stage: "Quote",
    priority: "Medium",
    amount: 75000,
    probability: 60,
    expectedCloseDate: "2024-02-28",
    createdDate: "2024-01-05",
    lastActivity: "2024-01-23",
    contact: {
      email: "mike@techstart.io",
      phone: "+1-555-0456",
      company: "TechStart Inc",
      title: "VP Engineering",
    },
    activities: [
      {
        id: "a3",
        type: "meeting",
        description: "Product demo session",
        date: "2024-01-23",
        user: "Jane Doe",
      },
    ],
    tags: ["Startup", "Implementation"],
    notes: "Fast-growing startup, budget conscious",
  },
  {
    id: "3",
    name: "Global Industries Multi-Site",
    owner: "Bob Wilson",
    status: "Negotiation",
    stage: "Contract",
    priority: "Critical",
    amount: 300000,
    probability: 85,
    expectedCloseDate: "2024-03-30",
    createdDate: "2023-12-01",
    lastActivity: "2024-01-26",
    contact: {
      email: "anna@globalind.com",
      phone: "+1-555-0789",
      company: "Global Industries",
      title: "Director IT",
    },
    activities: [
      {
        id: "a4",
        type: "meeting",
        description: "Contract negotiation meeting",
        date: "2024-01-26",
        user: "Bob Wilson",
      },
      {
        id: "a5",
        type: "note",
        description: "Legal team reviewing terms",
        date: "2024-01-25",
        user: "Bob Wilson",
      },
    ],
    tags: ["Enterprise", "Multi-site", "Contract"],
    notes: "Complex multi-site deployment, legal review in progress",
  },
  {
    id: "4",
    name: "SmallBiz Basic Package",
    owner: "Alice Brown",
    status: "New",
    stage: "Lead",
    priority: "Low",
    amount: 15000,
    probability: 25,
    expectedCloseDate: "2024-02-15",
    createdDate: "2024-01-20",
    lastActivity: "2024-01-21",
    contact: {
      email: "owner@smallbiz.com",
      phone: "+1-555-0321",
      company: "SmallBiz LLC",
      title: "Owner",
    },
    activities: [
      {
        id: "a6",
        type: "email",
        description: "Initial inquiry response",
        date: "2024-01-21",
        user: "Alice Brown",
      },
    ],
    tags: ["SMB", "Basic"],
    notes: "Small business, price sensitive",
  },
  {
    id: "5",
    name: "Innovation Labs R&D License",
    owner: "Charlie Davis",
    status: "Won",
    stage: "Closed",
    priority: "Medium",
    amount: 120000,
    probability: 100,
    expectedCloseDate: "2024-01-15",
    createdDate: "2023-11-15",
    lastActivity: "2024-01-15",
    contact: {
      email: "research@innovationlabs.com",
      phone: "+1-555-0654",
      company: "Innovation Labs",
      title: "Research Director",
    },
    activities: [
      {
        id: "a7",
        type: "note",
        description: "Deal closed successfully",
        date: "2024-01-15",
        user: "Charlie Davis",
      },
    ],
    tags: ["R&D", "Closed Won"],
    notes: "Successfully closed, implementing next month",
  },
  {
    id: "6",
    name: "RetailChain Store Systems",
    owner: "Diana Green",
    status: "Lost",
    stage: "Closed",
    priority: "High",
    amount: 200000,
    probability: 0,
    expectedCloseDate: "2024-01-10",
    createdDate: "2023-10-01",
    lastActivity: "2024-01-10",
    contact: {
      email: "it@retailchain.com",
      phone: "+1-555-0987",
      company: "RetailChain Corp",
      title: "IT Manager",
    },
    activities: [
      {
        id: "a8",
        type: "note",
        description: "Lost to competitor - price was main factor",
        date: "2024-01-10",
        user: "Diana Green",
      },
    ],
    tags: ["Retail", "Closed Lost"],
    notes: "Lost to competitor, price was deciding factor",
  },
];

export const statusColors: Record<Status, string> = {
  New: "bg-blue-100 text-blue-800",
  Qualified: "bg-green-100 text-green-800",
  Proposal: "bg-yellow-100 text-yellow-800",
  Negotiation: "bg-orange-100 text-orange-800",
  Won: "bg-emerald-100 text-emerald-800",
  Lost: "bg-red-100 text-red-800",
};

export const priorityColors: Record<Priority, string> = {
  Low: "bg-gray-100 text-gray-800",
  Medium: "bg-blue-100 text-blue-800",
  High: "bg-orange-100 text-orange-800",
  Critical: "bg-red-100 text-red-800",
};

export const stageColors: Record<Stage, string> = {
  Lead: "bg-slate-100 text-slate-800",
  Opportunity: "bg-blue-100 text-blue-800",
  Quote: "bg-yellow-100 text-yellow-800",
  Contract: "bg-orange-100 text-orange-800",
  Closed: "bg-gray-100 text-gray-800",
};
