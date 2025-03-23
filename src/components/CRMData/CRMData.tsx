import { Table } from "antd";

interface CRMDataProps {
  data: any;
  onCampaignClick: () => void;
}

const CRMData: React.FC<CRMDataProps> = ({ data, onCampaignClick }) => {
  const dataSource = [
    {
      key: '1',
      compaign: data.campaignTotalAmount,
      lead: data.leadTotalAmount,
      budget: data.budgetTotalAmount,
      expense: data.expenseTotalAmount,
      closedWon: data.closedTotalAmount
    }
  ];

  const columns = [
    {
      title: (        
      <span
        style={{ color: 'blue', cursor: 'pointer' }}
        onClick={onCampaignClick}
      >
        Compaign
      </span>),
      dataIndex: 'compaign',
      key: 'compaign',
    },
    {
      title: 'Lead',
      dataIndex: 'lead',
      key: 'lead',
    },
    {
      title: 'Budget',
      dataIndex: 'budget',
      key: 'budget',
    },
    {
      title: 'Expense',
      dataIndex: 'expense',
      key: 'expense',
    },
    {
      title: 'Closed Won',
      dataIndex: 'closedWon',
      key: 'closedWon',
    },
  ];

  return <Table dataSource={dataSource} columns={columns} />;
};

export default CRMData;
