

const Products = () => {



    
  const handleUnStake = async () => {

    
    setclaimingUnSTake(true);
    try {


      //Get and store address
      const [addressa] = await walletClient.getAddresses();

      const UnsStake = await walletClient.writeContract({
        account: addressa,
        address: contract,
        abi: StakeERC20,
        functionName: 'unstake',
        args: [hexToBigInt(inputValue + "000000000000000000")]
      });

      notifyUnStake1()

      console.log("Reward claimed successfully:", UnsStake);

    } catch (error) {
      toast.error(error.code || 'Transaction Failed  ');

      console.error("Error claiming reward:", error);

    }

    setclaimingUnSTake(false);

  };

    return (
        <div>

            <div><p>Admin Priviledges </p></div>
            approveAddress

            <p>Approve Address</p>

        </div>
    )

}

export default Products;