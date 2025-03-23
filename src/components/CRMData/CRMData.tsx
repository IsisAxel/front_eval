import { Table } from "antd";

interface CRMDataProps {
  data: any;
  onCampaignClick: () => void;
  onBudgetClick: () => void;
  onExpenseClick: () => void;
}

const CRMData: React.FC<CRMDataProps> = ({ data, onCampaignClick , onBudgetClick , onExpenseClick }) => {
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
      title: (        
        <span
          style={{ color: 'blue', cursor: 'pointer' }}
          onClick={onBudgetClick}
        >
          Budget
        </span>),
      dataIndex: 'budget',
      key: 'budget',
    },
    {
      title: (        
        <span
          style={{ color: 'blue', cursor: 'pointer' }}
          onClick={onExpenseClick}
        >
          Expense
        </span>),
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
