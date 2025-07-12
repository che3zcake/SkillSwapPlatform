import axios from "axios";

export default function SwapAdCard({ user, onSwapProposed }) {
    const handleProposeSwap = async () => {
        try {
            const token = localStorage.getItem("authorization");

            const response = await axios.post(
                `http://localhost:3000/api/v1/user/swap-trigger`,
                {
                    targetUserId: user._id,
                    skills_offered: user.skill_wanted.map(skill => skill.title),
                    skill_wanted: user.skills_offered.map(skill => skill.title)
                },
                {
                    headers: {
                        Authorization: token
                    }
                }
            );

            alert("Swap proposed successfully!");
            console.log(response.data);

            // Remove the card from dashboard after proposing
            if (onSwapProposed) {
                onSwapProposed(user._id);
            }

        } catch (error) {
            console.error("Swap proposal failed:", error);
            alert("Failed to propose swap.");
        }
    };

    return (
        <div className="swap-card">
            <h3>{user.initiator.name}</h3>

            <div className="skills-container">
                <div>
                    <strong>Offers:</strong>
                    <ul>
                        {user.skills_offered.map(skill => (
                            <li key={skill._id}>{skill.title}</li>
                        ))}
                    </ul>
                </div>
                <div>
                    <strong>Wants:</strong>
                    <ul>
                        {user.skill_wanted.map(skill => (
                            <li key={skill._id}>{skill.title}</li>
                        ))}
                    </ul>
                </div>
            </div>

            <button className="swap-btn" onClick={handleProposeSwap}>
                Propose Swap
            </button>
        </div>
    );
}
