import { useEffect, useState } from "react";
import axios from "axios";
import SwapAdCard from "../components/SwapAdCard.jsx";

export default function Dashboard() {
    const [feed, setFeed] = useState([]);

    useEffect(() => {
        async function loadFeed() {
            const res = await axios.get(`http://localhost:3000/api/v1/user/swap-feed`);
            setFeed(res.data.swaps);
        }
        loadFeed();
    }, []);

    const handleSwapProposed = (userId) => {
        // Remove the proposed user from the feed
        setFeed(prev => prev.filter(u => u._id !== userId));
    };

    return (
        <div style={{ maxWidth: '800px', margin: 'auto' }}>
            <h2>Explore Skills</h2>
            {feed.length === 0 ? (
                <p>No public ads available</p>
            ) : (
                feed.map(user => (
                    <SwapAdCard
                        key={user._id}
                        user={user}
                        onSwapProposed={handleSwapProposed}
                    />
                ))
            )}
        </div>
    );
}
