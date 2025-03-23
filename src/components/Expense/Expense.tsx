import { Table } from "antd";

const columns = [
  {
    title: 'Number',
    dataIndex: 'number',
    key: 'number',
  },
  {
    title: 'Title',
    dataIndex: 'title',
    key: 'title',
  },
  {
    title: 'Expense Date',
    dataIndex: 'expenseDate',
    key: 'expenseDate',
    render: (date: string) => new Date(date).toLocaleDateString(),
  },
  {
    title: 'Campaign',
    dataIndex: 'campaignName',
    key: 'campaignName',
  },
  {
    title: 'Amount',
    dataIndex: 'amount',
    key: 'amount',
  },
  {
    title: 'Status',
    dataIndex: 'statusName',
    key: 'statusName',
  },
  {
    title: 'Created At Utc',
    dataIndex: 'createdAtUtc',
    key: 'createdAtUtc',
    render: (date: string) => new Date(date).toLocaleString(),
  },
];

const Expense = ({ data }: { data: any[] }) => {

  return <Table dataSource={data} columns={columns} rowKey="id" />;
};

export default Expense;
