import { useState, useEffect, useRef } from "react"
import { Mic, MicOff } from "lucide-react"

interface TestAgentPanelProps {
  agentId: string
}

export function TestAgentPanel({ agentId }: TestAgentPanelProps) {
  const [isReady, setIsReady] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [micPermission, setMicPermission] = useState<boolean | null>(null)
  const [isRequesting, setIsRequesting] = useState(false)
  const wsRef = useRef<WebSocket | null>(null)
  const mediaStreamRef = useRef<MediaStream | null>(null)

  useEffect(() => {
    checkMicrophonePermission()
    return () => {
      // Cleanup on unmount
      if (wsRef.current) {
        wsRef.current.close()
      }
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

  const checkMicrophonePermission = async () => {
    try {
      const result = await navigator.permissions.query({ name: "microphone" as PermissionName })
      setMicPermission(result.state === "granted")
      setIsReady(result.state === "granted")

      result.addEventListener("change", () => {
        setMicPermission(result.state === "granted")
        setIsReady(result.state === "granted")
      })
    } catch (error) {
      console.error("[v0] Error checking microphone permission:", error)
      setMicPermission(null)
    }
  }



  const requestMicrophoneAccess = async () => {
    setIsRequesting(true)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      stream.getTracks().forEach((track) => track.stop())
      setMicPermission(true)
      setIsReady(true)
    } catch (error) {
      console.error("[v0] Error requesting microphone access:", error)
      setMicPermission(false)
      setIsReady(false)
    } finally {
      setIsRequesting(false)
    }
  }

  const startConversation = async () => {
    if (!isReady || isConnected) return

    try {
      // Get microphone stream
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaStreamRef.current = stream

      // Connect to ElevenLabs WebSocket
      const ws = new WebSocket(`wss://api.elevenlabs.io/v1/convai/conversation?agent_id=${agentId}`)
      wsRef.current = ws

      ws.onopen = () => {
        console.log("[v0] Connected to ElevenLabs agent")
        setIsConnected(true)
      }

      ws.onmessage = (event) => {
        console.log("[v0] Received message from agent:", event.data)
        // Handle audio response from agent
      }

      ws.onerror = (error) => {
        console.error("[v0] WebSocket error:", error)
        setIsConnected(false)
      }

      ws.onclose = () => {
        console.log("[v0] Disconnected from agent")
        setIsConnected(false)
        if (mediaStreamRef.current) {
          mediaStreamRef.current.getTracks().forEach((track) => track.stop())
        }
      }

      // Send audio data to WebSocket
      const audioContext = new AudioContext()
      const source = audioContext.createMediaStreamSource(stream)
      const processor = audioContext.createScriptProcessor(4096, 1, 1)

      source.connect(processor)
      processor.connect(audioContext.destination)

      processor.onaudioprocess = (e) => {
        if (ws.readyState === WebSocket.OPEN) {
          const audioData = e.inputBuffer.getChannelData(0)
          ws.send(audioData)
        }
      }
    } catch (error) {
      console.error("[v0] Error starting conversation:", error)
      setIsConnected(false)
    }
  }

  const stopConversation = () => {
    if (wsRef.current) {
      wsRef.current.close()
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop())
    }
    setIsConnected(false)
  }

  return (
    <div className="w-96 bg-card border-l border-border p-6 space-y-6 flex flex-col">
      <div>
        <h3 className="text-lg font-semibold mb-1">Test Your Agent</h3>
        <p className="text-sm text-muted-foreground">Click the microphone to start a conversation</p>
      </div>

      {micPermission === false && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
          <div className="flex items-start gap-3 mb-3">
            <MicOff className="w-5 h-5 text-destructive mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-destructive">Microphone Access Required</h4>
              <p className="text-xs text-destructive/80 mt-1">Please allow microphone access to test the voice agent</p>
            </div>
          </div>
          <button
            onClick={requestMicrophoneAccess}
            disabled={isRequesting}
            className="w-full px-4 py-2 bg-destructive text-destructive-foreground rounded-lg text-sm font-medium hover:bg-destructive/90 disabled:opacity-50"
          >
            {isRequesting ? "Requesting..." : "Allow Microphone Access"}
          </button>
        </div>
      )}

      <div className="flex-1 flex flex-col items-center justify-center">
        <button
          onClick={isConnected ? stopConversation : startConversation}
          disabled={!isReady}
          className={`w-32 h-32 rounded-full flex items-center justify-center transition-all ${
            isConnected
              ? "bg-destructive/20 hover:bg-destructive/30"
              : isReady
                ? "bg-primary/10 hover:bg-primary/20 cursor-pointer"
                : "bg-muted cursor-not-allowed"
          }`}
        >
          <Mic
            className={`w-16 h-16 ${isConnected ? "text-destructive" : isReady ? "text-primary" : "text-muted-foreground"}`}
          />
        </button>
        <div className="mt-4 flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${isConnected ? "bg-destructive animate-pulse" : isReady ? "bg-primary" : "bg-muted-foreground"}`}
          />
          <span className="text-sm text-muted-foreground">
            {isConnected ? "Connected" : isReady ? "Ready" : "Not Ready"}
          </span>
        </div>
      </div>
    </div>
  )
}
