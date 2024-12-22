import React, { useState, useEffect } from 'react';
import { ChevronDown, Search, RefreshCw, Download } from 'lucide-react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast, Toaster } from 'react-hot-toast';

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
  const [isLoading, setIsLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/supercrypto1984/SantaHat/main/metadata.json')
      .then(response => response.json())
      .then(data => setMetadata(data))
      .catch(() => toast.error('Failed to load metadata'));
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setImageError(false);

    const nft = metadata.find(item => 
      item.id.toString() === searchTerm || 
      item.inscription.toString() === searchTerm
    );

    if (nft) {
      setSelectedNFT(nft);
    } else {
      toast.error('NFT not found');
      setSelectedNFT(null);
    }
    setIsLoading(false);
  };

  const getImageUrl = (id: number) => {
    return `https://raw.githubusercontent.com/supercrypto1984/SantaHat/main/images/${id}.png`;
  };

  const handleImageError = () => {
    setImageError(true);
    toast.error('Failed to load image');
  };

  const handleDownload = async (id: number) => {
    try {
      const response = await fetch(getImageUrl(id));
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `santahat-${id}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      toast.error('Failed to download image');
    }
  };

  const handleRandomNFT = () => {
    if (metadata.length > 0) {
      const randomIndex = Math.floor(Math.random() * metadata.length);
      setSearchTerm(metadata[randomIndex].id.toString());
      setSelectedNFT(metadata[randomIndex]);
      setImageError(false);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8" style={{ backgroundColor: bgColor === 'transparent' ? 'white' : bgColor }}>
      <Toaster />
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
          <Button type="submit" disabled={isLoading}>
            {isLoading ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
            Search
          </Button>
        </form>
        
        <div className="flex justify-between items-center mb-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Background <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setBgColor('transparent')}>
                No Background
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setBgColor('rgb(16, 56, 59)')}>
                Christmas Green
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setBgColor('white')}>
                White
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Input
                  type="color"
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-full"
                />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button onClick={handleRandomNFT} variant="outline">Random NFT</Button>
        </div>

        {selectedNFT && (
          <div className="text-center">
            <div 
              className="relative bg-gray-100 p-4 rounded-lg mb-4 mx-auto"
              style={{ 
                height: '280px', 
                width: '280px',
                backgroundColor: bgColor === 'transparent' ? 'transparent' : bgColor 
              }}
            >
              {!imageError && (
                <img 
                  src={getImageUrl(selectedNFT.id)}
                  alt={`NFT #${selectedNFT.id}`}
                  onError={handleImageError}
                  className="pixelated w-full h-full object-contain"
                />
              )}
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">NFT #{selectedNFT.id}</h2>
              <p>Inscription: {selectedNFT.inscription}</p>
              <p>Rarity Score: {selectedNFT.rarityScore}</p>
              <p>Rank: {selectedNFT.rank}</p>
              <div className="flex justify-center gap-2 mt-4">
                <Button 
                  onClick={() => handleDownload(selectedNFT.id)}
                  disabled={imageError}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;

