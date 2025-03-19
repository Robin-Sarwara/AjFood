import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Spinner from "./Spinner";
import { showErrorToast, showSuccessToast } from "../utils/toastMessage";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { FaShoppingCart } from "react-icons/fa";
import { AiOutlineCheckCircle } from "react-icons/ai";
import Feedback from "./Feedback";
import Reviews from "./Reviews";
import { Minus, Plus } from "lucide-react";
import { useRole } from "../utils/useRole";
import axiosInstance from "../utils/axiosInstance";
import RazorpayPayment from "./RazorpayPayment"; // Import the new component

const ProductInfo = () => {
  const initialQuantity = 1;
  const maxQuantity = 10;
  const minQuantity = 1;

  const [product, setProduct] = useState("");
  const [loading, setLoading] = useState(false);
  const [addToCart, setAddToCart] = useState(false);
  const [quantity, setQuantity] = useState(initialQuantity);
  const [showPaymentModal, setShowPaymentModal] = useState(false); // State to control payment modal

  const { id } = useParams();
  const { userId } = useRole();

  const handleDecrement = () => {
    if (quantity > minQuantity) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncrement = () => {
    if (quantity < maxQuantity) {
      setQuantity(quantity + 1);
    }
  };

  const fetchProductInfo = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:9090/api/products/${id}`);
      setProduct(response.data);
      setLoading(false);
    } catch (error) {
      showErrorToast(error.response.data.message || "Error fetching product info");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductInfo();
  }, [id]);

  const handleAddToCart = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.post(`/product/${id}/addtocart`, {
        quantity,
        userId,
      });
      setLoading(false);
      setQuantity(initialQuantity);
      showSuccessToast(`${quantity} items added to cart successfully`);
    } catch (error) {
      showErrorToast(error.response.data.message || "An error occurred while adding item to cart");
    }
  };

  const handleBuyNow = () => {
    setShowPaymentModal(true); // Show the payment modal
  };

  const handlePaymentSuccess = (response) => {
    // Handle successful payment (e.g., update cart or order status)
    console.log("Payment Success:", response);
    setShowPaymentModal(false); // Close modal after success
    showSuccessToast("Order placed successfully!");
  };

  const handleCloseModal = () => {
    setShowPaymentModal(false); // Close the payment modal
  };

  const CustomPrevArrow = ({ onClick }) => {
    return (
      <div
        onClick={onClick}
        style={{
          position: "absolute",
          left: "-40px",
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 1,
          cursor: "pointer",
          color: "black",
          fontSize: "30px",
        }}
      >
        <FaArrowLeft />
      </div>
    );
  };

  const CustomNextArrow = ({ onClick }) => {
    return (
      <div
        onClick={onClick}
        style={{
          position: "absolute",
          right: "-40px",
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 1,
          cursor: "pointer",
          color: "black",
          fontSize: "30px",
        }}
      >
        <FaArrowRight />
      </div>
    );
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    arrows: true,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
  };

  return (
    <>
      {loading && <Spinner />}
      <div className="w-[100vw] h-auto bg-gray-100 grid overflow-hidden">
        {product ? (
          <div className="grid w-[100vw] md:grid-cols-2 h-full mt-10" key={product._id}>
            <div className="w-[100vw] md:w-auto flex md:grid justify-center">
              <img
                className="lg:h-[600px] md:h-[500px] h-[400px] rounded-lg"
                src={product.thumbnail}
                alt=""
              />
            </div>
            <div>
              <p className="font-bold text-xl ml-5 p-2">{product.name}</p>
              <p className="font-semibold lg:text-xl ml-5 p-2">
                <b className="text-lg">Description:</b> {product.description}
              </p>
              <p className="font-semibold lg:text-xl ml-5 p-2">
                <b className="text-lg">Ingredients:</b>
                {product.ingredients?.map((item, index) => (
                  <span key={index}>
                    {" "}
                    {item}
                    {index !== product.ingredients.length - 1 && ","}{" "}
                  </span>
                ))}
              </p>
              <p className="font-semibold lg:text-xl ml-5 p-2">
                <b className="text-lg">Veg:</b> {product.isVeg ? "Yes" : "No"}
              </p>
              <p className="font-bold lg:text-xl text-lg ml-5 ">
                Discount:{" "}
                <span className="text-2xl bg-red-600 text-white rounded-lg p-1">
                  -{product.discount}%
                </span>
              </p>
              <p className="font-bold lg:text-xl flex text-lg ml-5 mb-2 ">
                ₹<span className="text-4xl">{product.price}</span>
              </p>
              <div className="flex flex-col ml-5 items-start gap-5">
                <div className="flex w-auto h-auto gap-5">
                  <span className="flex items-center gap-2">
                    <button className="bg-slate-400 rounded-full" onClick={handleDecrement}>
                      <Minus size={20} />
                    </button>
                    <p>{quantity}</p>
                    <button className="bg-slate-400 rounded-full" onClick={handleIncrement}>
                      <Plus size={20} />
                    </button>
                  </span>

                  <button onClick={() => handleAddToCart()}>
                    <div className="flex ml-5 gap-1 bg-gray-400 p-2 rounded-lg">
                      <FaShoppingCart size={25} />
                      <b>Add to cart</b>
                    </div>
                  </button>
                </div>
                <button
                  onClick={handleBuyNow}
                  className="w-auto ml-5 bg-blue-500 p-2 mb-5 mt-4 rounded-lg text-white font-bold hover:bg-blue-700 "
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        ) : (
          <p>No products found...</p>
        )}
        <div className="carousel-container w-[80vw] md:w-full lg:max-w-4xl max-w-2xl mx-auto mt-16 mb-10 shadow-lg">
          {product.imageUrls?.length > 0 ? (
            <Slider {...settings} className="relative">
              {product.imageUrls.map((img, i) => (
                <div key={i} className="p-5 flex justify-center items-center h-[500px]">
                  <img
                    className="w-[100vw] h-full object-contain rounded-lg"
                    src={img}
                    alt={`Product ${i + 1}`}
                  />
                </div>
              ))}
            </Slider>
          ) : (
            <p className="text-center text-lg font-semibold">No images available</p>
          )}
        </div>
        <Feedback id={id} />
        <Reviews loading={loading} setLoading={setLoading} />
      </div>

      {showPaymentModal && product && (
        <RazorpayPayment
          productName={product.name}
          productPrice={product.price * quantity} // Adjust price based on quantity
          onPaymentSuccess={handlePaymentSuccess}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
};

export default ProductInfo;