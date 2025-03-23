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
    title: 'Start Date',
    dataIndex: 'campaignDateStart',
    key: 'campaignDateStart',
    render: (date: string) => new Date(date).toLocaleDateString(),
  },
  {
    title: 'Finish Date',
    dataIndex: 'campaignDateFinish',
    key: 'campaignDateFinish',
    render: (date: string) => new Date(date).toLocaleDateString(),
  },
  {
    title: 'Target Revenue',
    dataIndex: 'targetRevenueAmount',
    key: 'targetRevenueAmount',
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

const Campaign = ({ data }: { data: any[] }) => {

  return <Table dataSource={data} columns={columns} rowKey="id" />;
};

export default Campaign;
