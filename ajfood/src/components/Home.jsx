import React, { useEffect, useState } from "react";
import axios from "axios";
import { Flag, MoreVertical } from "lucide-react";
import { showErrorToast, showSuccessToast } from "../utils/toastMessage";
import Swal from "sweetalert2";
import Spinner from "./Spinner";
import { useNavigate } from "react-router-dom";
import Carousel from "./Carousel";
import axiosInstance from "../utils/axiosInstance";
import { useRole } from "../utils/useRole";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [openIndex, setOpenIndex] = useState(null);
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate();

  const{role,userId,setUserId} = useRole();

  const toggle = (i) => {
    setOpenIndex(openIndex === i ? null : i); // Close if already open, else open it
  };

  const fetchProducts = async () => {
    setLoading(true)
    const response = await axiosInstance.get("/products");
    setProducts(response.data);
    setLoading(false)
  };

  

  const checkAdmin = () => {
    setIsAdmin(role === "admin");
  };

  useEffect(() => {
    fetchProducts();
  }, [])
  
    useEffect(() => {
    checkAdmin();
  }, [role]);

  const handleDelete =async(id)=>{
    setOpenIndex(null)
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!"
    });
  
    if (result.isConfirmed) {
    try {
      setLoading(true)
      const token = localStorage.getItem("token");
       const response = await axios.delete(`http://localhost:9090/api/products/${id}`,{
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      if(response.status===200){
        showSuccessToast("Product deleted successfully")
        setProducts(products.filter((product)=>product._id!==id));
        setLoading(false)
      }
    } catch (error) {
      showErrorToast(error.response.data.message||error.message||"error deleting product")
      console.log(error.response.data)
    }
    finally{
      setLoading(false)
    }
  }
}

const handleEdit =(id)=>{
  navigate("/add-product", {state:{productId:id}})
}

const handleViewMore=(id)=>{
  navigate(`/product/${id}`)
}

  return (
    <>
      {loading&&<Spinner/>}
      <div className="w-[100vw] md:w-full h-full bg-gray-100 overflow-hidden">
        <Carousel/>
        <h1 className="w-[100vw] md:w-full text-center font-bold text-5xl p-5">All Products</h1>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 md:w-full w-[100vw] justify-center gap-5 m-2 mt-5">
          {products.length >= 1 ? (
            products.map((item, i) => (
              <div className="h-auto shadow-lg flex flex-col justify-center items-center rounded-lg relative" key={i}>
                
                <div className="flex gap-5 justify-center md:w-full w-[100vw] relative">
                  {isAdmin && (
                    <button onClick={() => toggle(i)} className="absolute top-2 right-2 p-1">
                      <MoreVertical size={24} />
                    </button>
                  )}
                  {openIndex === i && (
                    <div className="absolute top-10 right-2 w-40 bg-white shadow-lg rounded-md overflow-hidden z-10">
                      <button className="w-full text-left px-4 py-2 hover:bg-gray-100" onClick={()=>handleEdit(item._id)} >Edit</button>
                      <button className="w-full text-left px-4 py-2 hover:bg-gray-100" onClick={()=>handleDelete(item._id)}>Delete</button>
                    </div>
                  )}
                  <img className="h-[300px] w-[300px] rounded-lg object-cover" src={item.thumbnail} alt="" />
                 
                </div>
                <p className="font-bold text-center text-xl mt-2">{item.name}</p>
                <p className="font-bold text-center mt-2">Rs {item.price}</p>
                <button className="w-auto bg-[#8A2BE2] p-2 mb-5 mt-4 rounded-lg text-white font-bold hover:bg-purple-800 " onClick={()=>handleViewMore(item._id)}>View more</button>
                
              </div>
            ))
          ) : (
            <p className="w-full font-bold text-4xl"> No Products Found</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
