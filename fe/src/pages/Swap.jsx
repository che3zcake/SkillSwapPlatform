import React, { useEffect, useState } from "react";
import axios from "axios";

export default function SwapPage() {
    const [swaps, setSwaps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [targetUserId, setTargetUserId] = useState("");
    const [skillsOffered, setSkillsOffered] = useState("");
    const [skillsWanted, setSkillsWanted] = useState("");
    const token = localStorage.getItem("authorization");

    useEffect(() => {
        fetchSwaps();
    }, []);

    async function fetchSwaps() {
        try {
            const res = await axios.get(`http://localhost:3000/api/v1/user/swap`, {
                headers: {
                    Authorization: token,
                },
            });
            setSwaps(res.data.swaps);
        } catch (err) {
            console.error("Error fetching swaps:", err);
        } finally {
            setLoading(false);
        }
    }

    async function handleTriggerSwap(e) {
        e.preventDefault();
        try {
            const response = await axios.post(
                `http://localhost:3000/api/v1/user/swap-trigger`,
                {
                    skills_offered: skillsOffered.split(',').map(s => s.trim()),
                    skill_wanted: skillsWanted.split(',').map(s => s.trim())
                },
                {
                    headers: {
                        Authorization: token,
                    },
                }
            );
            alert("Swap broadcasted!");
            fetchSwaps();
            setShowForm(false);
            setSkillsOffered("");
            setSkillsWanted("");
        } catch (err) {
            console.error("Swap broadcast error:", err);
            alert(err?.response?.data?.message || "Broadcast failed");
        }
    }


    return (
        <div className="swap-page">
            <h2>Your Swaps</h2>

            <button className="trigger-btn" onClick={() => setShowForm(!showForm)}>
                {showForm ? "Cancel" : "Trigger Swap"}
            </button>

            {showForm && (
                <form className="swap-form" onSubmit={handleTriggerSwap}>
                    <input
                        type="text"
                        placeholder="Skills Offered (comma-separated)"
                        value={skillsOffered}
                        onChange={(e) => setSkillsOffered(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Skills Wanted (comma-separated)"
                        value={skillsWanted}
                        onChange={(e) => setSkillsWanted(e.target.value)}
                        required
                    />
                    <button type="submit">Broadcast Swap</button>
                </form>
            )}

            {loading ? (
                <p>Loading swaps...</p>
            ) : swaps.length === 0 ? (
                <p>No swaps yet!</p>
            ) : (
                swaps.map((swap) => (
                    <div className="swap-card" key={swap._id}>
                        <div className="swap-info">
                            <h3>
                                {swap.initiator._id === getCurrentUserId()
                                    ? "You initiated"
                                    : `${swap.initiator.name} wants to swap`}
                            </h3>
                            <p>
                                <strong>Offers:</strong>{" "}
                                {swap.skills_offered.map((s) => s.title).join(", ")}
                            </p>
                            <p>
                                <strong>Wants:</strong>{" "}
                                {swap.skill_wanted.map((s) => s.title).join(", ")}
                            </p>
                            <p>
                                <strong>Status:</strong> {swap.status}
                            </p>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

function getCurrentUserId() {
    try {
        const token = localStorage.getItem("authorization");
        if (!token) return null;
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload.id;
    } catch (err) {
        return null;
    }
}
