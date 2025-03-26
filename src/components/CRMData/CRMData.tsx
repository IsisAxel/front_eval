import { Table } from "antd";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from "recharts";

interface CampaignRevenueData {
  campaignStatus: string;
  totalRevenueTarget: number;
}

interface BudgetByCampaign {
  totalAmount: number;
  campaignId: string;
  campaignName: string;
}

interface ExpenseByCampaign {
  totalAmount: number;
  campaignName: string;
}

interface CRMDataProps {
  data: any;
  revenueData: CampaignRevenueData[];
  budgetByCampaign: BudgetByCampaign[];
  expenseByCampaign: ExpenseByCampaign[];
  onCampaignClick: () => void;
  onBudgetClick: () => void;
  onExpenseClick: () => void;
}

const CRMData: React.FC<CRMDataProps> = ({ 
  data, 
  revenueData, 
  budgetByCampaign,
  expenseByCampaign,
  onCampaignClick,
  onBudgetClick, 
  onExpenseClick 
}) => {
  const dataSource = [
    {
      key: '1',
      campaign: data.campaignTotalAmount,
      lead: data.leadTotalAmount,
      budget: data.budgetTotalAmount,
      expense: data.expenseTotalAmount,
      closedWon: data.closedTotalAmount
    }
  ];

    // Fonction pour définir le style des lignes en fonction des montants
    const getRowStyle = (record: any) => ({
      backgroundColor: record.campaign > 10000 ? "blue" : "red",
      color: "white"
    });

  const columns = [
    {
      title: (        
        <span style={{ color: 'blue', cursor: 'pointer' }} onClick={onCampaignClick}>
          Campaign
        </span>
      ),
      dataIndex: 'campaign',
      key: 'campaign',
      render: (item: number) => item.toLocaleString('fr-FR'),
    },
    {
      title: (        
        <span style={{ color: 'blue', cursor: 'pointer' }} onClick={onBudgetClick}>
          Budget
        </span>
      ),
      dataIndex: 'budget',
      key: 'budget',
      render: (item: number) => item.toLocaleString('fr-FR'),

    },
    {
      title: (        
        <span style={{ color: 'blue', cursor: 'pointer' }} onClick={onExpenseClick}>
          Expense
        </span>
      ),
      dataIndex: 'expense',
      key: 'expense',
      render: (item: number) => item.toLocaleString('fr-FR'),
    }
  ];

  return (
    <div style={{ padding: '20px' }}>
      {/* Tableau */}
      <Table 
        dataSource={dataSource} 
        columns={columns} 
        pagination={false} 
        style={{ marginBottom: '40px' }}
      />

      {/* Conteneur des charts */}
      <div 
        style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          justifyContent: 'space-between', 
          gap: '20px', 
          backgroundColor: '#fff', 
          padding: '20px', 
          borderRadius: '8px' 
        }}
      >
        {/* Chart 1 - Revenus par statut de campagne */}
        <div style={{ flex: 1, minWidth: '450px' }}>
          <h3 style={{ marginBottom: '20px' }}>Target Revenue by Campaign Status</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="campaignStatus" />
              <YAxis domain={[0, 9000000]} />
              <Tooltip />
              <Legend />
              <Bar dataKey="totalRevenueTarget" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Chart 2 - Budget par campagne */}
        <div style={{ flex: 1, minWidth: '450px' }}>
          <h3 style={{ marginBottom: '20px' }}>Budget by Campaign</h3>
          <ResponsiveContainer width="100%" height={budgetByCampaign.length * 40 + 100}>
            <BarChart
              layout={budgetByCampaign.length > 5 ? "vertical" : "horizontal"} 
              data={budgetByCampaign}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              
              {budgetByCampaign.length > 5 ? (
                <>
                  <YAxis 
                    dataKey="campaignName" 
                    type="category" 
                    width={150} 
                    tick={{ fontSize: 12 }} 
                  />
                  <XAxis type="number" domain={[0, "auto"]} />
                </>
              ) : (
                <>
                  <XAxis 
                    dataKey="campaignName" 
                    tick={{ fontSize: 12 }} 
                    angle={-30} 
                    textAnchor="end"
                  />
                  <YAxis domain={[0, "auto"]} />
                </>
              )}
              
              <Tooltip />
              <Legend />
              <Bar dataKey="totalAmount" fill="#82ca9d" barSize={30} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

        {/* Chart 3 - Expense par campagne */}
        <div style={{ flex: 1, minWidth: '450px' }}>
          <h3 style={{ marginBottom: '20px' }}>Expense by Campaign</h3>
          <ResponsiveContainer width="100%" height={expenseByCampaign.length * 40 + 100}>
            <BarChart
              layout={expenseByCampaign.length > 5 ? "vertical" : "horizontal"} 
              data={expenseByCampaign}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              
              {expenseByCampaign.length > 5 ? (
                <>
                  <YAxis 
                    dataKey="campaignName" 
                    type="category" 
                    width={150} 
                    tick={{ fontSize: 12 }} 
                  />
                  <XAxis type="number" domain={[0, "auto"]} />
                </>
              ) : (
                <>
                  <XAxis 
                    dataKey="campaignName" 
                    tick={{ fontSize: 12 }} 
                    angle={-30} 
                    textAnchor="end"
                  />
                  <YAxis domain={[0, "auto"]} />
                </>
              )}
              
              <Tooltip />
              <Legend />
              <Bar dataKey="totalAmount" fill="#14afdd" barSize={30} />
            </BarChart>
          </ResponsiveContainer>
        </div>
    </div>
  );
};

export default CRMData;
