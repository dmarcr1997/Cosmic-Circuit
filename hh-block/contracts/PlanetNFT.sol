// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";


contract PlanetNFT is ERC721 {
    uint256 private _nextTokenId;

    struct Planet {
        string name;
        uint256 randomSeed;
        string[] elements;
        string[] lifeTypes;
    }

    mapping(uint256 => Planet) public planets;

    constructor() ERC721("PlanetNFT", "PLNT") {}

    function mint(
        string memory _name,
        string[] memory _elements,
        string[] memory _lifeTypes
    ) public returns (uint256) {
        uint256 tokenId = _nextTokenId++;
        
        // Generate random seed using block information
        uint256 randomSeed = uint256(
            keccak256(
                abi.encodePacked(
                    block.timestamp,
                    block.prevrandao,
                    msg.sender,
                    tokenId
                )
            )
        );

        // Create new planet
        planets[tokenId] = Planet({
            name: _name,
            randomSeed: randomSeed,
            elements: _elements,
            lifeTypes: _lifeTypes
        });

        _safeMint(msg.sender, tokenId);
        
        return tokenId;
    }

    function getPlanet(uint256 tokenId) public view returns (
        string memory name,
        uint256 randomSeed,
        string[] memory elements,
        string[] memory lifeTypes
    ) {
        require(ownerOf(tokenId) != address(0), "Planet does not exist");

        Planet memory planet = planets[tokenId];
        return (
            planet.name,
            planet.randomSeed,
            planet.elements,
            planet.lifeTypes
        );
    }
}