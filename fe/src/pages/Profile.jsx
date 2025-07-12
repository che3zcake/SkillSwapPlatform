import { useEffect, useState } from "react";
import axios from "axios";

export default function Profile() {
    const [user, setUser] = useState(null);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        location: "",
        availability: "",
        status: "",
        skills_offered: [],
        skill_wanted: []
    });

    const token = localStorage.getItem("authorization");

    useEffect(() => {
        async function fetchProfile() {
            try {
                const res = await axios.get(`http://localhost:3000/api/v1/user/profile`, {
                    headers: {
                        Authorization: token
                    }
                });
                setUser(res.data.userProfile);
                setFormData({
                    name: res.data.userProfile.name || "",
                    location: res.data.userProfile.location || "",
                    availability: res.data.userProfile.availability || "",
                    status: res.data.userProfile.status || "",
                    skills_offered: res.data.userProfile.skills_offered?.map(s => s.title) || [],
                    skill_wanted: res.data.userProfile.skill_wanted?.map(s => s.title) || [],
                });
            } catch (e) {
                console.error("Error fetching profile", e);
            }
        }
        fetchProfile();
    }, []);

    function handleChange(e) {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }

    function handleArrayChange(name, value) {
        setFormData(prev => ({
            ...prev,
            [name]: value.split(',').map(v => v.trim())
        }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            await axios.post(`http://localhost:3000/api/v1/user/edit-profile`, formData, {
                headers: {
                    Authorization: token
                }
            });
            setEditing(false);
            window.location.reload(); // reloads profile info
        } catch (e) {
            console.error("Update failed", e);
        }
    }

    if (!user) return <div>Loading profile...</div>;

    return (
        <div className="profile-container">
            {!editing ? (
                <>
                    <h2>My Profile</h2>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Name:</strong> {user.name}</p>
                    <p><strong>Location:</strong> {user.location}</p>
                    <p><strong>Availability:</strong> {user.availability}</p>
                    <p><strong>Status:</strong> {user.status}</p>
                    <p><strong>Skills Offered:</strong> {user.skills_offered.map(s => s.title).join(", ")}</p>
                    <p><strong>Skills Wanted:</strong> {user.skill_wanted.map(s => s.title).join(", ")}</p>
                    <button className="edit-button" onClick={() => setEditing(true)}>Edit</button>
                </>
            ) : (
                <>
                    <h2>Edit Profile</h2>
                    <form onSubmit={handleSubmit} className="edit-form">
                        <input name="name" value={formData.name} onChange={handleChange} placeholder="Name" />
                        <select name="location" value={formData.location} onChange={handleChange}>
                            <option value="">Select Location</option>
                            <option value="Delhi">Delhi</option>
                            <option value="Mumbai">Mumbai</option>
                            <option value="Bangalore">Bangalore</option>
                            <option value="Hyderabad">Hyderabad</option>
                            <option value="Chennai">Chennai</option>
                            <option value="Kolkata">Kolkata</option>
                        </select>
                        <select name="availability" value={formData.availability} onChange={handleChange}>
                            <option value="">Select Availability</option>
                            <option value="weekdays">Weekdays</option>
                            <option value="weekends">Weekends</option>
                        </select>
                        <select name="status" value={formData.status} onChange={handleChange}>
                            <option value="">Select Status</option>
                            <option value="Public">Public</option>
                            <option value="Private">Private</option>
                        </select>
                        <input
                            name="skills_offered"
                            placeholder="Skills Offered (comma separated)"
                            value={formData.skills_offered.join(", ")}
                            onChange={e => handleArrayChange("skills_offered", e.target.value)}
                        />
                        <input
                            name="skill_wanted"
                            placeholder="Skills Wanted (comma separated)"
                            value={formData.skill_wanted.join(", ")}
                            onChange={e => handleArrayChange("skill_wanted", e.target.value)}
                        />
                        <button type="submit">Save</button>
                        <button type="button" onClick={() => setEditing(false)}>Cancel</button>
                    </form>
                </>
            )}
        </div>
    );
}
