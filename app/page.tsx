'use client'

import { useState, useEffect } from 'react'
import './globals.css'

interface NFTMetadata {
  id: number
  inscription: number
  rarityScore: number
  rank: number
}

export default function Page() {
  const [metadata, setMetadata] = useState<NFTMetadata[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedNFT, setSelectedNFT] = useState<NFTMetadata | null>(null)
  const [bgColor, setBgColor] = useState('white')
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/supercrypto1984/SantaHat/main/metadata.json')
      .then(res => res.json())
      .then(setMetadata)
      .catch(() => setError('Failed to load metadata'))
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const nft = metadata.find(item => 
      item.id.toString() === searchTerm || 
      item.inscription.toString() === searchTerm
    )
    if (nft) {
      setSelectedNFT(nft)
      setError('')
    } else {
      setError('NFT not found')
      setSelectedNFT(null)
    }
  }

  const handleDownload = async (id: number) => {
    try {
      const response = await fetch(`/SantaHat/images/${id}.png`)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `santahat-${id}.png`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      setError('Failed to download image')
    }
  }

  const handleRandom = () => {
    if (metadata.length > 0) {
      const randomNFT = metadata[Math.floor(Math.random() * metadata.length)]
      setSearchTerm(randomNFT.id.toString())
      setSelectedNFT(randomNFT)
      setError('')
    }
  }

  return (
    <div style={{ backgroundColor: bgColor }} className="min-h-screen p-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-center mb-4">Christmas Nodemonkes</h1>
        
        <form onSubmit={handleSearch} className="flex gap-2 mb-4">
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Enter ID or Inscription number"
            className="flex-1 border rounded px-3 py-2"
          />
          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
            Search
          </button>
        </form>

        <div className="flex justify-between mb-4">
          <select 
            onChange={e => setBgColor(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="white">White</option>
            <option value="rgb(16, 56, 59)">Christmas Green</option>
            <option value="#000000">Black</option>
          </select>
          <button 
            onClick={handleRandom}
            className="px-4 py-1 border rounded hover:bg-gray-100"
          >
            Random
          </button>
        </div>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {selectedNFT && (
          <div className="text-center">
            <div 
              className="relative bg-transparent mb-4 mx-auto"
              style={{ height: '280px', width: '280px' }}
            >
              <img 
                src={`/SantaHat/images/${selectedNFT.id}.png`}
                alt={`NFT #${selectedNFT.id}`}
                className="pixelated w-full h-full object-contain"
                onError={() => setError('Failed to load image')}
              />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">NFT #{selectedNFT.id}</h2>
              <p>Inscription: {selectedNFT.inscription}</p>
              <p>Rarity Score: {selectedNFT.rarityScore}</p>
              <p>Rank: {selectedNFT.rank}</p>
              <button
                onClick={() => handleDownload(selectedNFT.id)}
                className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
              >
                Download
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

