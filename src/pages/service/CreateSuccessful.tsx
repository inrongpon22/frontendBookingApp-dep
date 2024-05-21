import { useNavigate, useParams } from 'react-router-dom';

export default function CreateSuccessful() {
    const navigate = useNavigate();
    const { businessId } = useParams();
    return (
        <div>
            <p>CreateSuccessful</p>
            <button onClick={() => navigate(`/business-profile/${businessId}`)}>Back to business profile</button>
        </div>
    );
}
