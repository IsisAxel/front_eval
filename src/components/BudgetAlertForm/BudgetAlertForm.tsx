import React from "react";
import { Button, DatePicker, Form, InputNumber, notification} from "antd";
import dayjs from "dayjs";
import { fetchDataPost } from "../../util/util";

const BudgetAlertForm: React.FC = () => {
    const onFinish = async (values: { rate: number; date: any }) => {
        try {
            const request = {
                rate: values.rate,
                alertDate: dayjs(values.date).format("YYYY-MM-DD HH:mm:ss"),
                createdById: localStorage.getItem('userId')
            };
            fetchDataPost("http://localhost:8080/expense/createBudgetAlert", request)
            .then(() => {
              notification.success({
                message: "Succès",
                description: "Budget Alert Rate created successfully",
                placement: "topRight",
              });
            })
            .catch(() => {
              notification.error({
                message: "Erreur",
                description: "An error has occured",
                placement: "topRight",
              });
            });
        } catch (error) {
            console.error("Erreur lors de l'envoi :", error);
        }
    };

  return (
    <Form name="budget-alert-form" layout="vertical" onFinish={onFinish} initialValues={{ radio: 2, select: 2 }}>
      <Form.Item name="rate" label="Rate">
        <InputNumber style={{ width: "100%", height: "4vh" }} min={0} max={100} />
      </Form.Item>

      <Form.Item name="date" label="DatePicker">
        <DatePicker showTime format="YYYY-MM-DD HH:mm:ss"/>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default BudgetAlertForm;
