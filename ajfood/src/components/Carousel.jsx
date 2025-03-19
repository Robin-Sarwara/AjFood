import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { showErrorToast } from '../utils/toastMessage'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Carousel = () => {

    const [products, setProducts] = useState("")

    const fetchDiscountedProducts =async()=>{
        try {
            const response = await axios.get('http://localhost:9090/api/products/filter/discounted')
            setProducts(response.data)
        } catch (error) {
            showErrorToast(error.response.data.message||"Error fetching discounted products")
        }
    }

    useEffect(() => {
      fetchDiscountedProducts()
    }, [])

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
      
      // Custom Next Arrow
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
        autoplay: true,
        autoplaySpeed: 3000,
        arrows: true,
        prevArrow: <CustomPrevArrow />,
        nextArrow: <CustomNextArrow />,
      };
    

    
  return (
    <div className="carousel-container lg:max-w-4xl max-w-2xl w-[80vw] mt-10 mb-10 shadow-lg m-auto text-center">
        <h1 className='text-3xl font-bold text-center'>Top Discount On Food Items</h1>
    {products.length > 0 ? (
      <Slider {...settings}>
        {products.map((product,i) => (
          <Link to={`/product/${product._id}`} key={i}>
          <div  className="product-slide p-5 text-center">
            <img className='w-[100%] h-[300px] object-contain'  src={product.imageUrls[0]} alt={product.name} />
            <h3 className='font-bold text-lg p-2'>{product.name}</h3>
            <p className='font-serif' >Discount: {product.discount}%</p>
            <p className='font-semibold'>Starting at just Rs {product.price}</p>
          </div>
          </Link>
        ))}
      </Slider>
    ) : (
      <p>Loading products...</p>
    )}
  </div>
  )
}

export default Carousel