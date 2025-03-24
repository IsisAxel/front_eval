import { Table, Button, Modal, Input, Form, message, notification } from "antd";
import { useState } from "react";
import { fetchDataPost } from "../../util/util";

const Budget = ({ data, setData }: { data: any[]; setData: (data: any[]) => void }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentBudget, setCurrentBudget] = useState<any | null>(null);
  const [form] = Form.useForm();

  const showEditModal = (budget: any) => {
    setCurrentBudget(budget);
    form.setFieldsValue({ amount: budget.amount });
    setIsModalVisible(true);
  };

  const handleEditSubmit = async () => {
    try {
      const values = await form.validateFields();
      const updatedBudget = { ...currentBudget, amount: values.amount };
      if (updatedBudget.statusName === "Draft") {
        updatedBudget.status = 0;
      } else if(updatedBudget.statusName === "Cancelled"){
        updatedBudget.status = 1;
      } else if(updatedBudget.statusName === "Confirmed"){
        updatedBudget.status = 2;
      }else if(updatedBudget.statusName === "OnProgress"){
        updatedBudget.status = 3;
      }else if(updatedBudget.statusName === "OnHold"){
        updatedBudget.status = 4;
      }else if(updatedBudget.statusName === "Finished"){
        updatedBudget.status = 5;
      }else if(updatedBudget.statusName === "Archived"){
        updatedBudget.status = 6;
      }
      const budgetForApi = {
        id: updatedBudget.id,
        title: updatedBudget.title,
        description: updatedBudget.description,
        budgetDate: new Date(updatedBudget.budgetDate).toISOString(),
        status: updatedBudget.status, // On garde le status actuel
        amount: updatedBudget.amount,
        campaignId: updatedBudget.campaignId,
        updatedById: localStorage.getItem("userId"),
      };

      await fetchDataPost("http://localhost:8080/budget/update", budgetForApi);

      setData(data.map(item => (item.id === updatedBudget.id ? updatedBudget : item)));

      notification.success({
        message: "Succès",
        description: "Modification réussie",
        placement: "topRight",
      });
      setIsModalVisible(false);
    } catch (error) {
      notification.error({
        message: "Error",
        description: "An error has occured",
        placement: "topRight",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetchDataPost("http://localhost:8080/budget/delete", { id, deletedByID: localStorage.getItem("userId") });

      setData(data.filter(item => item.id !== id));

      notification.success({
        message: "Succès",
        description: "Modification réussie",
        placement: "topRight",
      });
      } catch (error) {
      notification.error({
        message: "Error",
        description: "An error has occured",
        placement: "topRight",
      });
    }
  };

  const columns = [
    {
      title: "Number",
      dataIndex: "number",
      key: "number",
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Budget Date",
      dataIndex: "budgetDate",
      key: "budgetDate",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Campaign",
      dataIndex: "campaignName",
      key: "campaignName",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Status",
      dataIndex: "statusName",
      key: "statusName",
    },
    {
      title: "Created At Utc",
      dataIndex: "createdAtUtc",
      key: "createdAtUtc",
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: any) => (
        <>
          <Button type="primary" onClick={() => showEditModal(record)} style={{ marginRight: 8 }}>
            Edit
          </Button>
          <Button type="primary" danger onClick={() => handleDelete(record.id)}>
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <>
      <Table dataSource={data} columns={columns} rowKey="id" />
      <Modal
        title="Edit Budget Amount"
        open={isModalVisible}
        onOk={handleEditSubmit}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Amount"
            name="amount"
            rules={[{ required: true, message: "Please enter budget amount" }]}
          >
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Budget;
