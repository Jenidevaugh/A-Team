import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { HiOutlineMenuAlt4 } from "react-icons/hi";
import { FaSearch, FaUser, FaCaretDown } from "react-icons/fa";
import Flex from "../../designLayouts/Flex";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAccount } from 'wagmi';
import { createPublicClient } from "viem";
import { rollux } from "viem/chains";
import { http } from "viem";
import { CommerceABI } from "../../../ABI/Commerce";

//const Commercecontract = "0x2e0b6cb6dB7247f132567d17D0b944bAa503d21A";
const Commercecontract = "0xa8c24812D4D3Bf6d4547FA59c75F7a8C53c4A83E";

const HeaderBottom = () => {
  const products = useSelector((state) => state.orebiReducer.products || []);
  const [show, setShow] = useState(false);
  const [showUser, setShowUser] = useState(false);
  const navigate = useNavigate();
  const ref = useRef();
  const [Orders, setOrders] = useState([]);
  const [productsForSearch, setProductsForSearch] = useState([]);
  const address1 = useAccount();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showSearchBar, setShowSearchBar] = useState(false);

  // Toggle the dropdown menu
  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setShow(false);
      } else {
        setShow(true);
      }
    };

    document.body.addEventListener("click", handleClick);
    return () => {
      document.body.removeEventListener("click", handleClick);
    };
  }, [show]);

  // Fetch products and set state
  useEffect(() => {
    async function fetchData() {
      const publicClient = createPublicClient({
        chain: rollux,
        transport: http('https://rpc.rollux.com')
      });

      try {
        const getProducts = await publicClient.readContract({
          address: Commercecontract,
          abi: CommerceABI,
          functionName: 'getAllProducts',
        });

        if (Array.isArray(getProducts)) {
          setProductsForSearch(getProducts);
          setOrders(getProducts);

          // Fetch images for each product
          const productsWithImages = await Promise.all(
            getProducts.map(async (product) => {
              const options = {
                method: 'GET',
                headers: {
                  Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI2MWUzYThkOC05ZDk0LTRhZTUtYTRkOS1mYTFkYjJmZjE4MTUiLCJlbWFpbCI6ImplbmlkZXZhdWdobnF4bjg0QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6IkZSQTEifSx7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6Ik5ZQzEifV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiIwODM1NGM5YzUzNDc0ZGRiNTYyNSIsInNjb3BlZEtleVNlY3JldCI6IjBiMTY1NDQwNGMxZDAwOTIzYmU3YzZjMDQzOTYwZGU3NzdmMDEyYmUwZGZjMjJiYjNiNDNmY2VmNDBhOTM3MjUiLCJleHAiOjE3NTU3NDg3NzV9.GTO6sKrnG9PmaCwIDXb1lwALHzwhBsqGk37mAHn21Uk',
                },
              };

              const response = await fetch(`https://api.pinata.cloud/data/pinList?cid=${product.image}`, options);
              const imageData = await response.json();
              const imageUrl = `https://gateway.pinata.cloud/ipfs/${imageData.rows[0].ipfs_pin_hash}`;

              return { ...product, imageUrl };
            })
          );

          setProductsForSearch(productsWithImages);
        } else {
          console.error('Fetched data is not an array:', getProducts);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, []);

  // Update filtered products based on search query
  useEffect(() => {
    const filtered = productsForSearch.filter((item) =>
      item.title &&
      typeof item.title === 'string' &&
      item.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchQuery, productsForSearch]);

  //console.log('see', filteredProducts);

  return (
    <div className="w-full bg-[#F5F5F3] relative">
      <div className="max-w-container mx-auto">
        <Flex className="flex flex-col lg:flex-row items-start lg:items-center justify-between w-full px-4 pb-4 lg:pb-0 h-full lg:h-24">
          <div
            onClick={() => setShow(!show)}
            ref={ref}
            className="flex h-14 cursor-pointer items-center gap-2 text-primeColor"
          >
            <HiOutlineMenuAlt4 className="w-5 h-5" />
            <p className="text-[14px] font-normal">Shop by Category</p>

            {show && (
              <motion.ul
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="absolute top-36 z-50 bg-primeColor w-auto text-[#767676] h-auto p-4 pb-6"
              >
                {/* Category List */}
                <li className="text-gray-400 px-4 py-1 border-b-[1px] border-b-gray-400 hover:border-b-white hover:text-white duration-300 cursor-pointer">Accessories</li>
                <li className="text-gray-400 px-4 py-1 border-b-[1px] border-b-gray-400 hover:border-b-white hover:text-white duration-300 cursor-pointer">Furniture</li>
                <li className="text-gray-400 px-4 py-1 border-b-[1px] border-b-gray-400 hover:border-b-white hover:text-white duration-300 cursor-pointer">Electronics</li>
                <li className="text-gray-400 px-4 py-1 border-b-[1px] border-b-gray-400 hover:border-b-white hover:text-white duration-300 cursor-pointer">Clothes</li>
                <li className="text-gray-400 px-4 py-1 border-b-[1px] border-b-gray-400 hover:border-b-white hover:text-white duration-300 cursor-pointer">Bags</li>
                <li className="text-gray-400 px-4 py-1 border-b-[1px] border-b-gray-400 hover:border-b-white hover:text-white duration-300 cursor-pointer">Footwear</li>
                <li className="text-gray-400 px-4 py-1 border-b-[1px] border-b-gray-400 hover:border-b-white hover:text-white duration-300 cursor-pointer">Home appliances</li>
              </motion.ul>
            )}
          </div>
          <div className="relative w-full lg:w-[600px] h-[50px] text-base text-primeColor bg-white flex items-center gap-2 justify-between px-6 rounded-xl">
            <input
              className="flex-1 h-full outline-none placeholder:text-[#C4C4C4] placeholder:text-[14px]"
              type="text"
              onChange={(e) => setSearchQuery(e.target.value)}
              value={searchQuery}
              placeholder="Search products here"
            />
            <FaSearch className="w-5 h-5" />
            {searchQuery && (
              <div className="w-full mx-auto h-fit bg-white top-16 absolute left-0 z-50 overflow-y-scroll shadow-2xl scrollbar-hide cursor-pointer">
                {filteredProducts.map((item) => (
                  <div
                    onClick={() => {
                      navigate(`/product-details/${item.id}`, { state: { item } });
                      setShowSearchBar(false);
                      setSearchQuery("");
                    }}
                    key={item._id}
                    className="max-w-[600px] h-28 bg-gray-100 mb-3 flex items-center gap-3"
                  >
                    <img className="w-24" src={item.imageUrl} alt={item.title} />
                    <div className="flex flex-col gap-1">
                      <p className="font-semibold text-lg">{item.title}</p>
                      <p className="text-xs">{item.description}</p>
                      <p className="text-sm">
                        Price:{" "}
                        <span className="text-primeColor font-semibold">${item.price}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="flex gap-4 mt-2 lg:mt-0 items-center pr-6 cursor-pointer relative">
            <div onClick={() => setShowUser(!showUser)} className="flex">
              <FaUser />
              <FaCaretDown />
            </div>
            {showUser && (
              <motion.ul
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="absolute top-16 left-0 overflow-none border rounded z-50 bg-primeColor w-44 text-[#767676] h-auto p-4 pb-6"
              >
                {address1.address ? (
                  <Link onClick={() => setShowUser(false)} to="/userData">
                    <li className="text-gray-400 px-4 py-1 border-b-[1px] border-b-gray-400 hover:border-b-white hover:text-white duration-300 cursor-pointer">Profile</li>
                  </Link>
                ) : (
                  <>
                    <Link to="/signin">
                      <li className="text-gray-400 px-4 py-1 border-b-[1px] border-b-gray-400 hover:border-b-white hover:text-white duration-300 cursor-pointer">Login</li>
                    </Link>
                    <Link onClick={() => setShowUser(false)} to="/signup">
                      <li className="text-gray-400 px-4 py-1 border-b-[1px] border-b-gray-400 hover:border-b-white hover:text-white duration-300 cursor-pointer">Sign Up</li>
                    </Link>
                  </>
                )}
              </motion.ul>
            )}
          </div>
        </Flex>
      </div>
    </div>
  );
};

export default HeaderBottom;
