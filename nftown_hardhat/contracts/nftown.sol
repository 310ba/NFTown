// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

error nftown_ETHNotEnough();

contract nftown is ERC721URIStorage {

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    event NftMinted(uint256 indexed tokenId);

    constructor() ERC721("NFTOWN","310") ERC721URIStorage() {
        //ERC721URIStorage继承了erc721所以要给erc721构造函数
    }

    function mintNft(string calldata tokenURI,address mintTo) public payable{
        if(msg.value < 1000000000000000){
            revert nftown_ETHNotEnough();
        }
        uint256 tokenId = _tokenIds.current();
        _safeMint(mintTo, tokenId);
        _setTokenURI(tokenId,tokenURI);
        _tokenIds.increment();
        // emit DogMinted(s_tokenCounter);
    }

    // tokenURI(uint256 tokenId) from ERC721URIStorage
}
