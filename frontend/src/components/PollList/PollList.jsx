import React, { useEffect, useState } from "react";
import "./PollList.css";
import apiService from "../../api/api";

const PollList = () => {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPoll, setSelectedPoll] = useState(null);
  const [message, setMessage] = useState("");
  const [votingPoll, setVotingPoll] = useState(null); 


  useEffect(() => {
    fetchPolls();
  }, []);

  const fetchPolls = async () => {
    try {
      setLoading(true);
      const res = await apiService.get("/polling");
      const pollsData = res || [];
      
      const pollsWithVoteStatus = await Promise.all(
        pollsData.map(async (poll) => {
          try {
            const results = await apiService.get(`/polling/${poll._id}/results`);
            if (results && results.results) {
              return { ...poll, results, userHasVoted: true, hasVoted: true };
            }
          } catch (err) {
            console.log(`No results for poll ${poll._id}:`, err.message);
          }
          return poll;
        })
      );
      
      setPolls(pollsWithVoteStatus);
      console.log("Polls with vote status:", pollsWithVoteStatus);
    } catch (err) {
      setMessage("Error loading polls: " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (pollId, optionId) => {
    try {
      setVotingPoll(pollId);
      await apiService.post(`/polling/${pollId}/vote`, { optionId });
      setMessage("Vote submitted successfully!");
      
      const res = await apiService.get(`/polling/${pollId}/results`);
      setPolls((prev) =>
        prev.map((poll) => 
          poll._id === pollId 
            ? { ...poll, results: res, userHasVoted: true, hasVoted: true } 
            : poll
        )
      );
      
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage("Error voting: " + (err.response?.data?.error || err.message));
    } finally {
      setVotingPoll(null);
    }
  };

  const fetchResults = async (pollId) => {
    try {
      const res = await apiService.get(`/polling/${pollId}/results`);
      
      setPolls((prev) =>
        prev.map((poll) => 
          poll._id === pollId 
            ? { ...poll, results: res } 
            : poll
        )
      );
    } catch (err) {
      setMessage("Error fetching results: " + (err.response?.data?.error || err.message));
    }
  };

  const closeModal = () => {
    setSelectedPoll(null);
  };

  const calculateTimeRemaining = (expiresAt) => {
    if (!expiresAt) return "No expiry";
    
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diff = expiry - now;
    
    if (diff <= 0) return "Expired";
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} left`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} left`;
    return `${minutes} minute${minutes > 1 ? 's' : ''} left`;
  };

  const isExpired = (expiresAt) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) <= new Date();
  };

  return (
    <div className="poll-list-container">
      <div className="poll-list-header">
        <h2>Available Polls</h2>
        <button className="refresh-btn" onClick={fetchPolls} disabled={loading}>
          🔄 Refresh
        </button>
      </div>

      {message && (
        <div className={`poll-message ${message.includes('Error') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}

      {loading && (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading polls...</p>
        </div>
      )}

      {!loading && polls.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">📊</div>
          <h3>No Polls Available</h3>
          <p>Check back later for new polls to vote on!</p>
        </div>
      )}

      <div className="polls-grid">
        {polls.map((poll) => {
          const expired = isExpired(poll.expiresAt);
          const userVoted = poll.userHasVoted || poll.hasVoted || (poll.results && poll.results.results && poll.results.results.length > 0);
          const timeRemaining = calculateTimeRemaining(poll.expiresAt);
          const showResults = expired || userVoted;

          return (
            <div key={poll._id} className={`poll-card ${expired ? 'expired' : ''}`}>
              <div className="poll-header">
                <h3>{poll.title}</h3>
                <span className={`poll-badge ${expired ? 'badge-expired' : 'badge-active'}`}>
                  {expired ? '⏰ Expired' : '✅ Active'}
                </span>
              </div>

              {poll.description && (
                <p className="poll-description">{poll.description}</p>
              )}

              <div className="poll-meta">
                <span className="meta-item">
                  <span className="meta-icon">👁️</span>
                  {poll.visibility}
                </span>
                <span className={`meta-item ${expired ? 'expired-time' : ''}`}>
                  <span className="meta-icon">⏱️</span>
                  {timeRemaining}
                </span>
              </div>

              {!showResults && (
                <div className="poll-options">
                  <h4>Cast Your Vote</h4>
                  {poll.options.map((opt) => (
                
                    <button
                      key={opt._id}
                      className="poll-option-btn"
                      onClick={() => handleVote(poll._id, opt.id)}
                      disabled={votingPoll === poll._id}
                    >
                      <span className="option-icon">📌</span>
                      {opt.text}
                    </button>
                  ))}
                </div>
              )}

              {showResults && (
                <div className="poll-results">
                  <h4>
                    {userVoted && !expired && '✓ You voted · '}
                    Results
                  </h4>
                  {poll?.results ? (
                    <>
                      {poll?.results?.results?.map((opt) => {
                        const percent = parseFloat(opt.percentage);
                        return (
                          <div key={opt.id} className="result-row">
                            <div className="result-header">
                              <span className="result-text">{opt.text}</span>
                              <span className="result-stats">
                                {opt.voteCount} vote{opt.voteCount !== 1 ? 's' : ''} · {percent}%
                              </span>
                            </div>
                            <div className="result-bar">
                              <div 
                                className="result-fill" 
                                style={{ width: `${percent}%` }}
                              >
                                {percent > 10 && <span className="percent-label">{percent}%</span>}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      <div className="total-votes">
                        Total votes: {poll.results.totalVotes}
                      </div>
                    </>
                  ) : (
                    <button 
                      className="view-results-btn" 
                      onClick={() => fetchResults(poll._id)}
                    >
                      View Results
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {selectedPoll && (
        <div className="poll-modal-overlay" onClick={closeModal}>
          <div className="poll-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Poll Results</h3>
              <button className="close-btn" onClick={closeModal}>✕</button>
            </div>
            <div className="modal-content">
              {selectedPoll.results.results.map((opt) => {
                const percent = parseFloat(opt.percentage);
                return (
                  <div key={opt.id} className="result-row">
                    <div className="result-header">
                      <span className="result-text">{opt.text}</span>
                      <span className="result-stats">
                        {opt.voteCount} votes · {percent}%
                      </span>
                    </div>
                    <div className="result-bar">
                      <div className="result-fill" style={{ width: `${percent}%` }} />
                    </div>
                  </div>
                );
              })}
              <div className="total-votes">
                Total votes: {selectedPoll.results.totalVotes}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PollList;