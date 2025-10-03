import React, { useState, useEffect } from "react";
import apiService from "../../api/api";
import "./PollForm.css";

const AdminPollManager = () => {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [newPoll, setNewPoll] = useState({
    title: "",
    description: "",
    visibility: "public",
    options: [{ text: "" }],
    duration: 30,
    allowedUserIds: "",
  });
  const [editPoll, setEditPoll] = useState(null);

  const fetchPolls = async () => {
    try {
      setLoading(true);
      const res = await apiService.get("/polling/my-polls");
  
      setPolls(res || []);
    } catch (err) {
      setMessage("Error fetching polls: " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolls();
  }, []);

  const createPoll = async () => {
    if (!newPoll.title.trim()) {
      setMessage("Title is required");
      return;
    }
    
    if (newPoll.options.some((opt) => !opt.text.trim())) {
      setMessage("All options must have text");
      return;
    }

    if (newPoll.options.length < 2) {
      setMessage("At least 2 options are required");
      return;
    }

    if (newPoll.duration <= 0 || newPoll.duration > 120) {
      setMessage("Duration must be between 1 and 120 minutes");
      return;
    }

    try {
      const payload = {
        title: newPoll.title,
        description: newPoll.description,
        options: newPoll.options,
        visibility: newPoll.visibility,
        duration: newPoll.duration,
        allowedUserIds:
          newPoll.visibility === "private"
            ? newPoll.allowedUserIds.split(",").map((id) => id.trim()).filter(id => id)
            : [],
      };
      
      await apiService.post("/polling", payload);
      setMessage("Poll created!");
      setNewPoll({ 
        title: "", 
        description: "", 
        visibility: "public", 
        options: [{ text: "" }], 
        duration: 30,
        allowedUserIds: ""
      });
      fetchPolls();
    } catch (err) {
      setMessage("Error creating poll: " + (err.response?.data?.error || err.message));
    }
  };

  const updatePoll = async () => {
    if (!editPoll.title.trim()) {
      setMessage("Title is required");
      return;
    }

    try {
      const payload = {
        title: editPoll.title,
        description: editPoll.description,
        visibility: editPoll.visibility,
        duration: editPoll.duration,
        allowedUserIds:
          editPoll.visibility === "private"
            ? editPoll.allowedUserIds.split(",").map((id) => id.trim()).filter(id => id)
            : [],
      };
      
      await apiService.patch(`/polling/${editPoll._id}`, payload);
      setMessage("Poll updated!");
      setEditPoll(null);
      fetchPolls();
    } catch (err) {
      setMessage("Error updating poll: " + (err.response?.data?.error || err.message));
    }
  };

  const deletePoll = async (id) => {
    if (!window.confirm("Are you sure you want to delete this poll?")) return;
    try {
      await apiService.delete(`/polling/${id}`);
      setMessage("Poll deleted!");
      fetchPolls();
    } catch (err) {
      setMessage("Error deleting poll: " + (err.response?.data?.error || err.message));
    }
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...newPoll.options];
    newOptions[index].text = value;
    setNewPoll({ ...newPoll, options: newOptions });
  };

  const addOption = () => {
    setNewPoll({ ...newPoll, options: [...newPoll.options, { text: "" }] });
  };

  const removeOption = (index) => {
    if (newPoll.options.length > 2) {
      setNewPoll({ ...newPoll, options: newPoll.options.filter((_, i) => i !== index) });
    }
  };

  return (
    <div>
    {message && <p className="poll-message">{message}</p>}
    <div className="admin-polls">
      

      <div className="poll-form">
        <h3>Create Poll</h3>
        
        <label>Title</label>
        <input
          type="text"
          placeholder="Enter poll title"
          value={newPoll.title}
          onChange={(e) => setNewPoll({ ...newPoll, title: e.target.value })}
        />
        
        <label>Description</label>
        <textarea
          placeholder="Enter poll description"
          value={newPoll.description}
          onChange={(e) => setNewPoll({ ...newPoll, description: e.target.value })}
        />
        
        <label>Visibility</label>
        <select
          value={newPoll.visibility}
          onChange={(e) => setNewPoll({ ...newPoll, visibility: e.target.value })}
        >
          <option value="public">Public</option>
          <option value="private">Private</option>
        </select>

        {newPoll.visibility === "private" && (
          <>
            <label>Allowed User IDs (comma separated)</label>
            <input
              type="text"
              value={newPoll.allowedUserIds}
              onChange={(e) => setNewPoll({ ...newPoll, allowedUserIds: e.target.value })}
              placeholder="user1,user2,user3"
            />
          </>
        )}

        <label>Duration (minutes, max 120)</label>
        <input
          type="number"
          min="1"
          max="120"
          value={newPoll.duration}
          onChange={(e) => setNewPoll({ ...newPoll, duration: parseInt(e.target.value) || 1 })}
        />

        <h4>Options</h4>
        {newPoll.options.map((opt, idx) => (
          <div key={idx} className="option-row">
            <input
              type="text"
              placeholder={`Option ${idx + 1}`}
              value={opt.text}
              onChange={(e) => handleOptionChange(idx, e.target.value)}
            />
            {newPoll.options.length > 2 && (
              <button
                type="button"
                onClick={() => removeOption(idx)}
              >
                Remove
              </button>
            )}
          </div>
        ))}
        <button type="button" onClick={addOption}>
          + Add Option
        </button>
        <button type="button" onClick={createPoll}>Create Poll</button>
      </div>

      {/* List of Polls */}
      <div className="poll-list">
        <h3>My Polls</h3>
        {loading && <p>Loading...</p>}
        {polls.length === 0 && !loading && <p>No polls found</p>}
        {polls.map((poll) => (
          <div key={poll._id} className="poll-card">
            {editPoll && editPoll._id === poll._id ? (
              <>
                <label>Title</label>
                <input
                  type="text"
                  value={editPoll.title}
                  onChange={(e) => setEditPoll({ ...editPoll, title: e.target.value })}
                />
                
                <label>Description</label>
                <textarea
                  value={editPoll.description}
                  onChange={(e) => setEditPoll({ ...editPoll, description: e.target.value })}
                />
                
                <label>Visibility</label>
                <select
                  value={editPoll.visibility}
                  onChange={(e) => setEditPoll({ ...editPoll, visibility: e.target.value })}
                >
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                </select>

                {editPoll.visibility === "private" && (
                  <>
                    <label>Allowed User IDs (comma separated)</label>
                    <input
                      type="text"
                      value={editPoll.allowedUserIds || ""}
                      onChange={(e) => setEditPoll({ ...editPoll, allowedUserIds: e.target.value })}
                      placeholder="user1,user2,user3"
                    />
                  </>
                )}

                <label>Duration (minutes, max 120)</label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={editPoll.duration || 30}
                  onChange={(e) => setEditPoll({ ...editPoll, duration: parseInt(e.target.value) || 1 })}
                />
                
                <button type="button" onClick={updatePoll}>Save</button>
                <button type="button" onClick={() => setEditPoll(null)}>Cancel</button>
              </>
            ) : (
              <>
                <h4>{poll.title}</h4>
                <p>{poll.description}</p>
                <p>
                  Visibility: {poll.visibility} | Duration: {poll.duration} minutes
                </p>
                {poll.options && (
                  <ul>
                    {poll.options.map((opt, idx) => (
                      <li key={idx}>{opt.text} - Votes: {opt.votes || 0}</li>
                    ))}
                  </ul>
                )}
                <button type="button" onClick={() => setEditPoll({ 
                  ...poll, 
                  allowedUserIds: poll.allowedUserIds?.join(",") || "" 
                })}>
                  Edit
                </button>
                <button type="button" onClick={() => deletePoll(poll._id)}>Delete</button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
    </div>
  );
};

export default AdminPollManager;