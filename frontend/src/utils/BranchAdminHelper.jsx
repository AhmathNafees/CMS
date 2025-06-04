import axios from "axios";
export const fetchBranches = async()=>{
    let branches
    try{
        const response = await axios.get('http://localhost:3000/api/branch',{
            headers: {
            "Authorization" :`Bearer ${localStorage.getItem('token')}`
            }
        })
        if(response.data.success){
            branches=response.data.branches
        }
    }catch(error){
        if(error.response && !error.response.data.success){
            alert(error.response.data.error)
        }

    }
    return branches
};
