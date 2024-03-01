
import { BlogEntry } from "./BlogEntry";
import axios from "axios";
import { useEffect, useState } from "react";

export function Shooy() {
  const [shooyPosts, setShooyPosts] = useState([]);
  const [showComments, setShowComments] = useState({});
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState({}); 

  useEffect(() => {
    const fetchShooyPosts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/shooy-entries");
        setShooyPosts(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchShooyPosts();
  }, []);

  const handleDelete = async (postId) => {
    try {
      await axios.delete(`http://localhost:5000/api/shooy-entries/${postId}`);
      setShooyPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
    } catch (error) {
      console.log(error);
    }
  };

  const toggleComments = async (postId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/shooy-entries/${postId}/comments`);
      const fetchedComments = response.data;

      setComments({
        ...comments,
        [postId]: fetchedComments,
      });

      setShowComments((prevShowComments) => ({
        ...prevShowComments,
        [postId]: !prevShowComments[postId],
      }));
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddComment = async (postId, text) => {
    try {
      await axios.post(`http://localhost:5000/api/shooy-entries/${postId}/comments`, { text });   
      toggleComments(postId);
      setCommentText("");
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteComment = async (postId,commentId) =>{
    try{
        const url = `http://localhost:5000/api/shooy-entries/${postId}/comments/${commentId}`;
        console.log('Deleting comment with URL:', url);
        await axios.delete(url);
        toggleComments(postId);
    } catch (error) {
        console.log(error);
    }
  }

  return (
    <div className="mamla">
      <div>
        Hello this is Shooy
      </div>
      <br />
      {shooyPosts.map((entry) => (
        <div key={entry._id}>
          <BlogEntry key={entry.title} title={entry.title} data={entry.data} />
          <button onClick={() => handleDelete(entry._id)}>Delete</button>
          <button onClick={() => toggleComments(entry._id)}>
            {showComments[entry._id] ? 'Hide Comments' : 'Show Comments'}
          </button>
          {showComments[entry._id] && (
            <div>
              <textarea
                rows="3"
                cols="30"
                placeholder="Add a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <button onClick={() => handleAddComment(entry._id, commentText)}>
                Add Comment
              </button>
              {comments[entry._id] && comments[entry._id].map((comment) => (
                <div key={comment._id} className="flex flex-row">
                  <p>{comment.text}</p>
                  <button onClick={() => handleDeleteComment(entry._id,comment._id)}>Delete Comment</button>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
