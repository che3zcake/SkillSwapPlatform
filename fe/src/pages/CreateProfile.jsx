import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function CreateProfile(){
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        location: "",
        availability: "",
        status: "",
        skills_offered: "",
        skill_wanted: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem("authorization");

            const response = await axios.post(
                `http://localhost:3000/api/v1/user/edit-profile`,
                {
                    ...formData,
                    skills_offered: formData.skills_offered.split(",").map(skill => skill.trim()),
                    skill_wanted: formData.skill_wanted.split(",").map(skill => skill.trim())
                },
                {
                    headers: {
                        Authorization: token
                    }
                }
            );

            console.log("Profile updated:", response.data);
            alert("Profile updated successfully");
            navigate("/profile");
        } catch (err) {
            console.error("Update error:", err);
            alert("Failed to update profile");
        }
    };

    return (
        <div className="edit-profile">
            <h2>Edit Profile</h2>
            <form className="auth-form" onSubmit={handleSubmit}>
                <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} />

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
                    <option value="">Availability</option>
                    <option value="weekdays">Weekdays</option>
                    <option value="weekends">Weekends</option>
                </select>

                <select name="status" value={formData.status} onChange={handleChange}>
                    <option value="">Profile Status</option>
                    <option value="Public">Public</option>
                    <option value="Private">Private</option>
                </select>

                <input
                    type="text"
                    name="skills_offered"
                    placeholder="Skills Offered (comma-separated)"
                    value={formData.skills_offered}
                    onChange={handleChange}
                />

                <input
                    type="text"
                    name="skill_wanted"
                    placeholder="Skills Wanted (comma-separated)"
                    value={formData.skill_wanted}
                    onChange={handleChange}
                />

                <button type="submit">Update Profile</button>
            </form>
        </div>
    );
}