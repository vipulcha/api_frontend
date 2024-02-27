import { useEffect, useState } from "react";
import { BlogEntry } from "./BlogEntry";
import axios from "axios";

export function Helio(){

    const [helioPosts,setHelioPosts] = useState([]);

    useEffect(()=>{
        const fetchHelioPosts = async () => {
        try{
            const response = await axios.get("https://api-backend-2uhu.onrender.com/api/helio-entries");
            setHelioPosts(response.data);
        } catch (error) {
            console.error(error);
        }

    }

        fetchHelioPosts();
    },[]);



    const handleDelete = async (postId) => {
        try{
            await axios.delete(`https://api-backend-2uhu.onrender.com/api/helio-entries/${postId}`);
            setHelioPosts((prevPosts) => prevPosts.filter((post)=> post._id !== postId ));
        } catch(error) {
            console.log(error);
        }

    }



    return(
        <div className="helio mamla">
            <div> 
            Hello this is Helio
            </div>
            <br></br>
            
            {helioPosts.map((entry)=>{
                return (
                    <div key={entry._id}>
                    <BlogEntry key={entry.title} title={entry.title} data={entry.data}/>
                    <button onClick= { () => handleDelete(entry._id)}>Delete</button>
                    </div>)
            })}
        </div>
    )
}