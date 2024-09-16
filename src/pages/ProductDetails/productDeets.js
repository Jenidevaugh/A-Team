import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";
import ProductsOnSale from "../../components/pageProps/productDetails/ProductsOnSale";
import BestSellers from "../../components/home/BestSellers/BestSellers";
import { CommerceABI } from "../../ABI/Commerce";
import { createPublicClient, http } from "viem";
import { rollux } from "viem/chains";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/orebiSlice";
import { FaInfo } from "react-icons/fa";
import { setVendorAddress } from "../../redux/orebiSlice";
import { useSelector } from "react-redux";
import Loading from "../Others/Loadingss";


const ProductDetails1 = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [prevLocation, setPrevLocation] = useState("");
  const [productInfo, setProductInfo] = useState({});
  const [products, setProducts] = useState([]);
  const [productsCount, setProductsCount] = useState([]);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true); // Add loading state



  //const Commercecontract = "0x2e0b6cb6dB7247f132567d17D0b944bAa503d21A";
  const Commercecontract = "0xa8c24812D4D3Bf6d4547FA59c75F7a8C53c4A83E";

  useEffect(() => {

    setIsLoading(true); // Start loading

    // Check if a Web3 wallet is connected
    const checkWalletConnection = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          setIsWalletConnected(accounts.length > 0);
        } catch (error) {
          console.error('Error checking wallet connection:', error);
          setIsWalletConnected(false);
        }
      } else {
        setIsWalletConnected(false);
      }
    };

    checkWalletConnection();

    async function fetchData() {
      const publicClient = createPublicClient({
        chain: rollux,
        transport: http('https://rpc.rollux.com'),
      });

      try {
        const getProducts = await publicClient.readContract({
          address: Commercecontract,
          abi: CommerceABI,
          functionName: "getAllProducts",
        });

        const getProductsCount = await publicClient.readContract({
          address: Commercecontract,
          abi: CommerceABI,
          functionName: "productCount",
        });

        const productsWithImages = await Promise.all(
          getProducts.map(async (product) => {
            const options = {
              method: "GET",
              headers: {
                Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI2MWUzYThkOC05ZDk0LTRhZTUtYTRkOS1mYTFkYjJmZjE4MTUiLCJlbWFpbCI6ImplbmlkZXZhdWdobnF4bjg0QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6IkZSQTEifSx7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6Ik5ZQzEifV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiIwODM1NGM5YzUzNDc0ZGRiNTYyNSIsInNjb3BlZEtleVNlY3JldCI6IjBiMTY1NDQwNGMxZDAwOTIzYmU3YzZjMDQzOTYwZGU3NzdmMDEyYmUwZGZjMjJiYjNiNDNmY2VmNDBhOTM3MjUiLCJleHAiOjE3NTU3NDg3NzV9.GTO6sKrnG9PmaCwIDXb1lwALHzwhBsqGk37mAHn21Uk',
              },
            };

            const response = await fetch(
              `https://api.pinata.cloud/data/pinList?cid=${product.image}`,
              options
            );
            const imageData = await response.json();
            const imageUrl = `https://gateway.pinata.cloud/ipfs/${imageData.rows[0].ipfs_pin_hash}`;

            return {
              ...product,
              imageUrl,
            };
          })
        );

        setProducts(productsWithImages);
        setProductsCount(getProductsCount);
        setProductInfo(location.state?.item || {});
        setPrevLocation(location.pathname);
      } catch (error) {
        console.error(error);
      }
      finally {
        setIsLoading(false); // End loading
      }
    }

    fetchData();
  }, [location]);

  useEffect(() => {
    setProductInfo(location.state?.item || {});
  }, [location]);


  const handleAddToCart = () => {
    dispatch(addToCart({
      _id: productInfo.id.toString(),
      name: productInfo.title,
      quantity: 1,
      image: productInfo.imageUrl,
      price: productInfo.price.toString(),
    }));
  };

  const handleConnectWallet = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        setIsWalletConnected(true);
      } catch (error) {
        console.error('Error connecting wallet:', error);
      }
    } else {
      alert('No Web3 wallet detected. Please install MetaMask or another Ethereum wallet.');
    }
  };

  const vendorAddress1 = useSelector((state) => state.orebiReducer.vendorAddress);

  console.log('test', vendorAddress1);


  useEffect(() => {
    dispatch(setVendorAddress(productInfo.owner));

  }, [products, dispatch]);



  return (
    <div className="w-full mx-auto border-b-[1px] border-b-gray-300">
    {isLoading ? ( // Show loading indicator while data is loading
      <p className="text-gray-500 text-center py-9"><Loading /></p>
    ) : !productInfo || !productInfo.title ? ( // Check if productInfo is missing
      <p className="text-gray-500 text-center py-9">Product information is not available.</p>
    ) : (
      <div className="max-w-container mx-auto px-4">
        <div className="xl:-mt-10 -mt-7">
          <Breadcrumbs title={productInfo.title} />
        </div>
        <div>
          <img
            src={productInfo.imageUrl}
            alt={productInfo.title}
            className="w-full h-58 object-cover rounded-t-lg mb-4 xl:w-1/2 xl:mx-auto"
          />
          <h3 className="text-lg font-semibold">{productInfo.title}</h3>
          <p className="text-gray-600 mb-2">{productInfo.description}</p>
          <p className="text-gray-800 font-bold mb-2">Price: ${productInfo.price.toString()}</p>
          <p className="text-gray-500 mb-2">Category: {productInfo.category}</p>
          <p className="text-gray-500 mb-2">Stock: {productInfo.MintCap.toString()}</p>
          <p className="text-gray-500">Sold Out: {productInfo.isSold ? "Yes" : "No"}</p>
            
          <p className="text-gray-500 mt-2">
            Vendor Address: 
            <Link onClick={() => dispatch(setVendorAddress(productInfo.owner))} to={`/products-by-owner/${encodeURIComponent(productInfo.owner)}`} className="text-blue hover:underline">
              {productInfo.owner}
            </Link>
          </p>
          <p className="flex text-gray-500"> <FaInfo color="blue"/> Click address to view other products posted by this vendor</p>
        </div>
        <hr />
        <br />
        <div className="flex justify-center">
          {isWalletConnected ? (
            <button
              onClick={handleAddToCart}
              className="w-11/12 py-4 px-2 bg-blue rounded-lg hover:bg-black duration-300 text-white text-lg font-titleFont"
            >
              Add to Cart
            </button>
          ) : (
            <button
              onClick={handleConnectWallet}
              className="w-11/12 xl:w-1/2 py-4 px-2 bg-blue rounded-lg hover:bg-black duration-300 text-white text-lg font-titleFont"
            >
              Connect 
            </button>
          )}
        </div>
        <br />
        <br />
      </div>
    )}
  </div>
);
};


export default ProductDetails1;
