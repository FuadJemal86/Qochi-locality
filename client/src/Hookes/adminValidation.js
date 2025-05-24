import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";

const useValidation = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const validate = async () => {


            try {
                const result = await api.post('/admin/validate');

                if (!result.data.valid) {
                    throw new Error('Invalid token');
                }
            } catch (err) {
                console.log(err)
                navigate('/login');
            }
        };

        validate();
    }, [navigate]);
};

export default useValidation;
