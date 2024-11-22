// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract World {
    mapping(address => mapping(uint256 => address)) public tokenOwners;
    event PlanetImported(address indexed planet, uint256 indexed tokenId);
    event PlanetExported(address indexed planet, uint256 indexed tokenId);
    // lets create a function called create planet which will transferfrom the PlanetNFT to this contract
    function importPlanet(address planet, uint256 tokenId) public {
        require(
            IERC721(planet).ownerOf(tokenId) == msg.sender,
            "Not the owner of this planet"
        );
        // Transfer the NFT from the sender to this contract
        IERC721(planet).transferFrom(msg.sender, address(this), tokenId);
        tokenOwners[planet][tokenId] = msg.sender;
        emit PlanetImported(planet, tokenId);
    }

    function exportPlanet(address planet, uint256 tokenId) public {
        require(tokenOwners[planet][tokenId] == msg.sender, "You are not the owner of this planet");
        IERC721(planet).transferFrom(address(this), tokenOwners[planet][tokenId], tokenId);
        delete tokenOwners[planet][tokenId];
        emit PlanetExported(planet, tokenId);
    }

    function isImported(address planet, uint256 tokenId) public view returns (bool) {
        return tokenOwners[planet][tokenId] != address(0);
    }
}