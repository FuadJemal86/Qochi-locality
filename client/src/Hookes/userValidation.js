import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";

const userValidation = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const validate = async () => {

            try {
                const result = await api.post('/user/validate');

                if (!result.data.valid) {
                    throw new Error('Invalid token');
                }
            } catch (err) {
                navigate('/login');
            }
        };

        validate();
    }, [navigate]);
};

export default userValidation;
