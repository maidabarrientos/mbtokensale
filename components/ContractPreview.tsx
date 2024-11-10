"use client";

import { TokenFormValues } from "./TokenSaleBuilder/types";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { SUPPORTED_TOKENS, SUPPORTED_NETWORKS } from "@/lib/constants";

interface ContractPreviewProps {
  config: TokenFormValues;
}

export function ContractPreview({ config }: ContractPreviewProps) {
  const { toast } = useToast();
  const [downloading, setDownloading] = useState(false);

  const generateContract = () => {
    setDownloading(true);
    
    const blob = new Blob([contractCode], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${config.name.replace(/\s+/g, '')}.sol`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    setTimeout(() => {
      setDownloading(false);
      toast({
        title: "Contract Generated",
        description: "Your smart contract has been downloaded successfully.",
      });
    }, 1000);
  };

  const getTokenAddresses = () => {
    return config.acceptedTokens
      .map(symbol => {
        const token = SUPPORTED_TOKENS.find(t => t.symbol === symbol);
        if (symbol === 'ETH') {
          return `        // Native ETH is handled separately`;
        }
        return SUPPORTED_NETWORKS.map(network => {
          const address = config.tokenAddresses?.[symbol]?.[network.id];
          return address ?
            `        // ${token?.name} on ${network.name}\n        tokenAddresses[${network.chainId}][${address}] = true;` :
            `        // ${token?.name} address for ${network.name} will be set after deployment`;
        }).join('\n');
      })
      .join('\n');
  };

  const contractCode = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
${config.enableBridge ? 'import "@openzeppelin/contracts/crosschain/CrossChainEnabled.sol";' : ''}

contract ${config.name.replace(/\s+/g, '')} is ERC20, ERC20Permit, ERC20Votes, Ownable, ReentrancyGuard${config.enableBridge ? ', CrossChainEnabled' : ''} {
    uint256 public rate = ${config.rate};
    uint256 public softCap = ${config.softCap} ether;
    uint256 public hardCap = ${config.hardCap} ether;
    uint256 public maxPurchase = ${config.maxPurchase};
    ${config.enableVesting ? `uint256 public vestingPeriod = ${config.vestingPeriod} days;` : ''}
    
    mapping(address => bool) public whitelist;
    mapping(address => uint256) public vestingSchedule;
    mapping(address => uint256) public totalPurchased;
    
    // Multi-chain token addresses
    mapping(uint256 => mapping(address => bool)) public tokenAddresses;
    
    bool public saleActive = false;
    ${config.enableWhitelist ? 'bool public whitelistOnly = true;' : ''}
    
    event TokensPurchased(
        address indexed buyer,
        uint256 amount,
        address paymentToken,
        uint256 chainId
    );
    
    constructor()
        ERC20("${config.name}", "${config.symbol}")
        ERC20Permit("${config.name}")
        Ownable(msg.sender)
    {
        _mint(msg.sender, ${config.totalSupply} * 10 ** decimals());
        
        // Initialize accepted tokens for each chain
${getTokenAddresses()}
    }

    function setTokenAddress(uint256 chainId, address token, bool accepted) external onlyOwner {
        tokenAddresses[chainId][token] = accepted;
    }

    receive() external payable {
        require(msg.value > 0, "Invalid amount");
        buyTokensWithEth();
    }

    function buyTokensWithEth() public payable nonReentrant {
        require(saleActive, "Sale not active");
        ${config.enableWhitelist ? 'require(!whitelistOnly || whitelist[msg.sender], "Not whitelisted");' : ''}
        require(msg.value > 0, "Invalid amount");
        
        uint256 tokens = msg.value * rate;
        require(balanceOf(owner()) >= tokens, "Insufficient tokens");
        require(totalPurchased[msg.sender] + tokens <= maxPurchase, "Exceeds max purchase");
        
        ${config.enableVesting ? 'vestingSchedule[msg.sender] = block.timestamp + vestingPeriod;' : ''}
        totalPurchased[msg.sender] += tokens;
        
        _transfer(owner(), msg.sender, tokens);
        
        emit TokensPurchased(msg.sender, tokens, address(0), block.chainid);
    }

    function buyTokens(address paymentToken, uint256 amount) external nonReentrant {
        require(saleActive, "Sale not active");
        ${config.enableWhitelist ? 'require(!whitelistOnly || whitelist[msg.sender], "Not whitelisted");' : ''}
        require(tokenAddresses[block.chainid][paymentToken], "Token not accepted on this chain");
        require(amount > 0, "Invalid amount");
        
        uint256 tokens = amount * rate;
        require(balanceOf(owner()) >= tokens, "Insufficient tokens");
        require(totalPurchased[msg.sender] + tokens <= maxPurchase, "Exceeds max purchase");
        
        ${config.enableVesting ? 'vestingSchedule[msg.sender] = block.timestamp + vestingPeriod;' : ''}
        totalPurchased[msg.sender] += tokens;
        
        require(IERC20(paymentToken).transferFrom(msg.sender, address(this), amount), "Transfer failed");
        _transfer(owner(), msg.sender, tokens);
        
        emit TokensPurchased(msg.sender, tokens, paymentToken, block.chainid);
    }

    // Rest of the contract implementation...
}`;

  return (
    <div className="space-y-4">
      <div className="bg-muted p-4 rounded-lg">
        <h3 className="font-semibold mb-2">Contract Configuration</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>Name: {config.name}</div>
          <div>Symbol: {config.symbol}</div>
          <div>Decimals: {config.decimals}</div>
          <div>Total Supply: {config.totalSupply}</div>
          <div>Rate: {config.rate}</div>
          <div>Accepted Tokens: {config.acceptedTokens.join(', ')}</div>
          {config.acceptedTokens.map(symbol => (
            symbol !== 'ETH' && Object.entries(config.tokenAddresses[symbol] || {}).map(([networkId, address]) => (
              <div key={`${symbol}-${networkId}`}>
                {symbol} on {SUPPORTED_NETWORKS.find(n => n.id === networkId)?.name}: {address}
              </div>
            ))
          ))}
        </div>
      </div>

      <ScrollArea className="h-[400px] w-full rounded-md border p-4">
        <pre className="text-sm">{contractCode}</pre>
      </ScrollArea>

      <div className="flex justify-end gap-2">
        <Button onClick={generateContract} disabled={downloading}>
          {downloading ? "Generating..." : "Download Contract"}
        </Button>
      </div>
    </div>
  );
}