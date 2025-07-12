import { useEffect, useState } from "react";
import axios from "axios";
import SwapAdCard from "../components/PublicSkillCard.jsx";

export default function Dashboard() {
    const [publicUsers, setPublicUsers] = useState([]);

    useEffect(() => {
        async function loadFeed() {
            const res = await axios.get(`http://localhost:3000/api/v1/user/swap-feed`);
            setPublicUsers(res.data.swaps);
        }
        loadFeed();
    }, []);

    const handleProposeSwap = async (user) => {
        try {
            const token = localStorage.getItem("authorization");
            await axios.post(`http://localhost:3000/api/v1/user/swap-trigger`, {
                targetUserId: user._id,
                skills_offered: user.skill_wanted.map(s => s.title),
                skill_wanted: user.skills_offered.map(s => s.title),
            }, {
                headers: { Authorization: token }
            });

            alert("Swap proposed!");

            setPublicUsers(prev => prev.filter(u => u._id !== user._id));
        } catch (err) {
            alert("Failed to propose swap.");
        }
    };

    return (
        <div style={{ maxWidth: '800px', margin: 'auto' }}>
            <h2>Explore Skills</h2>
            {publicUsers.length === 0 ? (
                <p>No public ads available</p>
            ) : (
                publicUsers.map(user => (
                    <SwapAdCard key={user._id} user={user} onPropose={handleProposeSwap} />
                ))
            )}
        </div>
    );
}
