export const ConsumerABI = [
	{
		"inputs": [
			{
				"internalType": "contract ISupraSValueFeed",
				"name": "_sValueFeed",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "pair_id_1",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "pair_id_2",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "operation",
				"type": "uint256"
			}
		],
		"name": "getDerivedValueOfPair",
		"outputs": [
			{
				"components": [
					{
						"internalType": "int256",
						"name": "roundDifference",
						"type": "int256"
					},
					{
						"internalType": "uint256",
						"name": "derivedPrice",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "decimals",
						"type": "uint256"
					}
				],
				"internalType": "struct ISupraSValueFeed.derivedData",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_priceIndex",
				"type": "uint256"
			}
		],
		"name": "getPrice",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "round",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "decimals",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "time",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "price",
						"type": "uint256"
					}
				],
				"internalType": "struct ISupraSValueFeed.priceFeed",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256[]",
				"name": "_pairIndexes",
				"type": "uint256[]"
			}
		],
		"name": "getPriceForMultiplePair",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "round",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "decimals",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "time",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "price",
						"type": "uint256"
					}
				],
				"internalType": "struct ISupraSValueFeed.priceFeed[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getSupraSvalueFeed",
		"outputs": [
			{
				"internalType": "contract ISupraSValueFeed",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "contract ISupraSValueFeed",
				"name": "_newSValueFeed",
				"type": "address"
			}
		],
		"name": "updateSupraSvalueFeed",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]