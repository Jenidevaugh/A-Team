import React, { useEffect, useState } from "react";
import Heading from "../Products/Heading";
import Product from "../Products/Product";
import { useNavigate } from "react-router-dom";
import { createPublicClient } from "viem";
import { CommerceABI } from "../../../ABI/Commerce";
import { rollux } from "viem/chains";
import { http } from "viem";
import Loading from "../../../pages/Others/LoadingssShort";

// Replace with actual contract address
//const Commercecontract = "0x2e0b6cb6dB7247f132567d17D0b944bAa503d21A";
const Commercecontract = "0xa8c24812D4D3Bf6d4547FA59c75F7a8C53c4A83E";

// Utility function to shuffle an array
const shuffleArray = (array) => {
  let shuffled = array.slice();
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const SpecialOffers = () => {
  const [products, setProducts] = useState([]); // Initialize products as an empty array
  const [displayedProducts, setDisplayedProducts] = useState([]); // State for random products
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true); // Add loading state

  const publicClient = createPublicClient({
    chain: rollux,
    transport: http('https://rpc.ankr.com/rollux'),
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const getProducts = await publicClient.readContract({
          address: Commercecontract,
          abi: CommerceABI,
          functionName: 'getAllProducts',
        });

        // Fetch images for each product based on the IPFS CID
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

            return {
              ...product,
              imageUrl,
            };
          })
        );

        // Shuffle products and select the first 4
        const randomProducts = shuffleArray(productsWithImages).slice(0, 4);

        setProducts(productsWithImages);
        setDisplayedProducts(randomProducts);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false); // Set loading to false once data is fetched
      }
    }

    fetchData();

    // Set up polling if needed
    const intervalId = setInterval(fetchData, 3000);
    return () => clearInterval(intervalId);

  }, []);

  const handleProductClick = (product) => {
    navigate(`/product-details/${product.id}`, { state: { item: product } });
  };

  return (
    <div className="w-full pb-20">
      <Heading heading="Special Offers" />
      {loading ? ( // Conditionally render loading text
        <div className="text-center py-4 my-7"><Loading/></div>
      ) : (<div className="w-full grid grid-cols-1 md:grid-cols-2 lgl:grid-cols-3 xl:grid-cols-4 gap-10">
        {displayedProducts.map((product, index) => (
          <div key={index} className="px-2">
            <div
              onClick={() => handleProductClick(product)}
              className="cursor-pointer"
              style={{ height: '400px' }} // Adjust height as needed
            >
              <Product
                _id={product.id}
                img={product.imageUrl}
                productName={product.title}
                price={product.price.toString()}
                 badge={product.badge || false}
                des={product.description}
              />
            </div>
          </div>
        ))}
      </div>
       )}
    </div>
  );
};

export default SpecialOffers;
