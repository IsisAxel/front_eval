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
    title: 'Budget Date',
    dataIndex: 'budgetDate',
    key: 'budgetDate',
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

const Budget = ({ data }: { data: any[] }) => {

  return <Table dataSource={data} columns={columns} rowKey="id" />;
};

export default Budget;
