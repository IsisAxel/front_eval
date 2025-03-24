import { Table, Button, Modal, Input, Form, message, notification } from "antd";
import { useState } from "react";
import { fetchDataPost } from "../../util/util";

const Expense = ({ data, setData }: { data: any[]; setData: (data: any[]) => void }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentExpense, setCurrentExpense] = useState<any | null>(null);
  const [form] = Form.useForm();

  const showEditModal = (expense: any) => {
    setCurrentExpense(expense);
    form.setFieldsValue({ amount: expense.amount });
    setIsModalVisible(true);
  };

  const handleEditSubmit = async () => {
    try {
      const values = await form.validateFields();
      const updatedExpense = { ...currentExpense, amount: values.amount };
      if (updatedExpense.statusName === "Draft") {
        updatedExpense.status = 0;
      } else if(updatedExpense.statusName === "Cancelled"){
        updatedExpense.status = 1;
      } else if(updatedExpense.statusName === "Confirmed"){
        updatedExpense.status = 2;
      }else if(updatedExpense.statusName === "OnProgress"){
        updatedExpense.status = 3;
      }else if(updatedExpense.statusName === "OnHold"){
        updatedExpense.status = 4;
      }else if(updatedExpense.statusName === "Finished"){
        updatedExpense.status = 5;
      }else if(updatedExpense.statusName === "Archived"){
        updatedExpense.status = 6;
      }
      const expenseForApi = {
        id: updatedExpense.id,
        title: updatedExpense.title,
        description: updatedExpense.description,
        expenseDate: new Date(updatedExpense.expenseDate).toISOString(),
        status: updatedExpense.status,
        amount: updatedExpense.amount,
        campaignId: updatedExpense.campaignId,
        updatedById: localStorage.getItem("userId"),
      };

      await fetchDataPost("http://localhost:8080/expense/update", expenseForApi);

      // Mettre à jour l'état local après modification
      setData(data.map(item => (item.id === updatedExpense.id ? updatedExpense : item)));

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
      await fetchDataPost("http://localhost:8080/expense/delete", { id, deletedByID: localStorage.getItem("userId") });

      // Supprimer la ligne après suppression
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
      title: "Expense Date",
      dataIndex: "expenseDate",
      key: "expenseDate",
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
        title="Edit Expense Amount"
        open={isModalVisible}
        onOk={handleEditSubmit}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Amount"
            name="amount"
            rules={[{ required: true, message: "Please enter expense amount" }]}
          >
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Expense;
