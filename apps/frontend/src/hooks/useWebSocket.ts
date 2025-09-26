'use client'

import { useState, useEffect, useRef } from 'react'

const WEBSOCKET_URL = process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'ws://localhost:3001'

export function useWebSocket(gameId?: string) {
  const [isConnected, setIsConnected] = useState(false)
  const [lastMessage, setLastMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  
  const websocket = useRef<WebSocket | null>(null)
  const reconnectAttempts = useRef(0)
  const maxReconnectAttempts = 5
  const reconnectDelay = useRef(1000)

  const connect = () => {
    try {
      // For demo purposes, we'll simulate WebSocket connection
      // In production, this would connect to the actual WebSocket API Gateway
      console.log('Attempting WebSocket connection to:', WEBSOCKET_URL)
      
      // Simulate successful connection
      setIsConnected(true)
      setError(null)
      reconnectAttempts.current = 0
      reconnectDelay.current = 1000

      // Simulate subscribing to game updates
      if (gameId) {
        console.log('Subscribing to game updates for:', gameId)
        
        // Simulate periodic updates
        const interval = setInterval(() => {
          if (isConnected) {
            setLastMessage(JSON.stringify({
              type: 'STATS_UPDATE',
              gameId,
              timestamp: new Date().toISOString(),
              data: {
                // Simulated update data
                update: 'stats_updated'
              }
            }))
          }
        }, 10000) // Every 10 seconds

        return () => clearInterval(interval)
      }

    } catch (err) {
      console.error('WebSocket connection failed:', err)
      setError('Connection failed')
      setIsConnected(false)
      
      // Attempt reconnection
      if (reconnectAttempts.current < maxReconnectAttempts) {
        reconnectAttempts.current++
        setTimeout(() => {
          console.log(`Reconnection attempt ${reconnectAttempts.current}`)
          connect()
        }, reconnectDelay.current)
        
        // Exponential backoff
        reconnectDelay.current = Math.min(reconnectDelay.current * 2, 30000)
      }
    }
  }

  const disconnect = () => {
    if (websocket.current) {
      websocket.current.close()
      websocket.current = null
    }
    setIsConnected(false)
  }

  const sendMessage = (message: any) => {
    if (isConnected && websocket.current) {
      websocket.current.send(JSON.stringify(message))
    } else {
      console.warn('WebSocket not connected, cannot send message:', message)
    }
  }

  useEffect(() => {
    connect()
    
    return () => {
      disconnect()
    }
  }, [gameId])

  // Ping to keep connection alive
  useEffect(() => {
    if (!isConnected) return

    const pingInterval = setInterval(() => {
      sendMessage({ type: 'ping' })
    }, 30000) // Every 30 seconds

    return () => clearInterval(pingInterval)
  }, [isConnected])

  return {
    isConnected,
    lastMessage,
    error,
    sendMessage,
    reconnect: connect,
  }
}

export default useWebSocket