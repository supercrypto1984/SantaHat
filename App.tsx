import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface NFTMetadata {
  id: number;
  attributes: {
    Body: string;
    Head: string;
    Eyes: string;
    Earring: string;
    Count: number;
  };
  rarityScore: number;
  rank: number;
  inscription: number;
  block: number;
  size: string;
  sat: number;
  inscriptionId: string;
}

const App: React.FC = () => {
  const [metadata, setMetadata] = useState<NFTMetadata[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNFT, setSelectedNFT] = useState<NFTMetadata | null>(null);
  const [bgColor, setBgColor] = useState('transparent');
  const [customColor, setCustomColor] = useState('#000000');

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/supercrypto1984/SantaHat/main/metadata.json')
      .then(response => response.json())
      .then(data => setMetadata(data));
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const nft = metadata.find(item => 
      item.id.toString() === searchTerm || 
      item.inscription.toString() === searchTerm
    );
    setSelectedNFT(nft || null);
  };

  const handleColorChange = (color: string) => {
    setBgColor(color);
  };

  const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomColor(e.target.value);
    setBgColor(e.target.value);
  };

  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: bgColor === 'transparent' ? 'white' : bgColor }}>
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">Christmas Nodemonkes</h1>
        <form onSubmit={handleSearch} className="mb-6 flex gap-2">
          <Input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Enter ID or Inscription number"
            className="flex-grow"
          />
          <Button type="submit">Search</Button>
        </form>
        
        <div className="mb-6 flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Background Color <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleColorChange('transparent')}>
                No Background
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleColorChange('rgb(16, 56, 59)')}>
                Christmas Green
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleColorChange(customColor)}>
                Custom Color
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Input
            type="color"
            value={customColor}
            onChange={handleCustomColorChange}
            className="w-10 h-10 p-1 rounded"
          />
        </div>

        <div className="preview-box mb-6 border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center" style={{ height: '300px', backgroundColor: bgColor === 'transparent' ? 'transparent' : bgColor }}>
          {selectedNFT ? (
            <img 
              src={`https://raw.githubusercontent.com/supercrypto1984/SantaHat/main/images/SantaHat/${selectedNFT.id}.png`} 
              alt={`NFT #${selectedNFT.id}`}
              className="pixelated"
              style={{ width: '280px', height: '280px' }}
            />
          ) : (
            <p className="text-gray-500">NFT preview will appear here</p>
          )}
        </div>

        {selectedNFT && (
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">NFT #{selectedNFT.id}</h2>
            <p>Inscription: {selectedNFT.inscription}</p>
            <p>Rarity Score: {selectedNFT.rarityScore}</p>
            <p>Rank: {selectedNFT.rank}</p>
            <Button 
              onClick={() => window.open(`https://raw.githubusercontent.com/supercrypto1984/SantaHat/main/images/SantaHat/${selectedNFT.id}.png`, '_blank')}
              className="mt-4"
            >
              Download Image
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;

