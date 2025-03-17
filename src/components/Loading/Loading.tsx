import { Spin } from "antd";
import { motion } from "framer-motion";

const Loading: React.FC = () => {
    return (
        <motion.div
            className="flex justify-center items-center h-screen"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5 }}
        >
            <Spin size="large" tip="Chargement du tableau de bord..." />
        </motion.div>
    );
};

export default Loading;
