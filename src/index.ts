import { fetchEventSource, type EventSourceMessage, type FetchEventSourceInit } from "@microsoft/fetch-event-source";

function getSelfKey(key: string, type: string) {
  return `shared-persistent-connection:${key}:${type}`
}

type FetchEventSourceInitConfig = FetchEventSourceInit & {
  retryWhenError?: boolean
}

enum ConnectionState {
  Closed = 'closed',
  Connecting = 'connecting',
  Open = 'open',
}

export class SharedPersistentConnection {
  private isLeader: boolean = false
  private releaseLock: (() => void) | null = null
  private channel: BroadcastChannel
  private state: ConnectionState

  constructor(
    public readonly url: string,
    public readonly config: FetchEventSourceInitConfig
  ) {
    if (!navigator.locks || !window.BroadcastChannel) {
      throw new Error('SharedPersistentConnection is not supported in this browser')
    }

    this.channel = new BroadcastChannel(getSelfKey(this.url, 'channel'))

    this.channel.onmessage = (ev: MessageEvent<EventSourceMessage>) => {
      this.config.onmessage?.(ev.data)
    }

    this.state = ConnectionState.Connecting
    this.attemptToBeLeader()
  }

  private launch() {
    if (!this.isLeader) {
      return
    }
    fetchEventSource(this.url, {
      ...this.config,
      onmessage: (event) => {
        this.config.onmessage?.(event)
        this.channel.postMessage(event)
      },
      onopen: (response) => {
        this.state = ConnectionState.Open
        if (this.config.onopen) {
          return this.config.onopen?.(response)
        }
        return Promise.resolve()
      },
      onclose: () => {
        this.state = ConnectionState.Closed
        this.config.onclose?.()
      },
      onerror: (err) => {
        this.config.onerror?.(err)
        if (this.config.retryWhenError) {
          this.launch()
        }
      }
    })
  }

  private attemptToBeLeader() {
    const lockKey = getSelfKey(this.url, 'lock')
    navigator.locks.request(lockKey, async (lock) => {
      this.isLeader = true
      this.launch()

      await new Promise<void>(resolve => {
        this.releaseLock = resolve
      })

      this.isLeader = false
    })
  }

  public close() {
    if (this.state === ConnectionState.Closed) {
      return
    }
    this.releaseLock?.()
    this.channel.close()
    this.state = ConnectionState.Closed
  }
}