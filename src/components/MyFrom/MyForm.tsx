import { Form, DatePicker, Button, message } from 'antd';
import axios from 'axios';
const { RangePicker } = DatePicker;

const MyForm = () => {
  const onFinish = (values: { dates: [any, any]; }) => {
    // values.dates est un tableau [moment, moment]
    console.log('Valeurs du formulaire : ', values);

    // Extraction et formatage des dates
    const [startDate, endDate] = values.dates;
    const formattedDates = {
      start: startDate.format('YYYY-MM-DD'),
      end: endDate.format('YYYY-MM-DD')
    };

    console.log('Dates formatées : ', formattedDates);

    // Envoi des dates vers le controller Spring
    axios.post('http://localhost:8080/api/dates', formattedDates)
      .then(response => {
        message.success('Dates envoyées avec succès !');
      })
      .catch(error => {
        message.error('Erreur lors de l\'envoi des dates.');
        console.error(error);
      });
  };

  return (
    <Form onFinish={onFinish} layout="vertical">
      <Form.Item
        name="dates"
        label="Choisissez une plage de dates"
        rules={[{ required: true, message: 'Veuillez sélectionner une plage de dates !' }]}
      >
        <RangePicker />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Envoyer
        </Button>
      </Form.Item>
    </Form>
  );
};

export default MyForm;
